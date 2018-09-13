///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="GameState.ts"/>

module OceanEatersPhaser
{
    export class SimpleGame {
        
        game: Phaser.Game;
        
        constructor(w:number, h:number) {
            this.game = new Phaser.Game(w, h, Phaser.AUTO, 'content');
            this.game.state.add("GameRunningState", GameState, false);
            this.game.state.start("GameRunningState", true, true);
        }

        resize(w:number, h:number) {
            this.game.scale.setGameSize(w, h);
        }
    }
}

function resizeGame(game:OceanEatersPhaser.SimpleGame) {
    var contentDiv = document.getElementById("content");
    var w = 600;//contentDiv.clientWidth;
    var h = 450;//contentDiv.clientHeight;
    game.resize(w, h);
}

window.onload = () => {

    var contentDiv = document.getElementById("content");
    var w = 600;//contentDiv.clientWidth;
    var h = 450;//contentDiv.clientHeight;

    var game = new OceanEatersPhaser.SimpleGame(w, h);

    function onResize(event) {
        resizeGame(game);
    }
    window.addEventListener("resize", onResize);
}
