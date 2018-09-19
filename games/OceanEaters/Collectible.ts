///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="BadBuoy.ts"/>
///<reference path="CollectibleVisual.ts"/>

module OceanEaters
{
    export class Collectible extends BadBuoy {

        direction:PIXI.Point;
        animationParam:number;

        topVisual:CollectibleVisual;
        bottomVisual:CollectibleVisual;
        shadow:PIXI.Graphics;

        constructor() {
            super(.5, .5, 0);

            this.direction = new PIXI.Point(1, 0);

            this.clear();

            this.animationParam = 0;

            var hue = Math.random();

            this.bottomVisual = new CollectibleVisual(hue);
            this.bottomVisual.scale.y = -1;
            this.bottomVisual.alpha = .2;
            this.addChild(this.bottomVisual);

            this.shadow = new PIXI.Graphics();
            this.shadow.clear();
            this.shadow.beginFill(0x0, .5);
            this.shadow.drawEllipse(0,0,50,10);
            this.shadow.endFill();
            this.addChild(this.shadow);

            this.topVisual = new CollectibleVisual(hue);
            this.addChild(this.topVisual);

            this.reset(.5, .5);
        }

        reset(x:number, y:number) {
            var angle = Math.random() * 2 * Math.PI;
            this.direction.x = Math.cos(angle);
            this.direction.y = Math.sin(angle);

            this.relativePosition.x = x;
            this.relativePosition.y = y;
            this.updateFrame(0.01);

            var hue = Math.random();
            this.topVisual.resetGraphics(hue);
            this.bottomVisual.resetGraphics(hue);
        }

        updateRender(x:number, y:number, s:number, alpha:number) {
            super.updateRender(x, y, s, alpha);

            if(this.topVisual) {
                var t = Math.abs(Math.cos(this.animationParam * 2 * Math.PI));
    
                // this.clear();
                // this.beginFill(0x0000ff, .1);
                // this.drawCircle(0,c_y,50);
                // this.beginFill(0x0, .4 - t * .3);
                // var scale = 1. - t * .5;
                // this.drawEllipse(0,0,scale * 50,scale * 10);
                // this.beginFill(0x0000ff, 1);
                // this.drawCircle(0,-c_y,50);
                // this.endFill();
    
                var shadowScale = 1. - t * .5;
                this.shadow.scale.x = shadowScale;
                this.shadow.scale.y = shadowScale;
                this.shadow.alpha = 1 - t * .8;
    
                this.topVisual.y = -(120 + 60 * t);
                this.topVisual.setAnimationState(t);

                this.bottomVisual.y = 40 - this.topVisual.y;
                this.bottomVisual.setAnimationState(t);

                // this.topGraphics.y = -c_y - t * 20;
                // this.bottomGraphics.y = -c_y;
                // this.ringGraphics.y = this.topGraphics.y - 80;
                // this.ringGraphics.rotation = (.25 - 1. * t);
            }
        }

        updateFrame(dt:number) {
            super.updateFrame(dt);

            this.animationParam = (this.animationParam + dt) % 1.0;

            this.relativePosition.x += this.direction.x * .025 * dt;
            this.relativePosition.x = (this.relativePosition.x) % 1.0;
            if(this.relativePosition.x < 0)
                this.relativePosition.x += 1.0;
            this.relativePosition.y += this.direction.y * .025 * dt;
            this.relativePosition.y = (this.relativePosition.y) % 1.0;
            if(this.relativePosition.y < 0)
                this.relativePosition.y += 1.0;
        }
    }
}