///<reference path="../../../../pixi/pixi.js.d.ts"/>

module Magneon
{
    export class SquareButton extends PIXI.Container {

        data:any;
        callback:Function;

        constructor(txt:string, clr:number) {
            super();
            
            let gr = new PIXI.Graphics();
            gr.beginFill(0x0, .2);
            gr.lineStyle(4, clr, 1);
            gr.drawRoundedRect(-40,-40,80,80,15);
            gr.endFill();
            this.addChild(gr);

            let tb = new PIXI.Text(txt);
            tb.style.fontFamily = 'Title Font';
            tb.style.fill = clr;
            tb.style.fontWeight = 'bold';
            tb.style.fontSize = txt.length < 3 ? 50 : 20;//(4 - txt.length) * 20;
            tb.anchor.set(0.5);
            // tb.pivot.x = .5;
            // tb.pivot.y = .5;
            // tb.x = -tb.width / 2;
            // tb.y = -tb.height / 2;
            this.addChild(tb);
        }

        hitTestPoint(p:PIXI.Point) : boolean {
            p = this.toLocal(p, GLOBAL_SCENE);
            return Math.abs(p.x) < 40 && Math.abs(p.y) < 40;
        }
    }
}