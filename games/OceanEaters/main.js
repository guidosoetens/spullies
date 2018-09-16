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
///<reference path="../../pixi/pixi.js.d.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var Ocean = /** @class */ (function (_super) {
        __extends(Ocean, _super);
        function Ocean(w, h) {
            var _this = _super.call(this) || this;
            // //init shader:
            var oceanTexture = PIXI.Texture.fromImage('assets/ripples.png');
            _this.playerPos = new PIXI.Point(0, 0);
            _this.playerDir = 0;
            var uniforms = {
                uTimeParam: { type: 'f', value: 1.0 },
                uPlayerAngle: { type: 'f', value: 0 },
                uResolution: { type: 'vec2', value: { x: 800, y: 300 } },
                uScreenSize: { type: 'vec2', value: { x: 800, y: 600 } },
                uPlayerPosition: { type: 'vec2', value: { x: 0, y: 0 } },
                uPlayerDirection: { type: 'vec2', value: { x: 0, y: 0 } },
                uTexture: { type: 'sampler2D', value: oceanTexture, textureData: { repeat: true } }
            };
            // alert(PIXI.Filter.defaultVertexSrc);
            var shader = new PIXI.Filter(PIXI.Filter.defaultVertexSrc, PIXI.loader.resources.oceanShader.data, uniforms);
            // shader.autoFit = true;
            // shader.resolution = 100.0;
            _this.filters = [shader];
            _this.shaderTime = 0;
            PIXI.ticker.shared.add(function () {
                var dt = PIXI.ticker.shared.elapsedMS * .001;
                shader.uniforms.uTimeParam = (shader.uniforms.uTimeParam + dt) % 1.0;
                shader.uniforms.uPlayerAngle = _this.playerDir;
                shader.uniforms.uPlayerDirection = { x: Math.cos(_this.playerDir), y: Math.sin(_this.playerDir) };
                shader.uniforms.uPlayerPosition = { x: -_this.playerPos.y, y: _this.playerPos.x };
                shader.uniforms.uScreenSize = { x: 800, y: 600 };
                shader.uniforms.uResolution = { x: 800, y: 300 };
            });
            return _this;
        }
        Ocean.prototype.resetLayout = function (x, y, w, h) {
            this.position.x = x;
            this.position.y = y;
            this.width = w;
            this.height = h;
            this.clear();
            this.beginFill(0x44aaff, 1);
            this.drawRect(0, 0, w, h);
            this.endFill();
        };
        Ocean.prototype.updateFrame = function (dt, pPos, pDir) {
            this.shaderTime = (this.shaderTime + dt / 10.0) % 1.0;
            this.playerPos.x = pPos.x;
            this.playerPos.y = pPos.y;
            this.playerDir = pDir;
        };
        return Ocean;
    }(PIXI.Graphics));
    OceanEaters.Ocean = Ocean;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var Sky = /** @class */ (function (_super) {
        __extends(Sky, _super);
        function Sky() {
            var _this = _super.call(this) || this;
            //init shader:
            var skyTexture = PIXI.Texture.fromImage('assets/sky.jpg');
            var mountainTexture = PIXI.Texture.fromImage('assets/mountains.png');
            _this.playerPos = new PIXI.Point(0, 0);
            _this.playerDir = 0;
            var uniforms = {
                uTimeParam: { type: 'f', value: 1.0 },
                uPlayerAngle: { type: 'f', value: 0 },
                uResolution: { type: 'vec2', value: { x: 800, y: 300 } },
                uScreenSize: { type: 'vec2', value: { x: 800, y: 600 } },
                uPlayerPosition: { type: 'vec2', value: { x: 0, y: 0 } },
                uPlayerDirection: { type: 'vec2', value: { x: 0, y: 0 } },
                uTexture: { type: 'sampler2D', value: skyTexture, textureData: { repeat: true } },
                uMountainsTexture: { type: 'sampler2D', value: mountainTexture, textureData: { repeat: true } }
            };
            var shader = new PIXI.Filter(PIXI.Filter.defaultVertexSrc, PIXI.loader.resources.skyShader.data, uniforms);
            _this.filters = [shader];
            _this.shaderTime = 0;
            PIXI.ticker.shared.add(function () {
                var dt = PIXI.ticker.shared.elapsedMS * .001;
                shader.uniforms.uTimeParam = (shader.uniforms.uTimeParam + dt) % 1.0;
                shader.uniforms.uPlayerAngle = _this.playerDir;
                shader.uniforms.uPlayerDirection = { x: Math.cos(_this.playerDir), y: Math.sin(_this.playerDir) };
                shader.uniforms.uPlayerPosition = { x: -_this.playerPos.y, y: _this.playerPos.x };
            });
            return _this;
        }
        Sky.prototype.resetLayout = function (x, y, w, h) {
            this.position.x = x;
            this.position.y = y;
            this.width = w;
            this.height = h;
            this.clear();
            this.beginFill(0x0066ff, 1);
            this.drawRect(0, 0, w, h);
            this.endFill();
        };
        Sky.prototype.updateFrame = function (dt, pPos, pDir) {
            this.shaderTime = (this.shaderTime + dt / 10.0) % 1.0;
            this.playerPos.x = pPos.x;
            this.playerPos.y = pPos.y;
            this.playerDir = pDir;
        };
        return Sky;
    }(PIXI.Graphics));
    OceanEaters.Sky = Sky;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
var OceanEaters;
(function (OceanEaters) {
    function HSVtoRGB(h, s, v) {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
        }
        return Math.round(r * 255) * 256 * 256 + Math.round(g * 255) * 256 + Math.round(b * 255);
    }
    var BadBuoy = /** @class */ (function (_super) {
        __extends(BadBuoy, _super);
        function BadBuoy(x, y, index) {
            var _this = _super.call(this) || this;
            _this.index = index;
            var clr = (x < .2 && y < .2) ? 0xff0000 : 0x00ff00;
            var width = 150;
            var height = 350;
            var rad = Math.min(width, height) * .25;
            _this.beginFill(0x0, .4);
            // this.drawEllipse(0,0,.6 * width, .1 * width);
            _this.drawRoundedRect(-.7 * width, -.05 * height, 1.4 * width, .1 * height, .05 * height);
            clr = HSVtoRGB(Math.random(), 1, 1);
            _this.beginFill(clr, 1);
            _this.lineStyle(.05 * width, 0x0, 1);
            _this.drawRoundedRect(-width / 2, -height, width, height, rad);
            // this.drawEllipse(0,0,5,5);
            _this.endFill();
            _this.relativePosition = new PIXI.Point(x, y);
            var style = { font: (height * .4) + "px Arial", fill: "#ffffff", align: "center" };
            // var text = game.make.text(0, -height / 2, "" + this.index, style);
            // text.anchor.set(0.5);
            // this.graphics.addChild(text);
            _this.updateRender(x * 200, y * 200, 1, 1);
            return _this;
        }
        BadBuoy.prototype.updateRender = function (x, y, s, alpha) {
            this.position.x = x;
            this.position.y = y;
            this.alpha = alpha;
            this.scale.x = s;
            this.scale.y = s;
        };
        BadBuoy.prototype.updateFrame = function (dt) {
        };
        return BadBuoy;
    }(PIXI.Graphics));
    OceanEaters.BadBuoy = BadBuoy;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player() {
            var _this = _super.call(this) || this;
            _this.shadow = new PIXI.Graphics();
            _this.addChild(_this.shadow);
            _this.shadow.beginFill(0x000, .2);
            _this.shadow.drawEllipse(0, 0, 70, 50);
            _this.shadow.endFill();
            var tex = PIXI.Texture.fromImage('assets/surfboard.png');
            _this.surfboardSprite = new PIXI.Sprite(tex);
            _this.surfboardSprite.anchor.x = 0.5;
            _this.surfboardSprite.anchor.y = 0.5;
            _this.surfboardSprite.scale.x = .8;
            _this.surfboardSprite.scale.y = .15;
            _this.addChild(_this.surfboardSprite);
            tex = PIXI.Texture.fromImage('assets/turtle.png');
            _this.surferSprite = new PIXI.Sprite(tex);
            _this.surferSprite.anchor.x = .5;
            _this.surferSprite.anchor.y = .5;
            _this.surferSprite.scale.x = .25;
            _this.surferSprite.scale.y = .25;
            _this.addChild(_this.surferSprite);
            _this.animIt = 0;
            _this.jumping = false;
            _this.jumpParam = 0;
            _this.resetLayout(400, (.5 + .5 * (2 / 3.0)) * 600, 800, 600);
            return _this;
        }
        Player.prototype.jump = function () {
            if (!this.jumping) {
                this.jumping = true;
                this.jumpParam = 0;
                this.doRotation = Math.random() < .3;
            }
        };
        Player.prototype.resetLayout = function (x, y, w, h) {
            this.position.x = x;
            this.position.y = y;
        };
        Player.prototype.updateFrame = function (dt, pPos, pDir) {
            var jump = 0;
            var jumpTime = .5;
            var surferRotation = 0;
            if (this.jumping) {
                this.jumpParam += dt / 2.0;
                if (this.jumpParam > 1.0) {
                    this.jumpParam = 0.;
                    this.jumping = false;
                }
                else if (this.jumpParam < jumpTime) {
                    var t = this.jumpParam / jumpTime;
                    jump = -300 * Math.sin(t * Math.PI);
                    if (this.doRotation) {
                        surferRotation = Math.sin(t * .5 * Math.PI) * 2 * Math.PI;
                    }
                }
                else {
                    var t = (this.jumpParam - jumpTime) / (1 - jumpTime);
                    jump = 20 * Math.sin(t * 12) * (1 - t);
                }
            }
            var jumpVar = -jump / 300.0;
            this.animIt = (this.animIt + dt) % 1.0;
            this.surfboardSprite.position.y = Math.sin(this.animIt * 2 * Math.PI) * 5 + jump;
            this.surferSprite.position.y = Math.sin((this.animIt + .05) * 2 * Math.PI) * 5 + (this.doRotation ? 1.3 : 1.1) * jump - .75 * this.surfboardSprite.height;
            this.surferSprite.rotation = surferRotation;
            var shadowScale = (1. + .05 * Math.sin(this.animIt * 2 * Math.PI)) * (.3 + .7 * (1 - jumpVar));
            this.shadow.position.y = this.surfboardSprite.position.y + 10 - jump;
            this.shadow.scale.x = shadowScale;
            this.shadow.scale.y = shadowScale;
            this.shadow.alpha = (.3 + .7 * (1 - jumpVar));
        };
        return Player;
    }(PIXI.Container));
    OceanEaters.Player = Player;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Ocean.ts"/>
///<reference path="Sky.ts"/>
///<reference path="BadBuoy.ts"/>
///<reference path="Player.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var inputElement = /** @class */ (function () {
        function inputElement() {
        }
        return inputElement;
    }());
    OceanEaters.inputElement = inputElement;
    var touchElement = /** @class */ (function () {
        function touchElement() {
        }
        return touchElement;
    }());
    OceanEaters.touchElement = touchElement;
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(w, h) {
            return _super.call(this, w, h, { antialias: true, backgroundColor: 0x1099bb }) || this;
        }
        Game.prototype.setup = function () {
            this.ticker.add(this.update, this);
            this.stage.interactive = true;
            this.stage.on("pointerdown", this.pointerDown, this);
            this.stage.on("pointermove", this.pointerMove, this);
            this.stage.on("pointerupoutside", this.pointerUp, this);
            this.stage.on("pointercancel", this.pointerUp, this);
            this.stage.on("pointerup", this.pointerUp, this);
            this.stage.on("pointerout", this.pointerUp, this);
            this.ocean = new OceanEaters.Ocean(this.screen.width, .5 * this.screen.height);
            this.ocean.resetLayout(0, .5 * this.screen.height, this.screen.width, .5 * this.screen.height);
            this.stage.addChild(this.ocean);
            this.sky = new OceanEaters.Sky();
            this.sky.resetLayout(0, 0, this.screen.width, .5 * this.screen.height);
            this.stage.addChild(this.sky);
            var reps = 6;
            this.buoysParent = new PIXI.Container();
            this.stage.addChild(this.buoysParent);
            this.buoys = [];
            for (var x = 0; x < reps; ++x) {
                for (var y = 0; y < reps; ++y) {
                    var offsetX = (Math.random() - .5) * .7;
                    var offsetY = (Math.random() - .5) * .7;
                    var buoy = new OceanEaters.BadBuoy((x + 0.5 + offsetX) / reps, (y + 0.5 + offsetY) / reps, this.buoys.length);
                    this.buoys.push(buoy);
                    this.buoysParent.addChild(buoy);
                }
            }
            this.player = new OceanEaters.Player();
            this.stage.addChild(this.player);
            this.playerPos = new PIXI.Point(0, 0);
            this.playerDirection = 0;
            this.angularSpeed = 0;
            this.touchPoints = [];
            this.debugText = new PIXI.Text('txt');
            this.debugText.x = 20;
            this.debugText.y = 10;
            this.stage.addChild(this.debugText);
            this.debugGraphics = new PIXI.Graphics();
            this.stage.addChild(this.debugGraphics);
        };
        Game.prototype.inputDown = function (input) {
            for (var i = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == input.id) {
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }
            var pos = new PIXI.Point(input.x, input.y); // event.data.getLocalPosition(this.stage);
            var touch = new touchElement();
            touch.id = input.id; //event.data.identifier;
            touch.currentX = pos.x;
            touch.currentY = pos.y;
            touch.originX = pos.x;
            touch.originY = pos.y;
            touch.timeAlive = 0;
            this.touchPoints.push(touch);
        };
        Game.prototype.inputMove = function (input) {
            var pos = new PIXI.Point(input.x, input.y); //event.data.getLocalPosition(this.stage);
            for (var i = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == input.id) {
                    this.touchPoints[i].currentX = pos.x;
                    this.touchPoints[i].currentY = pos.y;
                }
            }
        };
        Game.prototype.inputUp = function (input) {
            for (var i = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == input.id) {
                    if (this.touchPoints[i].timeAlive < .3) {
                        var dy = input.y - this.touchPoints[i].originY;
                        if (dy < -5) {
                            this.player.jump();
                        }
                    }
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }
        };
        Game.prototype.pointerDown = function (event) {
            for (var i = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }
            var pos = event.data.getLocalPosition(this.stage);
            var touch = new touchElement();
            touch.id = event.data.identifier;
            touch.currentX = pos.x;
            touch.currentY = pos.y;
            touch.originX = pos.x;
            touch.originY = pos.y;
            touch.timeAlive = 0;
            this.touchPoints.push(touch);
        };
        Game.prototype.pointerMove = function (event) {
            var pos = event.data.getLocalPosition(this.stage);
            for (var i = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints[i].currentX = pos.x;
                    this.touchPoints[i].currentY = pos.y;
                }
            }
        };
        Game.prototype.pointerUp = function (event) {
            for (var i = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {
                    if (this.touchPoints[i].timeAlive < .3) {
                        var dy = event.data.getLocalPosition(this.stage).y - this.touchPoints[i].originY;
                        if (dy < -5) {
                            this.player.jump();
                        }
                    }
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }
        };
        Game.prototype.resize = function (w, h) {
            // this.game.scale.setGameSize(w, h);
        };
        Game.prototype.updateLayout = function () {
            // var width = this.screen.width;
            // var height = this.stage.height;
            // this.ocean.resetLayout(0, .5 * height, width, .5 * height);
            // this.sky.resetLayout(0, 0, width, .5 * height);
            // this.player.resetLayout(.5 * width, (1. - 1. / 6.) * height, width, height);
        };
        Game.prototype.update = function () {
            var dt = this.ticker.elapsedMS * .001;
            this.debugText.text = "FPS: " + Math.round(1.0 / dt) + " " + this.screen.width;
            //update input:
            var sumDx = 0;
            var centerX = this.screen.width / 2.0;
            for (var i = 0; i < this.touchPoints.length; ++i) {
                var factor = 0;
                var time = this.touchPoints[i].timeAlive;
                if (time > .05) {
                    factor = Math.min((time - .05) * 2., 1.0);
                }
                var dx = (this.touchPoints[i].currentX - centerX) / centerX;
                dx *= 2.0;
                if (Math.abs(dx) > 1.0)
                    dx = Math.sign(dx);
                sumDx += factor * dx;
                this.touchPoints[i].timeAlive += dt;
                this.debugText.text += "\n" + this.touchPoints[i].currentY;
            }
            if (this.touchPoints.length > 0)
                sumDx /= this.touchPoints.length;
            var newSpeedFactor = Math.min(1, 10 * dt);
            this.angularSpeed = (1 - newSpeedFactor) * this.angularSpeed + newSpeedFactor * -sumDx;
            this.playerDirection += dt * 1. * this.angularSpeed;
            // //update player location:
            // if(this.trackMouseDown) {
            //     this.trackMouseTime += dt;
            //     if(this.trackMousePos.x < .25 * this.screen.width) {
            //         //move left:
            //         this.playerDirection += dt * 1.;
            //     }
            //     else if(this.trackMousePos.x > .75 * this.screen.width) {
            //         //move right:
            //         this.playerDirection -= dt * 1.;
            //     }
            // }
            this.playerDirection %= 2 * Math.PI;
            var playerDirX = Math.cos(this.playerDirection);
            var playerDirY = Math.sin(this.playerDirection);
            var speedFactor = 2.0;
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
            var dbX = this.screen.width - dbWidth - dbMargin; // this.screen.width - dbWidth - dbMargin;
            this.debugGraphics.lineStyle(2, 0xffffff, 1);
            this.debugGraphics.drawRect(dbX, dbMargin, dbWidth, dbWidth);
            this.debugGraphics.lineStyle(0);
            this.debugGraphics.beginFill(0x00ff00, 1);
            this.debugGraphics.drawCircle(dbX + dbWidth * this.playerPos.x, dbMargin + dbWidth * (1 - this.playerPos.y), 10);
            this.debugGraphics.drawCircle(dbX + dbWidth * this.playerPos.x + 10 * playerDirX, dbMargin + dbWidth * (1 - this.playerPos.y) + 10 * -playerDirY, 5);
            this.debugGraphics.beginFill(0xff0000, 1);
            for (var i = 0; i < this.buoys.length; ++i) {
                var pos = this.buoys[i].relativePosition;
                this.debugGraphics.drawCircle(dbX + dbWidth * pos.x, dbMargin + dbWidth * (1 - pos.y), 5);
                //this.game.debug.text("" + this.buoys[i].index, dbX + dbWidth * pos.x, dbMargin + dbWidth * (1 - pos.y));
            }
            this.debugGraphics.endFill();
            this.ocean.updateFrame(dt, this.playerPos, this.playerDirection);
            this.sky.updateFrame(dt, this.playerPos, this.playerDirection);
            this.player.updateFrame(dt, this.playerPos, this.playerDirection);
            for (var i = 0; i < this.buoys.length; ++i) {
                var oceanUv = this.getRelativeOceanPosition(this.buoys[i].relativePosition);
                var transUv = new PIXI.Point(oceanUv.x, oceanUv.y);
                var plane_scale = 0.025; //0.05;
                //transUv.y /= 1.5; //in shader: xy.y *= 1.5
                transUv.x = transUv.x / plane_scale;
                transUv.y = transUv.y / plane_scale;
                //transUv.multiply(1.0 / plane_scale, 1.0 / plane_scale);
                transUv.y = transUv.y / (transUv.y + 1); //deform Y
                transUv.x = (1 - transUv.y) * transUv.x; //deform X
                var deformScaleX = (1 - transUv.y);
                transUv.y /= 1.5; //in shader: xy.y *= 1.5
                transUv.x *= 800; //this.ocean.width;
                transUv.y *= 300; //this.ocean.height; //in shader: xy.y *= 1.5
                var playerPosX = this.player.position.x;
                var playerPosY = this.player.position.y;
                var x = playerPosX + transUv.x; //5. * oceanUv.x * this.game.scale.width;
                var y = playerPosY - transUv.y; // * this.game.scale.height;
                var scale = deformScaleX; //Math.max(0, 1 - 10 * oceanUv.y);
                var alpha = 1; //Math.min(1, 1 - 10. * oceanUv.y);
                if (oceanUv.y < 0)
                    alpha = 1 + oceanUv.y / .01;
                else if (oceanUv.y > .5) {
                    alpha = 1 - (oceanUv.y - .5) / .1;
                }
                this.buoys[i].updateRender(x, y, scale, alpha);
                this.buoys[i].updateFrame(dt);
            }
            function sortBuoys(a, b) {
                return a.position.y - b.position.y;
            }
            var sorted = this.buoys.sort(sortBuoys);
            for (var i = 0; i < sorted.length; ++i) {
                this.buoysParent.setChildIndex(sorted[i], i);
                // sorted[i].graphics.z = i;
            }
        };
        Game.prototype.getRelativeOceanPosition = function (p) {
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
                    if (curr_v > -.01) {
                        var distance = Math.sqrt(curr_u * curr_u + curr_v * curr_v);
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            v = curr_v;
                            u = curr_u;
                        }
                    }
                }
            }
            return new PIXI.Point(u, v);
        };
        return Game;
    }(PIXI.Application));
    OceanEaters.Game = Game;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Game.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var InputOverlay = /** @class */ (function (_super) {
        __extends(InputOverlay, _super);
        function InputOverlay(w, h, game) {
            var _this = _super.call(this, w, h, { antialias: true, backgroundColor: 0xff0000 }) || this;
            _this.game = game;
            return _this;
        }
        InputOverlay.prototype.setup = function () {
            this.stage.interactive = true;
            this.stage.on("pointerdown", this.pointerDown, this);
            this.stage.on("pointermove", this.pointerMove, this);
            this.stage.on("pointerupoutside", this.pointerUp, this);
            this.stage.on("pointercancel", this.pointerUp, this);
            this.stage.on("pointerup", this.pointerUp, this);
            this.stage.on("pointerout", this.pointerUp, this);
        };
        InputOverlay.prototype.setLayout = function (overlayWidth, overlayHeight, gameWidth, gameHeight) {
            this.overlayWidth = overlayWidth;
            this.overlayHeight = overlayHeight;
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
        };
        InputOverlay.prototype.calcInputElement = function (event) {
            var elem = new OceanEaters.inputElement();
            var pt = event.data.getLocalPosition(this.stage);
            pt.x = this.overlayWidth * pt.x / this.screen.width;
            pt.y = this.overlayHeight * pt.y / this.screen.height;
            pt.x = pt.x - (this.overlayWidth - this.gameWidth) / 2.0;
            pt.y = pt.y - (this.overlayHeight - this.gameHeight) / 2.0;
            pt.x = this.game.screen.width * pt.x / this.gameWidth;
            pt.y = this.game.screen.width * pt.y / this.gameWidth;
            elem.x = pt.x;
            elem.y = pt.y;
            elem.id = event.data.identifier;
            return elem;
        };
        InputOverlay.prototype.pointerDown = function (event) {
            this.game.inputDown(this.calcInputElement(event));
        };
        InputOverlay.prototype.pointerMove = function (event) {
            this.game.inputMove(this.calcInputElement(event));
        };
        InputOverlay.prototype.pointerUp = function (event) {
            this.game.inputUp(this.calcInputElement(event));
        };
        return InputOverlay;
    }(PIXI.Application));
    OceanEaters.InputOverlay = InputOverlay;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Game.ts"/>
///<reference path="InputOverlay.ts"/>
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
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}
function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}
function fitApp(appCanvas, touchCanvas) {
    var body = document.getElementById('body');
    body.style.width = window.innerWidth + "px";
    body.style.height = window.innerHeight + "px";
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    var contentDiv = document.getElementById("content");
    var p_width = window.innerWidth; //contentDiv.clientWidth;
    var p_height = window.innerHeight; //contentDiv.clientHeight;
    var app_width = appCanvas.clientWidth;
    var app_height = appCanvas.clientHeight;
    var appRatio = app_width / app_height;
    var parentRatio = p_width / p_height;
    var scale = 1.0;
    if (parentRatio > appRatio) {
        scale = p_height / app_height;
    }
    else {
        scale = p_width / app_width;
    }
    scale *= .95;
    var transX = .5 * (p_width - scale * app_width);
    var transY = .5 * (p_height - scale * app_height);
    // appCanvas.style.transform = "scale(" + (.5 * p_width / c_width) + ", " + (.5 * p_height / c_height) + ")"
    appCanvas.style.webkitTransform = appCanvas.style.transform = "matrix(" + scale + ", 0, 0, " + scale + ", " + transX + ", " + transY + ")";
    appCanvas.style.webkitTransformOrigin = appCanvas.style.transformOrigin = "0 0";
    var inputScaleX = p_width / touchCanvas.clientWidth;
    var inputScaleY = p_height / touchCanvas.clientHeight;
    touchCanvas.style.webkitTransform = touchCanvas.style.transform = "matrix(" + inputScaleX + ", 0, 0, " + inputScaleY + ", 0, 0)";
    touchCanvas.style.webkitTransformOrigin = touchCanvas.style.transformOrigin = "0 0";
}
function generateTouchElement_Touch(touch) {
    var res = new OceanEaters.inputElement();
    res.id = touch.identifier; //.pointerId;
    res.x = touch.clientX;
    res.y = touch.clientY;
    return res;
}
function generateTouchElement_Pointer(event) {
    var res = new OceanEaters.inputElement();
    res.id = event.pointerId;
    res.x = event.x;
    res.y = event.y;
    return res;
}
window.onload = function () {
    disableScroll();
    var app = new OceanEaters.Game(800, 600);
    app.view.style.position = "absolute";
    var inputOverlay = new OceanEaters.InputOverlay(100, 100, app);
    inputOverlay.view.style.position = "absolute";
    inputOverlay.view.style.opacity = "0";
    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);
    contentDiv.appendChild(inputOverlay.view);
    // app.view.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)";
    PIXI.loader.add('oceanShader', 'assets/oceanShader.frag')
        .add('skyShader', 'assets/skyShader.frag')
        .add('ripples', 'assets/ripples.png');
    PIXI.loader.load(function (loader, resources) {
        app.setup();
        // inputOverlay.setup();
    });
    fitApp(app.view, inputOverlay.view);
    window.onresize = function () {
        fitApp(app.view, inputOverlay.view);
    };
    /*

    window.onpointerdown = (event) => { app.inputDown(generateTouchElement_Pointer(event)) };
    window.onpointermove = (event) => { app.inputMove(generateTouchElement_Pointer(event)) };
    window.onpointerup = (event) => { app.inputUp(generateTouchElement_Pointer(event)) };
    window.onpointercancel = (event) => { app.inputUp(generateTouchElement_Pointer(event)) };

    window.ontouchstart = (event) => {
        for(var i:number=0; i<event.changedTouches.length; ++i) {
            app.inputDown(generateTouchElement_Touch(event.changedTouches[i]));
        }
    };
    window.ontouchmove = (event) => {
        for(var i:number=0; i<event.changedTouches.length; ++i) {
            app.inputMove(generateTouchElement_Touch(event.changedTouches[i]));
        }
    };
    window.ontouchend = (event) => {
        for(var i:number=0; i<event.changedTouches.length; ++i) {
            app.inputUp(generateTouchElement_Touch(event.changedTouches[i]));
        }
    };
    window.ontouchcancel = (event) => {
        for(var i:number=0; i<event.changedTouches.length; ++i) {
            app.inputUp(generateTouchElement_Touch(event.changedTouches[i]));
        }
    };

    */
    /*

    window.onmousedown = (event) => { app.inputDown(generateTouchElementFromMouse(event)) };

    if(!!window.PointerEvent) {
        if (this.supportsPointerEvents)
        {
            window.document.addEventListener('pointermove', this.onPointerMove, true);
            this.interactionDOMElement.addEventListener('pointerdown', this.onPointerDown, true);
            // pointerout is fired in addition to pointerup (for touch events) and pointercancel
            // we already handle those, so for the purposes of what we do in onPointerOut, we only
            // care about the pointerleave event
            this.interactionDOMElement.addEventListener('pointerleave', this.onPointerOut, true);
            this.interactionDOMElement.addEventListener('pointerover', this.onPointerOver, true);
            window.addEventListener('pointercancel', this.onPointerCancel, true);
            window.addEventListener('pointerup', this.onPointerUp, true);
        }
        else
        {
            window.document.addEventListener('mousemove', this.onPointerMove, true);
            this.interactionDOMElement.addEventListener('mousedown', this.onPointerDown, true);
            this.interactionDOMElement.addEventListener('mouseout', this.onPointerOut, true);
            this.interactionDOMElement.addEventListener('mouseover', this.onPointerOver, true);
            window.addEventListener('mouseup', this.onPointerUp, true);
        }
    }

    if(this.supportsTouchEvents) {

    }

    // if (this.supportsTouchEvents)
    // {
    //     this.interactionDOMElement.addEventListener('touchstart', this.onPointerDown, true);
    //     this.interactionDOMElement.addEventListener('touchcancel', this.onPointerCancel, true);
    //     this.interactionDOMElement.addEventListener('touchend', this.onPointerUp, true);
    //     this.interactionDOMElement.addEventListener('touchmove', this.onPointerMove, true);
    // }



    window.onpointerdown = (event) => { app.inputDown(generateTouchElement(event)) };
    window.onpointermove = (event) => { app.inputMove(generateTouchElement(event)) };
    window.onpointerup = (event) => { app.inputUp(generateTouchElement(event)) };
    window.onpointercancel = (event) => { app.inputUp(generateTouchElement(event)) };
    // window.onpointerout = (event) => { app.inputUp(generateTouchElement(event)) };
    // window.onpointerleave = (event) => { app.inputUp(generateTouchElement(event)) };
    */
    /*
                this.stage.on("pointerdown", this.pointerDown, this);
            this.stage.on("pointermove", this.pointerMove, this);
            this.stage.on("pointerupoutside", this.pointerUp, this);
            this.stage.on("pointercancel", this.pointerUp, this);
            this.stage.on("pointerup", this.pointerUp, this);
            this.stage.on("pointerout", this.pointerUp, this);
    */
};
