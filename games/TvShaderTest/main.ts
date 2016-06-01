///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="guiRenderer.ts"/>

module BlokjesGame
{
    const WIDTH:number = 1024;
    const HEIGHT:number = 768;
    
    export class SimpleGame {
        
        game: Phaser.Game;
        shader: Phaser.Filter;
        
        constructor() {
            this.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, preRender: this.preRender, render: this.render });
        }
        
        preload() {
            this.game.load.shader("tvShader", 'tvShader.frag');
            this.game.load.image("background", "background.png");
        }
        
        doSomething() {
            
        }
        
        create() {
            
            //background image:
            var img = this.game.add.image(0,0,"background");
            
            //create levels grid:
            var group = this.game.add.group();
            var menuGraphics = this.game.make.graphics(0,0);
            var renderer = new GuiRenderer();
            renderer.renderGui(this.game, menuGraphics, group);
            
            //create shader
            this.shader = new Phaser.Filter(this.game, null, this.game.cache.getShader('tvShader'));
            this.shader.uniforms.uBackground = { type: 'sampler2D', value: img.texture, textureData: { repeat: false } };
            this.shader.uniforms.uMenuTexture = { type: 'sampler2D', value: menuGraphics.generateTexture(), textureData: { repeat: false } };
            this.shader.uniforms.uTextTexture = { type: 'sampler2D', value: group.generateTexture(), textureData: { repeat: false } };
            
            //render shader on quad:
            var gr:Phaser.Graphics = this.game.add.graphics(0,0);
            gr.beginFill(0x0);
            gr.drawRect(0,0,WIDTH,HEIGHT);
            gr.endFill();
            gr.filters = [ this.shader ];
        }
        
        update() {
            this.shader.update(this.game.input.mousePointer);
        }
        
        preRender() {
            
        }
        
        render() {
            
        }
    }
}

window.onload = () => {
    var game = new BlokjesGame.SimpleGame();
};