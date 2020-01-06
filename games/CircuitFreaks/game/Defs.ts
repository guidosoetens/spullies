///<reference path="../../../pixi/pixi.js.d.ts"/>

module CircuitFreaks
{
    export enum TileType {
        Curve_NE = 0,
        Curve_NW,
        Curve_SE,
        Curve_SW,
        Straight_H,
        Straight_V,
        Double_NE,
        Double_NW,
        Source,
        DoubleSource,
        Blockade,
        Trash,
        Count
    }

    export function rotateTypeCW(type:TileType) : TileType {
        switch(type) {
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
        Down,
        Left,
        Right
    }
}
