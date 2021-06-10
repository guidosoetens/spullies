///<reference path="../../../../pixi/pixi.js.d.ts"/>

module LividLair {

    export class Heart extends PIXI.Graphics {

        isFull: boolean = true;

        constructor() {
            super();

            let drawHeart = (gr: PIXI.Graphics, w: number) => {
                let hw = w / 2;
                let mid_y = -hw * .4;
                let side_y = -hw * .3;
                gr.moveTo(0, mid_y);
                gr.bezierCurveTo(0, -hw, -hw, -hw, -hw, side_y);
                gr.bezierCurveTo(-hw, hw * .25, -hw, hw * .25, 0, hw);
                gr.bezierCurveTo(hw, hw * .25, hw, hw * .25, hw, side_y);
                gr.bezierCurveTo(hw, -hw, 0, -hw, 0, mid_y);
                gr.closePath();
                gr.endFill();
            };

            this.lineStyle(8, 0x880000);
            this.beginFill(0x0);
            drawHeart(this, 20);
            this.lineStyle(1, 0xaa0000);
            this.beginFill(0xff0000);
            drawHeart(this, 20);
            this.lineStyle(0);
            this.beginFill(0xffffff, .5);
            this.drawCircle(5, -5, 3);
        }
    }
}