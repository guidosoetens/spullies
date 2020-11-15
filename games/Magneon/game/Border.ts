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

        wobbleGraphics:PIXI.Graphics;

        private segments:LineSegment[];

        constructor() {
            super();
            this.segments = [];

            this.wobbleGraphics = new PIXI.Graphics();
            this.addChild(this.wobbleGraphics);
        }

        static fromData(data:any) : Border {
            let result = new Border();

            let type = data["type"];
            result.magnetic = type == "magnet";
            result.spring = type == "spring";

            let animData = data["anim"];
            if(animData) {
                result.pivot = Point.parseFromData(animData["pivot"]).toPixi();
                result.x = result.pivot.x;
                result.y = result.pivot.y;
                result.animate = true;
            }

            var prevPt = Point.parseFromData(data["src"]);

            for(let seg of data["segs"]) {
                let pt = Point.parseFromData(seg);
                let or = seg["or"];
                if(or == 0) {
                    //create straight line:
                    result.segments.push(new LineSegment(prevPt.x, prevPt.y, pt.x, pt.y));
                }
                else {
                    //create curve:
                    let center = pt.clone();
                    center.x = or < 0 ? pt.x : prevPt.x;
                    center.y = or > 0 ? pt.y : prevPt.y;
                    let toA = prevPt.clone().subtract(center);
                    let toB = pt.clone().subtract(center);
                    const reps = 30;
                    var locPrev = prevPt;
                    for(let rep=0; rep<reps; ++rep) {
                        let t = (rep + 1) / reps;
                        let ang = t * Math.PI * .5;
                        let p = toA.clone().multiply(Math.cos(ang)).add(toB.clone().multiply(Math.sin(ang))).add(center);
                        result.segments.push(new LineSegment(locPrev.x, locPrev.y, p.x, p.y));
                        locPrev = p;
                    }
                }
                prevPt = pt;
            }

            result.prepare();
            return result;
        }

        otherBorders:Border[];

        drawWithOffsetFromOthers(bs:Border[], gr:PIXI.Graphics = this, alpha:number = 1, rad:number = 3) {

            this.otherBorders = bs;

            gr.clear();

            let n = this.segments.length;
            if(n == 0)
                return;

            let pts = [this.segments[0].p1, this.segments[this.segments.length - 1].p2];
            let closest = [1000, 1000];
            for(let i=0; i<2; ++i) {
                for(let b of bs) {
                    if(this == b)
                        continue;
                    let p = b.projectPointToBorder(pts[i]);
                    closest[i] = Math.min(closest[i], p.subtract(pts[i]).length());
                }
            }

            let totalLength = 0;
            for(let s of this.segments)
                totalLength += s.length;

            const distance = 6;
            let minOffset = Math.max(0, distance - closest[0]);
            let maxOffset = totalLength - Math.max(0, distance - closest[1]);

            var clr:number = this.spring ? 0xffff00 : (this.magnetic ? 0x00ffff : 0xff00ff);
            let sumOffset1 = 0;
            var drawnFirst = false;
            for(let i=0; i<n; ++i) {

                let seg = this.segments[i];
                gr.lineStyle(2 * rad, clr, alpha);

                let sumOffset2 = sumOffset1 + seg.length;

                if(sumOffset2 < minOffset) {
                    //skip this segment:
                    sumOffset1 = sumOffset2;
                    continue;
                }

                var p1 = seg.p1.clone();
                var p2 = seg.p2.clone();

                let isStart = !drawnFirst && sumOffset2 > minOffset;
                if(isStart) {
                    drawnFirst = true;
                    let t = (minOffset - sumOffset1) / seg.length;
                    p1 = seg.p1.clone().add(seg.dir.clone().multiply(t * seg.length));
                }

                let isEnd = i == (n - 1) || maxOffset < sumOffset2;

                if(isEnd) {
                    let t = (maxOffset - sumOffset1) / seg.length;
                    p2 = seg.p1.clone().add(seg.dir.clone().multiply(t * seg.length));
                }

                gr.moveTo(p1.x, p1.y);
                gr.lineTo(p2.x, p2.y);

                gr.lineStyle(0);
                gr.beginFill(clr, alpha);
                gr.drawCircle(p1.x, p1.y, rad);
                gr.drawCircle(p2.x, p2.y, rad);
                gr.endFill();

                sumOffset1 = sumOffset2;

                if(isEnd)
                    break;
            }
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

            // this.draw();
        }

        update(dt:number) : void {
            this.x = this.pivot.x;
            if(this.animate) {
                this.animParam = (this.animParam + dt / 10.0) % 1.0;
                this.y = this.pivot.y + Math.sin(this.animParam * 2 * Math.PI) * 50;
                this.rotation = this.animParam * 2 * Math.PI;
            }

            else {
                this.wobbleGraphics.visible = false;
                this.y = this.pivot.y;
            }

            this.wobbleAnimParam = Math.min(1.0, this.wobbleAnimParam + dt / .5);
            if(this.wobbleAnimParam < 1.0) {
                this.wobbleGraphics.visible = true;
                let rad = 3 + 15 * Math.abs(Math.sin(this.wobbleAnimParam * 5)) * (1 - this.wobbleAnimParam);
                this.drawWithOffsetFromOthers(this.otherBorders, this.wobbleGraphics, 1, rad)
            }
            else {
                this.wobbleGraphics.visible = false;
            }
            // let offset = 2 * Math.sin(this.wobbleAnimParam * 40) * (1 - this.wobbleAnimParam);
            // this.x += -this.segments[0].dir.y * offset;
            // this.y += this.segments[0].dir.x * offset;
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
            var clr:number = 0xffffff;// this.spring ? 0xffff00 : (this.magnetic ? 0x00ffff : 0xff00ff);

            let n = this.segments.length;
            for(let i=0; i<n; ++i) {
                let seg = this.segments[i];
                this.lineStyle(6, clr, 0.5);
                this.moveTo(seg.p1.x, seg.p1.y);
                this.lineTo(seg.p2.x, seg.p2.y);

                if(i == 0 || i == n - 1) {
                    this.lineStyle(0);
                    this.beginFill(clr, 0.5);
                    if(i == 0)
                        this.drawCircle(seg.p1.x, seg.p1.y, 3);
                    if(i == n - 1)
                        this.drawCircle(seg.p2.x, seg.p2.y, 3);
                    this.endFill();
                }
            }
        }
    }
}