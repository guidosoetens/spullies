var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../../phaser/phaser.d.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var TitleScreenState = (function (_super) {
        __extends(TitleScreenState, _super);
        //game: Phaser.Game;
        function TitleScreenState() {
            _super.call(this);
        }
        TitleScreenState.prototype.preload = function () {
            this.load.image("title", "peachy.png");
        };
        TitleScreenState.prototype.create = function () {
            this.titleScreenImage = this.add.sprite(0, 0, "title");
            this.input.onTap.addOnce(this.titleClicked, this);
        };
        TitleScreenState.prototype.titleClicked = function () {
            this.game.state.start("GameRunningState");
        };
        return TitleScreenState;
    }(Phaser.State));
    BlokjesGame.TitleScreenState = TitleScreenState;
})(BlokjesGame || (BlokjesGame = {}));
///<reference path="../../phaser/phaser.d.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var GameRunningState = (function (_super) {
        __extends(GameRunningState, _super);
        function GameRunningState() {
            _super.call(this);
        }
        GameRunningState.prototype.create = function () {
            var style = { font: "65px Arial", fill: "#ff0000", align: "center" };
            this.textValue = this.game.add.text(0, 0, "0", style);
            this.updateCount = 0;
        };
        GameRunningState.prototype.update = function () {
            this.updateCount = (this.updateCount + 1) % 100;
            this.textValue.text = (this.updateCount).toString();
        };
        GameRunningState.prototype.render = function () {
            this.game.debug.text("This is drawn in render()", 0, 80);
        };
        return GameRunningState;
    }(Phaser.State));
    BlokjesGame.GameRunningState = GameRunningState;
})(BlokjesGame || (BlokjesGame = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="titleState.ts"/>
///<reference path="gameState.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var SimpleGame = (function () {
        function SimpleGame() {
            this.game = new Phaser.Game(800, 600, Phaser.WEBGL, 'content');
            this.game.state.add("GameRunningState", BlokjesGame.GameRunningState, false);
            this.game.state.add("TitleScreenState", BlokjesGame.TitleScreenState, false);
            this.game.state.start("TitleScreenState", true, true);
        }
        return SimpleGame;
    }());
    BlokjesGame.SimpleGame = SimpleGame;
})(BlokjesGame || (BlokjesGame = {}));
window.onload = function () {
    var game = new BlokjesGame.SimpleGame();
};
