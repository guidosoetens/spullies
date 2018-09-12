///<reference path="../../pixi/pixi.js.d.ts"/>

module OceanEaters
{
    export class Player extends PIXI.Container  {

        shadow:PIXI.Graphics;
        animIt:number;

        surfboardSprite:PIXI.Sprite;
        surferSprite:PIXI.Sprite;

        constructor() {

            super();

            this.shadow = new PIXI.Graphics();
            this.addChild(this.shadow);
            this.shadow.beginFill(0x000, .2);
            this.shadow.drawEllipse(0,0,70,50);
            this.shadow.endFill();

            var tex = PIXI.Texture.fromImage('assets/surfboard.png');
            this.surfboardSprite = new PIXI.Sprite(tex);
            this.surfboardSprite.anchor.x = 0.5;
            this.surfboardSprite.anchor.y = 0.5;
            this.surfboardSprite.scale.x = .8;
            this.surfboardSprite.scale.y = .15;
            this.addChild(this.surfboardSprite);

            tex = PIXI.Texture.fromImage('assets/turtle.png');
            this.surferSprite = new PIXI.Sprite(tex);
            this.surferSprite.anchor.x = .5;
            this.surferSprite.anchor.y = 1.0;
            this.surferSprite.scale.x = .25;
            this.surferSprite.scale.y = .25;
            this.addChild(this.surferSprite);

            this.animIt = 0;

            this.resetLayout(400, (.5 + .5 * (2 / 3.0)) * 600, 800, 600);
        }

        resetLayout(x:number, y:number, w:number, h:number) {
            this.position.x = x;
            this.position.y = y;
        }

        updateFrame(dt:number, pPos:PIXI.Point, pDir:number) {
            this.animIt = (this.animIt + dt) % 1.0;
            this.surfboardSprite.position.y = Math.sin(this.animIt * 2 * Math.PI) * 5;
            this.surferSprite.position.y = Math.sin((this.animIt + .05)  * 2 * Math.PI) * 5;

            var shadowScale = 1. + .05 * Math.sin(this.animIt * 2 * Math.PI);
            this.shadow.position.y = this.surfboardSprite.position.y + 10;
            this.shadow.scale.x = shadowScale;
            this.shadow.scale.y = shadowScale;
        }
    }
}