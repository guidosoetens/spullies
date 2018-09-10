///<reference path="../../phaser/phaser.d.ts"/>

module OceanEaters
{
    export class BadBuoy  {

        game:Phaser.Game;
        graphics:Phaser.Graphics;
        position:Phaser.Point;
        index:number;

        constructor(game:Phaser.Game, x:number, y:number) {

            this.game = game;

            var clr = (x < .2 && y < .2) ? 0xff0000 : 0x0;

            this.graphics = this.game.add.graphics(0,0);
            this.graphics.beginFill(clr, 1);
            this.graphics.drawEllipse(0,0,5,5);
            this.graphics.endFill();

            this.position = new Phaser.Point(x, y);
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