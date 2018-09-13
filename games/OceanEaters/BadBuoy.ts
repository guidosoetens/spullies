///<reference path="../../pixi/pixi.js.d.ts"/>

module OceanEaters
{
    function HSVtoRGB(h, s, v):number {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return Math.round(r * 255) * 256 * 256 + Math.round(g * 255) * 256 + Math.round(b * 255);
    }

    export class BadBuoy extends PIXI.Graphics {

        relativePosition:PIXI.Point;
        index:number;

        constructor(x:number, y:number, index:number) {
            super();

            this.index = index;

            var clr = (x < .2 && y < .2) ? 0xff0000 : 0x00ff00;

            var width = 150;
            var height = 350;
            var rad = Math.min(width, height) * .25;

            this.beginFill(0x0, .2);
            this.drawEllipse(0,0,.6 * width, .1 * width);

            clr = HSVtoRGB(Math.random(), 1, 1);

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