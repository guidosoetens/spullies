///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="titleState.ts"/>
///<reference path="gameState.ts"/>

module BlokjesGame
{
    export class SimpleGame {
        
        game: Phaser.Game;
        
        constructor() {
            
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content');
            
            this.game.state.add("GameRunningState", GameRunningState, false);
            this.game.state.add("TitleScreenState", TitleScreenState, false);
            this.game.state.start("GameRunningState", true, true);
        }
    }
}

window.onload = () => {
   
    var game = new BlokjesGame.SimpleGame();
};