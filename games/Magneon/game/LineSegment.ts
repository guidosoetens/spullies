///<reference path="Point.ts"/>

module Magneon
{
    export class LineSegment {
        p1:Point;
        p2:Point;

        dir:Point;
        length:number;

        constructor(x1:number, y1:number, x2:number, y2:number) {
            this.p1 = new Point(x1, y1);
            this.p2 = new Point(x2, y2);
            this.dir = this.p2.clone().subtract(this.p1);
            this.length = this.dir.length();
            this.dir.normalize();
        }

        clone() {
            return new LineSegment(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        }

        distanceToPoint(p:Point) : number {
            return this.projectPointToLineSegment(p).subtract(p).length();
        }
        
        distanceToLineSegment(other:LineSegment) {
            var dist = this.distanceToPoint(other.p1);
            dist = Math.min(dist, this.distanceToPoint(other.p2));
            dist = Math.min(dist, other.distanceToPoint(this.p1));
            dist = Math.min(dist, other.distanceToPoint(this.p2));
            return dist;
        }

        projectPointToLineSegment(p:Point) : Point {
            let toPt = p.clone().subtract(this.p1);
            var proj:number = toPt.dot(this.dir);
            if(proj < 0) 
                return this.p1.clone();
            else if(proj > this.length) 
                return this.p2.clone();
            return this.p1.clone().add(this.dir.clone().multiply(proj));
        }

        projectMovingBallToLineSegment(ballPos:Point, ballEndPos:Point, ballRadius:number) : Point {
            var cpy = this.clone();
            var toPt = ballPos.clone().subtract(this.p1);
            var perpVec = this.dir.clone().makePerpendicular();
            var offset = ballRadius * ((perpVec.dot(toPt) > 0.0) ? 1 : -1);
            perpVec.multiply(offset);
            cpy.p1.add(perpVec);
            cpy.p2.add(perpVec);

            return cpy.getIntersection(new LineSegment(ballPos.x, ballPos.y, ballEndPos.x, ballEndPos.y));
        }

        getIntersection(other:LineSegment) : Point
        {
            // Line AB represented as a1x + b1y = c1 
            var a1 = this.p2.y - this.p1.y; 
            var b1 = this.p1.x - this.p2.x; 
            var c1 = a1*(this.p1.x) + b1*(this.p1.y); 
        
            // Line CD represented as a2x + b2y = c2 
            var a2 = other.p2.y - other.p1.y; 
            var b2 = other.p1.x - other.p2.x; 
            var c2 = a2*(other.p1.x)+ b2*(other.p1.y); 
        
            var det = a1*b2 - a2*b1; 
        
            if (det == 0) 
            { 
                // The lines are parallel.
                return this.p1.clone(); 
            } 
            else
            { 
                var x = (b2*c1 - b1*c2)/det; 
                var y = (a1*c2 - a2*c1)/det; 
                return new Point(x, y); 
            } 
        }
    }
}