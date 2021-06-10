///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>

module LividLair {

    export class Bullet extends GameObject {

        aliveTime: number;

        constructor(p: Point) {
            super(10, 10);

            this.lineStyle(2, 0xffffff);
            this.beginFill(0xaa55ff, 1);
            this.drawCircle(0, 0, 5);
            this.endFill();

            this.x = this.clampedPosition.x = p.x;
            this.y = this.clampedPosition.y = p.y;

            this.aliveTime = 0;
            this.bounceVelocityFrac = .9;
        }

        update(dt: number) {
            super.update(dt);
        }
    }
}