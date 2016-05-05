///<reference path="../../phaser/phaser.d.ts"/>

const COLORCODES:number[] = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff, 0x00ffff];

class BlobRenderer {
    
    game:Phaser.Game;
    
    stampImage:Phaser.Image;
    uvBmp:Phaser.BitmapData;
    shader:Phaser.Filter;
    dataTexture:Phaser.BitmapData;
    
    
    constructor(game:Phaser.Game) {
        
        this.game = game;
        
        //Create Stamp:
        var blobStamp = game.make.bitmapData(256, 256);
        blobStamp.fill(0, 0, 0, 0);
        for(var i:number=0; i<256.0; ++i) {
            for(var j:number=0; j<256.0; ++j) {
                blobStamp.setPixel(j, i, j, i, 0, false);
            }
        }
        blobStamp.setPixel(0,0,0,0,0);
        this.stampImage = game.add.image(0, 0, blobStamp);
        
        this.dataTexture = game.make.bitmapData(256, 256);
        //this.dataTexture.baseTexture.mipmap = false;
        this.dataTexture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        var dataSprite = this.game.add.sprite(0, 0, this.dataTexture);
        
        var noiseSprite = this.game.add.sprite(0,0,'noise');// new Phaser.Sprite(this.game, 0, 0, 'noise');
        
        this.uvBmp = game.add.bitmapData(.3 * game.width, game.height);
        var uvBmpContainerSprite = game.add.sprite(0, 0, this.uvBmp);
        this.uvBmp.context.globalCompositeOperation = 'lighter';
        
        //init shader:
        this.shader = new Phaser.Filter(game, null, game.cache.getShader('shader'));
        this.shader.uniforms.uNoiseTexture =  { type: 'sampler2D', value: noiseSprite.texture, textureData: { repeat: true } };
        this.shader.uniforms.uDataTexture =  { type: 'sampler2D', value: this.dataTexture, textureData: { repeat: false } };
        uvBmpContainerSprite.filters = [ this.shader ];
        
    }
    
    update() {
        this.shader.update();
    }
    
    startRender() {
        this.uvBmp.clear();
        this.uvBmp.fill(0,0,0,0);
    }
    
    render(i:number, j:number, idx:number, alpha:number) {
        
        var rows:number = 16;//12;
        var cols:number = 16;//6;
        
        var width:number = this.uvBmp.width / cols;
        var height:number = this.uvBmp.height / rows;
        
        for(var i:number=0; i<rows; ++i) {
            
            var y:number = i * height;
            
            for(var j:number=0; j<cols; ++j) {
                
                var x:number = j * width;
                
                var idx:number = i * cols + j;
                
                var alpha = j / (cols - 1);// 1.0;// (idx % 4) / 3.0;
                
                //set alpha in data texture:
                this.dataTexture.setPixel(0, idx, alpha * 255, 0, 0, false);
                
                //set base color in data texture:
                var cls = this.getFractColor(COLORCODES[i % COLORCODES.length]);
                this.dataTexture.setPixel(1, idx, cls[0] * 255, cls[1] * 255, cls[2] * 255, false);
                
                
                //sprite.alpha = frac;
                //sprite.blendMode = PIXI.blendModes.SATURATION;
                this.uvBmp.draw(this.stampImage, x, y, width, height);
                this.uvBmp.rect(x, y, width, height, 'rgba(0,0,' + idx + ',1.0)');
                
                
                //this.uvBmp.context.rect(0,0,width,height);
                //this.uvBmp.context.drawImage(sprite, 0, 0);
                //this.uvBmp.context.fillStyle = 'rgba(0,0,100,0.5)';
                //this.uvBmp.context.fillRect(0, 0, this.game.width, this.game.height);
                //this.uvBmp.end
            }
        }
        
        this.dataTexture.setPixel(255,255,0,0,0,true);
    }
    
    private getFractColor(color:number) : number[] {
        
        var blue:number = color % 0x100;                //0x0000XX
        var green:number = (color - blue) % 0x10000;    //0x00XX00
        var red:number = (color - green - blue);        //0xXX0000
        
        blue = blue / 0xff;
        green = green / 0xff00;
        red = red / 0xff0000;
        
        return [red, green, blue];
    }
}

class SimpleGame {

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }

    game: Phaser.Game;
    renderer:BlobRenderer;

    preload() {
        this.game.load.image('logo', 'peachy.png');
        this.game.load.shader('shader', 'shader.frag');
        this.game.load.image('noise', "noise.jpg");
    }

    create() {
        //var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        //logo.anchor.setTo(0.5, 0.5);
        
        this.renderer = new BlobRenderer(this.game);
    }
    
    update() {
        this.renderer.update();
    }
    
    render() {
        //this.renderer.render();
    }
}

window.onload = () => {

    var game = new SimpleGame();

};