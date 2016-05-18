///<reference path="../../phaser/phaser.d.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var WIDTH = 800;
    var HEIGHT = 600;
    var SCALE = 0.5;
    var MOTION_WIDTH = WIDTH * SCALE;
    var MOTION_HEIGHT = HEIGHT * SCALE;
    var MOTION_RADIUS = 30;
    var SimpleGame = (function () {
        function SimpleGame() {
            this.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
        }
        SimpleGame.prototype.preload = function () {
            this.game.load.shader("velocityShader", 'velocityShader.frag');
        };
        SimpleGame.prototype.create = function () {
            this.shader = new Phaser.Filter(this.game, null, this.game.cache.getShader('velocityShader'));
            this.inputLoc = new Phaser.Point(0, 0);
            //Create Stamp:
            this.bitmapData = this.game.make.bitmapData(MOTION_WIDTH, MOTION_HEIGHT);
            this.image = this.game.add.image(0, 0, this.bitmapData);
            this.image.scale.x = 1.0 / SCALE;
            this.image.scale.y = 1.0 / SCALE;
            this.image.filters = [this.shader];
            this.renderTexture = this.game.add.renderTexture(MOTION_WIDTH, MOTION_HEIGHT);
            //this.game.add.image(0,0,this.renderTexture);
        };
        SimpleGame.prototype.update = function () {
            //update location buffer:
            var prevLoc = this.inputLoc;
            var currLoc = new Phaser.Point(this.inputLoc.x, this.inputLoc.y).multiply(.9, .9).add(.1 * SCALE * this.game.input.position.x, .1 * SCALE * this.game.input.position.y);
            this.inputLoc = currLoc;
            this.bitmapData.clear();
            this.bitmapData.update();
            var minX = Math.round(Math.min(prevLoc.x - MOTION_RADIUS, currLoc.x - MOTION_RADIUS));
            var maxX = Math.round(Math.max(prevLoc.x + MOTION_RADIUS, currLoc.x + MOTION_RADIUS));
            var minY = Math.round(Math.min(prevLoc.y - MOTION_RADIUS, currLoc.y - MOTION_RADIUS));
            var maxY = Math.round(Math.max(prevLoc.y + MOTION_RADIUS, currLoc.y + MOTION_RADIUS));
            var radSqrd = MOTION_RADIUS * MOTION_RADIUS;
            for (var x = Math.max(0, minX); x < MOTION_WIDTH && x < maxX; ++x) {
                for (var y = Math.max(0, minY); y < MOTION_HEIGHT && y < maxY; ++y) {
                    var closeTo1 = new Phaser.Point(prevLoc.x - x, prevLoc.y - y).getMagnitudeSq() <= radSqrd;
                    var closeTo2 = new Phaser.Point(currLoc.x - x, currLoc.y - y).getMagnitudeSq() <= radSqrd;
                    if (closeTo1 && !closeTo2 || !closeTo1 && closeTo2)
                        this.bitmapData.setPixel(x, y, 255, 0, 0, false);
                }
            }
            this.bitmapData.setPixel(0, 0, 0, 0, 0);
            //this.renderTexture.clear();
            this.renderTexture.render(this.image);
        };
        SimpleGame.prototype.render = function () {
            //this.game.debug.text("input loc: " + this.inputLoc, 0, 50);
        };
        return SimpleGame;
    }());
    BlokjesGame.SimpleGame = SimpleGame;
})(BlokjesGame || (BlokjesGame = {}));
window.onload = function () {
    var game = new BlokjesGame.SimpleGame();
};
