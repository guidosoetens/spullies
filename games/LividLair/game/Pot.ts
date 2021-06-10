///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>

module LividLair {

    export class Pot extends GameObject {

        constructor() {
            let w = GRID_UNIT_SIZE / 2;
            super(w, w);
            w -= 4;

            this.bounceVelocityFrac = .2;

            this.beginFill(0x70380f);
            this.lineStyle(4, 0x8B4513);

            this.moveTo(-w * .4, -w / 2);
            this.arc(-w * .4, -w * .4, w * .1, 1.5 * Math.PI, 0.5 * Math.PI, true);
            this.arc(0, 0, .5 * w, 1.25 * Math.PI, 1.75 * Math.PI, true);
            this.arc(w * .4, -w * .4, w * .1, 0.5 * Math.PI, 1.5 * Math.PI, true);
            this.closePath();

            this.lineStyle(0);
            this.beginFill(0x8B4513);
            for (let i: number = 0; i < 7; ++i) {
                let x = w * ((i + 1) / 8.0 - .5);
                this.drawCircle(x, (i % 2) * w * .1, w * .05);
            }
            this.endFill();

            this.beginFill(0xffffff, .1);
            this.drawCircle(.25 * w, -.1 * w, .15 * w);
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