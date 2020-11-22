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
    LividLair.APP_HEIGHT = 800;
    LividLair.ROOM_DEBUG = false;
    LividLair.ROOM_COUNT = 7;
    LividLair.GRID_UNIT_SIZE = 100.0;
    LividLair.PLAYER_WIDTH = .5 * LividLair.GRID_UNIT_SIZE;
    LividLair.LADDER_WIDTH = .6 * LividLair.GRID_UNIT_SIZE;
    LividLair.PLAYER_HEIGHT = .5 * LividLair.GRID_UNIT_SIZE;
    // export const BALL_RADIUS:number = .999 * GRID_UNIT_SIZE;//25.0;
    LividLair.DEBUG_MODE = false;
    LividLair.CTRL_PRESSED = false;
    function clamp(n, floor, ceil) {
        if (floor === void 0) { floor = 0; }
        if (ceil === void 0) { ceil = 1; }
        return Math.max(floor, Math.min(ceil, n));
    }
    LividLair.clamp = clamp;
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
            if (this.pressed[ControllerButton.Up])
                result.y = -1;
            else if (this.pressed[ControllerButton.Down])
                result.y = 1;
            // result = result.normalize();
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
                var p = gp.buttons[i].pressed;
                this.justPressed[i] = p && !this.pressed[i];
                this.pressed[i] = p;
            }
        };
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
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="AABB.ts"/>
var LividLair;
(function (LividLair) {
    var GameObject = /** @class */ (function (_super) {
        __extends(GameObject, _super);
        function GameObject(width, height) {
            var _this = _super.call(this) || this;
            _this.boxWidth = width;
            _this.boxHeight = height;
            _this.velocity = new LividLair.Point(0, 0);
            _this.clampedPosition = new LividLair.Point(0, 0);
            _this.ignorePlatform = false;
            return _this;
        }
        GameObject.prototype.getBoundingBox = function () {
            return new LividLair.AABB(new LividLair.Point(this.clampedPosition.x, this.clampedPosition.y), this.boxWidth, this.boxHeight);
        };
        GameObject.prototype.update = function (dt) {
            //...
        };
        GameObject.prototype.bounceOffFloor = function () {
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
            _this.clear();
            _this.beginFill(0x00aaff, 1);
            _this.drawRoundedRect(-LividLair.PLAYER_WIDTH / 2, -LividLair.PLAYER_HEIGHT / 2, LividLair.PLAYER_WIDTH, LividLair.PLAYER_HEIGHT, .2 * LividLair.GRID_UNIT_SIZE);
            _this.beginFill(0xff0000, 1);
            _this.drawCircle(0, 0, .05 * LividLair.GRID_UNIT_SIZE);
            _this.endFill();
            _this.state = PlayerState.Idle;
            _this.faceRight = true;
            _this.floatTimer = 0;
            _this.noClimbBuffer = 0;
            _this.shootTimer = 0;
            return _this;
        }
        Wizard.prototype.update = function (dt) {
            _super.prototype.update.call(this, dt);
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
            return _this;
        }
        Bullet.prototype.update = function (dt) {
            _super.prototype.update.call(this, dt);
        };
        Bullet.prototype.bounceOffFloor = function () {
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
            var _this = _super.call(this, LividLair.PLAYER_WIDTH / 2, LividLair.PLAYER_HEIGHT) || this;
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
            this.beginFill(0x55aaff, 1);
            this.moveTo(0, h0);
            this.lineTo(left, h1);
            this.lineTo(left, h2);
            this.lineTo(0, h3);
            this.lineTo(right, h2);
            this.lineTo(right, h1);
            this.closePath();
            this.endFill();
            this.lineStyle(2, 0xaabbff);
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
        Rubee.prototype.bounceOffFloor = function () {
        };
        return Rubee;
    }(LividLair.GameObject));
    LividLair.Rubee = Rubee;
})(LividLair || (LividLair = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Controller.ts"/>
///<reference path="GameObject.ts"/>
///<reference path="Wizard.ts"/>
///<reference path="Bullet.ts"/>
///<reference path="Rubee.ts"/>
var LividLair;
(function (LividLair) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(w, h) {
            var _this = _super.call(this) || this;
            _this.screenSize = new LividLair.Point(w, h);
            _this.controller = new LividLair.Controller();
            var background = new PIXI.Graphics();
            background.beginFill(0x0, 0.5);
            background.drawRect(0, 0, w, h);
            _this.addChild(background);
            _this.bricksTexture = PIXI.Texture.fromImage('assets/bricks.png');
            _this.levelContainer = new PIXI.Container();
            _this.addChild(_this.levelContainer);
            _this.levelElements = new PIXI.Container();
            _this.levelContainer.addChild(_this.levelElements);
            _this.wizard = new LividLair.Wizard();
            _this.wizard.x = w / 2;
            _this.wizard.y = h / 2;
            _this.wizard.clampedPosition = new LividLair.Point(w / 2, h / 2);
            _this.levelContainer.addChild(_this.wizard);
            _this.wizard.floatTimer = 0;
            _this.wizard.velocity = new LividLair.Point(0, 0);
            return _this;
        }
        Game.prototype.setup = function () {
            this.resetLevel();
        };
        Game.prototype.shuffleArray = function (array) {
            for (var i = array.length - 1; i > 0; i--) {
                // Generate random number 
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        };
        Game.prototype.resetLevel = function () {
            var rooms = [];
            if (LividLair.ROOM_DEBUG)
                rooms.push(PIXI.loader.resources['roomDebug'].data.split("\n"));
            else {
                for (var i_1 = 0; i_1 < LividLair.ROOM_COUNT; ++i_1)
                    rooms.push(PIXI.loader.resources['room' + i_1].data.split("\n"));
            }
            var hRoomCount = 3;
            var vRoomCount = 3;
            var roomCount = hRoomCount * vRoomCount;
            var roomDataList = [];
            for (var i = 0; i < roomCount; ++i)
                roomDataList.push({ room: rooms[i % rooms.length], flip_x: Math.random() < .5 });
            this.shuffleArray(roomDataList);
            this.blocks = [];
            this.platforms = [];
            this.ladders = [];
            this.pushBlocks = [];
            this.rubees = [];
            this.bullets = [];
            this.levelElements.removeChildren();
            var roomRows = 8;
            var roomCols = 10;
            this.rows = vRoomCount * roomRows + 4;
            this.columns = hRoomCount * roomCols + 4;
            var playerRow = Math.round(this.rows * .2);
            var playerColumn = Math.round(this.columns / 2);
            this.alignPositionToGrid(this.wizard, playerRow, playerColumn);
            this.wizard.clampedPosition.x = this.wizard.x;
            this.wizard.clampedPosition.y = this.wizard.y;
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    if (i < 2 || i > this.rows - 3 || j < 2 || j > this.columns - 3)
                        this.pushBlock(i, j, true); //BORDER
                    else if (!(playerRow == i && playerColumn == j)) {
                        var room_i = Math.floor((i - 2) / roomRows);
                        var room_j = Math.floor((j - 2) / roomCols);
                        var roomData = roomDataList[room_i * hRoomCount + room_j];
                        var ii = (i - 2) % roomRows;
                        var jj = (j - 2) % roomCols;
                        if (roomData.flip_x)
                            jj = roomCols - jj - 1;
                        var c = roomData.room[ii][jj];
                        if (c == "#")
                            this.pushBlock(i, j, false);
                        else if (c == "|")
                            this.pushLadder(i, j);
                        else if (c == "-")
                            this.pushPlatform(i, j, 0x00aaff);
                        else if (c == "+") {
                            this.pushLadder(i, j);
                            this.pushPlatform(i, j, 0x00aaff);
                        }
                        else if (c == "O") {
                            this.pushPushBlock(i, j, 0xaaaaaa);
                        }
                        else if (c == "?") {
                            this.pushRubee(i, j);
                        }
                    }
                }
            }
            this.fixCamera(false);
        };
        Game.prototype.pushPlatform = function (row, col, color) {
            var hw = LividLair.GRID_UNIT_SIZE / 2;
            var gr = new LividLair.GameObject(LividLair.GRID_UNIT_SIZE, LividLair.GRID_UNIT_SIZE);
            gr.beginFill(color, 1);
            // gr.lineStyle(2, color, 0.5);
            gr.drawRect(-hw, -hw, LividLair.GRID_UNIT_SIZE, LividLair.GRID_UNIT_SIZE * .1);
            // gr.endFill();
            gr.beginFill(color, 0.5);
            gr.moveTo(-hw, -hw);
            gr.bezierCurveTo(-hw, 0, hw, 0, hw, -hw);
            gr.endFill();
            this.alignPositionToGrid(gr, row, col);
            this.levelElements.addChild(gr);
            this.platforms.push(gr);
        };
        Game.prototype.pushBlock = function (row, col, darken) {
            var gr = new LividLair.GameObject(LividLair.GRID_UNIT_SIZE, LividLair.GRID_UNIT_SIZE);
            gr.beginFill(0x0, 1);
            gr.drawRect(-LividLair.GRID_UNIT_SIZE / 2, -LividLair.GRID_UNIT_SIZE / 2, LividLair.GRID_UNIT_SIZE, LividLair.GRID_UNIT_SIZE);
            gr.endFill();
            this.alignPositionToGrid(gr, row, col);
            this.levelElements.addChild(gr);
            // let data = PIXI.loader.resources['bricks'].data;
            var img = new PIXI.Sprite(this.bricksTexture);
            img.width = img.height = LividLair.GRID_UNIT_SIZE;
            img.x = -LividLair.GRID_UNIT_SIZE / 2;
            img.y = -LividLair.GRID_UNIT_SIZE / 2;
            if (darken) {
                img.alpha = 0.75;
            }
            gr.addChild(img);
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
            this.alignPositionToGrid(gr, row, col);
            this.levelElements.addChild(gr);
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
            this.levelElements.addChild(gr);
            this.ladders.push(gr);
        };
        Game.prototype.pushRubee = function (row, col) {
            var gr = new LividLair.Rubee();
            this.alignPositionToGrid(gr, row, col);
            this.levelElements.addChild(gr);
            this.rubees.push(gr);
        };
        Game.prototype.shoot = function () {
            if (this.wizard.shootTimer > 0)
                return;
            var gr = new LividLair.Bullet(this.wizard.clampedPosition.clone());
            gr.velocity.x = this.wizard.faceRight ? 10 : -10;
            gr.velocity.y = -15;
            this.levelElements.addChild(gr);
            this.bullets.push(gr);
            this.wizard.shootTimer = 0.5;
        };
        Game.prototype.alignPositionToGrid = function (p, row, column) {
            p.clampedPosition.x = p.position.x = column * LividLair.GRID_UNIT_SIZE;
            p.clampedPosition.y = p.position.y = row * LividLair.GRID_UNIT_SIZE;
        };
        Game.prototype.getAllElements = function () {
            return this.blocks.concat(this.platforms).concat(this.ladders).concat(this.pushBlocks).concat(this.rubees);
        };
        Game.prototype.fixCamera = function (smooth) {
            var takeFrac = smooth ? .2 : 1.0;
            this.levelContainer.x = (1.0 - takeFrac) * this.levelContainer.x + takeFrac * (-this.wizard.x + this.screenSize.x / 2);
            this.levelContainer.y = (1.0 - takeFrac) * this.levelContainer.y + takeFrac * (-this.wizard.y + this.screenSize.y / 2);
            this.levelContainer.x = Math.min(0, Math.max(this.levelContainer.x, this.screenSize.x - (this.columns - 1) * LividLair.GRID_UNIT_SIZE));
            this.levelContainer.y = Math.min(0, Math.max(this.levelContainer.y, this.screenSize.y - (this.rows - 1) * LividLair.GRID_UNIT_SIZE));
            //hide everything outside of camera bounds:
            var center = new LividLair.Point(this.levelContainer.x, this.levelContainer.y).multiply(-1).add(this.screenSize.clone().multiply(0.5));
            var cam_box = new LividLair.AABB(center, this.screenSize.x, this.screenSize.y);
            for (var _i = 0, _a = this.getAllElements(); _i < _a.length; _i++) {
                var e = _a[_i];
                var aabb = e.getBoundingBox();
                e.visible = aabb.intersects(cam_box);
            }
        };
        Game.prototype.sign = function (n) {
            if (n < 0)
                return -1;
            else if (n > 0)
                return 1;
            return 0;
        };
        Game.prototype.hasElementUnderneath = function (item, list) {
            var aabb = item.getBoundingBox();
            var objCollDistX = aabb.halfWidth + LividLair.GRID_UNIT_SIZE / 2;
            var objCollDistY = aabb.halfHeight + LividLair.GRID_UNIT_SIZE / 2;
            var filtered = list.filter(function (val) { return val != item; });
            for (var _i = 0, filtered_1 = filtered; _i < filtered_1.length; _i++) {
                var b = filtered_1[_i];
                var dx = item.clampedPosition.x - b.clampedPosition.x;
                var dy = item.clampedPosition.y - b.clampedPosition.y;
                if (Math.abs(dx) >= objCollDistX || Math.abs(dy) > objCollDistY)
                    continue;
                if (Math.abs(dx) <= objCollDistX && dy == -objCollDistY)
                    return true;
            }
            return false;
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
        Game.prototype.update = function (dt) {
            this.controller.update();
            if (this.controller.justPressed[LividLair.ControllerButton.BACK])
                this.resetLevel();
            var jump = this.controller.justPressed[LividLair.ControllerButton.A];
            var shoot = this.controller.justPressed[LividLair.ControllerButton.X];
            var run = this.controller.pressed[LividLair.ControllerButton.RT];
            var log = this.controller.pressed[LividLair.ControllerButton.LT];
            if (shoot)
                this.shoot();
            var dir = this.controller.getDirection();
            this.wizard.velocity.x = dir.x * (run ? 12.0 : 8.0);
            if (dir.x > 0)
                this.wizard.faceRight = true;
            if (dir.x < 0)
                this.wizard.faceRight = false;
            var vertDir = (Math.abs(dir.y) > .5) ? this.sign(dir.y) : 0;
            var playerCollDistX = LividLair.PLAYER_WIDTH / 2 + LividLair.GRID_UNIT_SIZE / 2;
            var playerCollDistY = LividLair.PLAYER_HEIGHT / 2 + LividLair.GRID_UNIT_SIZE / 2;
            this.wizard.ignorePlatform = this.wizard.state == LividLair.PlayerState.Climbing;
            //find obstacles underneath player:
            var hitBlock = this.hasElementUnderneath(this.wizard, this.blocks.concat(this.pushBlocks));
            var hitPlatform = this.hasElementUnderneath(this.wizard, this.platforms);
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
            //perform jumps:
            if (jump && this.wizard.velocity.y >= 0) {
                if (hitBlock || (floating && !hitPlatform)) {
                    this.wizard.velocity.y = -15;
                }
                else if (hitPlatform) {
                    if (vertDir > 0)
                        this.wizard.ignorePlatform = true;
                    else
                        this.wizard.velocity.y = -15;
                }
                this.wizard.floatTimer = 0;
                floating = false;
            }
            //apply gravity:
            if (!floating || this.wizard.velocity.y < 0)
                this.wizard.velocity.y = Math.min(30, this.wizard.velocity.y + dt * 40.0);
            //continue climb or cancel it:
            if (this.wizard.state == LividLair.PlayerState.Climbing) {
                var ladder = this.getHitObject(this.wizard.clampedPosition, this.ladders);
                if (ladder) {
                    var maxSpeed = 10;
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
                        this.wizard.velocity.y = vertDir <= 0 ? -15 : 0;
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
                for (var _i = 0, _a = this.ladders; _i < _a.length; _i++) {
                    var l = _a[_i];
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
            //resolve ledge-grab
            if (this.wizard.state == LividLair.PlayerState.Ledge) {
                this.wizard.velocity.x = 0;
                this.wizard.velocity.y = 0;
                if (jump) {
                    this.wizard.state = LividLair.PlayerState.Idle;
                    this.wizard.velocity.y = vertDir <= 0 ? -15 : 0;
                    this.wizard.noClimbBuffer = 0.2;
                }
            }
            else if (this.wizard.velocity.y > 0) {
                //find ledge to grab
                //TODO: make sure no block is above this one.. 
                //TODO: Also, make sure that resulting player AABB does not overlap anything else
                var solids = this.blocks.concat(this.pushBlocks);
                var p_box = this.wizard.getBoundingBox();
                var fall_y = Math.round(this.wizard.clampedPosition.y + this.wizard.velocity.y);
                for (var _b = 0, solids_1 = solids; _b < solids_1.length; _b++) {
                    var s = solids_1[_b];
                    var dx = this.wizard.clampedPosition.x - s.clampedPosition.x;
                    var dy = this.wizard.clampedPosition.y - s.clampedPosition.y;
                    var s_box = s.getBoundingBox();
                    if (Math.abs(dx) < s_box.halfWidth + p_box.halfWidth + 1) {
                        var test_x = s_box.center.x + this.sign(dx) * (Math.abs(dx) - p_box.halfWidth);
                        var test_y = s_box.center.y - s_box.halfHeight - 1;
                        if (this.getHitObject(new LividLair.Point(test_x, test_y), solids))
                            continue;
                        //make sure there is no box above 's':
                        // let top_box = s_box.
                        //     for(let ss of solids) {
                        //     }
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
            for (var _c = 0, _d = this.pushBlocks; _c < _d.length; _c++) {
                var b = _d[_c];
                var onGround = this.hasElementUnderneath(b, this.blocks.concat(this.pushBlocks).concat(this.platforms));
                var playerContainedDistY = LividLair.GRID_UNIT_SIZE / 2 - LividLair.PLAYER_HEIGHT / 2;
                var dx = this.wizard.clampedPosition.x - b.clampedPosition.x;
                var dy = this.wizard.clampedPosition.y - b.clampedPosition.y;
                if (pushMode && onGround && Math.abs(dx) == playerCollDistX && Math.abs(dy) <= playerContainedDistY)
                    b.velocity.x = dx < 0 ? 5 : -5;
                else
                    b.velocity.x = 0;
            }
            //update bullets:
            for (var i = 0; i < this.bullets.length; ++i) {
                var b = this.bullets[i];
                b.aliveTime += dt;
                if (b.aliveTime > 1.0) {
                    this.bullets.splice(i, 1);
                    --i;
                    this.levelElements.removeChild(b);
                }
            }
            //update push-block & collectible physics:
            var kinemElems = this.pushBlocks.concat(this.rubees).concat(this.bullets);
            for (var _e = 0, kinemElems_1 = kinemElems; _e < kinemElems_1.length; _e++) {
                var b = kinemElems_1[_e];
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
                    this.levelElements.removeChild(c);
                    --i;
                }
            }
            this.fixCamera(true);
        };
        Game.prototype.resolveCollisions = function (gObj) {
            var gAABB = gObj.getBoundingBox();
            var objCollDistX = gAABB.halfWidth + LividLair.GRID_UNIT_SIZE / 2;
            var objCollDistY = gAABB.halfHeight + LividLair.GRID_UNIT_SIZE / 2;
            var displacement = gObj.velocity.clone();
            //process x-displacement:
            var allBlockades = this.blocks.concat(this.pushBlocks).filter(function (val) { return val != gObj; });
            for (var _i = 0, allBlockades_1 = allBlockades; _i < allBlockades_1.length; _i++) {
                var b = allBlockades_1[_i];
                //y-collision?
                if (Math.abs(gObj.clampedPosition.y - b.clampedPosition.y) < objCollDistY) {
                    //if moving towards block:
                    var toBlockCenterX = b.clampedPosition.x - gObj.clampedPosition.x;
                    if (this.sign(displacement.x) == this.sign(toBlockCenterX)) {
                        var distanceLeft = Math.max(0, Math.abs(toBlockCenterX) - objCollDistX);
                        if (distanceLeft < Math.abs(displacement.x)) {
                            displacement.x = this.sign(displacement.x) * distanceLeft;
                            gObj.velocity.x = 0;
                        }
                    }
                }
            }
            // let locsPerUnit = 50.0;
            var spaceWidth = 1; //GRID_UNIT_SIZE / locsPerUnit;
            // if (Math.abs(displacement.x) > 0 && this.pushBlocks.indexOf(gObj) >= 0) {
            //     console.log(displacement.x);
            // }
            gObj.clampedPosition.x += displacement.x;
            gObj.clampedPosition.x = Math.round(gObj.clampedPosition.x); // / spaceWidth) * spaceWidth;
            gObj.clampedPosition.x = Math.max(1.5 * LividLair.GRID_UNIT_SIZE + .5 * gAABB.halfWidth, Math.min((this.columns - 2.5) * LividLair.GRID_UNIT_SIZE - .5 * gAABB.halfWidth, gObj.clampedPosition.x));
            spaceWidth = 1.0;
            //process y-displacement:
            for (var _a = 0, allBlockades_2 = allBlockades; _a < allBlockades_2.length; _a++) {
                var b = allBlockades_2[_a];
                //x-collision?
                if (Math.abs(gObj.clampedPosition.x - b.clampedPosition.x) < objCollDistX) {
                    //if moving towards block:
                    var toBlockCenterY = b.clampedPosition.y - gObj.clampedPosition.y;
                    if (this.sign(displacement.y) == this.sign(toBlockCenterY)) {
                        var distanceLeft = Math.max(0, Math.abs(toBlockCenterY) - objCollDistY);
                        if (distanceLeft < Math.abs(displacement.y)) {
                            if (this.sign(displacement.y) > 0)
                                gObj.bounceOffFloor();
                            gObj.velocity.y = 0;
                            displacement.y = this.sign(displacement.y) * distanceLeft;
                        }
                    }
                }
            }
            //process y-displacement (for platforms):
            for (var _b = 0, _c = this.platforms; _b < _c.length; _b++) {
                var p = _c[_b];
                if (gObj.ignorePlatform)
                    break;
                //x-collision?
                if (Math.abs(gObj.clampedPosition.x - p.x) < objCollDistX) {
                    //if moving towards platform:
                    var toPlatformCenterY = p.y - gObj.clampedPosition.y;
                    if (toPlatformCenterY <= 0)
                        continue;
                    if (this.sign(displacement.y) == this.sign(toPlatformCenterY)) {
                        var distanceLeft = Math.abs(toPlatformCenterY) - objCollDistY;
                        if (distanceLeft < 0)
                            continue;
                        if (distanceLeft <= Math.abs(displacement.y)) {
                            displacement.y = this.sign(displacement.y) * distanceLeft;
                            gObj.velocity.y = 0;
                        }
                    }
                }
            }
            //clamp to screen bounds:
            gObj.clampedPosition.y += displacement.y;
            gObj.clampedPosition.y = Math.round(gObj.clampedPosition.y); // / spaceWidth) * spaceWidth;
            gObj.clampedPosition.y = Math.max(1.5 * LividLair.GRID_UNIT_SIZE + .5 * gAABB.halfHeight, Math.min((this.rows - 2.5) * LividLair.GRID_UNIT_SIZE - .5 * gAABB.halfHeight, gObj.clampedPosition.y));
            gObj.x = .5 * gObj.x + .5 * gObj.clampedPosition.x;
            gObj.y = .5 * gObj.y + .5 * gObj.clampedPosition.y;
            // gObj.x = gObj.clampedPosition.x;
            // gObj.y = gObj.clampedPosition.y;
        };
        return Game;
    }(PIXI.Container));
    LividLair.Game = Game;
})(LividLair || (LividLair = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="game/Game.ts"/>
///<reference path="game/Defs.ts"/>
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
            _this.app_scale = 0.85;
            _this.backgroundTexture = PIXI.Texture.fromImage('assets/background.jpg');
            _this.backgroundImage = new PIXI.Sprite(_this.backgroundTexture);
            _this.stage.addChild(_this.backgroundImage);
            _this.game = new LividLair.Game(LividLair.APP_WIDTH, LividLair.APP_HEIGHT);
            _this.stage.addChild(_this.game);
            _this.componentMask = new PIXI.Graphics();
            _this.componentMask.beginFill(0xFFFFFF);
            _this.componentMask.drawRect(0, 0, LividLair.APP_WIDTH, LividLair.APP_HEIGHT);
            _this.componentMask.endFill();
            _this.componentMask.isMask = true;
            _this.game.mask = _this.componentMask;
            _this.game.pivot.x = .5 * LividLair.APP_WIDTH;
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
                _this.componentBoundary.drawRoundedRect(-t, -t, LividLair.APP_WIDTH + 2 * t, LividLair.APP_HEIGHT + 2 * t, 5 + t);
            }
            _this.stage.addChild(_this.componentBoundary);
            _this.componentBoundary.pivot.x = _this.game.pivot.x = .5 * LividLair.APP_WIDTH;
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
            this.game.setup();
        };
        GameContainer.prototype.keyUp = function (key) {
            console.log(key);
            switch (key) {
                case 17: //ctrl
                    LividLair.CTRL_PRESSED = false;
                    break;
            }
        };
        GameContainer.prototype.keyDown = function (key) {
            console.log(key);
            switch (key) {
                // case 37: //left
                //     this.game.left();
                //     break;
                // case 38: //up
                //     this.game.up();
                //     break;
                // case 39: //right
                //     this.game.right();
                //     break;
                // case 40: //down
                //     this.game.down();
                //     break;
                // case 32: //space
                //     this.game.rotate();
                //     break;
                case 17: //ctrl:
                    LividLair.CTRL_PRESSED = true;
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
                // this.game.touchDown(new Point(pos.x, pos.y));
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
            // if (this.hasFocusTouch && this.touchPoints[0].id == event.data.identifier)
            //     this.game.touchMove(new Point(pos.x, pos.y));
        };
        GameContainer.prototype.pointerUp = function (event) {
            if (this.hasFocusTouch && this.touchPoints[0].id == event.data.identifier) {
                this.hasFocusTouch = false;
                var pos = event.data.getLocalPosition(this.game);
                // this.game.touchUp(new Point(pos.x, pos.y));
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
            this.game.x = (w - LividLair.APP_WIDTH) / 2 + LividLair.APP_WIDTH / 2;
            this.game.y = (h - LividLair.APP_HEIGHT) / 2;
            // this.componentBoundary.x = w / 2;
            // this.componentBoundary.y = h / 2;
            this.componentBoundary.x = this.game.x;
            this.componentBoundary.y = this.game.y;
            this.componentMask.clear();
            this.componentMask.beginFill(0xffffff);
            this.componentMask.drawRect(this.game.x - this.app_scale * LividLair.APP_WIDTH / 2, this.game.y, this.app_scale * LividLair.APP_WIDTH, this.app_scale * LividLair.APP_HEIGHT);
            this.componentMask.endFill();
            this.renderer.resize(w, h);
            this.componentBoundary.scale.x = this.game.scale.x = this.app_scale;
            this.componentBoundary.scale.y = this.game.scale.y = this.app_scale;
        };
        GameContainer.prototype.update = function () {
            var dt = this.ticker.elapsedMS * .001;
            this.debugText.text = "FPS: " + Math.round(1.0 / dt);
            dt = 1.0 / 60.0;
            this.game.update(dt);
        };
        return GameContainer;
    }(PIXI.Application));
    LividLair.GameContainer = GameContainer;
})(LividLair || (LividLair = {}));
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
    var containerWidth = LividLair.APP_WIDTH + 2 * margin;
    var containerHeight = LividLair.APP_HEIGHT + 2 * margin;
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
    var app = new LividLair.GameContainer();
    app.view.style.position = "absolute";
    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);
    PIXI.loader.add('bricks', 'assets/bricks.jpg');
    PIXI.loader.add('roomDebug', 'rooms/roomDebug.txt');
    for (var i = 0; i < LividLair.ROOM_COUNT; ++i)
        PIXI.loader.add('room' + i, 'rooms/room' + i + '.txt');
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
