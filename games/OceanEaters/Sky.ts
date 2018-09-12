///<reference path="../../pixi/pixi.js.d.ts"/>

module OceanEaters
{
    export class Sky extends PIXI.Graphics {

        // sprite:Phaser.Sprite;
        // shader:PIXI.Filter<skyShaderUniforms>;
        shaderTime:number;

        constructor() {

            super();

            //init shader:
            var skyTexture = PIXI.Texture.fromImage('assets/sky.jpg');
            var mountainTexture = PIXI.Texture.fromImage('assets/mountains.png');

            var uniforms = { 
                uTimeParam : { type : 'f', value : 0 },
                uPlayerAngle : { type : 'f', value : 0 },
                uResolution : { type : 'v2', value : { x:0, y:0 } },
                uScreenSize : { type : 'v2', value : { x:0, y:0 } },
                uPlayerPosition : { type : 'v2', value : { x:0, y:0 } },
                uPlayerDirection : { type : 'v2', value : { x:0, y:0 } },
                uTexture : { type : 'sampler2D', value : skyTexture, textureData: { repeat: true } },
                uMountainsTexture : { type : 'sampler2D', value : mountainTexture, textureData: { repeat: true } }
            };
            var foo = new PIXI.Filter(null, PIXI.loader.resources.skyShader.data, uniforms);
            this.filters = [ foo ];

            this.shaderTime = 0;
        }

        resetLayout(x:number, y:number, w:number, h:number) {
            w = 800;
            h = 600;
            y = 0;

            this.position.x = x;
            this.position.y = y;
            this.width = w;
            this.height = .5 * h;

            this.clear();
            this.beginFill(0x0066ff, 1);
            this.drawRect(0,0,w,.5 * h);
            this.endFill();
        }

        updateFrame(dt:number, pPos:PIXI.Point, pDir:number) {
            this.shaderTime = (this.shaderTime + dt / 10.0) % 1.0;
            // this.shader.uniforms.uTimeParam.value = this.shaderTime;
            // this.shader.uniforms.uResolution.value = { x:this.width, y:this.height };
            // this.shader.uniforms.uScreenSize.value = { x:800, y:600 };
            // this.shader.uniforms.uPlayerPosition.value = { x:-pPos.y, y:pPos.x };
            // this.shader.uniforms.uPlayerDirection.value = { x:Math.cos(pDir), y:Math.sin(pDir) };
            // this.shader.uniforms.uPlayerAngle.value = pDir;
            // this.shader.update();
        }
    }
}