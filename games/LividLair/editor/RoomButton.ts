///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="../game/Point.ts"/>
///<reference path="../game/Defs.ts"/>
///<reference path="Defs.ts"/>
///<reference path="../game/LairData.ts"/>

module LividLair {

    export class RoomButton extends PIXI.Container {

        enabled: boolean;
        label: PIXI.Text;
        room: RoomData;

        constructor(rd: RoomData) {
            super();

            this.room = rd;

            this.enabled = false;

            let gr = new PIXI.Graphics();
            gr.lineStyle(2, 0xffffff);
            gr.beginFill(0x888888);
            gr.drawRoundedRect(-50, -10, 100, 20, 5);
            this.addChild(gr);

            this.label = new PIXI.Text('Room #');
            this.label.x = -45;
            this.label.y = -8;
            this.label.style.fill = 0xffffff;
            this.label.style.fontSize = 12;
            this.addChild(this.label);
        }

        setEnabled(enabled: boolean) {
            this.enabled = enabled;
            this.alpha = enabled ? .5 : 1;
        }

        hitTestPoint(p: Point): boolean {
            return Math.abs(p.x) < 50 && Math.abs(p.y) < 10;
        }
    }
}