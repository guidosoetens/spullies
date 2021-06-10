///<reference path="../../../pixi/pixi.js.d.ts"/>

module LividLair {
    export let APP_WIDTH: number = 1280;
    export let APP_HEIGHT: number = 720;
    export let ROOM_DEBUG: boolean = false;
    export let GRID_UNIT_SIZE = 80.0;
    export let PLAYER_WIDTH = .6 * GRID_UNIT_SIZE;
    export let LADDER_WIDTH = .6 * GRID_UNIT_SIZE;
    export let PLAYER_HEIGHT = .8 * GRID_UNIT_SIZE;
    export let GRID_INCLUDE_DIVISION = true;
    export let CLOSE_WALLS = false;
    export let SNAP_CAMERA = true;//false;
    // export const BALL_RADIUS:number = .999 * GRID_UNIT_SIZE;//25.0;
    export let DEBUG_MODE: boolean = false;
    export let ROOM_TILE_ROWS = 8;
    export let ROOM_TILE_COLUMNS = 15;//10;
    export let OUTER_BORDER_TILE_COUNT = 2;

    export var GLOBAL_SCENE: PIXI.DisplayObject;
    export let CTRL_PRESSED: boolean = false;

    export function clamp(n: number, floor: number = 0, ceil: number = 1) {
        return Math.max(floor, Math.min(ceil, n));
    }

    export function shuffle(array: any[]) {
        let result = [...array];
        for (var i = result.length - 1; i > 0; i--) {
            // Generate random number 
            var j = Math.floor(Math.random() * (i + 1));
            var temp = result[i];
            result[i] = result[j];
            result[j] = temp;
        }
        return result;
    }

    export function randomIndex(excl_n: number): number {
        return Math.min(excl_n - 1, Math.floor(Math.random() * excl_n));
    }
}
