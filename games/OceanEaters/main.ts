///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Game.ts"/>

// module OceanEaters
// {
//     export class SimpleGame {
        
//         game: Phaser.Game;
        
//         constructor(w:number, h:number) {
//             this.game = new Phaser.Game(w, h, Phaser.AUTO, 'content');
//             this.game.state.add("GameRunningState", GameState, false);
//             this.game.state.start("GameRunningState", true, true);
//         }

//         resize(w:number, h:number) {
//             this.game.scale.setGameSize(w, h);
//         }
//     }
// }

// function resizeGame(game:OceanEaters.SimpleGame) {
//     var contentDiv = document.getElementById("content");
//     var w = 600;//contentDiv.clientWidth;
//     var h = 450;//contentDiv.clientHeight;
//     game.resize(w, h);
// }

window.onload = () => {

    var app = new OceanEaters.Game(800, 600);

    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);


    // var contentDiv = document.getElementById("content");
    // var w = 600;//contentDiv.clientWidth;
    // var h = 450;//contentDiv.clientHeight;

    // var game = new OceanEaters.SimpleGame(w, h);

    // function onResize(event) {
    //     resizeGame(game);
    // }
    // window.addEventListener("resize", onResize);
}
