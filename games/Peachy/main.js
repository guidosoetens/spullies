///<reference path="../../phaser/phaser.d.ts"/>
var COLORCODES = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff, 0x00ffff];
var BlobRenderer = (function () {
    function BlobRenderer(game) {
        this.game = game;
        //Create Stamp:
        var blobStamp = game.make.bitmapData(256, 256);
        blobStamp.fill(0, 0, 0, 0);
        for (var i = 0; i < 256.0; ++i) {
            for (var j = 0; j < 256.0; ++j) {
                blobStamp.setPixel(j, i, j, i, 0, false);
            }
        }
        blobStamp.setPixel(0, 0, 0, 0, 0);
        this.stampImage = game.add.image(0, 0, blobStamp);
        this.dataTexture = game.make.bitmapData(256, 256);
        //this.dataTexture.baseTexture.mipmap = false;
        this.dataTexture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        var dataSprite = this.game.add.sprite(0, 0, this.dataTexture);
        var noiseSprite = this.game.add.sprite(0, 0, 'noise'); // new Phaser.Sprite(this.game, 0, 0, 'noise');
        this.uvBmp = game.add.bitmapData(.3 * game.width, game.height);
        var uvBmpContainerSprite = game.add.sprite(0, 0, this.uvBmp);
        this.uvBmp.context.globalCompositeOperation = 'lighter';
        //init shader:
        this.shader = new Phaser.Filter(game, null, game.cache.getShader('shader'));
        this.shader.uniforms.uNoiseTexture = { type: 'sampler2D', value: noiseSprite.texture, textureData: { repeat: true } };
        this.shader.uniforms.uDataTexture = { type: 'sampler2D', value: this.dataTexture, textureData: { repeat: false } };
        uvBmpContainerSprite.filters = [this.shader];
    }
    BlobRenderer.prototype.update = function () {
        this.shader.update();
    };
    BlobRenderer.prototype.startRender = function () {
        this.uvBmp.clear();
        this.uvBmp.fill(0, 0, 0, 0);
    };
    BlobRenderer.prototype.render = function (i, j, idx, alpha) {
        var rows = 16; //12;
        var cols = 16; //6;
        var width = this.uvBmp.width / cols;
        var height = this.uvBmp.height / rows;
        for (var i = 0; i < rows; ++i) {
            var y = i * height;
            for (var j = 0; j < cols; ++j) {
                var x = j * width;
                var idx = i * cols + j;
                var alpha = j / (cols - 1); // 1.0;// (idx % 4) / 3.0;
                //set alpha in data texture:
                this.dataTexture.setPixel(0, idx, alpha * 255, 0, 0, false);
                //set base color in data texture:
                var cls = this.getFractColor(COLORCODES[i % COLORCODES.length]);
                this.dataTexture.setPixel(1, idx, cls[0] * 255, cls[1] * 255, cls[2] * 255, false);
                //sprite.alpha = frac;
                //sprite.blendMode = PIXI.blendModes.SATURATION;
                this.uvBmp.draw(this.stampImage, x, y, width, height);
                this.uvBmp.rect(x, y, width, height, 'rgba(0,0,' + idx + ',1.0)');
            }
        }
        this.dataTexture.setPixel(255, 255, 0, 0, 0, true);
    };
    BlobRenderer.prototype.getFractColor = function (color) {
        var blue = color % 0x100; //0x0000XX
        var green = (color - blue) % 0x10000; //0x00XX00
        var red = (color - green - blue); //0xXX0000
        blue = blue / 0xff;
        green = green / 0xff00;
        red = red / 0xff0000;
        return [red, green, blue];
    };
    return BlobRenderer;
}());
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.image('logo', 'peachy.png');
        this.game.load.shader('shader', 'shader.frag');
        this.game.load.image('noise', "noise.jpg");
    };
    SimpleGame.prototype.create = function () {
        //var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        //logo.anchor.setTo(0.5, 0.5);
        this.renderer = new BlobRenderer(this.game);
    };
    SimpleGame.prototype.update = function () {
        this.renderer.update();
    };
    SimpleGame.prototype.render = function () {
        this.renderer.render();
    };
    return SimpleGame;
}());
window.onload = function () {
    var game = new SimpleGame();
};
