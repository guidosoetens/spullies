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
    var Ocean = /** @class */ (function (_super) {
        __extends(Ocean, _super);
        function Ocean(game) {
            var _this = _super.call(this, game) || this;
            var peachSprite = game.add.sprite(-256, 0, 'peachy');
            //init shader:
            _this.shader = new Phaser.Filter(game, null, game.cache.getShader('oceanShader'));
            // this.shader.uniforms.uTimeParam = { type: 'float', value: 0. };
            // this.shader.uniforms.uTexture = { type: 'sampler2D', value: peachSprite.texture, textureData: { repeat: true } };
            _this.filters = [_this.shader];
            //peachSprite
            // uvBmpContainerSprite.filters = [ this.shader ];
            _this.beginFill(0xffffff, 1);
            _this.drawRect(0, 0, 100, 100);
            _this.endFill();
            return _this;
        }
        Ocean.prototype.updateFrame = function (dt) {
            // this.shader.update();
        };
        return Ocean;
    }(Phaser.Graphics));
    OceanEaters.Ocean = Ocean;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Ocean.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var GameState = /** @class */ (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            return _super.call(this) || this;
        }
        GameState.prototype.preload = function () {
            this.game.load.shader("oceanShader", 'assets/oceanShader.frag');
            this.game.load.image('peachy', "assets/peachy.png");
        };
        GameState.prototype.create = function () {
            this.graphics = this.game.add.graphics(0, 0);
            this.elements = this.game.add.group();
            this.trackMouseDown = false;
            this.trackMouseTime = 0;
            this.trackMousePos = new Phaser.Point(0, 0);
            this.currentState = "";
            this.currentStateTimer = -1;
            this.moveVelocity = 0;
            this.fooString = "";
            this.ocean = new OceanEaters.Ocean(this.game);
            this.elements.addChild(this.ocean);
        };
        GameState.prototype.update = function () {
            var dt = this.game.time.physicsElapsed;
            this.updateInput(dt);
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
            this.ocean.updateFrame(dt);
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
function resizeGame(game) {
    var contentDiv = document.getElementById("content");
    var w = contentDiv.clientWidth;
    var h = contentDiv.clientHeight;
    game.resize(w, h);
}
window.onload = function () {
    var contentDiv = document.getElementById("content");
    var w = contentDiv.clientWidth;
    var h = contentDiv.clientHeight;
    var game = new OceanEaters.SimpleGame(w, h);
    disableScroll();
    function onResize(event) {
        resizeGame(game);
    }
    window.addEventListener("resize", onResize);
};
