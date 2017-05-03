///<reference path="../../phaser/phaser.d.ts"/>

module CircuitGame
{
    export class TitleState extends Phaser.State {
        
        constructor() {
            super();
        }
        titleScreenImage: Phaser.Sprite;

        preload() {
            this.load.image("peach", "peachy.png");
        }
        create() {
            var image = <Phaser.Image><any>this.game.cache.getImage("peach");
            this.titleScreenImage = this.add.sprite((this.game.width - image.width) / 2 , (this.game.height - image.height) / 2, "peach");
            this.input.onTap.addOnce(this.titleClicked, this);
            
            //this.game.add.button(0, 0, "button", () => { this.resetGame(); }, this);
        }
        titleClicked (){
            this.game.state.start("GameRunningState");
            //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.game.scale.startFullScreen(true);
        }
    }
}