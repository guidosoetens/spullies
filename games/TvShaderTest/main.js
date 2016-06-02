///<reference path="../../phaser/phaser.d.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var WIDTH = 1024;
    var HEIGHT = 768;
    var GuiRenderer = (function () {
        function GuiRenderer() {
        }
        GuiRenderer.prototype.renderHex = function (gr, lineColor, x, y, width) {
            var dAng = 2 * Math.PI / 6;
            var rad = .8 * .5 * width / Math.cos(.5 * dAng);
            gr.beginFill(0x222222, 1);
            gr.lineStyle(8, lineColor, 255);
            gr.moveTo(x, y + rad);
            for (var it = 0; it < 6; ++it) {
                var angle = .5 * Math.PI + (it + 1) * dAng;
                gr.lineTo(x + rad * Math.cos(angle), y + rad * Math.sin(angle));
            }
            gr.endFill();
        };
        GuiRenderer.prototype.renderGui = function (game, menuGraphics, group) {
            this.game = game;
            //text container:
            var style = { font: "65px Courier New", fill: "#ffffff", align: "center" };
            var scoreStyle = { font: "32px Courier New", fill: "#ffffff", align: "center" };
            var numStyle = { font: "46px Courier New", fill: "#ffffff", align: "center" };
            var starStyle = { font: "32px Roboto", fill: "#ffffff", align: "center" };
            var arrowStyle = { font: "54px Roboto", fill: "#ffffff", align: "center" };
            var txt = this.game.make.text(this.game.width / 2, 160, "W 1", style);
            txt.x -= .5 * txt.width;
            txt.y -= .5 * txt.height;
            txt.fontWeight = 'bold';
            var groupBg = this.game.make.graphics(0, 0);
            groupBg.beginFill(0);
            groupBg.drawRect(0, 0, WIDTH, HEIGHT);
            group.addChild(groupBg);
            group.addChild(txt);
            //create levels grid:
            menuGraphics.beginFill(0);
            menuGraphics.drawRect(0, 0, WIDTH, HEIGHT);
            menuGraphics.endFill();
            //menuGraphics.lineStyle(4, 0x555555, 255);
            //menuGraphics.drawRect(20, 100, WIDTH - 40, 70);
            menuGraphics.lineStyle(4, 0xffffff, 255);
            menuGraphics.drawRect(20, 20, WIDTH - 40, HEIGHT - 40);
            menuGraphics.lineStyle(6, 0xffffff, 255);
            menuGraphics.drawRect(30, 30, WIDTH - 60, HEIGHT - 60);
            //render level buttons:
            var width = 130;
            var idx = 1;
            for (var i = 0; i < 3; ++i) {
                var cols = (i % 2 == 0) ? 5 : 6;
                for (var j = 0; j < cols; ++j) {
                    var x = 180 + (.5 * (1 - i % 2) + j) * width;
                    var y = 280 + .85 * i * width;
                    var lineColor = idx < 10 ? 0xffffff : 0x555555;
                    this.renderHex(menuGraphics, lineColor, x, y, width);
                    txt = this.game.make.text(x, y, "" + idx, numStyle);
                    txt.addColor('#' + lineColor.toString(16), 0);
                    txt.fontWeight = 'bold';
                    txt.y -= .5 * txt.height + 15;
                    txt.x -= .5 * txt.width;
                    group.addChild(txt);
                    ++idx;
                    var starString = "";
                    var starCount = idx < 10 ? this.game.rnd.integerInRange(0, 3) : 0;
                    var sIdx = 0;
                    while (sIdx++ < starCount)
                        starString += "★";
                    while (starString.length < 3)
                        starString += "☆";
                    txt = this.game.make.text(x, y, starString, starStyle);
                    txt.addColor('#' + lineColor.toString(16), 0);
                    //txt.addColor('#888888', starCount);
                    txt.y -= .5 * txt.height - 15;
                    txt.x -= .5 * txt.width;
                    group.addChild(txt);
                }
            }
            this.renderHex(menuGraphics, 0xffffff, 160, 160, 120);
            txt = this.game.make.text(160, 160, "▶", arrowStyle);
            txt.scale.x = -1;
            txt.y -= .45 * txt.height;
            txt.x -= .4 * txt.width;
            group.addChild(txt);
            this.renderHex(menuGraphics, 0xffffff, this.game.width - 160, 160, 120);
            txt = this.game.make.text(this.game.width - 160, 160, "▶", arrowStyle);
            txt.y -= .45 * txt.height;
            txt.x -= .4 * txt.width;
            group.addChild(txt);
            this.renderHex(menuGraphics, 0xffffff, 310, this.game.height - 130, 140);
            txt = this.game.make.text(310, this.game.height - 130, "⏰", style);
            txt.y -= .5 * txt.height;
            txt.x -= .5 * txt.width;
            group.addChild(txt);
            //render score:
            txt = this.game.make.text(this.game.width / 2 - 100, this.game.height - 130, "HIGHSCORE: 00302456", scoreStyle);
            txt.y -= .5 * txt.height;
            //txt.x -= .5 * txt.width;
            group.addChild(txt);
        };
        return GuiRenderer;
    })();
    BlokjesGame.GuiRenderer = GuiRenderer;
})(BlokjesGame || (BlokjesGame = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="guiRenderer.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var WIDTH = 1024;
    var HEIGHT = 768;
    var SimpleGame = (function () {
        function SimpleGame() {
            this.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, preRender: this.preRender, render: this.render });
        }
        SimpleGame.prototype.preload = function () {
            this.game.load.shader("tvShader", 'tvShader.frag');
            this.game.load.image("background", "background.png");
        };
        SimpleGame.prototype.doSomething = function () {
        };
        SimpleGame.prototype.create = function () {
            //background image:
            var img = this.game.add.image(0, 0, "background");
            //create levels grid:
            var group = this.game.add.group();
            var menuGraphics = this.game.make.graphics(0, 0);
            var renderer = new BlokjesGame.GuiRenderer();
            renderer.renderGui(this.game, menuGraphics, group);
            //create shader
            this.shader = new Phaser.Filter(this.game, null, this.game.cache.getShader('tvShader'));
            this.shader.uniforms.uBackground = { type: 'sampler2D', value: img.texture, textureData: { repeat: false } };
            this.shader.uniforms.uMenuTexture = { type: 'sampler2D', value: menuGraphics.generateTexture(), textureData: { repeat: false } };
            this.shader.uniforms.uTextTexture = { type: 'sampler2D', value: group.generateTexture(), textureData: { repeat: false } };
            //render shader on quad:
            var gr = this.game.add.graphics(0, 0);
            gr.beginFill(0x0);
            gr.drawRect(0, 0, WIDTH, HEIGHT);
            gr.endFill();
            gr.filters = [this.shader];
        };
        SimpleGame.prototype.update = function () {
            this.shader.update(this.game.input.mousePointer);
        };
        SimpleGame.prototype.preRender = function () {
        };
        SimpleGame.prototype.render = function () {
        };
        return SimpleGame;
    })();
    BlokjesGame.SimpleGame = SimpleGame;
})(BlokjesGame || (BlokjesGame = {}));
window.onload = function () {
    var game = new BlokjesGame.SimpleGame();
};
