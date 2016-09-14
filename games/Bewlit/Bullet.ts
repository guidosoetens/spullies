///<reference path="../../phaser/phaser.d.ts"/>

module Bewlit
{
    export class Bullet extends Phaser.Graphics {

        bulletBody:Phaser.Physics.P2.Body;

        constructor(game:Phaser.Game) {
            super(game);

            var polygonPoints:number[][] = [];
            polygonPoints.push([-20,20]);
            polygonPoints.push([-20,-20]);

            var samples = 30;
            var offset = 20;
            for(var i:number=0; i<samples; ++i) {
                var t = i / (samples - 1);
                var angle = (t - .5) * Math.PI;
                polygonPoints.push([40 * Math.cos(angle), 20 * Math.sin(angle)]);
            }
            

            this.x = this.game.width / 2;
            this.y = this.game.height / 2;
            this.lineStyle(3, 0xaa0000);
            this.beginFill(0xff0000, 1);
            this.moveTo(polygonPoints[0][0], polygonPoints[0][1]);
            for(var i=0; i<polygonPoints.length; ++i) {
                this.lineTo(polygonPoints[i][0], polygonPoints[i][1]);
            }
            this.lineTo(polygonPoints[0][0], polygonPoints[0][1]);
            this.endFill();

            this.game.physics.p2.enable(this);
            this.bulletBody = this.body;



            this.bulletBody.addPolygon({}, polygonPoints);

        }

        proceed(dt:number, thrust:boolean) {
            if(thrust) {
                var ang = Math.PI * this.bulletBody.angle / 180.0;
                var toPt = new Phaser.Point(Math.cos(ang), Math.sin(ang));

                this.bulletBody.moveRight(toPt.x * 200);
                this.bulletBody.moveDown(toPt.y * 200);
            }
        }
    }
}