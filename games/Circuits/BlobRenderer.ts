///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Blob.ts"/>

module BlokjesGame 
{
    export class BlobRenderer {
    
        game:Phaser.Game;
        
        topLeft:Phaser.Point;
        blobStamp:Phaser.BitmapData;
        uvBmp:Phaser.BitmapData;
        shader:Phaser.Filter;
        dataTexture:Phaser.BitmapData;
        
        blobIndex:number;
        resolveAlphaFactor:number;
        
        constructor(game:Phaser.Game) {
            
            this.game = game;
            
            //Create Stamp:
            this.blobStamp = game.make.bitmapData(GRIDWIDTH, GRIDWIDTH);
            this.blobStamp.fill(0, 0, 0, 0);
            var delta:number = 255.0 / (GRIDWIDTH - 1);
            for(var i:number=0; i<GRIDWIDTH; ++i) {
                for(var j:number=0; j<GRIDWIDTH; ++j) {
                    this.blobStamp.setPixel(j, i, j * delta, i * delta, 0, false);
                }
            }
            this.blobStamp.setPixel(0,0,0,0,0);
            
            //make textures (noise + data texture):
            this.dataTexture = game.make.bitmapData(256, 256);
            this.dataTexture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
            this.game.add.image(-256,0,this.dataTexture);//.alpha = .2;
            
            var noiseSprite = game.add.sprite(-256,0,'noise');
           
            //set main BitmapData:
            this.uvBmp = game.add.bitmapData(game.width, game.height);
            var uvBmpContainerSprite = game.add.sprite(0, 0, this.uvBmp);
            this.uvBmp.context.globalCompositeOperation = 'lighter';
            
            //init shader:
            this.shader = new Phaser.Filter(game, null, game.cache.getShader('blobShader'));
            this.shader.uniforms.uNoiseTexture = { type: 'sampler2D', value: noiseSprite.texture, textureData: { repeat: true } };
            this.shader.uniforms.uDataTexture = { type: 'sampler2D', value: this.dataTexture, textureData: { repeat: false } };
            uvBmpContainerSprite.filters = [ this.shader ];
            
            this.topLeft = new Phaser.Point();
            this.topLeft.x = (this.game.width - COLUMNCOUNT * GRIDWIDTH) / 2;
            this.topLeft.y = (this.game.height - VISIBLEROWCOUNT * GRIDWIDTH) / 2;
        }
        
        update() {
            this.shader.update();
        }
        
        begin(resolveAlphaFactor:number) {
            this.uvBmp.clear();
            this.uvBmp.fill(0,0,0,0);
            this.blobIndex = 0;
            this.resolveAlphaFactor = resolveAlphaFactor;
            this.drawDebugBlob();
        }
        
        drawDebugBlob() {
            var i:number = TOPROWCOUNT - (.5 * this.game.height / GRIDWIDTH - .5 * VISIBLEROWCOUNT);
            var j:number = -(.5 * this.game.width / GRIDWIDTH - .5 * COLUMNCOUNT)
            debugText = "[" + i + ", " + j + "]";
            this.drawBlobAtIndices(i,j,new Blob(this.game));
        }
        
        drawBlobAtIndices(i:number, j:number, blob:Blob) {
            
            var alpha = blob.removing ? Math.pow(1.0 - this.resolveAlphaFactor, 2.0) : 1.0;
            var colorIdx = blob.isBlocking ? -1 : (blob.typeIndex % COLORCODES.length);
            
            var y:number = this.topLeft.y + (i - TOPROWCOUNT) * GRIDWIDTH;
            var x:number = this.topLeft.x + j * GRIDWIDTH;
            x = Math.round(x);
            y = Math.round(y);
            
            //set alpha in data texture:
            this.dataTexture.setPixel(0, this.blobIndex, alpha * 255, 0, 0, false);
            
            //set base color in data texture:
            var cls = this.getFractColor(COLORCODES[colorIdx % COLORCODES.length]);
            this.dataTexture.setPixel(1, this.blobIndex, cls[0] * 255, cls[1] * 255, cls[2] * 255, false);
            
            //set UV + index data:
            this.uvBmp.draw(this.blobStamp, x, y, GRIDWIDTH, GRIDWIDTH);
            this.uvBmp.rect(x, y, GRIDWIDTH, GRIDWIDTH, 'rgba(0,0,' + this.blobIndex + ',1.0)');
            
            ++this.blobIndex;
        }
        
        end() {
            this.dataTexture.setPixel(255,255,0,0,0,true);
        }
        
        private getFractColor(color:number) : number[] {
            
            if(color < 0)
                return [0.3,0.3,0.3];
            
            var blue:number = color % 0x100;                //0x0000XX
            var green:number = (color - blue) % 0x10000;    //0x00XX00
            var red:number = (color - green - blue);        //0xXX0000
            
            blue = blue / 0xff;
            green = green / 0xff00;
            red = red / 0xff0000;
            
            return [red, green, blue];
        }
    }
}