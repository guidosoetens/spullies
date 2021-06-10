///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="../game/Point.ts"/>
///<reference path="../game/Defs.ts"/>
///<reference path="Defs.ts"/>

module LividLair {

    export class TileButton extends PIXI.Container {

        enabled: boolean;
        type: TileType;

        constructor(type: TileType) {
            super();

            this.type = type;

            this.enabled = false;

            let gr = new PIXI.Graphics();
            gr.lineStyle(2, 0xffffff);
            gr.beginFill(0x888888);
            gr.drawRoundedRect(-20, -20, 40, 40, 5);
            gr.lineStyle(0);
            gr.beginFill(0xaaaaaa);
            gr.drawRoundedRect(-15, -15, 30, 30, 5);
            this.addChild(gr);

            drawGameObject(gr, type, new Point(0, -2), 20);
        }

        setEnabled(enabled: boolean) {
            this.enabled = enabled;
            this.alpha = enabled ? .5 : 1;
        }

        hitTestPoint(p: Point): boolean {
            return Math.abs(p.x) < 20 && Math.abs(p.y) < 20;
        }
    }
}