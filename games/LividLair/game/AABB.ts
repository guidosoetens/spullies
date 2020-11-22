///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>

module LividLair {
    export class AABB {
        center: Point;
        halfWidth: number;
        halfHeight: number;

        constructor(center: Point, width: number, height: number) {
            this.center = center.clone();
            this.halfWidth = width / 2;
            this.halfHeight = height / 2;
        }

        clone(): AABB {
            return new AABB(this.center, this.halfWidth * 2, this.halfHeight * 2);
        }

        equals(other: AABB): boolean {
            return this.center == other.center && this.halfWidth == other.halfWidth && this.halfHeight == other.halfHeight;
        }

        union(other: AABB): AABB {
            let minX = Math.min(this.center.x - this.halfWidth, other.center.x - other.halfWidth);
            let minY = Math.min(this.center.y - this.halfHeight, other.center.y - other.halfHeight);
            let maxX = Math.max(this.center.x + this.halfWidth, other.center.x + other.halfWidth);
            let maxY = Math.max(this.center.y + this.halfHeight, other.center.y + other.halfHeight);

            this.center.x = (minX + maxX) / 2;
            this.center.y = (minY + maxY) / 2;
            this.halfWidth = (maxX - minX) / 2;
            this.halfHeight = (maxY - minY) / 2;

            return this;
        }

        contains(p: Point) {
            let dx = p.x - this.center.x;
            let dy = p.y - this.center.y;
            return Math.abs(dx) <= this.halfWidth && Math.abs(dy) <= this.halfHeight;
        }

        translate(p: Point): AABB {
            this.center.add(p);
            return this;
        }

        intersects(other: AABB): boolean {
            let dx = other.center.x - this.center.x;
            let dy = other.center.y - this.center.y;
            return Math.abs(dx) < this.halfWidth + other.halfWidth && Math.abs(dy) < this.halfHeight + other.halfHeight;
        }

        calcMaxDisplacement(from: AABB, displacement: Point): number {
            return 0;
        }
    }
}