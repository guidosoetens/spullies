///<reference path="../../phaser/phaser.d.ts"/>

module Bewlit
{
    export class CornerPiece extends Phaser.Group {

        constructor(game:Phaser.Game, cornerPt:Phaser.Point, anchor1:Phaser.Point, anchor2:Phaser.Point) {
            super(game);

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
            
            var gr = this.game.make.graphics(0, 0);
            gr.beginFill(0xaaaa00, .5);
            gr.moveTo(polygonPoints[0][0], polygonPoints[0][1]);
            for(var i =0; i<polygonPoints.length; ++i) {
                gr.lineTo(polygonPoints[i][0], polygonPoints[i][1]);
            }
            gr.endFill();
            this.addChild(gr);

            //add to physics:
            var fooBody = this.game.make.graphics(0, 0);
            this.game.physics.p2.enable(fooBody);
            var cornerBody:Phaser.Physics.P2.Body = fooBody.body;
            cornerBody.static = true;
            cornerBody.addPolygon({}, polygonPoints);
            cornerBody.adjustCenterOfMass();
            this.addChild(fooBody);
        }
    }
}