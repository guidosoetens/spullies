///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>

module CircuitFreaks
{
    export class LevelSelector extends PIXI.Container {

        background:PIXI.Graphics;
        closeBtn:PIXI.Graphics;

        constructor(w:number, h:number) {
            super();

            this.background = new PIXI.Graphics();
            this.background.beginFill(0x00ff00);
            this.background.lineStyle(3,0xffffff,1);
            this.background.drawRoundedRect(0, 0, w, h, .1 * w);
            this.addChild(this.background);

            this.closeBtn = new PIXI.Graphics();
            this.closeBtn.beginFill(0x00ff00);
            this.closeBtn.lineStyle(3,0xffffff,1);
            this.closeBtn.drawRoundedRect(-10,-10,20,20,10);
            this.closeBtn.x = w - 10;
            this.closeBtn.y = 10;
            this.addChild(this.closeBtn);

            this.visible = true;

            console.log("yessiree");
        }

        touchDown(pt:PIXI.Point) {

        }

        show() {
            this.visible = true;
        }

        hide() {
            this.visible = false;
        }
    }
}