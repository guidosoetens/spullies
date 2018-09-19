///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="BadBuoy.ts"/>

module OceanEaters
{
    export class Collectible extends BadBuoy {

        direction:PIXI.Point;
        animationParam:number;

        topGraphics:PIXI.Graphics;
        bottomGraphics:PIXI.Graphics;

        constructor() {
            super(.5, .5, 0);

            this.direction = new PIXI.Point(1, 0);

            this.clear();
            this.beginFill(0x0000ff, 1);
            this.drawCircle(0,0,50);
            this.endFill();

            this.animationParam = 0;

            this.reset(.5, .5);

            this.topGraphics = new PIXI.Graphics();
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
            this.addChild(this.topGraphics);

            this.bottomGraphics = new PIXI.Graphics();
            this.bottomGraphics.clear();

            //draw hook:
            this.bottomGraphics.endFill();
            this.bottomGraphics.lineStyle(4, 0x888888, 1);
            this.bottomGraphics.moveTo(0, 25);
            this.bottomGraphics.lineTo(0, 32);
            this.bottomGraphics.bezierCurveTo(-10,32,-10,45,0,45);
            this.bottomGraphics.bezierCurveTo(10,45,10,40,8,35);
            this.bottomGraphics.lineTo(5, 40);

            //draw base:
            this.bottomGraphics.lineStyle(3, 0xaaaaaa);
            this.bottomGraphics.beginFill(0xffffff, 1);
            this.bottomGraphics.moveTo(-20,0);
            this.bottomGraphics.bezierCurveTo(-20,35,20,35,20,0);
            for(var i:number=0; i<teeth; ++i) {
                var x = 20 - 40 * (i + 1) / (teeth);
                this.bottomGraphics.lineTo(x,5 * ((i + 1) % 2));
            }


            this.bottomGraphics.y = 10;
            this.bottomGraphics.scale.x = 3;
            this.bottomGraphics.scale.y = 3;
            this.addChild(this.bottomGraphics);
        }

        reset(x:number, y:number) {
            var angle = Math.random() * 2 * Math.PI;
            this.direction.x = Math.cos(angle);
            this.direction.y = Math.sin(angle);

            this.relativePosition.x = x;
            this.relativePosition.y = y;
            this.updateFrame(0.01);
        }

        updateRender(x:number, y:number, s:number, alpha:number) {
            super.updateRender(x, y, s, alpha);

            var t = Math.abs(Math.cos(this.animationParam * 2 * Math.PI));
            var c_y = 60 + 40 * t;

            this.clear();
            this.beginFill(0x0000ff, .1);
            this.drawCircle(0,c_y,50);
            this.beginFill(0x0, .4 - t * .3);
            var scale = 1. - t * .5;
            this.drawEllipse(0,0,scale * 50,scale * 10);
            this.beginFill(0x0000ff, 1);
            this.drawCircle(0,-c_y,50);
            this.endFill();
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