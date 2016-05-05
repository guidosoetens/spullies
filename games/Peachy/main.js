///<reference path="../../phaser/phaser.d.ts"/>
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, render: this.render });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.image('logo', 'peachy.png');
        this.game.load.image('blokje', '../Blokjes/assets/blokje.png');
        this.game.load.shader("blobShader", '../Blokjes/assets/blobShaderTest.frag');
        this.game.load.image('noise', "../Blokjes/assets/noise.jpg");
    };
    SimpleGame.prototype.create = function () {
        //var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        //logo.anchor.setTo(0.5, 0.5);
        var divs = 50;
        var width = this.game.width / divs;
        var height = this.game.height / divs;
        this.gr = new Phaser.Graphics(this.game);
        this.gr.beginFill(0xffffff);
        this.gr.lineStyle(2, 0xff0000, 1);
        this.gr.drawRect(0, 0, width, height);
        this.gr.endFill();
        this.spr = new Phaser.Sprite(this.game, 0, 0, 'blokje');
        this.bmd = this.game.add.bitmapData(this.game.width, this.game.height);
        this.bmd.addToWorld();
        this.bmd.fill(0, 0, 0, 255);
        var noiseSprite = new Phaser.Sprite(this.game, 0, 0, 'noise');
        this.blobShader = new Phaser.Filter(this.game, null, this.game.cache.getShader('blobShader'));
        this.spr.filters = [this.blobShader];
        //this.blobShader.uniforms.uSourceColor =  { type: '3f', value: [1.0, 1.0, 0.0] };
        /*
        this.blobShader.uniforms.uSourceColor =  { type: '3f', value: { x:0, y:0, z:0 } };
        this.blobShader.uniforms.uAlpha =  { type: '1f', value: 1.0 };
        this.blobShader.uniforms.uWidth =  { type: '1f', value: 1.0 };
        this.blobShader.uniforms.uGlobalOrigin =  { type: '2f', value: { x:0, y:0 } };
        this.blobShader.uniforms.uCenterType = { type: '1i', value: 0 };
        this.blobShader.uniforms.uNoiseTexture =  { type: 'sampler2D', value: noiseSprite.texture, textureData: { repeat: true } }
        */
    };
    SimpleGame.prototype.render = function () {
        this.bmd.clear();
        var divs = 50;
        var width = this.game.width / divs;
        var height = this.game.height / divs;
        var dx = .1 * width;
        var dy = .1 * height;
        for (var i = 0; i < divs; ++i) {
            for (var j = 0; j < divs; ++j) {
                var x = j * width;
                var y = i * width;
                this.bmd.draw(this.spr, x + dx, y + dy, width - 2 * dx, height - 2 * dy);
            }
        }
    };
    return SimpleGame;
}());
window.onload = function () {
    var game = new SimpleGame();
};
