///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="titleState.ts"/>
///<reference path="gameState.ts"/>

export class SimpleGame {
    
    game: Phaser.Game;
    
    constructor() {
        alert('A');
        this.game = new Phaser.Game(800, 600, Phaser.WEBGL, 'content');

        this.game.state.add("GameRunningState", GameRunningState, false);
        
        alert('A2');
        
        this.game.state.add("TitleScreenState", TitleScreenState, false);
        this.game.state.start("TitleScreenState", true, true);
        alert('B');
    }
}

window.onload = () => {
    var game = new SimpleGame();
};