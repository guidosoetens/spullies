///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>

module LividLair {

    export class Particle extends GameObject {

        aliveTime: number;

        constructor(clr: number, w: number) {
            super(w, w);

            this.bounceVelocityFrac = .5;

            this.beginFill(clr);
            this.lineStyle(0);
            this.drawCircle(0, 0, w / 2);
            this.endFill();

            this.aliveTime = 0;
            this.pivot.y = 1;
            this.pivot.x = 0;
        }

        update(dt: number) {
            super.update(dt);
        }

        bounceOffPlatform() {
            super.bounceOffPlatform();
            this.velocity.x *= 0.5;
        }
    }
}