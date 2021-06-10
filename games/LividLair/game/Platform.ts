///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>

module LividLair {

    export class Platform extends GameObject {

        constructor() {
            super(GRID_UNIT_SIZE, GRID_UNIT_SIZE);
            let hw = GRID_UNIT_SIZE / 2;
            this.beginFill(0x00aaff, 1);
            this.drawRect(-hw, -hw, GRID_UNIT_SIZE, GRID_UNIT_SIZE * .1);
            this.beginFill(0x00aaff, 0.5);
            this.moveTo(-hw, -hw);
            this.bezierCurveTo(-hw, 0, hw, 0, hw, -hw);
            this.endFill();
        }
    }
}