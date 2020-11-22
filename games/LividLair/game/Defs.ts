///<reference path="../../../pixi/pixi.js.d.ts"/>

module LividLair {
    export let APP_WIDTH: number = 1280;
    export let APP_HEIGHT: number = 800;
    export let ROOM_DEBUG: boolean = false;
    export let ROOM_COUNT: number = 7;
    export let GRID_UNIT_SIZE = 100.0;
    export let PLAYER_WIDTH = .5 * GRID_UNIT_SIZE;
    export let LADDER_WIDTH = .6 * GRID_UNIT_SIZE;
    export let PLAYER_HEIGHT = .5 * GRID_UNIT_SIZE;
    // export const BALL_RADIUS:number = .999 * GRID_UNIT_SIZE;//25.0;
    export var DEBUG_MODE: boolean = false;

    export var GLOBAL_SCENE: PIXI.DisplayObject;
    export var CTRL_PRESSED: boolean = false;

    export function clamp(n: number, floor: number = 0, ceil: number = 1) {
        return Math.max(floor, Math.min(ceil, n));
    }

}
