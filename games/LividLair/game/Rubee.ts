///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>

module LividLair {

    export class Rubee extends GameObject {

        animParam: number;
        clr: number;

        constructor() {
            super(GRID_UNIT_SIZE * .3, GRID_UNIT_SIZE * .5);

            if (Math.random() < .5)
                this.clr = 0x33aa33;
            else if (Math.random() < .5)
                this.clr = 0x3333aa;
            else
                this.clr = 0xaa3333;

            this.animParam = 0;
            this.redraw();
        }

        redraw() {
            let aabb = this.getBoundingBox();

            this.clear();

            let right = aabb.halfWidth - 1;
            let left = -right;

            let h0 = -aabb.halfHeight + 1;
            let h1 = -aabb.halfHeight / 2;
            let h2 = aabb.halfHeight / 2;
            let h3 = aabb.halfHeight - 1;

            this.lineStyle(0, 0xffffff);
            this.beginFill(this.clr, 1);
            this.moveTo(0, h0);
            this.lineTo(left, h1);
            this.lineTo(left, h2);
            this.lineTo(0, h3);
            this.lineTo(right, h2);
            this.lineTo(right, h1);
            this.closePath();
            this.endFill();

            this.lineStyle(2, 0xffffff, .5);
            this.moveTo(left, h1);
            this.lineTo(right, h1);
            this.moveTo(left, h2);
            this.lineTo(right, h2);

            for (var i: number = 0; i < 2; ++i) {
                let t = i * .5 + .5 * this.animParam;
                let x = (1 - t) * left + t * right;
                this.moveTo(0, h0);
                this.lineTo(x, h1);
                this.lineTo(x, h2);
                this.lineTo(0, h3);
            }

            this.lineStyle(2, 0xffffff);
            this.moveTo(0, h0);
            this.lineTo(left, h1);
            this.lineTo(left, h2);
            this.lineTo(0, h3);
            this.lineTo(right, h2);
            this.lineTo(right, h1);
            this.closePath();
        }

        update(dt: number) {
            super.update(dt);
            this.redraw();
            this.animParam = (this.animParam + dt / 2.0) % 1.0;
        }

        bounceOffPlatform() {
            super.bounceOffPlatform();
            this.velocity.x *= 0.9;
        }
    }
}