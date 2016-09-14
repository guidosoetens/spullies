///<reference path="../../phaser/phaser.d.ts"/>

module BirdFlip 
{
    export class Ball extends Phaser.Graphics {

        static rockReference:Ball;
        radius:number;
        p2Body:Phaser.Physics.P2.Body;

        constructor(game:Phaser.Game, pos:Phaser.Point, hasGrav:boolean) {
            super(game);

            this.radius = 14 + 6 * this.game.rnd.frac();
            this.position.x = pos.x;
            this.position.y = pos.y + this.radius;

            var fillClr, lineClr;
            var typeIdx = this.game.rnd.integerInRange(0, 2);
            if(typeIdx == 0) {
                fillClr = 0xff0000;
                lineClr = 0xaa0000;
            }
            else if(typeIdx == 1) {
                fillClr = 0x00ff00;
                lineClr = 0x00aa00;
            }
            else {
                fillClr = 0x0000ff;
                lineClr = 0x0000aa;
            }

            if(hasGrav) {
                fillClr = 0xaaaaaa;
                lineClr = 0xcccccc;
                this.radius = 10;
                Ball.rockReference = this;
            }

            this.beginFill(fillClr, .5);
            this.lineStyle(5, lineClr, 1);
            this.drawCircle(0, 0, 2 * this.radius - 5);

            this.game.physics.p2.enable(this);
            this.p2Body = this.body;
            this.p2Body.setCircle(this.radius);
            this.p2Body.mass = (Math.PI * this.radius * this.radius) / 50;

            this.p2Body.onBeginContact.add(this.onCollide, this);

            if(!hasGrav) {
                this.p2Body.data.gravityScale = 0.0;
                this.p2Body.static = true;
            }
        }

        onCollide(elem1:any, elem2:any) {

            if(this.p2Body.static && (elem1 == Ball.rockReference.body || elem2 == Ball.rockReference.body)) {
                this.p2Body.data.gravityScale = 1.0;
                this.p2Body.static = false;
            }
        }

        destroy() {
            this.game.physics.p2.removeBody(this.body);
        }


    }
}