///<reference path="../../phaser/phaser.d.ts"/>

module BirdFlip 
{
    export class Ball extends Phaser.Graphics {

        static rockRef:Ball;
        radius:number;
        isStuck:boolean;

        p2Body:Phaser.Physics.P2.Body;

        constructor(game:Phaser.Game, hasGrav:boolean) {
            super(game);

            this.position.x = this.game.rnd.frac() * this.game.width;
            this.position.y = this.game.rnd.frac() * .5 * this.game.height;

            this.radius = 20 + 15 * this.game.rnd.frac();

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
            }

            this.beginFill(fillClr, .5);
            this.lineStyle(5, lineClr, 1);
            this.drawCircle(0, 0, 2 * this.radius);

            this.game.physics.p2.enable(this);
            this.p2Body = this.body;
            this.p2Body.setCircle(this.radius);
            this.p2Body.mass = (Math.PI * this.radius * this.radius) / 50;

            this.p2Body.onBeginContact.add(this.onCollide, this);

            this.isStuck = true;
            if(hasGrav) {
                Ball.rockRef = this;
                this.isStuck = false;
            }
            else {
                this.p2Body.data.gravityScale = 0.0;
                //this.p2Body.mass = 0.0;
                //this.body.kinematic = true;
            }
        }

        onCollide(elem1:any, elem2:any) {
            
            if(this.isStuck && (elem1 == Ball.rockRef.p2Body || elem2 == Ball.rockRef.p2Body)) {
                this.p2Body.data.gravityScale = 1.0;
                this.isStuck = false;
                //this.p2Body.mass = (Math.PI * this.radius * this.radius) / 50;
                //this.p2Body.kinematic = false;
            }
        }

        destroy() {
            this.game.physics.p2.removeBody(this.body);
        }


    }
}