///<reference path="../../phaser/phaser.d.ts"/>

module OceanEatersPhaser
{
    export class Player  {

        game:Phaser.Game;
        group:Phaser.Group;
        shadow:Phaser.Graphics;
        animIt:number;

        surfboardSprite:Phaser.Sprite;
        surferSprite:Phaser.Sprite;

        constructor(game:Phaser.Game) {

            this.game = game;

            this.shadow = this.game.make.graphics(0,0);
            this.shadow.beginFill(0x000, .2);
            this.shadow.drawEllipse(0,0,70,50);
            this.shadow.endFill();

            this.group = game.add.group();
            this.group.add(this.shadow);

            this.surfboardSprite = game.make.sprite(0,0,'surfboard');
            this.surfboardSprite.anchor.x = 0.5;
            this.surfboardSprite.anchor.y = 0.5;
            this.surfboardSprite.scale.x = .8;
            this.surfboardSprite.scale.y = .15;
            this.group.add(this.surfboardSprite);


            this.surferSprite = game.make.sprite(0,0,'surfer');
            this.surferSprite.anchor.x = .5;
            this.surferSprite.anchor.y = 1.0;
            this.surferSprite.scale.x = .25;
            this.surferSprite.scale.y = .25;
            this.group.add(this.surferSprite);

            this.animIt = 0;
        }

        resetLayout(x:number, y:number, w:number, h:number) {
            this.group.position.x = x;
            this.group.position.y = y;
        }

        updateFrame(dt:number, pPos:Phaser.Point, pDir:number) {
            this.animIt = (this.animIt + dt) % 1.0;
            this.surfboardSprite.position.y = Math.sin(this.animIt * 2 * Math.PI) * 5;
            this.surferSprite.position.y = Math.sin((this.animIt + .05)  * 2 * Math.PI) * 5;

            var shadowScale = 1. + .05 * Math.sin(this.animIt * 2 * Math.PI);
            this.shadow.position.y = this.surfboardSprite.position.y + 10;
            this.shadow.scale.x = shadowScale;
            this.shadow.scale.y = shadowScale;
        }
    }
}