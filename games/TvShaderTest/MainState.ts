///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="guiRenderer.ts"/>

module BlokjesGame
{
    export class MainState extends Phaser.State {
        
        bgShader: Phaser.Filter;
        tvShader: Phaser.Filter;
        
        tvGraphics : Phaser.Graphics;
        bgGroup: Phaser.Group;
        
        textGroup : Phaser.Group;
        menuGraphics : Phaser.Graphics;
        renderer : BlokjesGame.GuiRenderer;
        
        constructor() {
            super();
        }
        

        preload() {
            this.game.load.shader("tvShader", 'tvShader.frag');
            this.game.load.shader("bgShader", 'backgroundShader.frag');
            this.game.load.image("background", "background.png");
            this.game.load.image("button", "btn.png");
        }
        
        create() {
            
            /*
            //background image:
            var img = this.game.add.image(0,0,"background");
            */
            
            //background graphics:
            var bgGraphics:Phaser.Graphics = this.game.add.graphics(0,0);
            bgGraphics.beginFill(0xff0000);
            bgGraphics.drawRect(0,0,this.game.width,this.game.height);
            bgGraphics.endFill();
            
            //create levels grid:
            this.textGroup = this.game.add.group();
            this.menuGraphics = this.game.make.graphics(0,0);
            this.renderer = new GuiRenderer(this.game);
            //renderer.renderGui(menuGraphics, group);
            
            //create shaders
            this.bgShader = new Phaser.Filter(this.game, null, this.game.cache.getShader('bgShader'));
            this.tvShader = new Phaser.Filter(this.game, null, this.game.cache.getShader('tvShader'));
            
            this.bgGroup = this.game.add.group();
            this.bgGroup.addChild(bgGraphics);
            bgGraphics.filters = [ this.bgShader ];
            
            //render shader on quad:
            this.tvGraphics = this.game.add.graphics(0,0);
            this.tvGraphics.beginFill(0x0);
            this.tvGraphics.drawRect(0, 0, this.game.width, this.game.height);
            this.tvGraphics.endFill();
            this.tvGraphics.filters = [ this.tvShader ];
            
            var btn:Phaser.Button;
            var funcs = [this.renderLevelSelect, this.renderPause, this.unimplClick];
            for(var i:number=0; i<3; ++i) {
                btn = this.game.add.button(0, this.game.height, 'button', funcs[i], this);
                btn.scale = new Phaser.Point(.25, .25);
                btn.y -= btn.height + 5;
                btn.x = 5 + i * (btn.width + 5);
            }
            
            this.renderLevelSelect();
            
            btn = this.game.add.button(5, 5, 'button', this.swapTerminalEffect, this);
            btn.scale = new Phaser.Point(.25, .25);
        }
        
        unimplClick() {
            alert('not yet implemented...');
        }
        
        swapTerminalEffect() {
            
            this.tvGraphics.visible = !this.tvGraphics.visible;
            
        }
        
        bindTextures() {
            this.tvShader.uniforms.uMenuTexture = { type: 'sampler2D', value: this.menuGraphics.generateTexture(), textureData: { repeat: false } };
            this.tvShader.uniforms.uTextTexture = { type: 'sampler2D', value: this.textGroup.generateTexture(), textureData: { repeat: false } };
            this.tvShader.uniforms.uBackground = { type: 'sampler2D', value: this.bgGroup.generateTexture() /*img.texture*/, textureData: { repeat: false } };         
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
        
        update() {
            var pt = this.game.input.mousePointer;
            this.tvShader.update(pt);        
            this.bgShader.update(pt);    
            this.tvShader.uniforms.uBackground.value = this.bgGroup.generateTexture();              
        }
    }
}