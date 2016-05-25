///<reference path="../../phaser/phaser.d.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var WIDTH = 800;
    var HEIGHT = 600;
    var SCALE = 0.25;
    var MOTION_WIDTH = WIDTH * SCALE;
    var MOTION_HEIGHT = HEIGHT * SCALE;
    var MOTION_RADIUS = 20;
    var SimpleGame = (function () {
        function SimpleGame() {
            this.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, preRender: this.preRender, render: this.render });
        }
        SimpleGame.prototype.preload = function () {
            this.game.load.shader("velocityShader", 'velocityShader.frag');
        };
        SimpleGame.prototype.create = function () {
            this.shader = new Phaser.Filter(this.game, null, this.game.cache.getShader('velocityShader'));
            this.inputLoc = new Phaser.Point(0, 0);
            this.velocityMapTarget = this.game.make.renderTexture(MOTION_WIDTH, MOTION_HEIGHT);
            this.velocityMapTargetContainer = this.game.add.image(0, 0, this.velocityMapTarget);
            this.textureTargetBitmap = this.game.make.renderTexture(MOTION_WIDTH, MOTION_HEIGHT);
            this.textureTargetBitmap.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
            this.textureTargetBitmapContainer = this.game.add.image(MOTION_WIDTH, 0, this.textureTargetBitmap);
            //motion image:
            this.motionImageBmpData = this.game.make.bitmapData(MOTION_WIDTH, MOTION_HEIGHT);
            this.motionImage = this.game.add.image(0, 0, this.motionImageBmpData);
            this.motionImage.scale.x = 1.0 / SCALE;
            this.motionImage.scale.y = 1.0 / SCALE;
            this.motionImage.filters = [this.shader];
            this.motionImage.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
            this.shader.uniforms.uPreviousFrame = { type: 'sampler2D', value: this.textureTargetBitmapContainer.texture, textureData: { repeat: false } };
            this.shader.uniforms.uResolution = { type: '2f', value: { x: MOTION_WIDTH, y: MOTION_HEIGHT } };
        };
        SimpleGame.prototype.update = function () {
            var mat = new Phaser.Matrix().identity().scale(1.0, -1.0).translate(0, MOTION_HEIGHT);
            this.velocityMapTarget.render(this.motionImage, mat);
            mat = new Phaser.Matrix().identity().scale(1.0, 1.0);
            this.textureTargetBitmap.render(this.velocityMapTargetContainer, mat);
            //update location buffer:
            var prevLoc = this.inputLoc;
            var currLoc = new Phaser.Point(this.inputLoc.x, this.inputLoc.y).multiply(.9, .9).add(.1 * SCALE * this.game.input.position.x, .1 * SCALE * this.game.input.position.y);
            //clamp location:
            currLoc.x = Math.round(currLoc.x);
            currLoc.y = Math.round(currLoc.y);
            this.inputLoc = currLoc;
            this.motionImageBmpData.fill(0, 0, 0);
            this.motionImageBmpData.update();
            var minX = Math.round(Math.min(prevLoc.x - MOTION_RADIUS, currLoc.x - MOTION_RADIUS)) - 1;
            var maxX = Math.round(Math.max(prevLoc.x + MOTION_RADIUS, currLoc.x + MOTION_RADIUS)) + 1;
            var minY = Math.round(Math.min(prevLoc.y - MOTION_RADIUS, currLoc.y - MOTION_RADIUS)) - 1;
            var maxY = Math.round(Math.max(prevLoc.y + MOTION_RADIUS, currLoc.y + MOTION_RADIUS)) + 1;
            var radSqrd = MOTION_RADIUS * MOTION_RADIUS;
            for (var x = Math.max(0, minX); x < MOTION_WIDTH && x < maxX; ++x) {
                for (var y = Math.max(0, minY); y < MOTION_HEIGHT && y < maxY; ++y) {
                    var closeTo1 = new Phaser.Point(prevLoc.x - x, prevLoc.y - y).getMagnitudeSq() <= radSqrd;
                    var closeTo2 = new Phaser.Point(currLoc.x - x, currLoc.y - y).getMagnitudeSq() <= radSqrd;
                    if (closeTo1 && !closeTo2 || !closeTo1 && closeTo2)
                        this.motionImageBmpData.setPixel(x, y, 255, 255, 255, false);
                }
            }
            this.motionImageBmpData.setPixel(0, 0, 0, 0, 0);
            this.shader.update();
        };
        SimpleGame.prototype.preRender = function () {
        };
        SimpleGame.prototype.render = function () {
        };
        return SimpleGame;
    }());
    BlokjesGame.SimpleGame = SimpleGame;
})(BlokjesGame || (BlokjesGame = {}));
window.onload = function () {
    var game = new BlokjesGame.SimpleGame();
};
