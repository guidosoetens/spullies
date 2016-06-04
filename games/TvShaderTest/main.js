var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../../phaser/phaser.d.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var WIDTH = 1024;
    var HEIGHT = 768;
    var GuiRenderer = (function () {
        function GuiRenderer(game) {
            this.game = game;
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
        GuiRenderer.prototype.renderPause = function (menuGraphics, group) {
            menuGraphics.clear();
            group.removeAll(true);
            //text container:
            var style = { font: "65px Courier New", fill: "#ffffff", align: "center" };
            var scoreStyle = { font: "32px Courier New", fill: "#ffffff", align: "center" };
            var numStyle = { font: "46px Courier New", fill: "#ffffff", align: "center" };
            var starStyle = { font: "32px Roboto", fill: "#ffffff", align: "center" };
            var arrowStyle = { font: "54px Roboto", fill: "#ffffff", align: "center" };
            var txt = this.game.make.text(this.game.width / 2, 160, "- PAUSE -", style);
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
        };
        GuiRenderer.prototype.renderLevelSelect = function (menuGraphics, group) {
            menuGraphics.clear();
            group.removeAll(true);
            //text container:
            var style = { font: "65px Courier New", fill: "#ffffff", align: "center" };
            var scoreStyle = { font: "32px Courier New", fill: "#ffffff", align: "center" };
            var numStyle = { font: "46px Courier New", fill: "#ffffff", align: "center" };
            var starStyle = { font: "32px Roboto", fill: "#ffffff", align: "center" };
            var arrowStyle = { font: "54px Roboto", fill: "#ffffff", align: "center" };
            var txt = this.game.make.text(this.game.width / 2, 160, "WORLD 1", style);
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
            txt.y -= .5 * txt.height;
            txt.x -= .4 * txt.width;
            group.addChild(txt);
            this.renderHex(menuGraphics, 0xffffff, this.game.width - 160, 160, 120);
            txt = this.game.make.text(this.game.width - 160, 160, "▶", arrowStyle);
            txt.y -= .5 * txt.height;
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
    }());
    BlokjesGame.GuiRenderer = GuiRenderer;
})(BlokjesGame || (BlokjesGame = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="guiRenderer.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var MainState = (function (_super) {
        __extends(MainState, _super);
        function MainState() {
            _super.call(this);
        }
        MainState.prototype.preload = function () {
            this.game.load.shader("tvShader", 'tvShader.frag');
            this.game.load.shader("bgShader", 'backgroundShader.frag');
            this.game.load.image("background", "background.png");
            this.game.load.image("button", "btn.png");
        };
        MainState.prototype.create = function () {
            /*
            //background image:
            var img = this.game.add.image(0,0,"background");
            */
            //background graphics:
            var bgGraphics = this.game.add.graphics(0, 0);
            bgGraphics.beginFill(0xff0000);
            bgGraphics.drawRect(0, 0, this.game.width, this.game.height);
            bgGraphics.endFill();
            //create levels grid:
            this.textGroup = this.game.add.group();
            this.menuGraphics = this.game.make.graphics(0, 0);
            this.renderer = new BlokjesGame.GuiRenderer(this.game);
            //renderer.renderGui(menuGraphics, group);
            //create shaders
            this.bgShader = new Phaser.Filter(this.game, null, this.game.cache.getShader('bgShader'));
            this.tvShader = new Phaser.Filter(this.game, null, this.game.cache.getShader('tvShader'));
            this.bgGroup = this.game.add.group();
            this.bgGroup.addChild(bgGraphics);
            bgGraphics.filters = [this.bgShader];
            //render shader on quad:
            this.tvGraphics = this.game.add.graphics(0, 0);
            this.tvGraphics.beginFill(0x0);
            this.tvGraphics.drawRect(0, 0, this.game.width, this.game.height);
            this.tvGraphics.endFill();
            this.tvGraphics.filters = [this.tvShader];
            var btn;
            var funcs = [this.renderLevelSelect, this.renderPause, this.unimplClick];
            for (var i = 0; i < 3; ++i) {
                btn = this.game.add.button(0, this.game.height, 'button', funcs[i], this);
                btn.scale = new Phaser.Point(.25, .25);
                btn.y -= btn.height + 5;
                btn.x = 5 + i * (btn.width + 5);
            }
            this.renderLevelSelect();
            btn = this.game.add.button(5, 5, 'button', this.swapTerminalEffect, this);
            btn.scale = new Phaser.Point(.25, .25);
        };
        MainState.prototype.unimplClick = function () {
            alert('not yet implemented...');
        };
        MainState.prototype.swapTerminalEffect = function () {
            this.tvGraphics.visible = !this.tvGraphics.visible;
        };
        MainState.prototype.bindTextures = function () {
            this.tvShader.uniforms.uMenuTexture = { type: 'sampler2D', value: this.menuGraphics.generateTexture(), textureData: { repeat: false } };
            this.tvShader.uniforms.uTextTexture = { type: 'sampler2D', value: this.textGroup.generateTexture(), textureData: { repeat: false } };
            this.tvShader.uniforms.uBackground = { type: 'sampler2D', value: this.bgGroup.generateTexture() /*img.texture*/, textureData: { repeat: false } };
        };
        MainState.prototype.renderLevelSelect = function () {
            this.renderer.renderLevelSelect(this.menuGraphics, this.textGroup);
            this.bindTextures();
        };
        MainState.prototype.renderPause = function () {
            this.renderer.renderPause(this.menuGraphics, this.textGroup);
            this.bindTextures();
        };
        MainState.prototype.render = function () {
        };
        MainState.prototype.update = function () {
            var pt = this.game.input.mousePointer;
            this.tvShader.update(pt);
            this.bgShader.update(pt);
            this.tvShader.uniforms.uBackground.value = this.bgGroup.generateTexture();
        };
        return MainState;
    }(Phaser.State));
    BlokjesGame.MainState = MainState;
})(BlokjesGame || (BlokjesGame = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="MainState.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var WIDTH = 1024;
    var HEIGHT = 768;
    var SimpleGame = (function () {
        function SimpleGame() {
            this.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'content');
            this.game.state.add("MainState", BlokjesGame.MainState, true);
        }
        return SimpleGame;
    }());
    BlokjesGame.SimpleGame = SimpleGame;
})(BlokjesGame || (BlokjesGame = {}));
window.onload = function () {
    var game = new BlokjesGame.SimpleGame();
};
