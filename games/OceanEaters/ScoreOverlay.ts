///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="CollectibleVisual.ts"/>
///<reference path="Collectible.ts"/>

module OceanEaters
{
    export class ScoreOverlay extends PIXI.Container {

        score:number;
        collVisual:CollectibleVisual;
        text:PIXI.Text;

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
        }

        updateFrame(dt:number) {
            this.text.text = ": " + this.score + (Math.random() < .5 ? "" : " ");
        }
        
        pushCollectible(c:Collectible) {
            this.score = this.score + 1;
            this.text.text = ": " + this.score;
        }
    }
}