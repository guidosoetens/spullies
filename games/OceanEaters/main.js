var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
///<reference path="../../pixi/pixi.js.d.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(w, h) {
            var _this = _super.call(this, w, h, { antialias: true, backgroundColor: 0x1099bb }) || this;
            _this.debugText = new PIXI.Text('Basic text in pixi');
            _this.debugText.x = 20;
            _this.debugText.y = 10;
            _this.stage.addChild(_this.debugText);
            var graphics = new PIXI.Graphics();
            // set a fill and line style
            graphics.beginFill(0xFF3300);
            graphics.lineStyle(10, 0xffd900, 1);
            graphics.position.y = 100;
            var sr = Math.random() * 50.0;
            // draw a shape
            graphics.moveTo(sr, sr);
            graphics.lineTo(250, 50);
            graphics.lineTo(100, 100);
            graphics.lineTo(250, 220);
            graphics.lineTo(50, 220);
            graphics.lineTo(sr, sr);
            graphics.endFill();
            _this.stage.addChild(graphics);
            // alert('A');
            _this.ticker.add(_this.update, _this);
            return _this;
            // alert('B');
        }
        Game.prototype.resize = function (w, h) {
            // this.game.scale.setGameSize(w, h);
        };
        Game.prototype.update = function (dt) {
            this.debugText.text = "FPS: " + Math.round(1000.0 / this.ticker.elapsedMS);
        };
        return Game;
    }(PIXI.Application));
    OceanEaters.Game = Game;
})(OceanEaters || (OceanEaters = {}));
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
window.onload = function () {
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
};
