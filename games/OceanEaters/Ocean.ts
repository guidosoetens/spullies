///<reference path="../../pixi/pixi.js.d.ts"/>

module OceanEaters
{
    export class Ocean extends PIXI.Graphics  {

        game:Phaser.Game;
        sprite:Phaser.Sprite;
        shader:Phaser.Filter;
        shaderTime:number;




        constructor(w:number, h:number) {
            super();

            var shaderFrag = `
            precision mediump float;
            
            uniform vec2 mouse;
            uniform vec2 resolution;
            uniform float time;

            void main() {
            //pixel coords are inverted in framebuffer
            vec2 pixelPos = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y);
            if (length(mouse - pixelPos) < 25.0) {
                gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0) * 0.7; //yellow circle, alpha=0.7
            } else {
                gl_FragColor = vec4( sin(time), mouse.x/resolution.x, mouse.y/resolution.y, 1) * 0.5; // blend with underlying image, alpha=0.5
            }
            }
            `;

            var filter = new PIXI.Filter(null, shaderFrag);
            this.filters = [filter];

            // //init shader:
            // this.shader = new Phaser.Filter(game, null, game.cache.getShader('oceanShader'));
            // this.shader.uniforms.uTimeParam = { type: '1f', value: 0. };
            // this.shader.uniforms.uResolution = { type: '2f', value: { x:0, y:0 } };
            // this.shader.uniforms.uScreenSize = { type: '2f', value: { x:0, y:0 } };
            // this.shader.uniforms.uPlayerPosition = { type: '2f', value: { x:0, y:0 } };
            // this.shader.uniforms.uPlayerDirection = { type: '2f', value: { x:0, y:0 } };
            // this.shader.uniforms.uPlayerAngle = { type: '1f', value: 0. };
            // this.shader.uniforms.uTexture = { type: 'sampler2D', value: ripplesSprite.texture, textureData: { repeat: true } };
            // // this.sprite.filters = [ this.shader ];

            // this.shaderTime = 0;
        }

        // resetLayout(x:number, y:number, w:number, h:number) {
        //     this.sprite.position.x = x;
        //     this.sprite.position.y = y;
        //     this.sprite.width = w;
        //     this.sprite.height = h;
        //     this.shader.setResolution(w, h);

        // }

        // updateFrame(dt:number, pPos:Phaser.Point, pDir:number) {
        //     this.shaderTime = (this.shaderTime + dt / 10.0) % 1.0;
        //     this.shader.uniforms.uTimeParam.value = this.shaderTime;
        //     this.shader.uniforms.uResolution.value = { x:this.sprite.width, y:this.sprite.height };
        //     this.shader.uniforms.uScreenSize.value = { x:this.game.scale.width, y:this.game.scale.height };
        //     this.shader.uniforms.uPlayerPosition.value = { x:-pPos.y, y:pPos.x };
        //     this.shader.uniforms.uPlayerDirection.value = { x:Math.cos(pDir), y:Math.sin(pDir) };
        //     this.shader.uniforms.uPlayerAngle.value = pDir;
        //     this.shader.update(); 
        // }
    }
}