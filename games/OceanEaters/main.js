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
    var Ocean = /** @class */ (function (_super) {
        __extends(Ocean, _super);
        function Ocean(w, h) {
            var _this = _super.call(this) || this;
            var texture = PIXI.Texture.fromImage('assets/ripples.png');
            var uniforms = {
                uTimeParam: { type: 'f', value: 0 },
                uPlayerAngle: { type: 'f', value: 0 },
                uResolution: { type: 'v2', value: { x: 0, y: 0 } },
                uScreenSize: { type: 'v2', value: { x: 0, y: 0 } },
                uPlayerPosition: { type: 'v2', value: { x: 0, y: 0 } },
                uPlayerDirection: { type: 'v2', value: { x: 0, y: 0 } },
                uTexture: { type: 'sampler2D', value: texture }
            };
            var shader = new PIXI.Filter(null, PIXI.loader.resources.oceanShader.data, uniforms);
            _this.shader = shader;
            // this.filters = [shader];
            _this.shaderTime = 0;
            _this.beginFill(0xff0000, 1);
            _this.drawRect(0, 0, w, h);
            _this.endFill();
            return _this;
        }
        Ocean.prototype.resetLayout = function (x, y, w, h) {
            w = 800;
            h = 600;
            y = h / 2;
            this.position.x = x;
            this.position.y = y;
            this.width = w;
            this.height = h;
            this.clear();
            this.beginFill(0xff0000, 1);
            this.drawRect(0, 0, w, h);
            this.endFill();
        };
        Ocean.prototype.updateFrame = function (dt, pPos, pDir) {
            this.shaderTime = (this.shaderTime + dt / 10.0) % 1.0;
            // this.shader.uniforms.uTimeParam.value = this.shaderTime;
            // this.shader.uniforms.uResolution.value = { x:this.width, y:this.height };
            // this.shader.uniforms.uScreenSize.value = { x:this.width, y:this.height };
            // this.shader.uniforms.uPlayerPosition.value = { x:-pPos.y, y:pPos.x };
            // this.shader.uniforms.uPlayerDirection.value = { x:Math.cos(pDir), y:Math.sin(pDir) };
            // this.shader.uniforms.uPlayerAngle.value = pDir;
            // this.shader.update(); 
        };
        return Ocean;
    }(PIXI.Graphics));
    OceanEaters.Ocean = Ocean;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Ocean.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(w, h) {
            return _super.call(this, w, h, { antialias: true, backgroundColor: 0x1099bb }) || this;
            /*
            var graphics = new PIXI.Graphics();

            // set a fill and line style
            graphics.beginFill(0xFF3300);
            graphics.lineStyle(10, 0xffd900, 1);
            graphics.position.y = 100;

            var sr = Math.random() * 50.0;
        
            // draw a shape
            graphics.moveTo(sr,sr);
            graphics.lineTo(250, 50);
            graphics.lineTo(100, 100);
            graphics.lineTo(250, 220);
            graphics.lineTo(50, 220);
            graphics.lineTo(sr, sr);
            graphics.endFill();
        
            this.stage.addChild(graphics);
            */
        }
        Game.prototype.setup = function () {
            this.ticker.add(this.update, this);
            this.debugText = new PIXI.Text('Basic text in pixi');
            this.debugText.x = 20;
            this.debugText.y = 10;
            this.stage.addChild(this.debugText);
            this.ocean = new OceanEaters.Ocean(this.stage.width, .5 * this.stage.height);
            this.ocean.resetLayout(0, .5 * this.stage.height, this.stage.width, this.stage.height);
            this.stage.addChild(this.ocean);
            this.playerPos = new PIXI.Point(0, 0);
            this.playerDir = 0;
        };
        Game.prototype.resize = function (w, h) {
            // this.game.scale.setGameSize(w, h);
        };
        Game.prototype.update = function (dtMs) {
            var dt = 1000 * dt;
            this.debugText.text = "FPS: " + Math.round(1.0 / this.ticker.elapsedMS);
            this.ocean.updateFrame(dt, this.playerPos, this.playerDir);
        };
        return Game;
    }(PIXI.Application));
    OceanEaters.Game = Game;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Game.ts"/>
window.onload = function () {
    var app = new OceanEaters.Game(800, 600);
    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);
    PIXI.loader.add('oceanShader', 'assets/oceanShader.frag')
        .add('ripples', 'assets/ripples.png');
    PIXI.loader.load(function (loader, resources) {
        app.setup();
    });
};
