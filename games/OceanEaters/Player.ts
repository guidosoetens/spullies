///<reference path="../../pixi/pixi.js.d.ts"/>

module OceanEaters
{
    export class Player extends PIXI.Container  {

        shadow:PIXI.Graphics;
        animIt:number;

        surfboardSprite:PIXI.Sprite;
        surferSprite:PIXI.Sprite;

        jumping:boolean;
        jumpParam:number;
        doRotation:boolean;

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
            this.surferSprite.anchor.y = .5;
            this.surferSprite.scale.x = .25;
            this.surferSprite.scale.y = .25;
            this.addChild(this.surferSprite);

            this.animIt = 0;
            this.jumping = false;
            this.jumpParam = 0;

            this.resetLayout(400, (.5 + .5 * (2 / 3.0)) * 600, 800, 600);
        }

        jump(salto:boolean) {
            if(!this.jumping) {
                this.jumping = true;
                this.jumpParam = 0;
                this.doRotation = salto || Math.random() < .3;
            }
        }

        resetLayout(x:number, y:number, w:number, h:number) {
            this.position.x = x;
            this.position.y = y;
        }

        updateFrame(dt:number, pPos:PIXI.Point, pDir:number) {

            var jump = 0;
            var jumpTime = .5;
            var surferRotation = 0;
            if(this.jumping) {
                this.jumpParam += dt / 2.0;
                if(this.jumpParam > 1.0) {
                    this.jumpParam = 0.;
                    this.jumping = false;
                }
                else if(this.jumpParam < jumpTime) {
                    var t = this.jumpParam / jumpTime;
                    jump = -300 * Math.sin(t * Math.PI);
                    if(this.doRotation) {
                        surferRotation = Math.sin(t * .5 * Math.PI) * 2 * Math.PI;
                    }
                }
                else {
                    var t = (this.jumpParam - jumpTime) / (1 - jumpTime);
                    jump = 20 * Math.sin(t * 12) * (1 - t);
                }
            }

            var jumpVar = -jump / 300.0;

            this.animIt = (this.animIt + dt) % 1.0;
            this.surfboardSprite.position.y = Math.sin(this.animIt * 2 * Math.PI) * 5 + jump;
            this.surferSprite.position.y = Math.sin((this.animIt + .05)  * 2 * Math.PI) * 5 + (this.doRotation ? 1.3 : 1.1) * jump - .75 * this.surfboardSprite.height;
            this.surferSprite.rotation = surferRotation;

            var shadowScale = (1. + .05 * Math.sin(this.animIt * 2 * Math.PI)) * (.3 + .7 * (1 - jumpVar));
            this.shadow.position.y = this.surfboardSprite.position.y + 10 - jump;
            this.shadow.scale.x = shadowScale;
            this.shadow.scale.y = shadowScale;
            this.shadow.alpha = (.3 + .7 * (1 - jumpVar));
        }
    }
}