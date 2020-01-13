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
var CircuitFreaks;
(function (CircuitFreaks) {
    var TileType;
    (function (TileType) {
        TileType[TileType["Curve_NE"] = 0] = "Curve_NE";
        TileType[TileType["Curve_NW"] = 1] = "Curve_NW";
        TileType[TileType["Curve_SE"] = 2] = "Curve_SE";
        TileType[TileType["Curve_SW"] = 3] = "Curve_SW";
        TileType[TileType["Straight_H"] = 4] = "Straight_H";
        TileType[TileType["Straight_V"] = 5] = "Straight_V";
        TileType[TileType["Double_NE"] = 6] = "Double_NE";
        TileType[TileType["Double_NW"] = 7] = "Double_NW";
        TileType[TileType["Source"] = 8] = "Source";
        TileType[TileType["DoubleSource"] = 9] = "DoubleSource";
        TileType[TileType["TripleSource"] = 10] = "TripleSource";
        TileType[TileType["Blockade"] = 11] = "Blockade";
        TileType[TileType["Trash"] = 12] = "Trash";
        TileType[TileType["Count"] = 13] = "Count";
    })(TileType = CircuitFreaks.TileType || (CircuitFreaks.TileType = {}));
    var TileDescriptor = /** @class */ (function () {
        function TileDescriptor(type, groupIndex) {
            this.type = type;
            this.groupIndex = groupIndex;
        }
        return TileDescriptor;
    }());
    CircuitFreaks.TileDescriptor = TileDescriptor;
    /*
    export class BoardDescriptor {
        rows:number;
        columns:number
        tiles:TileDescriptor[];

        constructor(rows:number, columns:number, tiles:TileDescriptor[]) {
            this.rows = rows;
            this.columns = columns;
            this.tiles = tiles;
        }
    }

    export class TilePanelDescriptor {
        currentType:TileType[];
        nextTypes:TileType[][];
        constructor(currentType:TileType[], nextTypes:TileType[][]) {
            this.currentType = currentType;
            this.nextTypes = nextTypes;
        }
    }
    */
    function rotateTypeCW(type) {
        switch (type) {
            case TileType.Curve_NE:
                return TileType.Curve_SE;
            case TileType.Curve_NW:
                return TileType.Curve_NE;
            case TileType.Curve_SE:
                return TileType.Curve_SW;
            case TileType.Curve_SW:
                return TileType.Curve_NW;
            case TileType.Straight_H:
                return TileType.Straight_V;
            case TileType.Straight_V:
                return TileType.Straight_H;
            case TileType.Double_NE:
                return TileType.Double_NW;
            case TileType.Double_NW:
                return TileType.Double_NE;
        }
        return type;
    }
    CircuitFreaks.rotateTypeCW = rotateTypeCW;
    function rotateTypeCCW(type) {
        // :)
        return rotateTypeCW(rotateTypeCW(rotateTypeCW(type)));
    }
    CircuitFreaks.rotateTypeCCW = rotateTypeCCW;
    function easeBounceOut(t) {
        t = Math.max(Math.min(t, 1), 0);
        if (t < (1 / 2.75)) {
            return 1 * (7.5625 * t * t);
        }
        else if (t < (2 / 2.75)) {
            return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
        }
        else if (t < (2.5 / 2.75)) {
            return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
        }
        else {
            return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
        }
        return 1;
    }
    CircuitFreaks.easeBounceOut = easeBounceOut;
    function easeOutElastic(t) {
        var s = 1.70158;
        var p = 0;
        var a = 1;
        if (t == 0)
            return 0;
        if ((t /= 1) == 1)
            return 1;
        if (!p)
            p = 1 * .3;
        if (a < Math.abs(1)) {
            a = 1;
            var s = p / 4;
        }
        else
            var s = p / (2 * Math.PI) * Math.asin(1 / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;
    }
    CircuitFreaks.easeOutElastic = easeOutElastic;
    var Coord = /** @class */ (function () {
        function Coord() {
        }
        return Coord;
    }());
    CircuitFreaks.Coord = Coord;
    var Direction;
    (function (Direction) {
        Direction[Direction["Up"] = 0] = "Up";
        Direction[Direction["Down"] = 1] = "Down";
        Direction[Direction["Left"] = 2] = "Left";
        Direction[Direction["Right"] = 3] = "Right";
    })(Direction = CircuitFreaks.Direction || (CircuitFreaks.Direction = {}));
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var TileState;
    (function (TileState) {
        TileState[TileState["Appearing"] = 0] = "Appearing";
        TileState[TileState["Idle"] = 1] = "Idle";
        TileState[TileState["Disappearing"] = 2] = "Disappearing";
        TileState[TileState["Dropping"] = 3] = "Dropping";
        TileState[TileState["Degrading"] = 4] = "Degrading";
        TileState[TileState["Gone"] = 5] = "Gone";
        TileState[TileState["Flipping"] = 6] = "Flipping";
    })(TileState = CircuitFreaks.TileState || (CircuitFreaks.TileState = {}));
    var CircuitState;
    (function (CircuitState) {
        CircuitState[CircuitState["None"] = 0] = "None";
        CircuitState[CircuitState["Circuit"] = 1] = "Circuit";
        CircuitState[CircuitState["DeadLock"] = 2] = "DeadLock";
    })(CircuitState = CircuitFreaks.CircuitState || (CircuitFreaks.CircuitState = {}));
    var Tile = /** @class */ (function (_super) {
        __extends(Tile, _super);
        function Tile(width, type) {
            var _this = _super.call(this) || this;
            _this.tileWidth = width;
            _this.type = type;
            _this.groupIndex = 0;
            _this.graphics = new PIXI.Graphics();
            _this.addChild(_this.graphics);
            _this.shadowGraphics = new PIXI.Graphics();
            _this.addChild(_this.shadowGraphics);
            _this.shadowGraphics.beginFill(0x0, 0.5);
            _this.shadowGraphics.drawRoundedRect(-width / 2, -width / 2, width, width, .1 * width);
            _this.shadowGraphics.endFill();
            _this.shadowGraphics.alpha = 0;
            _this.dropDistance = 0;
            _this.setState(TileState.Idle);
            _this.clearCircuitState();
            _this.redraw();
            return _this;
        }
        Tile.prototype.setCircuitLineStyle = function (state, lineWidth) {
            switch (state) {
                case CircuitState.DeadLock:
                    this.graphics.lineStyle(lineWidth, 0xffffff, .5);
                    break;
                case CircuitState.Circuit:
                    this.graphics.lineStyle(lineWidth, 0x00ffff, 1);
                    break;
                case CircuitState.None:
                default:
                    this.graphics.lineStyle(lineWidth, 0xffffff, 1);
                    break;
            }
        };
        Tile.prototype.redraw = function () {
            this.visualUpdatePending = false;
            var width = this.tileWidth;
            var type = this.type;
            var baseColor = 0x00ff00;
            var borderColor = 0x00aa00;
            var subWidth = width * .9;
            if (type == CircuitFreaks.TileType.Blockade) {
                baseColor = 0xcc0000;
                borderColor = 0x990000;
                subWidth *= .8;
            }
            else if (type == CircuitFreaks.TileType.Trash) {
                baseColor = 0xccffff;
                borderColor = 0xaacccc;
                // subWidth *= .8;
            }
            else if (type == CircuitFreaks.TileType.Source || type == CircuitFreaks.TileType.DoubleSource || type == CircuitFreaks.TileType.TripleSource) {
                switch (this.groupIndex) {
                    case 1:
                        baseColor = 0xff00aa;
                        borderColor = 0xaa0066;
                        break;
                    case 2:
                        baseColor = 0x00aaff;
                        borderColor = 0x0066aa;
                        break;
                    case 0:
                    default:
                        baseColor = 0xffaa00;
                        borderColor = 0xaa6600;
                        break;
                }
            }
            this.graphics.clear();
            this.graphics.beginFill(borderColor, 1.0);
            this.graphics.drawRoundedRect(-width / 2, -width / 2, width, width, .1 * width);
            this.graphics.endFill();
            this.graphics.beginFill(baseColor, 1.0);
            this.graphics.drawRoundedRect(-subWidth / 2, -subWidth / 2, subWidth, subWidth, .1 * subWidth);
            this.graphics.endFill();
            var lineWidth = .1 * width;
            this.setCircuitLineStyle(this.circuitState, lineWidth);
            var rad = width / 2.0;
            var ang = .5 * Math.PI;
            switch (this.type) {
                case CircuitFreaks.TileType.Curve_NE:
                    this.graphics.moveTo(rad, 0);
                    this.graphics.arc(rad, -rad, rad, ang, 2 * ang); // cx, cy, radius, startAngle, endAngle
                    break;
                case CircuitFreaks.TileType.Curve_NW:
                    this.graphics.moveTo(0, -rad);
                    this.graphics.arc(-rad, -rad, rad, 0, ang);
                    break;
                case CircuitFreaks.TileType.Curve_SE:
                    this.graphics.moveTo(0, rad);
                    this.graphics.arc(rad, rad, rad, 2 * ang, 3 * ang);
                    break;
                case CircuitFreaks.TileType.Curve_SW:
                    this.graphics.moveTo(-rad, 0);
                    this.graphics.arc(-rad, rad, rad, -ang, 0);
                    break;
                case CircuitFreaks.TileType.Straight_H:
                    this.graphics.moveTo(-rad, 0);
                    this.graphics.lineTo(rad, 0);
                    break;
                case CircuitFreaks.TileType.Straight_V:
                    this.graphics.moveTo(0, -rad);
                    this.graphics.lineTo(0, rad);
                    break;
                case CircuitFreaks.TileType.Double_NE:
                    this.graphics.moveTo(rad, 0);
                    this.graphics.arc(rad, -rad, rad, ang, 2 * ang);
                    this.setCircuitLineStyle(this.altCircuitState, lineWidth);
                    this.graphics.moveTo(-rad, 0);
                    this.graphics.arc(-rad, rad, rad, -ang, 0);
                    break;
                case CircuitFreaks.TileType.Double_NW:
                    this.graphics.moveTo(0, -rad);
                    this.graphics.arc(-rad, -rad, rad, 0, ang);
                    this.setCircuitLineStyle(this.altCircuitState, lineWidth);
                    this.graphics.moveTo(0, rad);
                    this.graphics.arc(rad, rad, rad, 2 * ang, 3 * ang);
                    break;
                case CircuitFreaks.TileType.Source:
                    this.graphics.drawCircle(0, 0, rad - lineWidth * .5);
                    break;
                case CircuitFreaks.TileType.DoubleSource:
                    this.graphics.drawCircle(0, 0, rad * .5);
                    this.graphics.drawCircle(0, 0, rad - lineWidth * .5);
                    break;
                case CircuitFreaks.TileType.TripleSource:
                    this.graphics.drawCircle(0, 0, rad * .5);
                    this.graphics.drawCircle(0, 0, rad - lineWidth * .5);
                    this.graphics.drawCircle(0, 0, rad * .1);
                    break;
                case CircuitFreaks.TileType.Blockade:
                    break;
                case CircuitFreaks.TileType.Trash:
                    break;
            }
        };
        Tile.prototype.partialDegrade = function (dir) {
            var goalType = this.type;
            var b1 = this.circuitState == CircuitState.DeadLock;
            var b2 = this.altCircuitState == CircuitState.DeadLock;
            var keepDeadlock = false;
            switch (this.type) {
                case CircuitFreaks.TileType.Double_NE:
                    if (b1 && (dir == CircuitFreaks.Direction.Down || dir == CircuitFreaks.Direction.Left)) {
                        goalType = CircuitFreaks.TileType.Curve_SW;
                        keepDeadlock = b2;
                    }
                    else if (b2 && (dir == CircuitFreaks.Direction.Up || dir == CircuitFreaks.Direction.Right)) {
                        goalType = CircuitFreaks.TileType.Curve_NE;
                        keepDeadlock = b1;
                    }
                    break;
                case CircuitFreaks.TileType.Double_NW:
                    if (b1 && (dir == CircuitFreaks.Direction.Down || dir == CircuitFreaks.Direction.Right)) {
                        goalType = CircuitFreaks.TileType.Curve_SE;
                        keepDeadlock = b2;
                    }
                    else if (b2 && (dir == CircuitFreaks.Direction.Up || dir == CircuitFreaks.Direction.Left)) {
                        goalType = CircuitFreaks.TileType.Curve_NW;
                        keepDeadlock = b1;
                    }
                    break;
                default:
                    break;
            }
            if (this.type == goalType) {
                this.degrade();
            }
            else {
                this.type = goalType;
                this.clearCircuitState();
                if (keepDeadlock)
                    this.circuitState = CircuitState.DeadLock;
                this.redraw();
                this.setState(TileState.Degrading);
            }
        };
        Tile.prototype.degrade = function () {
            var goalType = this.type;
            var b1 = this.circuitState == CircuitState.DeadLock;
            var b2 = this.altCircuitState == CircuitState.DeadLock;
            switch (this.type) {
                case CircuitFreaks.TileType.Curve_NE:
                case CircuitFreaks.TileType.Curve_NW:
                case CircuitFreaks.TileType.Curve_SE:
                case CircuitFreaks.TileType.Curve_SW:
                case CircuitFreaks.TileType.Straight_H:
                case CircuitFreaks.TileType.Straight_V:
                    goalType = CircuitFreaks.TileType.Trash;
                    break;
                case CircuitFreaks.TileType.Double_NE:
                    if (b1 && b2)
                        goalType = CircuitFreaks.TileType.Trash;
                    else if (b1)
                        goalType = CircuitFreaks.TileType.Curve_SW;
                    else if (b2)
                        goalType = CircuitFreaks.TileType.Curve_NE;
                    break;
                case CircuitFreaks.TileType.Double_NW:
                    if (b1 && b2)
                        goalType = CircuitFreaks.TileType.Trash;
                    else if (b1)
                        goalType = CircuitFreaks.TileType.Curve_SE;
                    else if (b2)
                        goalType = CircuitFreaks.TileType.Curve_NW;
                    break;
                default:
                    return;
            }
            this.type = goalType;
            this.clearCircuitState();
            this.redraw();
            this.setState(TileState.Degrading);
        };
        Tile.prototype.setState = function (state) {
            this.state = state;
            this.stateParameter = 0;
            switch (this.state) {
                case TileState.Appearing:
                    break;
                case TileState.Idle:
                    this.graphics.position.y = 0;
                    this.graphics.scale.x = this.graphics.scale.y = 1;
                    this.graphics.rotation = 0;
                    this.shadowGraphics.alpha = 0;
                    if (this.visualUpdatePending)
                        this.redraw();
                    break;
                case TileState.Disappearing:
                    break;
                case TileState.Dropping:
                    break;
                case TileState.Degrading:
                    break;
                case TileState.Gone:
                    this.graphics.visible = false;
                    break;
                case TileState.Flipping:
                    this.visualUpdatePending = true;
                    break;
            }
        };
        Tile.prototype.updateCurrentState = function (dt, duration, nextState) {
            this.stateParameter += dt / duration;
            if (this.stateParameter > 1.0) {
                this.setState(nextState);
            }
        };
        Tile.prototype.clearCircuitState = function () {
            this.sourceHitCount = 0;
            this.circuitState = CircuitState.None;
            this.altCircuitState = CircuitState.None;
        };
        Tile.prototype.setStateFromDirection = function (dir, state) {
            switch (this.type) {
                case CircuitFreaks.TileType.Double_NE:
                    if (dir == CircuitFreaks.Direction.Down || dir == CircuitFreaks.Direction.Left)
                        this.circuitState = state;
                    else
                        this.altCircuitState = state;
                    break;
                case CircuitFreaks.TileType.Double_NW:
                    if (dir == CircuitFreaks.Direction.Down || dir == CircuitFreaks.Direction.Right)
                        this.circuitState = state;
                    else
                        this.altCircuitState = state;
                    break;
                default:
                    this.circuitState = state;
                    this.altCircuitState = state;
                    break;
            }
        };
        Tile.prototype.hasCircuit = function () {
            return this.circuitState == CircuitState.Circuit || this.altCircuitState == CircuitState.Circuit;
        };
        Tile.prototype.hasDeadlock = function () {
            return this.circuitState == CircuitState.DeadLock || this.altCircuitState == CircuitState.DeadLock;
        };
        Tile.prototype.circuitEliminatesTile = function () {
            if (!this.hasCircuit())
                return false;
            var bothCircuit = this.circuitState == CircuitState.Circuit && this.altCircuitState == CircuitState.Circuit;
            switch (this.type) {
                case CircuitFreaks.TileType.DoubleSource:
                    return this.sourceHitCount >= 2;
                case CircuitFreaks.TileType.TripleSource:
                    return this.sourceHitCount >= 3;
                // case TileType.Double_NE:
                // case TileType.Double_NW:
                //     return bothCircuit;    
            }
            return true;
        };
        Tile.prototype.mirrorTile = function () {
            var mirrorType = this.type;
            switch (this.type) {
                case CircuitFreaks.TileType.Curve_NE:
                    mirrorType = CircuitFreaks.TileType.Curve_SE;
                    break;
                case CircuitFreaks.TileType.Curve_NW:
                    mirrorType = CircuitFreaks.TileType.Curve_SW;
                    break;
                case CircuitFreaks.TileType.Curve_SE:
                    mirrorType = CircuitFreaks.TileType.Curve_NE;
                    break;
                case CircuitFreaks.TileType.Curve_SW:
                    mirrorType = CircuitFreaks.TileType.Curve_NW;
                    break;
                case CircuitFreaks.TileType.Double_NE:
                    mirrorType = CircuitFreaks.TileType.Double_NW;
                    break;
                case CircuitFreaks.TileType.Double_NW:
                    mirrorType = CircuitFreaks.TileType.Double_NE;
                    break;
                default:
                    //do nothing...
                    break;
            }
            this.type = mirrorType;
            this.setState(TileState.Flipping);
        };
        Tile.prototype.directionIntoState = function (dir, state) {
            switch (this.type) {
                case CircuitFreaks.TileType.Double_NE:
                    if (dir == CircuitFreaks.Direction.Down || dir == CircuitFreaks.Direction.Left)
                        return this.circuitState == state;
                    else
                        return this.altCircuitState == state;
                case CircuitFreaks.TileType.Double_NW:
                    if (dir == CircuitFreaks.Direction.Down || dir == CircuitFreaks.Direction.Right)
                        return this.circuitState == state;
                    else
                        return this.altCircuitState == state;
                default:
                    return this.circuitState == state;
            }
        };
        Tile.prototype.filterCircuitFromTile = function () {
            var newType = this.type;
            switch (this.type) {
                case CircuitFreaks.TileType.DoubleSource:
                    if (this.sourceHitCount == 1)
                        newType = CircuitFreaks.TileType.Source;
                    break;
                case CircuitFreaks.TileType.TripleSource:
                    if (this.sourceHitCount == 1)
                        newType = CircuitFreaks.TileType.DoubleSource;
                    else if (this.sourceHitCount == 2)
                        newType = CircuitFreaks.TileType.Source;
                    break;
                case CircuitFreaks.TileType.Double_NE:
                    newType = this.circuitState == CircuitState.Circuit ? CircuitFreaks.TileType.Curve_SW : CircuitFreaks.TileType.Curve_NE;
                    break;
                case CircuitFreaks.TileType.Double_NW:
                    newType = this.circuitState == CircuitState.Circuit ? CircuitFreaks.TileType.Curve_SE : CircuitFreaks.TileType.Curve_NW;
                    break;
            }
            this.type = newType;
            this.clearCircuitState();
            this.redraw();
            this.setState(TileState.Degrading);
        };
        Tile.prototype.updateState = function (dt) {
            switch (this.state) {
                case TileState.Appearing:
                    this.graphics.scale.x = this.graphics.scale.y = CircuitFreaks.easeOutElastic(this.stateParameter);
                    this.updateCurrentState(dt, 0.5, TileState.Idle);
                    break;
                case TileState.Idle:
                    //do nothing...
                    break;
                case TileState.Disappearing:
                    {
                        this.graphics.alpha = 1 - this.stateParameter;
                        this.updateCurrentState(dt, 0.5, TileState.Gone);
                    }
                    break;
                case TileState.Dropping:
                    {
                        var t = this.stateParameter; //1 - easeBounceOut(this.stateParameter);
                        var dropFrac = 0.5;
                        if (t < dropFrac) {
                            var tt = t / dropFrac;
                            this.graphics.position.y = Math.cos(tt * .5 * Math.PI) * this.dropDistance;
                        }
                        else {
                            var tt = (t - dropFrac) / (1 - dropFrac);
                            this.graphics.position.y = 0;
                            this.graphics.scale.x = 1 + 0.1 * Math.sin(tt * 6) * (1 - tt);
                            this.graphics.scale.y = 2 - this.graphics.scale.x;
                        }
                        // this.graphics.position.y = t * this.dropDistance;
                        this.updateCurrentState(dt, 0.66, TileState.Idle);
                    }
                    break;
                case TileState.Degrading:
                    {
                        var t = .2 * Math.sin(this.stateParameter * 10) * (1 - this.stateParameter);
                        // this.graphics.rotation = t;
                        this.graphics.scale.x = this.graphics.scale.y = 1 + .1 * Math.sin(this.stateParameter * 15) * (1 - this.stateParameter);
                        this.updateCurrentState(dt, 0.5, TileState.Idle);
                    }
                    break;
                case TileState.Gone:
                    //do nothing...
                    break;
                case TileState.Flipping:
                    {
                        var t = .5 + .5 * Math.cos(this.stateParameter * 2 * Math.PI);
                        // var s = 1 - .3 * Math.sin(this.stateParameter * 15) * (1 - this.stateParameter);
                        // this.graphics.scale.x = s;
                        this.graphics.scale.y = t;
                        this.shadowGraphics.alpha = 1 - t;
                        // this.graphics.scale.y = t;
                        if (this.stateParameter >= .5 && this.visualUpdatePending)
                            this.redraw();
                        this.updateCurrentState(dt, 0.3, TileState.Idle);
                    }
                    break;
            }
        };
        Tile.prototype.update = function (dt) {
            this.updateState(dt);
        };
        Tile.prototype.drop = function (distance) {
            this.dropDistance = distance;
            this.setState(TileState.Dropping);
        };
        Tile.prototype.connects = function (dir) {
            var n = dir == CircuitFreaks.Direction.Down;
            var e = dir == CircuitFreaks.Direction.Left;
            var s = dir == CircuitFreaks.Direction.Up;
            var w = dir == CircuitFreaks.Direction.Right;
            switch (this.type) {
                case CircuitFreaks.TileType.Curve_NE:
                    return n || e;
                case CircuitFreaks.TileType.Curve_NW:
                    return n || w;
                case CircuitFreaks.TileType.Curve_SE:
                    return s || e;
                case CircuitFreaks.TileType.Curve_SW:
                    return s || w;
                case CircuitFreaks.TileType.Straight_H:
                    return w || e;
                case CircuitFreaks.TileType.Straight_V:
                    return n || s;
                case CircuitFreaks.TileType.Double_NE:
                case CircuitFreaks.TileType.Double_NW:
                    return true;
                case CircuitFreaks.TileType.Source:
                case CircuitFreaks.TileType.DoubleSource:
                case CircuitFreaks.TileType.TripleSource:
                case CircuitFreaks.TileType.Trash:
                    return true;
                case CircuitFreaks.TileType.Blockade:
                    return false;
            }
            return false;
        };
        Tile.prototype.getNextDirection = function (dir) {
            var n = dir == CircuitFreaks.Direction.Down;
            var e = dir == CircuitFreaks.Direction.Left;
            var s = dir == CircuitFreaks.Direction.Up;
            var w = dir == CircuitFreaks.Direction.Right;
            switch (this.type) {
                case CircuitFreaks.TileType.Curve_NE:
                    return n ? CircuitFreaks.Direction.Right : CircuitFreaks.Direction.Up;
                case CircuitFreaks.TileType.Curve_NW:
                    return n ? CircuitFreaks.Direction.Left : CircuitFreaks.Direction.Up;
                case CircuitFreaks.TileType.Curve_SE:
                    return s ? CircuitFreaks.Direction.Right : CircuitFreaks.Direction.Down;
                case CircuitFreaks.TileType.Curve_SW:
                    return s ? CircuitFreaks.Direction.Left : CircuitFreaks.Direction.Down;
                case CircuitFreaks.TileType.Straight_H:
                    return dir;
                case CircuitFreaks.TileType.Straight_V:
                    return dir;
                case CircuitFreaks.TileType.Double_NE:
                    if (n || e)
                        return n ? CircuitFreaks.Direction.Right : CircuitFreaks.Direction.Up;
                    else
                        return s ? CircuitFreaks.Direction.Left : CircuitFreaks.Direction.Down;
                case CircuitFreaks.TileType.Double_NW:
                    if (n || w)
                        return n ? CircuitFreaks.Direction.Left : CircuitFreaks.Direction.Up;
                    else
                        return s ? CircuitFreaks.Direction.Right : CircuitFreaks.Direction.Down;
            }
            return dir;
        };
        Tile.prototype.hasNorthPath = function () {
            switch (this.type) {
                case CircuitFreaks.TileType.Curve_NE:
                case CircuitFreaks.TileType.Curve_NW:
                case CircuitFreaks.TileType.Straight_V:
                case CircuitFreaks.TileType.Double_NE:
                case CircuitFreaks.TileType.Double_NW:
                    return true;
            }
            return false;
        };
        Tile.prototype.getOutwardDirectionsWithState = function (dirs, state) {
            switch (this.type) {
                case CircuitFreaks.TileType.Double_NE:
                    if (this.circuitState == state) {
                        dirs.push(CircuitFreaks.Direction.Up);
                        dirs.push(CircuitFreaks.Direction.Right);
                    }
                    if (this.altCircuitState == state) {
                        dirs.push(CircuitFreaks.Direction.Down);
                        dirs.push(CircuitFreaks.Direction.Left);
                    }
                    break;
                case CircuitFreaks.TileType.Double_NW:
                    if (this.circuitState == state) {
                        dirs.push(CircuitFreaks.Direction.Up);
                        dirs.push(CircuitFreaks.Direction.Left);
                    }
                    if (this.altCircuitState == state) {
                        dirs.push(CircuitFreaks.Direction.Down);
                        dirs.push(CircuitFreaks.Direction.Right);
                    }
                    break;
                default:
                    if (this.circuitState == state)
                        this.getOutwardDirections(dirs);
                    break;
            }
        };
        Tile.prototype.getOutwardDirections = function (dirs) {
            switch (this.type) {
                case CircuitFreaks.TileType.Curve_NE:
                    dirs.push(CircuitFreaks.Direction.Up);
                    dirs.push(CircuitFreaks.Direction.Right);
                    break;
                case CircuitFreaks.TileType.Curve_NW:
                    dirs.push(CircuitFreaks.Direction.Up);
                    dirs.push(CircuitFreaks.Direction.Left);
                    break;
                case CircuitFreaks.TileType.Curve_SE:
                    dirs.push(CircuitFreaks.Direction.Down);
                    dirs.push(CircuitFreaks.Direction.Right);
                    break;
                case CircuitFreaks.TileType.Curve_SW:
                    dirs.push(CircuitFreaks.Direction.Down);
                    dirs.push(CircuitFreaks.Direction.Left);
                    break;
                case CircuitFreaks.TileType.Straight_H:
                    dirs.push(CircuitFreaks.Direction.Left);
                    dirs.push(CircuitFreaks.Direction.Right);
                    break;
                case CircuitFreaks.TileType.Straight_V:
                    dirs.push(CircuitFreaks.Direction.Up);
                    dirs.push(CircuitFreaks.Direction.Down);
                    break;
                case CircuitFreaks.TileType.Double_NE:
                    dirs.push(CircuitFreaks.Direction.Up);
                    dirs.push(CircuitFreaks.Direction.Right);
                    dirs.push(CircuitFreaks.Direction.Down);
                    dirs.push(CircuitFreaks.Direction.Left);
                    break;
                case CircuitFreaks.TileType.Double_NW:
                    dirs.push(CircuitFreaks.Direction.Up);
                    dirs.push(CircuitFreaks.Direction.Left);
                    dirs.push(CircuitFreaks.Direction.Down);
                    dirs.push(CircuitFreaks.Direction.Right);
                    break;
            }
        };
        Tile.prototype.HSVtoRGB = function (h, s, v) {
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
        return Tile;
    }(PIXI.Container));
    CircuitFreaks.Tile = Tile;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var CircuitDetector = /** @class */ (function () {
        function CircuitDetector(slots, rows, columns) {
            this.slots = slots;
            this.rows = rows;
            this.columns = columns;
        }
        CircuitDetector.prototype.performFunctionOnTiles = function (f) {
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    if (this.slots[i][j] != null) {
                        f(this, i, j, this.slots[i][j]);
                    }
                }
            }
        };
        CircuitDetector.prototype.performFunctionOnBorderTiles = function (f) {
            var dirs = [CircuitFreaks.Direction.Right, CircuitFreaks.Direction.Down, CircuitFreaks.Direction.Left, CircuitFreaks.Direction.Up];
            for (var sideIdx = 0; sideIdx < 4; ++sideIdx) {
                var dir = dirs[sideIdx];
                var row = sideIdx < 2 ? -1 : this.rows;
                var col = sideIdx < 2 ? -1 : this.columns;
                var travRow = sideIdx % 2 == 0;
                var its = travRow ? this.rows : this.columns;
                for (var i = 0; i < its; ++i) {
                    if (travRow)
                        row = i;
                    else
                        col = i;
                    var n = new PIXI.Point(row, col);
                    this.stepCoord(n, dir);
                    var tile = this.slots[n.x][n.y];
                    if (tile != null) {
                        if (this.connects(n.x, n.y, dir) && this.isPathType(tile.type))
                            f(this, n.x, n.y, tile, dir);
                    }
                }
            }
        };
        CircuitDetector.prototype.stepCoord = function (coord, dir) {
            //NOTE: x is row, y is column!
            switch (dir) {
                case CircuitFreaks.Direction.Up:
                    --coord.x;
                    break;
                case CircuitFreaks.Direction.Down:
                    ++coord.x;
                    break;
                case CircuitFreaks.Direction.Left:
                    --coord.y;
                    break;
                case CircuitFreaks.Direction.Right:
                    ++coord.y;
                    break;
            }
        };
        CircuitDetector.prototype.connects = function (row, column, dir) {
            var tile = this.getTile(row, column);
            if (tile == null)
                return false;
            return tile.connects(dir);
        };
        CircuitDetector.prototype.getTile = function (row, column) {
            if (row < 0 || row >= this.rows || column < 0 || column >= this.columns)
                return null;
            return this.slots[row][column];
        };
        CircuitDetector.prototype.isSourceType = function (type) {
            switch (type) {
                case CircuitFreaks.TileType.Source:
                case CircuitFreaks.TileType.DoubleSource:
                case CircuitFreaks.TileType.TripleSource:
                case CircuitFreaks.TileType.Trash:
                    return true;
                default:
                    return false;
            }
        };
        CircuitDetector.prototype.isPathType = function (type) {
            switch (type) {
                case CircuitFreaks.TileType.Curve_NE:
                case CircuitFreaks.TileType.Curve_NW:
                case CircuitFreaks.TileType.Curve_SE:
                case CircuitFreaks.TileType.Curve_SW:
                case CircuitFreaks.TileType.Straight_H:
                case CircuitFreaks.TileType.Straight_V:
                case CircuitFreaks.TileType.Double_NE:
                case CircuitFreaks.TileType.Double_NW:
                    return true;
                default:
                    return false;
            }
        };
        CircuitDetector.prototype.sourcesConnect = function (t1, t2) {
            if (t1.groupIndex != t2.groupIndex)
                return false;
            switch (t1.type) {
                case CircuitFreaks.TileType.Source:
                case CircuitFreaks.TileType.DoubleSource:
                case CircuitFreaks.TileType.TripleSource:
                    return t2.type == CircuitFreaks.TileType.Source || t2.type == CircuitFreaks.TileType.DoubleSource || t2.type == CircuitFreaks.TileType.TripleSource;
                case CircuitFreaks.TileType.Blockade:
                case CircuitFreaks.TileType.Trash:
                    return t1.type == t2.type;
            }
            return false;
        };
        CircuitDetector.prototype.connectsToType = function (row, col, dir, root) {
            var tile = this.getTile(row, col);
            if (tile == null)
                return null;
            if (this.isSourceType(tile.type)) {
                if (this.sourcesConnect(root, tile)) {
                    tile.setStateFromDirection(dir, CircuitFreaks.CircuitState.Circuit);
                    return tile;
                }
                else
                    return null;
            }
            //other type of tile...
            var nextDir = tile.getNextDirection(dir);
            var coord = new PIXI.Point(row, col);
            this.stepCoord(coord, nextDir);
            if (this.connects(coord.x, coord.y, nextDir)) {
                var goalTile = this.connectsToType(coord.x, coord.y, nextDir, root);
                if (goalTile != null) {
                    tile.setStateFromDirection(dir, CircuitFreaks.CircuitState.Circuit);
                    return goalTile;
                }
            }
            return null;
        };
        CircuitDetector.prototype.loopsToTile = function (row, col, dir, root, rootDir) {
            var tile = this.getTile(row, col);
            if (tile == null)
                return false;
            var nextDir = tile.getNextDirection(dir);
            if (tile == root && nextDir == rootDir) {
                //full circle!
                tile.setStateFromDirection(dir, CircuitFreaks.CircuitState.Circuit);
                return true;
            }
            var coord = new PIXI.Point(row, col);
            this.stepCoord(coord, nextDir);
            if (this.connects(coord.x, coord.y, nextDir)) {
                if (this.loopsToTile(coord.x, coord.y, nextDir, root, rootDir)) {
                    tile.setStateFromDirection(dir, CircuitFreaks.CircuitState.Circuit);
                    return true;
                }
            }
            return false;
        };
        CircuitDetector.prototype.hasElement = function (tiles, tile) {
            for (var i = 0; i < tiles.length; ++i) {
                if (tiles[i] == tile)
                    return true;
            }
            return false;
        };
        CircuitDetector.prototype.clearTrashAdjacentToCircuits = function (discardTiles) {
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    var tile = this.getTile(i, j);
                    if (tile == null)
                        continue;
                    if (tile.type != CircuitFreaks.TileType.Trash || tile.hasCircuit())
                        continue;
                    var adjacentToCircuit = false;
                    var di = 0;
                    var dj = 1;
                    for (var nIdx = 0; nIdx < 4 && !adjacentToCircuit; ++nIdx) {
                        var neighbor = this.getTile(i + di, j + dj);
                        if (neighbor != null) {
                            if (neighbor.hasCircuit() && neighbor.type != CircuitFreaks.TileType.Trash)
                                adjacentToCircuit = true;
                        }
                        var cpy = di;
                        di = -dj;
                        dj = cpy;
                    }
                    if (adjacentToCircuit) {
                        discardTiles.push(tile);
                        tile.setState(CircuitFreaks.TileState.Disappearing);
                        this.slots[i][j] = null;
                    }
                }
            }
        };
        CircuitDetector.prototype.coordOutOfBounds = function (i, j) {
            if (i < 0 || i >= this.rows)
                return true;
            else if (j < 0 || j >= this.columns)
                return true;
            return false;
        };
        CircuitDetector.prototype.propagateCircuits = function () {
            var clearPropState = function (caller, i, j, tile) { tile.clearCircuitState(); };
            this.performFunctionOnTiles(clearPropState);
            var pushBorderTiles = function (caller, i, j, tile, dir) {
                var isCircuit = false;
                if (tile.type == CircuitFreaks.TileType.Trash) {
                    isCircuit = true;
                }
                else if (caller.isPathType(tile.type)) {
                    //continue propagation:
                    var nextDir = tile.getNextDirection(dir);
                    var coord = new PIXI.Point(i, j);
                    caller.stepCoord(coord, nextDir);
                    if (caller.coordOutOfBounds(coord.x, coord.y)) {
                        isCircuit = true;
                    }
                    else {
                        var nextTile = caller.getTile(coord.x, coord.y);
                        if (nextTile != null) {
                            if (nextTile.connects(nextDir)) {
                                isCircuit = pushBorderTiles(caller, coord.x, coord.y, nextTile, nextDir);
                            }
                        }
                    }
                }
                if (isCircuit)
                    tile.setStateFromDirection(dir, CircuitFreaks.CircuitState.Circuit);
                return isCircuit;
            };
            this.performFunctionOnBorderTiles(pushBorderTiles);
            var pushSource = function (caller, i, j, tile) {
                if (caller.isSourceType(tile.type)) {
                    var goalTiles = [];
                    for (var dirIdx = 0; dirIdx < 4; ++dirIdx) {
                        var coord = new PIXI.Point(i, j);
                        caller.stepCoord(coord, dirIdx);
                        if (caller.connects(coord.x, coord.y, dirIdx)) {
                            //make sure the adjacent tile-type is not already the source type:
                            if (caller.sourcesConnect(caller.slots[coord.x][coord.y], tile))
                                continue;
                            var goalTile = caller.connectsToType(coord.x, coord.y, dirIdx, tile);
                            var hasTile = caller.hasElement(goalTiles, goalTile);
                            if (goalTile != null && !hasTile)
                                goalTiles.push(goalTile);
                        }
                    }
                    tile.sourceHitCount = goalTiles.length;
                    if (goalTiles.length > 0)
                        tile.setStateFromDirection(CircuitFreaks.Direction.Up, CircuitFreaks.CircuitState.Circuit);
                }
            };
            this.performFunctionOnTiles(pushSource);
            //also look for loops:
            var gatherLoops = function (caller, i, j, tile) {
                if (caller.isPathType(tile.type)) {
                    var dirs = [];
                    tile.getOutwardDirectionsWithState(dirs, CircuitFreaks.CircuitState.None);
                    for (var dirIdx = 0; dirIdx < dirs.length - 1; dirIdx += 2) {
                        var dir = dirs[dirIdx];
                        var coord = new PIXI.Point(i, j);
                        caller.stepCoord(coord, dir);
                        if (caller.connects(coord.x, coord.y, dir)) {
                            caller.loopsToTile(coord.x, coord.y, dir, tile, dir);
                        }
                    }
                }
            };
            this.performFunctionOnTiles(gatherLoops);
        };
        CircuitDetector.prototype.breaksCircuit = function (row, column, dir) {
            if (row < 0 || row >= this.rows || column < 0 || column >= this.columns)
                return true;
            var tile = this.slots[row][column];
            if (tile == null)
                return false;
            //any source type breaks the circuit, when we are looking for deadlocks:
            if (this.isSourceType(tile.type))
                return true;
            return !tile.connects(dir);
        };
        CircuitDetector.prototype.connectsToDeadlock = function (row, col, dir) {
            if (this.breaksCircuit(row, col, dir))
                return true;
            var tile = this.getTile(row, col);
            if (tile == null)
                return false;
            //other type of tile...
            var nextDir = tile.getNextDirection(dir);
            var coord = new PIXI.Point(row, col);
            this.stepCoord(coord, nextDir);
            if (this.connectsToDeadlock(coord.x, coord.y, nextDir)) {
                tile.setStateFromDirection(dir, CircuitFreaks.CircuitState.DeadLock);
                return true;
            }
            return false;
        };
        CircuitDetector.prototype.traverseDegrade = function (row, col, dir) {
            var tile = this.getTile(row, col);
            if (tile == null)
                return;
            if (this.breaksCircuit(row, col, dir) || !tile.directionIntoState(dir, CircuitFreaks.CircuitState.DeadLock))
                return;
            var nextDir = tile.getNextDirection(dir);
            var coord = new PIXI.Point(row, col);
            this.stepCoord(coord, nextDir);
            this.traverseDegrade(coord.x, coord.y, nextDir);
            tile.partialDegrade(dir);
        };
        CircuitDetector.prototype.degradeDeadlock = function (row, col) {
            var tile = this.getTile(row, col);
            if (tile == null)
                return;
            if (!tile.hasDeadlock())
                return;
            var dirs = [];
            tile.getOutwardDirectionsWithState(dirs, CircuitFreaks.CircuitState.DeadLock);
            for (var i = 0; i < dirs.length; ++i) {
                var coord = new PIXI.Point(row, col);
                var dir = dirs[i];
                this.stepCoord(coord, dir);
                this.traverseDegrade(coord.x, coord.y, dir);
            }
            tile.degrade();
        };
        CircuitDetector.prototype.getOppositeDir = function (dir) {
            switch (dir) {
                case CircuitFreaks.Direction.Down:
                    return CircuitFreaks.Direction.Up;
                case CircuitFreaks.Direction.Up:
                    return CircuitFreaks.Direction.Down;
                case CircuitFreaks.Direction.Left:
                    return CircuitFreaks.Direction.Right;
                case CircuitFreaks.Direction.Right:
                    return CircuitFreaks.Direction.Left;
            }
        };
        CircuitDetector.prototype.findDeadlocks = function () {
            var clearPropState = function (caller, i, j, tile) { tile.clearCircuitState(); };
            this.performFunctionOnTiles(clearPropState);
            var assignDeadlocks = function (caller, i, j, tile) {
                if (caller.isPathType(tile.type)) {
                    var dirs = [];
                    tile.getOutwardDirections(dirs);
                    for (var dIdx = 0; dIdx < dirs.length - 1; dIdx += 2) {
                        var dir = dirs[dIdx];
                        var seekDir = dirs[dIdx + 1];
                        var coord = new PIXI.Point(i, j);
                        caller.stepCoord(coord, dir);
                        if (!caller.breaksCircuit(coord.x, coord.y, dir)) {
                            //try other direction:
                            coord = new PIXI.Point(i, j);
                            caller.stepCoord(coord, seekDir);
                            if (!caller.breaksCircuit(coord.x, coord.y, seekDir)) {
                                //this is not the end-point of a deadlock, so skip this one:
                                continue;
                            }
                            //swap seek direction:
                            var tmp = seekDir;
                            seekDir = dir;
                            dir = tmp;
                        }
                        coord = new PIXI.Point(i, j);
                        caller.stepCoord(coord, seekDir);
                        if (caller.connectsToDeadlock(coord.x, coord.y, seekDir))
                            tile.setStateFromDirection(caller.getOppositeDir(dir), CircuitFreaks.CircuitState.DeadLock);
                    }
                }
            };
            this.performFunctionOnTiles(assignDeadlocks);
            var showDeadlocks = function (caller, i, j, tile) {
                tile.redraw();
            };
            this.performFunctionOnTiles(showDeadlocks);
        };
        return CircuitDetector;
    }());
    CircuitFreaks.CircuitDetector = CircuitDetector;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>
///<reference path="CircuitDetector.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var BoardState;
    (function (BoardState) {
        BoardState[BoardState["Idle"] = 0] = "Idle";
        BoardState[BoardState["RemoveCircuits"] = 1] = "RemoveCircuits";
        BoardState[BoardState["Drop"] = 2] = "Drop";
        BoardState[BoardState["Place"] = 3] = "Place";
        BoardState[BoardState["DegradeDeadlock"] = 4] = "DegradeDeadlock";
        BoardState[BoardState["ProcessCircuits"] = 5] = "ProcessCircuits";
    })(BoardState = CircuitFreaks.BoardState || (CircuitFreaks.BoardState = {}));
    var Board = /** @class */ (function (_super) {
        __extends(Board, _super);
        function Board(w, h) {
            var _this = _super.call(this) || this;
            _this.boardWidth = w;
            _this.boardHeight = h;
            _this.rows = 8;
            _this.columns = 6;
            _this.tileWidth = Math.min(w / _this.columns, h / _this.rows); // 60;
            _this.discardTiles = [];
            _this.state = BoardState.Idle;
            _this.stateParameter = 0;
            _this.tileWasPushedTMP = false;
            //create empty grid:
            _this.slots = [];
            _this.snapshot = [];
            for (var i = 0; i < _this.rows; ++i) {
                _this.slots[i] = [];
                _this.snapshot[i] = [];
                for (var j = 0; j < _this.columns; ++j) {
                    _this.slots[i][j] = null;
                    _this.snapshot[i][j] = null;
                }
            }
            _this.circuitDetector = new CircuitFreaks.CircuitDetector(_this.slots, _this.rows, _this.columns);
            var center = new PIXI.Point(w / 2.0, h / 2.0);
            var size = new PIXI.Point(_this.columns * _this.tileWidth, _this.rows * _this.tileWidth);
            var grid = new PIXI.Graphics();
            grid.beginFill(0x0, 0.3);
            grid.lineStyle(_this.tileWidth * .05, 0xffffff, 1);
            grid.drawRoundedRect(center.x - size.x / 2.0, center.y - size.y / 2.0, size.x, size.y, .1 * _this.tileWidth);
            grid.endFill();
            for (var i = 1; i < _this.rows; ++i) {
                var y = center.y + (i / _this.rows - .5) * size.y;
                grid.moveTo(center.x - size.x / 2.0, y);
                grid.lineTo(center.x + size.x / 2.0, y);
            }
            for (var i = 1; i < _this.columns; ++i) {
                var x = center.x + (i / _this.columns - .5) * size.x;
                grid.moveTo(x, center.y - size.y / 2.0);
                grid.lineTo(x, center.y + size.y / 2.0);
            }
            _this.addChild(grid);
            _this.resetBoard();
            _this.createSnapshot(false);
            return _this;
        }
        Board.prototype.createSnapshot = function (tilePushed) {
            this.tileWasPushedTMP = tilePushed;
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    var tile = this.slots[i][j];
                    this.snapshot[i][j] = (tile == null) ? null : new CircuitFreaks.TileDescriptor(tile.type, tile.groupIndex);
                }
            }
        };
        Board.prototype.revertToSnapshot = function () {
            this.clearBoard();
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    if (this.snapshot[i][j] != null) {
                        var desc = this.snapshot[i][j];
                        var tile = new CircuitFreaks.Tile(this.tileWidth, desc.type);
                        var res = this.toScreenPos(i, j);
                        tile.position.x = res.x;
                        tile.position.y = res.y;
                        this.slots[i][j] = tile;
                        this.addChild(tile);
                        tile.groupIndex = desc.groupIndex;
                        tile.redraw();
                    }
                }
            }
            this.tileWasPushedTMP = false;
            this.setState(BoardState.ProcessCircuits);
        };
        Board.prototype.clearBoard = function () {
            while (this.discardTiles.length > 0) {
                this.removeChild(this.discardTiles[0]);
                this.discardTiles.splice(0, 1);
            }
            //clear old tiles:
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    var tile = this.slots[i][j];
                    if (tile != null)
                        this.removeChild(tile);
                    this.slots[i][j] = null;
                }
            }
        };
        Board.prototype.resetBoard = function () {
            this.clearBoard();
            var centerRow = Math.floor(this.rows / 2);
            var centerColumn = Math.floor(this.columns / 2);
            //fill top few rows:
            for (var i = 0; i < 3; ++i) {
                for (var j = 0; j < 6; ++j) {
                    var type = CircuitFreaks.TileType.Trash;
                    var group = 0;
                    if (i == 0) {
                        if (j == 1) {
                            type = CircuitFreaks.TileType.Source;
                            group = 1;
                        }
                        else if (j == 4) {
                            type = CircuitFreaks.TileType.DoubleSource;
                            group = 1;
                        }
                    }
                    else if (i == 1) {
                        if (j == 2) {
                            type = CircuitFreaks.TileType.TripleSource;
                            group = 0;
                        }
                        else if (j == 3) {
                            type = CircuitFreaks.TileType.Source;
                            group = 0;
                        }
                    }
                    else if (i == 2) {
                        if (j == 0) {
                            type = CircuitFreaks.TileType.Source;
                            group = 0;
                        }
                        else if (j == 5) {
                            type = CircuitFreaks.TileType.DoubleSource;
                            group = 0;
                        }
                    }
                    var row = i; //centerRow + i - 1;
                    var column = j; //centerColumn + j - 2;
                    // var type = Math.floor(Math.random() * TileType.Count);
                    var tile = new CircuitFreaks.Tile(this.tileWidth, type);
                    var res = this.toScreenPos(row, column);
                    tile.position.x = res.x;
                    tile.position.y = res.y;
                    this.slots[row][column] = tile;
                    this.addChild(tile);
                    tile.groupIndex = group;
                    tile.redraw();
                }
            }
            this.setState(BoardState.Idle);
        };
        Board.prototype.undo = function () {
            this.revertToSnapshot();
        };
        Board.prototype.setState = function (state) {
            this.state = state;
            this.stateParameter = 0;
            switch (this.state) {
                case BoardState.Idle:
                    this.circuitDetector.findDeadlocks();
                    break;
                case BoardState.Place:
                    break;
                case BoardState.RemoveCircuits:
                    this.clearCircuitTiles();
                    break;
                case BoardState.Drop:
                    this.dropTiles();
                    break;
                case BoardState.DegradeDeadlock:
                    ///...
                    break;
                case BoardState.ProcessCircuits:
                    while (this.discardTiles.length > 0) {
                        this.removeChild(this.discardTiles[0]);
                        this.discardTiles.splice(0, 1);
                    }
                    //switch to some other state:
                    if (this.hasDropTiles()) {
                        //drop tiles...
                        this.setState(BoardState.Drop);
                    }
                    else {
                        this.circuitDetector.propagateCircuits();
                        if (this.hasCircuit())
                            this.setState(BoardState.RemoveCircuits);
                        else
                            this.setState(BoardState.Idle);
                    }
                    break;
            }
        };
        Board.prototype.updateCurrentState = function (dt, duration, nextState) {
            this.stateParameter += dt / duration;
            if (this.stateParameter > 1.0) {
                this.setState(nextState);
            }
        };
        Board.prototype.updateState = function (dt) {
            switch (this.state) {
                case BoardState.Idle:
                    break;
                case BoardState.Place:
                    this.updateCurrentState(dt, 0.5, BoardState.ProcessCircuits);
                    break;
                case BoardState.DegradeDeadlock:
                    this.updateCurrentState(dt, 0.5, BoardState.ProcessCircuits);
                    break;
                case BoardState.RemoveCircuits:
                    this.updateCurrentState(dt, 0.5, BoardState.ProcessCircuits);
                    break;
                case BoardState.Drop:
                    this.updateCurrentState(dt, 0.66, BoardState.ProcessCircuits);
                    break;
                case BoardState.ProcessCircuits:
                    //not a continuous state: changes to other state when set to 'ProcessCircuits'
                    break;
            }
        };
        Board.prototype.update = function (dt) {
            this.updateState(dt);
            for (var i = 0; i < this.discardTiles.length; ++i)
                this.discardTiles[i].update(dt);
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    var tile = this.slots[i][j];
                    if (tile != null)
                        tile.update(dt);
                }
            }
        };
        Board.prototype.clearCircuitTiles = function () {
            this.circuitDetector.clearTrashAdjacentToCircuits(this.discardTiles);
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    var tile = this.slots[i][j];
                    if (tile == null)
                        continue;
                    if (tile.hasCircuit()) {
                        if (tile.circuitEliminatesTile()) {
                            this.discardTiles.push(tile);
                            tile.setState(CircuitFreaks.TileState.Disappearing);
                            this.slots[i][j] = null;
                        }
                        else {
                            tile.filterCircuitFromTile();
                        }
                    }
                }
            }
        };
        Board.prototype.dropTiles = function () {
            for (var j = 0; j < this.columns; ++j) {
                var numDrops = 0;
                for (var i = 0; i < this.rows; ++i) {
                    var tile = this.slots[i][j];
                    if (tile == null) {
                        numDrops++;
                    }
                    else if (numDrops > 0) {
                        var goalRow = i - numDrops;
                        this.slots[goalRow][j] = tile;
                        this.slots[i][j] = null;
                        tile.position = this.toScreenPos(goalRow, j);
                        tile.drop(numDrops * this.tileWidth);
                    }
                }
            }
        };
        Board.prototype.toScreenPos = function (row, col) {
            var res = new PIXI.Point();
            res.x = this.boardWidth / 2.0 + (col - (this.columns - 1) * .5) * this.tileWidth;
            res.y = this.boardHeight / 2.0 + (row - (this.rows - 1) * .5) * this.tileWidth;
            return res;
        };
        Board.prototype.countExisting = function (slots) {
            var res = 0;
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    if (slots[i][j] != null)
                        ++res;
                }
            }
            return res;
        };
        Board.prototype.hasDropTiles = function () {
            for (var j = 0; j < this.columns; ++j) {
                var encounteredEmpty = false;
                for (var i = 0; i < this.rows; ++i) {
                    if (this.slots[i][j] == null)
                        encounteredEmpty = true;
                    else if (encounteredEmpty)
                        return true;
                }
            }
            return false;
        };
        Board.prototype.hasCircuit = function () {
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    var tile = this.slots[i][j];
                    if (tile != null) {
                        if (tile.hasCircuit())
                            return true;
                    }
                }
            }
            return false;
        };
        Board.prototype.pushTile = function (pos, set) {
            if (this.state != BoardState.Idle)
                return false;
            var stepRows = 1, stepCols = 1;
            if (set.isHorizontal)
                stepCols = set.tiles.length;
            else
                stepRows = set.tiles.length;
            var offset = -(set.tiles.length - 1) * .5 * this.tileWidth;
            var slotsAvailable = true;
            var column = Math.floor((pos.x - this.boardWidth / 2.0 + (set.isHorizontal ? offset : 0)) / this.tileWidth + this.columns / 2.0);
            if (column < 0 || column > this.columns - stepCols)
                slotsAvailable = false;
            var row = Math.floor((pos.y - this.boardHeight / 2.0 + (set.isHorizontal ? 0 : offset)) / this.tileWidth + this.rows / 2.0);
            if (row < 0 || row > this.rows - stepRows)
                slotsAvailable = false;
            //make sure slots are empty:
            for (var i = 0; i < set.tiles.length && slotsAvailable; ++i) {
                var calcRow = row + (set.isHorizontal ? 0 : i);
                var calcCol = column + (set.isHorizontal ? i : 0);
                if (this.slots[calcRow][calcCol] != null)
                    slotsAvailable = false;
            }
            if (slotsAvailable) {
                this.createSnapshot(true);
                for (var i = 0; i < set.tiles.length; ++i) {
                    var calcRow = row + (set.isHorizontal ? 0 : i);
                    var calcCol = column + (set.isHorizontal ? i : 0);
                    var tile = new CircuitFreaks.Tile(this.tileWidth, set.tiles[i].type);
                    tile.position = this.toScreenPos(calcRow, calcCol);
                    tile.setState(CircuitFreaks.TileState.Appearing);
                    this.slots[calcRow][calcCol] = tile;
                    this.addChild(tile);
                }
                // var tile = new Tile(this.tileWidth, type);
                // tile.position = this.toScreenPos(row, column);
                // this.slots[row][column] = tile;
                // this.addChild(tile);
                this.setState(BoardState.Place);
                return true;
            }
            else {
                column = Math.floor((pos.x - this.boardWidth / 2.0) / this.tileWidth + this.columns / 2.0);
                if (column < 0 || column >= this.columns)
                    return false;
                row = Math.floor((pos.y - this.boardHeight / 2.0) / this.tileWidth + this.rows / 2.0);
                if (row < 0 || row >= this.rows)
                    return false;
                if (this.slots[row][column] != null) {
                    this.createSnapshot(false);
                    this.circuitDetector.degradeDeadlock(row, column);
                    this.setState(BoardState.DegradeDeadlock);
                }
            }
            return false;
        };
        return Board;
    }(PIXI.Container));
    CircuitFreaks.Board = Board;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var TileSet = /** @class */ (function (_super) {
        __extends(TileSet, _super);
        function TileSet(tileWidth, types) {
            var _this = _super.call(this) || this;
            _this.types = types;
            _this.tileWidth = tileWidth;
            _this.tiles = [];
            _this.rotateAnimParam = 1;
            _this.isHorizontal = true;
            _this.setTypes(types);
            return _this;
        }
        TileSet.prototype.update = function (dt) {
            this.rotateAnimParam = Math.min(this.rotateAnimParam + dt / 0.2, 1.0);
            // this.rotation = (1 - easeOutElastic(this.rotateAnimParam)) * -0.5 * Math.PI;
            this.rotation = -.5 * Math.PI * (1 - Math.sin(this.rotateAnimParam * .5 * Math.PI));
            for (var i = 0; i < this.tiles.length; ++i) {
                this.tiles[i].update(dt);
            }
        };
        TileSet.prototype.rotateSet = function () {
            this.rotateAnimParam = 0;
            var currTypes = [];
            for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
                var tile = _a[_i];
                currTypes.push(tile.type);
            }
            for (var i = 0; i < currTypes.length; ++i)
                currTypes[i] = CircuitFreaks.rotateTypeCW(currTypes[i]);
            this.isHorizontal = !this.isHorizontal;
            if (this.isHorizontal)
                currTypes.reverse();
            this.setTypes(currTypes);
            // this.rotation = (this.rotation + .5 * Math.PI) % (2 * Math.PI);
            // if(this.tiles.length > 0)
            //     return this.tiles[0].mirrorTile();
        };
        TileSet.prototype.getTmpType = function () {
            if (this.tiles.length > 0)
                return this.tiles[0].type;
            return CircuitFreaks.TileType.Trash;
        };
        TileSet.prototype.setTypes = function (types) {
            while (this.tiles.length > 0) {
                this.removeChild(this.tiles[0]);
                this.tiles.splice(0, 1);
            }
            for (var i = 0; i < types.length; ++i) {
                var tile = new CircuitFreaks.Tile(this.tileWidth, types[i]);
                this.addChild(tile);
                this.tiles.push(tile);
                var offset = (i - (types.length - 1) * 0.5) * this.tileWidth;
                if (this.isHorizontal)
                    tile.x = offset;
                else
                    tile.y = offset;
            }
        };
        return TileSet;
    }(PIXI.Container));
    CircuitFreaks.TileSet = TileSet;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>
///<reference path="TileSet.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var TilePanel = /** @class */ (function (_super) {
        __extends(TilePanel, _super);
        function TilePanel() {
            var _this = _super.call(this) || this;
            _this.tileCount = 1;
            _this.tileWidth = 50;
            _this.selectorWidth = 2.1 * _this.tileWidth;
            _this.selector = new PIXI.Graphics();
            _this.selector.lineStyle(5, 0xffffff, 1);
            _this.selector.drawRoundedRect(-_this.selectorWidth / 2.0, -_this.selectorWidth / 2.0, _this.selectorWidth, _this.selectorWidth, .2 * _this.selectorWidth);
            _this.addChild(_this.selector);
            _this.nextTypes = [];
            _this.nextSets = [];
            _this.resetPanel();
            _this.setSelectedIndex(Math.min(_this.tileCount - 1, 0));
            _this.prevSet = null;
            return _this;
        }
        TilePanel.prototype.undo = function () {
            if (this.prevSet == null)
                return;
            var curr = this.nextSets[this.selectedIndex];
            if (curr != null) {
                this.nextTypes.splice(0, 0, curr.types);
                this.removeChild(curr);
            }
            this.nextSets[this.selectedIndex] = this.prevSet;
            this.addChild(this.prevSet);
            this.prevSet = null;
        };
        TilePanel.prototype.update = function (dt) {
            for (var i = 0; i < this.nextSets.length; ++i)
                this.nextSets[i].update(dt);
        };
        TilePanel.prototype.resetPanel = function () {
            this.nextTypes = [];
            for (var i = 0; i < this.tileCount; ++i)
                this.changeTile(i);
            this.prevSet = null;
        };
        TilePanel.prototype.changeTile = function (index) {
            if (this.nextSets[index] != null) {
                this.prevSet = this.nextSets[index];
                this.removeChild(this.prevSet);
            }
            var tileSet = new CircuitFreaks.TileSet(this.tileWidth, this.getNextType());
            this.nextSets[index] = tileSet;
            this.addChild(tileSet);
            tileSet.position.x = (index - (this.tileCount - 1) / 2.0) * this.selectorWidth;
            tileSet.position.y = 0;
        };
        TilePanel.prototype.shuffle = function (array) {
            var currentIndex = array.length;
            var temporaryValue = 0;
            var randomIndex = 0;
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.min(Math.floor(Math.random() * currentIndex), currentIndex - 1);
                currentIndex -= 1;
                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        };
        TilePanel.prototype.changeCurrentTile = function () {
            this.changeTile(this.selectedIndex);
        };
        TilePanel.prototype.getCurrentTileSet = function () {
            return this.nextSets[this.selectedIndex];
        };
        TilePanel.prototype.getNextType = function () {
            if (this.nextTypes.length == 0) {
                var topTypes = [CircuitFreaks.TileType.Curve_NE, CircuitFreaks.TileType.Curve_NW, CircuitFreaks.TileType.Curve_SE, CircuitFreaks.TileType.Curve_SW,
                    CircuitFreaks.TileType.Double_NW, CircuitFreaks.TileType.Double_NE,
                    CircuitFreaks.TileType.Straight_H, CircuitFreaks.TileType.Straight_V];
                var btmTypes = topTypes.slice();
                this.shuffle(btmTypes);
                for (var i in btmTypes)
                    this.nextTypes.push([topTypes[i], btmTypes[i]]);
                // this.nextTypes.push([TileType.Double_NE]);
                this.nextTypes.push([CircuitFreaks.TileType.Trash]);
                this.shuffle(this.nextTypes);
                //create new 
                // this.nextTypes = [ [TileType.Curve_NE], [TileType.Curve_NW], [TileType.Curve_SE], [TileType.Curve_SW], [TileType.Double_NE], [TileType.Double_NW]];
                // for(var i:number=0; i<TileType.Source; ++i) {
                //     this.nextTypes.push([i]);
                // }
                // this.shuffle(this.nextTypes);
            }
            var res = this.nextTypes[0];
            this.nextTypes.splice(0, 1);
            return res;
        };
        TilePanel.prototype.setSelectedIndex = function (index) {
            this.selectedIndex = index;
            this.selector.position.x = this.nextSets[index].x;
            this.selector.position.y = this.nextSets[index].y;
        };
        TilePanel.prototype.select = function (pos) {
            var index = Math.floor(pos.x / this.selectorWidth + this.tileCount / 2.0);
            if (index < 0 || index >= this.tileCount || Math.abs(pos.y) > this.selectorWidth / 2.0)
                return false;
            if (this.selectedIndex == index)
                this.nextSets[index].rotateSet();
            else
                this.setSelectedIndex(index);
            return true;
        };
        return TilePanel;
    }(PIXI.Container));
    CircuitFreaks.TilePanel = TilePanel;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button(text, func) {
            var _this = _super.call(this) || this;
            _this.func = func;
            var base_width = 50;
            var radius = 20.0;
            var hw = base_width / 2.0;
            _this.graphics = new PIXI.Graphics();
            _this.graphics.beginFill(0x22ff22);
            _this.graphics.lineStyle(.2 * radius, 0xffffff, 1);
            _this.graphics.moveTo(-hw, -radius);
            _this.graphics.lineTo(hw, -radius);
            _this.graphics.arc(hw, 0, radius, -.5 * Math.PI, .5 * Math.PI);
            _this.graphics.lineTo(-hw, radius);
            _this.graphics.arc(-hw, 0, radius, .5 * Math.PI, 1.5 * Math.PI);
            _this.graphics.endFill();
            _this.graphics.beginFill(0xffffff, 0.5);
            _this.graphics.lineStyle(0);
            _this.graphics.drawCircle(.5 * base_width, -.25 * radius, .5 * radius);
            _this.graphics.endFill();
            _this.addChild(_this.graphics);
            _this.text = new PIXI.Text(text);
            _this.text.style.fontFamily = "groboldregular";
            _this.text.style.fontSize = 40;
            _this.text.style.stroke = 0xffffff;
            _this.text.style.fill = 0xffffff;
            _this.text.anchor.set(0.5, 0.5);
            _this.text.style.dropShadow = true;
            _this.text.style.dropShadowAlpha = .5;
            _this.text.x = 0;
            _this.text.y = 0;
            _this.addChild(_this.text);
            // this.text.text = ": ssdsds";
            console.log(_this.text.text, _this.text.parent);
            return _this;
        }
        return Button;
    }(PIXI.Container));
    CircuitFreaks.Button = Button;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var LevelSelector = /** @class */ (function (_super) {
        __extends(LevelSelector, _super);
        function LevelSelector(w, h) {
            var _this = _super.call(this) || this;
            _this.background = new PIXI.Graphics();
            _this.background.beginFill(0x00ff00);
            _this.background.lineStyle(3, 0xffffff, 1);
            _this.background.drawRoundedRect(0, 0, w, h, .1 * w);
            _this.addChild(_this.background);
            _this.closeBtn = new PIXI.Graphics();
            _this.closeBtn.beginFill(0x00ff00);
            _this.closeBtn.lineStyle(3, 0xffffff, 1);
            _this.closeBtn.drawRoundedRect(-10, -10, 20, 20, 10);
            _this.closeBtn.x = w - 10;
            _this.closeBtn.y = 10;
            _this.addChild(_this.closeBtn);
            _this.visible = true;
            console.log("yessiree");
            return _this;
        }
        LevelSelector.prototype.touchDown = function (pt) {
        };
        LevelSelector.prototype.show = function () {
            this.visible = true;
        };
        LevelSelector.prototype.hide = function () {
            this.visible = false;
        };
        return LevelSelector;
    }(PIXI.Container));
    CircuitFreaks.LevelSelector = LevelSelector;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Board.ts"/>
///<reference path="Tile.ts"/>
///<reference path="TilePanel.ts"/>
///<reference path="Button.ts"/>
///<reference path="LevelSelector.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(w, h) {
            var _this = _super.call(this) || this;
            var background = new PIXI.Graphics();
            background.beginFill(0x00ff00, 0.5);
            background.drawRect(0, 0, w, h);
            background.endFill();
            _this.addChild(background);
            _this.tilePanel = new CircuitFreaks.TilePanel();
            _this.tilePanel.x = w / 2.0;
            _this.tilePanel.y = h * .9;
            _this.addChild(_this.tilePanel);
            _this.board = new CircuitFreaks.Board(w * 0.95, h * 0.7);
            _this.board.x = w * 0.025;
            _this.board.y = h * 0.1;
            _this.addChild(_this.board);
            _this.buttons = [];
            var txts = ['♚', '♞', '↺'];
            var callbacks = [_this.resetGame, _this.loadDefault, _this.undo];
            for (var i = 0; i < txts.length; ++i) {
                var btn = new CircuitFreaks.Button(txts[i], callbacks[i]);
                btn.x = w * (i + 1) / 4.0;
                btn.y = h * .05;
                _this.addChild(btn);
                _this.buttons.push(btn);
            }
            _this.levelSelector = new CircuitFreaks.LevelSelector(w * .8, h * .8);
            _this.levelSelector.x = .1 * w;
            _this.levelSelector.y = .1 * h;
            return _this;
            // this.addChild(this.levelSelector);
        }
        Game.prototype.resetGame = function () {
            this.board.clearBoard();
            this.tilePanel.resetPanel();
            this.board.createSnapshot(false);
        };
        Game.prototype.loadDefault = function () {
            this.board.resetBoard();
            this.tilePanel.resetPanel();
            this.board.createSnapshot(false);
        };
        Game.prototype.undo = function () {
            if (this.board.tileWasPushedTMP)
                this.tilePanel.undo();
            this.board.undo();
        };
        Game.prototype.update = function (dt) {
            this.board.update(dt);
            this.tilePanel.update(dt);
        };
        Game.prototype.touchDown = function (p) {
            for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
                var btn = _a[_i];
                var toBtn = new PIXI.Point(p.x - btn.position.x, p.y - btn.position.y);
                if (Math.abs(toBtn.x) < 50 && Math.abs(toBtn.y) < 20) {
                    btn.func.call(this);
                    return;
                }
            }
            var locPos = new PIXI.Point(p.x - this.tilePanel.position.x, p.y - this.tilePanel.position.y);
            if (this.tilePanel.select(locPos))
                return;
            //push random tile to board:
            locPos = new PIXI.Point(p.x - this.board.position.x, p.y - this.board.position.y);
            if (this.board.pushTile(locPos, this.tilePanel.getCurrentTileSet())) {
                this.tilePanel.changeCurrentTile();
            }
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
            this.resetGame();
        };
        Game.prototype.down = function () {
        };
        Game.prototype.rotate = function () {
            this.loadDefault();
        };
        return Game;
    }(PIXI.Container));
    CircuitFreaks.Game = Game;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="game/Game.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var touchElement = /** @class */ (function () {
        function touchElement() {
        }
        return touchElement;
    }());
    CircuitFreaks.touchElement = touchElement;
    var GameContainer = /** @class */ (function (_super) {
        __extends(GameContainer, _super);
        function GameContainer(w, h) {
            var _this = _super.call(this, w, h, { antialias: true, backgroundColor: 0x000000, transparent: false }) || this;
            _this.backgroundTexture = PIXI.Texture.fromImage('assets/background.png');
            _this.backgroundImage = new PIXI.Sprite(_this.backgroundTexture);
            _this.stage.addChild(_this.backgroundImage);
            _this.game = new CircuitFreaks.Game(w, h);
            _this.stage.addChild(_this.game);
            _this.componentMask = new PIXI.Graphics();
            _this.componentMask.beginFill(0xFFFFFF);
            _this.componentMask.drawRect(0, 0, w, h);
            _this.componentMask.endFill();
            _this.componentMask.isMask = true;
            _this.game.mask = _this.componentMask;
            _this.hasFocusTouch = false;
            _this.componentBoundary = new PIXI.Graphics();
            _this.stage.addChild(_this.componentBoundary);
            return _this;
        }
        GameContainer.prototype.setInnerAppSize = function (w, h) {
            this.componentBoundary.clear();
            // var thickness:number[] = [20, 15, 4];
            var thickness = [10, 8, 2];
            var offset = [3, 3, 1];
            var colors = [0xaaaaaa, 0xffffff, 0xbbbbbb];
            for (var i = 0; i < 2; ++i) {
                var t = offset[i];
                this.componentBoundary.lineStyle(thickness[i], colors[i]);
                this.componentBoundary.drawRoundedRect(-w / 2 - t, -h / 2 - t, w + 2 * t, h + 2 * t, 20 + t);
            }
            this.game.scale.x = w / 450; //800;
            this.game.scale.y = h / 800; //600;
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
            this.debugText = new PIXI.Text('');
            this.debugText.x = 20;
            this.debugText.y = 10;
            this.game.addChild(this.debugText);
            this.debugGraphics = new PIXI.Graphics();
            this.game.addChild(this.debugGraphics);
        };
        GameContainer.prototype.keyDown = function (key) {
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
        GameContainer.prototype.resize = function (w, h, appWidth, appHeight) {
            var bgScale = Math.max(w / 1920, h / 1080);
            this.backgroundImage.scale.x = bgScale;
            this.backgroundImage.scale.y = bgScale;
            var resWidth = bgScale * 1920;
            var resHeight = bgScale * 1080;
            this.backgroundImage.x = (w - resWidth) / 2;
            this.backgroundImage.y = (h - resHeight) / 2;
            this.game.x = (w - appWidth) / 2;
            this.game.y = (h - appHeight) / 2;
            this.componentBoundary.x = w / 2;
            this.componentBoundary.y = h / 2;
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
            this.debugText.text = "FPS: 30"; // + Math.round(1.0 / dt);
            this.game.update(dt);
        };
        return GameContainer;
    }(PIXI.Application));
    CircuitFreaks.GameContainer = GameContainer;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="GameContainer.ts"/>
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
var APP_WIDTH = 450; //800;
var APP_HEIGHT = 800; //600;
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
    var app = new CircuitFreaks.GameContainer(APP_WIDTH, APP_HEIGHT);
    app.view.style.position = "absolute";
    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);
    // PIXI.loader.add('oceanShader', 'assets/oceanShader.frag')
    //         .add('skyShader', 'assets/skyShader.frag')
    //         .add('ripples', 'assets/ripples.png');
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
    // window.onmousedown = (e) => {
    //     fitApp(app);
    // }
};
