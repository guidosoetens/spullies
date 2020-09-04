///<reference path="../../../pixi/pixi.js.d.ts"/>

module CircuitFreaks
{
    export enum TileType {
        Path = 0,
        Source,
        DoubleSource,
        TripleSource,
        BombSource,
        EnabledBomb,
        Blockade,
        Trash,
        Wildcard,
        Count
    }

    export class TilePathDescriptor {
        //outward directions:
        dir1:Direction;
        dir2:Direction;

        constructor(d1:Direction, d2:Direction) {
            this.dir1 = d1;
            this.dir2 = d2;
        }

        rotateCW() {
            this.dir1 = rotateCW(this.dir1);
            this.dir2 = rotateCW(this.dir2);
        }
    }

    export class TileDescriptor {
        type:TileType;
        groupIndex:number;
        paths:TilePathDescriptor[];

        constructor(type:TileType, groupIndex:number) {
            this.type = type;
            this.groupIndex = groupIndex;
            this.paths = [];
        }

        rotateCW() {
            for(let p of this.paths)
                p.rotateCW();
        }
    }

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

    export function rotateTypeCW(type:TileType) : TileType {
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

    export let hexWidthFactor = 1.5 / Math.tan(Math.PI / 3.0);

    export function drawHex(gr:PIXI.Graphics, center:PIXI.Point, unitWidth:number) {

        let halfHeight = .5 * unitWidth;
        let baseUnit = unitWidth * hexWidthFactor / 3.0;// halfHeight / Math.tan(Math.PI / 3.0);
        let baseUnit2 = 2 * baseUnit;

        gr.moveTo(center.x + baseUnit2, center.y);
        gr.lineTo(center.x + baseUnit, center.y + halfHeight);
        gr.lineTo(center.x - baseUnit, center.y + halfHeight);
        gr.lineTo(center.x - baseUnit2, center.y);
        gr.lineTo(center.x - baseUnit, center.y - halfHeight);
        gr.lineTo(center.x + baseUnit, center.y - halfHeight);
        gr.lineTo(center.x + baseUnit2, center.y);
    }

    export function rotateTypeCCW(type:TileType) : TileType {
        // :)
        return rotateTypeCW(rotateTypeCW(rotateTypeCW(type)));
    }

    export function easeBounceOut(t:number) {
        t = Math.max(Math.min(t, 1), 0);
        if (t < (1/2.75)) {
            return 1*(7.5625*t*t);
        } else if (t < (2/2.75)) {
            return 1*(7.5625*(t-=(1.5/2.75))*t + .75);
        } else if (t < (2.5/2.75)) {
            return 1*(7.5625*(t-=(2.25/2.75))*t + .9375);
        } else {
            return 1*(7.5625*(t-=(2.625/2.75))*t + .984375);
        }
        return 1;
    }

    export function easeOutElastic(t:number) {
        var s=1.70158;var p=0;var a=1;
        if (t==0) return 0;  if ((t/=1)==1) return 1;  if (!p) p=1*.3;
        if (a < Math.abs(1)) { a=1; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (1/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*1-s)*(2*Math.PI)/p ) + 1;
    }

    export class Coord {
        row:number;
        column:number;
    }

    export enum Direction {
        Up = 0,
        UpRight,
        DownRight,
        Down,
        DownLeft,
        UpLeft
    }

    export function cwRotationsTo(d1:Direction, d2:Direction) {
        let delta = d2 - d1;
        if(delta < 0)
            return 6 + delta;
        return delta; 
    }

    export function rotateCW(dir:Direction) : Direction {
        return (dir + 1) % 6;
    }

    export function getOppositeDir(dir:Direction) : Direction {
        switch(dir) {
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
}
