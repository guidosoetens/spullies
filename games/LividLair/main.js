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
var Magneon;
(function (Magneon) {
    var Point = /** @class */ (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.parseFromData = function (data) {
            return new Point(data["x"] * Magneon.GRID_UNIT_SIZE, data["y"] * Magneon.GRID_UNIT_SIZE);
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
    Magneon.Point = Point;
})(Magneon || (Magneon = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
var Magneon;
(function (Magneon) {
    Magneon.APP_WIDTH = 800;
    Magneon.APP_HEIGHT = 600;
    Magneon.GRID_UNIT_SIZE = 25.0;
    Magneon.BALL_RADIUS = .999 * Magneon.GRID_UNIT_SIZE; //25.0;
    Magneon.DEBUG_MODE = false;
    Magneon.CTRL_PRESSED = false;
    function clamp(n, floor, ceil) {
        if (floor === void 0) { floor = 0; }
        if (ceil === void 0) { ceil = 1; }
        return Math.max(floor, Math.min(ceil, n));
    }
    Magneon.clamp = clamp;
})(Magneon || (Magneon = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Defs.ts"/>
var Magneon;
(function (Magneon) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(w, h) {
            var _this = _super.call(this) || this;
            _this.size = new Magneon.Point(w, h);
            _this.ball = new PIXI.Graphics();
            _this.ball.clear();
            _this.ball.beginFill(0x00aaff, 1);
            _this.ball.drawCircle(0, 0, Magneon.BALL_RADIUS);
            _this.ball.endFill();
            _this.addChild(_this.ball);
            return _this;
        }
        Game.prototype.update = function (dt) {
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            for (var i = 0; i < gamepads.length; i++) {
                var gp = gamepads[i];
                if (gp) {
                    var dir = new Magneon.Point(gp.axes[0], gp.axes[1]);
                    if (dir.length() < .3)
                        dir = new Magneon.Point(0, 0);
                    this.ball.x += dir.x * 10.0;
                    this.ball.y += dir.y * 10.0;
                    this.ball.x = this.ball.x % this.size.x;
                    if (this.ball.x < 0)
                        this.ball.x += this.size.x;
                    this.ball.y = this.ball.y % this.size.y;
                    if (this.ball.y < 0)
                        this.ball.y += this.size.y;
                    // gp.
                    // gamepadInfo.innerHTML = "Gamepad connected at index " + gp.index + ": " + gp.id +
                    //   ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.";
                    // gameLoop();
                    // clearInterval(interval);
                }
            }
        };
        Game.prototype.touchDown = function (p) {
        };
        Game.prototype.touchMove = function (p) {
        };
        Game.prototype.touchUp = function (p) {
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
    Magneon.Game = Game;
})(Magneon || (Magneon = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="game/Game.ts"/>
///<reference path="game/Defs.ts"/>
var Magneon;
(function (Magneon) {
    var touchElement = /** @class */ (function () {
        function touchElement() {
        }
        return touchElement;
    }());
    Magneon.touchElement = touchElement;
    var GameContainer = /** @class */ (function (_super) {
        __extends(GameContainer, _super);
        function GameContainer() {
            var _this = _super.call(this, Magneon.APP_WIDTH, Magneon.APP_HEIGHT, { antialias: true, backgroundColor: 0x000000, transparent: false }) || this;
            _this.app_scale = 0.85;
            _this.backgroundTexture = PIXI.Texture.fromImage('assets/background.jpg');
            _this.backgroundImage = new PIXI.Sprite(_this.backgroundTexture);
            _this.stage.addChild(_this.backgroundImage);
            _this.game = new Magneon.Game(Magneon.APP_WIDTH, Magneon.APP_HEIGHT);
            _this.stage.addChild(_this.game);
            _this.componentMask = new PIXI.Graphics();
            _this.componentMask.beginFill(0xFFFFFF);
            _this.componentMask.drawRect(0, 0, Magneon.APP_WIDTH, Magneon.APP_HEIGHT);
            _this.componentMask.endFill();
            _this.componentMask.isMask = true;
            _this.game.mask = _this.componentMask;
            _this.game.pivot.x = .5 * Magneon.APP_WIDTH;
            // this.game.position.x = APP_WIDTH;
            _this.hasFocusTouch = false;
            _this.componentBoundary = new PIXI.Graphics();
            _this.componentBoundary.clear();
            var thickness = [4, 3];
            var offset = [0, 0];
            var colors = [0xaaaaaa, 0xffffff];
            for (var i = 0; i < 2; ++i) {
                var t = offset[i];
                _this.componentBoundary.lineStyle(thickness[i], colors[i]);
                _this.componentBoundary.drawRoundedRect(-t, -t, Magneon.APP_WIDTH + 2 * t, Magneon.APP_HEIGHT + 2 * t, 5 + t);
            }
            _this.stage.addChild(_this.componentBoundary);
            _this.componentBoundary.pivot.x = _this.game.pivot.x = .5 * Magneon.APP_WIDTH;
            return _this;
        }
        GameContainer.prototype.setup = function () {
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
        };
        GameContainer.prototype.keyUp = function (key) {
            console.log(key);
            switch (key) {
                case 17: //ctrl
                    Magneon.CTRL_PRESSED = false;
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
                    Magneon.CTRL_PRESSED = true;
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
                this.game.touchDown(new Magneon.Point(pos.x, pos.y));
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
                this.game.touchMove(new Magneon.Point(pos.x, pos.y));
        };
        GameContainer.prototype.pointerUp = function (event) {
            if (this.hasFocusTouch && this.touchPoints[0].id == event.data.identifier) {
                this.hasFocusTouch = false;
                var pos = event.data.getLocalPosition(this.game);
                this.game.touchUp(new Magneon.Point(pos.x, pos.y));
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
            var bgScale = Math.max(w / 1280, h / 853);
            this.backgroundImage.scale.x = bgScale;
            this.backgroundImage.scale.y = bgScale;
            var resWidth = bgScale * 1280;
            var resHeight = bgScale * 853;
            this.backgroundImage.x = (w - resWidth) / 2;
            this.backgroundImage.y = (h - resHeight) / 2;
            this.game.x = (w - Magneon.APP_WIDTH) / 2 + Magneon.APP_WIDTH / 2;
            this.game.y = (h - Magneon.APP_HEIGHT) / 2;
            // this.componentBoundary.x = w / 2;
            // this.componentBoundary.y = h / 2;
            this.componentBoundary.x = this.game.x;
            this.componentBoundary.y = this.game.y;
            this.componentMask.clear();
            this.componentMask.beginFill(0xffffff);
            this.componentMask.drawRect(this.game.x - Magneon.APP_WIDTH / 2, this.game.y, Magneon.APP_WIDTH, Magneon.APP_HEIGHT);
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
    Magneon.GameContainer = GameContainer;
})(Magneon || (Magneon = {}));
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
    var containerWidth = Magneon.APP_WIDTH + 2 * margin;
    var containerHeight = Magneon.APP_HEIGHT + 2 * margin;
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
    var app = new Magneon.GameContainer();
    app.view.style.position = "absolute";
    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);
    PIXI.loader.add('defaultLevel', 'levels/default.json');
    PIXI.loader.add('mechFont', 'assets/fonts/Ausweis.ttf');
    // PIXI.loader.add('oceanShader', 'assets/oceanShader.frag')
    //         .add('skyShader', 'assets/skyShader.frag')
    //         .add('ripples', 'assets/ripples.png');
    PIXI.loader.load(function (loader, resources) {
        app.setup();
    });
    fitApp(app);
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
