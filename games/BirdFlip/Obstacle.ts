///<reference path="../../phaser/phaser.d.ts"/>

module BirdFlip 
{
    export class Obstacle extends Phaser.Graphics {

        constructor(game:Phaser.Game, pos:Phaser.Point) {
            super(game);

            var polygonPts:number[][] = [[pos.x, pos.y]];
            var samples = 20;

            var a1 = new Phaser.Point(.5 * this.game.width, 0);
            var c1 = new Phaser.Point((a1.x + pos.x) / 2, 0);
            var a2 = new Phaser.Point(pos.x, .5 * this.game.height);
            var c2 = new Phaser.Point(pos.x, (a1.y + pos.y) / 2);
        
            for(var i:number=0; i<samples; ++i) {
                var t = i / (samples - 1.0);
                var tt = t * t;
                var min_t = 1.0 - t;
                var min_tt = min_t * min_t;

                var x = min_t * min_tt * a1.x + 3 * t * min_tt * c1.x + 3 * tt * min_t * c2.x + t * tt * a2.x;
                var y = min_t * min_tt * a1.y + 3 * t * min_tt * c1.y + 3 * tt * min_t * c2.y + t * tt * a2.y;
                polygonPts.push([x, y]);
            }
            
            this.beginFill(0xff0000, .5);
            this.lineStyle(3, 0xffffff, 1);
            this.moveTo(pos.x, pos.y);
            for(var i=0; i<polygonPts.length; ++i)
                this.lineTo(polygonPts[i][0], polygonPts[i][1]);
            this.lineTo(pos.x, pos.y);

            this.game.physics.p2.enable(this);
            var p2Body:Phaser.Physics.P2.Body = this.body;
            p2Body.static = true;
            p2Body.addPolygon({}, polygonPts);
        }
    }
}