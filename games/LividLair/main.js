var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
var LividLair;
(function (LividLair) {
    var Point = /** @class */ (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.fromPixi = function (p) {
            return new Point(p.x, p.y);
        };
        Point.parseFromData = function (data) {
            return new Point(data["x"] * LividLair.GRID_UNIT_SIZE, data["y"] * LividLair.GRID_UNIT_SIZE);
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
    LividLair.Point = Point;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
var LividLair;
(function (LividLair) {
    LividLair.APP_WIDTH = 1280;
    LividLair.APP_HEIGHT = 720;
    LividLair.ROOM_DEBUG = false;
    LividLair.GRID_UNIT_SIZE = 80.0;
    LividLair.PLAYER_WIDTH = .6 * LividLair.GRID_UNIT_SIZE;
    LividLair.LADDER_WIDTH = .6 * LividLair.GRID_UNIT_SIZE;
    LividLair.PLAYER_HEIGHT = .8 * LividLair.GRID_UNIT_SIZE;
    LividLair.GRID_INCLUDE_DIVISION = true;
    LividLair.CLOSE_WALLS = false;
    LividLair.SNAP_CAMERA = true; //false;
    // export const BALL_RADIUS:number = .999 * GRID_UNIT_SIZE;//25.0;
    LividLair.DEBUG_MODE = false;
    LividLair.ROOM_TILE_ROWS = 8;
    LividLair.ROOM_TILE_COLUMNS = 15; //10;
    LividLair.OUTER_BORDER_TILE_COUNT = 2;
    LividLair.CTRL_PRESSED = false;
    function clamp(n, floor, ceil) {
        if (floor === void 0) { floor = 0; }
        if (ceil === void 0) { ceil = 1; }
        return Math.max(floor, Math.min(ceil, n));
    }
    LividLair.clamp = clamp;
    function shuffle(array) {
        var result = __spreadArrays(array);
        for (var i = result.length - 1; i > 0; i--) {
            // Generate random number 
            var j = Math.floor(Math.random() * (i + 1));
            var temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }
        return result;
    }
    LividLair.shuffle = shuffle;
    function randomIndex(excl_n) {
        return Math.min(excl_n - 1, Math.floor(Math.random() * excl_n));
    }
    LividLair.randomIndex = randomIndex;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
var LividLair;
(function (LividLair) {
    var ControllerButton;
    (function (ControllerButton) {
        ControllerButton[ControllerButton["A"] = 0] = "A";
        ControllerButton[ControllerButton["B"] = 1] = "B";
        ControllerButton[ControllerButton["X"] = 2] = "X";
        ControllerButton[ControllerButton["Y"] = 3] = "Y";
        ControllerButton[ControllerButton["LB"] = 4] = "LB";
        ControllerButton[ControllerButton["RB"] = 5] = "RB";
        ControllerButton[ControllerButton["LT"] = 6] = "LT";
        ControllerButton[ControllerButton["RT"] = 7] = "RT";
        ControllerButton[ControllerButton["BACK"] = 8] = "BACK";
        ControllerButton[ControllerButton["START"] = 9] = "START";
        ControllerButton[ControllerButton["LS"] = 10] = "LS";
        ControllerButton[ControllerButton["RS"] = 11] = "RS";
        ControllerButton[ControllerButton["Up"] = 12] = "Up";
        ControllerButton[ControllerButton["Down"] = 13] = "Down";
        ControllerButton[ControllerButton["Left"] = 14] = "Left";
        ControllerButton[ControllerButton["Right"] = 15] = "Right";
        ControllerButton[ControllerButton["HOME"] = 16] = "HOME";
        ControllerButton[ControllerButton["Count"] = 17] = "Count";
    })(ControllerButton = LividLair.ControllerButton || (LividLair.ControllerButton = {}));
    ;
    var Controller = /** @class */ (function () {
        function Controller() {
            this.leftAxis = new LividLair.Point(0, 0);
            this.rightAxis = new LividLair.Point(0, 0);
            this.pressed = [];
            this.justPressed = [];
            for (var i = 0; i < ControllerButton.Count; ++i) {
                this.pressed.push(false);
                this.justPressed.push(false);
            }
        }
        Controller.keyDown = function (key) { this.keyboard[key] = true; };
        Controller.keyUp = function (key) { this.keyboard[key] = false; };
        Controller.isKeyDown = function (key) {
            if (Controller.keyboard[key] !== undefined)
                return Controller.keyboard[key];
            return false;
        };
        Controller.prototype.setAxis = function (axis, x, y) {
            axis.x = x;
            axis.y = y;
            var len = axis.length();
            if (len < .3)
                axis.x = axis.y = 0;
        };
        Controller.prototype.getDirection = function () {
            var result = this.leftAxis.clone();
            if (this.pressed[ControllerButton.Left])
                result.x = -1;
            else if (this.pressed[ControllerButton.Right])
                result.x = 1;
            else if (this.pressed[ControllerButton.Up])
                result.y = -1;
            else if (this.pressed[ControllerButton.Down])
                result.y = 1;
            // result = result.normalize();
            if (Math.abs(result.x) < .4) {
                result.x = 0;
            }
            // if (Math.abs(result.x) > Math.abs(result.y))
            //     result.y = 0
            // else
            //     result.x = 0;
            return result;
        };
        Controller.prototype.update = function () {
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            if (gamepads.length == 0)
                return;
            var gp = gamepads[0];
            if (!gp)
                return;
            this.setAxis(this.leftAxis, gp.axes[0], gp.axes[1]);
            this.setAxis(this.rightAxis, gp.axes[2], gp.axes[3]);
            for (var i = 0; i < ControllerButton.Count; ++i) {
                var p = gp.buttons[i] ? gp.buttons[i].pressed : false;
                this.justPressed[i] = p && !this.pressed[i];
                this.pressed[i] = p;
            }
        };
        Controller.keyboard = {};
        return Controller;
    }());
    LividLair.Controller = Controller;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
var LividLair;
(function (LividLair) {
    var AABB = /** @class */ (function () {
        function AABB(center, width, height) {
            this.center = center.clone();
            this.halfWidth = width / 2;
            this.halfHeight = height / 2;
        }
        AABB.prototype.clone = function () {
            return new AABB(this.center, this.halfWidth * 2, this.halfHeight * 2);
        };
        AABB.prototype.equals = function (other) {
            return this.center == other.center && this.halfWidth == other.halfWidth && this.halfHeight == other.halfHeight;
        };
        AABB.prototype.union = function (other) {
            var minX = Math.min(this.center.x - this.halfWidth, other.center.x - other.halfWidth);
            var minY = Math.min(this.center.y - this.halfHeight, other.center.y - other.halfHeight);
            var maxX = Math.max(this.center.x + this.halfWidth, other.center.x + other.halfWidth);
            var maxY = Math.max(this.center.y + this.halfHeight, other.center.y + other.halfHeight);
            this.center.x = (minX + maxX) / 2;
            this.center.y = (minY + maxY) / 2;
            this.halfWidth = (maxX - minX) / 2;
            this.halfHeight = (maxY - minY) / 2;
            return this;
        };
        AABB.prototype.contains = function (p) {
            var dx = p.x - this.center.x;
            var dy = p.y - this.center.y;
            return Math.abs(dx) <= this.halfWidth && Math.abs(dy) <= this.halfHeight;
        };
        AABB.prototype.translate = function (p) {
            this.center.add(p);
            return this;
        };
        AABB.prototype.intersects = function (other) {
            var dx = other.center.x - this.center.x;
            var dy = other.center.y - this.center.y;
            return Math.abs(dx) < this.halfWidth + other.halfWidth && Math.abs(dy) < this.halfHeight + other.halfHeight;
        };
        AABB.prototype.calcMaxDisplacement = function (from, displacement) {
            return 0;
        };
        return AABB;
    }());
    LividLair.AABB = AABB;
})(LividLair || (LividLair = {}));
var LividLair;
(function (LividLair) {
    var Callback = /** @class */ (function () {
        function Callback(context, callback) {
            this.context = context;
            this.callback = callback;
        }
        Callback.prototype.call = function (caller) {
            this.callback.call(this.context, caller);
        };
        return Callback;
    }());
    LividLair.Callback = Callback;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="AABB.ts"/>
///<reference path="Callback.ts"/>
var LividLair;
(function (LividLair) {
    var GameObject = /** @class */ (function (_super) {
        __extends(GameObject, _super);
        function GameObject(width, height) {
            var _this = _super.call(this) || this;
            _this.destroyCallback = null;
            _this.boxWidth = width;
            _this.boxHeight = height;
            _this.velocity = new LividLair.Point(0, 0);
            _this.clampedPosition = new LividLair.Point(0, 0);
            _this.ignorePlatform = false;
            _this.bounceVelocityFrac = 0.5;
            return _this;
        }
        GameObject.prototype.getBoundingBox = function () {
            return new LividLair.AABB(new LividLair.Point(this.clampedPosition.x, this.clampedPosition.y), this.boxWidth, this.boxHeight);
        };
        GameObject.prototype.update = function (dt) {
            //...
        };
        GameObject.prototype.bounceOffWall = function (leftWall) {
            if (leftWall) {
                if (this.velocity.x <= 0) {
                    this.velocity.x = Math.floor(this.bounceVelocityFrac * -this.velocity.x);
                }
            }
            else {
                if (this.velocity.x >= 0) {
                    this.velocity.x = Math.floor(this.bounceVelocityFrac * -this.velocity.x);
                }
            }
        };
        GameObject.prototype.bounceOffCeiling = function () {
            if (this.velocity.y <= 0)
                this.velocity.y = Math.floor(this.bounceVelocityFrac * -this.velocity.y);
        };
        GameObject.prototype.bounceOffFloor = function () {
            this.bounceOffPlatform();
        };
        GameObject.prototype.bounceOffPlatform = function () {
            if (this.velocity.y >= 0)
                this.velocity.y = Math.floor(this.bounceVelocityFrac * -this.velocity.y);
        };
        return GameObject;
    }(PIXI.Graphics));
    LividLair.GameObject = GameObject;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>
var LividLair;
(function (LividLair) {
    var PlayerState;
    (function (PlayerState) {
        PlayerState[PlayerState["Idle"] = 0] = "Idle";
        PlayerState[PlayerState["Walk"] = 1] = "Walk";
        PlayerState[PlayerState["Jump"] = 2] = "Jump";
        PlayerState[PlayerState["Ledge"] = 3] = "Ledge";
        PlayerState[PlayerState["Climbing"] = 4] = "Climbing";
    })(PlayerState = LividLair.PlayerState || (LividLair.PlayerState = {}));
    ;
    var Wizard = /** @class */ (function (_super) {
        __extends(Wizard, _super);
        function Wizard() {
            var _this = _super.call(this, LividLair.PLAYER_WIDTH, LividLair.PLAYER_HEIGHT) || this;
            _this.maxJump = 6;
            // this.clear();
            // this.beginFill(0x00aaff, 1);
            // this.drawRoundedRect(-PLAYER_WIDTH / 2, -PLAYER_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT, .2 * GRID_UNIT_SIZE);
            // this.beginFill(0xff0000, 1);
            // this.drawCircle(0, 0, .05 * GRID_UNIT_SIZE);
            // this.endFill();
            _this.state = PlayerState.Idle;
            _this.faceRight = true;
            _this.floatTimer = 0;
            _this.noClimbBuffer = 0;
            _this.shootTimer = 0;
            _this.bounceVelocityFrac = 0;
            _this.grabObject = null;
            _this.justGrabbed = false;
            _this.shootAnimParam = 1;
            _this.wand = new PIXI.Graphics();
            _this.wand.beginFill(0xff0000);
            _this.wand.lineStyle(2, 0xaa0000);
            _this.wand.moveTo(-2, 5);
            _this.wand.lineTo(2, 5);
            _this.wand.lineTo(4, -45);
            _this.wand.arc(0, -55, 10, .3 * Math.PI, .1 * Math.PI, true);
            _this.wand.arc(5, -60, 5, .2 * Math.PI, 1.3 * Math.PI, false);
            _this.wand.arc(0, -55, 10, 1.6 * Math.PI, .7 * Math.PI, true);
            _this.wand.lineTo(-4, -45);
            _this.wand.closePath();
            _this.wand.beginFill(0x55aaff);
            _this.wand.lineStyle(0);
            _this.wand.drawCircle(9, -62, 4);
            _this.wand.beginFill(0xffffff, .5);
            _this.wand.drawCircle(9 + 2, -62 - 2, 2);
            _this.addChild(_this.wand);
            _this.meleeVisual = new PIXI.Graphics();
            _this.meleeVisual.beginFill(0xffffff, 0.5);
            _this.meleeVisual.moveTo(0, 0);
            _this.meleeVisual.bezierCurveTo(40, 10, 80, 10, 50, -20);
            _this.meleeVisual.bezierCurveTo(70, 0, 50, 5, 0, 0);
            _this.meleeVisual.x = 20;
            _this.meleeVisual.y = -25;
            _this.meleeVisual.scale.y = -1;
            _this.addChild(_this.meleeVisual);
            var gr = new PIXI.Graphics();
            gr.clear();
            gr.beginFill(0x00aaff, 1);
            gr.drawRoundedRect(-LividLair.PLAYER_WIDTH / 2, -LividLair.PLAYER_HEIGHT / 2, LividLair.PLAYER_WIDTH, LividLair.PLAYER_HEIGHT, .2 * LividLair.GRID_UNIT_SIZE);
            gr.beginFill(0xff0000, 1);
            gr.drawCircle(0, 0, .05 * LividLair.GRID_UNIT_SIZE);
            gr.endFill();
            _this.addChild(gr);
            return _this;
        }
        Wizard.prototype.grab = function (go) {
            this.grabObject = go;
            this.grabObject.ignorePlatform = true;
            this.goalGrabLoc = null;
        };
        Wizard.prototype.throw = function (vertDir) {
            if (this.grabObject) {
                this.grabObject.ignorePlatform = false;
                var dir = this.faceRight ? 1 : -1;
                if (vertDir > 0) {
                    this.grabObject.velocity.x = dir * 2;
                    this.grabObject.velocity.y = 0;
                }
                else if (vertDir < 0) {
                    this.grabObject.velocity.x = this.velocity.x + dir * 5;
                    this.grabObject.velocity.y = -15;
                }
                else {
                    this.grabObject.velocity.x = this.velocity.x + dir * 20;
                    this.grabObject.velocity.y = -5;
                }
                this.grabObject = null;
            }
        };
        Wizard.prototype.drop = function () {
            if (this.grabObject) {
                this.grabObject.ignorePlatform = false;
                this.grabObject.velocity.x = 0;
                this.grabObject.velocity.y = 0;
                this.grabObject = null;
            }
        };
        Wizard.prototype.jump = function () {
            this.velocity.y = -4;
            this.jumpBuffer = 0;
        };
        Wizard.prototype.continueJump = function () {
            if (this.jumpBuffer < this.maxJump && this.velocity.y < 0) {
                ++this.jumpBuffer;
                this.velocity.y = -4 - this.jumpBuffer;
            }
            else {
                this.jumpBuffer = this.maxJump;
            }
        };
        Wizard.prototype.stopJump = function () {
            this.jumpBuffer = this.maxJump;
        };
        Wizard.prototype.shoot = function () {
            this.shootAnimParam = 0;
        };
        Wizard.prototype.update = function (dt) {
            _super.prototype.update.call(this, dt);
            var prepShoot = this.shootAnimParam < .5;
            this.shootAnimParam = Math.min(1, this.shootAnimParam + dt / 0.5);
            if (prepShoot && this.shootAnimParam >= .5 && this.shootCallback)
                this.shootCallback.call(this);
            if (this.grabObject) {
                var w_box = this.getBoundingBox();
                var g_box = this.grabObject.getBoundingBox();
                this.grabObject.clampedPosition.x = this.clampedPosition.x;
                this.grabObject.clampedPosition.y = this.clampedPosition.y;
                this.grabObject.velocity.x = 0; //this.velocity.x;
                this.grabObject.velocity.y = 0; //this.velocity.y;
                this.grabObject.velocity.y -= w_box.halfHeight; // + g_box.halfHeight;
                /*

                let w_box = this.getBoundingBox();
                let g_box = this.grabObject.getBoundingBox();
                let goal_x = this.clampedPosition.x;
                let goal_y = this.clampedPosition.y - g_box.halfHeight - w_box.halfHeight;

                let drop = false;
                if (this.goalGrabLoc)
                    drop = !this.goalGrabLoc.contains(this.grabObject.clampedPosition);

                if (drop)
                    this.drop();
                else {
                    this.grabObject.velocity.x = goal_x - this.grabObject.clampedPosition.x;
                    this.grabObject.velocity.y = goal_y - this.grabObject.clampedPosition.y;
                    this.goalGrabLoc = new AABB(new Point(goal_x, goal_y), 30, 30);
                }
                */
                this.wand.visible = false;
            }
            else {
                this.updateWand();
            }
        };
        Wizard.prototype.updateWand = function () {
            this.wand.visible = true;
            var angle = 0;
            // let t = .5 - .5 * Math.cos(this.shootAnimParam * Math.PI);
            // ang_param = t * 2 * Math.PI;
            // let scaleY = .7 + .3 * Math.cos(this.shootAnimParam * 2 * Math.PI);
            var back_frac = 0.4;
            var whip_frac = 0.3;
            var min_ang = -0.5 * Math.PI;
            var mid_ang = 0.6 * Math.PI; //-1.4 * Math.PI;
            var end_ang = 0; //-2 * Math.PI;
            var scaleY = 1;
            var opacity = 0;
            if (this.shootAnimParam < back_frac) {
                var t = this.shootAnimParam / back_frac;
                angle = Math.sin(t * .5 * Math.PI) * min_ang;
            }
            else if (this.shootAnimParam < back_frac + whip_frac) {
                var t = (this.shootAnimParam - back_frac) / whip_frac;
                t = .5 - .5 * Math.cos(t * Math.PI);
                angle = (1 - t) * min_ang + t * mid_ang;
                scaleY = .3 + .7 * (.5 + .5 * Math.cos(t * 2 * Math.PI));
                opacity = .5 - .5 * Math.cos(t * Math.PI * 2);
            }
            else {
                var t = (this.shootAnimParam - back_frac - whip_frac) / (1 - back_frac - whip_frac);
                t = .5 - .5 * Math.cos(t * Math.PI);
                // let curr_end_ang = end_ang - Math.sin(t * 10) * .5 * Math.PI * (1 - t);
                angle = (1 - t) * mid_ang + t * end_ang;
                // scaleY = .3 + .7 * (.5 + .5 * Math.cos(t * 2 * Math.PI));
            }
            this.wand.rotation = angle * (this.faceRight ? 1 : -1);
            this.wand.scale.y = scaleY;
            this.meleeVisual.alpha = opacity;
            if (this.faceRight) {
                this.wand.x = 30;
                this.wand.scale.x = 1;
                this.meleeVisual.x = 20;
                this.meleeVisual.scale.x = -1;
            }
            else {
                this.wand.x = -30;
                this.wand.scale.x = -1;
                this.meleeVisual.x = -20;
                this.meleeVisual.scale.x = 1;
            }
        };
        Wizard.prototype.bounceOffFloor = function () {
            _super.prototype.bounceOffFloor.call(this);
            if (this.state == PlayerState.Climbing)
                this.state = PlayerState.Idle;
        };
        return Wizard;
    }(LividLair.GameObject));
    LividLair.Wizard = Wizard;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>
var LividLair;
(function (LividLair) {
    var Bullet = /** @class */ (function (_super) {
        __extends(Bullet, _super);
        function Bullet(p) {
            var _this = _super.call(this, 10, 10) || this;
            _this.lineStyle(2, 0xffffff);
            _this.beginFill(0xaa55ff, 1);
            _this.drawCircle(0, 0, 5);
            _this.endFill();
            _this.x = _this.clampedPosition.x = p.x;
            _this.y = _this.clampedPosition.y = p.y;
            _this.aliveTime = 0;
            _this.bounceVelocityFrac = .9;
            return _this;
        }
        Bullet.prototype.update = function (dt) {
            _super.prototype.update.call(this, dt);
        };
        return Bullet;
    }(LividLair.GameObject));
    LividLair.Bullet = Bullet;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>
var LividLair;
(function (LividLair) {
    var Rubee = /** @class */ (function (_super) {
        __extends(Rubee, _super);
        function Rubee() {
            var _this = _super.call(this, LividLair.GRID_UNIT_SIZE * .3, LividLair.GRID_UNIT_SIZE * .5) || this;
            if (Math.random() < .5)
                _this.clr = 0x33aa33;
            else if (Math.random() < .5)
                _this.clr = 0x3333aa;
            else
                _this.clr = 0xaa3333;
            _this.animParam = 0;
            _this.redraw();
            return _this;
        }
        Rubee.prototype.redraw = function () {
            var aabb = this.getBoundingBox();
            this.clear();
            var right = aabb.halfWidth - 1;
            var left = -right;
            var h0 = -aabb.halfHeight + 1;
            var h1 = -aabb.halfHeight / 2;
            var h2 = aabb.halfHeight / 2;
            var h3 = aabb.halfHeight - 1;
            this.lineStyle(0, 0xffffff);
            this.beginFill(this.clr, 1);
            this.moveTo(0, h0);
            this.lineTo(left, h1);
            this.lineTo(left, h2);
            this.lineTo(0, h3);
            this.lineTo(right, h2);
            this.lineTo(right, h1);
            this.closePath();
            this.endFill();
            this.lineStyle(2, 0xffffff, .5);
            this.moveTo(left, h1);
            this.lineTo(right, h1);
            this.moveTo(left, h2);
            this.lineTo(right, h2);
            for (var i = 0; i < 2; ++i) {
                var t = i * .5 + .5 * this.animParam;
                var x = (1 - t) * left + t * right;
                this.moveTo(0, h0);
                this.lineTo(x, h1);
                this.lineTo(x, h2);
                this.lineTo(0, h3);
            }
            this.lineStyle(2, 0xffffff);
            this.moveTo(0, h0);
            this.lineTo(left, h1);
            this.lineTo(left, h2);
            this.lineTo(0, h3);
            this.lineTo(right, h2);
            this.lineTo(right, h1);
            this.closePath();
        };
        Rubee.prototype.update = function (dt) {
            _super.prototype.update.call(this, dt);
            this.redraw();
            this.animParam = (this.animParam + dt / 2.0) % 1.0;
        };
        Rubee.prototype.bounceOffPlatform = function () {
            _super.prototype.bounceOffPlatform.call(this);
            this.velocity.x *= 0.9;
        };
        return Rubee;
    }(LividLair.GameObject));
    LividLair.Rubee = Rubee;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>
var LividLair;
(function (LividLair) {
    var Chest = /** @class */ (function (_super) {
        __extends(Chest, _super);
        function Chest() {
            var _this = this;
            var w = LividLair.GRID_UNIT_SIZE * .8;
            var h = LividLair.GRID_UNIT_SIZE * .6;
            _this = _super.call(this, LividLair.PLAYER_WIDTH, h) || this;
            _this.bounceVelocityFrac = .1;
            w -= 2;
            h -= 2;
            _this.clear();
            var rad = w * .3;
            var base_w = rad * .8;
            var top_y = -h / 2;
            var mid_y = top_y + rad;
            var btm_y = -top_y;
            _this.lineStyle(4, 0xCD853F);
            _this.beginFill(0x8B4513, 1);
            _this.moveTo(-w / 2 + rad, top_y);
            _this.lineTo(-w / 2 + rad - base_w, btm_y);
            _this.lineTo(w / 2 - rad + base_w, btm_y);
            _this.lineTo(w / 2, mid_y);
            _this.arcTo(w / 2, top_y, w / 2 - rad, top_y, rad);
            _this.closePath();
            _this.moveTo(-w / 2, mid_y);
            _this.lineTo(w / 2, mid_y);
            _this.lineStyle(4, 0xCD853F); //0x9e6329);
            _this.beginFill(0x70380f, 1);
            _this.moveTo(-w / 2 + 2 * rad, mid_y);
            _this.arcTo(-w / 2 + 2 * rad, top_y, -w / 2 + rad, top_y, rad);
            _this.arcTo(-w / 2, top_y, -w / 2, mid_y, rad);
            _this.lineTo(-w / 2 + rad - base_w, btm_y);
            _this.lineTo(-w / 2 + rad + base_w, btm_y);
            _this.closePath();
            _this.endFill();
            _this.moveTo(-w / 2, mid_y);
            _this.lineTo(-w / 2 + 2 * rad, mid_y);
            var rest_w = w - 2 * rad;
            var lock_x = w / 2 - rest_w / 2;
            _this.lineStyle(4, 0xaa5500);
            _this.beginFill(0xaa5500);
            _this.drawRoundedRect(lock_x - 10, mid_y - 5, 20, 10, 5);
            _this.beginFill(0xffcc55);
            _this.drawRoundedRect(lock_x - 5, mid_y - 5, 15, 10, 5);
            return _this;
        }
        Chest.prototype.update = function (dt) {
            _super.prototype.update.call(this, dt);
        };
        Chest.prototype.bounceOffPlatform = function () {
            _super.prototype.bounceOffPlatform.call(this);
            this.velocity.x *= 0.9;
        };
        return Chest;
    }(LividLair.GameObject));
    LividLair.Chest = Chest;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>
var LividLair;
(function (LividLair) {
    var Pot = /** @class */ (function (_super) {
        __extends(Pot, _super);
        function Pot() {
            var _this = this;
            var w = LividLair.GRID_UNIT_SIZE / 2;
            _this = _super.call(this, w, w) || this;
            w -= 4;
            _this.bounceVelocityFrac = .2;
            _this.beginFill(0x70380f);
            _this.lineStyle(4, 0x8B4513);
            _this.moveTo(-w * .4, -w / 2);
            _this.arc(-w * .4, -w * .4, w * .1, 1.5 * Math.PI, 0.5 * Math.PI, true);
            _this.arc(0, 0, .5 * w, 1.25 * Math.PI, 1.75 * Math.PI, true);
            _this.arc(w * .4, -w * .4, w * .1, 0.5 * Math.PI, 1.5 * Math.PI, true);
            _this.closePath();
            _this.lineStyle(0);
            _this.beginFill(0x8B4513);
            for (var i = 0; i < 7; ++i) {
                var x = w * ((i + 1) / 8.0 - .5);
                _this.drawCircle(x, (i % 2) * w * .1, w * .05);
            }
            _this.endFill();
            _this.beginFill(0xffffff, .1);
            _this.drawCircle(.25 * w, -.1 * w, .15 * w);
            return _this;
        }
        Pot.prototype.update = function (dt) {
            _super.prototype.update.call(this, dt);
        };
        Pot.prototype.bounceOffWall = function (leftWall) {
            if (this.destroyCallback && Math.abs(this.velocity.x) > this.velocity.y)
                this.destroyCallback.call(this);
            else
                _super.prototype.bounceOffWall.call(this, leftWall);
        };
        Pot.prototype.bounceOffPlatform = function () {
            if (this.destroyCallback && (this.velocity.y > 10 || Math.abs(this.velocity.x) > 2)) {
                this.destroyCallback.call(this);
            }
            else {
                _super.prototype.bounceOffPlatform.call(this);
                if (this.velocity.y)
                    this.velocity.x *= 0.5;
            }
        };
        return Pot;
    }(LividLair.GameObject));
    LividLair.Pot = Pot;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>
///<reference path="Defs.ts"/>
var LividLair;
(function (LividLair) {
    var Bomb = /** @class */ (function (_super) {
        __extends(Bomb, _super);
        function Bomb() {
            var _this = this;
            var w = LividLair.GRID_UNIT_SIZE / 2;
            _this = _super.call(this, w, w) || this;
            w -= 4;
            _this.bounceVelocityFrac = .2;
            _this.beginFill(0x0000ff);
            _this.lineStyle(4, 0x000055);
            _this.drawCircle(0, 0, w / 2);
            _this.beginFill(0x3333ff);
            _this.drawCircle(0, -w * .05, w * .45);
            _this.endFill();
            _this.overlay = new PIXI.Graphics();
            _this.overlay.alpha = 0;
            _this.overlay.beginFill(0xffaa00);
            _this.overlay.drawCircle(0, 0, w / 2);
            _this.addChild(_this.overlay);
            var shine = new PIXI.Graphics();
            _this.overlay.beginFill(0xffffff, 0.4);
            _this.overlay.drawCircle(.2 * w, -.2 * w, w * .1);
            _this.addChild(shine);
            _this.aliveTime = 0;
            return _this;
        }
        Bomb.prototype.update = function (dt) {
            _super.prototype.update.call(this, dt);
            this.aliveTime += dt;
            if (this.aliveTime > 3) {
                if (this.destroyCallback)
                    this.destroyCallback.call(this);
            }
            else {
                var t = 1 - Math.cos(Math.pow(this.aliveTime, 2.0) * 10);
                var basicFx = this.aliveTime * .3;
                t = ((1 - basicFx) * t + basicFx) * (.2 + .4 * this.aliveTime);
                this.overlay.alpha = t;
            }
        };
        Bomb.prototype.bounceOffPlatform = function () {
            _super.prototype.bounceOffPlatform.call(this);
            this.velocity.x *= 0.5;
        };
        return Bomb;
    }(LividLair.GameObject));
    LividLair.Bomb = Bomb;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>
var LividLair;
(function (LividLair) {
    var Potion = /** @class */ (function (_super) {
        __extends(Potion, _super);
        function Potion() {
            var _this = this;
            var w = LividLair.GRID_UNIT_SIZE / 2;
            _this = _super.call(this, w, w) || this;
            w -= 4;
            _this.bounceVelocityFrac = .2;
            _this.beginFill(0x00ffff, .5);
            _this.lineStyle(4, 0x00ffff);
            _this.moveTo(-w * .1, -w / 2);
            _this.arc(-w * .1, -w * .4, w * .1, 1.5 * Math.PI, 0.5 * Math.PI, true);
            _this.lineTo(-w * .1, -w * .2);
            _this.arc(0, .2 * w, .3 * w, 1.2 * Math.PI, 1.8 * Math.PI, true);
            _this.lineTo(w * .1, -w * .2);
            _this.lineTo(w * .1, -w * .3);
            _this.arc(w * .1, -w * .4, w * .1, 0.5 * Math.PI, 1.5 * Math.PI, true);
            _this.closePath();
            var clrs = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
            var idx = Math.min(clrs.length, Math.floor(Math.random() * clrs.length));
            _this.lineStyle(0);
            _this.beginFill(clrs[idx], .5);
            _this.moveTo(0, w * .05);
            _this.arc(0, .2 * w, .2 * w, 1.2 * Math.PI, 1.8 * Math.PI, true);
            _this.endFill();
            return _this;
        }
        Potion.prototype.update = function (dt) {
            _super.prototype.update.call(this, dt);
        };
        Potion.prototype.bounceOffWall = function (leftWall) {
            if (this.destroyCallback && Math.abs(this.velocity.x) > this.velocity.y)
                this.destroyCallback.call(this);
            else
                _super.prototype.bounceOffWall.call(this, leftWall);
        };
        Potion.prototype.bounceOffPlatform = function () {
            if (this.destroyCallback && (this.velocity.y > 10 || Math.abs(this.velocity.x) > 2)) {
                this.destroyCallback.call(this);
            }
            else {
                _super.prototype.bounceOffPlatform.call(this);
                if (this.velocity.y)
                    this.velocity.x *= 0.5;
            }
        };
        return Potion;
    }(LividLair.GameObject));
    LividLair.Potion = Potion;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>
var LividLair;
(function (LividLair) {
    var Particle = /** @class */ (function (_super) {
        __extends(Particle, _super);
        function Particle(clr, w) {
            var _this = _super.call(this, w, w) || this;
            _this.bounceVelocityFrac = .5;
            _this.beginFill(clr);
            _this.lineStyle(0);
            _this.drawCircle(0, 0, w / 2);
            _this.endFill();
            _this.aliveTime = 0;
            _this.pivot.y = 1;
            _this.pivot.x = 0;
            return _this;
        }
        Particle.prototype.update = function (dt) {
            _super.prototype.update.call(this, dt);
        };
        Particle.prototype.bounceOffPlatform = function () {
            _super.prototype.bounceOffPlatform.call(this);
            this.velocity.x *= 0.5;
        };
        return Particle;
    }(LividLair.GameObject));
    LividLair.Particle = Particle;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>
var LividLair;
(function (LividLair) {
    var RoomDirection;
    (function (RoomDirection) {
        RoomDirection[RoomDirection["Right"] = 0] = "Right";
        RoomDirection[RoomDirection["Down"] = 1] = "Down";
        RoomDirection[RoomDirection["Left"] = 2] = "Left";
        RoomDirection[RoomDirection["Up"] = 3] = "Up";
    })(RoomDirection = LividLair.RoomDirection || (LividLair.RoomDirection = {}));
    var LevelRoomData = /** @class */ (function () {
        function LevelRoomData() {
            this.adjacent = [null, null, null, null];
            this.connected = [false, false, false, false];
            this.isStart = false;
            this.isFinish = false;
            this.isMainPath = false;
            this.propagationVisited = false;
        }
        LevelRoomData.prototype.getRandomAdjacentIndex = function (filter) {
            var available = this.adjacent.filter(filter);
            var n = available.length;
            if (n > 0) {
                var idx = LividLair.randomIndex(n);
                var room = available[idx];
                return this.adjacent.indexOf(room);
            }
            return -1;
        };
        LevelRoomData.prototype.connect = function (n) {
            var idx = this.adjacent.indexOf(n);
            if (idx >= 0)
                this.connected[idx] = true;
        };
        LevelRoomData.prototype.tryMakeTreasureRoom = function () {
            if (this.connectToMainPath(false, 2)) {
                this.isTreasureRoom = true;
                return true;
            }
            return false;
        };
        LevelRoomData.prototype.createMainPath = function (steps) {
            this.isStart = true;
            this.propagateMainPath(null, steps);
        };
        LevelRoomData.prototype.connectToMainPath = function (allowStart, stepsLeft) {
            if (allowStart === void 0) { allowStart = false; }
            if (stepsLeft === void 0) { stepsLeft = -1; }
            if (stepsLeft == 0)
                return false;
            if (this.isFinish || (this.isStart && !allowStart) || this.isTreasureRoom)
                return false;
            if (this.isMainPath)
                return true;
            var opts = this.adjacent.filter(function (r) { return r != null; }).filter(function (r) { return !r.propagationVisited; });
            this.propagationVisited = true;
            for (var _i = 0, opts_1 = opts; _i < opts_1.length; _i++) {
                var opt = opts_1[_i];
                if (opt.connectToMainPath(allowStart, stepsLeft - 1)) {
                    var idx = this.adjacent.indexOf(opt);
                    this.connected[idx] = true;
                    opt.connect(this);
                    this.propagationVisited = false;
                    this.isMainPath = true;
                    return true;
                }
            }
            this.propagationVisited = false;
            return false;
        };
        LevelRoomData.prototype.propagateMainPath = function (parent, itsLeft) {
            if (itsLeft > 1) {
                //list open options:
                var opts = this.adjacent.filter(function (r) { return r != null; }).filter(function (r) { return !r.propagationVisited; });
                opts = LividLair.shuffle(opts);
                this.propagationVisited = true;
                for (var _i = 0, opts_2 = opts; _i < opts_2.length; _i++) {
                    var opt = opts_2[_i];
                    if (opt.propagateMainPath(this, itsLeft - 1)) {
                        //open connection to 'opt'
                        var idx = this.adjacent.indexOf(opt);
                        this.connected[idx] = true;
                        opt.connect(this);
                        this.propagationVisited = false;
                        this.isMainPath = true;
                        return true;
                    }
                }
                this.propagationVisited = false;
                return false;
            }
            else {
                //make sure the parent was from a horizontal adjacent tile:
                if (parent) {
                    var it = this.adjacent.indexOf(parent);
                    if (it == RoomDirection.Up || it == RoomDirection.Down)
                        return false;
                }
                //this is the finish!
                this.isFinish = true;
                this.isMainPath = true;
                return true;
            }
        };
        return LevelRoomData;
    }());
    LividLair.LevelRoomData = LevelRoomData;
    var LevelData = /** @class */ (function () {
        function LevelData(rows, cols) {
            this.rows = rows;
            this.columns = cols;
            var n = rows * cols;
            this.rooms = [];
            while (this.rooms.length < n)
                this.rooms.push(new LevelRoomData());
            //connect rooms:
            for (var i = 0; i < rows; ++i) {
                for (var j = 0; j < cols; ++j) {
                    var idx = i * cols + j;
                    var room = this.rooms[idx];
                    if (i > 0)
                        room.adjacent[RoomDirection.Up] = this.rooms[idx - cols];
                    if (i < rows - 1)
                        room.adjacent[RoomDirection.Down] = this.rooms[idx + cols];
                    if (j > 0)
                        room.adjacent[RoomDirection.Left] = this.rooms[idx - 1];
                    if (j < cols - 1)
                        room.adjacent[RoomDirection.Right] = this.rooms[idx + 1];
                }
            }
            //choose start chamber:
            var startIdx = LividLair.randomIndex(n);
            var steps = Math.floor(n * .6);
            this.rooms[startIdx].createMainPath(steps);
            //choose treasure room:
            var opts = this.rooms.filter(function (room) { return !room.isMainPath; });
            opts = LividLair.shuffle(opts);
            for (var _i = 0, opts_3 = opts; _i < opts_3.length; _i++) {
                var opt = opts_3[_i];
                if (opt.tryMakeTreasureRoom())
                    break;
            }
            opts = this.rooms.filter(function (room) { return !room.isMainPath; });
            for (var _a = 0, opts_4 = opts; _a < opts_4.length; _a++) {
                var opt = opts_4[_a];
                if (!opt.isMainPath)
                    opt.connectToMainPath(true);
            }
        }
        return LevelData;
    }());
    LividLair.LevelData = LevelData;
    var LevelMap = /** @class */ (function (_super) {
        __extends(LevelMap, _super);
        function LevelMap() {
            var _this = _super.call(this) || this;
            _this.gridWidth = 150;
            _this.player = new PIXI.Graphics();
            _this.player.lineStyle(2, 0x0088aa);
            _this.player.beginFill(0x55aaff);
            _this.player.drawCircle(0, 0, 5);
            _this.addChild(_this.player);
            _this.reset();
            return _this;
        }
        LevelMap.prototype.reset = function () {
            this.data = new LevelData(3, 4);
            this.redraw();
        };
        LevelMap.prototype.setWizardRoom = function (row, col) {
            var tileWidth = .9 * this.gridWidth / Math.max(this.data.rows, this.data.columns);
            var y = (row - (this.data.rows - 1) / 2.0) * tileWidth;
            var x = (col - (this.data.columns - 1) / 2.0) * tileWidth;
            this.player.x = x;
            this.player.y = y;
        };
        LevelMap.prototype.redraw = function () {
            this.clear();
            this.lineStyle(3, 0xffffff);
            this.beginFill(0x0, .5);
            this.drawRoundedRect(-this.gridWidth / 2, -this.gridWidth / 2, this.gridWidth, this.gridWidth, 5);
            this.endFill();
            var tileWidth = .9 * this.gridWidth / Math.max(this.data.rows, this.data.columns);
            var w = tileWidth * .6;
            this.lineStyle(3, 0xaaaaaa);
            for (var i = 0; i < this.data.rows; ++i) {
                var y = (i - (this.data.rows - 1) / 2.0) * tileWidth;
                for (var j = 0; j < this.data.columns; ++j) {
                    var x = (j - (this.data.columns - 1) / 2.0) * tileWidth;
                    var idx = i * this.data.columns + j;
                    var room = this.data.rooms[idx];
                    if (room.isStart)
                        this.beginFill(0x888888);
                    else if (room.isTreasureRoom)
                        this.beginFill(0xffffaa);
                    else if (room.isFinish)
                        this.beginFill(0xaa4400);
                    else
                        this.beginFill(0x0, 0);
                    this.lineStyle(3, 0xaaaaaa);
                    this.drawRoundedRect(x - w / 2, y - w / 2, w, w, w * .1);
                    this.lineStyle(8, 0xaaaaaa);
                    var dir = new LividLair.Point(1, 0);
                    for (var dIdx = 0; dIdx < 4; ++dIdx) {
                        if (room.connected[dIdx]) {
                            this.moveTo(x + tileWidth * .3 * dir.x, y + tileWidth * .3 * dir.y);
                            this.lineTo(x + tileWidth * .7 * dir.x, y + tileWidth * .7 * dir.y);
                        }
                        dir = new LividLair.Point(-dir.y, dir.x);
                    }
                }
            }
        };
        return LevelMap;
    }(PIXI.Graphics));
    LividLair.LevelMap = LevelMap;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>
var LividLair;
(function (LividLair) {
    var Platform = /** @class */ (function (_super) {
        __extends(Platform, _super);
        function Platform() {
            var _this = _super.call(this, LividLair.GRID_UNIT_SIZE, LividLair.GRID_UNIT_SIZE) || this;
            var hw = LividLair.GRID_UNIT_SIZE / 2;
            _this.beginFill(0x00aaff, 1);
            _this.drawRect(-hw, -hw, LividLair.GRID_UNIT_SIZE, LividLair.GRID_UNIT_SIZE * .1);
            _this.beginFill(0x00aaff, 0.5);
            _this.moveTo(-hw, -hw);
            _this.bezierCurveTo(-hw, 0, hw, 0, hw, -hw);
            _this.endFill();
            return _this;
        }
        return Platform;
    }(LividLair.GameObject));
    LividLair.Platform = Platform;
})(LividLair || (LividLair = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
var LividLair;
(function (LividLair) {
    var LairLoader = /** @class */ (function () {
        function LairLoader() {
        }
        LairLoader.loadLair = function (cb) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "scripts/loadLair.php");
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var obj = JSON.parse(this.response);
                    cb(obj);
                }
            };
            var formData = new FormData();
            xmlhttp.send(formData);
        };
        LairLoader.saveLair = function (data, cb) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "scripts/saveLair.php");
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("store result", this.response);
                    cb();
                }
            };
            var formData = new FormData();
            formData.append("data", JSON.stringify(data));
            xmlhttp.send(formData);
        };
        return LairLoader;
    }());
    LividLair.LairLoader = LairLoader;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="../LairLoader.ts"/>
var LividLair;
(function (LividLair) {
    var TileType;
    (function (TileType) {
        TileType["Empty"] = "E";
        TileType["Block"] = "B";
        TileType["BrittleBlock"] = "X";
        TileType["Platform"] = "-";
        TileType["Ladder"] = "|";
        TileType["CrossLadder"] = "+";
        TileType["PushBlock"] = "O";
        TileType["Wizard"] = "W";
        TileType["Chest"] = "C";
        TileType["Pot"] = "P";
        TileType["Rubee"] = "R";
        TileType["Exit"] = "F";
        TileType["Trampoline"] = "^";
    })(TileType = LividLair.TileType || (LividLair.TileType = {}));
    var RoomEntrancePosition;
    (function (RoomEntrancePosition) {
        RoomEntrancePosition[RoomEntrancePosition["LeftWallTop"] = 0] = "LeftWallTop";
        RoomEntrancePosition[RoomEntrancePosition["LeftWallBottom"] = 1] = "LeftWallBottom";
        RoomEntrancePosition[RoomEntrancePosition["RightWallTop"] = 2] = "RightWallTop";
        RoomEntrancePosition[RoomEntrancePosition["RightWallBottom"] = 3] = "RightWallBottom";
        RoomEntrancePosition[RoomEntrancePosition["CeilingLeft"] = 4] = "CeilingLeft";
        RoomEntrancePosition[RoomEntrancePosition["CeilingRight"] = 5] = "CeilingRight";
        RoomEntrancePosition[RoomEntrancePosition["FloorLeft"] = 6] = "FloorLeft";
        RoomEntrancePosition[RoomEntrancePosition["FloorRight"] = 7] = "FloorRight";
        RoomEntrancePosition[RoomEntrancePosition["Count"] = 8] = "Count";
    })(RoomEntrancePosition = LividLair.RoomEntrancePosition || (LividLair.RoomEntrancePosition = {}));
    var RoomEntranceType;
    (function (RoomEntranceType) {
        RoomEntranceType[RoomEntranceType["Bidirectional"] = 0] = "Bidirectional";
        RoomEntranceType[RoomEntranceType["Incoming"] = 1] = "Incoming";
        RoomEntranceType[RoomEntranceType["Outgoing"] = 2] = "Outgoing";
        RoomEntranceType[RoomEntranceType["Blocked"] = 3] = "Blocked";
        RoomEntranceType[RoomEntranceType["Count"] = 4] = "Count";
    })(RoomEntranceType = LividLair.RoomEntranceType || (LividLair.RoomEntranceType = {}));
    var RoomData = /** @class */ (function () {
        function RoomData(rows, cols) {
            this.rows = rows;
            this.columns = cols;
            this.tiles = [];
            var n = rows * cols;
            while (this.tiles.length < n)
                this.tiles.push(TileType.Empty);
            this.entrances = [];
            while (this.entrances.length < RoomEntrancePosition.Count)
                this.entrances.push(RoomEntranceType.Bidirectional);
        }
        RoomData.parse = function (json) {
            var result = new RoomData(json.rows, json.columns);
            result.rows = json.rows;
            result.columns = json.columns;
            if (json.tiles)
                result.tiles = __spreadArrays(json.tiles);
            if (json.entrances)
                result.entrances = __spreadArrays(json.entrances);
            result.resize(LividLair.ROOM_TILE_ROWS, LividLair.ROOM_TILE_COLUMNS);
            return result;
        };
        RoomData.prototype.resize = function (rows, cols) {
            var tiles = [];
            for (var i = 0; i < rows; ++i) {
                for (var j = 0; j < cols; ++j) {
                    var tile = TileType.Empty;
                    if (i < this.rows && j < this.columns)
                        tile = this.tiles[i * this.columns + j];
                    tiles[i * cols + j] = tile;
                }
            }
            this.rows = rows;
            this.columns = cols;
            this.tiles = __spreadArrays(tiles);
        };
        return RoomData;
    }());
    LividLair.RoomData = RoomData;
    var ConstructData = /** @class */ (function () {
        function ConstructData() {
        }
        ConstructData.parse = function (json) {
            var result = new ConstructData();
            result.rows = json.rows;
            result.columns = json.columns;
            if (json.tiles)
                result.tiles = __spreadArrays(json.tiles);
            return result;
        };
        return ConstructData;
    }());
    LividLair.ConstructData = ConstructData;
    var LairData = /** @class */ (function () {
        function LairData() {
            //...
        }
        LairData.prototype.parse = function (json) {
            this.rooms = [];
            for (var _i = 0, _a = json.rooms; _i < _a.length; _i++) {
                var r = _a[_i];
                this.rooms.push(RoomData.parse(r));
            }
            this.constructs = [];
            for (var _b = 0, _c = json.constructs; _b < _c.length; _b++) {
                var c = _c[_b];
                this.constructs.push(ConstructData.parse(c));
            }
        };
        LairData.prototype.save = function () {
            LividLair.LairLoader.saveLair(this, function () { console.log("lair saved..."); });
        };
        LairData.instance = new LairData();
        return LairData;
    }());
    LividLair.LairData = LairData;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>
var LividLair;
(function (LividLair) {
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
        var toHex = function (channel) { return Math.floor(channel * 0xff); };
        return toHex(r) * 0x10000 + toHex(g) * 0x100 + toHex(b) * 0x1;
    }
    LividLair.HSVtoRGB = HSVtoRGB;
    var Trampoline = /** @class */ (function (_super) {
        __extends(Trampoline, _super);
        function Trampoline() {
            var _this = _super.call(this, LividLair.GRID_UNIT_SIZE / 2, LividLair.GRID_UNIT_SIZE / 2) || this;
            _this.wobbleParam = 1;
            var hw = LividLair.GRID_UNIT_SIZE / 2;
            var hy = LividLair.GRID_UNIT_SIZE / 4;
            var bezierScaleX = 1.6;
            var y_offset = -hy;
            var top_y = -hy * 1.4;
            _this.mushroom = new PIXI.Graphics();
            _this.addChild(_this.mushroom);
            var hue = Math.random();
            var rgb1 = HSVtoRGB(hue, 1, 1);
            var rgb2 = HSVtoRGB(hue, 1, .5);
            _this.mushroom.beginFill(0xffffff);
            _this.mushroom.lineStyle(3, 0xffAA88);
            _this.mushroom.drawRoundedRect(-hw / 2, y_offset - 1.5, hw, hy, .5 * hy);
            _this.mushroom.lineStyle(2, rgb2);
            _this.mushroom.beginFill(rgb1);
            _this.mushroom.moveTo(0, top_y + y_offset);
            _this.mushroom.bezierCurveTo(-hw / 2 * bezierScaleX, top_y + y_offset, -hw * bezierScaleX, hy / 2 + y_offset, 0, hy / 2 + y_offset);
            _this.mushroom.bezierCurveTo(hw * bezierScaleX, hy / 2 + y_offset, hw / 2 * bezierScaleX, top_y + y_offset, 0, top_y + y_offset);
            _this.mushroom.lineStyle(0);
            _this.mushroom.beginFill(0xffffff, .5);
            _this.mushroom.drawEllipse(-hw * .5, -hw * .2 + y_offset, .25 * hw, .2 * hw);
            _this.mushroom.drawEllipse(hw * .15, -hw * .5 + y_offset, .2 * hw, .1 * hw);
            _this.mushroom.drawEllipse(hw * .5, -hw * .1 + y_offset, .1 * hw, .1 * hw);
            _this.mushroom.endFill();
            _this.mushroom.position.y = -y_offset;
            return _this;
        }
        Trampoline.prototype.update = function (dt) {
            this.wobbleParam = Math.min(1, this.wobbleParam + dt);
            var scaleX = 1 + .2 * Math.sin(this.wobbleParam * 20) * (1 - this.wobbleParam);
            this.mushroom.scale.x = scaleX;
            this.mushroom.scale.y = 2 - scaleX;
        };
        Trampoline.prototype.wobble = function () {
            this.wobbleParam = 0;
        };
        return Trampoline;
    }(LividLair.GameObject));
    LividLair.Trampoline = Trampoline;
})(LividLair || (LividLair = {}));
///<reference path="../../../../pixi/pixi.js.d.ts"/>
var LividLair;
(function (LividLair) {
    var Heart = /** @class */ (function (_super) {
        __extends(Heart, _super);
        function Heart() {
            var _this = _super.call(this) || this;
            _this.isFull = true;
            var drawHeart = function (gr, w) {
                var hw = w / 2;
                var mid_y = -hw * .4;
                var side_y = -hw * .3;
                gr.moveTo(0, mid_y);
                gr.bezierCurveTo(0, -hw, -hw, -hw, -hw, side_y);
                gr.bezierCurveTo(-hw, hw * .25, -hw, hw * .25, 0, hw);
                gr.bezierCurveTo(hw, hw * .25, hw, hw * .25, hw, side_y);
                gr.bezierCurveTo(hw, -hw, 0, -hw, 0, mid_y);
                gr.closePath();
                gr.endFill();
            };
            _this.lineStyle(8, 0x880000);
            _this.beginFill(0x0);
            drawHeart(_this, 20);
            _this.lineStyle(1, 0xaa0000);
            _this.beginFill(0xff0000);
            drawHeart(_this, 20);
            _this.lineStyle(0);
            _this.beginFill(0xffffff, .5);
            _this.drawCircle(5, -5, 3);
            return _this;
        }
        return Heart;
    }(PIXI.Graphics));
    LividLair.Heart = Heart;
})(LividLair || (LividLair = {}));
///<reference path="../../../../pixi/pixi.js.d.ts"/>
///<reference path="Heart.ts"/>
var LividLair;
(function (LividLair) {
    var Hud = /** @class */ (function (_super) {
        __extends(Hud, _super);
        function Hud() {
            var _this = _super.call(this) || this;
            _this.maxHearts = 4;
            _this.hearts = 4;
            _this.clear();
            _this.beginFill(0x0, .3);
            _this.drawRoundedRect(10, 10, 200, 40, 5);
            for (var i = 0; i < 5; ++i) {
                var h = new LividLair.Heart();
                h.x = 10 + (i + .5) * 35;
                h.y = 30;
                _this.addChild(h);
            }
            return _this;
        }
        Hud.prototype.update = function (dt) {
            this.redraw();
        };
        Hud.prototype.redraw = function () {
            this.clear();
        };
        return Hud;
    }(PIXI.Graphics));
    LividLair.Hud = Hud;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Controller.ts"/>
///<reference path="GameObject.ts"/>
///<reference path="Wizard.ts"/>
///<reference path="Bullet.ts"/>
///<reference path="Rubee.ts"/>
///<reference path="Chest.ts"/>
///<reference path="Pot.ts"/>
///<reference path="Bomb.ts"/>
///<reference path="Potion.ts"/>
///<reference path="Particle.ts"/>
///<reference path="LevelMap.ts"/>
///<reference path="Platform.ts"/>
///<reference path="LairData.ts"/>
///<reference path="Trampoline.ts"/>
///<reference path="hud/Hud.ts"/>
var LividLair;
(function (LividLair) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(w, h) {
            var _this = _super.call(this) || this;
            _this.tmpDir = 0;
            _this.screenSize = new LividLair.Point(w, h);
            _this.controller = new LividLair.Controller();
            // let background = new PIXI.Graphics();
            // background.beginFill(0x0, 0.5);
            // background.drawRect(0, 0, w, h);
            // this.addChild(background);
            _this.bricksTexture = PIXI.Texture.fromImage('assets/bricks.png');
            _this.cracksTexture = PIXI.Texture.fromImage('assets/cracks.png');
            _this.levelContainer = new PIXI.Container();
            // this.levelContainer.addChild(wall);
            _this.addChild(_this.levelContainer);
            _this.backElements = new PIXI.Container();
            _this.levelContainer.addChild(_this.backElements);
            _this.wizard = new LividLair.Wizard();
            _this.wizard.x = w / 2;
            _this.wizard.y = h / 2;
            _this.wizard.clampedPosition = new LividLair.Point(w / 2, h / 2);
            _this.levelContainer.addChild(_this.wizard);
            _this.frontElements = new PIXI.Container();
            _this.levelContainer.addChild(_this.frontElements);
            _this.debugLayer = new PIXI.Container();
            _this.debugLayer.visible = false;
            _this.levelContainer.addChild(_this.debugLayer);
            _this.wizard.floatTimer = 0;
            _this.wizard.velocity = new LividLair.Point(0, 0);
            _this.map = new LividLair.LevelMap();
            _this.map.x = w - 80;
            _this.map.y = 80;
            _this.addChild(_this.map);
            _this.hud = new LividLair.Hud();
            _this.addChild(_this.hud);
            return _this;
        }
        Game.prototype.setup = function () {
            this.setupWall();
            this.resetLevel();
        };
        Game.prototype.setupWall = function () {
            var tex = PIXI.Texture.fromImage('assets/backWall2.png');
            tex.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
            this.wallUniforms = {
                uTexture: { type: 'sampler2D', value: tex, textureData: { repeat: true } },
                uResolution: { type: 'vec2', value: { x: LividLair.APP_WIDTH, y: LividLair.APP_HEIGHT } },
                uTextureSize: { type: 'vec2', value: { x: 200, y: 200 } },
                uCameraPosition: { type: 'vec2', value: { x: 0, y: 0 } },
                uRelativeLightPos: { type: 'vec2', value: { x: 0, y: 0 } }
            };
            var shader = new PIXI.Filter(PIXI.loader.resources.vertexShader.data, PIXI.loader.resources.wallShader.data, this.wallUniforms);
            var wall = new PIXI.Graphics();
            wall.beginFill(0xffffff);
            wall.drawRect(0, 0, LividLair.APP_WIDTH, LividLair.APP_HEIGHT);
            wall.filters = [shader];
            this.addChildAt(wall, 0);
        };
        Game.prototype.updateWall = function () {
            var center = this.wallUniforms.uCameraPosition.value;
            center.x = this.levelContainer.x;
            center.y = this.levelContainer.y;
            var light = this.wallUniforms.uRelativeLightPos.value;
            light.x = (this.wizard.x + this.levelContainer.x) / LividLair.APP_WIDTH;
            light.y = (this.wizard.y + this.levelContainer.y) / LividLair.APP_HEIGHT;
        };
        Game.prototype.resetLevel = function () {
            this.map.reset();
            var startRooms = [];
            var endRooms = [];
            var treasureRooms = [];
            var regularRooms = [];
            for (var i_1 = 0; i_1 < LividLair.LairData.instance.rooms.length; ++i_1) {
                var r = LividLair.LairData.instance.rooms[i_1];
                if (r.tiles.filter(function (t) { return t == LividLair.TileType.Wizard; }).length > 0)
                    startRooms.push(r);
                else if (r.tiles.filter(function (t) { return t == LividLair.TileType.Exit; }).length > 0)
                    endRooms.push(r);
                else if (r.tiles.filter(function (t) { return t == LividLair.TileType.Chest; }).length > 1)
                    treasureRooms.push(r);
                else
                    regularRooms.push(r);
            }
            startRooms = LividLair.shuffle(startRooms);
            endRooms = LividLair.shuffle(endRooms);
            treasureRooms = LividLair.shuffle(treasureRooms);
            regularRooms = LividLair.shuffle(regularRooms);
            if (regularRooms.length == 0)
                regularRooms.push(new LividLair.RoomData(LividLair.ROOM_TILE_ROWS, LividLair.ROOM_TILE_COLUMNS));
            var hRoomCount = this.map.data.columns;
            var vRoomCount = this.map.data.rows;
            this.blocks = [];
            this.brittleBlocks = [];
            this.platforms = [];
            this.ladders = [];
            this.pushBlocks = [];
            this.rubees = [];
            this.bullets = [];
            this.chests = [];
            this.pots = [];
            this.bombs = [];
            this.potions = [];
            this.particles = [];
            this.exits = [];
            this.trampolines = [];
            this.backElements.removeChildren();
            this.frontElements.removeChildren();
            this.wizard.grabObject = null;
            var divisionWidth = (LividLair.GRID_INCLUDE_DIVISION ? 1 : 0);
            this.rows = vRoomCount * (LividLair.ROOM_TILE_ROWS + divisionWidth) + 2 * LividLair.OUTER_BORDER_TILE_COUNT - divisionWidth;
            this.columns = hRoomCount * (LividLair.ROOM_TILE_COLUMNS + divisionWidth) + 2 * LividLair.OUTER_BORDER_TILE_COUNT - divisionWidth;
            var playerRow = Math.round(this.rows * .2);
            var playerColumn = Math.round(this.columns / 2);
            //create solid boundary:
            for (var side = 0; side < 2; ++side) {
                for (var i = 0; i < LividLair.OUTER_BORDER_TILE_COUNT; ++i) {
                    var row = side == 0 ? i : (this.rows - 1 - i);
                    for (var j = 0; j < this.columns; ++j) {
                        this.pushSolidBlock(row, j, true);
                    }
                }
                for (var j = 0; j < LividLair.OUTER_BORDER_TILE_COUNT; ++j) {
                    var col = side == 0 ? j : (this.columns - 1 - j);
                    for (var i = LividLair.OUTER_BORDER_TILE_COUNT; i < this.rows - LividLair.OUTER_BORDER_TILE_COUNT; ++i) {
                        this.pushSolidBlock(i, col, true);
                    }
                }
            }
            var getRoomFrom = function (roomList) {
                if (roomList.length == 0)
                    roomList = LividLair.LairData.instance.rooms; //regularRooms;
                return roomList[LividLair.randomIndex(roomList.length)];
            };
            this.debugLayer.removeChildren();
            //create rooms:
            for (var ri = 0; ri < vRoomCount; ++ri) {
                for (var rj = 0; rj < hRoomCount; ++rj) {
                    var room_idx = ri * hRoomCount + rj;
                    var room = this.map.data.rooms[room_idx];
                    var roomData = void 0;
                    if (room.isStart)
                        roomData = getRoomFrom(startRooms);
                    else if (room.isFinish)
                        roomData = getRoomFrom(endRooms);
                    else if (room.isTreasureRoom)
                        roomData = getRoomFrom(treasureRooms);
                    else
                        roomData = regularRooms[room_idx % regularRooms.length];
                    // roomData = LairData.instance.rooms[0];
                    var flipX = Math.random() < .5;
                    if (room.isFinish)
                        flipX = room.connected[LividLair.RoomDirection.Right];
                    for (var ti = 0; ti < LividLair.ROOM_TILE_ROWS; ++ti) {
                        for (var tj = 0; tj < LividLair.ROOM_TILE_COLUMNS; ++tj) {
                            var tjj = tj;
                            if (flipX)
                                tjj = LividLair.ROOM_TILE_COLUMNS - tjj - 1;
                            var global_i = LividLair.OUTER_BORDER_TILE_COUNT + ri * (LividLair.ROOM_TILE_ROWS + divisionWidth) + ti;
                            var global_j = LividLair.OUTER_BORDER_TILE_COUNT + rj * (LividLair.ROOM_TILE_COLUMNS + divisionWidth) + tj; //note! don't flip global index
                            if (ti == 0 && tj == 0) {
                                var gr = new PIXI.Graphics();
                                gr.beginFill(0xffffff, .2);
                                gr.drawRoundedRect((global_j) * LividLair.GRID_UNIT_SIZE + 5, (global_i) * LividLair.GRID_UNIT_SIZE + 5, LividLair.ROOM_TILE_COLUMNS * LividLair.GRID_UNIT_SIZE - 10, LividLair.ROOM_TILE_ROWS * LividLair.GRID_UNIT_SIZE - 10, .3 * LividLair.GRID_UNIT_SIZE);
                                this.debugLayer.addChild(gr);
                            }
                            var idx = ti * LividLair.ROOM_TILE_COLUMNS + tjj;
                            var type = roomData.tiles[idx];
                            if (LividLair.CLOSE_WALLS && (ti == 0 && !room.connected[LividLair.RoomDirection.Up]
                                || ti == LividLair.ROOM_TILE_ROWS - 1 && !room.connected[LividLair.RoomDirection.Down]
                                || tj == 0 && !room.connected[LividLair.RoomDirection.Left]
                                || tj == LividLair.ROOM_TILE_COLUMNS - 1 && !room.connected[LividLair.RoomDirection.Right])) {
                                type = LividLair.TileType.Block;
                            }
                            switch (type) {
                                case LividLair.TileType.Block:
                                    this.pushSolidBlock(global_i, global_j, false);
                                    break;
                                case LividLair.TileType.Ladder:
                                    this.pushLadder(global_i, global_j);
                                    break;
                                case LividLair.TileType.Platform:
                                    this.pushPlatform(global_i, global_j);
                                    break;
                                case LividLair.TileType.CrossLadder:
                                    this.pushLadder(global_i, global_j);
                                    this.pushPlatform(global_i, global_j);
                                    break;
                                case LividLair.TileType.PushBlock:
                                    this.pushPushBlock(global_i, global_j, 0xaaaaaa);
                                    break;
                                case LividLair.TileType.Rubee:
                                    this.pushRubee(global_i, global_j);
                                    break;
                                case LividLair.TileType.Chest:
                                    this.pushChest(global_i, global_j);
                                    break;
                                case LividLair.TileType.Pot:
                                    this.pushPot(global_i, global_j);
                                    break;
                                case LividLair.TileType.BrittleBlock:
                                    this.pushSolidBlock(global_i, global_j, false, true);
                                    break;
                                case LividLair.TileType.Exit:
                                    this.pushExit(global_i, global_j);
                                    break;
                                case LividLair.TileType.Wizard:
                                    playerRow = global_i;
                                    playerColumn = global_j;
                                    break;
                                case LividLair.TileType.Trampoline:
                                    this.pushTrampoline(global_i, global_j);
                                    break;
                            }
                        }
                    }
                    if (LividLair.GRID_INCLUDE_DIVISION) {
                        var skipTileH = function (idx, mid) { return Math.abs(idx - mid) < 2; };
                        var skipTileV = function (idx, mid) { return idx == mid || idx == mid - 1; }; //idx == mid || idx == mid - 1; };
                        var bottomRow = ri < vRoomCount - 1;
                        if (bottomRow) {
                            var global_i = LividLair.OUTER_BORDER_TILE_COUNT + (ri + 1) * (LividLair.ROOM_TILE_ROWS + divisionWidth) - 1;
                            var global_base_j = LividLair.OUTER_BORDER_TILE_COUNT + rj * (LividLair.ROOM_TILE_COLUMNS + 1);
                            var center_j = Math.floor(LividLair.ROOM_TILE_COLUMNS / 2);
                            for (var j_1 = 0; j_1 < LividLair.ROOM_TILE_COLUMNS; ++j_1) {
                                var global_j = global_base_j + j_1;
                                if (skipTileH(j_1, center_j) && room.connected[LividLair.RoomDirection.Down])
                                    continue;
                                else
                                    this.pushSolidBlock(global_i, global_j, true);
                            }
                        }
                        var rightColumn = rj < hRoomCount - 1;
                        if (rightColumn) {
                            var global_j = LividLair.OUTER_BORDER_TILE_COUNT + (rj + 1) * (LividLair.ROOM_TILE_COLUMNS + divisionWidth) - 1;
                            var global_base_i = LividLair.OUTER_BORDER_TILE_COUNT + ri * (LividLair.ROOM_TILE_ROWS + 1);
                            var center_i = Math.floor(LividLair.ROOM_TILE_ROWS / 2);
                            for (var i_2 = 0; i_2 < LividLair.ROOM_TILE_ROWS; ++i_2) {
                                if (skipTileV(i_2, center_i) && room.connected[LividLair.RoomDirection.Right])
                                    continue;
                                var global_i = global_base_i + i_2;
                                this.pushSolidBlock(global_i, global_j, true);
                            }
                        }
                        if (bottomRow && rightColumn) {
                            var global_i = LividLair.OUTER_BORDER_TILE_COUNT + (ri + 1) * (LividLair.ROOM_TILE_ROWS + divisionWidth) - 1;
                            var global_j = LividLair.OUTER_BORDER_TILE_COUNT + (rj + 1) * (LividLair.ROOM_TILE_COLUMNS + divisionWidth) - 1;
                            this.pushSolidBlock(global_i, global_j, true);
                        }
                    }
                }
            }
            this.alignPositionToGrid(this.wizard, playerRow, playerColumn);
            this.wizard.clampedPosition.x = this.wizard.x;
            this.wizard.clampedPosition.y = this.wizard.y;
            this.fixCamera(false);
        };
        Game.prototype.pushPlatform = function (row, col) {
            var gr = new LividLair.Platform();
            this.alignPositionToGrid(gr, row, col);
            this.backElements.addChild(gr);
            this.platforms.push(gr);
        };
        Game.prototype.pushExit = function (row, col) {
            var gr = new LividLair.GameObject(LividLair.GRID_UNIT_SIZE, LividLair.GRID_UNIT_SIZE);
            gr.beginFill(0xaa0000, 1);
            gr.drawRect(-LividLair.GRID_UNIT_SIZE * .4, -LividLair.GRID_UNIT_SIZE / 2, LividLair.GRID_UNIT_SIZE * .8, LividLair.GRID_UNIT_SIZE);
            gr.beginFill(0x888888, 1);
            gr.drawRect(-LividLair.GRID_UNIT_SIZE * .3, -LividLair.GRID_UNIT_SIZE * .4, LividLair.GRID_UNIT_SIZE * .6, LividLair.GRID_UNIT_SIZE * .9);
            gr.endFill();
            this.alignPositionToGrid(gr, row, col);
            this.backElements.addChild(gr);
            this.exits.push(gr);
        };
        Game.prototype.pushSolidBlock = function (row, col, darken, brittle) {
            if (brittle === void 0) { brittle = false; }
            var gr = new LividLair.GameObject(LividLair.GRID_UNIT_SIZE, LividLair.GRID_UNIT_SIZE);
            gr.beginFill(0x0, 1);
            gr.drawRect(-LividLair.GRID_UNIT_SIZE / 2, -LividLair.GRID_UNIT_SIZE / 2, LividLair.GRID_UNIT_SIZE, LividLair.GRID_UNIT_SIZE);
            gr.endFill();
            this.alignPositionToGrid(gr, row, col);
            this.backElements.addChild(gr);
            // let data = PIXI.loader.resources['bricks'].data;
            var img = new PIXI.Sprite(this.bricksTexture);
            img.width = img.height = LividLair.GRID_UNIT_SIZE;
            img.x = -LividLair.GRID_UNIT_SIZE / 2;
            img.y = -LividLair.GRID_UNIT_SIZE / 2;
            if (darken)
                img.alpha = 0.75;
            else if (brittle)
                img.alpha = 0.9;
            gr.addChild(img);
            if (brittle) {
                img = new PIXI.Sprite(this.cracksTexture);
                img.width = img.height = LividLair.GRID_UNIT_SIZE;
                img.x = -LividLair.GRID_UNIT_SIZE / 2;
                img.y = -LividLair.GRID_UNIT_SIZE / 2;
                img.alpha = 0.65;
                gr.addChild(img);
                this.brittleBlocks.push(gr);
            }
            else
                this.blocks.push(gr);
        };
        Game.prototype.pushPushBlock = function (row, col, color) {
            var gr = new LividLair.GameObject(LividLair.GRID_UNIT_SIZE, LividLair.GRID_UNIT_SIZE);
            gr.beginFill(color, 1);
            gr.drawRoundedRect(-LividLair.GRID_UNIT_SIZE / 2, -LividLair.GRID_UNIT_SIZE / 2, LividLair.GRID_UNIT_SIZE, LividLair.GRID_UNIT_SIZE, .2 * LividLair.GRID_UNIT_SIZE);
            gr.beginFill(0x555555, 1);
            gr.drawRoundedRect(-LividLair.GRID_UNIT_SIZE * .45, -LividLair.GRID_UNIT_SIZE * .45, LividLair.GRID_UNIT_SIZE * .9, LividLair.GRID_UNIT_SIZE * .9, .15 * LividLair.GRID_UNIT_SIZE);
            gr.beginFill(color, 1);
            gr.drawRoundedRect(-LividLair.GRID_UNIT_SIZE * .4, -LividLair.GRID_UNIT_SIZE * .4, LividLair.GRID_UNIT_SIZE * .8, LividLair.GRID_UNIT_SIZE * .8, .1 * LividLair.GRID_UNIT_SIZE);
            gr.endFill();
            gr.bounceVelocityFrac = 0;
            this.alignPositionToGrid(gr, row, col);
            this.backElements.addChild(gr);
            this.pushBlocks.push(gr);
        };
        Game.prototype.pushLadder = function (row, col) {
            var color = 0xA0522D;
            var gr = new LividLair.GameObject(LividLair.LADDER_WIDTH, LividLair.GRID_UNIT_SIZE);
            var th = .1 * LividLair.GRID_UNIT_SIZE;
            var left = -LividLair.LADDER_WIDTH / 2 + th / 2;
            var right = -left;
            gr.lineStyle(th, color);
            gr.moveTo(left, -LividLair.GRID_UNIT_SIZE * .5);
            gr.lineTo(left, LividLair.GRID_UNIT_SIZE * .5);
            gr.moveTo(right, -LividLair.GRID_UNIT_SIZE * .5);
            gr.lineTo(right, LividLair.GRID_UNIT_SIZE * .5);
            gr.lineStyle(1.2 * th, color);
            var reps = 4;
            for (var i = 0; i < reps; ++i) {
                var y = LividLair.GRID_UNIT_SIZE * ((i + 0.5) / reps - .5);
                gr.moveTo(left, y);
                gr.lineTo(right, y);
            }
            this.alignPositionToGrid(gr, row, col);
            this.backElements.addChild(gr);
            this.ladders.push(gr);
        };
        Game.prototype.pushRubee = function (row, col) {
            var gr = new LividLair.Rubee();
            this.alignPositionToGrid(gr, row, col);
            this.backElements.addChild(gr);
            this.rubees.push(gr);
        };
        Game.prototype.pushChest = function (row, col) {
            var c = new LividLair.Chest();
            this.alignPositionToGrid(c, row, col);
            this.frontElements.addChild(c);
            this.chests.push(c);
        };
        Game.prototype.pushPot = function (row, col) {
            var p = new LividLair.Pot();
            p.destroyCallback = new LividLair.Callback(this, this.breakPot);
            this.alignPositionToGrid(p, row, col);
            this.frontElements.addChild(p);
            this.pots.push(p);
        };
        Game.prototype.pushTrampoline = function (row, col) {
            var p = new LividLair.Trampoline();
            this.alignPositionToGrid(p, row, col);
            this.frontElements.addChild(p);
            this.trampolines.push(p);
        };
        Game.prototype.shoot = function (vertDir) {
            if (this.wizard.grabObject) {
                this.wizard.throw(vertDir);
                return;
            }
            else if (this.wizard.shootTimer > 0 || this.wizard.shootAnimParam < .9)
                return;
            this.tmpDir = vertDir;
            this.wizard.shootCallback = new LividLair.Callback(this, this.actualShootage);
            this.wizard.shoot();
            // //otherwise shoot bullet:
            // let gr = new Bullet(this.wizard.clampedPosition.clone());
            // gr.velocity.x = this.wizard.velocity.x / 2 + (this.wizard.faceRight ? 1 : -1) * (vertDir == 0 ? 10 : 5);
            // if (vertDir < 0)
            //     gr.velocity.y = -15;
            // else if (vertDir > 0)
            //     gr.velocity.y = 5;
            // else
            //     gr.velocity.y = -5;
            // this.wizard.shoot();
            // this.frontElements.addChild(gr);
            // this.bullets.push(gr);
            // this.wizard.shootTimer = 0.5;
        };
        Game.prototype.actualShootage = function () {
            //otherwise shoot bullet:
            var pos = this.wizard.clampedPosition.clone();
            pos.x += (this.wizard.faceRight ? 1 : -1) * 5;
            pos.y -= 0;
            var gr = new LividLair.Bullet(pos);
            gr.velocity.x = this.wizard.velocity.x / 2 + (this.wizard.faceRight ? 1 : -1) * (this.tmpDir == 0 ? 10 : 5);
            if (this.tmpDir < 0)
                gr.velocity.y = -15;
            else if (this.tmpDir > 0)
                gr.velocity.y = 5;
            else
                gr.velocity.y = -5;
            // this.wizard.shoot();
            this.frontElements.addChild(gr);
            this.bullets.push(gr);
            this.wizard.shootTimer = 0.5;
        };
        Game.prototype.alignPositionToGrid = function (p, row, column) {
            p.clampedPosition.x = p.position.x = (column + 0.5) * LividLair.GRID_UNIT_SIZE;
            p.clampedPosition.y = p.position.y = (row + 0.5) * LividLair.GRID_UNIT_SIZE;
        };
        Game.prototype.fixCamera = function (smooth) {
            var takeFrac = smooth ? .05 : 1.0;
            var divisionWidth = (LividLair.GRID_INCLUDE_DIVISION ? 1 : 0);
            var room_col = Math.floor((this.wizard.x / LividLair.GRID_UNIT_SIZE - LividLair.OUTER_BORDER_TILE_COUNT + divisionWidth * 0.5) / (LividLair.ROOM_TILE_COLUMNS + divisionWidth));
            var room_row = Math.floor((this.wizard.y / LividLair.GRID_UNIT_SIZE - LividLair.OUTER_BORDER_TILE_COUNT + divisionWidth * 0.5) / (LividLair.ROOM_TILE_ROWS + divisionWidth));
            this.map.setWizardRoom(room_row, room_col);
            var tile_col = this.wizard.x / LividLair.GRID_UNIT_SIZE - room_col * (LividLair.ROOM_TILE_COLUMNS + divisionWidth) - LividLair.OUTER_BORDER_TILE_COUNT + .5 * divisionWidth;
            var tile_row = this.wizard.y / LividLair.GRID_UNIT_SIZE - room_row * (LividLair.ROOM_TILE_ROWS + divisionWidth) - LividLair.OUTER_BORDER_TILE_COUNT + .5 * divisionWidth;
            var scroll_dist_x = 1.5;
            var scroll_dist_y = 2.0;
            var dx = 0;
            var dy = 0;
            var room_idx = room_row * this.map.data.columns + room_col;
            var room = this.map.data.rooms[Math.min(this.map.data.rooms.length - 1, room_idx)];
            if (tile_col < scroll_dist_x && room.connected[LividLair.RoomDirection.Left])
                dx = -.5 * (scroll_dist_x - tile_col) / scroll_dist_x;
            else if (tile_col > LividLair.ROOM_TILE_COLUMNS + divisionWidth - scroll_dist_x && room.connected[LividLair.RoomDirection.Right])
                dx = .5 * (tile_col - (LividLair.ROOM_TILE_COLUMNS + divisionWidth - scroll_dist_x)) / scroll_dist_x;
            if (tile_row < scroll_dist_y && room.connected[LividLair.RoomDirection.Up])
                dy = -.5 * (scroll_dist_y - tile_row) / scroll_dist_y;
            else if (tile_row > LividLair.ROOM_TILE_ROWS + divisionWidth - scroll_dist_y && room.connected[LividLair.RoomDirection.Down])
                dy = .5 * (tile_row - (LividLair.ROOM_TILE_ROWS + divisionWidth - scroll_dist_y)) / scroll_dist_y;
            var midOffset = Math.abs(tile_col - LividLair.ROOM_TILE_COLUMNS / 2);
            if (midOffset > 3)
                dy = 0;
            else if (midOffset > 1)
                dy *= 1 - (midOffset - 1) / 2.0;
            var goal_x = ((room_col + .5 + dx) * (LividLair.ROOM_TILE_COLUMNS + divisionWidth) + LividLair.OUTER_BORDER_TILE_COUNT - .5 * divisionWidth) * LividLair.GRID_UNIT_SIZE;
            var goal_y = ((room_row + .5 + dy) * (LividLair.ROOM_TILE_ROWS + divisionWidth) + LividLair.OUTER_BORDER_TILE_COUNT - .5 * divisionWidth) * LividLair.GRID_UNIT_SIZE;
            if (!LividLair.SNAP_CAMERA) {
                goal_x = this.wizard.x;
                goal_y = this.wizard.y;
            }
            this.levelContainer.x = (1.0 - takeFrac) * this.levelContainer.x + takeFrac * (-goal_x + this.screenSize.x / 2);
            this.levelContainer.y = (1.0 - takeFrac) * this.levelContainer.y + takeFrac * (-goal_y + this.screenSize.y / 2);
            this.levelContainer.x = Math.min(0, Math.max(this.levelContainer.x, this.screenSize.x - (this.columns) * LividLair.GRID_UNIT_SIZE));
            this.levelContainer.y = Math.min(0, Math.max(this.levelContainer.y, this.screenSize.y - (this.rows) * LividLair.GRID_UNIT_SIZE));
            //getAllObjects
            var obs = this.getAllObjects();
            var cam_box = new LividLair.AABB(new LividLair.Point(-this.levelContainer.x + LividLair.APP_WIDTH / 2, -this.levelContainer.y + LividLair.APP_HEIGHT / 2), LividLair.APP_WIDTH, LividLair.APP_HEIGHT);
            for (var _i = 0, obs_1 = obs; _i < obs_1.length; _i++) {
                var ob = obs_1[_i];
                ob.visible = ob.getBoundingBox().intersects(cam_box);
            }
            this.updateWall();
        };
        Game.prototype.sign = function (n) {
            if (n < 0)
                return -1;
            else if (n > 0)
                return 1;
            return 0;
        };
        Game.prototype.getElementUnderneath = function (item, list) {
            var aabb = item.getBoundingBox();
            var filtered = list.filter(function (val) { return val != item; });
            var closestDx = 0;
            var result = null;
            for (var _i = 0, filtered_1 = filtered; _i < filtered_1.length; _i++) {
                var b = filtered_1[_i];
                var b_box = b.getBoundingBox();
                var objCollDistX = aabb.halfWidth + b_box.halfWidth;
                var objCollDistY = aabb.halfHeight + b_box.halfHeight;
                var dx = item.clampedPosition.x - b.clampedPosition.x;
                var dy = item.clampedPosition.y - b.clampedPosition.y;
                if (Math.abs(dx) >= objCollDistX || Math.abs(dy) > objCollDistY)
                    continue;
                var distX = Math.abs(dx);
                if (distX <= objCollDistX && dy == -objCollDistY) {
                    if (!result || (distX < closestDx)) {
                        closestDx = distX;
                        result = b;
                    }
                }
            }
            return result;
        };
        Game.prototype.hasElementUnderneath = function (item, list) {
            return this.getElementUnderneath(item, list) != null;
        };
        Game.prototype.getHitObject = function (pos, list) {
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var b = list_1[_i];
                if (b.getBoundingBox().contains(pos))
                    return b;
            }
            return null;
        };
        Game.prototype.getIntersectingObject = function (aabb, list) {
            for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                var b = list_2[_i];
                if (b.getBoundingBox().intersects(aabb))
                    return b;
            }
            return null;
        };
        Game.prototype.readyInventoryItem = function (obj, list) {
            if (!this.wizard.grabObject) {
                obj.clampedPosition.x = this.wizard.clampedPosition.x;
                obj.clampedPosition.y = this.wizard.clampedPosition.y;
                obj.x = this.wizard.x;
                obj.y = this.wizard.y;
                list.push(obj);
                this.frontElements.addChild(obj);
                this.wizard.grabObject = obj;
            }
        };
        Game.prototype.getSolidObjects = function () {
            return this.blocks.concat(this.brittleBlocks).concat(this.pushBlocks);
        };
        Game.prototype.getPlatformObjects = function () {
            return this.platforms.concat(this.chests).concat(this.trampolines);
        };
        Game.prototype.getFloorObjects = function () {
            return this.getSolidObjects().concat(this.getPlatformObjects());
        };
        Game.prototype.getAllObjects = function () {
            return this.getSolidObjects().concat(this.getPlatformObjects()).concat(this.getKinematicObjects());
        };
        Game.prototype.getGrabbableObjects = function () {
            return this.chests.concat(this.pots).concat(this.bombs).concat(this.potions);
        };
        Game.prototype.getLightInteractiveKinematicObjects = function () {
            return this.rubees.concat(this.chests).concat(this.pots).concat(this.bombs).concat(this.potions);
        };
        Game.prototype.getLightKinematicObjects = function () {
            return this.getLightInteractiveKinematicObjects().concat(this.bullets).concat(this.particles);
        };
        Game.prototype.getKinematicObjects = function () {
            return this.pushBlocks.concat(this.getLightKinematicObjects()).concat(this.trampolines);
        };
        Game.prototype.getShatterableObjects = function () {
            return this.pots.concat(this.potions);
        };
        Game.prototype.update = function (dt) {
            this.controller.update();
            if (this.controller.justPressed[LividLair.ControllerButton.BACK])
                this.resetLevel();
            for (var _i = 0, _a = this.exits; _i < _a.length; _i++) {
                var e = _a[_i];
                if (this.wizard.getBoundingBox().intersects(e.getBoundingBox())) {
                    this.resetLevel();
                    break;
                }
            }
            var jump = this.controller.justPressed[LividLair.ControllerButton.A];
            var shoot = this.controller.justPressed[LividLair.ControllerButton.X];
            var run = this.controller.pressed[LividLair.ControllerButton.RT];
            var log = this.controller.pressed[LividLair.ControllerButton.LT];
            if (this.controller.justPressed[LividLair.ControllerButton.B]) {
                var b = new LividLair.Bomb();
                b.destroyCallback = new LividLair.Callback(this, this.explodeBomb);
                this.readyInventoryItem(b, this.bombs);
            }
            else if (this.controller.justPressed[LividLair.ControllerButton.Y]) {
                var p = new LividLair.Potion();
                p.destroyCallback = new LividLair.Callback(this, this.breakPotion);
                this.readyInventoryItem(p, this.potions);
            }
            var dir = this.controller.getDirection();
            this.wizard.velocity.x = dir.x * (run ? 10.0 : 6.0);
            if (dir.x > 0)
                this.wizard.faceRight = true;
            if (dir.x < 0)
                this.wizard.faceRight = false;
            var vertDir = (Math.abs(dir.y) > .5) ? this.sign(dir.y) : 0;
            var playerCollDistX = LividLair.PLAYER_WIDTH / 2 + LividLair.GRID_UNIT_SIZE / 2;
            var playerCollDistY = LividLair.PLAYER_HEIGHT / 2 + LividLair.GRID_UNIT_SIZE / 2;
            this.wizard.ignorePlatform = this.wizard.state == LividLair.PlayerState.Climbing;
            //find obstacles underneath player:
            var hitBlock = this.hasElementUnderneath(this.wizard, this.getSolidObjects());
            var hitPlatform = this.hasElementUnderneath(this.wizard, this.getPlatformObjects());
            //update floating timer that is set after walking off of ledge
            if ((hitBlock || hitPlatform) && run)
                this.wizard.floatTimer = 0.075;
            else if (!run)
                this.wizard.floatTimer = 0;
            else if (this.wizard.floatTimer > 0)
                this.wizard.floatTimer -= dt;
            var floating = this.wizard.floatTimer > 0;
            if (this.wizard.noClimbBuffer > 0)
                this.wizard.noClimbBuffer -= dt;
            if (this.wizard.shootTimer > 0)
                this.wizard.shootTimer -= dt;
            if (shoot) {
                if (vertDir > 0 && (hitPlatform || hitBlock) && this.wizard.grabObject == null) {
                    //pick up mode
                    var t = this.getIntersectingObject(this.wizard.getBoundingBox(), this.getGrabbableObjects());
                    if (!t)
                        t = this.getElementUnderneath(this.wizard, this.chests);
                    if (t)
                        this.wizard.grab(t);
                }
                else {
                    this.shoot(vertDir);
                }
            }
            //perform jumps:
            if (jump && this.wizard.velocity.y >= 0) {
                if (hitBlock || (floating && !hitPlatform)) {
                    this.wizard.jump();
                }
                else if (hitPlatform) {
                    if (vertDir > 0)
                        this.wizard.ignorePlatform = true;
                    else
                        this.wizard.jump();
                }
                this.wizard.floatTimer = 0;
                floating = false;
            }
            //continue jump:
            var ignoreGravity = false;
            if (this.controller.pressed[LividLair.ControllerButton.A]) {
                this.wizard.continueJump();
                ignoreGravity = this.wizard.jumpBuffer < this.wizard.maxJump;
            }
            else {
                this.wizard.stopJump();
            }
            //apply gravity:
            if ((!floating || this.wizard.velocity.y < 0) && !ignoreGravity)
                this.wizard.velocity.y = Math.min(30, this.wizard.velocity.y + dt * 40.0);
            //continue climb or cancel it:
            if (this.wizard.state == LividLair.PlayerState.Climbing) {
                var ladder = this.getHitObject(this.wizard.clampedPosition, this.ladders);
                if (ladder) {
                    var maxSpeed = 5;
                    if (vertDir < 0) {
                        //test of there is a ladder on top
                        var shiftPos = ladder.clampedPosition.clone();
                        shiftPos.y -= LividLair.GRID_UNIT_SIZE / 2 + 1;
                        var topLadder = this.getHitObject(shiftPos, this.ladders);
                        if (!topLadder) {
                            //there is no ladder on top of this one, so clamp the speed
                            var offset = LividLair.GRID_UNIT_SIZE / 2 + (this.wizard.clampedPosition.y - ladder.clampedPosition.y); //- PLAYER_HEIGHT / 2);
                            maxSpeed = Math.max(0, Math.min(maxSpeed, offset));
                        }
                    }
                    this.wizard.velocity.y = vertDir * maxSpeed;
                    this.wizard.velocity.x = ladder.clampedPosition.x - this.wizard.x;
                    if (jump) {
                        this.wizard.state = LividLair.PlayerState.Idle;
                        if (vertDir <= 0)
                            this.wizard.jump();
                        else
                            this.wizard.velocity.y = 0;
                        this.wizard.noClimbBuffer = 0.2;
                    }
                }
                else {
                    this.wizard.state = LividLair.PlayerState.Idle;
                    this.wizard.velocity.y = 0;
                }
            }
            else if (this.wizard.noClimbBuffer <= 0 && ((vertDir < 0 && (this.wizard.velocity.y > 0 || floating)) || (vertDir > 0 && hitPlatform && !hitBlock))) {
                //try to claim ladder and enter climb state:
                for (var _b = 0, _c = this.ladders; _b < _c.length; _b++) {
                    var l = _c[_b];
                    var dx = this.wizard.clampedPosition.x - l.x;
                    var dy = this.wizard.clampedPosition.y - l.y;
                    if (Math.abs(dx) <= LividLair.LADDER_WIDTH / 2 && Math.abs(dy) <= LividLair.GRID_UNIT_SIZE / 2) {
                        this.wizard.velocity.x = 0;
                        this.wizard.velocity.y = 0;
                        this.wizard.state = LividLair.PlayerState.Climbing;
                        break;
                    }
                }
            }
            //update trampolines:
            for (var _d = 0, _e = this.trampolines; _d < _e.length; _d++) {
                var t = _e[_d];
                t.update(dt);
            }
            var trampoline = this.getElementUnderneath(this.wizard, this.trampolines.filter(function (t) { return t.wobbleParam > .05; }));
            if (trampoline) {
                this.wizard.velocity.y = this.controller.pressed[LividLair.ControllerButton.A] ? -18 : -10;
                trampoline.wobble();
            }
            //resolve ledge-grab
            if (this.wizard.state == LividLair.PlayerState.Ledge) {
                this.wizard.velocity.x = 0;
                this.wizard.velocity.y = 0;
                if (jump) {
                    this.wizard.state = LividLair.PlayerState.Idle;
                    if (vertDir <= 0)
                        this.wizard.jump();
                    else
                        this.wizard.velocity.y = 0;
                    this.wizard.noClimbBuffer = 0.2;
                }
            }
            else if (this.wizard.velocity.y > 0) {
                //find ledge to grab
                //TODO: make sure no block is above this one.. 
                //TODO: Also, make sure that resulting player AABB does not overlap anything else
                var solids = this.getSolidObjects();
                var p_box = this.wizard.getBoundingBox();
                var fall_y = Math.round(this.wizard.clampedPosition.y + this.wizard.velocity.y);
                for (var _f = 0, solids_1 = solids; _f < solids_1.length; _f++) {
                    var s = solids_1[_f];
                    var dx = this.wizard.clampedPosition.x - s.clampedPosition.x;
                    var dy = this.wizard.clampedPosition.y - s.clampedPosition.y;
                    var s_box = s.getBoundingBox();
                    if (Math.abs(dx) < s_box.halfWidth + p_box.halfWidth + 1) {
                        var test_x = s_box.center.x + this.sign(dx) * (Math.abs(dx) - p_box.halfWidth);
                        var test_y = s_box.center.y - s_box.halfHeight - 1;
                        if (this.getHitObject(new LividLair.Point(test_x, test_y), solids))
                            continue;
                        var goal_y = s.clampedPosition.y - s_box.halfHeight + p_box.halfHeight;
                        if (this.wizard.clampedPosition.y < goal_y && fall_y >= goal_y) {
                            this.wizard.state = LividLair.PlayerState.Ledge;
                            this.wizard.clampedPosition.y = goal_y;
                            this.wizard.velocity.x = 0;
                            this.wizard.velocity.y = 0;
                            break;
                        }
                    }
                }
            }
            //push blocks:
            var pushMode = (hitBlock || hitPlatform) && this.sign(dir.x) != 0;
            for (var _g = 0, _h = this.pushBlocks; _g < _h.length; _g++) {
                var b = _h[_g];
                var onGround = this.hasElementUnderneath(b, this.getFloorObjects());
                var playerContainedDistY = LividLair.GRID_UNIT_SIZE / 2 - LividLair.PLAYER_HEIGHT / 2;
                var dx = this.wizard.clampedPosition.x - b.clampedPosition.x;
                var dy = this.wizard.clampedPosition.y - b.clampedPosition.y;
                if (pushMode && onGround && Math.abs(dx) == playerCollDistX && Math.abs(dy) <= playerContainedDistY)
                    b.velocity.x = dx < 0 ? 4 : -4;
                else
                    b.velocity.x = 0;
            }
            //update bullets:
            for (var i = 0; i < this.bullets.length; ++i) {
                var b = this.bullets[i];
                var destroy = false;
                var c = this.getHitObject(b.clampedPosition, this.getLightInteractiveKinematicObjects());
                if (c) {
                    destroy = true;
                    if (b.clampedPosition.x < c.clampedPosition.x)
                        c.velocity.x = Math.min(5, c.velocity.x + 2);
                    else
                        c.velocity.x = Math.max(-5, c.velocity.x - 2);
                    c.velocity.y = -5;
                }
                b.aliveTime += dt;
                if (b.aliveTime > 1.5) {
                    destroy = true;
                }
                if (destroy) {
                    this.bullets.splice(i, 1);
                    --i;
                    this.frontElements.removeChild(b);
                }
            }
            for (var i = 0; i < this.particles.length; ++i) {
                var p = this.particles[i];
                p.aliveTime += dt;
                if (p.aliveTime > 1.5) {
                    this.particles.splice(i, 1);
                    --i;
                    this.frontElements.removeChild(p);
                }
                else if (p.aliveTime > .5) {
                    var t = 1 - Math.pow((p.aliveTime - .5) / 1, .5);
                    p.alpha = t;
                    // p.scale.x = p.scale.y = t;
                }
            }
            var cpyBombs = __spreadArrays(this.bombs);
            for (var _j = 0, cpyBombs_1 = cpyBombs; _j < cpyBombs_1.length; _j++) {
                var b = cpyBombs_1[_j];
                b.update(dt);
            }
            //update grabbed item physics:
            this.wizard.update(dt);
            //update push-block & collectible physics:
            var kinemElems = this.getKinematicObjects();
            for (var _k = 0, kinemElems_1 = kinemElems; _k < kinemElems_1.length; _k++) {
                var b = kinemElems_1[_k];
                b.velocity.y = Math.min(30, b.velocity.y + dt * 40.0);
                this.resolveCollisions(b);
            }
            this.resolveCollisions(this.wizard);
            //get rubees:
            for (var i = 0; i < this.rubees.length; ++i) {
                var c = this.rubees[i];
                c.update(dt);
                if (c.getBoundingBox().intersects(this.wizard.getBoundingBox())) {
                    //destroy collectible
                    this.rubees.splice(i, 1);
                    this.backElements.removeChild(c);
                    this.frontElements.removeChild(c);
                    --i;
                }
            }
            this.fixCamera(true);
        };
        Game.prototype.burstParticles = function (pos, n, clr, force) {
            for (var i = 0; i < n; ++i) {
                var w = 4 + 2 * Math.floor(Math.random() * 4);
                var p = new LividLair.Particle(clr, w);
                p.clampedPosition = pos.clone();
                p.x = pos.x;
                p.y = pos.y;
                p.velocity.x = (Math.random() - .5) * force;
                p.velocity.y = (Math.random() - .5) * force;
                p.clampedPosition = p.clampedPosition.clone().add(p.velocity.multiply(1));
                this.frontElements.addChild(p);
                this.particles.push(p);
            }
        };
        Game.prototype.breakPot = function (pot) {
            var idx = this.pots.indexOf(pot);
            if (idx < 0)
                return;
            this.pots.splice(idx, 1);
            this.frontElements.removeChild(pot);
            this.burstParticles(pot.clampedPosition, 20, 0xaa5588, 10);
            if (Math.random() < .5) {
                var r = new LividLair.Rubee();
                r.clampedPosition = pot.clampedPosition.clone();
                r.x = pot.x;
                r.y = pot.y;
                this.rubees.push(r);
                this.frontElements.addChild(r);
            }
            this.prevPot = pot;
        };
        Game.prototype.breakPotion = function (potion) {
            var idx = this.potions.indexOf(potion);
            if (idx < 0)
                return;
            this.potions.splice(idx, 1);
            this.frontElements.removeChild(potion);
            this.burstParticles(potion.clampedPosition, 20, 0x00ffff, 10);
        };
        Game.prototype.explodeBomb = function (bomb) {
            var idx = this.bombs.indexOf(bomb);
            this.bombs.splice(idx, 1);
            this.frontElements.removeChild(bomb);
            this.burstParticles(bomb.clampedPosition, 20, 0xff0000, 10);
            this.burstParticles(bomb.clampedPosition, 20, 0xffaa00, 20);
            this.burstParticles(bomb.clampedPosition, 20, 0xffff00, 30);
            if (this.wizard.grabObject == bomb)
                this.wizard.grabObject = null;
            //destroy breakable blocks:
            for (var i = 0; i < this.brittleBlocks.length; ++i) {
                var b = this.brittleBlocks[i];
                var dx = b.x - bomb.x;
                var dy = b.y - bomb.y;
                var pt = new LividLair.Point(dx, dy);
                if (pt.length() < LividLair.GRID_UNIT_SIZE * 2) {
                    this.brittleBlocks.splice(i, 1);
                    --i;
                    this.backElements.removeChild(b);
                    this.burstParticles(b.clampedPosition, 10, 0xff8800, 20);
                    // this.burstParticles(b.clampedPosition, 20, 0xccaa88, 10);
                }
            }
            //detonate close-range bombs:
            for (var _i = 0, _a = this.bombs; _i < _a.length; _i++) {
                var b = _a[_i];
                var pt = new LividLair.Point(b.x - bomb.x, b.y - bomb.y);
                if (pt.length() < LividLair.GRID_UNIT_SIZE * 2)
                    b.aliveTime = 3;
            }
            //destroy other breakables:
            var bs = this.getShatterableObjects();
            for (var _b = 0, bs_1 = bs; _b < bs_1.length; _b++) {
                var b = bs_1[_b];
                var pt = b.clampedPosition.clone().subtract(bomb.clampedPosition);
                if (pt.length() < LividLair.GRID_UNIT_SIZE * 2) {
                    if (b.destroyCallback)
                        b.destroyCallback.call(b);
                }
            }
            //let other kinematic objects fly:
            var kos = this.getLightKinematicObjects();
            for (var _c = 0, kos_1 = kos; _c < kos_1.length; _c++) {
                var k = kos_1[_c];
                var pt = k.clampedPosition.clone().subtract(bomb.clampedPosition);
                if (pt.length() < LividLair.GRID_UNIT_SIZE * 2) {
                    pt.normalize(20);
                    k.velocity.x += Math.round(pt.x);
                    k.velocity.y += Math.round(pt.y);
                }
            }
        };
        Game.prototype.resolveCollisions = function (gObj) {
            var gAABB = gObj.getBoundingBox();
            var displacement = gObj.velocity.clone();
            //process x-displacement:
            var allBlockades = this.getSolidObjects().filter(function (val) { return val != gObj; });
            for (var _i = 0, allBlockades_1 = allBlockades; _i < allBlockades_1.length; _i++) {
                var b = allBlockades_1[_i];
                var b_box = b.getBoundingBox();
                var objCollDistX = gAABB.halfWidth + b_box.halfWidth;
                var objCollDistY = gAABB.halfHeight + b_box.halfHeight;
                //y-collision?
                if (Math.abs(gObj.clampedPosition.y - b.clampedPosition.y) < objCollDistY) {
                    //if moving towards block:
                    var toBlockCenterX = b.clampedPosition.x - gObj.clampedPosition.x;
                    if (this.sign(displacement.x) == this.sign(toBlockCenterX)) {
                        var distanceLeft = Math.max(0, Math.abs(toBlockCenterX) - objCollDistX);
                        if (distanceLeft < Math.abs(displacement.x)) {
                            displacement.x = this.sign(displacement.x) * distanceLeft;
                            gObj.bounceOffWall(this.sign(toBlockCenterX) < 0);
                        }
                    }
                }
            }
            gObj.clampedPosition.x += displacement.x;
            gObj.clampedPosition.x = Math.round(gObj.clampedPosition.x);
            gObj.clampedPosition.x = Math.max(LividLair.OUTER_BORDER_TILE_COUNT * LividLair.GRID_UNIT_SIZE + gAABB.halfWidth, Math.min((this.columns - LividLair.OUTER_BORDER_TILE_COUNT) * LividLair.GRID_UNIT_SIZE - gAABB.halfWidth, gObj.clampedPosition.x));
            //process y-displacement:
            for (var _a = 0, allBlockades_2 = allBlockades; _a < allBlockades_2.length; _a++) {
                var b = allBlockades_2[_a];
                var b_box = b.getBoundingBox();
                var objCollDistX = gAABB.halfWidth + b_box.halfWidth;
                var objCollDistY = gAABB.halfHeight + b_box.halfHeight;
                //x-collision?
                if (Math.abs(gObj.clampedPosition.x - b.clampedPosition.x) < objCollDistX) {
                    //if moving towards block:
                    var toBlockCenterY = b.clampedPosition.y - gObj.clampedPosition.y;
                    if (this.sign(displacement.y) == this.sign(toBlockCenterY)) {
                        var distanceLeft = Math.max(0, Math.abs(toBlockCenterY) - objCollDistY);
                        if (distanceLeft < Math.abs(displacement.y)) {
                            if (this.sign(displacement.y) > 0)
                                gObj.bounceOffFloor();
                            else
                                gObj.bounceOffCeiling();
                            displacement.y = this.sign(displacement.y) * distanceLeft;
                        }
                    }
                }
            }
            //process y-displacement (for platforms):
            for (var _b = 0, _c = this.getPlatformObjects(); _b < _c.length; _b++) {
                var p = _c[_b];
                if (gObj.ignorePlatform)
                    break;
                var p_box = p.getBoundingBox();
                var objCollDistX = gAABB.halfWidth + p_box.halfWidth;
                var objCollDistY = gAABB.halfHeight + p_box.halfHeight;
                //x-collision?
                if (Math.abs(gObj.clampedPosition.x - p.clampedPosition.x) < objCollDistX) {
                    //if moving towards platform:
                    var toPlatformCenterY = p.clampedPosition.y - gObj.clampedPosition.y;
                    if (toPlatformCenterY <= 0)
                        continue;
                    if (this.sign(displacement.y) == this.sign(toPlatformCenterY)) {
                        var distanceLeft = Math.abs(toPlatformCenterY) - objCollDistY;
                        if (distanceLeft < 0)
                            continue;
                        if (distanceLeft <= Math.abs(displacement.y)) {
                            displacement.y = this.sign(displacement.y) * distanceLeft;
                            gObj.bounceOffPlatform();
                        }
                    }
                }
            }
            //clamp to screen bounds:
            gObj.clampedPosition.y += displacement.y;
            gObj.clampedPosition.y = Math.round(gObj.clampedPosition.y);
            gObj.clampedPosition.y = Math.max(LividLair.OUTER_BORDER_TILE_COUNT * LividLair.GRID_UNIT_SIZE + gAABB.halfHeight, Math.min((this.rows - LividLair.OUTER_BORDER_TILE_COUNT) * LividLair.GRID_UNIT_SIZE - gAABB.halfHeight, gObj.clampedPosition.y));
            gObj.x = .5 * gObj.x + .5 * gObj.clampedPosition.x;
            gObj.y = .5 * gObj.y + .5 * gObj.clampedPosition.y;
        };
        return Game;
    }(PIXI.Container));
    LividLair.Game = Game;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="../game/Defs.ts"/>
var LividLair;
(function (LividLair) {
    function drawGameObject(context, type, pos, width) {
        if (width === void 0) { width = LividLair.GRID_UNIT_SIZE; }
        var drawBlock = function (clr, w) {
            if (w === void 0) { w = width; }
            context.beginFill(clr);
            context.drawRoundedRect(pos.x - w / 2, pos.y - w / 2, w, w, .05 * w);
        };
        var drawRect = function (clr, x, y, w, h) {
            context.beginFill(clr);
            context.drawRect(pos.x + x - w / 2, pos.y + y - h / 2, w, h);
        };
        var drawLadder = function () {
            var clr = 0xA0522D;
            drawRect(clr, -width * .4, 0, .1 * width, width);
            drawRect(clr, width * .4, 0, .1 * width, width);
            for (var i = 0; i < 3; ++i)
                drawRect(clr, 0, ((i + .5) / 3 - .5) * width, .8 * width, .1 * width);
        };
        var drawPlatform = function () {
            drawRect(0x00aaff, 0, -width * .4, width, width * .2);
        };
        var drawCircle = function (clr) {
            context.beginFill(clr);
            context.drawCircle(pos.x, pos.y, width * .4);
        };
        switch (type) {
            case LividLair.TileType.Block:
                drawBlock(0xffaa88);
                break;
            case LividLair.TileType.BrittleBlock:
                drawBlock(0xaa8833);
                break;
            case LividLair.TileType.Platform:
                drawPlatform();
                break;
            case LividLair.TileType.Ladder:
                drawLadder();
                break;
            case LividLair.TileType.CrossLadder:
                drawLadder();
                drawPlatform();
                break;
            case LividLair.TileType.PushBlock:
                drawBlock(0xaaaaff);
                drawBlock(0x8888aa, .7 * width);
                break;
            case LividLair.TileType.Wizard:
                drawCircle(0x55aaff);
                break;
            case LividLair.TileType.Chest:
                drawCircle(0xff0000);
                drawRect(0xff0000, 0, width * .25, width * .8, width * .5);
                break;
            case LividLair.TileType.Pot:
                drawCircle(0x70380f);
                break;
            case LividLair.TileType.Rubee:
                drawRect(0x88ff88, 0, 0, .2 * width, .6 * width);
                break;
            case LividLair.TileType.Exit:
                drawRect(0x8888aa, 0, 0, .7 * width, width);
                drawRect(0x444466, 0, .1 * width, .5 * width, width * .9);
                break;
            case LividLair.TileType.Trampoline:
                context.beginFill(0xffffff);
                context.drawCircle(pos.x, pos.y, width * .25);
                drawRect(0xaa0000, 0, -.2 * width, .4 * width, width * .2);
                break;
        }
    }
    LividLair.drawGameObject = drawGameObject;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="../game/Point.ts"/>
///<reference path="../game/Defs.ts"/>
///<reference path="Defs.ts"/>
///<reference path="../game/LairData.ts"/>
var LividLair;
(function (LividLair) {
    var EditorGrid = /** @class */ (function (_super) {
        __extends(EditorGrid, _super);
        function EditorGrid() {
            var _this = _super.call(this) || this;
            var gr = new PIXI.Graphics();
            gr.lineStyle(5, 0x555555);
            _this.size = new LividLair.Point((LividLair.ROOM_TILE_COLUMNS + 2) * LividLair.GRID_UNIT_SIZE, (LividLair.ROOM_TILE_ROWS + 2) * LividLair.GRID_UNIT_SIZE);
            //horizontal lines:
            for (var i = 1; i < LividLair.ROOM_TILE_ROWS; ++i) {
                var y = (i + 1) * LividLair.GRID_UNIT_SIZE;
                gr.moveTo(LividLair.GRID_UNIT_SIZE, y);
                gr.lineTo((LividLair.ROOM_TILE_COLUMNS + 1) * LividLair.GRID_UNIT_SIZE, y);
            }
            //vertical lines:
            for (var j = 1; j < LividLair.ROOM_TILE_COLUMNS; ++j) {
                var x = (j + 1) * LividLair.GRID_UNIT_SIZE;
                gr.moveTo(x, LividLair.GRID_UNIT_SIZE);
                gr.lineTo(x, (LividLair.ROOM_TILE_ROWS + 1) * LividLair.GRID_UNIT_SIZE);
            }
            gr.drawRoundedRect(LividLair.GRID_UNIT_SIZE, LividLair.GRID_UNIT_SIZE, _this.size.x - 2 * LividLair.GRID_UNIT_SIZE, _this.size.y - 2 * LividLair.GRID_UNIT_SIZE, 10);
            _this.addChild(gr);
            _this.elemsCanvas = new PIXI.Graphics();
            _this.addChild(_this.elemsCanvas);
            //EAST/WEST connections:
            _this.textElems = [];
            for (var i = 0; i < 4; ++i) {
                var x = Math.floor(i / 2);
                var col = (LividLair.ROOM_TILE_COLUMNS + 1) * x;
                var height = (LividLair.ROOM_TILE_ROWS - 2) / 2;
                var row = 2 + (i % 2) * height;
                gr.drawRoundedRect(col * LividLair.GRID_UNIT_SIZE, row * LividLair.GRID_UNIT_SIZE, LividLair.GRID_UNIT_SIZE, height * LividLair.GRID_UNIT_SIZE, 10);
                var txt = new PIXI.Text('' + i);
                txt.x = (col + .5) * LividLair.GRID_UNIT_SIZE - 10;
                txt.y = (row + .5 * height) * LividLair.GRID_UNIT_SIZE - 18;
                txt.style.fill = 0xffffff;
                txt.style.fontSize = 32;
                _this.addChild(txt);
                _this.textElems.push(txt);
            }
            //NORTH/SOUTH connections:
            for (var i = 0; i < 4; ++i) {
                var row = (LividLair.ROOM_TILE_ROWS + 1) * Math.floor(i / 2);
                var width = (LividLair.ROOM_TILE_COLUMNS - 2) / 2;
                var col = 2 + (i % 2) * width;
                gr.drawRoundedRect(col * LividLair.GRID_UNIT_SIZE, row * LividLair.GRID_UNIT_SIZE, width * LividLair.GRID_UNIT_SIZE, LividLair.GRID_UNIT_SIZE, 10);
                var txt = new PIXI.Text('' + (4 + i));
                txt.x = (col + .5 * width) * LividLair.GRID_UNIT_SIZE - 10;
                txt.y = (row + .5) * LividLair.GRID_UNIT_SIZE - 18;
                txt.style.fill = 0xffffff;
                txt.style.fontSize = 32;
                _this.addChild(txt);
                _this.textElems.push(txt);
            }
            //create dummy version:
            _this.room = new LividLair.RoomData(LividLair.ROOM_TILE_ROWS, LividLair.ROOM_TILE_COLUMNS);
            _this.redraw();
            return _this;
        }
        EditorGrid.prototype.populate = function (room) {
            this.room = room;
            this.room.resize(LividLair.ROOM_TILE_ROWS, LividLair.ROOM_TILE_COLUMNS);
            this.redraw();
        };
        EditorGrid.prototype.click = function (p) {
            var row = Math.floor(p.y / LividLair.GRID_UNIT_SIZE - 1);
            var col = Math.floor(p.x / LividLair.GRID_UNIT_SIZE - 1);
            //if outside of bounds of outer buttons, then cancel:
            if (row < -1 || row > LividLair.ROOM_TILE_ROWS || col < -1 || col > LividLair.ROOM_TILE_COLUMNS)
                return;
            //if outside of bounds of inner grid, then process
            if (row < 0 || row > LividLair.ROOM_TILE_ROWS - 1 || col < 0 || col > LividLair.ROOM_TILE_COLUMNS - 1) {
                var idx = 0;
                if (row == -1)
                    idx = LividLair.RoomEntrancePosition.CeilingLeft + (col < LividLair.ROOM_TILE_COLUMNS / 2 ? 0 : 1);
                else if (row == LividLair.ROOM_TILE_ROWS)
                    idx = LividLair.RoomEntrancePosition.FloorLeft + (col < LividLair.ROOM_TILE_COLUMNS / 2 ? 0 : 1);
                else if (col == -1)
                    idx = LividLair.RoomEntrancePosition.LeftWallTop + (row < LividLair.ROOM_TILE_ROWS / 2 ? 0 : 1);
                else
                    idx = LividLair.RoomEntrancePosition.RightWallTop + (row < LividLair.ROOM_TILE_ROWS / 2 ? 0 : 1);
                this.room.entrances[idx] = (this.room.entrances[idx] + 1) % LividLair.RoomEntranceType.Count;
                this.redraw();
                return;
            }
        };
        EditorGrid.prototype.dropElement = function (p, type) {
            var row = Math.floor(p.y / LividLair.GRID_UNIT_SIZE - 1);
            var col = Math.floor(p.x / LividLair.GRID_UNIT_SIZE - 1);
            if (row < 0 || row >= LividLair.ROOM_TILE_ROWS || col < 0 || col >= LividLair.ROOM_TILE_COLUMNS)
                return;
            var idx = row * LividLair.ROOM_TILE_COLUMNS + col;
            if (this.room.tiles[idx] != type) {
                this.room.tiles[idx] = type;
                this.redraw();
            }
        };
        EditorGrid.prototype.redraw = function () {
            this.elemsCanvas.clear();
            for (var i = 0; i < LividLair.ROOM_TILE_ROWS; ++i) {
                for (var j = 0; j < LividLair.ROOM_TILE_COLUMNS; ++j) {
                    var idx = i * LividLair.ROOM_TILE_COLUMNS + j;
                    var pt = new LividLair.Point((j + 1.5) * LividLair.GRID_UNIT_SIZE, (i + 1.5) * LividLair.GRID_UNIT_SIZE);
                    LividLair.drawGameObject(this.elemsCanvas, this.room.tiles[idx], pt, LividLair.GRID_UNIT_SIZE);
                }
            }
            //update directions:
            var symbols = [['⇆', '↦', '↤', '#'], ['⇆', '↤', '↦', '#'], ['⇅', '↧', '↥', '#'], ['⇅', '↥', '↧', '#']];
            for (var i = 0; i < LividLair.RoomEntrancePosition.Count; ++i) {
                var type = this.room.entrances[i];
                this.textElems[i].text = symbols[Math.floor(i / 2)][type];
            }
        };
        return EditorGrid;
    }(PIXI.Container));
    LividLair.EditorGrid = EditorGrid;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="../game/Point.ts"/>
///<reference path="../game/Defs.ts"/>
///<reference path="Defs.ts"/>
var LividLair;
(function (LividLair) {
    var TileButton = /** @class */ (function (_super) {
        __extends(TileButton, _super);
        function TileButton(type) {
            var _this = _super.call(this) || this;
            _this.type = type;
            _this.enabled = false;
            var gr = new PIXI.Graphics();
            gr.lineStyle(2, 0xffffff);
            gr.beginFill(0x888888);
            gr.drawRoundedRect(-20, -20, 40, 40, 5);
            gr.lineStyle(0);
            gr.beginFill(0xaaaaaa);
            gr.drawRoundedRect(-15, -15, 30, 30, 5);
            _this.addChild(gr);
            LividLair.drawGameObject(gr, type, new LividLair.Point(0, -2), 20);
            return _this;
        }
        TileButton.prototype.setEnabled = function (enabled) {
            this.enabled = enabled;
            this.alpha = enabled ? .5 : 1;
        };
        TileButton.prototype.hitTestPoint = function (p) {
            return Math.abs(p.x) < 20 && Math.abs(p.y) < 20;
        };
        return TileButton;
    }(PIXI.Container));
    LividLair.TileButton = TileButton;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="../game/Point.ts"/>
///<reference path="../game/Defs.ts"/>
///<reference path="Defs.ts"/>
///<reference path="../game/LairData.ts"/>
var LividLair;
(function (LividLair) {
    var RoomButton = /** @class */ (function (_super) {
        __extends(RoomButton, _super);
        function RoomButton(rd) {
            var _this = _super.call(this) || this;
            _this.room = rd;
            _this.enabled = false;
            var gr = new PIXI.Graphics();
            gr.lineStyle(2, 0xffffff);
            gr.beginFill(0x888888);
            gr.drawRoundedRect(-50, -10, 100, 20, 5);
            _this.addChild(gr);
            _this.label = new PIXI.Text('Room #');
            _this.label.x = -45;
            _this.label.y = -8;
            _this.label.style.fill = 0xffffff;
            _this.label.style.fontSize = 12;
            _this.addChild(_this.label);
            return _this;
        }
        RoomButton.prototype.setEnabled = function (enabled) {
            this.enabled = enabled;
            this.alpha = enabled ? .5 : 1;
        };
        RoomButton.prototype.hitTestPoint = function (p) {
            return Math.abs(p.x) < 50 && Math.abs(p.y) < 10;
        };
        return RoomButton;
    }(PIXI.Container));
    LividLair.RoomButton = RoomButton;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="../game/Point.ts"/>
///<reference path="../game/Defs.ts"/>
///<reference path="Defs.ts"/>
var LividLair;
(function (LividLair) {
    var OptionButton = /** @class */ (function (_super) {
        __extends(OptionButton, _super);
        function OptionButton(txt, func) {
            var _this = _super.call(this) || this;
            _this.func = func;
            var gr = new PIXI.Graphics();
            gr.lineStyle(2, 0xffffff);
            gr.beginFill(0x55aa55);
            gr.drawRoundedRect(-20, -20, 40, 40, 5);
            gr.lineStyle(0);
            gr.beginFill(0xaaffaa);
            gr.drawRoundedRect(-15, -15, 30, 30, 5);
            _this.addChild(gr);
            _this.label = new PIXI.Text(txt);
            _this.label.x = 0;
            _this.label.y = -8;
            _this.label.style.fill = 0xffffff;
            _this.label.style.fontSize = 12;
            _this.addChild(_this.label);
            return _this;
        }
        OptionButton.prototype.hitTestPoint = function (p) {
            return Math.abs(p.x) < 20 && Math.abs(p.y) < 20;
        };
        return OptionButton;
    }(PIXI.Container));
    LividLair.OptionButton = OptionButton;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="../game/Point.ts"/>
///<reference path="../game/Defs.ts"/>
///<reference path="EditorGrid.ts"/>
///<reference path="TileButton.ts"/>
///<reference path="RoomButton.ts"/>
///<reference path="OptionButton.ts"/>
///<reference path="../LairLoader.ts"/>
///<reference path="../game/LairData.ts"/>
var LividLair;
(function (LividLair) {
    var Editor = /** @class */ (function (_super) {
        __extends(Editor, _super);
        function Editor() {
            var _this = _super.call(this) || this;
            Editor.instance = _this;
            _this.visible = false;
            var gr = new PIXI.Graphics();
            //background:
            gr.beginFill(0x0, .85);
            gr.drawRect(0, 0, LividLair.APP_WIDTH, LividLair.APP_HEIGHT);
            var wLeft = 150;
            var hTop = 150;
            var m = 10;
            var hm = m / 2;
            //left panel:
            gr.beginFill(0x333333, 1);
            gr.drawRoundedRect(hm, hm, wLeft - m, hTop - m, 5);
            gr.drawRoundedRect(hm, hTop + hm, wLeft - m, LividLair.APP_HEIGHT - hTop - m, 5);
            gr.drawRoundedRect(wLeft + hm, hm, LividLair.APP_WIDTH - wLeft - m, hTop - m, 5);
            gr.endFill();
            gr.lineStyle(5, 0x333333);
            gr.drawRoundedRect(wLeft + hm, hTop + hm, LividLair.APP_WIDTH - wLeft - m, LividLair.APP_HEIGHT - hTop - m, 5);
            _this.addChild(gr);
            _this.grid = new LividLair.EditorGrid();
            _this.addChild(_this.grid);
            _this.rightClick = false;
            _this.grid.x = wLeft + hm + 30;
            _this.grid.y = hTop + hm + 30;
            var scaleX = (LividLair.APP_WIDTH - wLeft - m - 60) / _this.grid.size.x;
            var scaleY = (LividLair.APP_HEIGHT - hTop - m - 60) / _this.grid.size.y;
            _this.grid.scale.x = _this.grid.scale.y = Math.min(scaleX, scaleY);
            _this.tileButtons = [];
            var slotOffset = .4 * wLeft;
            for (var _i = 0, _a = Object.keys(LividLair.TileType); _i < _a.length; _i++) {
                var key = _a[_i];
                var idx = _this.tileButtons.length;
                var x = wLeft + (Math.floor(idx / 2) + 0.75) * slotOffset;
                var y = .5 * hTop + ((idx % 2) - .5) * slotOffset;
                var go = new LividLair.TileButton(LividLair.TileType[key]);
                go.x = x;
                go.y = y;
                _this.addChild(go);
                _this.tileButtons.push(go);
            }
            _this.tileButtons[0].setEnabled(true);
            //OptionButton
            _this.optionButtons = [];
            var symbols = ['➕', '💾', '🗑️', ' '];
            var _loop_1 = function (i) {
                var x = ((i % 2) * .5 + 0.25) * wLeft;
                var y = (Math.floor(i / 2) * .5 + .25) * hTop;
                var ob = new LividLair.OptionButton(symbols[i], function () { _this.perfomOpt(i); });
                ob.x = x;
                ob.y = y;
                this_1.addChild(ob);
                this_1.optionButtons.push(ob);
            };
            var this_1 = this;
            for (var i = 0; i < 3; ++i) {
                _loop_1(i);
            }
            _this.focusTileButton(_this.tileButtons[0]);
            return _this;
        }
        Editor.prototype.setup = function () {
            this.roomButtons = [];
            for (var _i = 0, _a = LividLair.LairData.instance.rooms; _i < _a.length; _i++) {
                var r = _a[_i];
                this.addRoomButton(r);
            }
            if (this.roomButtons.length > 0)
                this.focusRoomButton(this.roomButtons[0]);
        };
        Editor.prototype.addRoomButton = function (r) {
            var b = new LividLair.RoomButton(r);
            this.roomButtons.push(b);
            this.addChild(b);
            this.rearrangeRoomButtons();
            return b;
        };
        Editor.prototype.rearrangeRoomButtons = function () {
            for (var i = 0; i < this.roomButtons.length; ++i) {
                var b = this.roomButtons[i];
                b.x = 75;
                b.y = 180 + i * 30;
            }
        };
        Editor.prototype.perfomOpt = function (idx) {
            if (idx == 0) {
                var room = new LividLair.RoomData(LividLair.ROOM_TILE_ROWS, LividLair.ROOM_TILE_COLUMNS);
                LividLair.LairData.instance.rooms.push(room);
                this.focusRoomButton(this.addRoomButton(room));
            }
            else if (idx == 1) {
                //save all rooms:
                LividLair.LairData.instance.save();
            }
            else if (idx == 2) {
                //trash current opt:
                var bs = this.roomButtons.filter(function (rb) { return rb.enabled; });
                if (bs.length > 0) {
                    var b = bs[0];
                    var idx_1 = LividLair.LairData.instance.rooms.indexOf(b.room);
                    if (idx_1 >= 0) {
                        LividLair.LairData.instance.rooms.splice(idx_1, 1);
                        idx_1 = this.roomButtons.indexOf(b);
                        this.removeChild(b);
                        this.roomButtons.splice(idx_1, 1);
                        this.rearrangeRoomButtons();
                        if (this.roomButtons.length > 0)
                            this.focusRoomButton(this.roomButtons[0]);
                    }
                }
            }
        };
        Editor.prototype.focusRoomButton = function (focusButton) {
            for (var _i = 0, _a = this.roomButtons; _i < _a.length; _i++) {
                var rb = _a[_i];
                rb.setEnabled(false);
            }
            focusButton.setEnabled(true);
            this.grid.populate(focusButton.room);
        };
        Editor.prototype.focusTileButton = function (focusButton) {
            for (var _i = 0, _a = this.tileButtons; _i < _a.length; _i++) {
                var tb = _a[_i];
                tb.setEnabled(false);
            }
            focusButton.setEnabled(true);
        };
        Editor.prototype.getCurrentTileType = function () {
            if (this.rightClick)
                return LividLair.TileType.Empty;
            for (var _i = 0, _a = this.tileButtons; _i < _a.length; _i++) {
                var tb = _a[_i];
                if (tb.enabled)
                    return tb.type;
            }
            return LividLair.TileType.Empty;
        };
        Editor.prototype.touchDown = function (p) {
            if (!this.visible)
                return;
            for (var _i = 0, _a = this.tileButtons; _i < _a.length; _i++) {
                var tb = _a[_i];
                if (tb.hitTestPoint(LividLair.Point.fromPixi(tb.toLocal(p.toPixi(), this)))) {
                    this.focusTileButton(tb);
                    return;
                }
            }
            for (var _b = 0, _c = this.roomButtons; _b < _c.length; _b++) {
                var rb = _c[_b];
                if (rb.hitTestPoint(LividLair.Point.fromPixi(rb.toLocal(p.toPixi(), this)))) {
                    this.focusRoomButton(rb);
                    return;
                }
            }
            for (var _d = 0, _e = this.optionButtons; _d < _e.length; _d++) {
                var rb = _e[_d];
                if (rb.hitTestPoint(LividLair.Point.fromPixi(rb.toLocal(p.toPixi(), this)))) {
                    rb.func();
                    return;
                }
            }
            var loc = LividLair.Point.fromPixi(this.grid.toLocal(p.toPixi(), this));
            this.grid.dropElement(loc, this.getCurrentTileType());
            this.grid.click(loc);
        };
        Editor.prototype.touchMove = function (p) {
            if (!this.visible)
                return;
            var loc = LividLair.Point.fromPixi(this.grid.toLocal(p.toPixi(), this));
            this.grid.dropElement(loc, this.getCurrentTileType());
        };
        Editor.prototype.touchUp = function (p) {
            if (!this.visible)
                return;
        };
        return Editor;
    }(PIXI.Container));
    LividLair.Editor = Editor;
})(LividLair || (LividLair = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="game/Game.ts"/>
///<reference path="game/Defs.ts"/>
///<reference path="game/Controller.ts"/>
///<reference path="editor/Editor.ts"/>
var LividLair;
(function (LividLair) {
    var touchElement = /** @class */ (function () {
        function touchElement() {
        }
        return touchElement;
    }());
    LividLair.touchElement = touchElement;
    var GameContainer = /** @class */ (function (_super) {
        __extends(GameContainer, _super);
        function GameContainer() {
            var _this = _super.call(this, LividLair.APP_WIDTH, LividLair.APP_HEIGHT, { antialias: true, backgroundColor: 0x000000, transparent: false }) || this;
            _this.game = new LividLair.Game(LividLair.APP_WIDTH, LividLair.APP_HEIGHT);
            _this.stage.addChild(_this.game);
            _this.editor = new LividLair.Editor();
            _this.stage.addChild(_this.editor);
            return _this;
        }
        GameContainer.prototype.setup = function () {
            this.ticker.add(this.update, this);
            this.debugText = new PIXI.Text('');
            this.debugText.x = 20;
            this.debugText.y = 10;
            this.debugText.style.fill = 0xffffff;
            this.debugText.style.fontSize = 12;
            this.game.addChild(this.debugText);
            this.debugGraphics = new PIXI.Graphics();
            this.game.addChild(this.debugGraphics);
            this.game.setup();
            this.editor.setup();
            this.stage.interactive = true;
            this.stage.on("pointerdown", this.pointerDown, this);
            this.stage.on("pointermove", this.pointerMove, this);
            this.stage.on("pointerupoutside", this.pointerUp, this);
            this.stage.on("pointercancel", this.pointerUp, this);
            this.stage.on("pointerup", this.pointerUp, this);
            this.stage.on("pointerout", this.pointerUp, this);
            this.hasFocusTouch = false;
            this.touchPoints = [];
        };
        GameContainer.prototype.keyUp = function (key) {
            if (key == 127)
                this.editor.visible = !this.editor.visible;
            LividLair.Controller.keyUp(key);
        };
        GameContainer.prototype.keyDown = function (key) {
            LividLair.Controller.keyDown(key);
        };
        GameContainer.prototype.update = function () {
            var dt = this.ticker.elapsedMS * .001;
            this.debugText.text = "FPS: " + Math.round(1.0 / dt);
            dt = 1.0 / 60.0;
            this.game.update(dt);
        };
        GameContainer.prototype.pointerDown = function (event) {
            for (var i = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }
            this.editor.rightClick = event.data.button == 2;
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
                this.editor.touchDown(new LividLair.Point(pos.x, pos.y));
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
                this.editor.touchMove(new LividLair.Point(pos.x, pos.y));
        };
        GameContainer.prototype.pointerUp = function (event) {
            if (this.hasFocusTouch && this.touchPoints[0].id == event.data.identifier) {
                this.hasFocusTouch = false;
                var pos = event.data.getLocalPosition(this.game);
                this.editor.touchUp(new LividLair.Point(pos.x, pos.y));
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
        return GameContainer;
    }(PIXI.Application));
    LividLair.GameContainer = GameContainer;
})(LividLair || (LividLair = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="GameContainer.ts"/>
///<reference path="game/Defs.ts"/>
///<reference path="editor/Editor.ts"/>
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
    var containerWidth = LividLair.APP_WIDTH + 2 * margin;
    var containerHeight = LividLair.APP_HEIGHT + 2 * margin;
    var containerInnerRatio = containerWidth / containerHeight;
    if (containerInnerRatio < p_ratio)
        containerWidth = containerHeight * p_ratio;
    else
        containerHeight = containerWidth / p_ratio;
    var scale = p_width / containerWidth;
    var dx = (p_width - LividLair.APP_WIDTH * scale) / 2;
    var dy = (p_height - LividLair.APP_HEIGHT * scale) / 2;
    app.view.style.webkitTransform = app.view.style.transform = "matrix(" + scale + ", 0, 0, " + scale + ", " + dx + ", " + dy + ")";
    app.view.style.webkitTransformOrigin = app.view.style.transformOrigin = "0 0";
}
document.addEventListener('contextmenu', function (event) { if (LividLair.Editor.instance.visible) {
    event.preventDefault();
} });
window.onload = function () {
    // disableScroll();
    var app = new LividLair.GameContainer();
    app.view.style.position = "absolute";
    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);
    var roomsLoaded = function (data) {
        LividLair.LairData.instance.parse(data);
        PIXI.loader.add('bricks', 'assets/bricks.png');
        PIXI.loader.add('cracks', 'assets/cracks.png');
        PIXI.loader.add('mechFont', 'assets/fonts/Ausweis.ttf');
        PIXI.loader.add('vertexShader', 'assets/shader.vert');
        PIXI.loader.add('wallShader', 'assets/wallShader.frag');
        PIXI.loader.load(function () { app.setup(); });
    };
    LividLair.LairLoader.loadLair(roomsLoaded);
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
