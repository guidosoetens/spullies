var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
///<reference path="../../../pixi/pixi.js.d.ts"/>
var DrumRollGame;
(function (DrumRollGame) {
    var Point = /** @class */ (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.parseFromData = function (data) {
            return new Point(data["x"] * DrumRollGame.GRID_UNIT_SIZE, data["y"] * DrumRollGame.GRID_UNIT_SIZE);
        };
        Point.prototype.toPixi = function () {
            return new PIXI.Point(this.x, this.y);
        };
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        Point.prototype.equals = function (other) {
            return this.x == other.x && this.y == other.y;
        };
        Point.prototype.lengthSquared = function () {
            return this.x * this.x + this.y * this.y;
        };
        Point.prototype.length = function () {
            return Math.sqrt(this.lengthSquared());
        };
        Point.prototype.dot = function (other) {
            return this.x * other.x + this.y * other.y;
        };
        Point.prototype.cross = function (other) {
            return this.x * other.y - this.y * other.x;
        };
        Point.prototype.makePerpendicular = function () {
            var x = this.x;
            this.x = -this.y;
            this.y = x;
            return this;
        };
        Point.prototype.add = function (other) {
            this.x += other.x;
            this.y += other.y;
            return this;
        };
        Point.prototype.subtract = function (other) {
            this.x -= other.x;
            this.y -= other.y;
            return this;
        };
        Point.prototype.multiply = function (s) {
            this.x *= s;
            this.y *= s;
            return this;
        };
        Point.prototype.normalize = function (length) {
            if (length === void 0) { length = 1.0; }
            var len = this.length();
            if (len <= 0.00000001) {
                this.x = length;
                this.y = 0.0;
                return this;
            }
            else
                return this.multiply(length / len);
        };
        return Point;
    }());
    DrumRollGame.Point = Point;
})(DrumRollGame || (DrumRollGame = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
var DrumRollGame;
(function (DrumRollGame) {
    var Mat3 = /** @class */ (function () {
        function Mat3() {
            this.vals = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        }
        Mat3.makeRotation = function (angle, idx) {
            var result = new Mat3();
            var coords = [];
            for (var i = 0; i < 3; ++i) {
                if (idx == i)
                    continue;
                for (var j = 0; j < 3; ++j) {
                    if (idx == j)
                        continue;
                    coords.push(i * 3 + j);
                }
            }
            var cs = Math.cos(angle);
            var sn = Math.sin(angle) * (idx == 1 ? -1 : 1);
            result.vals[coords[0]] = cs;
            result.vals[coords[1]] = -sn;
            result.vals[coords[2]] = sn;
            result.vals[coords[3]] = cs;
            return result;
        };
        Mat3.makeRotateX = function (angle) {
            return Mat3.makeRotation(angle, 0);
        };
        Mat3.makeRotateY = function (angle) {
            return Mat3.makeRotation(angle, 1);
        };
        Mat3.makeRotateZ = function (angle) {
            return Mat3.makeRotation(angle, 2);
        };
        Mat3.prototype.multiply = function (other) {
            var result = new Mat3();
            for (var i = 0; i < 3; ++i) {
                for (var j = 0; j < 3; ++j) {
                    var val = 0;
                    for (var it = 0; it < 3; ++it)
                        val += this.vals[i * 3 + it] * other.vals[it * 3 + j];
                    result.vals[i * 3 + j] = val;
                }
            }
            return result;
        };
        return Mat3;
    }());
    DrumRollGame.Mat3 = Mat3;
})(DrumRollGame || (DrumRollGame = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Mat3.ts"/>
var DrumRollGame;
(function (DrumRollGame) {
    var Ball = /** @class */ (function (_super) {
        __extends(Ball, _super);
        function Ball() {
            var _this = _super.call(this) || this;
            _this.radius = 50;
            _this.tubeAngle = 0;
            _this.foo = 0;
            _this.jumpParam = 1;
            _this.mat = new DrumRollGame.Mat3();
            var tex = PIXI.Texture.fromImage('assets/planet.jpg');
            tex.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
            _this.shaderUniforms = {
                uTexture: { type: 'sampler2D', value: tex, textureData: { repeat: true } },
                uTextureSize: { type: 'vec2', value: { x: tex.orig.width, y: tex.orig.height } },
                uRotation: { type: 'mat3', value: [1, 0, 0, 0, 1, 0, 0, 0, 1] },
                uOffset: { type: 'vec2', value: [0, 0] }
            };
            _this.shadow = new PIXI.Graphics();
            _this.shadow.beginFill(0x0, 0.2);
            var rx = _this.radius * .5;
            var ry = rx * .3;
            _this.shadow.drawEllipse(0, 0, 2 * rx, 2 * ry);
            // this.shadow.y = this.radius - 0.5 * ry;
            // shadow.x = 0;
            // shadow.y = this.radius - 1.6 * ry;
            _this.addChild(_this.shadow);
            var shader = new PIXI.Filter(PIXI.loader.resources.vertexShader.data, PIXI.loader.resources.ballShader.data, _this.shaderUniforms);
            shader.blendMode = PIXI.BLEND_MODES.NORMAL_NPM;
            var verts = [-1, -1, 1, -1, 1, 1, -1, 1];
            _this.mesh = new PIXI.mesh.Mesh(null, verts);
            _this.mesh.y = 0;
            _this.mesh.scale.x = _this.radius;
            _this.mesh.scale.y = _this.radius;
            _this.mesh.filters = [shader];
            _this.addChild(_this.mesh);
            return _this;
        }
        Ball.prototype.update = function (dt) {
            // let r1 = Mat3.makeRotateX(dt * 2.0);
            // let r2 = Mat3.makeRotateZ(dt * 2.0 * this.rollSpeed);
            // this.mat = r2.multiply(r1).multiply(this.mat);
            this.foo += dt;
            this.foo -= Math.floor(this.foo);
            this.jumpParam = Math.min(1.0, this.jumpParam + dt / 1.0);
            var dir = new DrumRollGame.Point(Math.cos(this.tubeAngle - .5 * Math.PI), Math.sin(this.tubeAngle - .5 * Math.PI));
            var jump_effect = Math.sin(this.jumpParam / .8 * Math.PI); //Math.abs(Math.sin(this.jumpParam * 6.0)) * Math.pow(1 - this.jumpParam, 2.0);
            if (this.jumpParam > .8) {
                var t = (this.jumpParam - .8) / .2;
                jump_effect = .1 * Math.sin(t * 5.0) * (1 - t);
            }
            var jump_offset = this.radius * 5.0 * jump_effect;
            this.mesh.x = dir.x * jump_offset;
            this.mesh.y = dir.y * jump_offset;
            // this.mesh
            var vals = this.shaderUniforms.uRotation.value;
            for (var i = 0; i < 9; ++i)
                vals[i] = this.mat.vals[i];
            this.shadow.rotation = this.tubeAngle;
            this.shadow.alpha = 1.0 - jump_effect * 0.8;
            this.shadow.scale.x = this.shadow.scale.y = this.shadow.alpha;
            this.shadow.x = -dir.x * this.radius;
            this.shadow.y = -dir.y * this.radius;
        };
        Ball.prototype.jump = function () {
            if (this.jumpParam > .99)
                this.jumpParam = 0;
        };
        Ball.prototype.updateShader = function () {
            // let center = this.shaderUniforms.uCameraPosition.value;
            // center.x = this.levelContainer.x;
            // center.y = this.levelContainer.y;
            // let light = this.shaderUniforms.uRelativeLightPos.value;
            // light.x = (this.wizard.x + this.levelContainer.x) / APP_WIDTH;
            // light.y = (this.wizard.y + this.levelContainer.y) / APP_HEIGHT;
        };
        return Ball;
    }(PIXI.Container));
    DrumRollGame.Ball = Ball;
})(DrumRollGame || (DrumRollGame = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Mat3.ts"/>
///<reference path="Ball.ts"/>
var DrumRollGame;
(function (DrumRollGame) {
    var Cylinder = /** @class */ (function (_super) {
        __extends(Cylinder, _super);
        function Cylinder(ball, radius) {
            var _this = _super.call(this) || this;
            _this.angle = 0;
            _this.rollSideSpeed = 0;
            _this.rollForwardSpeed = 0;
            _this.wobble = 0;
            _this.offset = 0;
            _this.radius = radius;
            _this.ball = ball;
            var tex = PIXI.Texture.fromImage('assets/wood.jpg');
            tex.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
            _this.shaderUniforms = {
                uTexture: { type: 'sampler2D', value: tex, textureData: { repeat: true } },
                uRotation: { type: 'mat3', value: [1, 0, 0, 0, 1, 0, 0, 0, 1] },
                uDepth: { type: 'vec2', value: [0, 0] },
                uCenter: { type: 'vec2', value: [0, 0] }
            };
            // let geom  = new PIXI.mesh.Mesh()
            var shader = new PIXI.Filter(PIXI.loader.resources.vertexShader.data, PIXI.loader.resources.cylinderShader.data, _this.shaderUniforms);
            shader.blendMode = PIXI.BLEND_MODES.NORMAL_NPM;
            var verts = [-1, -1, 1, -1, 1, 1, -1, 1];
            _this.mesh = new PIXI.mesh.Mesh(null, verts);
            radius *= 1.0;
            _this.mesh.scale.x = radius;
            _this.mesh.scale.y = radius;
            _this.mesh.filters = [shader];
            _this.addChild(_this.mesh);
            _this.rotMatrix = new DrumRollGame.Mat3();
            return _this;
        }
        Cylinder.prototype.setup = function () {
            var p1 = this.mesh.toGlobal(new PIXI.Point(0, 0));
            var p2 = this.mesh.toGlobal(new PIXI.Point(1, 1));
            console.log(p2.x - p1.x, p2.y - p1.y);
        };
        Cylinder.prototype.update = function (dt, rollZ) {
            this.rollSideSpeed = .95 * this.rollSideSpeed + .05 * rollZ;
            var threshold = 1;
            if (this.rollSideSpeed < -threshold)
                this.rollSideSpeed = -threshold;
            if (this.rollSideSpeed > threshold)
                this.rollSideSpeed = threshold;
            var goalSpeed = 1.0 - .5 * Math.abs(this.rollSideSpeed) / threshold;
            this.rollForwardSpeed = .95 * this.rollForwardSpeed + .05 * goalSpeed;
            var calcRoll = dt * this.rollSideSpeed * 4.0;
            var ball_offset = this.radius - 1.5 * this.ball.radius;
            if (DrumRollGame.ROLL_DRUM_MODE) {
                var rotation = DrumRollGame.Mat3.makeRotateZ(DrumRollGame.ROLL_DRUM_MODE ? calcRoll : 0);
                this.rotMatrix = rotation.multiply(this.rotMatrix);
                this.ball.x = this.x;
                this.ball.y = this.y + ball_offset;
                this.ball.tubeAngle = 0;
            }
            else {
                //rotate ball:
                var pt = new DrumRollGame.Point(this.ball.x - this.x, this.ball.y - this.y);
                pt = pt.normalize(1);
                var ang = Math.atan2(pt.y, pt.x) - calcRoll;
                var dir = new DrumRollGame.Point(Math.cos(ang), Math.sin(ang));
                this.ball.x = this.x + dir.x * ball_offset;
                this.ball.y = this.y + dir.y * ball_offset;
                this.ball.tubeAngle = (ang - .5 * Math.PI);
            }
            var vals = this.shaderUniforms.uRotation.value;
            for (var i = 0; i < 9; ++i)
                vals[i] = this.rotMatrix.vals[i];
            var depthVals = this.shaderUniforms.uDepth.value;
            this.wobble = (this.wobble + dt / 10.0) % 1.0;
            depthVals[0] = (depthVals[0] + this.rollForwardSpeed * dt / 10.0) % 1.0;
            depthVals[1] = Math.sin(this.wobble * 2 * Math.PI);
            this.offset += dt / 10.0;
            var centerVals = this.shaderUniforms.uCenter.value;
            var angle = this.offset % (2.0 * Math.PI); // Math.sin(this.offset) * 2 * Math.PI;
            var offset = .5 * Math.sin(.53 * this.offset + 1.356);
            centerVals[0] = offset * Math.cos(angle);
            centerVals[1] = offset * Math.sin(angle);
            var ballRot = new DrumRollGame.Mat3();
            // ballRot = ballRot.multiply(Mat3.makeRotateZ(calcRoll * this.radius / this.ball.radius));
            ballRot = ballRot.multiply(DrumRollGame.Mat3.makeRotateZ(this.ball.tubeAngle));
            ballRot = ballRot.multiply(DrumRollGame.Mat3.makeRotateX(this.rollForwardSpeed * dt * 8.0));
            ballRot = ballRot.multiply(DrumRollGame.Mat3.makeRotateZ(-this.ball.tubeAngle));
            ballRot = ballRot.multiply(DrumRollGame.Mat3.makeRotateZ(calcRoll * this.radius / this.ball.radius));
            // ballRot = ballRot.multiply(Mat3.makeRotateZ(this.ball.tubeAngle));
            this.ball.mat = ballRot.multiply(this.ball.mat);
        };
        return Cylinder;
    }(PIXI.Container));
    DrumRollGame.Cylinder = Cylinder;
})(DrumRollGame || (DrumRollGame = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Ball.ts"/>
///<reference path="Cylinder.ts"/>
var DrumRollGame;
(function (DrumRollGame) {
    DrumRollGame.touchRad = 150.0;
    var Level = /** @class */ (function (_super) {
        __extends(Level, _super);
        function Level(w, h) {
            var _this = _super.call(this) || this;
            _this.railBuffer = [];
            _this.hasInput = false;
            _this.inputTime = 0;
            _this.rotationAngle = 0;
            _this.inputSource = new DrumRollGame.Point(0, 0);
            _this.inputLocation = new DrumRollGame.Point(0, 0);
            _this.inputDirection = new DrumRollGame.Point(0, 0);
            _this.graphics = new PIXI.Graphics();
            _this.graphics.beginFill(0x0, 1.0);
            _this.graphics.drawRect(0, 0, w, h);
            _this.addChild(_this.graphics);
            _this.debugText = new PIXI.Text(' ');
            _this.debugText.style.fontFamily = "courier";
            _this.debugText.style.fill = 0xffffff;
            _this.debugText.style.fontSize = 32;
            // this.addChild(this.debugText);
            _this.ball = new DrumRollGame.Ball();
            _this.ball.x = w / 2;
            _this.ball.y = h / 2 + w / 2 - 50;
            _this.cylinder = new DrumRollGame.Cylinder(_this.ball, w / 2);
            _this.cylinder.x = w / 2;
            _this.cylinder.y = h / 2;
            _this.addChild(_this.cylinder);
            _this.cylinder.setup();
            _this.addChild(_this.ball);
            return _this;
        }
        Level.prototype.updateRotation = function () {
            var clampedAng = this.rotationAngle;
            if (clampedAng < -.1)
                clampedAng += .1;
            else if (clampedAng > .1)
                clampedAng -= .1;
            else
                clampedAng = 0;
            this.railBuffer.push(clampedAng);
            this.rotationAngle = 0;
            while (this.railBuffer.length > 20)
                this.railBuffer.splice(0, 1);
            //average movement:
            this.rotationSpeed = 0.0;
            if (this.railBuffer.length > 0) {
                for (var _i = 0, _a = this.railBuffer; _i < _a.length; _i++) {
                    var ang = _a[_i];
                    this.rotationSpeed += ang;
                }
                this.rotationSpeed /= this.railBuffer.length;
            }
            if (Math.abs(this.rotationSpeed) < .1) {
                this.rotationSpeed = 0;
            }
            else {
                this.inputSource = this.inputLocation;
            }
        };
        Level.prototype.update = function (dt) {
            this.updateRotation();
            this.ball.update(dt);
            this.cylinder.update(dt, this.rotationSpeed);
            if (this.hasInput) {
                this.inputTime += dt;
            }
            // console.log(this.rotationSpeed);
            this.debugText.text = '' + this.cylinder.rollSideSpeed;
        };
        Level.prototype.touchDown = function (p) {
            this.hasInput = true;
            this.inputTime = 0;
            this.inputSource = p.clone();
            this.inputLocation = p.clone();
            this.inputDirection = new DrumRollGame.Point(1, 0);
            // console.log("down!");
        };
        Level.prototype.touchMove = function (p) {
            var inputDir = p.clone().subtract(this.inputLocation);
            var distanceFactor = DrumRollGame.clamp(inputDir.length() / 15.0);
            inputDir.normalize();
            this.inputLocation = p.clone();
            var currInputDir = this.inputDirection.clone();
            var angle = Math.acos(Math.max(-1, Math.min(1, currInputDir.dot(inputDir))));
            var angleFactor = DrumRollGame.clamp(3 * angle);
            if (currInputDir.clone().makePerpendicular().dot(inputDir) < 0)
                angleFactor = -angleFactor;
            // console.log(distanceFactor, angleFactor);
            // console.log("move!");
            this.rotationAngle += angleFactor * distanceFactor;
            this.inputDirection = inputDir;
            var toPt = this.inputLocation.clone().subtract(this.inputSource);
            if (toPt.length() > DrumRollGame.touchRad) {
                toPt.normalize(DrumRollGame.touchRad);
                this.inputSource = this.inputLocation.clone().subtract(toPt);
            }
        };
        Level.prototype.touchUp = function (p) {
            this.hasInput = false;
            this.rotationAngle = 0;
            this.railBuffer = [];
            // console.log("up!");
            if (p.clone().subtract(this.inputSource).length() < 10 && this.inputTime < .33) {
                this.ball.jump();
            }
        };
        return Level;
    }(PIXI.Container));
    DrumRollGame.Level = Level;
})(DrumRollGame || (DrumRollGame = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
var DrumRollGame;
(function (DrumRollGame) {
    DrumRollGame.APP_WIDTH = 800;
    DrumRollGame.APP_HEIGHT = 800;
    DrumRollGame.GRID_UNIT_SIZE = 25.0;
    DrumRollGame.BALL_RADIUS = .999 * DrumRollGame.GRID_UNIT_SIZE; //25.0;
    DrumRollGame.DEBUG_MODE = true;
    DrumRollGame.CTRL_PRESSED = false;
    DrumRollGame.ROLL_DRUM_MODE = true;
    function clamp(n, floor, ceil) {
        if (floor === void 0) { floor = 0; }
        if (ceil === void 0) { ceil = 1; }
        return Math.max(floor, Math.min(ceil, n));
    }
    DrumRollGame.clamp = clamp;
})(DrumRollGame || (DrumRollGame = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Level.ts"/>
///<reference path="Defs.ts"/>
var DrumRollGame;
(function (DrumRollGame) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(w, h) {
            var _this = _super.call(this) || this;
            _this.level = null;
            _this.size = new PIXI.Point(w, h);
            _this.btnGraphics = new PIXI.Graphics();
            _this.btnGraphics.x = w - 30;
            _this.btnGraphics.y = 30;
            // this.btnGraphics.alpha = 1.0;
            _this.addChild(_this.btnGraphics);
            _this.btnSelector = new PIXI.Graphics();
            _this.btnSelector.alpha = 1.0;
            _this.btnGraphics.addChild(_this.btnSelector);
            _this.buttonText = new PIXI.Text(' ');
            _this.buttonText.style.fontFamily = "courier";
            _this.buttonText.style.fill = 0xffffff;
            _this.buttonText.style.fontSize = 32;
            // this.addChild(this.buttonText);
            _this.updateButtonLayout();
            DrumRollGame.GLOBAL_SCENE = _this;
            _this.level = new DrumRollGame.Level(_this.size.x, _this.size.y);
            _this.addChildAt(_this.level, 0);
            return _this;
        }
        Game.prototype.update = function (dt) {
            if (this.level)
                this.level.update(dt);
        };
        Game.prototype.updateButtonLayout = function () {
            this.btnGraphics.clear();
            this.btnGraphics.lineStyle(4, 0xaaaaaa, 1);
            this.btnGraphics.beginFill(0x555555, 1);
            this.btnGraphics.drawCircle(0, 0, 20);
            this.btnGraphics.endFill();
            this.btnSelector.clear();
            this.btnSelector.lineStyle(0);
            this.btnSelector.beginFill(0xaaaaaa, 1);
            this.btnSelector.drawCircle(0, 0, 15);
            this.btnSelector.endFill();
            this.buttonText.text = '⚙';
            this.buttonText.x = this.btnGraphics.x - this.buttonText.width / 2;
            this.buttonText.y = this.btnGraphics.y - this.buttonText.height / 2;
        };
        Game.prototype.touchDown = function (p) {
            if (this.level)
                this.level.touchDown(p);
        };
        Game.prototype.touchMove = function (p) {
            if (this.level)
                this.level.touchMove(p);
        };
        Game.prototype.touchUp = function (p) {
            if (this.level)
                this.level.touchUp(p);
            var btnLoc = new DrumRollGame.Point(this.btnGraphics.x, this.btnGraphics.y);
            if (btnLoc.subtract(p).length() < 20) {
                this.buttonText.text = '⚙';
                this.btnSelector.visible = !this.btnSelector.visible;
                DrumRollGame.ROLL_DRUM_MODE = this.btnSelector.visible;
            }
        };
        Game.prototype.levelMade = function (obj) {
            //levelMade
        };
        Game.prototype.left = function () {
        };
        Game.prototype.right = function () {
        };
        Game.prototype.up = function () {
        };
        Game.prototype.down = function () {
        };
        Game.prototype.rotate = function () {
        };
        return Game;
    }(PIXI.Container));
    DrumRollGame.Game = Game;
})(DrumRollGame || (DrumRollGame = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="game/Game.ts"/>
///<reference path="game/Defs.ts"/>
var DrumRollGame;
(function (DrumRollGame) {
    var touchElementOLD = /** @class */ (function () {
        function touchElementOLD() {
        }
        return touchElementOLD;
    }());
    DrumRollGame.touchElementOLD = touchElementOLD;
    var GameContainer = /** @class */ (function (_super) {
        __extends(GameContainer, _super);
        function GameContainer() {
            var _this = _super.call(this, DrumRollGame.APP_WIDTH, DrumRollGame.APP_HEIGHT, { antialias: true, backgroundColor: 0x000000, transparent: false }) || this;
            _this.app_scale = 1.0; //0.85;
            _this.backgroundTexture = PIXI.Texture.fromImage('assets/background.jpg');
            _this.backgroundImage = new PIXI.Sprite(_this.backgroundTexture);
            _this.stage.addChild(_this.backgroundImage);
            _this.hasFocusTouch = false;
            return _this;
        }
        GameContainer.prototype.loadGame = function () {
            this.game = new DrumRollGame.Game(DrumRollGame.APP_WIDTH, DrumRollGame.APP_HEIGHT);
            this.stage.addChild(this.game);
            this.componentMask = new PIXI.Graphics();
            this.componentMask.beginFill(0xFFFFFF);
            this.componentMask.drawRect(0, 0, DrumRollGame.APP_WIDTH, DrumRollGame.APP_HEIGHT);
            this.componentMask.endFill();
            this.componentMask.isMask = true;
            this.game.mask = this.componentMask;
            this.game.pivot.x = .5 * DrumRollGame.APP_WIDTH;
            // this.game.position.x = APP_WIDTH;
            this.componentBoundary = new PIXI.Graphics();
            this.componentBoundary.clear();
            var thickness = [2, 1];
            var offset = [0, 0];
            var colors = [0x777777, 0xaaaaaa];
            for (var i = 0; i < 2; ++i) {
                var t = offset[i];
                this.componentBoundary.lineStyle(thickness[i], colors[i]);
                this.componentBoundary.drawRoundedRect(-t, -t, DrumRollGame.APP_WIDTH + 2 * t, DrumRollGame.APP_HEIGHT + 2 * t, 5 + t);
            }
            // this.stage.addChild(this.componentBoundary);
            this.componentBoundary.pivot.x = this.game.pivot.x = .5 * DrumRollGame.APP_WIDTH;
        };
        GameContainer.prototype.setup = function () {
            this.loadGame();
            this.ticker.add(this.update, this);
            this.stage.interactive = true;
            this.stage.on("pointerdown", this.pointerDown, this);
            this.stage.on("pointermove", this.pointerMove, this);
            this.stage.on("pointerupoutside", this.pointerUp, this);
            this.stage.on("pointercancel", this.pointerUp, this);
            this.stage.on("pointerup", this.pointerUp, this);
            this.stage.on("pointerout", this.pointerUp, this);
            this.touchPoints = [];
            this.debugText = new PIXI.Text('');
            this.debugText.x = 20;
            this.debugText.y = 10;
            this.debugText.style.fill = 0xffffff;
            this.debugText.style.fontSize = 12;
            this.game.addChild(this.debugText);
            this.debugGraphics = new PIXI.Graphics();
            this.game.addChild(this.debugGraphics);
            // this.game.loadLevel(PIXI.loader.resources['defaultLevel'].data);
        };
        GameContainer.prototype.keyUp = function (key) {
            console.log(key);
            switch (key) {
                case 17: //ctrl
                    DrumRollGame.CTRL_PRESSED = false;
                    break;
            }
        };
        GameContainer.prototype.keyDown = function (key) {
            console.log(key);
            switch (key) {
                case 37: //left
                    this.game.left();
                    break;
                case 38: //up
                    this.game.up();
                    break;
                case 39: //right
                    this.game.right();
                    break;
                case 40: //down
                    this.game.down();
                    break;
                case 32: //space
                    this.game.rotate();
                    break;
                case 17: //ctrl:
                    DrumRollGame.CTRL_PRESSED = true;
                    break;
            }
        };
        GameContainer.prototype.pointerDown = function (event) {
            for (var i = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }
            var pos = event.data.getLocalPosition(this.game);
            var touch = new touchElementOLD();
            touch.id = event.data.identifier;
            touch.currentX = pos.x;
            touch.currentY = pos.y;
            touch.originX = pos.x;
            touch.originY = pos.y;
            touch.timeAlive = 0;
            this.touchPoints.push(touch);
            if (this.touchPoints.length == 1) {
                this.hasFocusTouch = true;
                this.game.touchDown(new DrumRollGame.Point(pos.x, pos.y));
            }
        };
        GameContainer.prototype.pointerMove = function (event) {
            var pos = event.data.getLocalPosition(this.game);
            for (var i = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints[i].currentX = pos.x;
                    this.touchPoints[i].currentY = pos.y;
                }
            }
            if (this.hasFocusTouch && this.touchPoints[0].id == event.data.identifier)
                this.game.touchMove(new DrumRollGame.Point(pos.x, pos.y));
        };
        GameContainer.prototype.pointerUp = function (event) {
            if (this.hasFocusTouch && this.touchPoints[0].id == event.data.identifier) {
                this.hasFocusTouch = false;
                var pos = event.data.getLocalPosition(this.game);
                this.game.touchUp(new DrumRollGame.Point(pos.x, pos.y));
            }
            for (var i = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {
                    if (this.touchPoints[i].timeAlive < .3) {
                        var dy = event.data.getLocalPosition(this.game).y - this.touchPoints[i].originY;
                        if (dy < -5) {
                            // var double = this.touchPoints.length > 1;
                            // this.player.jump(double);
                        }
                    }
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }
        };
        GameContainer.prototype.resize = function (w, h) {
            if (!this.game)
                return;
            var bgScale = Math.max(w / 1280, h / 853);
            this.backgroundImage.scale.x = bgScale;
            this.backgroundImage.scale.y = bgScale;
            var resWidth = bgScale * 1280;
            var resHeight = bgScale * 853;
            this.backgroundImage.x = (w - resWidth) / 2;
            this.backgroundImage.y = (h - resHeight) / 2;
            this.game.x = (w - DrumRollGame.APP_WIDTH) / 2 + DrumRollGame.APP_WIDTH / 2;
            this.game.y = (h - DrumRollGame.APP_HEIGHT) / 2;
            // this.componentBoundary.x = w / 2;
            // this.componentBoundary.y = h / 2;
            this.componentBoundary.x = this.game.x;
            this.componentBoundary.y = this.game.y;
            this.componentMask.clear();
            this.componentMask.beginFill(0xffffff);
            this.componentMask.drawRect(this.game.x - DrumRollGame.APP_WIDTH / 2, this.game.y, DrumRollGame.APP_WIDTH, DrumRollGame.APP_HEIGHT);
            this.componentMask.endFill();
            this.renderer.resize(w, h);
            this.componentBoundary.scale.x = this.game.scale.x = this.app_scale;
            this.componentBoundary.scale.y = this.game.scale.y = this.app_scale;
        };
        GameContainer.prototype.update = function () {
            var dt = this.ticker.elapsedMS * .001;
            dt = Math.min(.033, dt);
            this.debugText.text = "FPS: " + Math.round(1.0 / dt);
            this.game.update(dt);
        };
        return GameContainer;
    }(PIXI.Application));
    DrumRollGame.GameContainer = GameContainer;
})(DrumRollGame || (DrumRollGame = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="GameContainer.ts"/>
///<reference path="game/Defs.ts"/>
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}
function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}
function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel /*= document.onmousewheel*/ = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}
function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel /*= document.onmousewheel*/ = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}
function fitApp(app) {
    var margin = 10; //30;
    var body = document.getElementById('body');
    body.style.width = window.innerWidth + "px";
    body.style.height = window.innerHeight + "px";
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    var contentDiv = document.getElementById("content");
    var p_width = window.innerWidth;
    var p_height = window.innerHeight;
    var p_ratio = p_width / p_height;
    var containerWidth = DrumRollGame.APP_WIDTH + 2 * margin;
    var containerHeight = DrumRollGame.APP_HEIGHT + 2 * margin;
    var containerInnerRatio = containerWidth / containerHeight;
    if (containerInnerRatio < p_ratio)
        containerWidth = containerHeight * p_ratio;
    else
        containerHeight = containerWidth / p_ratio;
    var scale = p_width / containerWidth;
    app.view.style.webkitTransform = app.view.style.transform = "matrix(" + scale + ", 0, 0, " + scale + ", 0, 0)";
    app.view.style.webkitTransformOrigin = app.view.style.transformOrigin = "0 0";
    app.resize(containerWidth, containerHeight);
}
document.addEventListener('contextmenu', function (event) { if (event.clientY < (window.innerHeight * .9)) {
    event.preventDefault();
} });
window.onload = function () {
    disableScroll();
    var app = new DrumRollGame.GameContainer();
    app.view.style.position = "absolute";
    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);
    PIXI.loader.add('vertexShader', 'assets/shaders/shader.vert');
    PIXI.loader.add('ballShader', 'assets/shaders/ballShader.frag');
    PIXI.loader.add('defaultLevel', 'levels/default.json');
    PIXI.loader.add('mechFont', 'assets/fonts/Ausweis.ttf');
    PIXI.loader.add('sphereTexture', 'assets/sphereTexture.jpeg');
    PIXI.loader.add('plainShader', 'assets/shaders/plainShader.frag');
    PIXI.loader.add('cylinderShader', 'assets/shaders/cylinderShader.frag');
    // PIXI.loader.add('oceanShader', 'assets/oceanShader.frag')
    //         .add('skyShader', 'assets/skyShader.frag')
    //         .add('ripples', 'assets/ripples.png');
    PIXI.loader.load(function (loader, resources) {
        app.setup();
        fitApp(app);
    });
    // fitApp(app);
    document.onresize = function () {
        fitApp(app);
    };
    window.onresize = function () {
        fitApp(app);
    };
    window.onkeydown = function (e) {
        app.keyDown(e.keyCode);
    };
    window.onkeyup = function (e) {
        app.keyUp(e.keyCode);
    };
    // window.onmousedown = (e) => {
    //     fitApp(app);
    // }
};
