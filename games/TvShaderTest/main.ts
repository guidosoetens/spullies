///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="MainState.ts"/>

module BlokjesGame
{
    const WIDTH:number = 1024;
    const HEIGHT:number = 768;
    
    export class SimpleGame {
        
        game: Phaser.Game;
        
        constructor() {
            this.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'content');
            this.game.state.add("MainState", MainState, true);
        }
    }
}

window.onload = () => {
    var game = new BlokjesGame.SimpleGame();
};