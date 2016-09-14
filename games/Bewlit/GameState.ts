///<reference path="../../phaser/phaser.d.ts"/>

module Bewlit
{
    export class GameState extends Phaser.State {

        spaceKey:Phaser.Key;
        bullet:Phaser.Graphics;
        bulletBody:Phaser.Physics.P2.Body;

        constructor() {
            super();
        }
        
        create() {

            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.gravity.y = 500;

            var polygonPoints = 
            [
                [-20, -20],
                [20, -20],
                [30, 0],
                [20, 20],
                [-20, 20],
            ];

            this.bullet = this.game.add.graphics(0, 0);
            this.bullet.x = 100;
            this.bullet.y = 100;
            this.bullet.beginFill(0xff0000, .5);
            this.bullet.moveTo(polygonPoints[0][0], polygonPoints[0][1]);
            for(var i =0; i<polygonPoints.length; ++i) {
                this.bullet.lineTo(polygonPoints[i][0], polygonPoints[i][1]);
            }
            this.bullet.endFill();
  
            this.game.physics.p2.enable(this.bullet);
            this.bulletBody = this.bullet.body;

            this.bulletBody.addPolygon({}, polygonPoints);

            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        }


        update() {
            var dt:number = this.game.time.physicsElapsed;

            if(this.spaceKey.isDown) {
                var ang = Math.PI * this.bulletBody.angle / 180.0;
                var toPt = new Phaser.Point(Math.cos(ang), Math.sin(ang));

                this.bulletBody.moveRight(toPt.x * 500);
                this.bulletBody.moveDown(toPt.y * 500);

            }
        }

        render() {
            
        }
    }

}