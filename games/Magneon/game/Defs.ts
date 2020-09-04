///<reference path="../../../pixi/pixi.js.d.ts"/>

module Magneon
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

    export let APP_WIDTH = 600;
    export let APP_HEIGHT = 800;

    export const BALL_RADIUS:number = 25.0;


    export var DEBUG_MODE:boolean = false;

    export function clamp(n:number, floor:number = 0, ceil:number=1) {
        return Math.max(floor, Math.min(ceil, n));
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

    export class Coord {
        row:number;
        column:number;
    }
}
