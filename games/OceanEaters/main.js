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
        function Ocean() {
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
    var BadBuoy = /** @class */ (function (_super) {
        __extends(BadBuoy, _super);
        function BadBuoy(x, y, index) {
            var _this = _super.call(this) || this;
            _this.index = index;
            var clr = (x < .2 && y < .2) ? 0xff0000 : 0x00ff00;
            var width = 150;
            var height = 350;
            var rad = Math.min(width, height) * .25;
            clr = _this.HSVtoRGB(Math.random(), 1, 1);
            _this.beginFill(clr, .1);
            _this.lineStyle(.05 * width, 0x0, .1);
            _this.drawRoundedRect(-width / 2, 0, width, height, rad);
            _this.endFill();
            _this.beginFill(0x0, .4);
            // this.drawEllipse(0,0,.6 * width, .1 * width);
            _this.drawRoundedRect(-.7 * width, -.05 * height, 1.4 * width, .1 * height, .05 * height);
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
        BadBuoy.prototype.HSVtoRGB = function (h, s, v) {
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
        };
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
            _this.compassContainer = new PIXI.Container();
            _this.compassContainer.position.y = 15;
            _this.compassContainer.scale.y = 0.5;
            _this.addChild(_this.compassContainer);
            _this.compassAngle = 0;
            _this.compassShadow = new PIXI.Graphics();
            _this.compassShadow.y = 8;
            _this.drawCompass(_this.compassShadow, 0x0);
            _this.compass = new PIXI.Graphics();
            _this.drawCompass(_this.compass, 0x55ddaa);
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
        Player.prototype.updateCompassDirection = function (dt, toGoal, playerAngle, pos) {
            // var toGoalAngle = Math.atan2(toGoal.y, toGoal.x);// - playerAngle;
            // // toGoalAngle = toGoalAngle - Math.PI;
            // toGoal.x = Math.cos(toGoalAngle);
            // toGoal.y = Math.sin(toGoalAngle);
            // if(toGoal.x > .5)
            //     --toGoal.x;
            // else if(toGoal.x < -.5)
            //     ++toGoal.x;
            // if(toGoal.y > .5)
            //     --toGoal.y;
            // else if(toGoal.y < -.5)
            //     ++toGoal.y;
            // var goalAngle = Math.atan2(toGoal.y, toGoal.x) - playerAngle;
            // var currDir = new PIXI.Point(Math.cos(this.compassAngle), Math.sin(this.compassAngle));
            // var goalDir = new PIXI.Point(Math.cos(goalAngle), Math.sin(goalAngle));
            // var deltaAngle = Math.acos(currDir.x * goalDir.x + currDir.y * goalDir.y);
            // if(currDir.x * goalDir.y - currDir.y * goalDir.x > 0)
            //     deltaAngle = -deltaAngle;
            // this.compassAngle -= Math.min(1.0, dt * 2.0) * deltaAngle;
            /*
            toGoal.x = .5 - pos.x;
            toGoal.y = .5 - pos.y;
            // toGoal.y *= -1;

            // if(toGoal.x > .5)
            //     --toGoal.x;
            // else if(toGoal.x < -.5)
            //     ++toGoal.x;
            // if(toGoal.y > .5)
            //     --toGoal.y;
            // else if(toGoal.y < -.5)
            //     ++toGoal.y;
            var toGoalAngle = Math.atan2(toGoal.y, toGoal.x);// - playerAngle;
            toGoalAngle = toGoalAngle - Math.PI;
            toGoal.x = Math.cos(toGoalAngle);
            toGoal.y = Math.sin(toGoalAngle);

            var currDir = new PIXI.Point(Math.cos(this.compassAngle), Math.sin(this.compassAngle));
            var deltaAngle = Math.acos(toGoal.x * currDir.x + toGoal.y * currDir.y);
            // var turn = Math.min(1.0, dt * 2.0) * deltaAngle;

            var mat:PIXI.Matrix = new PIXI.Matrix();
            mat.rotate(deltaAngle);
            currDir = mat.apply(currDir);
            this.compassAngle = Math.atan2(currDir.y, currDir.x);
            */
        };
        Player.prototype.drawCompass = function (gr, clr) {
            gr.lineStyle(10, clr);
            gr.drawCircle(0, 0, 100);
            gr.beginFill(clr, 1);
            gr.lineStyle(1, clr);
            gr.moveTo(20, 100);
            gr.lineTo(-20, 100);
            gr.lineTo(0, 130);
            // gr.drawCircle(0,145,10);
            // gr.drawCircle(0,172,8);
            // gr.drawCircle(0,195,6);
            gr.endFill();
            this.compassContainer.addChild(gr);
        };
        Player.prototype.jump = function (salto) {
            if (!this.jumping) {
                this.jumping = true;
                this.jumpParam = 0;
                this.doRotation = salto || Math.random() < .3;
            }
        };
        Player.prototype.resetLayout = function (x, y, w, h) {
            this.position.x = x;
            this.position.y = y;
        };
        Player.prototype.updateFrame = function (dt, pPos, pDir) {
            this.compassShadow.rotation = this.compass.rotation = this.compassAngle + .5 * Math.PI; //Math.PI - this.compassAngle;// + .5 * Math.PI;
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
var OceanEaters;
(function (OceanEaters) {
    var CollectibleVisual = /** @class */ (function (_super) {
        __extends(CollectibleVisual, _super);
        function CollectibleVisual(hue) {
            var _this = _super.call(this) || this;
            _this.topGraphics = new PIXI.Graphics();
            _this.addChild(_this.topGraphics);
            _this.bottomGraphics = new PIXI.Graphics();
            _this.addChild(_this.bottomGraphics);
            _this.ringGraphics = new PIXI.Graphics();
            _this.addChild(_this.ringGraphics);
            _this.resetGraphics(hue);
            return _this;
        }
        CollectibleVisual.prototype.resetGraphics = function (hue) {
            this.hue = hue;
            this.topGraphics.clear();
            this.topGraphics.lineStyle(3, 0xaaaaaa);
            this.topGraphics.beginFill(0xffffff, 1);
            this.topGraphics.moveTo(-20, 0);
            this.topGraphics.bezierCurveTo(-20, -20, -5, -20, 0, -20);
            this.topGraphics.bezierCurveTo(5, -20, 20, -20, 20, 0);
            var teeth = 4;
            for (var i = 0; i < teeth; ++i) {
                var x = 20 - 40 * (i + 1) / (teeth);
                this.topGraphics.lineTo(x, 5 * ((i + 1) % 2));
            }
            //draw top:
            this.topGraphics.beginFill(0xaaaaaa, 1);
            this.topGraphics.drawEllipse(0, -22, 5, 2);
            //draw eyes:
            this.topGraphics.lineStyle(3, 0x0);
            this.topGraphics.beginFill(0x0, 1);
            this.topGraphics.drawCircle(-10, -8, 2);
            this.topGraphics.drawCircle(10, -8, 2);
            //draw mouth:
            this.topGraphics.lineStyle(3, 0xff0000);
            this.topGraphics.beginFill(0xffaaaa, 1);
            this.topGraphics.moveTo(-2, -5);
            this.topGraphics.lineTo(2, -5);
            this.topGraphics.bezierCurveTo(2, -3, -2, -3, -2, -5);
            this.topGraphics.scale.x = 3;
            this.topGraphics.scale.y = 3;
            this.bottomGraphics.clear();
            //draw hook:
            this.bottomGraphics.endFill();
            this.bottomGraphics.lineStyle(4, 0x333333, 1);
            this.bottomGraphics.moveTo(0, 25);
            this.bottomGraphics.lineTo(0, 32);
            this.bottomGraphics.bezierCurveTo(-10, 32, -10, 45, 0, 45);
            this.bottomGraphics.bezierCurveTo(10, 45, 10, 40, 8, 35);
            this.bottomGraphics.lineTo(5, 40);
            //draw base:
            var clr = this.HSVtoRGB(hue, 1, 1);
            var clr2 = this.HSVtoRGB(hue, 1, .7);
            this.bottomGraphics.lineStyle(3, clr2);
            this.bottomGraphics.beginFill(clr, 1);
            this.bottomGraphics.moveTo(-20, 0);
            this.bottomGraphics.bezierCurveTo(-20, 35, 20, 35, 20, 0);
            for (var i = 0; i < teeth; ++i) {
                var x = 20 - 40 * (i + 1) / (teeth);
                this.bottomGraphics.lineTo(x, 5 * ((i + 1) % 2));
            }
            this.bottomGraphics.y = 10;
            this.bottomGraphics.scale.x = 3;
            this.bottomGraphics.scale.y = 3;
            this.ringGraphics.beginFill(0xaaaaaa, 1);
            this.ringGraphics.lineStyle(3, 0x888888, 1);
            this.ringGraphics.drawEllipse(0, 0, 30, 15);
            this.ringGraphics.endFill();
            this.ringGraphics.moveTo(-15, -5);
            this.ringGraphics.bezierCurveTo(-5, 0, 5, 0, 15, -5);
            this.ringGraphics.y = -80;
            this.ringGraphics.pivot.x = -20;
            this.ringGraphics.rotation = 0;
        };
        CollectibleVisual.prototype.HSVtoRGB = function (h, s, v) {
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
        };
        CollectibleVisual.prototype.setAnimationState = function (t) {
            this.topGraphics.y = -t * 20;
            this.bottomGraphics.y = 0;
            this.ringGraphics.y = this.topGraphics.y - 80;
            this.ringGraphics.rotation = (.25 - 1. * t);
        };
        return CollectibleVisual;
    }(PIXI.Container));
    OceanEaters.CollectibleVisual = CollectibleVisual;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="BadBuoy.ts"/>
///<reference path="CollectibleVisual.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var Collectible = /** @class */ (function (_super) {
        __extends(Collectible, _super);
        function Collectible() {
            var _this = _super.call(this, .5, .5, 0) || this;
            _this.direction = new PIXI.Point(1, 0);
            _this.clear();
            _this.animationParam = 0;
            var hue = Math.random();
            _this.bottomVisual = new OceanEaters.CollectibleVisual(hue);
            _this.bottomVisual.scale.y = -1;
            _this.bottomVisual.alpha = .2;
            _this.addChild(_this.bottomVisual);
            _this.shadow = new PIXI.Graphics();
            _this.shadow.clear();
            _this.shadow.beginFill(0x0, .5);
            _this.shadow.drawEllipse(0, 0, 50, 10);
            _this.shadow.endFill();
            _this.addChild(_this.shadow);
            _this.topVisual = new OceanEaters.CollectibleVisual(hue);
            _this.addChild(_this.topVisual);
            _this.reset(.5, .5);
            return _this;
        }
        Collectible.prototype.reset = function (x, y) {
            var angle = Math.random() * 2 * Math.PI;
            this.direction.x = Math.cos(angle);
            this.direction.y = Math.sin(angle);
            this.relativePosition.x = x;
            this.relativePosition.y = y;
            this.updateFrame(0.01);
            var hue = Math.random();
            this.topVisual.resetGraphics(hue);
            this.bottomVisual.resetGraphics(hue);
        };
        Collectible.prototype.updateRender = function (x, y, s, alpha) {
            _super.prototype.updateRender.call(this, x, y, s, alpha);
            if (this.topVisual) {
                var t = Math.abs(Math.cos(this.animationParam * 2 * Math.PI));
                // this.clear();
                // this.beginFill(0x0000ff, .1);
                // this.drawCircle(0,c_y,50);
                // this.beginFill(0x0, .4 - t * .3);
                // var scale = 1. - t * .5;
                // this.drawEllipse(0,0,scale * 50,scale * 10);
                // this.beginFill(0x0000ff, 1);
                // this.drawCircle(0,-c_y,50);
                // this.endFill();
                var shadowScale = 1. - t * .5;
                this.shadow.scale.x = shadowScale;
                this.shadow.scale.y = shadowScale;
                this.shadow.alpha = 1 - t * .8;
                this.topVisual.y = -(120 + 60 * t);
                this.topVisual.setAnimationState(t);
                this.bottomVisual.y = 40 - this.topVisual.y;
                this.bottomVisual.setAnimationState(t);
                // this.topGraphics.y = -c_y - t * 20;
                // this.bottomGraphics.y = -c_y;
                // this.ringGraphics.y = this.topGraphics.y - 80;
                // this.ringGraphics.rotation = (.25 - 1. * t);
            }
        };
        Collectible.prototype.updateFrame = function (dt) {
            _super.prototype.updateFrame.call(this, dt);
            this.animationParam = (this.animationParam + dt) % 1.0;
            this.relativePosition.x += this.direction.x * .025 * dt;
            this.relativePosition.x = (this.relativePosition.x) % 1.0;
            if (this.relativePosition.x < 0)
                this.relativePosition.x += 1.0;
            this.relativePosition.y += this.direction.y * .025 * dt;
            this.relativePosition.y = (this.relativePosition.y) % 1.0;
            if (this.relativePosition.y < 0)
                this.relativePosition.y += 1.0;
        };
        return Collectible;
    }(OceanEaters.BadBuoy));
    OceanEaters.Collectible = Collectible;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="CollectibleVisual.ts"/>
///<reference path="Collectible.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var OverlayCollectElement = /** @class */ (function (_super) {
        __extends(OverlayCollectElement, _super);
        function OverlayCollectElement(hue, x, y, scale) {
            var _this = _super.call(this, hue) || this;
            _this.startPos = new PIXI.Point(x, y);
            _this.startScale = scale;
            _this.animParam = 0;
            _this.updateFrame(0);
            return _this;
        }
        OverlayCollectElement.prototype.updateFrame = function (dt) {
            this.animParam = this.animParam + dt;
            var t = Math.min(this.animParam, 1);
            var currScale = 1;
            if (t < .5) {
                currScale = 1 + .5 * Math.sin(t * Math.PI);
            }
            else {
                currScale = 1.5 * Math.cos((t - .5) * Math.PI);
            }
            var tt = t * t;
            this.position.x = (1 - tt) * this.startPos.x + tt * 400 - Math.sin(t * Math.PI) * 300;
            this.position.y = (1 - tt) * this.startPos.y + tt * 50;
            this.scale.x = currScale;
            this.scale.y = currScale;
            this.rotation = 10 * Math.sin(t * .5 * Math.PI);
        };
        return OverlayCollectElement;
    }(OceanEaters.CollectibleVisual));
    OceanEaters.OverlayCollectElement = OverlayCollectElement;
    var ScoreOverlay = /** @class */ (function (_super) {
        __extends(ScoreOverlay, _super);
        function ScoreOverlay() {
            var _this = _super.call(this) || this;
            _this.collVisual = new OceanEaters.CollectibleVisual(0);
            _this.collVisual.x = 380;
            _this.collVisual.y = 50;
            _this.collVisual.rotation = -.4;
            _this.collVisual.scale.x = .3;
            _this.collVisual.scale.y = .3;
            _this.addChild(_this.collVisual);
            _this.text = new PIXI.Text(': 0');
            _this.text.style.fontFamily = "groboldregular";
            _this.text.style.fontSize = 40;
            _this.text.style.stroke = 0xffffff;
            _this.text.style.fill = 0xffffff;
            _this.text.style.dropShadow = true;
            _this.text.style.dropShadowAlpha = .5;
            _this.text.x = 420;
            _this.text.y = 25;
            _this.addChild(_this.text);
            _this.score = 0;
            _this.wobbleAnimIt = 1.0;
            _this.elements = [];
            return _this;
        }
        ScoreOverlay.prototype.updateFrame = function (dt) {
            this.text.text = ": " + this.score + (Math.random() < .5 ? "" : " ");
            this.wobbleAnimIt = Math.min(this.wobbleAnimIt + dt / .5, 1.0);
            var scaleX = 1. + .2 * Math.sin(this.wobbleAnimIt * 15.) * (1 - this.wobbleAnimIt);
            this.collVisual.scale.x = .3 * scaleX;
            this.collVisual.scale.y = .3 * (2 - scaleX);
            for (var i = 0; i < this.elements.length; ++i) {
                this.elements[i].updateFrame(dt);
                if (this.elements[i].animParam > 1.0) {
                    this.removeChild(this.elements[i]);
                    this.elements.splice(i, 1);
                    this.score = this.score + 1;
                    this.wobbleAnimIt = 0;
                    --i;
                }
            }
        };
        ScoreOverlay.prototype.pushCollectible = function (c) {
            var elem = new OverlayCollectElement(c.topVisual.hue, c.x, c.y + c.topVisual.y, c.scale.x);
            this.addChild(elem);
            this.elements.push(elem);
        };
        return ScoreOverlay;
    }(PIXI.Container));
    OceanEaters.ScoreOverlay = ScoreOverlay;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Ocean.ts"/>
///<reference path="Sky.ts"/>
///<reference path="BadBuoy.ts"/>
///<reference path="Player.ts"/>
///<reference path="Collectible.ts"/>
///<reference path="ScoreOverlay.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var touchElement = /** @class */ (function () {
        function touchElement() {
        }
        return touchElement;
    }());
    OceanEaters.touchElement = touchElement;
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(w, h) {
            var _this = _super.call(this, w, h, { antialias: true, backgroundColor: 0x000000, transparent: false }) || this;
            _this.backgroundTexture = PIXI.Texture.fromImage('assets/background.png');
            _this.backgroundImage = new PIXI.Sprite(_this.backgroundTexture);
            _this.stage.addChild(_this.backgroundImage);
            _this.componentContainer = new PIXI.Container();
            _this.stage.addChild(_this.componentContainer);
            _this.componentMask = new PIXI.Graphics();
            _this.componentMask.beginFill(0xFFFFFF);
            _this.componentMask.drawRect(0, 0, w, h);
            _this.componentMask.endFill();
            _this.componentMask.isMask = true;
            _this.componentContainer.mask = _this.componentMask;
            _this.componentBoundary = new PIXI.Graphics();
            var thickness = [20, 15, 4];
            var offset = [5, 5, 3];
            var colors = [0xaaaaaa, 0xffffff, 0xbbbbbb];
            for (var i = 0; i < 2; ++i) {
                var t = offset[i];
                _this.componentBoundary.lineStyle(thickness[i], colors[i]);
                _this.componentBoundary.drawRoundedRect(-400 - t, -300 - t, 800 + 2 * t, 600 + 2 * t, 20 + t);
            }
            _this.stage.addChild(_this.componentBoundary);
            return _this;
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
            this.ocean = new OceanEaters.Ocean();
            this.ocean.resetLayout(0, 300, 800, 300);
            this.componentContainer.addChild(this.ocean);
            this.sky = new OceanEaters.Sky();
            this.sky.resetLayout(0, 0, 800, 300);
            this.componentContainer.addChild(this.sky);
            var reps = 4;
            this.buoysParent = new PIXI.Container();
            this.componentContainer.addChild(this.buoysParent);
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
            this.collectibles = [];
            while (this.collectibles.length < 8) {
                var c = new OceanEaters.Collectible();
                this.collectibles.push(c);
                this.buoys.push(c);
                this.buoysParent.addChild(c);
            }
            this.player = new OceanEaters.Player();
            this.componentContainer.addChild(this.player);
            this.playerPos = new PIXI.Point(0, 0);
            this.playerAngle = 0;
            this.playerDirection = new PIXI.Point(1, 0);
            this.angularSpeed = 0;
            this.touchPoints = [];
            this.debugText = new PIXI.Text('');
            this.debugText.x = 20;
            this.debugText.y = 10;
            this.componentContainer.addChild(this.debugText);
            this.debugGraphics = new PIXI.Graphics();
            this.componentContainer.addChild(this.debugGraphics);
            this.scoreOverlay = new OceanEaters.ScoreOverlay();
            this.componentContainer.addChild(this.scoreOverlay);
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
                            var double = this.touchPoints.length > 1;
                            this.player.jump(double);
                        }
                    }
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }
        };
        Game.prototype.resize = function (w, h) {
            var bgScale = Math.max(w / 1920, h / 1080);
            this.backgroundImage.scale.x = bgScale;
            this.backgroundImage.scale.y = bgScale;
            var resWidth = bgScale * 1920;
            var resHeight = bgScale * 1080;
            this.backgroundImage.x = (w - resWidth) / 2;
            this.backgroundImage.y = (h - resHeight) / 2;
            this.componentContainer.x = (w - 800) / 2;
            this.componentContainer.y = (h - 600) / 2;
            this.componentBoundary.x = w / 2;
            this.componentBoundary.y = h / 2;
            this.componentMask.clear();
            this.componentMask.beginFill(0xffffff);
            this.componentMask.drawRect(this.componentContainer.x, this.componentContainer.y, 800, 600);
            this.componentMask.endFill();
            this.renderer.resize(w, h);
        };
        Game.prototype.update = function () {
            var dt = this.ticker.elapsedMS * .001;
            dt = Math.min(.1, dt);
            // this.debugText.text = "FPS: " + Math.round(1.0 / dt) + " " + this.screen.width;
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
                // this.debugText.text += "\n" + this.touchPoints[i].currentY;
            }
            if (this.touchPoints.length > 0)
                sumDx /= this.touchPoints.length;
            var newSpeedFactor = Math.min(1, 10 * dt);
            this.angularSpeed = (1 - newSpeedFactor) * this.angularSpeed + newSpeedFactor * -sumDx;
            this.playerAngle += dt * 1. * this.angularSpeed;
            this.playerAngle %= 2 * Math.PI;
            // this.player.compassAngle = this.playerAngle;
            this.playerDirection.x = Math.cos(this.playerAngle);
            this.playerDirection.y = Math.sin(this.playerAngle);
            var speedFactor = 2.0;
            var speed = dt * .05 * speedFactor;
            this.playerPos.x = (this.playerPos.x + speed * this.playerDirection.x) % 1.0;
            if (this.playerPos.x < 0.0)
                this.playerPos.x += 1.0;
            this.playerPos.y = (this.playerPos.y + speed * this.playerDirection.y) % 1.0;
            if (this.playerPos.y < 0.0)
                this.playerPos.y += 1.0;
            /*
            //draw debug graphics:
            const dbMargin:number = 20;
            const dbWidth:number = 200;
            this.debugGraphics.clear();
            var dbX = 800 - dbWidth - dbMargin;// this.screen.width - dbWidth - dbMargin;
            this.debugGraphics.lineStyle(2, 0xffffff, 1);
            this.debugGraphics.drawRect(dbX, dbMargin, dbWidth, dbWidth);
            this.debugGraphics.lineStyle(0);
            this.debugGraphics.beginFill(0x00ff00, 1);
            this.debugGraphics.drawCircle(dbX + dbWidth * this.playerPos.x, dbMargin + dbWidth * (1 - this.playerPos.y), 10);
            this.debugGraphics.drawCircle(dbX + dbWidth * this.playerPos.x + 10 * this.playerDirection.x, dbMargin + dbWidth * (1 - this.playerPos.y) + 10 * -this.playerDirection.y, 5);
            this.debugGraphics.beginFill(0xff0000, 1);
            for(var i:number=0; i<this.buoys.length; ++i) {
                var pos = this.buoys[i].relativePosition;
                this.debugGraphics.drawCircle(dbX + dbWidth * pos.x, dbMargin + dbWidth * (1 - pos.y), 5);
                //this.game.debug.text("" + this.buoys[i].index, dbX + dbWidth * pos.x, dbMargin + dbWidth * (1 - pos.y));
            }

            this.debugGraphics.endFill();
            */
            this.ocean.updateFrame(dt, this.playerPos, this.playerAngle);
            this.sky.updateFrame(dt, this.playerPos, this.playerAngle);
            this.player.updateFrame(dt, this.playerPos, this.playerAngle);
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
            }
            for (var i = 0; i < this.collectibles.length; ++i) {
                var collectible = this.collectibles[i];
                var to = new PIXI.Point(collectible.relativePosition.x - this.playerPos.x, collectible.relativePosition.y - this.playerPos.y);
                var distance = Math.sqrt(to.x * to.x + to.y * to.y);
                if (distance < .005) {
                    this.scoreOverlay.pushCollectible(collectible);
                    var angle = Math.random() * 2 * Math.PI;
                    var srcX = collectible.relativePosition.x + Math.cos(angle) * .5;
                    var srcY = collectible.relativePosition.y + Math.sin(angle) * .5;
                    collectible.reset(srcX, srcY);
                    //hide, will be properly reset next frame:
                    collectible.scale.x = 0;
                    collectible.scale.y = 0;
                }
            }
            this.player.compassAngle = this.playerAngle;
            this.scoreOverlay.updateFrame(dt);
        };
        Game.prototype.getRelativeOceanPosition = function (p) {
            var toPosX = p.x - this.playerPos.x;
            var toPosY = p.y - this.playerPos.y;
            var closestDistance = 100;
            var v = 0;
            var u = 0;
            for (var i = 0; i < 3; ++i) {
                for (var j = 0; j < 3; ++j) {
                    var x = toPosX + i - 1;
                    var y = toPosY + j - 1;
                    var curr_v = this.playerDirection.x * x + this.playerDirection.y * y;
                    var curr_u = this.playerDirection.y * x - this.playerDirection.x * y;
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
function fitApp(app) {
    var gameWidth = 800;
    var gameHeight = 600;
    var margin = 30;
    var body = document.getElementById('body');
    body.style.width = window.innerWidth + "px";
    body.style.height = window.innerHeight + "px";
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    var contentDiv = document.getElementById("content");
    var p_width = window.innerWidth;
    var p_height = window.innerHeight;
    var p_ratio = p_width / p_height;
    var containerWidth = gameWidth + 2 * margin;
    var containerHeight = gameHeight + 2 * margin;
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
window.onload = function () {
    disableScroll();
    var app = new OceanEaters.Game(800, 600);
    app.view.style.position = "absolute";
    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);
    PIXI.loader.add('oceanShader', 'assets/oceanShader.frag')
        .add('skyShader', 'assets/skyShader.frag')
        .add('ripples', 'assets/ripples.png');
    PIXI.loader.load(function (loader, resources) {
        app.setup();
    });
    fitApp(app);
    window.onresize = function () {
        fitApp(app);
    };
};
