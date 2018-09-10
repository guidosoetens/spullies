///<reference path="../../phaser/phaser.d.ts"/>

module OceanEaters
{
    export class BadBuoy  {

        game:Phaser.Game;
        graphics:Phaser.Graphics;
        position:Phaser.Point;
        index:number;

        anchorGraphics:Phaser.Graphics;

        constructor(game:Phaser.Game, x:number, y:number, index:number) {

            this.game = game;

            this.index = index;

            var clr = (x < .2 && y < .2) ? 0xff0000 : 0x00ff00;

            var width = 400;
            var height = 600;
            var rad = Math.min(width, height) * .25;

            this.graphics = this.game.make.graphics(0,0);
            this.graphics.beginFill(0x0, .2);
            this.graphics.drawEllipse(0,0,.6 * width, .1 * width);

            this.graphics.beginFill(clr, 1);
            this.graphics.lineStyle(20, 0x0, 1);
            this.graphics.drawRoundedRect(-width/2,-height,width,height,rad);
            this.graphics.drawEllipse(0,0,5,5);
            this.graphics.endFill();

            this.position = new Phaser.Point(x, y);

            var style = { font: (height * .4) + "px Arial", fill: "#ffffff", align: "center" };
            var text = game.make.text(0, -height / 2, "" + this.index, style);
            text.anchor.set(0.5);
            this.graphics.addChild(text);
        }

        updateRender(x:number, y:number, s:number, alpha:number) {
            this.graphics.position.x = x;
            this.graphics.position.y = y;
            this.graphics.alpha = alpha;
            this.graphics.scale.x = s;
            this.graphics.scale.y = s;
        }

        updateFrame(dt:number) {
            
        }
    }
}