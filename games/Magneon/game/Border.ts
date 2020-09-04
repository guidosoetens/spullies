///<reference path="Point.ts"/>
///<reference path="LineSegment.ts"/>

module Magneon
{
    export class Border extends PIXI.Graphics {

        magnetic:boolean = false;
        spring:boolean = false;
        // transform:PIXI.Transform;
        animate:boolean = false;
        animParam:number = 0;
        wobbleAnimParam:number = 1;

        private segments:LineSegment[];

        constructor() {
            super();
            this.segments = [];
        }

        static asLine(px:number, py:number, qx:number, qy:number, magnetic:boolean) : Border{
            let result = new Border();
            result.magnetic = magnetic;
            result.segments.push(new LineSegment(px, py, qx, qy));
            result.prepare();
            return result;
        }

        static asCurve(center:Point, arcFrom:number, arcTo:number, radius:number, magnetic:boolean) : Border {
            let result = new Border();
            result.magnetic = magnetic;

            var p:Point = new Point(0, 0);
            for(var i:number=0; i<50; ++i) {
                var t = i / 49.0;
                var angle = (1 - t) * arcFrom + t * arcTo;
                var to = new Point(Math.cos(angle), Math.sin(angle));
                var q = center.clone().add(to.multiply(radius));
                if(i > 0) 
                    result.segments.push(new LineSegment(p.x, p.y, q.x, q.y));
                p = q;
            }

            result.prepare();

            return result;
        }

        wobble() {
            if(this.spring)
                this.wobbleAnimParam = 0;
        }

        prepare() {

            var avg = this.segments[0].p1.clone();
            for(var s of this.segments)
                avg.add(s.p2);

            var n = this.segments.length + 1;
            this.pivot.x = avg.x / n;
            this.pivot.y = avg.y / n;

            this.x = this.pivot.x;
            this.y = this.pivot.y;

            this.draw();
        }

        update(dt:number) : void {
            this.x = this.pivot.x;
            if(this.animate) {
                this.animParam = (this.animParam + dt / 10.0) % 1.0;
                this.y = this.pivot.y + Math.sin(this.animParam * 2 * Math.PI) * 50;
                this.rotation = this.animParam * 2 * Math.PI;
            }
            else
                this.y = this.pivot.y;

            this.wobbleAnimParam = Math.min(1.0, this.wobbleAnimParam + dt);
            let offset = 2 * Math.sin(this.wobbleAnimParam * 40) * (1 - this.wobbleAnimParam);
            this.x += -this.segments[0].dir.y * offset;
            this.y += this.segments[0].dir.x * offset;
        }

        transformPoint(p:Point) : Point {
            let p_trans = this.transform.localTransform.apply(new PIXI.Point(p.x, p.y));
            return new Point(p_trans.x, p_trans.y);
        }

        invTransformPoint(p:Point) : Point {
            let p_trans = this.transform.localTransform.applyInverse(new PIXI.Point(p.x, p.y));
            return new Point(p_trans.x, p_trans.y);
        }

        distanceToPoint(p:Point) : number {
            p = this.invTransformPoint(p);
            var result = this.segments[0].distanceToPoint(p);
            for(var i:number=1; i<this.segments.length; ++i)
                result = Math.min(result, this.segments[i].distanceToPoint(p));
            return result;
        }

        projectPointToBorder(p:Point) : Point {

            p = this.invTransformPoint(p);

            var result:Point = this.segments[0].projectPointToLineSegment(p);
            var minDistance = p.clone().subtract(result).lengthSquared();

            for(var i:number=1; i<this.segments.length; ++i) {
                var opt:Point = this.segments[i].projectPointToLineSegment(p);
                var distance = p.clone().subtract(opt).lengthSquared();
                if(distance < minDistance) {
                    minDistance = distance;
                    result = opt;
                }
            }

            return this.transformPoint(result);
        }

        draw() {
            var clr:number = this.spring ? 0xffff00 : (this.magnetic ? 0x00ffff : 0xff00ff);
            for(let seg of this.segments)
                seg.draw(this, clr);
        }
    }
}