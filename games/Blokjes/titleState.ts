///<reference path="../../phaser/phaser.d.ts"/>

class TitleScreenState extends Phaser.State {
    //game: Phaser.Game;
    constructor() {
        super();
    }
    titleScreenImage: Phaser.Sprite;

    preload() {
        this.load.image("title", "peachy.png");
    }
    create() {
        this.titleScreenImage = this.add.sprite(0, 0, "title");
        this.input.onTap.addOnce(this.titleClicked,this); // <-- that um, this is extremely important
    }
    titleClicked (){
        this.game.state.start("GameRunningState");
    }
}