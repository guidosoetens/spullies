///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Level.ts"/>

module Magneon
{
    export class Game extends PIXI.Container {

        level:Level;

        btnGraphics:PIXI.Graphics;
        debugText:PIXI.Text;

        constructor(w:number, h:number) {
            super();

            this.level = new Level(w, h);
            this.addChild(this.level);

            this.btnGraphics = new PIXI.Graphics();
            this.btnGraphics.x = w - 30;
            this.btnGraphics.y = 30;
            this.btnGraphics.alpha = .8;
            this.addChild(this.btnGraphics);

            this.debugText = new PIXI.Text(' ');
            this.debugText.style.fontFamily = "courier";
            this.debugText.style.fill = 0xffffff;
            this.debugText.style.fontSize = 32;
            this.addChild(this.debugText);

            this.updateButtonLayout();
        }

        update(dt:number) {
            this.level.update(dt);
        }

        updateButtonLayout() {
            this.btnGraphics.clear();
            this.btnGraphics.lineStyle(4,0xaaaaaa,1);
            this.btnGraphics.beginFill(0x555555, 1);
            this.btnGraphics.drawCircle(0,0,20);
            this.btnGraphics.endFill();

            this.debugText.text = DEBUG_MODE ? '✓' : '•';
            this.debugText.x = this.btnGraphics.x - this.debugText.width / 2;
            this.debugText.y = this.btnGraphics.y - this.debugText.height / 2;
        }

        touchDown(p:Point) {
            let btnLoc = new Point(this.btnGraphics.x, this.btnGraphics.y);
            if(btnLoc.subtract(p).length() < 20) {
                DEBUG_MODE = !DEBUG_MODE;
                this.updateButtonLayout();
            }
            this.level.touchDown(p);
        }

        touchMove(p:Point) {
            this.level.touchMove(p);
        }

        touchUp(p:Point) {
            this.level.touchUp(p);
        }

        left() {

        }

        right() {
            
        }

        up() {
            
        }

        down() {
            
        }

        rotate() {
            
        }
    }
}
