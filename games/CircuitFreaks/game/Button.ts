///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>

module CircuitFreaks
{
    export class Button extends PIXI.Container {
        
        graphics:PIXI.Graphics;
        text:PIXI.Text;
        func:Function;

        constructor(text:string, func:Function) {
            super();

            this.func = func;

            var base_width:number = 50;
            var radius = 20.0;
            var hw = base_width / 2.0;

            this.graphics = new PIXI.Graphics();
            this.graphics.beginFill(0x22ff22);
            this.graphics.lineStyle(.2 * radius, 0xffffff, 1);
            this.graphics.moveTo(-hw, -radius);
            this.graphics.lineTo(hw, -radius);
            this.graphics.arc(hw, 0, radius, -.5 * Math.PI, .5 * Math.PI);
            this.graphics.lineTo(-hw, radius);
            this.graphics.arc(-hw, 0, radius, .5 * Math.PI, 1.5 * Math.PI);
            this.graphics.endFill();

            this.graphics.beginFill(0xffffff, 0.5);
            this.graphics.lineStyle(0);
            this.graphics.drawCircle(.5 * base_width, -.25 * radius, .5 * radius);
            this.graphics.endFill();

            this.addChild(this.graphics);

            this.text = new PIXI.Text(text);
            this.text.style.fontFamily = "groboldregular";
            this.text.style.fontSize = 40;
            this.text.style.stroke = 0xffffff;
            this.text.style.fill = 0xffffff;
            this.text.anchor.set(0.5, 0.5);
            this.text.style.dropShadow = true;
            this.text.style.dropShadowAlpha = .5;
            this.text.x = 0;
            this.text.y = 0;
            this.addChild(this.text);

            // this.text.text = ": ssdsds";

            console.log(this.text.text, this.text.parent);
        }
    }
}