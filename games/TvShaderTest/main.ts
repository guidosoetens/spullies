///<reference path="../../phaser/phaser.d.ts"/>

module BlokjesGame
{
    const WIDTH:number = 1024;
    const HEIGHT:number = 768;
    
    export class SimpleGame {
        
        game: Phaser.Game;
        shader: Phaser.Filter;
        menuImageBitmapData:Phaser.BitmapData;
        
        constructor() {
            this.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, preRender: this.preRender, render: this.render });
        }
        
        preload() {
            this.game.load.shader("tvShader", 'tvShader.frag');
            this.game.load.image("background", "background.png")
        }
        
        create() {
            
            var img = this.game.add.image(0,0,"background");
          
            //motion image:
            this.menuImageBitmapData = this.game.make.bitmapData(WIDTH, HEIGHT);
            var menuImage = this.game.add.image(0, 0, this.menuImageBitmapData);
            menuImage.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
            
            var menuGraphics = this.game.add.graphics(0,0);
            menuGraphics.beginFill(0);
            menuGraphics.drawRect(0,0,WIDTH,HEIGHT);
            menuGraphics.endFill();
            menuGraphics.lineStyle(4,0xffffff,1.0);
            menuGraphics.drawCircle(100,100,50);
            menuGraphics.drawCircle(200,100,50);
            
            this.shader = new Phaser.Filter(this.game, null, this.game.cache.getShader('tvShader'));
            this.shader.uniforms.uBackground = { type: 'sampler2D', value: img.texture, textureData: { repeat: false } };
            this.shader.uniforms.uMenuTexture = { type: 'sampler2D', value: menuGraphics.generateTexture(), textureData: { repeat: false } };
            //this.shader.uniforms.uResolution = { type: '2f', value: { x: MOTION_WIDTH, y: MOTION_HEIGHT } };
            
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