///<reference path="../../pixi/pixi.js.d.ts"/>

module OceanEaters
{

    export class Ocean extends PIXI.Graphics  {
        
        shaderTime:number;
        playerPos:PIXI.Point; 
        playerDir:number;

        constructor() {
            super();

            // //init shader:
            var oceanTexture = PIXI.Texture.fromImage('assets/ripples.png');

            this.playerPos = new PIXI.Point(0,0);
            this.playerDir = 0;

            var uniforms = { 
                uTimeParam : { type : 'f', value : 1.0 },
                uPlayerAngle : { type : 'f', value : 0 },
                uResolution : { type : 'vec2', value : { x:800, y:300 } },
                uScreenSize : { type : 'vec2', value : { x:800, y:600 } },
                uPlayerPosition : { type : 'vec2', value : { x:0, y:0 } },
                uPlayerDirection : { type : 'vec2', value : { x:0, y:0 } },
                uTexture : { type : 'sampler2D', value : oceanTexture, textureData: { repeat: true } }
            };

            // alert(PIXI.Filter.defaultVertexSrc);
            
            var shader = new PIXI.Filter(PIXI.Filter.defaultVertexSrc, PIXI.loader.resources.oceanShader.data, uniforms);
            // shader.autoFit = true;
            // shader.resolution = 100.0;
            this.filters = [ shader ];

            this.shaderTime = 0;

            PIXI.ticker.shared.add(
                () => {
                    var dt = PIXI.ticker.shared.elapsedMS * .001;
                    shader.uniforms.uTimeParam = (shader.uniforms.uTimeParam + dt) % 1.0;
                    shader.uniforms.uPlayerAngle = this.playerDir;
                    shader.uniforms.uPlayerDirection =  { x:Math.cos(this.playerDir), y:Math.sin(this.playerDir) };
                    shader.uniforms.uPlayerPosition = { x:-this.playerPos.y, y:this.playerPos.x };
                    shader.uniforms.uScreenSize = { x:800, y:600 };
                    shader.uniforms.uResolution = { x:800, y:300 };
                }
            );
        }

        resetLayout(x:number, y:number, w:number, h:number) {
            this.position.x = x;
            this.position.y = y;
            this.width = w;
            this.height = h;

            this.clear();
            this.beginFill(0x44aaff, 1);
            this.drawRect(0,0,w,h);
            this.endFill();
        }

        updateFrame(dt:number, pPos:PIXI.Point, pDir:number) {
            this.shaderTime = (this.shaderTime + dt / 10.0) % 1.0;
            this.playerPos.x = pPos.x;
            this.playerPos.y = pPos.y; 
            this.playerDir = pDir;
        }
    }
}