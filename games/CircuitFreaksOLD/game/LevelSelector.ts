///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Button.ts"/>

module CircuitFreaks
{
    export class LevelSelector extends PIXI.Container {

        fadeBackground:PIXI.Graphics;
        background:PIXI.Graphics;
        closeBtn:Button;
        levelButtons:Button[];

        constructor(w:number, h:number) {
            super();

            this.fadeBackground = new PIXI.Graphics();
            this.fadeBackground.beginFill(0x0, 0.5);
            this.fadeBackground.drawRect(0, 0, w, h);
            this.addChild(this.fadeBackground);

            this.background = new PIXI.Graphics();
            this.background.beginFill(0x00aa00);
            this.background.lineStyle(6, 0xffffff, 1);
            this.background.drawRoundedRect(.1 * w, .1 * h, .8 * w, .8 * h, 30);
            this.addChild(this.background);

            //text:string, func:Function, base_width:number = 50
            this.closeBtn = new Button('✕', this.close, 30, 0);
            this.closeBtn.x = .9 * w - 50;
            this.closeBtn.y = .1 * h + 50;
            this.addChild(this.closeBtn);
            this.visible = false;

            var rows = 6;
            var cols = 4;
            var panelWidth = .9 * w;
            var tileWidth = .7 * panelWidth / cols - 20;
            var panelHeight = .7 * h;
            var panelLeft = .05 * w;
            var panelTop = .2 * h;
            this.levelButtons = [];
            for(var i:number=0; i<rows; ++i) {
                var y = panelTop + (i + 1) / (rows + 1) * panelHeight;
                for(var j:number=0; j<cols; ++j) {
                    var x = panelLeft + (j + 1) / (cols + 1) * panelWidth;

                    var idx = i * cols + j + 1;

                    var btn = new Button('' + idx, this.close, 10, tileWidth, tileWidth);
                    btn.x = x;
                    btn.y = y;
                    this.addChild(btn);
                    this.levelButtons.push(btn);
                }
            }
        }

        close() {
            this.hide();
        }

        isEnabled() : boolean {
            return this.visible;
        }

        touchDown(p:PIXI.Point) : number {
            if(this.closeBtn.hitTestPt(p)) {
                this.close();
                return -1;
            }

            for(var i:number=0; i<this.levelButtons.length; ++i) {
                let btn = this.levelButtons[i];
                if(btn.hitTestPt(p)) {
                    this.close();
                    return i;
                }
            }

            return -1;
        }

        show() {
            this.visible = true;
        }

        hide() {
            this.visible = false;
        }
    }
}