///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Blob.ts"/>

module BlokjesGame 
{
    export class BlobRenderer {
        
        bitmapData:Phaser.BitmapData;
        blobStamp:Phaser.BitmapData;
        blobShader:Phaser.Filter;
        graphics:Phaser.Graphics;
        
        constructor(game:Phaser.Game) {
            
            
            
            //super(game);
            
            //Create Stamp:
            this.blobStamp = game.make.bitmapData(256, 256);
            this.blobStamp.fill(0,0,0);
            for(var i:number=0; i<256.0; ++i) {
                for(var j:number=0; j<256.0; ++j) {
                    this.blobStamp.setPixel(j, i, j, i, 0, false);
                }
            }
            this.blobStamp.setPixel(0,0,0,0,0);
            
            //create shader:
            this.blobShader = new Phaser.Filter(game, null, game.cache.getShader('blobShader'));
            //this.filters = [ this.blobShader ];
            
            this.graphics = game.add.graphics(0,0);
            //this.graphics.filters = [this.blobShader];
            this.graphics.beginFill(0xffff00);
            this.graphics.drawRect(0,0,game.width, game.height);
            this.graphics.endFill();
            
            //create canvas:
            this.bitmapData = game.make.bitmapData(game.width, game.height);
            var img = game.add.image(0, 0, this.bitmapData);
            img.filters = [ this.blobShader ];
            //this.addChild(img);
            
        }
        
        begin() {
            
            this.bitmapData.clear();
            this.bitmapData.fill(0,0,0,0);
            this.blobShader.update();
        }
        
        renderBlob(blob:Blob, x:number, y:number, alpha:number) {
              
            
            //this.bitmapData.draw(this.blobStamp, x, y, GRIDWIDTH, GRIDWIDTH);
        }
    }
}