///<reference path="../../pixi/pixi.js.d.ts"/>

module OceanEaters
{
    export class BadBuoy extends PIXI.Graphics {

        relativePosition:PIXI.Point;
        index:number;

        constructor(x:number, y:number, index:number) {
            super();

            this.index = index;

            var clr = (x < .2 && y < .2) ? 0xff0000 : 0x00ff00;

            var width = 80;
            var height = 120;
            var rad = Math.min(width, height) * .25;

            this.beginFill(0x0, .2);
            this.drawEllipse(0,0,.6 * width, .1 * width);

            this.beginFill(clr, 1);
            this.lineStyle(.1 * width, 0x0, 1);
            this.drawRoundedRect(-width/2,-height,width,height,rad);
            this.drawEllipse(0,0,5,5);
            this.endFill();

            this.relativePosition = new PIXI.Point(x, y);

            var style = { font: (height * .4) + "px Arial", fill: "#ffffff", align: "center" };

            // var text = game.make.text(0, -height / 2, "" + this.index, style);
            // text.anchor.set(0.5);
            // this.graphics.addChild(text);

            this.updateRender(x * 200, y * 200, 1, 1);
        }

        updateRender(x:number, y:number, s:number, alpha:number) {
            this.position.x = x;
            this.position.y = y;
            this.alpha = alpha;
            this.scale.x = s;
            this.scale.y = s;
        }

        updateFrame(dt:number) {
            
        }
    }
}