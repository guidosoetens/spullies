///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="titleState.ts"/>
///<reference path="gameState.ts"/>
"use strict";
var SimpleGame = (function () {
    function SimpleGame() {
        alert('A');
        this.game = new Phaser.Game(800, 600, Phaser.WEBGL, 'content');
        this.game.state.add("GameRunningState", GameRunningState, false);
        alert('A2');
        this.game.state.add("TitleScreenState", TitleScreenState, false);
        this.game.state.start("TitleScreenState", true, true);
        alert('B');
    }
    return SimpleGame;
}());
exports.SimpleGame = SimpleGame;
window.onload = function () {
    var game = new SimpleGame();
};
