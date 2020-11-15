///<reference path="../../../../pixi/pixi.js.d.ts"/>
///<reference path="../Level.ts"/>

module Magneon
{
    export class EditorNode extends PIXI.Graphics {
        constructor(gridX:number, gridY:number) {
            super();
            
            this.beginFill(0xffff00);
            this.lineStyle(2, 0xaaaa00);
            this.drawCircle(0,0,10);
            this.drawCircle(0,0,5);
            this.endFill();

            this.setPosition(gridX, gridY);
        }

        setPosition(gridX:number, gridY:number) {
            this.x = gridX * GRID_UNIT_SIZE;
            this.y = gridY * GRID_UNIT_SIZE;
        }

        getGridPos() : Point {
            return new Point(Math.round(this.x / GRID_UNIT_SIZE), Math.round(this.y / GRID_UNIT_SIZE));
        }
    }
}