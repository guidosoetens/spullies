///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="AABB.ts"/>
///<reference path="Callback.ts"/>

module LividLair {

    export class GameObject extends PIXI.Graphics {

        private boxWidth: number;
        private boxHeight: number;

        ignorePlatform: boolean;
        clampedPosition: Point;
        velocity: Point;
        bounceVelocityFrac: number;

        destroyCallback: Callback = null;

        constructor(width: number, height: number) {
            super();

            this.boxWidth = width;
            this.boxHeight = height;

            this.velocity = new Point(0, 0);
            this.clampedPosition = new Point(0, 0);
            this.ignorePlatform = false;
            this.bounceVelocityFrac = 0.5;
        }

        getBoundingBox(): AABB {
            return new AABB(new Point(this.clampedPosition.x, this.clampedPosition.y), this.boxWidth, this.boxHeight);
        }

        update(dt: number) {
            //...
        }

        bounceOffWall(leftWall: boolean) {

            if (leftWall) {
                if (this.velocity.x <= 0) {
                    this.velocity.x = Math.floor(this.bounceVelocityFrac * -this.velocity.x);
                }
            }
            else {
                if (this.velocity.x >= 0) {
                    this.velocity.x = Math.floor(this.bounceVelocityFrac * -this.velocity.x);
                }
            }

        }

        bounceOffCeiling() {
            if (this.velocity.y <= 0)
                this.velocity.y = Math.floor(this.bounceVelocityFrac * -this.velocity.y);
        }

        bounceOffFloor() {
            this.bounceOffPlatform();
        }

        bounceOffPlatform() {
            if (this.velocity.y >= 0)
                this.velocity.y = Math.floor(this.bounceVelocityFrac * -this.velocity.y);
        }
    }
}