///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>

module LividLair {

    export class Potion extends GameObject {

        constructor() {
            let w = GRID_UNIT_SIZE / 2;
            super(w, w);
            w -= 4;

            this.bounceVelocityFrac = .2;

            this.beginFill(0x00ffff, .5);
            this.lineStyle(4, 0x00ffff);

            this.moveTo(-w * .1, -w / 2);
            this.arc(-w * .1, -w * .4, w * .1, 1.5 * Math.PI, 0.5 * Math.PI, true);
            this.lineTo(-w * .1, -w * .2);
            this.arc(0, .2 * w, .3 * w, 1.2 * Math.PI, 1.8 * Math.PI, true);
            this.lineTo(w * .1, -w * .2);
            this.lineTo(w * .1, -w * .3);
            this.arc(w * .1, -w * .4, w * .1, 0.5 * Math.PI, 1.5 * Math.PI, true);
            this.closePath();

            let clrs = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
            let idx = Math.min(clrs.length, Math.floor(Math.random() * clrs.length));

            this.lineStyle(0);
            this.beginFill(clrs[idx], .5);
            this.moveTo(0, w * .05);
            this.arc(0, .2 * w, .2 * w, 1.2 * Math.PI, 1.8 * Math.PI, true);

            this.endFill();

        }

        update(dt: number) {
            super.update(dt);
        }

        bounceOffWall(leftWall: boolean) {
            if (this.destroyCallback && Math.abs(this.velocity.x) > this.velocity.y)
                this.destroyCallback.call(this);
            else
                super.bounceOffWall(leftWall);
        }

        bounceOffPlatform() {
            if (this.destroyCallback && (this.velocity.y > 10 || Math.abs(this.velocity.x) > 2)) {
                this.destroyCallback.call(this);
            }
            else {
                super.bounceOffPlatform();
                if (this.velocity.y)
                    this.velocity.x *= 0.5;
            }
        }
    }
}