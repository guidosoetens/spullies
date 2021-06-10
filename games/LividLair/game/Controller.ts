///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>

module LividLair {

    export enum ControllerButton {
        A = 0, B, X, Y,
        LB, RB, LT, RT,
        BACK, START,
        LS, RS,
        Up, Down, Left, Right,
        HOME,
        Count
    };

    export class Controller {

        static keyboard: any = {};
        static keyDown(key: number) { this.keyboard[key] = true; }
        static keyUp(key: number) { this.keyboard[key] = false; }
        static isKeyDown(key: number) {
            if (Controller.keyboard[key] !== undefined)
                return Controller.keyboard[key];
            return false;
        }

        pressed: boolean[];
        justPressed: boolean[];
        leftAxis: Point;
        rightAxis: Point;

        constructor() {
            this.leftAxis = new Point(0, 0);
            this.rightAxis = new Point(0, 0);
            this.pressed = [];
            this.justPressed = [];
            for (var i: number = 0; i < ControllerButton.Count; ++i) {
                this.pressed.push(false);
                this.justPressed.push(false);
            }
        }

        setAxis(axis: Point, x: number, y: number) {
            axis.x = x;
            axis.y = y;
            let len = axis.length();
            if (len < .3)
                axis.x = axis.y = 0;
        }

        getDirection(): Point {
            let result = this.leftAxis.clone();
            if (this.pressed[ControllerButton.Left])
                result.x = -1;
            else if (this.pressed[ControllerButton.Right])
                result.x = 1;
            else if (this.pressed[ControllerButton.Up])
                result.y = -1;
            else if (this.pressed[ControllerButton.Down])
                result.y = 1;
            // result = result.normalize();

            if (Math.abs(result.x) < .4) {
                result.x = 0;
            }

            // if (Math.abs(result.x) > Math.abs(result.y))
            //     result.y = 0
            // else
            //     result.x = 0;

            return result;
        }

        update() {

            var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            if (gamepads.length == 0)
                return;

            var gp = gamepads[0];
            if (!gp)
                return;

            this.setAxis(this.leftAxis, gp.axes[0], gp.axes[1]);
            this.setAxis(this.rightAxis, gp.axes[2], gp.axes[3]);

            for (var i: number = 0; i < ControllerButton.Count; ++i) {
                let p = gp.buttons[i] ? gp.buttons[i].pressed : false;
                this.justPressed[i] = p && !this.pressed[i];
                this.pressed[i] = p;
            }
        }
    }
}