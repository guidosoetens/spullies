///<reference path="../../../../pixi/pixi.js.d.ts"/>

module Magneon
{

    export class BorderTypeSelector extends PIXI.Graphics {

        index:number = 0;
        data:any;

        types:string[] = [ "normal", "spring", "magnet" ];//, "danger" ];

        ctrlWidth = 70;

        constructor() {
            super();
        }

        bindBorder(data:any) {
            this.visible = true;
            this.data = data;
            this.index = this.types.indexOf(this.data["type"]);
            this.redraw();
        }

        redraw() {

            let n = this.types.length;

            this.clear();
            this.beginFill(0x0, .5);
            this.drawRoundedRect(0, 0, this.ctrlWidth, 30, 5);

            let clrs = [0xff00ff, 0xffff00, 0x00ffff, 0xff0000 ];
            for(let i=0; i<n; ++i) {
                let x = (i + 0.5) / n * this.ctrlWidth;
                if(i == this.index) {
                    this.beginFill(0xffffff);
                    this.drawCircle(x, 15, 12);
                }
                this.beginFill(clrs[i % clrs.length]);
                this.drawCircle(x, 15, 10);
            }

        }

        tryTouchDown(p:Point) : boolean {

            if(!this.visible)
                return false;

            let locPt = this.toLocal(p.toPixi(), GLOBAL_SCENE);
            if(locPt.x < 0 || locPt.x > this.ctrlWidth || locPt.y < 0 || locPt.y > this.height)
                return false;

            let idx = Math.floor(this.types.length * locPt.x / this.ctrlWidth);
            idx = clamp(idx, 0, this.types.length - 1);

            if(idx != this.index) {
                this.index = idx;
                this.data["type"] = this.types[idx];
                this.redraw();
                return true;
            }

            return false;
        }


    }
}