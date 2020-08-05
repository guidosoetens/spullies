var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
///<reference path="../../../pixi/pixi.js.d.ts"/>
var ActiveHues;
(function (ActiveHues) {
    var UserControl = /** @class */ (function (_super) {
        __extends(UserControl, _super);
        function UserControl(w, h) {
            var _this = _super.call(this) || this;
            _this.width = w;
            _this.height = h;
            _this.sizeX = w;
            _this.sizeY = h;
            return _this;
        }
        return UserControl;
    }(PIXI.Container));
    ActiveHues.UserControl = UserControl;
})(ActiveHues || (ActiveHues = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
var ActiveHues;
(function (ActiveHues) {
    var Logo = /** @class */ (function (_super) {
        __extends(Logo, _super);
        function Logo() {
            var _this = _super.call(this) || this;
            Logo.instance = _this;
            // const loader = new PIXI.loaders.Loader();
            // loader.add('GothamPro', 'assets/fonts/GothamPro-Light.ttf');
            // loader.load((loader, resources) => {
            //     setTimeout(this.metaDrawThings, 3000, this);
            // });
            _this.txtSpriteTex = PIXI.Texture.fromImage('assets/ac_logo_text.png');
            _this.txtSprite = new PIXI.Sprite(_this.txtSpriteTex);
            _this.txtSprite.scale = new PIXI.Point(.6, .6);
            _this.txtSprite.x = 12;
            _this.txtSprite.y = 12;
            _this.addChild(_this.txtSprite);
            _this.spriteTex = PIXI.Texture.fromImage('assets/ac_logo_small_sat.png');
            _this.sprite = new PIXI.Sprite(_this.spriteTex);
            _this.sprite.scale = new PIXI.Point(.5, .5);
            _this.sprite.x = 120;
            _this.sprite.y = 0;
            _this.addChild(_this.sprite);
            _this.filter = new PIXI.filters.ColorMatrixFilter();
            _this.sprite.filters = [_this.filter];
            _this.count = 0;
            _this.setHue(0.4);
            return _this;
        }
        Logo.prototype.metaDrawThings = function (logo) {
            logo.drawThings();
        };
        Logo.prototype.drawThings = function () {
            this.textLeft = new PIXI.Text("active");
            this.textLeft.style.fontFamily = 'GothamPro';
            this.textLeft.style.fontSize = 40;
            this.textLeft.style.fill = 0x000000;
            // this.textLeft.style.fontWeight = '10';
            this.textLeft.y = 5;
            this.addChild(this.textLeft);
            this.textRight = new PIXI.Text("hues");
            this.textRight.style.fontFamily = 'GothamPro';
            this.textRight.style.fontSize = 40;
            this.textRight.style.stroke = 0xaaaaaa;
            this.textRight.style.fill = 0xaaaaaa;
            // this.textRight.style.fontWeight = '10';
            this.textRight.x = 150;
            this.textRight.y = 5;
            this.addChild(this.textRight);
        };
        Logo.prototype.setHue = function (hue) {
            this.filter.hue(hue * 360);
        };
        return Logo;
    }(PIXI.Container));
    ActiveHues.Logo = Logo;
})(ActiveHues || (ActiveHues = {}));
///<reference path="UserControl.ts"/>
///<reference path="Logo.ts"/>
var ActiveHues;
(function (ActiveHues) {
    var HueCircle = /** @class */ (function (_super) {
        __extends(HueCircle, _super);
        function HueCircle(w, h) {
            var _this = _super.call(this, w, h) || this;
            var rad = Math.min(w, h) * .4;
            _this.spriteTex = PIXI.Texture.fromImage('assets/hue.png');
            _this.sprite = new PIXI.Sprite(_this.spriteTex);
            _this.sprite.width = _this.sprite.height = 2 * rad;
            _this.sprite.position.x = w / 2.0 - rad;
            _this.sprite.position.y = h / 2.0 - rad;
            _this.addChild(_this.sprite);
            rad *= 0.8;
            _this.inputWheel = new PIXI.Graphics();
            _this.inputWheel.beginFill(0xffffff, 1);
            _this.inputWheel.drawCircle(0, 0, rad);
            _this.inputWheel.moveTo(-rad * .2, rad * .95);
            _this.inputWheel.lineTo(0, rad * 1.15);
            _this.inputWheel.lineTo(rad * .2, rad * .95);
            _this.inputWheel.endFill();
            _this.inputWheel.position.x = w / 2.0;
            _this.inputWheel.position.y = h / 2.0;
            _this.addChild(_this.inputWheel);
            _this.centerCircle = new PIXI.Graphics();
            _this.centerCircle.position.x = w / 2.0;
            _this.centerCircle.position.y = h / 2.0;
            _this.addChild(_this.centerCircle);
            _this.setHue(0);
            return _this;
        }
        HueCircle.prototype.rgbToHex = function (rgb) {
            return Math.min(255, Math.floor(rgb * 256));
        };
        ;
        HueCircle.prototype.fullColorHex = function (r, g, b) {
            var red = this.rgbToHex(r);
            var green = this.rgbToHex(g);
            var blue = this.rgbToHex(b);
            return red * 256 * 256 + green * 256 + blue;
        };
        ;
        HueCircle.prototype.HSVtoRGB = function (h, s, v) {
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
            return this.fullColorHex(r, g, b);
        };
        HueCircle.prototype.setHue = function (hue) {
            var clr = this.HSVtoRGB(hue, 1, 1);
            this.inputWheel.rotation = (hue - .25) * 2 * Math.PI;
            this.centerCircle.clear();
            this.centerCircle.beginFill(clr, 1);
            this.centerCircle.drawCircle(0, 0, Math.min(this.sizeX, this.sizeY) * .3);
            this.centerCircle.endFill();
            if (ActiveHues.Logo.instance)
                ActiveHues.Logo.instance.setHue(hue);
            broadcastHueMessage(hue, 0.1234);
        };
        HueCircle.prototype.updateHueFromPoint = function (p) {
            var toX = p.x - this.sizeX / 2.0;
            var toY = p.y - this.sizeY / 2.0;
            var hue = .5 * Math.atan2(toY, toX) / Math.PI;
            if (hue < 0)
                hue += 1.0;
            this.setHue(hue);
        };
        HueCircle.prototype.touchDown = function (p) {
            this.updateHueFromPoint(p);
        };
        HueCircle.prototype.touchMove = function (p) {
            this.updateHueFromPoint(p);
        };
        HueCircle.prototype.touchUp = function (p) {
            this.updateHueFromPoint(p);
        };
        return HueCircle;
    }(ActiveHues.UserControl));
    ActiveHues.HueCircle = HueCircle;
})(ActiveHues || (ActiveHues = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
var ActiveHues;
(function (ActiveHues) {
    var RemoteButton = /** @class */ (function (_super) {
        __extends(RemoteButton, _super);
        function RemoteButton(radius, text, value) {
            var _this = _super.call(this) || this;
            _this.value = value;
            _this.radius = radius;
            _this.width = 2 * radius;
            _this.height = 2 * radius;
            _this.background = new PIXI.Graphics();
            _this.background.beginFill(0xaaaaaa, 1);
            _this.background.drawCircle(0, 0, _this.radius);
            _this.background.endFill();
            _this.addChild(_this.background);
            _this.topVisual = new PIXI.Graphics();
            _this.addChild(_this.topVisual);
            _this.text = new PIXI.Text(text);
            // this.text.style.fontFamily = "groboldregular";
            _this.text.style.fontSize = 40;
            _this.text.style.stroke = 0xffffff;
            _this.text.style.fill = 0xffffff;
            _this.text.style.fontWeight = '900';
            _this.text.anchor.set(0.5, 0.5);
            _this.text.style.dropShadow = true;
            _this.text.style.dropShadowAlpha = .5;
            _this.text.x = 0;
            _this.text.y = 0;
            _this.addChild(_this.text);
            return _this;
        }
        RemoteButton.prototype.hitTestPoint = function (p) {
            var toX = p.x - this.position.x;
            var toY = p.y - this.position.y;
            var dist = Math.sqrt(toX * toX + toY * toY);
            return dist <= this.radius;
        };
        RemoteButton.prototype.setCurveButton = function (angle, baseOffset) {
            var pivX = -baseOffset;
            var ang = .25 * Math.PI;
            var n1 = new PIXI.Point(Math.cos(ang), Math.sin(ang));
            var p1 = new PIXI.Point(pivX + n1.x * (baseOffset - this.radius), n1.y * (baseOffset - this.radius));
            var p2 = new PIXI.Point(pivX + n1.x * (baseOffset + this.radius), n1.y * (baseOffset + this.radius));
            var p3 = new PIXI.Point(p2.x, -p2.y);
            var p4 = new PIXI.Point(p1.x, -p1.y);
            this.background.clear();
            this.background.rotation = angle;
            this.background.beginFill(0xaaaaaa, 1);
            this.background.moveTo(p1.x, p1.y);
            this.background.lineTo(p2.x, p2.y);
            this.background.arcTo(pivX + 2 * (p2.x - pivX), 0, p3.x, p3.y, baseOffset + this.radius);
            this.background.lineTo(p4.x, p4.y);
            this.background.arcTo(pivX + 2 * (p1.x - pivX), 0, p1.x, p1.y, baseOffset - this.radius);
            this.background.endFill();
            this.topVisual.clear();
            this.topVisual.rotation = angle;
            this.topVisual.lineStyle(.2 * this.radius, 0xffffff);
            this.topVisual.moveTo(p1.x, p1.y);
            this.topVisual.lineTo(p2.x, p2.y);
            this.topVisual.arcTo(pivX + 2 * (p2.x - pivX), 0, p3.x, p3.y, baseOffset + this.radius);
            this.topVisual.lineTo(p4.x, p4.y);
            this.topVisual.arcTo(pivX + 2 * (p1.x - pivX), 0, p1.x, p1.y, baseOffset - this.radius);
        };
        return RemoteButton;
    }(PIXI.Container));
    ActiveHues.RemoteButton = RemoteButton;
})(ActiveHues || (ActiveHues = {}));
///<reference path="UserControl.ts"/>
///<reference path="RemoteButton.ts"/>
var ActiveHues;
(function (ActiveHues) {
    var RemoteControl = /** @class */ (function (_super) {
        __extends(RemoteControl, _super);
        function RemoteControl(w, h) {
            var _this = _super.call(this, w, h) || this;
            _this.buttons = [];
            var btnRad = Math.min(w, h) * .1;
            var btnUnitOffset = 2 * btnRad;
            var locs = [new PIXI.Point(0, 0), new PIXI.Point(1, 0), new PIXI.Point(0, 1), new PIXI.Point(-1, 0), new PIXI.Point(0, -1),
                new PIXI.Point(-1.5, 1.5), new PIXI.Point(1.5, 1.5)];
            // const txts = [ 'OK', '\u0001', '\uf107', '\uf104', '\uf106', '\uf3e5', '\uf015' ];
            var txts = ['OK', '˃', '˅', '˂', '˄', '◄', '✕'];
            var vals = ['o', 'r', 'd', 'l', 'u', 'b', 'h'];
            for (var i = 0; i < 7; ++i) {
                var btn = new ActiveHues.RemoteButton((i > 4 ? .7 : 1) * btnRad, txts[i], vals[i]);
                var loc = locs[i];
                btn.position = new PIXI.Point(w / 2 + loc.x * btnUnitOffset, h / 2 + (loc.y - .3) * btnUnitOffset);
                _this.buttons.push(btn);
                _this.addChild(btn);
                if (i > 0 && i < 5)
                    btn.setCurveButton((i - 1) * .5 * Math.PI, btnUnitOffset);
            }
            _this.activeButton = null;
            return _this;
        }
        RemoteControl.prototype.touchDown = function (p) {
            for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
                var b = _a[_i];
                if (b.hitTestPoint(p)) {
                    this.activeButton = b;
                    b.background.alpha = .5;
                    broadcastKeyMessage(b.value);
                    break;
                }
            }
        };
        RemoteControl.prototype.touchMove = function (p) {
        };
        RemoteControl.prototype.touchUp = function (p) {
            if (this.activeButton != null) {
                this.activeButton.background.alpha = 1;
                this.activeButton = null;
            }
        };
        return RemoteControl;
    }(ActiveHues.UserControl));
    ActiveHues.RemoteControl = RemoteControl;
})(ActiveHues || (ActiveHues = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="controls/HueCircle.ts"/>
///<reference path="controls/RemoteControl.ts"/>
///<reference path="controls/Logo.ts"/>
var ActiveHues;
(function (ActiveHues) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(w, h) {
            var _this = _super.call(this) || this;
            _this.width = w;
            _this.height = h;
            var bgGraphics = new PIXI.Graphics();
            bgGraphics.beginFill(0xffffff, 1);
            bgGraphics.drawRect(0, 0, w, h);
            bgGraphics.endFill();
            _this.addChild(bgGraphics);
            _this.hueCircle = new ActiveHues.HueCircle(w, h);
            _this.addChild(_this.hueCircle);
            _this.activeControl = _this.hueCircle;
            _this.remoteControl = new ActiveHues.RemoteControl(w, h);
            _this.remoteControl.alpha = 0;
            // this.remoteControl.visible = false;
            _this.addChild(_this.remoteControl);
            _this.hueMode = true;
            _this.ignoreInput = false;
            _this.logo = new ActiveHues.Logo();
            _this.addChild(_this.logo);
            _this.transitionParam = 1.0;
            _this.leftArrow = new PIXI.Text("◄");
            _this.leftArrow.style.fontSize = 40 + 'px';
            _this.leftArrow.style.fill = 0xaaaaaa;
            // this.leftArrow.style.fontWeight = '100';
            _this.leftArrow.anchor.set(0.5, 0.5);
            _this.leftArrow.x = 20;
            _this.leftArrow.y = h / 2.0;
            _this.addChild(_this.leftArrow);
            _this.rightArrow = new PIXI.Text("►");
            _this.rightArrow.style.fontSize = 40 + 'px';
            ;
            _this.rightArrow.style.fill = 0xaaaaaa;
            // this.rightArrow.style.fontWeight = '100';
            _this.rightArrow.anchor.set(0.5, 0.5);
            _this.rightArrow.x = w - 20;
            _this.rightArrow.y = h / 2.0;
            _this.addChild(_this.rightArrow);
            return _this;
        }
        Game.prototype.update = function (dt) {
            this.transitionParam = Math.min(this.transitionParam + dt / .5, 1.0);
            var appearParam = 1.0;
            var disappearParam = 1.0;
            var otherControl = this.hueMode ? this.remoteControl : this.hueCircle;
            if (this.transitionParam < .5) {
                appearParam = 0.0;
                disappearParam = 1 - Math.cos(this.transitionParam * Math.PI);
            }
            else {
                appearParam = Math.sin((this.transitionParam - .5) * Math.PI);
                disappearParam = 1;
            }
            this.leftArrow.alpha = .1;
            this.rightArrow.alpha = .1;
            if (this.transitionParam > .8) {
                if (this.hueMode)
                    this.rightArrow.alpha = 1;
                else
                    this.leftArrow.alpha = 1;
            }
            var offset = 60 * (this.hueMode ? -1 : 1);
            this.activeControl.alpha = Math.pow(appearParam, 2.0);
            this.activeControl.x = (1 - appearParam) * offset;
            otherControl.alpha = Math.pow(1.0 - disappearParam, 2.0);
            otherControl.x = disappearParam * -offset;
        };
        Game.prototype.touchDown = function (p) {
            if (this.transitionParam < 1.0)
                return;
            if (p.x < 100) {
                if (!this.hueMode) {
                    this.ignoreInput = true;
                    this.hueMode = true;
                    this.activeControl = this.hueCircle;
                    this.transitionParam = 0;
                }
            }
            else if (p.x > this.width - 100) {
                if (this.hueMode) {
                    this.ignoreInput = true;
                    this.hueMode = false;
                    this.activeControl = this.remoteControl;
                    this.transitionParam = 0;
                }
            }
            else {
                this.ignoreInput = false;
                this.activeControl.touchDown(p);
            }
        };
        Game.prototype.touchMove = function (p) {
            if (!this.ignoreInput)
                this.activeControl.touchMove(p);
        };
        Game.prototype.touchUp = function (p) {
            if (!this.ignoreInput)
                this.activeControl.touchUp(p);
        };
        return Game;
    }(PIXI.Container));
    ActiveHues.Game = Game;
})(ActiveHues || (ActiveHues = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Game.ts"/>
var ActiveHues;
(function (ActiveHues) {
    var APP_WIDTH = 800;
    var APP_HEIGHT = 600;
    var touchElement = /** @class */ (function () {
        function touchElement() {
        }
        return touchElement;
    }());
    ActiveHues.touchElement = touchElement;
    var GameContainer = /** @class */ (function (_super) {
        __extends(GameContainer, _super);
        function GameContainer(w, h) {
            var _this = _super.call(this, w, h, { antialias: true, backgroundColor: 0xffffff, transparent: false }) || this;
            // this.backgroundTexture = PIXI.Texture.fromImage('assets/background.png');
            // this.backgroundImage = new PIXI.Sprite(this.backgroundTexture);
            // this.stage.addChild(this.backgroundImage);
            _this.game = new ActiveHues.Game(w, h);
            _this.stage.addChild(_this.game);
            _this.componentMask = new PIXI.Graphics();
            _this.componentMask.beginFill(0xFFFFFF);
            _this.componentMask.drawRect(0, 0, w, h);
            _this.componentMask.endFill();
            _this.componentMask.isMask = true;
            _this.game.mask = _this.componentMask;
            _this.hasFocusTouch = false;
            return _this;
        }
        GameContainer.prototype.setInnerAppSize = function (w, h) {
            this.game.scale.x = w / APP_WIDTH;
            this.game.scale.y = h / APP_HEIGHT;
        };
        GameContainer.prototype.setup = function () {
            this.ticker.add(this.update, this);
            this.stage.interactive = true;
            this.stage.on("pointerdown", this.pointerDown, this);
            this.stage.on("pointermove", this.pointerMove, this);
            this.stage.on("pointerupoutside", this.pointerUp, this);
            this.stage.on("pointercancel", this.pointerUp, this);
            this.stage.on("pointerup", this.pointerUp, this);
            this.stage.on("pointerout", this.pointerUp, this);
            console.log("input events are hooked");
            this.touchPoints = [];
            // this.debugText = new PIXI.Text('');
            // this.debugText.x = 20;
            // this.debugText.y = 10;
            // this.game.addChild(this.debugText);
            this.debugGraphics = new PIXI.Graphics();
            this.game.addChild(this.debugGraphics);
        };
        GameContainer.prototype.keyDown = function (key) {
            // switch(key) {
            //     case 37: //left
            //         this.game.left();
            //         break;
            //     case 38: //up
            //         this.game.up();
            //         break;
            //     case 39: //right
            //         this.game.right();
            //         break;
            //     case 40: //down
            //         this.game.down();
            //         break;
            //     case 32: //space
            //         this.game.rotate();
            //         break;
            // }
        };
        GameContainer.prototype.pointerDown = function (event) {
            for (var i = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }
            var pos = event.data.getLocalPosition(this.game);
            var touch = new touchElement();
            touch.id = event.data.identifier;
            touch.currentX = pos.x;
            touch.currentY = pos.y;
            touch.originX = pos.x;
            touch.originY = pos.y;
            touch.timeAlive = 0;
            this.touchPoints.push(touch);
            if (this.touchPoints.length == 1) {
                this.hasFocusTouch = true;
                this.game.touchDown(pos);
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
                this.game.touchMove(pos);
        };
        GameContainer.prototype.pointerUp = function (event) {
            if (this.hasFocusTouch && this.touchPoints[0].id == event.data.identifier) {
                this.hasFocusTouch = false;
                var pos = event.data.getLocalPosition(this.game);
                this.game.touchUp(pos);
            }
            for (var i = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }
        };
        GameContainer.prototype.resize = function (w, h, appWidth, appHeight) {
            // var bgScale = Math.max(w / 1920, h / 1080);
            // this.backgroundImage.scale.x = bgScale;
            // this.backgroundImage.scale.y = bgScale;
            // var resWidth = bgScale * 1920;
            // var resHeight = bgScale * 1080;
            // this.backgroundImage.x = (w - resWidth) / 2;
            // this.backgroundImage.y = (h - resHeight) / 2;
            this.game.x = (w - appWidth) / 2;
            this.game.y = (h - appHeight) / 2;
            this.componentMask.clear();
            this.componentMask.beginFill(0xffffff);
            this.componentMask.drawRect(this.game.x, this.game.y, appWidth, appHeight);
            this.componentMask.endFill();
            this.renderer.resize(w, h);
            this.setInnerAppSize(appWidth, appHeight);
        };
        GameContainer.prototype.update = function () {
            var dt = this.ticker.elapsedMS * .001;
            dt = Math.min(.1, dt);
            // this.debugText.text = "FPS: 30";
            this.game.update(dt);
        };
        return GameContainer;
    }(PIXI.Application));
    ActiveHues.GameContainer = GameContainer;
})(ActiveHues || (ActiveHues = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="GameContainer.ts"/>
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
var APP_WIDTH = 800;
var APP_HEIGHT = 600;
var messageToken = 0;
function broadcastMessage(isKey, key, hue, unit) {
    var xmlhttp = new XMLHttpRequest();
    var obj = { isKey: isKey, key: key, hue: hue, unit: unit, id: messageToken };
    var msg = JSON.stringify(obj);
    xmlhttp.open("GET", "sendDatagram.php?msg=" + msg, true);
    // xmlhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //         console.log(this.responseText);
    //     }
    // };
    xmlhttp.send();
    ++messageToken;
}
function broadcastKeyMessage(key) {
    broadcastMessage(true, key, 0, 0);
}
function broadcastHueMessage(hue, unit) {
    broadcastMessage(false, ' ', hue, unit);
}
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
    var containerWidth = APP_WIDTH + 2 * margin;
    var containerHeight = APP_HEIGHT + 2 * margin;
    var containerInnerRatio = containerWidth / containerHeight;
    if (containerInnerRatio < p_ratio)
        containerWidth = containerHeight * p_ratio;
    else
        containerHeight = containerWidth / p_ratio;
    var scale = p_width / containerWidth;
    app.view.style.webkitTransform = app.view.style.transform = "matrix(" + scale + ", 0, 0, " + scale + ", 0, 0)";
    app.view.style.webkitTransformOrigin = app.view.style.transformOrigin = "0 0";
    app.resize(containerWidth, containerHeight, APP_WIDTH, APP_HEIGHT);
}
window.onload = function () {
    disableScroll();
    var app = new ActiveHues.GameContainer(APP_WIDTH, APP_HEIGHT);
    app.view.style.position = "absolute";
    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);
    PIXI.loader.load(function (loader, resources) {
        app.setup();
    });
    fitApp(app);
    window.onresize = function () {
        fitApp(app);
    };
    window.onkeydown = function (e) {
        app.keyDown(e.keyCode);
    };
};
