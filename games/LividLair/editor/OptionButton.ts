///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="../game/Point.ts"/>
///<reference path="../game/Defs.ts"/>
///<reference path="Defs.ts"/>

module LividLair {

    export class OptionButton extends PIXI.Container {

        func: Function;
        label: PIXI.Text;

        constructor(txt: string, func: Function) {
            super();

            this.func = func;

            let gr = new PIXI.Graphics();
            gr.lineStyle(2, 0xffffff);
            gr.beginFill(0x55aa55);
            gr.drawRoundedRect(-20, -20, 40, 40, 5);
            gr.lineStyle(0);
            gr.beginFill(0xaaffaa);
            gr.drawRoundedRect(-15, -15, 30, 30, 5);
            this.addChild(gr);

            this.label = new PIXI.Text(txt);
            this.label.x = 0;
            this.label.y = -8;
            this.label.style.fill = 0xffffff;
            this.label.style.fontSize = 12;
            this.addChild(this.label);
        }

        hitTestPoint(p: Point): boolean {
            return Math.abs(p.x) < 20 && Math.abs(p.y) < 20;
        }
    }
}