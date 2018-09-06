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
    var Bullet = /** @class */ (function (_super) {
        __extends(Bullet, _super);
        function Bullet(game) {
            var _this = _super.call(this, game) || this;
            var polygonPoints = [];
            polygonPoints.push([-20, -20]);
            polygonPoints.push([20, -20]);
            var samples = 30;
            var offset = 20;
            for (var i = 0; i < samples; ++i) {
                var t = i / (samples - 1);
                var angle = (t) * Math.PI;
                polygonPoints.push([20 * Math.cos(angle), 40 * Math.sin(angle)]);
            }
            _this.x = _this.game.width / 2;
            _this.y = _this.game.height / 2;
            _this.lineStyle(3, 0xaa0000);
            _this.beginFill(0xff0000, 1);
            _this.moveTo(polygonPoints[0][0], polygonPoints[0][1]);
            for (var i = 0; i < polygonPoints.length; ++i) {
                _this.lineTo(polygonPoints[i][0], polygonPoints[i][1]);
            }
            _this.lineTo(polygonPoints[0][0], polygonPoints[0][1]);
            _this.endFill();
            _this.game.physics.p2.enable(_this);
            _this.bulletBody = _this.body;
            _this.bulletBody.addPolygon({}, polygonPoints);
            _this.bulletBody.data.position = [0, 0];
            _this.bulletBody.angularDamping = 0.8;
            return _this;
        }
        Bullet.prototype.proceed = function (dt, thrust) {
            if (thrust) {
                var ang = Math.PI * this.bulletBody.angle / 180.0;
                var toPt = new Phaser.Point(Math.cos(ang), Math.sin(ang));
                this.bulletBody.thrust(-1000);
                //this.bulletBody.moveRight(toPt.x * 200);
                //this.bulletBody.moveDown(toPt.y * 200);
                //this.bulletBody.applyForce([200 * toPt.x, 200 * toPt.y], this.bulletBody.data.position[0], this.bulletBody.data.position[1]);
            }
        };
        return Bullet;
    }(Phaser.Graphics));
    OceanEaters.Bullet = Bullet;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../phaser/phaser.d.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var CornerPiece = /** @class */ (function (_super) {
        __extends(CornerPiece, _super);
        function CornerPiece(game, cornerPt, anchor1, anchor2) {
            var _this = _super.call(this, game) || this;
            _this.idx = CornerPiece.counter++;
            var polygonPoints = [];
            polygonPoints.push([cornerPt.x, cornerPt.y]);
            var frac1 = .5 * _this.game.rnd.frac();
            var frac2 = .5 * _this.game.rnd.frac();
            var control1 = new Phaser.Point(frac1 * anchor1.x + (1 - frac1) * cornerPt.x, frac1 * anchor1.y + (1 - frac1) * cornerPt.y);
            var control2 = new Phaser.Point(frac2 * anchor2.x + (1 - frac2) * cornerPt.x, frac2 * anchor2.y + (1 - frac2) * cornerPt.y);
            var samples = 20;
            for (var i = 0; i < samples; ++i) {
                var t = i / (samples - 1);
                var tt = t * t;
                var min_t = 1 - t;
                var min_tt = min_t * min_t;
                var x = min_t * min_tt * anchor1.x + 3 * t * min_tt * control1.x + 3 * tt * min_t * control2.x + t * tt * anchor2.x;
                var y = min_t * min_tt * anchor1.y + 3 * t * min_tt * control1.y + 3 * tt * min_t * control2.y + t * tt * anchor2.y;
                polygonPoints.push([x, y]);
            }
            _this.beginFill(0xaaaa00, .5);
            _this.moveTo(polygonPoints[0][0], polygonPoints[0][1]);
            for (var i = 0; i < polygonPoints.length; ++i) {
                _this.lineTo(polygonPoints[i][0], polygonPoints[i][1]);
            }
            _this.endFill();
            //add to physics:
            _this.game.physics.p2.enable(_this);
            var cornerBody = _this.body;
            cornerBody.static = true;
            cornerBody.addPolygon({}, polygonPoints);
            return _this;
        }
        CornerPiece.prototype.update = function () {
            this.game.debug.text('pos: X[' + this.x + '] [' + this.y + ']', 30, 30 + 20 * this.idx);
        };
        CornerPiece.counter = 0;
        return CornerPiece;
    }(Phaser.Graphics));
    OceanEaters.CornerPiece = CornerPiece;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Bullet.ts"/>
///<reference path="CornerPiece.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var GameState = /** @class */ (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            return _super.call(this) || this;
        }
        GameState.prototype.create = function () {
            this.graphics = this.game.add.graphics(0, 0);
            this.trackMouseDown = false;
            this.trackMouseTime = 0;
            this.trackMousePos = new Phaser.Point(0, 0);
            this.currentState = "";
            this.currentStateTimer = -1;
            this.moveVelocity = 0;
            this.fooString = "";
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
