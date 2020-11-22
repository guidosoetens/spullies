///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="AABB.ts"/>

module LividLair {

    export class GameObject extends PIXI.Graphics {

        private boxWidth: number;
        private boxHeight: number;

        ignorePlatform: boolean;
        clampedPosition: Point;
        velocity: Point;

        constructor(width: number, height: number) {
            super();

            this.boxWidth = width;
            this.boxHeight = height;

            this.velocity = new Point(0, 0);
            this.clampedPosition = new Point(0, 0);
            this.ignorePlatform = false;
        }

        getBoundingBox(): AABB {
            return new AABB(new Point(this.clampedPosition.x, this.clampedPosition.y), this.boxWidth, this.boxHeight);
        }

        update(dt: number) {
            //...
        }

        bounceOffFloor() {

        }
    }
}