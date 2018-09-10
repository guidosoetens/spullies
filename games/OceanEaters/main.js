var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
///<reference path="../../phaser/phaser.d.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var Ocean = /** @class */ (function () {
        function Ocean(game) {
            this.game = game;
            var group = game.add.group();
            this.sprite = game.make.sprite(0, 0);
            group.add(this.sprite);
            var ripplesSprite = game.make.sprite(0, 0, 'ripples');
            //init shader:
            this.shader = new Phaser.Filter(game, null, game.cache.getShader('oceanShader'));
            this.shader.uniforms.uTimeParam = { type: '1f', value: 0. };
            this.shader.uniforms.uResolution = { type: '2f', value: { x: 0, y: 0 } };
            this.shader.uniforms.uScreenSize = { type: '2f', value: { x: 0, y: 0 } };
            this.shader.uniforms.uPlayerPosition = { type: '2f', value: { x: 0, y: 0 } };
            this.shader.uniforms.uPlayerDirection = { type: '2f', value: { x: 0, y: 0 } };
            this.shader.uniforms.uPlayerAngle = { type: '1f', value: 0. };
            this.shader.uniforms.uTexture = { type: 'sampler2D', value: ripplesSprite.texture, textureData: { repeat: true } };
            this.sprite.filters = [this.shader];
            this.shaderTime = 0;
        }
        Ocean.prototype.resetLayout = function (x, y, w, h) {
            this.sprite.position.x = x;
            this.sprite.position.y = y;
            this.sprite.width = w;
            this.sprite.height = h;
            this.shader.setResolution(w, h);
        };
        Ocean.prototype.updateFrame = function (dt, pPos, pDir) {
            this.shaderTime = (this.shaderTime + dt / 10.0) % 1.0;
            this.shader.uniforms.uTimeParam.value = this.shaderTime;
            this.shader.uniforms.uResolution.value = { x: this.sprite.width, y: this.sprite.height };
            this.shader.uniforms.uScreenSize.value = { x: this.game.scale.width, y: this.game.scale.height };
            this.shader.uniforms.uPlayerPosition.value = { x: -pPos.y, y: pPos.x };
            this.shader.uniforms.uPlayerDirection.value = { x: Math.cos(pDir), y: Math.sin(pDir) };
            this.shader.uniforms.uPlayerAngle.value = pDir;
            this.shader.update();
        };
        return Ocean;
    }());
    OceanEaters.Ocean = Ocean;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../phaser/phaser.d.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var Sky = /** @class */ (function () {
        function Sky(game) {
            this.game = game;
            var group = game.add.group();
            this.sprite = game.make.sprite(0, 0);
            group.add(this.sprite);
            var skySprite = game.make.sprite(0, 0, 'sky');
            var mountainsSprite = game.make.sprite(0, 0, 'mountains');
            //init shader:
            this.shader = new Phaser.Filter(game, null, game.cache.getShader('skyShader'));
            this.shader.uniforms.uTimeParam = { type: '1f', value: 0. };
            this.shader.uniforms.uResolution = { type: '2f', value: { x: 0, y: 0 } };
            this.shader.uniforms.uScreenSize = { type: '2f', value: { x: 0, y: 0 } };
            this.shader.uniforms.uPlayerPosition = { type: '2f', value: { x: 0, y: 0 } };
            this.shader.uniforms.uPlayerDirection = { type: '2f', value: { x: 0, y: 0 } };
            this.shader.uniforms.uPlayerAngle = { type: '1f', value: 0. };
            this.shader.uniforms.uTexture = { type: 'sampler2D', value: skySprite.texture, textureData: { repeat: true } };
            this.shader.uniforms.uMountainsTexture = { type: 'sampler2D', value: mountainsSprite.texture, textureData: { repeat: true } };
            this.sprite.filters = [this.shader];
            this.shaderTime = 0;
        }
        Sky.prototype.resetLayout = function (x, y, w, h) {
            this.sprite.position.x = x;
            this.sprite.position.y = y;
            this.sprite.width = w;
            this.sprite.height = h;
            this.shader.setResolution(w, h);
        };
        Sky.prototype.updateFrame = function (dt, pPos, pDir) {
            this.shaderTime = (this.shaderTime + dt / 10.0) % 1.0;
            this.shader.uniforms.uTimeParam.value = this.shaderTime;
            this.shader.uniforms.uResolution.value = { x: this.sprite.width, y: this.sprite.height };
            this.shader.uniforms.uScreenSize.value = { x: this.game.scale.width, y: this.game.scale.height };
            this.shader.uniforms.uPlayerPosition.value = { x: -pPos.y, y: pPos.x };
            this.shader.uniforms.uPlayerDirection.value = { x: Math.cos(pDir), y: Math.sin(pDir) };
            this.shader.uniforms.uPlayerAngle.value = pDir;
            this.shader.update();
        };
        return Sky;
    }());
    OceanEaters.Sky = Sky;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../phaser/phaser.d.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var Player = /** @class */ (function () {
        function Player(game) {
            this.game = game;
            this.shadow = this.game.make.graphics(0, 0);
            this.shadow.beginFill(0x000, .2);
            this.shadow.drawEllipse(0, 0, 70, 50);
            this.shadow.endFill();
            this.group = game.add.group();
            this.group.add(this.shadow);
            this.surfboardSprite = game.make.sprite(0, 0, 'surfboard');
            this.surfboardSprite.anchor.x = 0.5;
            this.surfboardSprite.anchor.y = 0.5;
            this.surfboardSprite.scale.x = .8;
            this.surfboardSprite.scale.y = .15;
            this.group.add(this.surfboardSprite);
            this.surferSprite = game.make.sprite(0, 0, 'surfer');
            this.surferSprite.anchor.x = .5;
            this.surferSprite.anchor.y = 1.0;
            this.surferSprite.scale.x = .25;
            this.surferSprite.scale.y = .25;
            this.group.add(this.surferSprite);
            this.animIt = 0;
        }
        Player.prototype.resetLayout = function (x, y, w, h) {
            this.group.position.x = x;
            this.group.position.y = y;
        };
        Player.prototype.updateFrame = function (dt, pPos, pDir) {
            this.animIt = (this.animIt + dt) % 1.0;
            this.surfboardSprite.position.y = Math.sin(this.animIt * 2 * Math.PI) * 5;
            this.surferSprite.position.y = Math.sin((this.animIt + .05) * 2 * Math.PI) * 5;
            var shadowScale = 1. + .05 * Math.sin(this.animIt * 2 * Math.PI);
            this.shadow.position.y = this.surfboardSprite.position.y + 10;
            this.shadow.scale.x = shadowScale;
            this.shadow.scale.y = shadowScale;
        };
        return Player;
    }());
    OceanEaters.Player = Player;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../phaser/phaser.d.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var BadBuoy = /** @class */ (function () {
        function BadBuoy(game, x, y) {
            this.game = game;
            var clr = (x < .2 && y < .2) ? 0xff0000 : 0x0;
            this.graphics = this.game.add.graphics(0, 0);
            this.graphics.beginFill(clr, 1);
            this.graphics.drawEllipse(0, 0, 5, 5);
            this.graphics.endFill();
            this.position = new Phaser.Point(x, y);
        }
        BadBuoy.prototype.updateRender = function (x, y, s, alpha) {
            this.graphics.position.x = x;
            this.graphics.position.y = y;
            this.graphics.alpha = alpha;
            this.graphics.scale.x = s;
            this.graphics.scale.y = s;
        };
        BadBuoy.prototype.updateFrame = function (dt) {
        };
        return BadBuoy;
    }());
    OceanEaters.BadBuoy = BadBuoy;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Ocean.ts"/>
///<reference path="Sky.ts"/>
///<reference path="Player.ts"/>
///<reference path="BadBuoy.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var GameState = /** @class */ (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            return _super.call(this) || this;
        }
        GameState.prototype.preload = function () {
            //shaders:
            this.game.load.shader("oceanShader", 'assets/oceanShader.frag');
            this.game.load.shader("skyShader", 'assets/skyShader.frag');
            //images:
            this.game.load.image('ripples', "assets/ripples.png");
            this.game.load.image('sky', "assets/sky.jpg");
            this.game.load.image('mountains', "assets/mountains.png");
            this.game.load.image('surfer', "assets/turtle.png");
            this.game.load.image('surfboard', "assets/surfboard.png");
        };
        GameState.prototype.create = function () {
            this.game.input.touch.preventDefault = true;
            this.graphics = this.game.add.graphics(0, 0);
            this.elements = this.game.add.group();
            this.trackMouseDown = false;
            this.trackMouseTime = 0;
            this.trackMousePos = new Phaser.Point(0, 0);
            this.currentState = "";
            this.currentStateTimer = -1;
            this.moveVelocity = 0;
            this.fooString = "";
            this.sky = new OceanEaters.Sky(this.game);
            this.ocean = new OceanEaters.Ocean(this.game);
            this.player = new OceanEaters.Player(this.game);
            this.buoys = [];
            var reps = 5;
            for (var x = 0; x < reps; ++x) {
                for (var y = 0; y < reps; ++y) {
                    var buoy = new OceanEaters.BadBuoy(this.game, (x + 0.5) / reps, (y + 0.5) / reps);
                    buoy.index = this.buoys.length;
                    this.buoys.push(buoy);
                }
            }
            this.playerPos = new Phaser.Point(0, 0);
            this.playerDirection = .5 * Math.PI;
            this.debugGraphics = this.game.add.graphics(0, 0);
            this.game.scale.onSizeChange.add(this.updateLayout, this);
            this.updateLayout();
        };
        GameState.prototype.updateLayout = function () {
            var width = this.game.scale.width;
            var height = this.game.scale.height;
            this.ocean.resetLayout(0, .5 * height, width, .5 * height);
            this.sky.resetLayout(0, 0, width, .5 * height);
            this.player.resetLayout(.5 * width, (1. - 1. / 6.) * height, width, height);
        };
        GameState.prototype.update = function () {
            var dt = this.game.time.physicsElapsed;
            this.updateInput(dt);
            //update player location:
            if (this.trackMouseDown) {
                if (this.trackMousePos.x < .25 * this.game.scale.width) {
                    //move left:
                    this.playerDirection += dt * 1.;
                }
                else if (this.trackMousePos.x > .75 * this.game.scale.width) {
                    //move right:
                    this.playerDirection -= dt * 1.;
                }
            }
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
                this.playerDirection += dt * 2.;
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
                this.playerDirection -= dt * 2.;
            this.playerDirection %= 2 * Math.PI;
            var playerDirX = Math.cos(this.playerDirection);
            var playerDirY = Math.sin(this.playerDirection);
            var speedFactor = 0;
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
                speedFactor = 1;
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
                speedFactor = -1;
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
                speedFactor *= 5.0;
            var speed = dt * .05 * speedFactor;
            this.playerPos.x = (this.playerPos.x + speed * playerDirX) % 1.0;
            if (this.playerPos.x < 0.0)
                this.playerPos.x += 1.0;
            this.playerPos.y = (this.playerPos.y + speed * playerDirY) % 1.0;
            if (this.playerPos.y < 0.0)
                this.playerPos.y += 1.0;
            //draw debug graphics:
            var dbMargin = 20;
            var dbWidth = 200;
            this.debugGraphics.clear();
            var dbX = this.game.scale.width - dbWidth - dbMargin;
            this.debugGraphics.lineStyle(2, 0xffffff, 1);
            this.debugGraphics.drawRect(dbX, dbMargin, dbWidth, dbWidth);
            this.debugGraphics.lineStyle(0);
            this.debugGraphics.beginFill(0x00ff00, 1);
            this.debugGraphics.drawCircle(dbX + dbWidth * this.playerPos.x, dbMargin + dbWidth * (1 - this.playerPos.y), 10);
            this.debugGraphics.drawCircle(dbX + dbWidth * this.playerPos.x + 10 * playerDirX, dbMargin + dbWidth * (1 - this.playerPos.y) + 10 * -playerDirY, 5);
            this.debugGraphics.beginFill(0xff0000, 1);
            for (var i = 0; i < this.buoys.length; ++i) {
                var pos = this.buoys[i].position;
                this.debugGraphics.drawCircle(dbX + dbWidth * pos.x, dbMargin + dbWidth * (1 - pos.y), 10);
                this.game.debug.text("" + this.buoys[i].index, dbX + dbWidth * pos.x, dbMargin + dbWidth * (1 - pos.y));
            }
            this.debugGraphics.endFill();
            //update state:
            if (this.currentStateTimer > 0) {
                this.currentStateTimer -= dt;
            }
            else {
                this.currentState = "";
            }
            this.graphics.clear();
            this.graphics.beginFill(0xff0000, 1);
            this.graphics.drawRect(0, 0, this.game.width, this.game.height);
            var debugText = "" + dt;
            this.game.debug.text(debugText, 5, 15, "#ffffff");
            this.game.debug.text("STATE: " + this.currentState, 5, 30, "#ffffff");
            this.game.debug.text("MOVE VELOCITY: " + this.moveVelocity, 5, 45, "#ffffff");
            this.game.debug.text("ACTION: " + this.fooString, 5, 60, "#ffffff");
            this.game.debug.text("LOC_X: " + this.playerPos.x, 500, 15);
            this.game.debug.text("LOC_Y: " + this.playerPos.y, 500, 30);
            this.ocean.updateFrame(dt, this.playerPos, this.playerDirection);
            this.sky.updateFrame(dt, this.playerPos, this.playerDirection);
            this.player.updateFrame(dt, this.playerPos, this.playerDirection);
            for (var i = 0; i < this.buoys.length; ++i) {
                var oceanUv = this.getRelativeOceanPosition(this.buoys[i].position);
                var transUv = new Phaser.Point(oceanUv.x, oceanUv.y);
                var plane_scale = 0.05;
                //transUv.y /= 1.5; //in shader: xy.y *= 1.5
                transUv = transUv.multiply(1.0 / plane_scale, 1.0 / plane_scale);
                transUv.y = transUv.y / (transUv.y + 1); //deform Y
                transUv.x = (1 - transUv.y) * transUv.x; //deform X
                transUv.y /= 1.5; //in shader: xy.y *= 1.5
                transUv.x *= this.ocean.sprite.width;
                transUv.y *= this.ocean.sprite.height; //in shader: xy.y *= 1.5
                // transUv.x *= (1. - oceanUv.y);
                /*
                    float width = uResolution.x / 1500.0;
                    vec2 uv = vTextureCoord * uScreenSize / uResolution;
                    vec2 xy = uv - vec2(.5, .33333);
                    xy.y *= 1.5; //stretch y to make top coordinate xy.y = 1 (compensate for centerpoint = .333)


                    vec2 transUV;
                    transUV.y = -(1. + 1. / (xy.y - 1.0)); //vertical asymptote at uv.y = 1
                    transUV.x = xy.x / (1. - xy.y); //scale from 1 (at uv.y = 0, i.e. div one) to infinity (at uv.y = 1, i.e. div zero)
                    transUV *= 0.5;
                    transUV = rotate2D(transUV, uPlayerAngle);
                    transUV += uPlayerPosition;
                    transUV = vec2(transUV.y, transUV.x);
                    gl_FragColor = mix(texture2D(uTexture, fract(transUV)), vec4(.3, 1, .8, 1), pow(uv.y, 1.5));
                    if(length(xy) < .01)
                        gl_FragColor = vec4(0,0,0,1);
                */
                var playerPosX = this.player.group.position.x;
                var playerPosY = this.player.group.position.y;
                var x = playerPosX + transUv.x; //5. * oceanUv.x * this.game.scale.width;
                var y = playerPosY - transUv.y; // * this.game.scale.height;
                var scale = 1; //Math.max(0, 1 - 10 * oceanUv.y);
                var alpha = 1; //Math.min(1, 1 - 10. * oceanUv.y);
                this.buoys[i].updateRender(x, y, scale, alpha);
                this.buoys[i].updateFrame(dt);
                this.game.debug.text("" + this.buoys[i].index, x, y);
            }
        };
        GameState.prototype.getRelativeOceanPosition = function (p) {
            var toPosX = p.x - this.playerPos.x;
            var toPosY = p.y - this.playerPos.y;
            var playerDirX = Math.cos(this.playerDirection);
            var playerDirY = Math.sin(this.playerDirection);
            var closestDistance = 100;
            var v = 0;
            var u = 0;
            for (var i = 0; i < 3; ++i) {
                for (var j = 0; j < 3; ++j) {
                    var x = toPosX + i - 1;
                    var y = toPosY + j - 1;
                    var curr_v = playerDirX * x + playerDirY * y;
                    var curr_u = playerDirY * x - playerDirX * y;
                    if (curr_v > 0) {
                        var distance = Math.sqrt(curr_u * curr_u + curr_v * curr_v);
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            v = curr_v;
                            u = curr_u;
                        }
                    }
                }
            }
            return new Phaser.Point(u, v);
        };
        GameState.prototype.updateInput = function (dt) {
            // this.input.activePointer.isDown
            var mouseDown = this.input.activePointer.isDown;
            var mousePos = this.input.activePointer.position;
            if (mouseDown) {
                if (this.trackMouseDown) {
                    this.trackMouseTime += dt;
                }
                else {
                    //start tracking:
                    this.trackMouseDown = true;
                    this.trackMouseTime = 0;
                    this.trackMousePos.x = mousePos.x;
                    this.trackMousePos.y = mousePos.y;
                }
            }
            else {
                if (this.trackMouseDown) {
                    //mouse had been released...
                    var dy = mousePos.y - this.trackMousePos.y;
                    if (this.trackMouseTime < .5) {
                        if (dy > 3)
                            this.duck();
                        else if (dy < -3)
                            this.jump();
                    }
                    this.fooString = "Timez: " + this.trackMouseTime + ", Dy: " + dy;
                }
                //end tracking:
                this.trackMouseDown = false;
                this.trackMouseTime = 0;
                this.trackMousePos.x = 0;
                this.trackMousePos.y = 0;
            }
            var dx = 0;
            if (mouseDown) {
                dx = 2 * (mousePos.x / this.game.width - .5) * Math.pow(Math.min(1.0, this.trackMouseTime / .5), 2.0);
            }
            this.move(dx);
        };
        GameState.prototype.duck = function () {
            //update state:
            if (this.currentStateTimer <= 0) {
                this.currentState = "DUCK";
                this.currentStateTimer = 1.0;
            }
        };
        GameState.prototype.jump = function () {
            //update state:
            if (this.currentStateTimer <= 0) {
                this.currentState = "JUMP";
                this.currentStateTimer = 1.0;
            }
        };
        GameState.prototype.move = function (dir) {
            this.moveVelocity = dir;
        };
        GameState.prototype.tap = function () {
        };
        GameState.prototype.render = function () {
        };
        return GameState;
    }(Phaser.State));
    OceanEaters.GameState = GameState;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="GameState.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var SimpleGame = /** @class */ (function () {
        function SimpleGame(w, h) {
            this.game = new Phaser.Game(w, h, Phaser.AUTO, 'content');
            this.game.state.add("GameRunningState", OceanEaters.GameState, false);
            this.game.state.start("GameRunningState", true, true);
        }
        SimpleGame.prototype.resize = function (w, h) {
            this.game.scale.setGameSize(w, h);
        };
        return SimpleGame;
    }());
    OceanEaters.SimpleGame = SimpleGame;
})(OceanEaters || (OceanEaters = {}));
function resizeGame(game) {
    var contentDiv = document.getElementById("content");
    var w = 600; //contentDiv.clientWidth;
    var h = 450; //contentDiv.clientHeight;
    game.resize(w, h);
}
window.onload = function () {
    var contentDiv = document.getElementById("content");
    var w = 600; //contentDiv.clientWidth;
    var h = 450; //contentDiv.clientHeight;
    var game = new OceanEaters.SimpleGame(w, h);
    function onResize(event) {
        resizeGame(game);
    }
    window.addEventListener("resize", onResize);
};
