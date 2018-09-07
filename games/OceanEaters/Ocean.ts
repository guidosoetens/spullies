///<reference path="../../phaser/phaser.d.ts"/>

module OceanEaters
{
    export class Ocean extends Phaser.Graphics {

        shader:Phaser.Filter;

        constructor(game:Phaser.Game) {
            super(game);

            var peachSprite = game.add.sprite(-256,0,'peachy');

            //init shader:
            this.shader = new Phaser.Filter(game, null, game.cache.getShader('oceanShader'));
            // this.shader.uniforms.uTimeParam = { type: 'float', value: 0. };
            // this.shader.uniforms.uTexture = { type: 'sampler2D', value: peachSprite.texture, textureData: { repeat: true } };
            this.filters = [ this.shader ];

            //peachSprite
            // uvBmpContainerSprite.filters = [ this.shader ];

            this.beginFill(0xffffff, 1);
            this.drawRect(0,0,100,100);
            this.endFill();
        }

        updateFrame(dt:number) {
            // this.shader.update();
        }
    }
}