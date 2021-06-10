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
var CircuitFreaks;
(function (CircuitFreaks) {
    var TileType;
    (function (TileType) {
        TileType[TileType["Path"] = 0] = "Path";
        TileType[TileType["Source"] = 1] = "Source";
        TileType[TileType["DoubleSource"] = 2] = "DoubleSource";
        TileType[TileType["TripleSource"] = 3] = "TripleSource";
        TileType[TileType["BombSource"] = 4] = "BombSource";
        TileType[TileType["EnabledBomb"] = 5] = "EnabledBomb";
        TileType[TileType["Blockade"] = 6] = "Blockade";
        TileType[TileType["Trash"] = 7] = "Trash";
        TileType[TileType["Wildcard"] = 8] = "Wildcard";
        TileType[TileType["Count"] = 9] = "Count";
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
        TileDescriptor.prototype.equals = function (other) {
            return this.type == other.type && this.groupIndex == other.groupIndex;
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
        TileState[TileState["Exploding"] = 7] = "Exploding";
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
            _this.visualContainer = new PIXI.Container();
            _this.addChild(_this.visualContainer);
            _this.graphics = new PIXI.Graphics();
            _this.visualContainer.addChild(_this.graphics);
            _this.reset(width, desc);
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
            _this.text = new PIXI.Text("");
            _this.text.style.fontFamily = "groboldregular";
            _this.text.style.fontSize = 40;
            _this.text.style.stroke = 0xffffff;
            _this.text.style.fill = 0xffffff;
            _this.text.anchor.set(0.5, 0.5);
            _this.text.style.dropShadow = true;
            _this.text.style.dropShadowAlpha = .5;
            _this.text.x = 0;
            _this.text.y = 0;
            _this.text.scale.x = .75;
            _this.text.scale.y = .75;
            _this.visualContainer.addChild(_this.text);
            return _this;
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
            else if (type == CircuitFreaks.TileType.Source || type == CircuitFreaks.TileType.DoubleSource || type == CircuitFreaks.TileType.TripleSource || type == CircuitFreaks.TileType.BombSource) {
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
            else if (type == CircuitFreaks.TileType.EnabledBomb) {
                baseColor = 0x777777;
                borderColor = 0x222222;
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
                case CircuitFreaks.TileType.EnabledBomb:
                case CircuitFreaks.TileType.BombSource:
                    this.graphics.drawCircle(0, 0, rad - lineWidth * .5);
                    // this.graphics.beginFill(0xffffff, 1);
                    // this.graphics.drawCircle(0,0, rad * .5);
                    // this.graphics.drawRoundedRect(.7 * rad,-.7 * rad,.2 * rad,.2 * rad, .05 * rad);
                    // this.graphics.endFill();
                    if (this.text)
                        this.text.text = "💣";
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
                    this.visualContainer.position.y = 0;
                    this.visualContainer.scale.x = this.visualContainer.scale.y = 1;
                    this.visualContainer.rotation = 0;
                    if (this.visualUpdatePending)
                        this.redraw();
                    break;
                case TileState.Disappearing:
                    break;
                case TileState.Exploding:
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
            switch (this.type) {
                case CircuitFreaks.TileType.EnabledBomb:
                    return false;
                case CircuitFreaks.TileType.BombSource:
                    return false;
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
        Tile.prototype.filterCircuitFromTile = function (forceSingleSource) {
            if (forceSingleSource === void 0) { forceSingleSource = false; }
            var newType = this.type;
            switch (this.type) {
                case CircuitFreaks.TileType.BombSource:
                    newType = CircuitFreaks.TileType.EnabledBomb;
                    break;
                case CircuitFreaks.TileType.DoubleSource:
                    if (this.sourceHitCount == 1 || forceSingleSource)
                        newType = CircuitFreaks.TileType.Source;
                    break;
                case CircuitFreaks.TileType.TripleSource:
                    if (this.sourceHitCount == 1 || forceSingleSource)
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
                    this.visualContainer.scale.x = this.visualContainer.scale.y = CircuitFreaks.easeOutElastic(this.stateParameter);
                    this.updateCurrentState(dt, 0.5, TileState.Idle);
                    break;
                case TileState.Idle:
                    //do nothing...
                    break;
                case TileState.Disappearing:
                    {
                        this.visualContainer.alpha = 1 - this.stateParameter;
                        this.updateCurrentState(dt, 0.5, TileState.Gone);
                    }
                    break;
                case TileState.Exploding:
                    {
                        this.visualContainer.alpha = 1 - this.stateParameter;
                        this.visualContainer.scale.x = this.visualContainer.scale.y = 1 + .75 * Math.pow(this.stateParameter, 0.2);
                        this.updateCurrentState(dt, 0.2, TileState.Gone);
                    }
                    break;
                case TileState.Dropping:
                    {
                        var t = this.stateParameter; //1 - easeBounceOut(this.stateParameter);
                        var dropFrac = 0.5;
                        if (t < dropFrac) {
                            var tt = t / dropFrac;
                            this.visualContainer.position.y = Math.cos(tt * .5 * Math.PI) * this.dropDistance;
                        }
                        else {
                            var tt = (t - dropFrac) / (1 - dropFrac);
                            this.visualContainer.position.y = 0;
                            this.visualContainer.scale.x = 1 + 0.1 * Math.sin(tt * 6) * (1 - tt);
                            this.visualContainer.scale.y = 2 - this.visualContainer.scale.x;
                        }
                        // this.visualContainer.position.y = t * this.dropDistance;
                        this.updateCurrentState(dt, 0.66, TileState.Idle);
                    }
                    break;
                case TileState.Degrading:
                    {
                        var t = .2 * Math.sin(this.stateParameter * 10) * (1 - this.stateParameter);
                        // this.visualContainer.rotation = t;
                        this.visualContainer.scale.x = this.visualContainer.scale.y = 1 + .1 * Math.sin(this.stateParameter * 15) * (1 - this.stateParameter);
                        if (this.type == CircuitFreaks.TileType.EnabledBomb) {
                            this.text.scale.x = this.text.scale.y = 1 - .25 * Math.cos(this.stateParameter * 15) * (1 - this.stateParameter);
                        }
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
                        // this.visualContainer.scale.x = s;
                        this.visualContainer.scale.y = t;
                        // this.visualContainer.scale.y = t;
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
                case CircuitFreaks.TileType.BombSource:
                    return true;
                case CircuitFreaks.TileType.Trash:
                case CircuitFreaks.TileType.Blockade:
                case CircuitFreaks.TileType.EnabledBomb:
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
                case CircuitFreaks.TileType.BombSource:
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
        BoardState[BoardState["Explode"] = 2] = "Explode";
        BoardState[BoardState["Drop"] = 3] = "Drop";
        BoardState[BoardState["Place"] = 4] = "Place";
        BoardState[BoardState["DegradeDeadlock"] = 5] = "DegradeDeadlock";
        BoardState[BoardState["ProcessCircuits"] = 6] = "ProcessCircuits";
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
            // this.clearBoard();
            if (!this.slots)
                this.slots = [];
            this.tilesLayer.removeChildren();
            this.rows = rows;
            this.columns = cols;
            this.tileWidth = Math.min(this.boardWidth / this.columns, this.boardHeight / (this.rows + 1));
            //create empty grid:
            // this.slots = [];
            var newSlots = [];
            this.snapshot = [];
            for (var i = 0; i < this.rows; ++i) {
                newSlots[i] = [];
                this.snapshot[i] = [];
                for (var j = 0; j < this.columns; ++j) {
                    var tile = null;
                    if (i < this.slots.length) {
                        if (j < this.slots[i].length)
                            tile = this.slots[i][j];
                    }
                    if (tile) {
                        tile = new CircuitFreaks.Tile(this.tileWidth, tile.getTileDescriptor());
                        tile.position = this.toScreenPos(i, j);
                        this.tilesLayer.addChild(tile);
                    }
                    newSlots[i][j] = tile;
                    this.snapshot[i][j] = null;
                }
            }
            this.slots = newSlots;
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
            this.tilesLayer.removeChildren();
        };
        Board.prototype.serializeBoard = function () {
            var data = new CircuitFreaks.LevelData(this.rows, this.columns);
            for (var i = 0; i < data.rows; ++i) {
                for (var j = 0; j < data.columns; ++j) {
                    var idx = i * data.columns + j;
                    var tile = this.slots[i][j];
                    data.tiles[idx] = tile ? tile.getTileDescriptor() : undefined;
                }
            }
            return data.serialize();
        };
        Board.prototype.loadBoard = function (data) {
            this.clearBoard();
            this.setBoardSize(data.rows, data.columns);
            //fill top few rows:
            for (var i = 0; i < data.rows; ++i) {
                for (var j = 0; j < data.columns; ++j) {
                    var idx = i * data.columns + j;
                    var tileData = data.tiles[idx];
                    if (tileData == undefined)
                        continue;
                    var tile = new CircuitFreaks.Tile(this.tileWidth, tileData);
                    var res = this.toScreenPos(i, j);
                    tile.position.x = res.x;
                    tile.position.y = res.y;
                    this.slots[i][j] = tile;
                    this.tilesLayer.addChild(tile);
                    tile.groupIndex = tileData.groupIndex;
                    tile.redraw();
                }
            }
            this.setState(BoardState.Idle);
        };
        Board.prototype.resetBoard = function () {
            this.clearBoard();
            var types = [CircuitFreaks.TileType.Trash, CircuitFreaks.TileType.Source, CircuitFreaks.TileType.DoubleSource, CircuitFreaks.TileType.TripleSource, CircuitFreaks.TileType.BombSource];
            //fill top few rows:
            var rows = Math.floor(this.rows / 2);
            for (var i = 0; i < rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    var typeIdx = Math.floor(Math.random() * types.length);
                    //only add source tiles in last row:
                    if ((i == rows - 1) && typeIdx == 0)
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
                case BoardState.Explode:
                    this.explodeTiles();
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
                    if (this.hasDropTiles())
                        this.setState(BoardState.Drop);
                    else {
                        this.circuitDetector.propagateCircuits();
                        if (this.hasCircuit())
                            this.setState(BoardState.RemoveCircuits);
                        else if (this.hasBombTiles())
                            this.setState(BoardState.Explode);
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
                case BoardState.Explode:
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
        Board.prototype.explodeTiles = function () {
            var explodeLocs = [];
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    var tile = this.slots[i][j];
                    if (tile != null) {
                        if (tile.type == CircuitFreaks.TileType.EnabledBomb) {
                            explodeLocs.push({ x: i, y: j });
                            this.discardTiles.push(tile);
                            tile.setState(CircuitFreaks.TileState.Exploding);
                            this.slots[i][j] = null;
                        }
                    }
                }
            }
            for (var i = 0; i < explodeLocs.length; ++i) {
                var pt = explodeLocs[i];
                for (var dirIdx = 0; dirIdx < 6; ++dirIdx) {
                    var coord = new PIXI.Point(pt.x, pt.y);
                    this.stepCoord(coord, CircuitFreaks.Direction.Up + dirIdx);
                    if (this.isBoardCoord(coord)) {
                        var tile = this.slots[coord.x][coord.y];
                        if (tile != null) {
                            if (tile.circuitEliminatesTile()) {
                                this.discardTiles.push(tile);
                                tile.setState(CircuitFreaks.TileState.Disappearing);
                                this.slots[coord.x][coord.y] = null;
                            }
                            else {
                                tile.filterCircuitFromTile(true);
                            }
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
        Board.prototype.hasBombTiles = function () {
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.columns; ++j) {
                    var tile = this.slots[i][j];
                    if (tile != null) {
                        if (tile.type == CircuitFreaks.TileType.EnabledBomb)
                            return true;
                    }
                }
            }
            return false;
        };
        Board.prototype.hasDropTiles = function () {
            return false;
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
        Board.prototype.getOpenSetCoord = function (pos, set, resultCoord) {
            var n = set.tiles.length;
            var slotHeight = this.tileWidth;
            // let slotWidth = hexWidthFactor * slotHeight;
            // let samplePos = new PIXI.Point(pos.x, pos.y);
            var resultPosition = new PIXI.Point(pos.x, pos.y);
            if (n > 0) {
                var angle = (-.5 + set.cwRotations / 3.0) * Math.PI;
                var offset = (n - 1) * .5 * slotHeight;
                resultPosition.x += Math.cos(angle) * offset;
                resultPosition.y += Math.sin(angle) * offset;
            }
            var coord = this.pointToCoord(resultPosition.x, resultPosition.y);
            resultCoord.x = coord.x;
            resultCoord.y = coord.y;
            var placesAvailable = this.isCoordAvailable(coord);
            for (var i = 0; i < n - 1; ++i) {
                this.stepCoord(coord, set.getDirection());
                placesAvailable = placesAvailable && this.isCoordAvailable(coord);
            }
            return placesAvailable;
        };
        Board.prototype.pushTile = function (pos, set) {
            if (this.state != BoardState.Idle)
                return false;
            var coord = new PIXI.Point(0, 0);
            var placesAvailable = this.getOpenSetCoord(pos, set, coord);
            if (placesAvailable) {
                this.createSnapshot(true);
                var descs = set.getTileDescriptions();
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
        Board.prototype.tryPlaceTile = function (pos, td) {
            var p = this.toLocal(pos, this.parent);
            var coord = this.pointToCoord(p.x, p.y);
            if (!this.isBoardCoord(coord))
                return false;
            var tile = this.slots[coord.x][coord.y];
            var addTile = false;
            if (tile == null) {
                //unit was empty, add tile:
                addTile = true;
                this.tilesLayer.removeChild(tile);
            }
            else if (!tile.getTileDescriptor().equals(td)) {
                //tile to be placed is different:
                addTile = true;
            }
            if (addTile) {
                var t = new CircuitFreaks.Tile(this.tileWidth, td);
                this.tilesLayer.addChild(t);
                t.position = this.toScreenPos(coord.x, coord.y);
                this.slots[coord.x][coord.y] = t;
            }
            return addTile;
        };
        Board.prototype.clearTile = function (pos) {
            var p = this.toLocal(pos, this.parent);
            var coord = this.pointToCoord(p.x, p.y);
            if (!this.isBoardCoord(coord))
                return;
            var tile = this.slots[coord.x][coord.y];
            if (tile) {
                this.tilesLayer.removeChild(tile);
                this.slots[coord.x][coord.y] = null;
            }
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
        function TileSet(tileWidth, types, startDragCallback, startDragListener) {
            var _this = _super.call(this) || this;
            _this.startDragCallback = startDragCallback;
            _this.startDragListener = startDragListener;
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
        TileSet.prototype.hitTestPoint = function (p) {
            return true;
        };
        TileSet.prototype.touchDown = function (p) {
            //...
        };
        TileSet.prototype.touchMove = function (p) {
            //...
            var toPos = new PIXI.Point(p.position.x - p.sourcePosition.x, p.position.y - p.sourcePosition.y);
            if (toPos.x * toPos.x + toPos.y * toPos.y > 10) {
                this.startDragCallback.call(this.startDragListener, this);
            }
        };
        TileSet.prototype.touchUp = function (p) {
            if (p.aliveTime < 0.5)
                this.rotateSet();
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
        TileSet.prototype.drawContourToTarget = function (gr, tileWidth) {
            var n = this.tiles.length;
            // var offset = (n - 1) * .5 * tileWidth;
            var angle = (.5 + this.cwRotations / 3.0) * Math.PI;
            for (var i = 0; i < n; ++i) {
                var currOffset = i * tileWidth;
                var pos = new PIXI.Point(Math.cos(angle) * currOffset, Math.sin(angle) * currOffset);
                gr.beginFill(0xffffff);
                CircuitFreaks.drawHex(gr, pos, tileWidth);
                gr.endFill();
            }
        };
        return TileSet;
    }(PIXI.Container));
    CircuitFreaks.TileSet = TileSet;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var InputPoint = /** @class */ (function () {
        function InputPoint() {
            this.sourcePosition = new PIXI.Point(0, 0);
            this.position = new PIXI.Point(0, 0);
            this.aliveTime = 0;
            this.cancelInput = false;
        }
        InputPoint.prototype.reset = function (x, y) {
            this.sourcePosition.x = x;
            this.sourcePosition.y = y;
            this.position.x = x;
            this.position.y = y;
            this.aliveTime = 0;
            this.cancelInput = false;
        };
        return InputPoint;
    }());
    CircuitFreaks.InputPoint = InputPoint;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>
///<reference path="TileSet.ts"/>
///<reference path="InputListener.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var TilePanel = /** @class */ (function (_super) {
        __extends(TilePanel, _super);
        function TilePanel(startDragCallback, startDragListener) {
            var _this = _super.call(this) || this;
            _this.startDragCallback = startDragCallback;
            _this.startDragListener = startDragListener;
            _this.tileCount = 3;
            _this.tileWidth = 50;
            _this.selectorWidth = 2.1 * _this.tileWidth;
            _this.selector = new PIXI.Graphics();
            _this.selector.lineStyle(5, 0xffffff, 1);
            _this.selector.drawRoundedRect(-_this.selectorWidth / 2.0, -_this.selectorWidth / 2.0, _this.selectorWidth, _this.selectorWidth, .2 * _this.selectorWidth);
            _this.selector.visible = false;
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
            this.setSelectedIndex(this.prevSetIndex);
            var curr = this.nextSets[this.selectedIndex];
            if (curr != null) {
                this.nextTypes.splice(0, 0, curr.types);
                this.removeChild(curr);
            }
            this.nextSets[this.selectedIndex] = this.prevSet;
            this.addChild(this.prevSet);
            this.prevSet = null;
        };
        TilePanel.prototype.getInputListener = function (pos) {
            var locPos = new PIXI.Point(pos.x - this.position.x, pos.y - this.position.y);
            var index = Math.floor(locPos.x / this.selectorWidth + this.tileCount / 2.0);
            if (index < 0 || index >= this.tileCount || Math.abs(locPos.y) > this.selectorWidth / 2.0)
                return null;
            this.setSelectedIndex(index);
            return this.nextSets[index];
        };
        TilePanel.prototype.update = function (dt) {
            for (var i = 0; i < this.nextSets.length; ++i)
                this.nextSets[i].update(dt);
        };
        TilePanel.prototype.resetPanel = function () {
            this.nextTypes = [];
            for (var i = 0; i < this.tileCount; ++i)
                this.changeTileIndex(i);
            this.prevSet = null;
        };
        TilePanel.prototype.changeTile = function (ts) {
            for (var i = 0; i < this.nextSets.length; ++i) {
                if (this.nextSets[i] == ts) {
                    this.changeTileIndex(i);
                    break;
                }
            }
        };
        TilePanel.prototype.changeTileIndex = function (index) {
            if (this.nextSets[index] != null) {
                this.prevSet = this.nextSets[index];
                this.prevSetIndex = index;
                this.removeChild(this.prevSet);
            }
            var tileSet = new CircuitFreaks.TileSet(this.tileWidth, this.getNextType(), this.startDragCallback, this.startDragListener);
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
            this.changeTileIndex(this.selectedIndex);
        };
        TilePanel.prototype.getCurrentTileSet = function () {
            return this.nextSets[this.selectedIndex];
        };
        TilePanel.prototype.getNextType = function () {
            if (this.nextTypes.length == 0) {
                /*
                var topTypes: TileDescriptor[] = [];
                var btmTypes: TileDescriptor[] = [];
                for (var i: number = 0; i < 5; ++i) {
                    for (var it: number = 0; it < 2; ++it) {
                        let d1: Direction = it == 0 ? Direction.Down : Direction.Up;
                        let d2: Direction = (d1 + 1 + i) % 6;
                        let tile = new TileDescriptor(TileType.Path, 0);
                        tile.paths.push(new TilePathDescriptor(d1, d2));
                        if (it == 0)
                            topTypes.push(tile);
                        else
                            btmTypes.push(tile);
                    }
                }

                this.shuffle(btmTypes);

                for (let i in btmTypes)
                    this.nextTypes.push([topTypes[i], btmTypes[i]]);
                    */
                for (var i = 0; i < 3; ++i) {
                    var topTile = new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.Path, 0);
                    topTile.paths.push(new CircuitFreaks.TilePathDescriptor(CircuitFreaks.Direction.Down, (CircuitFreaks.Direction.Down + 2 + i) % 6));
                    for (var j = 0; j < 3 - i; ++j) {
                        var btmTile = new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.Path, 0);
                        btmTile.paths.push(new CircuitFreaks.TilePathDescriptor(CircuitFreaks.Direction.Up, (CircuitFreaks.Direction.Up + 4 - j) % 6));
                        this.nextTypes.push([topTile, btmTile]);
                    }
                }
                // this.nextTypes.push([new TileDescriptor(TileType.Wildcard, 0)]);
                // this.nextTypes.push([new TileDescriptor(TileType.Trash, 0)]);
                /*
                let tripleTile = new TileDescriptor(TileType.Path, 0);
                this.nextTypes.push([tripleTile]);
                for (var i: number = 0; i < 3; ++i) {
                    tripleTile.paths.push(new TilePathDescriptor(2 * i, 2 * i + 1));
                }

                let straightTile = new TileDescriptor(TileType.Path, 0);
                this.nextTypes.push([straightTile]);
                straightTile.paths.push(new TilePathDescriptor(Direction.Up, Direction.Down));
                for (var i: number = 0; i < 2; ++i) {
                    straightTile.paths.push(new TilePathDescriptor(3 * i + 1, 3 * i + 2));
                }

                let doubleTile = new TileDescriptor(TileType.Path, 0);
                this.nextTypes.push([doubleTile]);
                for (var i: number = 0; i < 2; ++i) {
                    doubleTile.paths.push(new TilePathDescriptor(3 * i + 2, (3 * i + 4) % 6));
                }

                for (var i: number = 0; i < 3; ++i) {
                    let baseTile = new TileDescriptor(TileType.Path, 0);
                    this.nextTypes.push([baseTile]);
                    let baseIdx = Math.floor(Math.random() * 6) % 6;
                    baseTile.paths.push(new TilePathDescriptor(baseIdx, (baseIdx + 1 + i) % 6));
                }
                */
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
        function Button(text, func, listener, argument, radius, base_width, base_height) {
            if (argument === void 0) { argument = 0; }
            if (radius === void 0) { radius = 20; }
            if (base_width === void 0) { base_width = 50; }
            if (base_height === void 0) { base_height = 1; }
            var _this = _super.call(this) || this;
            base_width = Math.max(base_width, 1);
            base_height = Math.max(base_height, 1);
            _this.func = func;
            _this.listener = listener;
            _this.argument = argument;
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
        Button.prototype.hitTestPoint = function (p) {
            var toBtn = new PIXI.Point(p.x - this.position.x, p.y - this.position.y);
            return Math.abs(toBtn.x) < this.visWidth / 2 * this.scale.x && Math.abs(toBtn.y) < this.visHeight / 2 * this.scale.y;
        };
        Button.prototype.touchDown = function (p) {
            //OK
        };
        Button.prototype.touchMove = function (p) {
            var toPos = new PIXI.Point(p.position.x - p.sourcePosition.x, p.position.y - p.sourcePosition.y);
            if (toPos.x * toPos.x + toPos.y * toPos.y > 10)
                p.cancelInput = true;
        };
        Button.prototype.touchUp = function (p) {
            this.func.call(this.listener, this.argument);
        };
        return Button;
    }(PIXI.Container));
    CircuitFreaks.Button = Button;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Button.ts"/>
///<reference path="InputListener.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var LevelSelector = /** @class */ (function (_super) {
        __extends(LevelSelector, _super);
        function LevelSelector(w, h, loadLevelCallback, loadLevelListener) {
            var _this = _super.call(this) || this;
            _this.loadLevelCallback = loadLevelCallback;
            _this.loadLevelListener = loadLevelListener;
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
            _this.closeBtn = new CircuitFreaks.Button('✕', _this.close, _this, 0, 30, 0);
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
                    var btn = new CircuitFreaks.Button('' + idx, _this.loadLevel, _this, idx, 10, tileWidth, tileWidth);
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
        LevelSelector.prototype.loadLevel = function (idx) {
            this.loadLevelCallback.call(this.loadLevelListener, idx);
            this.close();
        };
        LevelSelector.prototype.isEnabled = function () {
            return this.visible;
        };
        LevelSelector.prototype.getInputListener = function (p) {
            if (this.closeBtn.hitTestPoint(p))
                return this.closeBtn;
            for (var _i = 0, _a = this.levelButtons; _i < _a.length; _i++) {
                var btn = _a[_i];
                if (btn.hitTestPoint(p)) {
                    return btn;
                }
            }
            return null;
        };
        LevelSelector.prototype.touchDown = function (p) {
            if (this.closeBtn.hitTestPoint(p)) {
                this.close();
                return -1;
            }
            for (var i = 0; i < this.levelButtons.length; ++i) {
                var btn = this.levelButtons[i];
                if (btn.hitTestPoint(p)) {
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
        LevelData.prototype.serialize = function () {
            var result = { rows: this.rows, columns: this.columns, tiles: [] };
            var groups = ["y", "b", "r"];
            for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
                var t = _a[_i];
                var d = "--";
                if (t) {
                    switch (t.type) {
                        case CircuitFreaks.TileType.Source:
                            d = groups[t.groupIndex] + "1";
                            break;
                        case CircuitFreaks.TileType.DoubleSource:
                            d = groups[t.groupIndex] + "2";
                            break;
                        case CircuitFreaks.TileType.TripleSource:
                            d = groups[t.groupIndex] + "3";
                            break;
                        case CircuitFreaks.TileType.BombSource:
                            d = groups[t.groupIndex] + "b";
                            break;
                        case CircuitFreaks.TileType.Blockade:
                            d = "XX";
                            break;
                        case CircuitFreaks.TileType.Trash:
                            d = "##";
                            break;
                    }
                }
                result.tiles.push(d);
            }
            return result;
        };
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
                case 'yb':
                    return new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.BombSource, 0);
                case 'bb':
                    return new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.BombSource, 1);
                case 'rb':
                    return new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.BombSource, 2);
                case '##':
                    return new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.Trash, 0);
                case 'XX':
                    return new CircuitFreaks.TileDescriptor(CircuitFreaks.TileType.Blockade, 0);
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
        LevelData.deserialize = function (index, data) {
            var result = new LevelData(data.rows, data.columns);
            result.index = index;
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
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "scripts/loadLevel.php");
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    // console.log("GO!", this.response);
                    var data = null;
                    try {
                        data = JSON.parse(this.response);
                    }
                    catch (e) {
                        data = null;
                    }
                    if (data) {
                        // console.log("istie dan:", data);
                        var levelData = LevelData.deserialize(index, data);
                        LevelLoader.instance.callback.call(LevelLoader.instance.listener, levelData);
                    }
                    else {
                        var ld = new LevelData(5, 5);
                        ld.index = index;
                        LevelLoader.instance.callback.call(LevelLoader.instance.listener, ld);
                    }
                }
            };
            var formData = new FormData();
            formData.append("index", '' + index);
            xmlhttp.send(formData);
            /*
            this.filePath = "levels/level" + index + ".json";
            let currRes = PIXI.loader.resources[this.filePath];
            if (currRes == undefined) {

                let finish = () => {
                    // let loader = LevelLoader.instance;
                    let data = PIXI.loader.resources[this.filePath].data;
                    if (data) {
                        console.log("istie dan:", data);
                        let levelData = LevelData.deserialize(index, data);
                        this.callback.call(this.listener, levelData);
                    }
                    else {
                        let ld = new LevelData(5, 5);
                        ld.index = index;
                        this.callback.call(this.listener, ld);
                    }
                }

                PIXI.loader.add([this.filePath]);
                PIXI.loader.load(finish);//LevelLoader.loadFinished);
            }
            else {
                let levelData = LevelData.deserialize(index, currRes.data);
                this.callback.call(this.listener, levelData);
            }
            */
        };
        LevelLoader.prototype.saveLevel = function (data, index) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "scripts/storeLevel.php");
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("store result", this.response);
                }
            };
            var formData = new FormData();
            formData.append("data", JSON.stringify(data));
            formData.append("index", '' + index);
            xmlhttp.send(formData);
        };
        return LevelLoader;
    }());
    CircuitFreaks.LevelLoader = LevelLoader;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>
///<reference path="Board.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var TileHoverLayer = /** @class */ (function (_super) {
        __extends(TileHoverLayer, _super);
        function TileHoverLayer() {
            var _this = _super.call(this) || this;
            _this.tileSet = null;
            _this.projectionGraphics = new PIXI.Graphics();
            _this.projectionGraphics.alpha = 0.5;
            _this.addChild(_this.projectionGraphics);
            return _this;
        }
        TileHoverLayer.prototype.startDragging = function (ts, board, tilePanel) {
            if (this.tileSet == null) {
                this.tileSet = new CircuitFreaks.TileSet(board.tileWidth, ts.getTileDescriptions(), null, null);
                this.tileSet.alpha = 0.5;
                this.addChild(this.tileSet);
            }
            this.tileSet.cwRotations = ts.cwRotations;
            this.tileSet.setTypes(ts.getTileDescriptions());
            this.projectionGraphics.clear();
            ts.drawContourToTarget(this.projectionGraphics, board.tileWidth);
            this.board = board;
            this.tilePanel = tilePanel;
            this.callTile = ts;
            this.tileSet.visible = false;
            this.projectionGraphics.visible = false;
            this.visible = true;
        };
        TileHoverLayer.prototype.hitTestPoint = function (p) {
            return true;
        };
        TileHoverLayer.prototype.getDropLoc = function (p) {
            if (this.board == null)
                return p;
            return new PIXI.Point(p.x - this.board.position.x, p.y - this.board.position.y);
        };
        TileHoverLayer.prototype.touchDown = function (p) {
            //...
        };
        TileHoverLayer.prototype.touchMove = function (p) {
            //...
            this.tileSet.position.x = p.position.x;
            this.tileSet.position.y = p.position.y;
            this.tileSet.visible = true;
            var dropLoc = this.getDropLoc(p.position);
            var resultCoord = new PIXI.Point(0, 0);
            if (this.board.getOpenSetCoord(dropLoc, this.tileSet, resultCoord)) {
                var pos = this.board.toScreenPos(resultCoord.x, resultCoord.y);
                this.projectionGraphics.x = pos.x + this.board.position.x;
                this.projectionGraphics.y = pos.y + this.board.position.y;
                this.projectionGraphics.visible = true;
            }
            else {
                this.projectionGraphics.visible = false;
            }
        };
        TileHoverLayer.prototype.touchUp = function (p) {
            if (this.board.pushTile(this.getDropLoc(p.position), this.tileSet)) {
                this.tilePanel.changeTile(this.callTile);
            }
            this.visible = false;
        };
        return TileHoverLayer;
    }(PIXI.Container));
    CircuitFreaks.TileHoverLayer = TileHoverLayer;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Tile.ts"/>
///<reference path="Button.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var EditorPanel = /** @class */ (function (_super) {
        __extends(EditorPanel, _super);
        function EditorPanel() {
            var _this = _super.call(this) || this;
            _this.types = [
                CircuitFreaks.TileType.Source,
                CircuitFreaks.TileType.DoubleSource,
                CircuitFreaks.TileType.TripleSource,
                CircuitFreaks.TileType.BombSource,
                CircuitFreaks.TileType.Blockade,
                CircuitFreaks.TileType.Trash
            ];
            _this.btns = [];
            _this.groupIndex = 0;
            _this.tileBtns = [];
            _this.rows = 0;
            _this.columns = 0;
            _this.levelIndex = -1;
            _this.tileIndex = 0;
            EditorPanel.instance = _this;
            _this.tileSelector = new PIXI.Graphics();
            _this.addChild(_this.tileSelector);
            _this.tileSelector.beginFill(0xffffff, 0.5);
            _this.tileSelector.drawCircle(0, 0, 20);
            var funcs = [
                function () { _this.rows--; _this.sizeChanged(); },
                function () { _this.rows++; _this.sizeChanged(); },
                function () { _this.columns--; _this.sizeChanged(); },
                function () { _this.columns++; _this.sizeChanged(); }
            ];
            //add row/col buttons:
            for (var i = 0; i < 2; ++i) {
                var y = (i - .5) * 30;
                for (var j = 0; j < 2; ++j) {
                    var idx = i * 2 + j;
                    var btn = new CircuitFreaks.Button(j == 0 ? "-" : "+", funcs[idx], _this, 0, 10, 30, 30);
                    btn.x = -200 + j * 80;
                    btn.y = y;
                    btn.scale = new PIXI.Point(.5, .5);
                    _this.addChild(btn);
                    _this.btns.push(btn);
                }
                var lbl = new PIXI.Text(i == 0 ? "rows" : "cols");
                lbl.style.fontFamily = "groboldregular";
                lbl.style.fontSize = 16;
                lbl.style.fill = 0xffffff;
                lbl.anchor.set(0.5, 0.5);
                lbl.x = -160;
                lbl.y = y;
                _this.addChild(lbl);
            }
            var names = ["group", "store"];
            var opts = [
                _this.changeGroup,
                _this.store
            ];
            //add operation buttons:
            for (var i = 0; i < opts.length; ++i) {
                var btn = new CircuitFreaks.Button(names[i], opts[i], _this, 0, 10, 120, 30);
                btn.x = 180 + Math.floor(i / 2) * 60;
                btn.y = (Math.floor(i % 2) - Math.floor(opts.length / 2.0) * .5) * 30;
                btn.scale = new PIXI.Point(.5, .5);
                _this.addChild(btn);
                _this.btns.push(btn);
            }
            _this.updateTiles();
            _this.levelText = new PIXI.Text();
            _this.levelText.style.fontFamily = "groboldregular";
            _this.levelText.style.fontSize = 16;
            _this.levelText.style.fill = 0xffffff;
            _this.levelText.anchor.set(0.5, 0.5);
            _this.levelText.x = -100;
            _this.levelText.y = -40;
            _this.addChild(_this.levelText);
            _this.setLevelIndex(-1);
            _this.setTileIndex(0);
            return _this;
        }
        EditorPanel.prototype.store = function () {
            var data = this.serializeBoard();
            CircuitFreaks.LevelLoader.instance.saveLevel(data, this.levelIndex);
        };
        EditorPanel.prototype.setLevelIndex = function (idx) {
            this.levelText.text = "level: " + idx;
            this.levelIndex = idx;
        };
        EditorPanel.prototype.changeGroup = function () {
            this.groupIndex = (this.groupIndex + 1) % 3;
            this.updateTiles();
        };
        EditorPanel.prototype.updateTiles = function () {
            for (var _i = 0, _a = this.tileBtns; _i < _a.length; _i++) {
                var t = _a[_i];
                this.removeChild(t);
            }
            this.tileBtns = [];
            for (var i = 0; i < this.types.length; ++i) {
                var td = new CircuitFreaks.TileDescriptor(this.types[i], this.groupIndex);
                var tile = new CircuitFreaks.Tile(30, td);
                tile.x = 20 + (i - (this.types.length - 1) / 2.0) * 30;
                tile.y = (i % 2) * 20;
                this.addChild(tile);
                this.tileBtns.push(tile);
            }
        };
        EditorPanel.prototype.getTileDescriptor = function () {
            return this.tileBtns[this.tileIndex].getTileDescriptor();
        };
        EditorPanel.prototype.hitTestPoint = function (p) {
            return true;
        };
        EditorPanel.prototype.setTileIndex = function (idx) {
            this.tileIndex = idx;
            this.tileSelector.position = this.tileBtns[idx].position;
        };
        EditorPanel.prototype.touchDown = function (p) {
            var pt = this.toLocal(p.position, this.parent);
            for (var _i = 0, _a = this.btns; _i < _a.length; _i++) {
                var b = _a[_i];
                if (b.hitTestPoint(pt)) {
                    b.touchUp(p);
                    break;
                }
            }
            //change button selection:
            for (var i = 0; i < this.tileBtns.length; ++i) {
                var b = this.tileBtns[i];
                var toPt = b.toLocal(pt, this);
                if (Math.sqrt(toPt.x * toPt.x + toPt.y * toPt.y) < 20) {
                    this.setTileIndex(i);
                    break;
                }
            }
            this.dropTile(p);
        };
        EditorPanel.prototype.touchMove = function (p) {
            this.dropTile(p);
        };
        EditorPanel.prototype.touchUp = function (p) {
        };
        EditorPanel.eraseMode = false;
        return EditorPanel;
    }(PIXI.Container));
    CircuitFreaks.EditorPanel = EditorPanel;
})(CircuitFreaks || (CircuitFreaks = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Board.ts"/>
///<reference path="Tile.ts"/>
///<reference path="TilePanel.ts"/>
///<reference path="Button.ts"/>
///<reference path="LevelSelector.ts"/>
///<reference path="LevelLoader.ts"/>
///<reference path="TileHoverLayer.ts"/>
///<reference path="EditorPanel.ts"/>
var CircuitFreaks;
(function (CircuitFreaks) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(w, h) {
            var _this = _super.call(this) || this;
            _this.editMode = false;
            var background = new PIXI.Graphics();
            background.beginFill(0x00ff00, 0.5);
            background.drawRect(0, 0, w, h);
            background.endFill();
            _this.addChild(background);
            _this.tilePanel = new CircuitFreaks.TilePanel(_this.startDragTileSet, _this);
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
                var btn = new CircuitFreaks.Button(txts[i], callbacks[i], _this, i);
                btn.x = w * (i + 1) / 4.0;
                btn.y = h * .05;
                _this.addChild(btn);
                _this.buttons.push(btn);
            }
            _this.levelLoader = new CircuitFreaks.LevelLoader(_this.loadLevel, _this);
            _this.levelSelector = new CircuitFreaks.LevelSelector(w, h, CircuitFreaks.LevelLoader.instance.loadLevel, CircuitFreaks.LevelLoader.instance);
            _this.addChild(_this.levelSelector);
            _this.tileHoverLayer = new CircuitFreaks.TileHoverLayer();
            _this.addChild(_this.tileHoverLayer);
            _this.inputPoint = new CircuitFreaks.InputPoint();
            _this.editorPanel = new CircuitFreaks.EditorPanel();
            _this.editorPanel.x = w / 2.0;
            _this.editorPanel.y = h * .9;
            _this.addChild(_this.editorPanel);
            _this.editorPanel.visible = false;
            _this.editorPanel.sizeChanged = function () {
                _this.board.setBoardSize(_this.editorPanel.rows, _this.editorPanel.columns);
            };
            _this.editorPanel.dropTile = function (p) {
                if (CircuitFreaks.EditorPanel.eraseMode)
                    _this.board.clearTile(p.position);
                else
                    _this.board.tryPlaceTile(p.position, _this.editorPanel.getTileDescriptor());
            };
            _this.editorPanel.serializeBoard = function () {
                return _this.board.serializeBoard();
            };
            _this.loadDefault();
            return _this;
        }
        Game.prototype.toggleEditor = function () {
            this.editMode = !this.editMode;
            this.tilePanel.visible = !this.editMode;
            this.editorPanel.visible = this.editMode;
        };
        Game.prototype.updateEditorPanel = function () {
            this.editorPanel.rows = this.board.rows;
            this.editorPanel.columns = this.board.columns;
        };
        Game.prototype.loadLevel = function (data) {
            this.resetGame();
            if (data)
                this.board.loadBoard(data);
            else
                this.board.resetBoard();
            this.updateEditorPanel();
            this.editorPanel.setLevelIndex(data.index);
        };
        Game.prototype.openLevelSelect = function () {
            this.levelSelector.show();
        };
        Game.prototype.resetGame = function () {
            this.board.clearBoard();
            this.tilePanel.resetPanel();
            this.board.createSnapshot(false);
            this.updateEditorPanel();
        };
        Game.prototype.loadDefault = function () {
            this.resetGame();
            this.board.resetBoard();
            this.tilePanel.resetPanel();
            this.board.createSnapshot(false);
            this.updateEditorPanel();
        };
        Game.prototype.undo = function () {
            if (this.board.tileWasPushedTMP)
                this.tilePanel.undo();
            this.board.undo();
        };
        Game.prototype.update = function (dt) {
            this.board.update(dt);
            this.tilePanel.update(dt);
            if (this.currentInputListener != null)
                this.inputPoint.aliveTime += dt;
        };
        Game.prototype.getInputListenerAt = function (p) {
            if (this.levelSelector.isEnabled())
                return this.levelSelector.getInputListener(p);
            for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
                var btn = _a[_i];
                if (btn.hitTestPoint(p))
                    return btn;
            }
            if (this.editMode)
                return this.editorPanel;
            return this.tilePanel.getInputListener(p);
            // var locPos = new PIXI.Point(p.x - this.tilePanel.position.x, p.y - this.tilePanel.position.y);
            // if(this.tilePanel.select(locPos))
            //     return;
            // //push random tile to board:
            // locPos = new PIXI.Point(p.x - this.board.position.x, p.y - this.board.position.y);
            // if(this.board.pushTile(locPos, this.tilePanel.getCurrentTileSet())) {
            //     this.tilePanel.changeCurrentTile();
            // }
        };
        Game.prototype.touchDown = function (p) {
            this.currentInputListener = this.getInputListenerAt(p);
            this.inputPoint.reset(p.x, p.y);
            if (this.currentInputListener != null) {
                this.inputPoint.reset(p.x, p.y);
                this.currentInputListener.touchDown(this.inputPoint);
            }
            if (this.inputPoint.cancelInput)
                this.currentInputListener = null;
        };
        Game.prototype.touchMove = function (p) {
            if (this.currentInputListener != null) {
                this.inputPoint.position.x = p.x;
                this.inputPoint.position.y = p.y;
                this.currentInputListener.touchMove(this.inputPoint);
                if (this.inputPoint.cancelInput)
                    this.currentInputListener = null;
            }
            // let locPos = new PIXI.Point(p.x - this.board.position.x, p.y - this.board.position.y);
            // this.board.dragTo(locPos);
        };
        Game.prototype.touchUp = function (p) {
            if (this.currentInputListener != null) {
                this.inputPoint.position.x = p.x;
                this.inputPoint.position.y = p.y;
                this.currentInputListener.touchUp(this.inputPoint);
                this.currentInputListener = null;
            }
            // let locPos = new PIXI.Point(p.x - this.board.position.x, p.y - this.board.position.y);
            // this.board.dragEnd(locPos);
        };
        Game.prototype.startDragTileSet = function (set) {
            this.tileHoverLayer.startDragging(set, this.board, this.tilePanel);
            this.currentInputListener = this.tileHoverLayer;
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
            this.touchPoints = [];
            this.debugText = new PIXI.Text('');
            this.debugText.x = 20;
            this.debugText.y = 10;
            this.game.addChild(this.debugText);
            this.debugGraphics = new PIXI.Graphics();
            this.game.addChild(this.debugGraphics);
        };
        GameContainer.prototype.keyDown = function (key) {
            // console.log(key);
            switch (key) {
                case 127:
                    this.game.toggleEditor();
                    break;
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
            CircuitFreaks.EditorPanel.eraseMode = event.data.button == 2;
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
document.addEventListener('contextmenu', function (event) { if (CircuitFreaks.EditorPanel.instance.visible) {
    event.preventDefault();
} });
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
