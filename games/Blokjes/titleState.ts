///<reference path="../../phaser/phaser.d.ts"/>

module BlokjesGame
{
    export class TitleScreenState extends Phaser.State {
        
        constructor() {
            super();
        }
        titleScreenImage: Phaser.Sprite;

        preload() {
            this.load.image("title", "peachy.png");
        }
        create() {
            this.titleScreenImage = this.add.sprite(0, 0, "title");
            this.input.onTap.addOnce(this.titleClicked, this);
        }
        titleClicked (){
            this.game.state.start("GameRunningState");
        }
    }
}