///<reference path="../../../pixi/pixi.js.d.ts"/>

module ActiveHues
{
    export abstract class UserControl extends PIXI.Container {

        sizeX:number;
        sizeY:number;

        constructor(w:number, h:number) {
            super();
            this.width = w;
            this.height = h;

            this.sizeX = w;
            this.sizeY = h;
        }

        abstract touchDown(p:PIXI.Point);
        abstract touchMove(p:PIXI.Point);
        abstract touchUp(p:PIXI.Point);
    }
}