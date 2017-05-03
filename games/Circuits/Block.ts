///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Defs.ts"/>

module CircuitGame
{
    export class Block {
        
        game:Phaser.Game;
        isBlocking:boolean;
        typeIndex:number;
        removing:boolean;
        testSource:Block;
        chainedToNeighbor:boolean[];
        dropping:boolean;
        dropFromRow:number;
        flips:number;

        private graphics:Phaser.Graphics;
        
        constructor(game:Phaser.Game) {
            this.game = game;
            this.isBlocking = false;
            this.typeIndex = 0;
            this.removing = false;
            this.testSource = null;
            this.chainedToNeighbor = [false, false, false, false];
            this.dropping = false;
            this.dropFromRow = 0;
            this.flips = 0;

            this.graphics = this.game.add.graphics(0, 0);
        }

        destroy() {
            this.graphics.destroy();
        }

        draw(i:number, j:number) {

            this.graphics.clear();

            var topLeft:Phaser.Point = new Phaser.Point();
            topLeft.x = (this.game.width - COLUMNCOUNT * GRIDWIDTH) / 2;
            topLeft.y = (this.game.height - VISIBLEROWCOUNT * GRIDWIDTH) / 2;

            var y:number = topLeft.y + (i - TOPROWCOUNT) * GRIDWIDTH;
            var x:number = topLeft.x + j * GRIDWIDTH;
            x = Math.round(x);
            y = Math.round(y);

            var colorIdx = this.isBlocking ? -1 : (this.typeIndex % COLORCODES.length);
            var clr = colorIdx < 0 ? 0 : COLORCODES[colorIdx % COLORCODES.length];
            this.graphics.beginFill(clr, 1);
            //gr.drawCircle(x + GRIDWIDTH / 2, y + GRIDWIDTH / 2, GRIDWIDTH * .8);
            var offset = GRIDWIDTH * 0.45;
            this.graphics.drawRoundedRect(-offset, -offset, 2 * offset, 2 * offset, 3);

            this.graphics.beginFill(0xffffff, 1);
            if(colorIdx >= 0 && colorIdx < 4) {
                
                var tos:Phaser.Point[] = [];
                tos.push(new Phaser.Point(0, 1));
                if(colorIdx != 1)
                    tos.push(new Phaser.Point(1, 0));
                if(colorIdx > 0)
                    tos.push(new Phaser.Point(0, -1));
                if(colorIdx == 3)
                    tos.push(new Phaser.Point(-1, 0));

                this.graphics.lineStyle(0, 0xffffff, 1);
                this.graphics.drawCircle(0, 0, 5);

                this.graphics.lineStyle(10, 0xffffff, 1);
                for(var i:number=0; i<tos.length; ++i) {
                    this.graphics.moveTo(0, 0);
                    var to = tos[i];
                    to.multiply(GRIDWIDTH / 2, GRIDWIDTH / 2);
                    this.graphics.lineTo(to.x, to.y);
                }
            }
            this.graphics.lineStyle(1, 0xffffff, 1);

            var center = new Phaser.Point(x + GRIDWIDTH / 2, y + GRIDWIDTH / 2);
            this.graphics.x = center.x;
            this.graphics.y = center.y;
            this.graphics.rotation = this.flips * 90;
        }
    }
}