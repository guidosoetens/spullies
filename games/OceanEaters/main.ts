///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="GameState.ts"/>

module OceanEaters
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

var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function resizeGame(game:OceanEaters.SimpleGame) {
    var contentDiv = document.getElementById("content");
    var w = contentDiv.clientWidth;
    var h = contentDiv.clientHeight;
    game.resize(w, h);
}

window.onload = () => {

    var contentDiv = document.getElementById("content");
    var w = contentDiv.clientWidth;
    var h = contentDiv.clientHeight;

    var game = new OceanEaters.SimpleGame(w, h);
    disableScroll();

    function onResize(event) {
        resizeGame(game);
    }
    window.addEventListener("resize", onResize);
}
