///<reference path="../../../pixi/pixi.js.d.ts"/>

module LividLair
{
    export class Point {
        x:number;
        y:number;

        constructor(x:number = 0, y:number = 0) {
            this.x = x;
            this.y = y;
        }

        static parseFromData(data:any) : Point {
            return new Point(data["x"] * GRID_UNIT_SIZE, data["y"] * GRID_UNIT_SIZE);
        }

        toPixi() : PIXI.Point {
            return new PIXI.Point(this.x, this.y);
        }

        clone() : Point {
            return new Point(this.x, this.y);
        }

        equals(other:Point) : boolean {
            return this.x == other.x && this.y == other.y;
        }

        lengthSquared() : number {
            return this.x * this.x + this.y * this.y;
        }

        length() : number {
            return Math.sqrt(this.lengthSquared());
        }

        dot(other:Point) : number {
            return this.x * other.x + this.y * other.y;
        }

        cross(other:Point) : number {
            return this.x * other.y - this.y * other.x;
        }

        makePerpendicular() : Point {
            let x = this.x;
            this.x = -this.y;
            this.y = x;
            return this;
        }
        
        add(other:Point) : Point {
            this.x += other.x;
            this.y += other.y;
            return this;
        }

        subtract(other:Point) : Point {
            this.x -= other.x;
            this.y -= other.y;
            return this;
        }

        multiply(s:number) : Point {
            this.x *= s;
            this.y *= s;
            return this;
        }

        normalize(length:number = 1.0) : Point {
            let len = this.length();
            if(len <= 0.00000001) {
                this.x = length;
                this.y = 0.0;
                return this;
            }
            else return this.multiply(length / len);
        }
    }
}