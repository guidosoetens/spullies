var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../../phaser/phaser.d.ts"/>
var Bewlit;
(function (Bewlit) {
    var Bullet = (function (_super) {
        __extends(Bullet, _super);
        function Bullet(game) {
            _super.call(this, game);
            var polygonPoints = [];
            polygonPoints.push([-20, 20]);
            polygonPoints.push([-20, -20]);
            var samples = 30;
            var offset = 20;
            for (var i = 0; i < samples; ++i) {
                var t = i / (samples - 1);
                var angle = (t - .5) * Math.PI;
                polygonPoints.push([40 * Math.cos(angle), 20 * Math.sin(angle)]);
            }
            this.x = this.game.width / 2;
            this.y = this.game.height / 2;
            this.lineStyle(3, 0xaa0000);
            this.beginFill(0xff0000, 1);
            this.moveTo(polygonPoints[0][0], polygonPoints[0][1]);
            for (var i = 0; i < polygonPoints.length; ++i) {
                this.lineTo(polygonPoints[i][0], polygonPoints[i][1]);
            }
            this.lineTo(polygonPoints[0][0], polygonPoints[0][1]);
            this.endFill();
            this.game.physics.p2.enable(this);
            this.bulletBody = this.body;
            this.bulletBody.addPolygon({}, polygonPoints);
        }
        Bullet.prototype.proceed = function (dt, thrust) {
            if (thrust) {
                var ang = Math.PI * this.bulletBody.angle / 180.0;
                var toPt = new Phaser.Point(Math.cos(ang), Math.sin(ang));
                this.bulletBody.moveRight(toPt.x * 200);
                this.bulletBody.moveDown(toPt.y * 200);
            }
        };
        return Bullet;
    }(Phaser.Graphics));
    Bewlit.Bullet = Bullet;
})(Bewlit || (Bewlit = {}));
///<reference path="../../phaser/phaser.d.ts"/>
var Bewlit;
(function (Bewlit) {
    var CornerPiece = (function (_super) {
        __extends(CornerPiece, _super);
        function CornerPiece(game, cornerPt, anchor1, anchor2) {
            _super.call(this, game);
            var polygonPoints = [];
            polygonPoints.push([cornerPt.x, cornerPt.y]);
            var frac1 = .5 * this.game.rnd.frac();
            var frac2 = .5 * this.game.rnd.frac();
            var control1 = new Phaser.Point(frac1 * anchor1.x + (1 - frac1) * cornerPt.x, frac1 * anchor1.y + (1 - frac1) * cornerPt.y);
            var control2 = new Phaser.Point(frac2 * anchor2.x + (1 - frac2) * cornerPt.x, frac2 * anchor2.y + (1 - frac2) * cornerPt.y);
            var samples = 20;
            for (var i = 0; i < samples; ++i) {
                var t = i / (samples - 1);
                var tt = t * t;
                var min_t = 1 - t;
                var min_tt = min_t * min_t;
                var x = min_t * min_tt * anchor1.x + 3 * t * min_tt * control1.x + 3 * tt * min_t * control2.x + t * tt * anchor2.x;
                var y = min_t * min_tt * anchor1.y + 3 * t * min_tt * control1.y + 3 * tt * min_t * control2.y + t * tt * anchor2.y;
                polygonPoints.push([x, y]);
            }
            var gr = this.game.make.graphics(0, 0);
            gr.beginFill(0xaaaa00, .5);
            gr.moveTo(polygonPoints[0][0], polygonPoints[0][1]);
            for (var i = 0; i < polygonPoints.length; ++i) {
                gr.lineTo(polygonPoints[i][0], polygonPoints[i][1]);
            }
            gr.endFill();
            this.addChild(gr);
            //add to physics:
            var fooBody = this.game.make.graphics(0, 0);
            this.game.physics.p2.enable(fooBody);
            var cornerBody = fooBody.body;
            cornerBody.static = true;
            cornerBody.addPolygon({}, polygonPoints);
            cornerBody.adjustCenterOfMass();
            this.addChild(fooBody);
        }
        return CornerPiece;
    }(Phaser.Group));
    Bewlit.CornerPiece = CornerPiece;
})(Bewlit || (Bewlit = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Bullet.ts"/>
///<reference path="CornerPiece.ts"/>
var Bewlit;
(function (Bewlit) {
    var GameState = (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            _super.call(this);
        }
        GameState.prototype.create = function () {
            this.elements = this.game.add.group();
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.gravity.y = 500;
            this.bullet = new Bewlit.Bullet(this.game);
            this.elements.addChild(this.bullet);
            var cornerPt = new Phaser.Point(1, 1);
            for (var i = 0; i < 4; ++i) {
                var w = this.game.width / 2;
                var h = this.game.height / 2;
                var corner = new Bewlit.CornerPiece(this.game, new Phaser.Point(w + w * cornerPt.x, h + h * cornerPt.y), new Phaser.Point(w, h + h * cornerPt.y), new Phaser.Point(w + w * cornerPt.x, h));
                this.elements.addChild(corner);
                cornerPt = new Phaser.Point(-cornerPt.y, cornerPt.x);
            }
            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };
        GameState.prototype.update = function () {
            var dt = this.game.time.physicsElapsed;
            this.bullet.proceed(dt, this.spaceKey.isDown);
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
