///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>

module LividLair {

    export class Chest extends GameObject {

        constructor() {

            let w = GRID_UNIT_SIZE * .8;
            let h = GRID_UNIT_SIZE * .6;
            super(PLAYER_WIDTH, h);

            this.bounceVelocityFrac = .1;

            w -= 2;
            h -= 2;

            this.clear();

            let rad = w * .3;
            let base_w = rad * .8;
            let top_y = -h / 2;
            let mid_y = top_y + rad;
            let btm_y = -top_y;

            this.lineStyle(4, 0xCD853F);
            this.beginFill(0x8B4513, 1);
            this.moveTo(-w / 2 + rad, top_y);
            this.lineTo(-w / 2 + rad - base_w, btm_y);
            this.lineTo(w / 2 - rad + base_w, btm_y);
            this.lineTo(w / 2, mid_y);
            this.arcTo(w / 2, top_y, w / 2 - rad, top_y, rad);
            this.closePath();
            this.moveTo(-w / 2, mid_y);
            this.lineTo(w / 2, mid_y);

            this.lineStyle(4, 0xCD853F);//0x9e6329);
            this.beginFill(0x70380f, 1);
            this.moveTo(-w / 2 + 2 * rad, mid_y);
            this.arcTo(-w / 2 + 2 * rad, top_y, -w / 2 + rad, top_y, rad);
            this.arcTo(-w / 2, top_y, - w / 2, mid_y, rad);
            this.lineTo(-w / 2 + rad - base_w, btm_y);
            this.lineTo(-w / 2 + rad + base_w, btm_y);
            this.closePath();
            this.endFill();

            this.moveTo(-w / 2, mid_y);
            this.lineTo(-w / 2 + 2 * rad, mid_y);

            let rest_w = w - 2 * rad;
            let lock_x = w / 2 - rest_w / 2;

            this.lineStyle(4, 0xaa5500);
            this.beginFill(0xaa5500);
            this.drawRoundedRect(lock_x - 10, mid_y - 5, 20, 10, 5);
            this.beginFill(0xffcc55);
            this.drawRoundedRect(lock_x - 5, mid_y - 5, 15, 10, 5);
        }

        update(dt: number) {
            super.update(dt);
        }

        bounceOffPlatform() {
            super.bounceOffPlatform();
            this.velocity.x *= 0.9;
        }
    }
}