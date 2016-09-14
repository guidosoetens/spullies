var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../../phaser/phaser.d.ts"/>
var Bewlit;
(function (Bewlit) {
    var GameState = (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            _super.call(this);
        }
        GameState.prototype.create = function () {
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.gravity.y = 500;
            var polygonPoints = [
                [-20, -20],
                [20, -20],
                [30, 0],
                [20, 20],
                [-20, 20],
            ];
            this.bullet = this.game.add.graphics(0, 0);
            this.bullet.x = 100;
            this.bullet.y = 100;
            this.bullet.beginFill(0xff0000, .5);
            this.bullet.moveTo(polygonPoints[0][0], polygonPoints[0][1]);
            for (var i = 0; i < polygonPoints.length; ++i) {
                this.bullet.lineTo(polygonPoints[i][0], polygonPoints[i][1]);
            }
            this.bullet.endFill();
            this.game.physics.p2.enable(this.bullet);
            this.bulletBody = this.bullet.body;
            this.bulletBody.addPolygon({}, polygonPoints);
            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };
        GameState.prototype.update = function () {
            var dt = this.game.time.physicsElapsed;
            if (this.spaceKey.isDown) {
                var ang = Math.PI * this.bulletBody.angle / 180.0;
                var toPt = new Phaser.Point(Math.cos(ang), Math.sin(ang));
                this.bulletBody.moveRight(toPt.x * 500);
                this.bulletBody.moveDown(toPt.y * 500);
            }
        };
        GameState.prototype.render = function () {
        };
        return GameState;
    }(Phaser.State));
    Bewlit.GameState = GameState;
})(Bewlit || (Bewlit = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="GameState.ts"/>
var Bewlit;
(function (Bewlit) {
    var SimpleGame = (function () {
        function SimpleGame() {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content');
            this.game.state.add("GameRunningState", Bewlit.GameState, false);
            this.game.state.start("GameRunningState", true, true);
        }
        return SimpleGame;
    }());
    Bewlit.SimpleGame = SimpleGame;
})(Bewlit || (Bewlit = {}));
window.onload = function () {
    var game = new Bewlit.SimpleGame();
};
