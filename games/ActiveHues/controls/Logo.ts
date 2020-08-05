///<reference path="../../../pixi/pixi.js.d.ts"/>

module ActiveHues
{
    export class Logo extends PIXI.Container {

        static instance:Logo;

        textLeft:PIXI.Text;
        textRight:PIXI.Text;
        spriteTex:PIXI.Texture;
        sprite:PIXI.Sprite;

        txtSpriteTex:PIXI.Texture;
        txtSprite:PIXI.Sprite;

        filter:PIXI.filters.ColorMatrixFilter;
        count:number;

        constructor() {
            super();

            Logo.instance = this;

            // const loader = new PIXI.loaders.Loader();
            // loader.add('GothamPro', 'assets/fonts/GothamPro-Light.ttf');
            // loader.load((loader, resources) => {
            //     setTimeout(this.metaDrawThings, 3000, this);
            // });

            this.txtSpriteTex = PIXI.Texture.fromImage('assets/ac_logo_text.png');
            this.txtSprite = new PIXI.Sprite(this.txtSpriteTex);
            this.txtSprite.scale = new PIXI.Point(.6, .6);
            this.txtSprite.x = 12;
            this.txtSprite.y = 12;
            this.addChild(this.txtSprite);

            this.spriteTex = PIXI.Texture.fromImage('assets/ac_logo_small_sat.png');
            this.sprite = new PIXI.Sprite(this.spriteTex);
            this.sprite.scale = new PIXI.Point(.5, .5);
            this.sprite.x = 120;
            this.sprite.y = 0;
            this.addChild(this.sprite);

            this.filter = new PIXI.filters.ColorMatrixFilter();
            this.sprite.filters = [this.filter];

            this.count = 0;

            this.setHue(0.4);
        }

        metaDrawThings(logo:Logo) { 
            logo.drawThings();
        }

        drawThings() {

            this.textLeft = new PIXI.Text("active");
            this.textLeft.style.fontFamily = 'GothamPro';
            this.textLeft.style.fontSize = 40;
            this.textLeft.style.fill = 0x000000;
            // this.textLeft.style.fontWeight = '10';
            this.textLeft.y = 5;
            this.addChild(this.textLeft);

            this.textRight = new PIXI.Text("hues");
            this.textRight.style.fontFamily = 'GothamPro';
            this.textRight.style.fontSize = 40;
            this.textRight.style.stroke = 0xaaaaaa;
            this.textRight.style.fill = 0xaaaaaa;
            // this.textRight.style.fontWeight = '10';
            this.textRight.x = 150;
            this.textRight.y = 5;
            this.addChild(this.textRight);
        }

        setHue(hue:number) {
            this.filter.hue(hue * 360);
        }
    }
}