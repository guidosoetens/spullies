///<reference path="../../pixi/pixi.js.d.ts"/>

module OceanEaters
{
    export class CollectibleVisual extends PIXI.Container {

        hue:number;

        topGraphics:PIXI.Graphics;
        bottomGraphics:PIXI.Graphics;
        ringGraphics:PIXI.Graphics;

        constructor(hue:number) {
            super();

            this.topGraphics = new PIXI.Graphics();
            this.addChild(this.topGraphics);

            this.bottomGraphics = new PIXI.Graphics();
            this.addChild(this.bottomGraphics);

            this.ringGraphics = new PIXI.Graphics();
            this.addChild(this.ringGraphics);

            this.resetGraphics(hue);
        }

        resetGraphics(hue:number) {

            this.hue = hue;

            this.topGraphics.clear();
            this.topGraphics.lineStyle(3, 0xaaaaaa);
            this.topGraphics.beginFill(0xffffff, 1);
            this.topGraphics.moveTo(-20,0);
            this.topGraphics.bezierCurveTo(-20,-20, -5,-20,0,-20);
            this.topGraphics.bezierCurveTo(5,-20, 20,-20,20,0);
            var teeth = 4;
            for(var i:number=0; i<teeth; ++i) {
                var x = 20 - 40 * (i + 1) / (teeth);
                this.topGraphics.lineTo(x,5 * ((i + 1) % 2));
            }

            //draw top:
            this.topGraphics.beginFill(0xaaaaaa, 1);
            this.topGraphics.drawEllipse(0,-22,5,2);

            //draw eyes:
            this.topGraphics.lineStyle(3, 0x0);
            this.topGraphics.beginFill(0x0, 1);
            this.topGraphics.drawCircle(-10,-8,2);
            this.topGraphics.drawCircle(10,-8,2);

            //draw mouth:
            this.topGraphics.lineStyle(3, 0xff0000);
            this.topGraphics.beginFill(0xffaaaa, 1);
            this.topGraphics.moveTo(-2,-5);
            this.topGraphics.lineTo(2,-5);
            this.topGraphics.bezierCurveTo(2,-3,-2,-3,-2,-5);


            this.topGraphics.scale.x = 3;
            this.topGraphics.scale.y = 3;
            
            this.bottomGraphics.clear();

            //draw hook:
            this.bottomGraphics.endFill();
            this.bottomGraphics.lineStyle(4, 0x333333, 1);
            this.bottomGraphics.moveTo(0, 25);
            this.bottomGraphics.lineTo(0, 32);
            this.bottomGraphics.bezierCurveTo(-10,32,-10,45,0,45);
            this.bottomGraphics.bezierCurveTo(10,45,10,40,8,35);
            this.bottomGraphics.lineTo(5, 40);

            //draw base:
            var clr = this.HSVtoRGB(hue, 1, 1);
            var clr2 = this.HSVtoRGB(hue, 1, .7);
            this.bottomGraphics.lineStyle(3, clr2);
            this.bottomGraphics.beginFill(clr, 1);
            this.bottomGraphics.moveTo(-20,0);
            this.bottomGraphics.bezierCurveTo(-20,35,20,35,20,0);
            for(var i:number=0; i<teeth; ++i) {
                var x = 20 - 40 * (i + 1) / (teeth);
                this.bottomGraphics.lineTo(x,5 * ((i + 1) % 2));
            }

            this.bottomGraphics.y = 10;
            this.bottomGraphics.scale.x = 3;
            this.bottomGraphics.scale.y = 3;

            this.ringGraphics.beginFill(0xaaaaaa, 1);
            this.ringGraphics.lineStyle(3, 0x888888, 1);
            this.ringGraphics.drawEllipse(0,0,30,15);
            this.ringGraphics.endFill();
            this.ringGraphics.moveTo(-15,-5);
            this.ringGraphics.bezierCurveTo(-5,0,5,0,15,-5);
            this.ringGraphics.y = -80;
            this.ringGraphics.pivot.x = -20;
            this.ringGraphics.rotation = 0;
        }

        HSVtoRGB(h, s, v):number {
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

        setAnimationState(t:number) {
            this.topGraphics.y = -t * 20;
            this.bottomGraphics.y = 0;
            this.ringGraphics.y = this.topGraphics.y - 80;
            this.ringGraphics.rotation = (.25 - 1. * t);
        }
    }
}