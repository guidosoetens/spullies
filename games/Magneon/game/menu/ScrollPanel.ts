///<reference path="../../../../pixi/pixi.js.d.ts"/>

module Magneon
{
    export class ScrollPanel extends PIXI.Container {

        levelButtonContainer:PIXI.Container;
        levelButtonScrollPanel:PIXI.Container;

        scrolling:boolean;
        
        size:Point;
        unitSize:number;
        barWidth:number = 40;
        leftMargin:number = 10;

        scrollGraphics:PIXI.Graphics;

        constructor(w:number, h:number) {
            super();
            this.size = new Point(w, h);
            this.unitSize = (this.size.x - this.barWidth - this.leftMargin) / 3;

            this.levelButtonContainer = new PIXI.Container();
            this.addChild(this.levelButtonContainer);

            var gr = new PIXI.Graphics();
            gr.beginFill(0xffffff, 1);
            gr.drawRect(0, 0, w, h);
            gr.isMask = true;
            this.addChild(gr);
            this.levelButtonContainer.mask = gr;

            this.levelButtonScrollPanel = new PIXI.Container();
            this.levelButtonContainer.addChild(this.levelButtonScrollPanel);

            var gr = new PIXI.Graphics();
            gr.lineStyle(4, 0x00ff00, 1);
            gr.drawRoundedRect(0, 0, w, h, 10);
            this.addChild(gr);

            gr = new PIXI.Graphics();
            gr.lineStyle(0);
            gr.beginFill(0x00ff00, .2);
            gr.drawRoundedRect(8, 0, this.barWidth - 16, h - 20, 5);
            gr.endFill();
            gr.x = this.size.x - this.barWidth;
            gr.y = 10;
            this.addChild(gr);

            this.scrollGraphics = new PIXI.Graphics();
            this.addChild(this.scrollGraphics);
            this.scrollGraphics.beginFill(0x00ff00);
            this.scrollGraphics.drawRoundedRect(-this.barWidth/2 + 8, -this.barWidth/2 + 5, this.barWidth - 16, this.barWidth - 10, 5);
            this.scrollGraphics.endFill();

            this.setOffset(0);
            
        }

        push(elem:PIXI.DisplayObject) {
            let idx:number = this.levelButtonScrollPanel.children.length;
            let col = idx % 3;
            let row = Math.floor(idx / 3);
            elem.x = this.leftMargin + (col + 0.5) * this.unitSize;
            elem.y = (row + 0.5) * this.unitSize;
            this.levelButtonScrollPanel.addChild(elem);
        }

        clear() {
            this.levelButtonScrollPanel.removeChildren();
        }

        update(dt:number) {
            var minY = 0, maxY = 0;
            for(let c of this.levelButtonScrollPanel.children) {
                minY = Math.min(minY, c.y - 100);
                maxY = Math.max(maxY, c.y + 100);
            }
        }

        setOffset(offset:number) {
            offset = clamp(offset, 0, 1);

            this.scrollGraphics.x = this.size.x - this.barWidth / 2;
            this.scrollGraphics.y = 20 + offset * (this.size.y - 40);

            let rows = Math.floor((this.levelButtonScrollPanel.children.length - 1) / 3) + 1;
            rows = Math.max(rows, 1);
            let overflow = rows * this.unitSize - this.size.y;

            this.levelButtonScrollPanel.y = -offset * Math.max(0, overflow);
        }

        touchDown(p:Point) {
            let pt = this.localTransform.applyInverse(p.toPixi());
            if(pt.x > this.size.x - this.barWidth && pt.x < this.size.x && pt.y > 0 && pt.y < this.size.y) {
                this.scrolling = true;
                this.setOffset(pt.y / this.size.y);
            }
        }

        touchMove(p:Point) {
            if(this.scrolling) {
                let pt = this.localTransform.applyInverse(p.toPixi());
                this.setOffset(pt.y / this.size.y);
            }
        }

        touchUp(p:Point) {
            this.scrolling = false;
        }
    }
}