///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>
///<reference path="Defs.ts"/>

module LividLair {

    export class Bomb extends GameObject {

        aliveTime: number;

        overlay: PIXI.Graphics;

        constructor() {
            let w = GRID_UNIT_SIZE / 2;
            super(w, w);
            w -= 4;

            this.bounceVelocityFrac = .2;

            this.beginFill(0x0000ff);
            this.lineStyle(4, 0x000055);
            this.drawCircle(0, 0, w / 2);
            this.beginFill(0x3333ff);
            this.drawCircle(0, -w * .05, w * .45);
            this.endFill();

            this.overlay = new PIXI.Graphics();
            this.overlay.alpha = 0;
            this.overlay.beginFill(0xffaa00);
            this.overlay.drawCircle(0, 0, w / 2);
            this.addChild(this.overlay);

            let shine = new PIXI.Graphics();
            this.overlay.beginFill(0xffffff, 0.4);
            this.overlay.drawCircle(.2 * w, -.2 * w, w * .1);
            this.addChild(shine);

            this.aliveTime = 0;

        }

        update(dt: number) {
            super.update(dt);

            this.aliveTime += dt;
            if (this.aliveTime > 3) {
                if (this.destroyCallback)
                    this.destroyCallback.call(this);
            }
            else {
                let t = 1 - Math.cos(Math.pow(this.aliveTime, 2.0) * 10);
                let basicFx = this.aliveTime * .3;
                t = ((1 - basicFx) * t + basicFx) * (.2 + .4 * this.aliveTime);
                this.overlay.alpha = t;
            }
        }

        bounceOffPlatform() {
            super.bounceOffPlatform();
            this.velocity.x *= 0.5;
        }
    }
}