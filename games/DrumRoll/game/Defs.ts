///<reference path="../../../pixi/pixi.js.d.ts"/>

module DrumRollGame {
    export let APP_WIDTH = 800;
    export let APP_HEIGHT = 800;
    export let GRID_UNIT_SIZE = 25.0;
    export const BALL_RADIUS: number = .999 * GRID_UNIT_SIZE;//25.0;
    export var DEBUG_MODE: boolean = true;

    export var GLOBAL_SCENE: PIXI.DisplayObject;
    export var CTRL_PRESSED: boolean = false;

    export var ROLL_DRUM_MODE: boolean = true;

    export function clamp(n: number, floor: number = 0, ceil: number = 1) {
        return Math.max(floor, Math.min(ceil, n));
    }

}
