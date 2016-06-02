///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="guiRenderer.ts"/>

module BlokjesGame
{
    export class MainState extends Phaser.State {
        
        shader: Phaser.Filter;
        
        textGroup : Phaser.Group;
        menuGraphics : Phaser.Graphics;
        renderer : BlokjesGame.GuiRenderer;
        
        constructor() {
            super();
        }
        

        preload() {
            this.game.load.shader("tvShader", 'tvShader.frag');
            this.game.load.image("background", "background.png");
            this.game.load.image("button", "btn.png");
        }
        
        create() {
            //background image:
            var img = this.game.add.image(0,0,"background");
            
            //create levels grid:
            this.textGroup = this.game.add.group();
            this.menuGraphics = this.game.make.graphics(0,0);
            this.renderer = new GuiRenderer(this.game);
            //renderer.renderGui(menuGraphics, group);
            
            //create shader
            this.shader = new Phaser.Filter(this.game, null, this.game.cache.getShader('tvShader'));
            this.shader.uniforms.uBackground = { type: 'sampler2D', value: img.texture, textureData: { repeat: false } };
            
            //render shader on quad:
            var gr:Phaser.Graphics = this.game.add.graphics(0,0);
            gr.beginFill(0x0);
            gr.drawRect(0, 0, this.game.width, this.game.height);
            gr.endFill();
            gr.filters = [ this.shader ];
            
            var funcs = [this.renderLevelSelect, this.renderPause, this.unimplClick];
            for(var i:number=0; i<3; ++i) {
                var btn = this.game.add.button(0, this.game.height, 'button', funcs[i], this);
                btn.scale = new Phaser.Point(.25, .25);
                btn.y -= btn.height + 5;
                btn.x = 5 + i * (btn.width + 5);
            }
            
            this.renderLevelSelect();
        }
        
        unimplClick() {
            alert('not yet implemented...');
        }
        
        bindTextures() {
            this.shader.uniforms.uMenuTexture = { type: 'sampler2D', value: this.menuGraphics.generateTexture(), textureData: { repeat: false } };
            this.shader.uniforms.uTextTexture = { type: 'sampler2D', value: this.textGroup.generateTexture(), textureData: { repeat: false } };
        }
        
        renderLevelSelect() {
            this.renderer.renderLevelSelect(this.menuGraphics, this.textGroup);
            this.bindTextures();
        }
        
        renderPause() {
            this.renderer.renderPause(this.menuGraphics, this.textGroup);
            this.bindTextures();
        }
        
        render() {
            
        }
        
        update( ) {
            this.shader.update(this.game.input.mousePointer);                     
        }
    }
}