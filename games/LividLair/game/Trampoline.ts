///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>

module LividLair {

    export function HSVtoRGB(h, s, v): number {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        let toHex = (channel) => { return Math.floor(channel * 0xff); };
        return toHex(r) * 0x10000 + toHex(g) * 0x100 + toHex(b) * 0x1;

    }

    export class Trampoline extends GameObject {

        wobbleParam: number = 1;

        mushroom: PIXI.Graphics;

        constructor() {
            super(GRID_UNIT_SIZE / 2, GRID_UNIT_SIZE / 2);
            let hw = GRID_UNIT_SIZE / 2;
            let hy = GRID_UNIT_SIZE / 4;
            let bezierScaleX = 1.6;
            let y_offset = -hy;
            let top_y = -hy * 1.4;

            this.mushroom = new PIXI.Graphics();
            this.addChild(this.mushroom);

            let hue = Math.random();
            let rgb1 = HSVtoRGB(hue, 1, 1);
            let rgb2 = HSVtoRGB(hue, 1, .5);

            this.mushroom.beginFill(0xffffff);
            this.mushroom.lineStyle(3, 0xffAA88);
            this.mushroom.drawRoundedRect(-hw / 2, y_offset - 1.5, hw, hy, .5 * hy);
            this.mushroom.lineStyle(2, rgb2);
            this.mushroom.beginFill(rgb1);
            this.mushroom.moveTo(0, top_y + y_offset);
            this.mushroom.bezierCurveTo(-hw / 2 * bezierScaleX, top_y + y_offset, -hw * bezierScaleX, hy / 2 + y_offset, 0, hy / 2 + y_offset);
            this.mushroom.bezierCurveTo(hw * bezierScaleX, hy / 2 + y_offset, hw / 2 * bezierScaleX, top_y + y_offset, 0, top_y + y_offset);

            this.mushroom.lineStyle(0);
            this.mushroom.beginFill(0xffffff, .5);
            this.mushroom.drawEllipse(-hw * .5, -hw * .2 + y_offset, .25 * hw, .2 * hw);
            this.mushroom.drawEllipse(hw * .15, -hw * .5 + y_offset, .2 * hw, .1 * hw);
            this.mushroom.drawEllipse(hw * .5, -hw * .1 + y_offset, .1 * hw, .1 * hw);

            this.mushroom.endFill();

            this.mushroom.position.y = -y_offset;
        }

        update(dt: number) {
            this.wobbleParam = Math.min(1, this.wobbleParam + dt);

            let scaleX = 1 + .2 * Math.sin(this.wobbleParam * 20) * (1 - this.wobbleParam);
            this.mushroom.scale.x = scaleX;
            this.mushroom.scale.y = 2 - scaleX;
        }

        wobble() {
            this.wobbleParam = 0;
        }
    }
}