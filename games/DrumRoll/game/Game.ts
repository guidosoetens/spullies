///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Level.ts"/>
///<reference path="Defs.ts"/>

module DrumRollGame {
    export class Game extends PIXI.Container {

        level: Level = null;

        btnGraphics: PIXI.Graphics;
        btnSelector: PIXI.Graphics;
        buttonText: PIXI.Text;

        size: PIXI.Point;

        constructor(w: number, h: number) {
            super();

            this.size = new PIXI.Point(w, h);

            this.btnGraphics = new PIXI.Graphics();
            this.btnGraphics.x = w - 30;
            this.btnGraphics.y = 30;
            // this.btnGraphics.alpha = 1.0;
            this.addChild(this.btnGraphics);

            this.btnSelector = new PIXI.Graphics();
            this.btnSelector.alpha = 1.0;
            this.btnGraphics.addChild(this.btnSelector);

            this.buttonText = new PIXI.Text(' ');
            this.buttonText.style.fontFamily = "courier";
            this.buttonText.style.fill = 0xffffff;
            this.buttonText.style.fontSize = 32;
            // this.addChild(this.buttonText);

            this.updateButtonLayout();

            GLOBAL_SCENE = this;

            this.level = new Level(this.size.x, this.size.y);
            this.addChildAt(this.level, 0);
        }

        update(dt: number) {
            if (this.level)
                this.level.update(dt);
        }

        updateButtonLayout() {
            this.btnGraphics.clear();
            this.btnGraphics.lineStyle(4, 0xaaaaaa, 1);
            this.btnGraphics.beginFill(0x555555, 1);
            this.btnGraphics.drawCircle(0, 0, 20);
            this.btnGraphics.endFill();

            this.btnSelector.clear();
            this.btnSelector.lineStyle(0);
            this.btnSelector.beginFill(0xaaaaaa, 1);
            this.btnSelector.drawCircle(0, 0, 15);
            this.btnSelector.endFill();

            this.buttonText.text = '⚙';
            this.buttonText.x = this.btnGraphics.x - this.buttonText.width / 2;
            this.buttonText.y = this.btnGraphics.y - this.buttonText.height / 2;
        }

        touchDown(p: Point) {
            if (this.level)
                this.level.touchDown(p);
        }

        touchMove(p: Point) {
            if (this.level)
                this.level.touchMove(p);
        }

        touchUp(p: Point) {
            if (this.level)
                this.level.touchUp(p);

            let btnLoc = new Point(this.btnGraphics.x, this.btnGraphics.y);
            if (btnLoc.subtract(p).length() < 20) {
                this.buttonText.text = '⚙';
                this.btnSelector.visible = !this.btnSelector.visible;
                ROLL_DRUM_MODE = this.btnSelector.visible;
            }
        }

        levelMade(obj: any) {
            //levelMade
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
