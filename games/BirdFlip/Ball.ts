///<reference path="../../phaser/phaser.d.ts"/>

module BirdFlip 
{
    export class Ball extends Phaser.Graphics {

        constructor(game:Phaser.Game) {
            super(game);

            this.position.x = this.game.rnd.frac() * this.game.width;
            this.position.y = this.game.rnd.frac() * .5 * this.game.height;

            var radius = 20 + 15 * this.game.rnd.frac();

            this.beginFill(0xff0000, 1);
            this.drawCircle(0, 0, 2 * radius);

            this.game.physics.p2.enable(this);
            this.body.setCircle(radius);
            this.body.mass = (Math.PI * radius * radius) / 50;
        }
    }
}