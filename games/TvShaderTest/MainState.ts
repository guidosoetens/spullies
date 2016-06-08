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
        hexTexImage : Phaser.Image;
        
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
            
            this.generateHexTex();
            
            this.bgGroup = this.game.add.group();
            this.bgGroup.addChild(bgGraphics);
            bgGraphics.filters = [ this.bgShader ];
            
            //render shader on quad:
            this.tvGraphics = this.game.add.graphics(0,0);
            this.tvGraphics.beginFill(0x0);
            this.tvGraphics.drawRect(0, 0, this.game.width, this.game.height);
            this.tvGraphics.endFill();
            this.tvGraphics.filters = [ this.tvShader ];
            this.tvGraphics.visible = false;
            
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
        
        generateHexTex() {
            
            var textureTargetBitmap = this.game.make.bitmapData(256, 256);
            
            //assume rad = 1;
            var deg30 = Math.PI / 6.0;
            var deg60 = 2 * deg30;
            var h:number = Math.cos(deg30);
            
            for(var i:number=0; i<256; ++i) {
                 for(var j:number=0; j<256; ++j) {
                     var update:boolean = i == 255 && j == 255;
                     var factor:number = (i < 5 || i > 250 || j < 5 || j > 250) ? 0 : 1;
                     
                     var x:number = 2 * (j + .5) / 256.0 - 1;
                     var y:number = (2 * (i + .5) / 256.0 - 1) * h; 
                     
                     /*
                     var checks:number = 3.0;
                    // var checkXVal = Math.abs((x - .5) * checks);
                     var checkX = (Math.abs(x + 100) * checks) % 1.0 < .5;
                     //var checkYVal = Math.abs((y - .5) * checks);
                     var checkY = (Math.abs(y + 100) * checks) % 1.0 < .5;//checkYVal - Math.floor(checkYVal) < .5;
                     
                     var check = checkX ? checkY : !checkY;
                     if(check)
                        textureTargetBitmap.setPixel(j, i, 255, 255, 0, update);
                     else 
                        textureTargetBitmap.setPixel(j, i, 255, 0, 0, update);
                     */
                    
                    var angle = Math.abs(Math.atan2(y, x) % deg60);
                    var maxDist = Math.sin(deg60) / Math.sin(2 * deg60 - angle);
                    var dist = Math.sqrt(x * x + y * y);
                    var f = (dist / maxDist * 3.0) % 1.0;
                    
                    
                    textureTargetBitmap.setPixel(j, i, f * 255, f * 255, 0, update);
                    
                 }
            }
            
            this.hexTexImage = this.game.add.image(0,0,textureTargetBitmap);
            this.hexTexImage.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
            this.bgShader.uniforms.uHexTex = { type: 'sampler2D', value: this.hexTexImage.texture, textureData: { repeat: false } };
        }
        
        bindTextures() {
            this.tvShader.uniforms.uMenuTexture = { type: 'sampler2D', value: this.menuGraphics.generateTexture(), textureData: { repeat: false } };
            this.tvShader.uniforms.uTextTexture = { type: 'sampler2D', value: this.textGroup.generateTexture(), textureData: { repeat: false } };
            this.tvShader.uniforms.uBackground = { type: 'sampler2D', value: this.bgGroup.generateTexture() /*img.texture*/, textureData: { repeat: false } }; 
            //this.bgShader.uniforms.uHexTex = { type: 'sampler2D', value: this.hexTexImage.texture, textureData: { repeat: false } };
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