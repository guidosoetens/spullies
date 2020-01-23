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
///<reference path="../../../pixi/pixi.js.d.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var TileType;
    (function (TileType) {
        TileType[TileType["Path"] = 0] = "Path";
        TileType[TileType["Source"] = 1] = "Source";
        TileType[TileType["DoubleSource"] = 2] = "DoubleSource";
        TileType[TileType["TripleSource"] = 3] = "TripleSource";
        TileType[TileType["Blockade"] = 4] = "Blockade";
        TileType[TileType["Trash"] = 5] = "Trash";
        TileType[TileType["Wildcard"] = 6] = "Wildcard";
        TileType[TileType["Count"] = 7] = "Count";
    })(TileType = CircuitFreaks.TileType || (CircuitFreaks.TileType = {}));
    var TilePathDescriptor = /** @class */ (function () {
        function TilePathDescriptor(d1, d2) {
            this.dir1 = d1;
            this.dir2 = d2;
        }
        TilePathDescriptor.prototype.rotateCW = function () {
            this.dir1 = rotateCW(this.dir1);
            this.dir2 = rotateCW(this.dir2);
        };
        return TilePathDescriptor;
    }());
    CircuitFreaks.TilePathDescriptor = TilePathDescriptor;
    var TileDescriptor = /** @class */ (function () {
        function TileDescriptor(type, groupIndex) {
            this.type = type;
            this.groupIndex = groupIndex;
            this.paths = [];
        }
        TileDescriptor.prototype.rotateCW = function () {
            for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
                var p = _a[_i];
                p.rotateCW();
            }
        };
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
        // switch(type) {
        //     case TileType.Curve_NE:
        //         return TileType.Curve_SE;
        //     case TileType.Curve_NW:
        //         return TileType.Curve_NE;
        //     case TileType.Curve_SE:
        //         return TileType.Curve_SW;e
        //     case TileType.Curve_SW:
        //         return TileType.Curve_NW;
        //     case TileType.Straight_H:
        //         return TileType.Straight_V;
        //     case TileType.Straight_V:
        //         return TileType.Straight_H;
        //     case TileType.Double_NE:
        //         return TileType.Double_NW;
        //     case TileType.Double_NW:
        //         return TileType.Double_NE;
        // }
        return type;
    }
    CircuitFreaks.rotateTypeCW = rotateTypeCW;
    CircuitFreaks.hexWidthFactor = 1.5 / Math.tan(Math.PI / 3.0);
    function drawHex(gr, center, unitWidth) {
        var halfHeight = .5 * unitWidth;
        var baseUnit = unitWidth * CircuitFreaks.hexWidthFactor / 3.0; // halfHeight / Math.tan(Math.PI / 3.0);
        var baseUnit2 = 2 * baseUnit;
        gr.moveTo(center.x + baseUnit2, center.y);
        gr.lineTo(center.x + baseUnit, center.y + halfHeight);
        gr.lineTo(center.x - baseUnit, center.y + halfHeight);
        gr.lineTo(center.x - baseUnit2, center.y);
        gr.lineTo(center.x - baseUnit, center.y - halfHeight);
        gr.lineTo(center.x + baseUnit, center.y - halfHeight);
        gr.lineTo(center.x + baseUnit2, center.y);
    }
    CircuitFreaks.drawHex = drawHex;
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
        Direction[Direction["UpRight"] = 1] = "UpRight";
        Direction[Direction["DownRight"] = 2] = "DownRight";
        Direction[Direction["Down"] = 3] = "Down";
        Direction[Direction["DownLeft"] = 4] = "DownLeft";
        Direction[Direction["UpLeft"] = 5] = "UpLeft";
    })(Direction = CircuitFreaks.Direction || (CircuitFreaks.Direction = {}));
    function cwRotationsTo(d1, d2) {
        var delta = d2 - d1;
        if (delta < 0)
            return 6 + delta;
        return delta;
    }
    CircuitFreaks.cwRotationsTo = cwRotationsTo;
    function rotateCW(dir) {
        return (dir + 1) % 6;
    }
    CircuitFreaks.rotateCW = rotateCW;
    function getOppositeDir(dir) {
        switch (dir) {
            case Direction.Down:
                return Direction.Up;
            case Direction.Up:
                return Direction.Down;
            case Direction.UpLeft:
                return Direction.DownRight;
            case Direction.UpRight:
                return Direction.DownLeft;
            case Direction.DownLeft:
                return Direction.UpRight;
            case Direction.DownRight:
                return Direction.UpLeft;
        }
    }
    CircuitFreaks.getOppositeDir = getOppositeDir;
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
    var TilePath = /** @class */ (function () {
        function TilePath(d1, d2) {
            this.dir1 = d1;
            this.dir2 = d2;
            this.circuitState = CircuitState.None;
        }
        TilePath.prototype.dirToAngle = function (d) {
            var thirdAng = Math.PI / 3.0;
            switch (d) {
                case CircuitFreaks.Direction.Down:
                    return thirdAng * 1.5;
                case CircuitFreaks.Direction.DownLeft:
                    return thirdAng * 2.5;
                case CircuitFreaks.Direction.DownRight:
                    return thirdAng * 0.5;
                case CircuitFreaks.Direction.Up:
                    return thirdAng * -1.5;
                case CircuitFreaks.Direction.UpLeft:
                    return thirdAng * -2.5;
                case CircuitFreaks.Direction.UpRight:
                    return thirdAng * -0.5;
            }
            return 0;
        };
        TilePath.prototype.dirToPos = function (d, offset) {
            var ang = this.dirToAngle(d);
            return new PIXI.Point(offset * Math.cos(ang), offset * Math.sin(ang));
        };
        TilePath.prototype.draw = function (gr, offset) {
            var p1 = this.dirToPos(this.dir1, offset);
            var p2 = this.dirToPos(this.dir2, offset);
            var steps = CircuitFreaks.cwRotationsTo(this.dir1, this.dir2);
            if (CircuitFreaks.getOppositeDir(this.dir1) == this.dir2) {
                //straight line:
                gr.moveTo(p1.x, p1.y);
                gr.lineTo(p2.x, p2.y);
            }
            else {
                var radius = (CircuitFreaks.cwRotationsTo(this.dir1, this.dir2) % 2 == 0) ? 1.5 * offset : .5 * offset;
                radius *= 0.8;
                gr.moveTo(p1.x, p1.y);
                gr.arcTo(0, 0, p2.x, p2.y, radius);
                gr.lineTo(p2.x, p2.y);
            }
            // let c = new PIXI.Point((p1.x / 2 + p2.x / 2) * .5, (p1.y / 2 + p2.y / 2) * .5);
            // let dist = Math.sqrt(c.x * c.x + c.y * c.y);
            // c.x *= 1.0 / dist;
            // c.y *= 1.0 / dist;
            // gr.moveTo(p1.x, p1.y);
            // gr.arcTo(0, 0, p2.x, p2.y, .5 * offset);
        };
        return TilePath;
    }());
    CircuitFreaks.TilePath = TilePath;
    var Tile = /** @class */ (function (_super) {
        __extends(Tile, _super);
        function Tile(width, desc) {
            var _this = _super.call(this) || this;
            _this.graphics = new PIXI.Graphics();
            _this.addChild(_this.graphics);
            _this.reset(width, desc);
            return _this;
            // this.tileWidth = width;
            // this.type = desc.type;
            // this.groupIndex = desc.groupIndex;
            // this.paths = [];
            // for(let pDesc of desc.paths) {
            //     this.paths.push(new TilePath(pDesc.dir1, pDesc.dir2));
            // }
            // this.dropDistance = 0;
            // this.setState(TileState.Idle);
            // this.clearCircuitState();
            // this.redraw();
        }
        Tile.prototype.reset = function (width, desc) {
            this.tileWidth = width;
            this.type = desc.type;
            this.groupIndex = desc.groupIndex;
            this.paths = [];
            for (var _i = 0, _a = desc.paths; _i < _a.length; _i++) {
                var pDesc = _a[_i];
                this.paths.push(new TilePath(pDesc.dir1, pDesc.dir2));
            }
            this.dropDistance = 0;
            this.setState(TileState.Idle);
            this.clearCircuitState();
            this.redraw();
        };
        Tile.prototype.getTileDescriptor = function () {
            var desc = new CircuitFreaks.TileDescriptor(this.type, this.groupIndex);
            for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
                var p = _a[_i];
                desc.paths.push(new CircuitFreaks.TilePathDescriptor(p.dir1, p.dir2));
            }
            return desc;
        };
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
            else if (type == CircuitFreaks.TileType.Wildcard) {
                baseColor = 0x66ffaa;
                borderColor = 0x00aa66;
            }
            this.graphics.clear();
            this.graphics.beginFill(borderColor, 1.0);
            // this.graphics.drawRoundedRect(-width / 2,-width / 2, width, width, .1 * width);
            CircuitFreaks.drawHex(this.graphics, new PIXI.Point(0, 0), width);
            this.graphics.endFill();
            this.graphics.beginFill(baseColor, 1.0);
            // this.graphics.drawRoundedRect(-subWidth / 2,-subWidth / 2, subWidth, subWidth, .1 * subWidth);
            CircuitFreaks.drawHex(this.graphics, new PIXI.Point(0, 0), subWidth);
            this.graphics.endFill();
            var lineWidth = .1 * width;
            this.setCircuitLineStyle(CircuitState.None, 0.15 * width);
            var rad = width / 2.0;
            ;
            for (var i = 0; i < this.paths.length; ++i) {
                this.paths[i].draw(this.graphics, .5 * width);
            }
            this.setCircuitLineStyle(CircuitState.None, lineWidth);
            var ang = .5 * Math.PI;
            switch (this.type) {
                /*
                case TileType.Curve_NE:
                    this.graphics.moveTo(rad, 0);
                    this.graphics.arc(rad, -rad, rad, ang, 2 * ang); // cx, cy, radius, startAngle, endAngle
                    break;
                case TileType.Curve_NW:
                    this.graphics.moveTo(0, -rad);
                    this.graphics.arc(-rad, -rad, rad, 0, ang);
                    break;
                case TileType.Curve_SE:
                    this.graphics.moveTo(0, rad);
                    this.graphics.arc(rad, rad, rad, 2 * ang, 3 * ang);
                    break;
                case TileType.Curve_SW:
                    this.graphics.moveTo(-rad, 0);
                    this.graphics.arc(-rad, rad, rad, -ang, 0);
                    break;
                case TileType.Straight_H:
                    this.graphics.moveTo(-rad, 0);
                    this.graphics.lineTo(rad, 0);
                    break;
                case TileType.Straight_V:
                    this.graphics.moveTo(0, -rad);
                    this.graphics.lineTo(0, rad);
                    break;
                case TileType.Double_NE:
                    this.graphics.moveTo(rad, 0);
                    this.graphics.arc(rad, -rad, rad, ang, 2 * ang);
                    this.setCircuitLineStyle(CircuitState.None, lineWidth);
                    this.graphics.moveTo(-rad, 0);
                    this.graphics.arc(-rad, rad, rad, -ang, 0);
                    break;
                case TileType.Double_NW:
                    this.graphics.moveTo(0, -rad);
                    this.graphics.arc(-rad, -rad, rad, 0, ang);
                    this.setCircuitLineStyle(CircuitState.None, lineWidth);
                    this.graphics.moveTo(0, rad);
                    this.graphics.arc(rad, rad, rad, 2 * ang, 3 * ang);
                    break;
                */
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
                case CircuitFreaks.TileType.Wildcard:
                    this.graphics.drawStar(0, 0, 5, .7 * rad, .35 * rad, 0);
                    this.graphics.closePath();
                    this.graphics.drawStar(0, 0, 5, .1 * rad, .05 * rad, 0);
                    this.graphics.closePath();
                    break;
                case CircuitFreaks.TileType.Blockade:
                    break;
                case CircuitFreaks.TileType.Trash:
                    break;
            }
        };
        Tile.prototype.partialDegrade = function (dir) {
            /*
            var goalType = this.type;

            let b1 = this.circuitState == CircuitState.DeadLock;
            let b2 = this.altCircuitState == CircuitState.DeadLock;

            var keepDeadlock = false;

            switch(this.type) {
                case TileType.Double_NE:
                    if(b1 && (dir == Direction.Down || dir == Direction.Left)) {
                        goalType = TileType.Curve_SW;
                        keepDeadlock = b2;
                    }
                    else if(b2 && (dir == Direction.Up || dir == Direction.Right)) {
                        goalType = TileType.Curve_NE;
                        keepDeadlock = b1;
                    }
                    break;
                case TileType.Double_NW:
                    if(b1 && (dir == Direction.Down || dir == Direction.Right)) {
                        goalType = TileType.Curve_SE;
                        keepDeadlock = b2;
                    }
                    else if(b2 && (dir == Direction.Up || dir == Direction.Left)) {
                        goalType = TileType.Curve_NW;
                        keepDeadlock = b1;
                    }
                    break;
                default:
                    break;
            }

            if(this.type == goalType) {
                this.degrade();
            }
            else {
                this.type = goalType;
                this.clearCircuitState();
                if(keepDeadlock)
                    this.circuitState = CircuitState.DeadLock;
                this.redraw();
                this.setState(TileState.Degrading);
            }
            */
        };
        Tile.prototype.degrade = function () {
            var goalType = this.type;
            // let b1 = this.circuitState == CircuitState.DeadLock;
            // let b2 = this.altCircuitState == CircuitState.DeadLock;
            switch (this.type) {
                case CircuitFreaks.TileType.Path:
                    goalType = CircuitFreaks.TileType.Trash;
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
            for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
                var p = _a[_i];
                p.circuitState = CircuitState.None;
            }
            this.circuitState = CircuitState.None;
        };
        Tile.prototype.setStateFromDirection = function (dir, state) {
            var outDir = CircuitFreaks.getOppositeDir(dir);
            for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
                var p = _a[_i];
                if (p.dir1 == outDir || p.dir2 == outDir) {
                    p.circuitState = state;
                    break;
                }
            }
            this.circuitState = state;
        };
        Tile.prototype.hasCircuit = function () {
            for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
                var p = _a[_i];
                if (p.circuitState == CircuitState.Circuit)
                    return true;
            }
            return this.circuitState == CircuitState.Circuit;
        };
        Tile.prototype.hasDeadlock = function () {
            for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
                var p = _a[_i];
                if (p.circuitState == CircuitState.DeadLock)
                    return true;
            }
            return this.circuitState == CircuitState.DeadLock;
        };
        Tile.prototype.circuitEliminatesTile = function () {
            if (!this.hasCircuit())
                return false;
            switch (this.type) {
                case CircuitFreaks.TileType.DoubleSource:
                    return this.sourceHitCount >= 2;
                case CircuitFreaks.TileType.TripleSource:
                    return this.sourceHitCount >= 3;
            }
            return true;
        };
        Tile.prototype.mirrorTile = function () {
            /*
            var mirrorType = this.type;
            switch(this.type) {
                case TileType.Curve_NE:
                    mirrorType = TileType.Curve_SE;
                    break;
                case TileType.Curve_NW:
                    mirrorType = TileType.Curve_SW;
                    break;
                case TileType.Curve_SE:
                    mirrorType = TileType.Curve_NE;
                    break;
                case TileType.Curve_SW:
                    mirrorType = TileType.Curve_NW;
                    break;
                case TileType.Double_NE:
                    mirrorType = TileType.Double_NW;
                    break;
                case TileType.Double_NW:
                    mirrorType = TileType.Double_NE;
                    break;
                default:
                    //do nothing...
                    break;
            }
            this.type = mirrorType;
            this.setState(TileState.Flipping);
            */
        };
        Tile.prototype.directionIntoState = function (dir, state) {
            var oppDir = CircuitFreaks.getOppositeDir(dir);
            for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
                var p = _a[_i];
                if (p.dir1 == oppDir || p.dir2 == oppDir)
                    return p.circuitState == state;
            }
            return false;
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
                case CircuitFreaks.TileType.Path:
                    {
                        for (var i = 0; i < this.paths.length; ++i) {
                            if (this.paths[i].circuitState == CircuitState.Circuit) {
                                this.paths.splice(i, 1);
                            }
                        }
                        if (this.paths.length == 0)
                            newType = CircuitFreaks.TileType.Trash;
                    }
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
            switch (this.type) {
                case CircuitFreaks.TileType.Path:
                    {
                        var oppDir = CircuitFreaks.getOppositeDir(dir);
                        for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
                            var p = _a[_i];
                            if (p.dir1 == oppDir || p.dir2 == oppDir)
                                return true;
                        }
                        return false;
                    }
                case CircuitFreaks.TileType.Source:
                case CircuitFreaks.TileType.DoubleSource:
                case CircuitFreaks.TileType.TripleSource:
                case CircuitFreaks.TileType.Wildcard:
                    return true;
                case CircuitFreaks.TileType.Trash:
                case CircuitFreaks.TileType.Blockade:
                    return false;
            }
            return false;
        };
        Tile.prototype.getNextDirection = function (dir) {
            switch (this.type) {
                case CircuitFreaks.TileType.Path:
                    {
                        var oppDir = CircuitFreaks.getOppositeDir(dir);
                        for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
                            var p = _a[_i];
                            if (p.dir1 == oppDir)
                                return p.dir2;
                            else if (p.dir2 == oppDir)
                                return p.dir1;
                        }
                    }
            }
            return dir;
        };
        Tile.prototype.getOutwardDirectionsWithState = function (dirs, state) {
            switch (this.type) {
                case CircuitFreaks.TileType.Path:
                    for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
                        var p = _a[_i];
                        if (p.circuitState == state) {
                            dirs.push(p.dir1);
                            dirs.push(p.dir2);
                        }
                    }
                    break;
            }
        };
        Tile.prototype.getOutwardDirections = function (dirs) {
            switch (this.type) {
                case CircuitFreaks.TileType.Path:
                    for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
                        var p = _a[_i];
                        dirs.push(p.dir1);
                        dirs.push(p.dir2);
                    }
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
        // performFunctionOnBorderTiles(f:Function) {
        //     var dirs:Direction[] = [Direction.Right, Direction.Down, Direction.Left, Direction.Up];
        //     for(var sideIdx:number=0; sideIdx<4; ++sideIdx) {
        //         let dir = dirs[sideIdx];
        //         var row:number = sideIdx < 2 ? -1 : this.rows;
        //         var col:number = sideIdx < 2 ? -1 : this.columns;
        //         var travRow = sideIdx % 2 == 0;
        //         var its = travRow ? this.rows : this.columns;
        //         for(var i:number=0; i<its; ++i) {
        //             if(travRow)
        //                 row = i;
        //             else col = i;
        //             var n = new PIXI.Point(row, col);
        //             this.stepCoord(n, dir);
        //             var tile = this.slots[n.x][n.y];
        //             if(tile != null) {
        //                 if(this.connects(n.x, n.y, dir) && this.isPathType(tile.type))
        //                     f(this, n.x, n.y, tile, dir);
        //             }
        //         }
        //     }
        // }
        CircuitDetector.prototype.stepCoord = function (coord, dir) {
            //NOTE: x is row, y is column!
            var evenCol = coord.y % 2 == 0;
            switch (dir) {
                case CircuitFreaks.Direction.Up:
                    --coord.x;
                    break;
                case CircuitFreaks.Direction.Down:
                    ++coord.x;
                    break;
                case CircuitFreaks.Direction.DownLeft:
                    --coord.y;
                    if (evenCol)
                        ++coord.x;
                    break;
                case CircuitFreaks.Direction.DownRight:
                    ++coord.y;
                    if (evenCol)
                        ++coord.x;
                    break;
                case CircuitFreaks.Direction.UpLeft:
                    --coord.y;
                    if (!evenCol)
                        --coord.x;
                    break;
                case CircuitFreaks.Direction.UpRight:
                    ++coord.y;
                    if (!evenCol)
                        --coord.x;
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
                case CircuitFreaks.TileType.Wildcard:
                    // case TileType.Trash:
                    return true;
                default:
                    return false;
            }
        };
        CircuitDetector.prototype.isPathType = function (type) {
            return type == CircuitFreaks.TileType.Path;
        };
        CircuitDetector.prototype.sourcesConnect = function (t1, t2) {
            if (!this.isSourceType(t1.type) || !this.isSourceType(t2.type))
                return false;
            if (t1.type == CircuitFreaks.TileType.Wildcard || t2.type == CircuitFreaks.TileType.Wildcard)
                return true;
            return t1.groupIndex == t2.groupIndex;
        };
        CircuitDetector.prototype.connectsToType = function (row, col, dir, root) {
            var tile = this.getTile(row, col);
            if (tile == null)
                return null;
            if (this.isSourceType(tile.type)) {
                if (this.sourcesConnect(root, tile)) {
                    tile.setStateFromDirection(dir, CircuitFreaks.CircuitState.Circuit);
                    console.log("FOUND!", row, col);
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
                    console.log("GO BACK", row, col);
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
                    for (var dir = 0; dir < 6 && !adjacentToCircuit; ++dir) {
                        var coord = new PIXI.Point(i, j);
                        this.stepCoord(coord, dir);
                        var neighbor = this.getTile(coord.x, coord.y);
                        if (neighbor != null) {
                            if (neighbor.hasCircuit() && neighbor.circuitEliminatesTile() && neighbor.type != CircuitFreaks.TileType.Trash)
                                adjacentToCircuit = true;
                        }
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
            // console.clear();
            var clearPropState = function (caller, i, j, tile) { tile.clearCircuitState(); };
            this.performFunctionOnTiles(clearPropState);
            /*
            let pushBorderTiles = function(caller:CircuitDetector, i:number, j:number, tile:Tile, dir:Direction) : boolean {

                var isCircuit = false;
                if(tile.type == TileType.Trash) {
                    isCircuit = true;
                }
                else if(caller.isPathType(tile.type)) {
                    //continue propagation:
                    var nextDir = tile.getNextDirection(dir);
                    var coord = new PIXI.Point(i, j);
                    caller.stepCoord(coord, nextDir);

                    if(caller.coordOutOfBounds(coord.x, coord.y)) {
                        isCircuit = true;
                    }
                    else {
                        var nextTile = caller.getTile(coord.x, coord.y);
                        if(nextTile != null) {
                            if(nextTile.connects(nextDir)) {
                                isCircuit = pushBorderTiles(caller, coord.x, coord.y, nextTile, nextDir);
                            }
                        }
                    }

                }

                if(isCircuit)
                    tile.setStateFromDirection(dir, CircuitState.Circuit);
                return isCircuit;
            }
            this.performFunctionOnBorderTiles(pushBorderTiles);
            */
            var pushSource = function (caller, i, j, tile) {
                if (caller.isSourceType(tile.type)) {
                    var goalTiles = [];
                    for (var dirIdx = 0; dirIdx < 6; ++dirIdx) {
                        var coord = new PIXI.Point(i, j);
                        caller.stepCoord(coord, dirIdx);
                        if (caller.connects(coord.x, coord.y, dirIdx)) {
                            //make sure the adjacent tile-type is not already the source type:
                            if (caller.sourcesConnect(caller.slots[coord.x][coord.y], tile))
                                continue;
                            var goalTile = caller.connectsToType(coord.x, coord.y, dirIdx, tile);
                            var hasTile = caller.hasElement(goalTiles, goalTile);
                            if (goalTile != null && !hasTile) {
                                console.log("GO BACK", i, j);
                                goalTiles.push(goalTile);
                            }
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
                            tile.setStateFromDirection(CircuitFreaks.getOppositeDir(dir), CircuitFreaks.CircuitState.DeadLock);
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
var CircuitFreaks;
(function (CircuitFreaks) {
    var TileDragLayer = /** @class */ (function (_super) {
        __extends(TileDragLayer, _super);
        function TileDragLayer() {
            var _this = _super.call(this) || this;
            _this.dragSourceCoord = new PIXI.Point(0, 0);
            _this.dragSourePoint = new PIXI.Point(0, 0);
            _this.dragDirection = undefined;
            _this.indexOffset = 0;
            _this.dummyTile = new CircuitFreaks.Tile(10, new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.Blockade, 0));
            _this.addChild(_this.dummyTile);
            _this.visible = false;
            return _this;
        }
        TileDragLayer.prototype.startDrag = function (tiles, borderPos) {
            this.borderPos = borderPos;
            if (tiles.length > 0)
                this.tileWidth = tiles[0].tileWidth;
            this.tiles = [];
            for (var _i = 0, tiles_1 = tiles; _i < tiles_1.length; _i++) {
                var tile = tiles_1[_i];
                this.tiles.push(tile);
                this.addChild(tile);
            }
            this.visible = true;
        };
        TileDragLayer.prototype.setOffsetToPoint = function (p, roundOffset) {
            var angle = -.5 * Math.PI + this.dragDirection * Math.PI / 3.0;
            var toX = Math.cos(angle);
            var toY = Math.sin(angle);
            var toPos = new PIXI.Point(p.x - this.dragSourePoint.x, p.y - this.dragSourePoint.y);
            var projection = toPos.x * toX + toPos.y * toY;
            var unitDistance = this.tileWidth;
            var addSteps = projection / unitDistance;
            if (roundOffset)
                addSteps = Math.round(addSteps);
            var fract_offset = (addSteps % 1.0);
            if (fract_offset < 0)
                fract_offset += 1.0;
            var n = this.tiles.length;
            var lastIndex = (n - 1 - Math.floor(addSteps)) % n;
            if (lastIndex < 0)
                lastIndex += n;
            this.indexOffset = (n - 1) - lastIndex;
            for (var i = 0; i < n; ++i) {
                var loopOffset = (i + addSteps) % n;
                if (loopOffset < 0)
                    loopOffset += n;
                var tile = this.tiles[i];
                var steps = 1 + loopOffset;
                tile.position.x = this.borderPos.x + toX * steps * unitDistance;
                tile.position.y = this.borderPos.y + toY * steps * unitDistance;
                if (i == lastIndex)
                    tile.alpha = 1.0 - fract_offset;
                else
                    tile.alpha = 1.0;
            }
            this.dummyTile.alpha = fract_offset;
            this.dummyTile.reset(this.tileWidth, this.tiles[lastIndex].getTileDescriptor());
            this.dummyTile.position.x = this.borderPos.x + toX * fract_offset * unitDistance;
            this.dummyTile.position.y = this.borderPos.y + toY * fract_offset * unitDistance;
        };
        TileDragLayer.prototype.updateDrag = function (p) {
            this.setOffsetToPoint(p, false);
        };
        TileDragLayer.prototype.endDrag = function (p) {
            this.setOffsetToPoint(p, true);
            for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
                var tile = _a[_i];
                this.removeChild(tile);
            }
            var res = this.tiles;
            this.tiles = [];
            this.visible = false;
            return res;
        };
        return TileDragLayer;
    }(PIXI.Container));
    CircuitFreaks.TileDragLayer = TileDragLayer;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>
///<reference path="CircuitDetector.ts"/>
///<reference path="TileDragLayer.ts"/>
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
            _this.discardTiles = [];
            _this.state = BoardState.Idle;
            _this.stateParameter = 0;
            _this.tileWasPushedTMP = false;
            _this.gridGraphics = new PIXI.Graphics();
            _this.addChild(_this.gridGraphics);
            _this.tilesLayer = new PIXI.Container();
            _this.addChild(_this.tilesLayer);
            _this.dragging = false;
            _this.dragLayer = new CircuitFreaks.TileDragLayer();
            _this.addChild(_this.dragLayer);
            _this.setBoardSize(8, 5);
            _this.resetBoard();
            _this.createSnapshot(false);
            return _this;
        }
        Board.prototype.setBoardSize = function (rows, cols) {
            this.rows = rows;
            this.columns = cols;
            this.tileWidth = Math.min(this.boardWidth / this.columns, this.boardHeight / (this.rows + 1));
            //create empty grid:
            this.slots = [];
            this.snapshot = [];
            for (var i = 0; i < this.rows; ++i) {
                this.slots[i] = [];
                this.snapshot[i] = [];
                for (var j = 0; j < this.columns; ++j) {
                    this.slots[i][j] = null;
                    this.snapshot[i][j] = null;
                }
            }
            this.circuitDetector = new CircuitFreaks.CircuitDetector(this.slots, this.rows, this.columns);
            var center = new PIXI.Point(this.boardWidth / 2.0, this.boardHeight / 2.0);
            var size = new PIXI.Point(this.columns * this.tileWidth, this.rows * this.tileWidth);
            this.gridGraphics.clear();
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    var pos = this.toScreenPos(i, j);
                    this.gridGraphics.beginFill(0x0, 0.3);
                    this.gridGraphics.lineStyle(this.tileWidth * 0.15, 0xffffff, 1);
                    CircuitFreaks.drawHex(this.gridGraphics, pos, this.tileWidth);
                    this.gridGraphics.endFill();
                }
            }
        };
        Board.prototype.createSnapshot = function (tilePushed) {
            this.tileWasPushedTMP = tilePushed;
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    var tile = this.slots[i][j];
                    this.snapshot[i][j] = (tile == null) ? null : tile.getTileDescriptor();
                }
            }
        };
        Board.prototype.revertToSnapshot = function () {
            this.clearBoard();
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    if (this.snapshot[i][j] != null) {
                        var desc = this.snapshot[i][j];
                        var tile = new CircuitFreaks.Tile(this.tileWidth, desc);
                        var res = this.toScreenPos(i, j);
                        tile.position.x = res.x;
                        tile.position.y = res.y;
                        this.slots[i][j] = tile;
                        this.tilesLayer.addChild(tile);
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
                this.tilesLayer.removeChild(this.discardTiles[0]);
                this.discardTiles.splice(0, 1);
            }
            //clear old tiles:
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    var tile = this.slots[i][j];
                    if (tile != null)
                        this.tilesLayer.removeChild(tile);
                    this.slots[i][j] = null;
                }
            }
        };
        Board.prototype.loadBoard = function (data) {
            this.clearBoard();
            this.setBoardSize(data.rows, data.columns);
            console.log(data);
            //fill top few rows:
            for (var i = 0; i < data.rows; ++i) {
                for (var j = 0; j < data.columns; ++j) {
                    var idx = i * data.columns + j;
                    if (data.tiles[idx] == undefined)
                        continue;
                    console.log("ok");
                    var tile = new CircuitFreaks.Tile(this.tileWidth, data.tiles[idx]);
                    var res = this.toScreenPos(i, j);
                    tile.position.x = res.x;
                    tile.position.y = res.y;
                    this.slots[i][j] = tile;
                    this.tilesLayer.addChild(tile);
                    tile.groupIndex = 0;
                    tile.redraw();
                }
            }
            this.setState(BoardState.Idle);
        };
        Board.prototype.resetBoard = function () {
            this.clearBoard();
            var types = [CircuitFreaks.TileType.Trash, CircuitFreaks.TileType.Source, CircuitFreaks.TileType.DoubleSource, CircuitFreaks.TileType.TripleSource];
            //fill top few rows:
            for (var i = 0; i < 4; ++i) {
                for (var j = 0; j < 5; ++j) {
                    var typeIdx = Math.floor(Math.random() * types.length);
                    if (i == 3 && typeIdx == 0)
                        typeIdx += 1 + Math.floor(Math.random() * (types.length - 1));
                    var type = types[typeIdx];
                    var group = Math.floor(Math.random() * 3);
                    var row = i;
                    var column = j;
                    // var type = Math.floor(Math.random() * TileType.Count);
                    var tile = new CircuitFreaks.Tile(this.tileWidth, new CircuitFreaks.TileDescriptor(type, group));
                    var res = this.toScreenPos(row, column);
                    tile.position.x = res.x;
                    tile.position.y = res.y;
                    this.slots[row][column] = tile;
                    this.tilesLayer.addChild(tile);
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
                        this.tilesLayer.removeChild(this.discardTiles[0]);
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
        Board.prototype.startDrag = function (p) {
            var coord = this.pointToCoord(p.x, p.y);
            if (coord.x >= 0 && coord.x < this.rows && coord.y >= 0 && coord.y < this.columns) {
                var tile = this.slots[coord.x][coord.y];
                if (tile != null) {
                    this.dragging = true;
                    this.dragLayer.dragSourceCoord.x = coord.x;
                    this.dragLayer.dragSourceCoord.y = coord.y;
                    this.dragLayer.dragSourePoint.x = p.x;
                    this.dragLayer.dragSourePoint.y = p.y;
                    this.dragLayer.dragDirection = undefined;
                }
            }
        };
        Board.prototype.dragTo = function (p) {
            if (!this.dragging)
                return;
            if (this.dragLayer.dragDirection == undefined) {
                var toPos = new PIXI.Point(p.x - this.dragLayer.dragSourePoint.x, p.y - this.dragLayer.dragSourePoint.y);
                var maxDist = 0;
                var maxDir = 0;
                for (var i = 0; i < 3; ++i) {
                    var angle = -.5 * Math.PI + i * Math.PI / 3.0;
                    var toX = Math.cos(angle);
                    var toY = Math.sin(angle);
                    var projection = toPos.x * toX + toPos.y * toY;
                    if (Math.abs(projection) > Math.abs(maxDist)) {
                        maxDist = projection;
                        maxDir = i;
                    }
                }
                if (Math.abs(maxDist) > 10.0) {
                    this.dragLayer.dragDirection = maxDir;
                    //add children in current sequence:
                    var borderCoord = new PIXI.Point(this.dragLayer.dragSourceCoord.x, this.dragLayer.dragSourceCoord.y);
                    //step back until coord is outside of board:
                    var oppDir = CircuitFreaks.getOppositeDir(this.dragLayer.dragDirection);
                    while (this.isBoardCoord(borderCoord)) {
                        this.stepCoord(borderCoord, oppDir);
                    }
                    var testCoord = new PIXI.Point(borderCoord.x, borderCoord.y);
                    this.stepCoord(testCoord, this.dragLayer.dragDirection);
                    var allPath = true;
                    var dragTiles = [];
                    while (this.isBoardCoord(testCoord) && allPath) {
                        var tile = this.slots[testCoord.x][testCoord.y];
                        if (tile == null)
                            allPath = false;
                        else if (tile.type != CircuitFreaks.TileType.Path)
                            allPath = false;
                        this.stepCoord(testCoord, this.dragLayer.dragDirection);
                        dragTiles.push(tile);
                    }
                    if (!allPath) {
                        this.dragLayer.dragDirection = undefined;
                        this.dragging = false;
                        return;
                    }
                    for (var _i = 0, dragTiles_1 = dragTiles; _i < dragTiles_1.length; _i++) {
                        var tile = dragTiles_1[_i];
                        this.tilesLayer.removeChild(tile);
                    }
                    this.dragLayer.startDrag(dragTiles, this.toScreenPos(borderCoord.x, borderCoord.y));
                }
            }
            else if (this.dragging) {
                this.dragLayer.updateDrag(p);
            }
        };
        Board.prototype.dragEnd = function (p) {
            if (this.dragging) {
                var tiles = this.dragLayer.endDrag(p);
                var coord = new PIXI.Point(this.dragLayer.dragSourceCoord.x, this.dragLayer.dragSourceCoord.y);
                var oppDir = CircuitFreaks.getOppositeDir(this.dragLayer.dragDirection);
                while (this.isBoardCoord(coord)) {
                    this.stepCoord(coord, oppDir);
                }
                for (var i = 0; i < tiles.length; ++i) {
                    this.stepCoord(coord, this.dragLayer.dragDirection);
                    var tileIndex = (i - this.dragLayer.indexOffset) % tiles.length;
                    if (tileIndex < 0)
                        tileIndex += tiles.length;
                    var tile = tiles[tileIndex];
                    this.slots[coord.x][coord.y] = tile;
                    this.tilesLayer.addChild(tile);
                }
                this.setState(BoardState.ProcessCircuits);
            }
            this.dragging = false;
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
            for (var i = 0; i < this.rows; ++i) {
                for (var oddIt = 0; oddIt < 2; ++oddIt) {
                    for (var j = (1 - oddIt); j < this.columns; j += 2) {
                        var tile = this.slots[i][j];
                        if (tile == null)
                            continue;
                        if (tile.type == CircuitFreaks.TileType.Blockade)
                            continue;
                        var row = i;
                        while (this.isDropTileSlot(row, j) && row > 0) {
                            row = row - 1;
                        }
                        if (row != i) {
                            this.slots[row][j] = tile;
                            this.slots[i][j] = null;
                            console.log(row, j);
                            tile.position = this.toScreenPos(row, j);
                            tile.drop((i - row) * this.tileWidth);
                        }
                    }
                }
            }
        };
        Board.prototype.toScreenPos = function (row, col) {
            var baseUnit = CircuitFreaks.hexWidthFactor * this.tileWidth;
            var res = new PIXI.Point();
            res.x = this.boardWidth / 2.0 + (col - (this.columns - 1) * .5) * baseUnit;
            res.y = this.boardHeight / 2.0 + (row - (this.rows - 1) * .5) * this.tileWidth;
            if (col % 2 == 0)
                res.y += .5 * this.tileWidth;
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
        Board.prototype.isEmptyTileAt = function (row, column) {
            if (row < 0 || row >= this.rows || column < 0 || column >= this.columns)
                return false;
            return this.slots[row][column] == null;
        };
        Board.prototype.isDropTileSlot = function (row, column) {
            if (row < 0 || row >= this.rows || column < 0 || column >= this.columns)
                return false;
            var dirs = [CircuitFreaks.Direction.UpLeft, CircuitFreaks.Direction.Up, CircuitFreaks.Direction.UpRight];
            for (var _i = 0, dirs_1 = dirs; _i < dirs_1.length; _i++) {
                var d = dirs_1[_i];
                var coord = new PIXI.Point(row, column);
                this.stepCoord(coord, d);
                //ignore left and right boundary:
                if (coord.y < 0 || coord.y >= this.columns)
                    continue;
                if (!this.isEmptyTileAt(coord.x, coord.y))
                    return false;
            }
            return true;
        };
        Board.prototype.hasDropTiles = function () {
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    if (this.isDropTileSlot(i, j)) {
                        var tile = this.slots[i][j];
                        if (tile != null) {
                            if (tile.type != CircuitFreaks.TileType.Blockade)
                                return true;
                        }
                    }
                }
            }
            // for(var j:number=0; j<this.columns; ++j) {
            //     var encounteredEmpty = false;
            //     for(var i:number=0; i<this.rows; ++i) {
            //         if(this.slots[i][j] == null)
            //             encounteredEmpty = true;
            //         else if(encounteredEmpty)
            //             return true;
            //     }
            // }
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
        Board.prototype.stepCoord = function (coord, dir) {
            //NOTE: x is row, y is column!
            var evenCol = coord.y % 2 == 0;
            switch (dir) {
                case CircuitFreaks.Direction.Up:
                    --coord.x;
                    break;
                case CircuitFreaks.Direction.Down:
                    ++coord.x;
                    break;
                case CircuitFreaks.Direction.DownLeft:
                    --coord.y;
                    if (evenCol)
                        ++coord.x;
                    break;
                case CircuitFreaks.Direction.DownRight:
                    ++coord.y;
                    if (evenCol)
                        ++coord.x;
                    break;
                case CircuitFreaks.Direction.UpLeft:
                    --coord.y;
                    if (!evenCol)
                        --coord.x;
                    break;
                case CircuitFreaks.Direction.UpRight:
                    ++coord.y;
                    if (!evenCol)
                        --coord.x;
                    break;
            }
        };
        Board.prototype.isBoardCoord = function (pt) {
            return pt.x >= 0 && pt.x < this.rows && pt.y >= 0 && pt.y < this.columns;
        };
        Board.prototype.isCoordAvailable = function (pt) {
            if (!this.isBoardCoord(pt))
                return false;
            return this.slots[pt.x][pt.y] == null;
        };
        Board.prototype.pointToCoord = function (x, y) {
            var slotHeight = this.tileWidth;
            var slotWidth = CircuitFreaks.hexWidthFactor * slotHeight;
            var column = Math.floor((x - this.boardWidth / 2.0) / slotWidth + this.columns / 2.0);
            if (column % 2 == 0)
                y -= .5 * slotHeight;
            var row = Math.floor((y - this.boardHeight / 2.0) / slotHeight + this.rows / 2.0);
            return new PIXI.Point(row, column);
        };
        Board.prototype.pushTile = function (pos, set) {
            if (this.state != BoardState.Idle)
                return false;
            var descs = set.getTileDescriptions();
            var slotHeight = this.tileWidth;
            var slotWidth = CircuitFreaks.hexWidthFactor * slotHeight;
            var samplePos = new PIXI.Point(pos.x, pos.y);
            if (descs.length) {
                var angle = (-.5 + set.cwRotations / 3.0) * Math.PI;
                var offset = (descs.length - 1) * .5 * slotHeight;
                samplePos.x += Math.cos(angle) * offset;
                samplePos.y += Math.sin(angle) * offset;
            }
            var coord = this.pointToCoord(samplePos.x, samplePos.y);
            var placesAvailable = this.isCoordAvailable(coord);
            for (var i = 0; i < descs.length - 1; ++i) {
                this.stepCoord(coord, set.getDirection());
                placesAvailable = placesAvailable && this.isCoordAvailable(coord);
            }
            if (placesAvailable) {
                this.createSnapshot(true);
                coord = this.pointToCoord(samplePos.x, samplePos.y);
                for (var i = 0; i < set.tiles.length; ++i) {
                    var tile = new CircuitFreaks.Tile(this.tileWidth, descs[i]);
                    tile.position = this.toScreenPos(coord.x, coord.y);
                    tile.setState(CircuitFreaks.TileState.Appearing);
                    this.slots[coord.x][coord.y] = tile;
                    this.tilesLayer.addChild(tile);
                    this.stepCoord(coord, set.getDirection());
                }
                this.setState(BoardState.Place);
                return true;
            }
            // this.startDrag(pos);
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
            _this.cwRotations = 0;
            _this.setTypes(types);
            return _this;
        }
        TileSet.prototype.getTileDescriptions = function () {
            var res = [];
            for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
                var tile = _a[_i];
                res.push(tile.getTileDescriptor());
            }
            return res;
        };
        TileSet.prototype.getDirection = function () {
            switch (this.cwRotations) {
                case 0:
                    return CircuitFreaks.Direction.Down;
                case 1:
                    return CircuitFreaks.Direction.DownLeft;
                default:
                    return CircuitFreaks.Direction.UpLeft;
            }
        };
        TileSet.prototype.update = function (dt) {
            this.rotateAnimParam = Math.min(this.rotateAnimParam + dt / 0.2, 1.0);
            // this.rotation = (1 - easeOutElastic(this.rotateAnimParam)) * -0.5 * Math.PI;
            this.rotation = -Math.PI / 3.0 * (1 - Math.sin(this.rotateAnimParam * .5 * Math.PI));
            for (var i = 0; i < this.tiles.length; ++i) {
                this.tiles[i].update(dt);
            }
        };
        TileSet.prototype.rotateSet = function () {
            this.rotateAnimParam = 0;
            var currTypes = [];
            for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
                var tile = _a[_i];
                currTypes.push(tile.getTileDescriptor());
            }
            for (var i = 0; i < currTypes.length; ++i)
                currTypes[i].rotateCW(); // rotateTypeCW(currTypes[i]);
            this.cwRotations = this.cwRotations + 1;
            if (this.cwRotations > 2) {
                this.cwRotations = 0;
                currTypes.reverse();
            }
            this.setTypes(currTypes);
            // this.isHorizontal = !this.isHorizontal;
            // if(this.isHorizontal)
            //     currTypes.reverse();
            // this.setTypes(currTypes);
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
            var offset = (types.length - 1) * .5 * this.tileWidth;
            for (var i = 0; i < types.length; ++i) {
                var tile = new CircuitFreaks.Tile(this.tileWidth, types[i]);
                this.addChild(tile);
                this.tiles.push(tile);
                var angle = (-.5 + this.cwRotations / 3.0 + i) * Math.PI;
                tile.x = Math.cos(angle) * offset;
                tile.y = Math.sin(angle) * offset;
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
            _this.tileCount = 3;
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
                // var topTypes = [ TileType.Curve_NE, TileType.Curve_NW, TileType.Curve_SE, TileType.Curve_SW, 
                //                 TileType.Double_NW, TileType.Double_NE,
                //                 TileType.Straight_H, TileType.Straight_V ];
                var topTypes = []; //[ TileType.Path, TileType.Path, TileType.Path ];
                var btmTypes = [];
                for (var i = 0; i < 5; ++i) {
                    for (var it = 0; it < 2; ++it) {
                        var d1 = it == 0 ? CircuitFreaks.Direction.Down : CircuitFreaks.Direction.Up;
                        var d2 = (d1 + 1 + i) % 6;
                        var tile = new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.Path, 0);
                        tile.paths.push(new CircuitFreaks.TilePathDescriptor(d1, d2));
                        if (it == 0)
                            topTypes.push(tile);
                        else
                            btmTypes.push(tile);
                    }
                }
                // var dirs = [ [ Direction.DownLeft, Direction.UpLeft], [Direction.Up, Direction.UpRight], [Direction.DownRight, Direction.Down]];
                // for(let d of dirs) {
                //     let desc = new TileDescriptor(TileType.Path, 0);
                //     topTypes.push(new TileDescriptor(TileType.Path, 0));
                // }
                // if(Math.random() < .5) {
                //     dirs = [ [ Direction.UpLeft, Direction.Up], [Direction.UpRight, Direction.DownRight], [Direction.Down, Direction.DownLeft]];
                // }
                // if(Math.random() < .1) {
                //     dirs = [ [Direction.UpLeft, Direction.DownRight] ];
                // }
                // else if(Math.random() < .1) {
                //     dirs = [ [Direction.UpLeft, Direction.UpRight] ];
                // }
                // let baseIdx = Math.floor(Math.random() * 3);
                // let numReps = Math.random() < .2 ? dirs.length : 1;
                // for(var i:number=0; i<numReps; ++i) {
                //     let idx = (i + baseIdx) % dirs.length;
                //     this.paths[i] = new TilePath(dirs[idx][0], dirs[idx][1]);
                // }
                // var btmTypes =  [...topTypes];
                this.shuffle(btmTypes);
                for (var i_1 in btmTypes)
                    this.nextTypes.push([topTypes[i_1], btmTypes[i_1]]);
                this.nextTypes.push([new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.Wildcard, 0)]);
                // this.nextTypes.push([new TileDescriptor(TileType.Trash, 0)]);
                var tripleTile = new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.Path, 0);
                this.nextTypes.push([tripleTile]);
                for (var i = 0; i < 3; ++i) {
                    tripleTile.paths.push(new CircuitFreaks.TilePathDescriptor(2 * i, 2 * i + 1));
                }
                var straightTile = new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.Path, 0);
                this.nextTypes.push([straightTile]);
                straightTile.paths.push(new CircuitFreaks.TilePathDescriptor(CircuitFreaks.Direction.Up, CircuitFreaks.Direction.Down));
                for (var i = 0; i < 2; ++i) {
                    straightTile.paths.push(new CircuitFreaks.TilePathDescriptor(3 * i + 1, 3 * i + 2));
                }
                var doubleTile = new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.Path, 0);
                this.nextTypes.push([doubleTile]);
                for (var i = 0; i < 2; ++i) {
                    doubleTile.paths.push(new CircuitFreaks.TilePathDescriptor(3 * i + 2, (3 * i + 4) % 6));
                }
                for (var i = 0; i < 3; ++i) {
                    var baseTile = new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.Path, 0);
                    this.nextTypes.push([baseTile]);
                    var baseIdx = Math.floor(Math.random() * 6) % 6;
                    baseTile.paths.push(new CircuitFreaks.TilePathDescriptor(baseIdx, (baseIdx + 1 + i) % 6));
                }
                this.shuffle(this.nextTypes);
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
        function Button(text, func, radius, base_width, base_height) {
            if (radius === void 0) { radius = 20; }
            if (base_width === void 0) { base_width = 50; }
            if (base_height === void 0) { base_height = 1; }
            var _this = _super.call(this) || this;
            base_width = Math.max(base_width, 1);
            base_height = Math.max(base_height, 1);
            _this.func = func;
            var hw = base_width / 2.0;
            _this.graphics = new PIXI.Graphics();
            _this.graphics.beginFill(0x22ff22);
            _this.graphics.lineStyle(5, 0xffffff, 1);
            _this.visWidth = base_width + 2 * radius;
            _this.visHeight = base_height + 2 * radius;
            _this.graphics.drawRoundedRect(-_this.visWidth / 2, -_this.visHeight / 2, _this.visWidth, _this.visHeight, radius);
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
            return _this;
        }
        Button.prototype.hitTestPt = function (p) {
            var toBtn = new PIXI.Point(p.x - this.position.x, p.y - this.position.y);
            return Math.abs(toBtn.x) < this.visWidth / 2 && Math.abs(toBtn.y) < this.visHeight / 2;
        };
        return Button;
    }(PIXI.Container));
    CircuitFreaks.Button = Button;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Button.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var LevelSelector = /** @class */ (function (_super) {
        __extends(LevelSelector, _super);
        function LevelSelector(w, h) {
            var _this = _super.call(this) || this;
            _this.fadeBackground = new PIXI.Graphics();
            _this.fadeBackground.beginFill(0x0, 0.5);
            _this.fadeBackground.drawRect(0, 0, w, h);
            _this.addChild(_this.fadeBackground);
            _this.background = new PIXI.Graphics();
            _this.background.beginFill(0x00aa00);
            _this.background.lineStyle(6, 0xffffff, 1);
            _this.background.drawRoundedRect(.1 * w, .1 * h, .8 * w, .8 * h, 30);
            _this.addChild(_this.background);
            //text:string, func:Function, base_width:number = 50
            _this.closeBtn = new CircuitFreaks.Button('✕', _this.close, 30, 0);
            _this.closeBtn.x = .9 * w - 50;
            _this.closeBtn.y = .1 * h + 50;
            _this.addChild(_this.closeBtn);
            _this.visible = false;
            var rows = 6;
            var cols = 4;
            var panelWidth = .9 * w;
            var tileWidth = .7 * panelWidth / cols - 20;
            var panelHeight = .7 * h;
            var panelLeft = .05 * w;
            var panelTop = .2 * h;
            _this.levelButtons = [];
            for (var i = 0; i < rows; ++i) {
                var y = panelTop + (i + 1) / (rows + 1) * panelHeight;
                for (var j = 0; j < cols; ++j) {
                    var x = panelLeft + (j + 1) / (cols + 1) * panelWidth;
                    var idx = i * cols + j + 1;
                    var btn = new CircuitFreaks.Button('' + idx, _this.close, 10, tileWidth, tileWidth);
                    btn.x = x;
                    btn.y = y;
                    _this.addChild(btn);
                    _this.levelButtons.push(btn);
                }
            }
            return _this;
        }
        LevelSelector.prototype.close = function () {
            this.hide();
        };
        LevelSelector.prototype.isEnabled = function () {
            return this.visible;
        };
        LevelSelector.prototype.touchDown = function (p) {
            if (this.closeBtn.hitTestPt(p)) {
                this.close();
                return -1;
            }
            for (var i = 0; i < this.levelButtons.length; ++i) {
                var btn = this.levelButtons[i];
                if (btn.hitTestPt(p)) {
                    this.close();
                    return i;
                }
            }
            return -1;
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
///<reference path="Defs.ts"/>
///<reference path="Button.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var TileData = /** @class */ (function () {
        function TileData() {
        }
        return TileData;
    }());
    CircuitFreaks.TileData = TileData;
    var LevelData = /** @class */ (function () {
        function LevelData(rows, cols) {
            this.rows = rows;
            this.columns = cols;
            this.tiles = [];
            var n = this.rows * this.columns;
            for (var i = 0; i < n; ++i)
                this.tiles[i] = undefined;
        }
        LevelData.deserializeTile = function (type) {
            switch (type) {
                case 'y1':
                    return new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.Source, 0);
                case 'y2':
                    return new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.DoubleSource, 0);
                case 'y3':
                    return new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.TripleSource, 0);
                case 'b1':
                    return new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.Source, 1);
                case 'b2':
                    return new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.DoubleSource, 1);
                case 'b3':
                    return new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.TripleSource, 1);
                case 'r1':
                    return new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.Source, 2);
                case 'r2':
                    return new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.DoubleSource, 2);
                case 'r3':
                    return new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.TripleSource, 2);
                case '##':
                    return new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.Trash, 0);
            }
            return undefined;
        };
        // static serializeTile(type:TileDescriptor) : string {
        //     switch(type) {
        //         case TileType.Source:
        //             return 'y1';
        //         case TileType.DoubleSource:
        //             return 'y2';
        //         case TileType.TripleSource:
        //             return 'y3';
        //         case TileType.Trash:
        //             return '##';
        //     }
        //     return '--';
        // }
        LevelData.deserialize = function (data) {
            var result = new LevelData(data.rows, data.columns);
            var n = result.rows * result.columns;
            for (var i = 0; i < n; ++i) {
                result.tiles[i] = LevelData.deserializeTile(data.tiles[i]);
            }
            return result;
        };
        return LevelData;
    }());
    CircuitFreaks.LevelData = LevelData;
    var LevelLoader = /** @class */ (function () {
        function LevelLoader(cb, listener) {
            this.callback = cb;
            this.listener = listener;
            LevelLoader.instance = this;
        }
        LevelLoader.prototype.loadLevel = function (index) {
            this.isDone = false;
            this.filePath = "levels/level" + index + ".json";
            var currRes = PIXI.loader.resources[this.filePath];
            console.log(currRes);
            if (currRes == undefined) {
                PIXI.loader.add([this.filePath]);
                PIXI.loader.load(LevelLoader.loadFinished);
            }
            else {
                var levelData = LevelData.deserialize(currRes.data);
                this.callback.call(this.listener, levelData);
            }
        };
        LevelLoader.loadFinished = function () {
            var loader = LevelLoader.instance;
            var data = PIXI.loader.resources[loader.filePath].data;
            var levelData = LevelData.deserialize(data);
            loader.callback.call(loader.listener, levelData);
        };
        return LevelLoader;
    }());
    CircuitFreaks.LevelLoader = LevelLoader;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Board.ts"/>
///<reference path="Tile.ts"/>
///<reference path="TilePanel.ts"/>
///<reference path="Button.ts"/>
///<reference path="LevelSelector.ts"/>
///<reference path="LevelLoader.ts"/>
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
            var callbacks = [_this.openLevelSelect, _this.loadDefault, _this.undo];
            for (var i = 0; i < txts.length; ++i) {
                var btn = new CircuitFreaks.Button(txts[i], callbacks[i]);
                btn.x = w * (i + 1) / 4.0;
                btn.y = h * .05;
                _this.addChild(btn);
                _this.buttons.push(btn);
            }
            _this.levelSelector = new CircuitFreaks.LevelSelector(w, h);
            _this.addChild(_this.levelSelector);
            _this.levelLoader = new CircuitFreaks.LevelLoader(_this.loadLevel, _this);
            return _this;
        }
        Game.prototype.loadLevel = function (data) {
            this.board.loadBoard(data);
        };
        Game.prototype.openLevelSelect = function () {
            this.levelSelector.show();
        };
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
            if (this.levelSelector.isEnabled()) {
                var res = this.levelSelector.touchDown(p);
                if (res >= 0) {
                    this.levelLoader.loadLevel(res);
                }
                return;
            }
            for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
                var btn = _a[_i];
                if (btn.hitTestPt(p)) {
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
            var locPos = new PIXI.Point(p.x - this.board.position.x, p.y - this.board.position.y);
            this.board.dragTo(locPos);
        };
        Game.prototype.touchUp = function (p) {
            var locPos = new PIXI.Point(p.x - this.board.position.x, p.y - this.board.position.y);
            this.board.dragEnd(locPos);
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
