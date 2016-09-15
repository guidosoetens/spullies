///<reference path="../../phaser/phaser.d.ts"/>

module Bewlit
{
    export class CornerPiece extends Phaser.Graphics {

        static counter:number = 0;
        idx:number;

        constructor(game:Phaser.Game, cornerPt:Phaser.Point, anchor1:Phaser.Point, anchor2:Phaser.Point) {
            super(game);

            this.idx = CornerPiece.counter++;

            var polygonPoints:number[][] = [];
            polygonPoints.push([cornerPt.x, cornerPt.y]);

            var frac1 = .5 * this.game.rnd.frac();
            var frac2 = .5 * this.game.rnd.frac();
            var control1 = new Phaser.Point(frac1 * anchor1.x + (1 - frac1) * cornerPt.x, frac1 * anchor1.y + (1 - frac1) * cornerPt.y);
            var control2 = new Phaser.Point(frac2 * anchor2.x + (1 - frac2) * cornerPt.x, frac2 * anchor2.y + (1 - frac2) * cornerPt.y);

            var samples = 20;
            for(var i:number=0; i<samples; ++i) {
                var t = i / (samples - 1);
                var tt = t * t;
                var min_t = 1 - t;
                var min_tt = min_t * min_t;
                var x = min_t * min_tt * anchor1.x + 3 * t * min_tt * control1.x + 3 * tt * min_t * control2.x + t * tt * anchor2.x;
                var y = min_t * min_tt * anchor1.y + 3 * t * min_tt * control1.y + 3 * tt * min_t * control2.y + t * tt * anchor2.y;
                polygonPoints.push([x, y]);
            }
            
            this.beginFill(0xaaaa00, .5);
            this.moveTo(polygonPoints[0][0], polygonPoints[0][1]);
            for(var i =0; i<polygonPoints.length; ++i) {
                this.lineTo(polygonPoints[i][0], polygonPoints[i][1]);
            }
            this.endFill();

            //add to physics:
            this.game.physics.p2.enable(this);
            var cornerBody:Phaser.Physics.P2.Body = this.body;
            cornerBody.static = true;
            cornerBody.addPolygon({}, polygonPoints);
        }

        update() {
            this.game.debug.text('pos: X[' + this.x + '] [' + this.y + ']',  30, 30 + 20 * this.idx);
        }
    }
}