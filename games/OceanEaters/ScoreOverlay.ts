///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="CollectibleVisual.ts"/>
///<reference path="Collectible.ts"/>

module OceanEaters
{
    export class OverlayCollectElement extends CollectibleVisual {
        
        startPos:PIXI.Point;
        startScale:number;
        animParam:number;

        constructor(hue:number, x:number, y:number, scale:number) {
            super(hue);

            this.startPos = new PIXI.Point(x,y);
            this.startScale = scale;
            this.animParam = 0;

            this.updateFrame(0);
        }

        updateFrame(dt:number) {
            this.animParam = this.animParam + dt;
            var t = Math.min(this.animParam, 1);

            var currScale = 1;
            if(t < .5) {
                currScale = 1 + .5 * Math.sin(t * Math.PI);
            }
            else {
                currScale = 1.5 * Math.cos((t - .5) * Math.PI);
            }

            var tt = t * t;
            this.position.x = (1 - tt) * this.startPos.x + tt * 400 - Math.sin(t * Math.PI) * 300;
            this.position.y = (1 - tt) * this.startPos.y + tt * 50;
            this.scale.x = currScale;
            this.scale.y = currScale;
            this.rotation = 10 * Math.sin(t * .5 * Math.PI);
        }
    }

    export class ScoreOverlay extends PIXI.Container {

        score:number;
        collVisual:CollectibleVisual;
        text:PIXI.Text;
        elements:OverlayCollectElement[];
        wobbleAnimIt:number;

        constructor() {
            super();

            this.collVisual = new CollectibleVisual(0);
            this.collVisual.x = 380;
            this.collVisual.y = 50;
            this.collVisual.rotation = -.4;
            this.collVisual.scale.x = .3;
            this.collVisual.scale.y = .3;
            this.addChild(this.collVisual);

            this.text = new PIXI.Text(': 0');
            this.text.style.fontFamily = "groboldregular";
            this.text.style.fontSize = 40;
            this.text.style.stroke = 0xffffff;
            this.text.style.fill = 0xffffff;
            this.text.style.dropShadow = true;
            this.text.style.dropShadowAlpha = .5;
            this.text.x = 420;
            this.text.y = 25;
            this.addChild(this.text);

            this.score = 0;
            this.wobbleAnimIt = 1.0;
            this.elements = [];
        }

        updateFrame(dt:number) {
            this.text.text = ": " + this.score + (Math.random() < .5 ? "" : " ");

            this.wobbleAnimIt = Math.min(this.wobbleAnimIt + dt / .5, 1.0);
            var scaleX = 1. + .2 * Math.sin(this.wobbleAnimIt * 15.) * (1 - this.wobbleAnimIt);
            this.collVisual.scale.x = .3 * scaleX;
            this.collVisual.scale.y = .3 * (2 - scaleX);



            for(var i:number=0; i<this.elements.length; ++i) {
                this.elements[i].updateFrame(dt);
                if(this.elements[i].animParam > 1.0) {
                    this.removeChild(this.elements[i]);
                    this.elements.splice(i,1);
                    this.score = this.score + 1;
                    this.wobbleAnimIt = 0;
                    --i;
                }
            }
        }
        
        pushCollectible(c:Collectible) {
            var elem = new OverlayCollectElement(c.topVisual.hue, c.x, c.y + c.topVisual.y, c.scale.x);
            this.addChild(elem);
            this.elements.push(elem);
        }
    }
}