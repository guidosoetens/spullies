///<reference path="../../../pixi/pixi.js.d.ts"/>

module Magneon
{
    export let APP_WIDTH = 800;
    export let APP_HEIGHT = 600;
    export let GRID_UNIT_SIZE = 25.0;
    export const BALL_RADIUS:number = .999 * GRID_UNIT_SIZE;//25.0;
    export var DEBUG_MODE:boolean = false;

    export var GLOBAL_SCENE:PIXI.DisplayObject;
    export var CTRL_PRESSED:boolean = false;

    export function clamp(n:number, floor:number = 0, ceil:number=1) {
        return Math.max(floor, Math.min(ceil, n));
    }

}
