///<reference path="../../../pixi/pixi.js.d.ts"/>

module CircuitFreaks
{
    export class InputPoint {
        sourcePosition:PIXI.Point;
        position:PIXI.Point;
        aliveTime:number;
        cancelInput:boolean;

        constructor() {
            this.sourcePosition = new PIXI.Point(0,0);
            this.position = new PIXI.Point(0,0);
            this.aliveTime = 0;
            this.cancelInput = false;
        }

        reset(x:number, y:number) {
            this.sourcePosition.x = x;
            this.sourcePosition.y = y;
            this.position.x = x;
            this.position.y = y;
            this.aliveTime = 0;
            this.cancelInput = false;
        }
    }


    export interface InputListener {
        hitTestPoint(p:PIXI.Point) : boolean;
        touchDown(p:InputPoint);
        touchMove(p:InputPoint);
        touchUp(p:InputPoint);
    }
}