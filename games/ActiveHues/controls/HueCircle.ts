///<reference path="UserControl.ts"/>
///<reference path="Logo.ts"/>

module ActiveHues
{
    export class HueCircle extends UserControl {

        spriteTex:PIXI.Texture;
        sprite:PIXI.Sprite;
        inputWheel:PIXI.Graphics;
        centerCircle:PIXI.Graphics;

        constructor(w:number, h:number) {
            super(w, h);

            var rad = Math.min(w, h) * .4;

            this.spriteTex = PIXI.Texture.fromImage('assets/hue.png');
            this.sprite = new PIXI.Sprite(this.spriteTex);
            this.sprite.width = this.sprite.height = 2 * rad;
            this.sprite.position.x = w / 2.0 - rad;
            this.sprite.position.y = h / 2.0 - rad;
            this.addChild(this.sprite);

            rad *= 0.8;
            this.inputWheel = new PIXI.Graphics();
            this.inputWheel.beginFill(0xffffff, 1);
            this.inputWheel.drawCircle(0,0,rad);
            this.inputWheel.moveTo(-rad * .2, rad * .95);
            this.inputWheel.lineTo(0, rad * 1.15);
            this.inputWheel.lineTo(rad * .2, rad * .95);
            this.inputWheel.endFill();
            this.inputWheel.position.x = w / 2.0;
            this.inputWheel.position.y = h / 2.0;
            this.addChild(this.inputWheel);

            this.centerCircle = new PIXI.Graphics();
            this.centerCircle.position.x = w / 2.0;
            this.centerCircle.position.y = h / 2.0;
            this.addChild(this.centerCircle);

            this.setHue(0);
        }

        rgbToHex(rgb) : number { 
            return Math.min(255, Math.floor(rgb * 256));
        };

        fullColorHex(r,g,b) : number {   
            var red = this.rgbToHex(r);
            var green = this.rgbToHex(g);
            var blue = this.rgbToHex(b);
            return red * 256 * 256 + green * 256 + blue;
        };

        HSVtoRGB(h, s, v) : number {
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

            return this.fullColorHex(r, g, b);
        }

        setHue(hue:number) {
            var clr = this.HSVtoRGB(hue, 1, 1);

            this.inputWheel.rotation = (hue - .25) * 2 * Math.PI;

            this.centerCircle.clear();
            this.centerCircle.beginFill(clr, 1);
            this.centerCircle.drawCircle(0, 0, Math.min(this.sizeX, this.sizeY) * .3);
            this.centerCircle.endFill();

            if(Logo.instance)
                Logo.instance.setHue(hue);

            broadcastHueMessage(hue, 0.1234);
        }
        updateHueFromPoint(p:PIXI.Point) {
            var toX = p.x - this.sizeX / 2.0;
            var toY = p.y - this.sizeY / 2.0;
            var hue = .5 * Math.atan2(toY, toX) / Math.PI;
            if(hue < 0)
                hue += 1.0;
            this.setHue(hue);
        }

        touchDown(p:PIXI.Point) {
            this.updateHueFromPoint(p);
        }

        touchMove(p:PIXI.Point) {
            this.updateHueFromPoint(p);
        }

        touchUp(p:PIXI.Point) {
            this.updateHueFromPoint(p);
        }
    }
}