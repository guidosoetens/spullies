///<reference path="../../pixi/pixi.js.d.ts"/>

module OceanEaters
{
    interface vec2Prop {
        x:number;
        y:number;
    }

    interface vec2Uniform {
        type:string;
        value:vec2Prop;
    }

    interface floatUniform {
        type:string;
        value:number;
    }

    interface samplerUniform {
        type:string;
        value:PIXI.Texture;
    }

    interface OceanUniforms {
        uTimeParam: floatUniform;
        uPlayerAngle: floatUniform;
        uResolution: vec2Uniform;
        uScreenSize: vec2Uniform;
        uPlayerPosition: vec2Uniform;
        uPlayerDirection: vec2Uniform;
        uTexture: samplerUniform;
    }

    export class Ocean extends PIXI.Graphics  {
        

        shader:PIXI.Filter<OceanUniforms>;
        shaderTime:number;

        constructor(w:number, h:number) {
            super();

            var texture = PIXI.Texture.fromImage('assets/ripples.png');

            var uniforms:OceanUniforms;
            uniforms.uPlayerPosition.type = 'v2';
            uniforms.uPlayerPosition.value.x = 0;
            uniforms.uPlayerPosition.value.y = 0;

            // var uniforms = { 
            //     uTimeParam : { type : 'f', value : 0 },
            //     uPlayerAngle : { type : 'f', value : 0 },
            //     uResolution : { type : 'v2', value : { x:0, y:0 } },
            //     uScreenSize : { type : 'v2', value : { x:0, y:0 } },
            //     uPlayerPosition : { type : 'v2', value : { x:0, y:0 } },
            //     uPlayerDirection : { type : 'v2', value : { x:0, y:0 } },

            //     uTexture : { type : 'sampler2D', value : texture }
            // };

            var shader = new PIXI.Filter<OceanUniforms>(null, PIXI.loader.resources.oceanShader.data, uniforms);
            this.shader = shader;
            // this.filters = [shader];

            this.shaderTime = 0;

            this.beginFill(0xff0000, 1);
            this.drawRect(0,0,w,h);
            this.endFill();
        }

        resetLayout(x:number, y:number, w:number, h:number) {

            w = 800;
            h = 600;
            y = h / 2;

            this.position.x = x;
            this.position.y = y;
            this.width = w;
            this.height = h;

            this.clear();
            this.beginFill(0xff0000, 1);
            this.drawRect(0,0,w,h);
            this.endFill();
        }

        updateFrame(dt:number, pPos:PIXI.Point, pDir:number) {
            this.shaderTime = (this.shaderTime + dt / 10.0) % 1.0;
            this.shader.uniforms.uTimeParam.value = this.shaderTime;
            this.shader.uniforms.uResolution.value = { x:this.width, y:this.height };
            this.shader.uniforms.uScreenSize.value = { x:this.width, y:this.height };
            this.shader.uniforms.uPlayerPosition.value = { x:-pPos.y, y:pPos.x };
            this.shader.uniforms.uPlayerDirection.value = { x:Math.cos(pDir), y:Math.sin(pDir) };
            this.shader.uniforms.uPlayerAngle.value = pDir;
            // this.shader.update(); 
        }
    }
}