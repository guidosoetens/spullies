///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Defs.ts"/>

module BlokjesGame
{
    export class Blob {
        
        private dxs:number[] = [GRIDWIDTH / 3,0,-GRIDWIDTH / 3,0];
        private dys:number[] = [0,GRIDWIDTH / 3,0,-GRIDWIDTH / 3];
        
        isBlocking:boolean;
        typeIndex:number;
        removing:boolean;
        testSource:Blob;
        chainedToNeighbor:boolean[];
        dropping:boolean;
        dropFromRow:number;
        
        constructor(game:Phaser.Game) {//typeIndex:number) {
            
            this.isBlocking = false;
            this.typeIndex = 0;//typeIndex;
            this.removing = false;
            this.testSource = null;
            this.chainedToNeighbor = [false, false, false, false];
            this.dropping = false;
            this.dropFromRow = 0;
            
            /*
            this.blobShader = new Phaser.Filter(this.game, null, this.game.cache.getShader('blobShader'));
            this.filters = [ this.blobShader ];
            //this.blobShader.uniforms.uSourceColor =  { type: '3f', value: [1.0, 1.0, 0.0] };
            this.blobShader.uniforms.uSourceColor =  { type: '3f', value: { x:0, y:0, z:0 } };
            this.blobShader.uniforms.uAlpha =  { type: '1f', value: 1.0 };
            this.blobShader.uniforms.uWidth =  { type: '1f', value: 1.0 };
            this.blobShader.uniforms.uGlobalOrigin =  { type: '2f', value: { x:0, y:0 } };
            this.blobShader.uniforms.uCenterType = { type: '1i', value: 0 };
            
            
            this.blobShader.uniforms.uNoiseTexture =  { type: 'sampler2D', value: noiseSprite.texture, textureData: { repeat: true } }
            */
            //uNoiseTexture
            
            
            //this.width = gridWidth;
            //this.height = gridWidth;
            
            /*
            this.beginFill(0xffffff, 1);
            this.drawRect(0,0,GRIDWIDTH, GRIDWIDTH);
            this.endFill();
            */
            
        }
        
        renderAtSlot(renderer:BlobRenderer, i:number, j:number, alphaFactor:number) {
            
            //this.position.x = x;
            //this.position.y = y;
            
            /*
            var alpha:number = this.removing ? Math.pow(1.0 - alphaFactor, 2.0) : 1.0;
            if(this.removing)
                debugText = "" + alpha;
                
            renderer.drawBlob(i, j, this.isBlocking ? -1 : this.typeIndex, alpha);
                */
            //alpha = 0.00001;
            //alpha = 0.0;
            /*
            this.clear();
            this.alpha = alpha;
            this.beginFill(0x0, alpha);
            this.drawRect(0,0,gridWidth, gridWidth);
            this.endFill();
            */
            /*
            var color:number = COLORCODES[this.typeIndex];
            if(this.isBlocking) {
                color = 0x0;
            }
            
            var cls:number[] = this.getFractColor(color);
            
            this.blobShader.update();
            this.blobShader.uniforms.uSourceColor.value.x = cls[0];
            this.blobShader.uniforms.uSourceColor.value.y = cls[1];
            this.blobShader.uniforms.uSourceColor.value.z = cls[2];
            this.blobShader.uniforms.resolution.value.x = this.game.width;
            this.blobShader.uniforms.resolution.value.y = this.game.height;
            this.blobShader.uniforms.uAlpha.value = alpha;
            this.blobShader.uniforms.uCenterType.value = this.isBlocking ? -1 : this.typeIndex;
            
            this.blobShader.uniforms.uWidth.value = GRIDWIDTH;// =  { type: '1f', value: 1.0 };
            this.blobShader.uniforms.uGlobalOrigin.value.x = x;// =  { type: '2f', value: { x:0, y:0 } };
            this.blobShader.uniforms.uGlobalOrigin.value.y = (this.game.height - y);
            */
            //debugText = this.blobShader.uniforms.resolution.value.x + " : " + this.blobShader.uniforms.resolution.value.y;
        }
        
        /*
        private getFractColor(color:number) : number[] {
            
            var blue:number = color % 0x100;                //0x0000XX
            var green:number = (color - blue) % 0x10000;    //0x00XX00
            var red:number = (color - green - blue);        //0xXX0000
            
            blue = blue / 0xff;
            green = green / 0xff00;
            red = red / 0xff0000;
            
            return [red, green, blue];
        }*/
        
        
        
        /*
        update() {
            
        }
        
        render(graphics:Phaser.Graphics, x:number, y:number, alphaParameter:number) {
            
            var alpha:number = this.removing ? (1.0 - alphaParameter) : 1.0;
            
            var color:number = colorCodes[this.typeIndex];
            if(this.isBlocking) {
                color = 0x777777;
            }
            
            graphics.lineStyle(0);
            graphics.beginFill(color, alpha);
            graphics.drawCircle(x, y, gridWidth);
            graphics.endFill();
            
            for(var i:number=0; i<4; ++i) {
                if(this.chainedToNeighbor[i]) {
                    
                    graphics.lineStyle(1, 0x0, 1 * alpha);
                    graphics.beginFill(0xffffff, 0.8 * alpha);
                    graphics.drawCircle(x + this.dxs[i], y + this.dys[i], 5);
                    graphics.endFill();
                }
            }
        }
        */
    }
}