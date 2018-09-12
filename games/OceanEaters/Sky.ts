///<reference path="../../pixi/pixi.js.d.ts"/>

module OceanEaters
{
    export class Sky extends PIXI.Graphics {

        // sprite:Phaser.Sprite;
        // shader:Phaser.Filter;
        shaderTime:number;

        constructor() {

            super();

            // this.game = game;

            // var group = game.add.group();

            // this.sprite = game.make.sprite(0,0);
            // group.add(this.sprite);

            // var skySprite = game.make.sprite(0,0,'sky');
            // var mountainsSprite = game.make.sprite(0,0,'mountains');

            // //init shader:
            // this.shader = new Phaser.Filter(game, null, game.cache.getShader('skyShader'));
            // this.shader.uniforms.uTimeParam = { type: '1f', value: 0. };
            // this.shader.uniforms.uResolution = { type: '2f', value: { x:0, y:0 } };
            // this.shader.uniforms.uScreenSize = { type: '2f', value: { x:0, y:0 } };
            // this.shader.uniforms.uPlayerPosition = { type: '2f', value: { x:0, y:0 } };
            // this.shader.uniforms.uPlayerDirection = { type: '2f', value: { x:0, y:0 } };
            // this.shader.uniforms.uPlayerAngle = { type: '1f', value: 0. };
            // this.shader.uniforms.uTexture = { type: 'sampler2D', value: skySprite.texture, textureData: { repeat: true } };
            // this.shader.uniforms.uMountainsTexture = { type: 'sampler2D', value: mountainsSprite.texture, textureData: { repeat: true } };
            // // this.sprite.filters = [ this.shader ];

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
            // this.shader.uniforms.uResolution.value = { x:this.sprite.width, y:this.sprite.height };
            // this.shader.uniforms.uScreenSize.value = { x:this.game.scale.width, y:this.game.scale.height };
            // this.shader.uniforms.uPlayerPosition.value = { x:-pPos.y, y:pPos.x };
            // this.shader.uniforms.uPlayerDirection.value = { x:Math.cos(pDir), y:Math.sin(pDir) };
            // this.shader.uniforms.uPlayerAngle.value = pDir;
            // this.shader.update(); 
        }
    }
}