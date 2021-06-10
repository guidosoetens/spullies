///<reference path="../../../../pixi/pixi.js.d.ts"/>
///<reference path="Heart.ts"/>

module LividLair {

    export class Hud extends PIXI.Graphics {

        maxHearts: number = 4;
        hearts: number = 4;

        constructor() {
            super();

            this.clear();
            this.beginFill(0x0, .3);
            this.drawRoundedRect(10, 10, 200, 40, 5);

            for (let i = 0; i < 5; ++i) {
                let h = new Heart();
                h.x = 10 + (i + .5) * 35;
                h.y = 30;
                this.addChild(h);
            }
        }

        update(dt: number) {
            this.redraw();
        }

        redraw() {
            this.clear();

        }
    }
}