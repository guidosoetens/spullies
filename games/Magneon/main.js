var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Magneon;
(function (Magneon) {
    var Point = /** @class */ (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        Point.prototype.lengthSquared = function () {
            return this.x * this.x + this.y * this.y;
        };
        Point.prototype.length = function () {
            return Math.sqrt(this.lengthSquared());
        };
        Point.prototype.dot = function (other) {
            return this.x * other.x + this.y * other.y;
        };
        Point.prototype.cross = function (other) {
            return this.x * other.y - this.y * other.x;
        };
        Point.prototype.makePerpendicular = function () {
            var x = this.x;
            this.x = -this.y;
            this.y = x;
            return this;
        };
        Point.prototype.add = function (other) {
            this.x += other.x;
            this.y += other.y;
            return this;
        };
        Point.prototype.subtract = function (other) {
            this.x -= other.x;
            this.y -= other.y;
            return this;
        };
        Point.prototype.multiply = function (s) {
            this.x *= s;
            this.y *= s;
            return this;
        };
        Point.prototype.normalize = function (length) {
            if (length === void 0) { length = 1.0; }
            var len = this.length();
            if (len <= 0.00000001) {
                this.x = length;
                this.y = 0.0;
                return this;
            }
            else
                return this.multiply(length / len);
        };
        return Point;
    }());
    Magneon.Point = Point;
})(Magneon || (Magneon = {}));
///<reference path="Point.ts"/>
var Magneon;
(function (Magneon) {
    var LineSegment = /** @class */ (function () {
        function LineSegment(x1, y1, x2, y2) {
            this.p1 = new Magneon.Point(x1, y1);
            this.p2 = new Magneon.Point(x2, y2);
            this.dir = this.p2.clone().subtract(this.p1);
            this.length = this.dir.length();
            this.dir.normalize();
        }
        LineSegment.prototype.clone = function () {
            return new LineSegment(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        };
        LineSegment.prototype.distanceToPoint = function (p) {
            return this.projectPointToLineSegment(p).subtract(p).length();
        };
        LineSegment.prototype.distanceToLineSegment = function (other) {
            var dist = this.distanceToPoint(other.p1);
            dist = Math.min(dist, this.distanceToPoint(other.p2));
            dist = Math.min(dist, other.distanceToPoint(this.p1));
            dist = Math.min(dist, other.distanceToPoint(this.p2));
            return dist;
        };
        LineSegment.prototype.projectPointToLineSegment = function (p) {
            var toPt = p.clone().subtract(this.p1);
            var proj = toPt.dot(this.dir);
            if (proj < 0)
                return this.p1.clone();
            else if (proj > this.length)
                return this.p2.clone();
            return this.p1.clone().add(this.dir.clone().multiply(proj));
        };
        LineSegment.prototype.draw = function (gr, clr) {
            gr.lineStyle(6, clr, 1);
            gr.moveTo(this.p1.x, this.p1.y);
            gr.lineTo(this.p2.x, this.p2.y);
            gr.lineStyle(0);
            gr.beginFill(clr, 1);
            gr.drawCircle(this.p1.x, this.p1.y, 3);
            gr.drawCircle(this.p2.x, this.p2.y, 3);
            gr.endFill();
        };
        LineSegment.prototype.projectMovingBallToLineSegment = function (ballPos, ballEndPos, ballRadius) {
            var cpy = this.clone();
            var toPt = ballPos.clone().subtract(this.p1);
            var perpVec = this.dir.clone().makePerpendicular();
            var offset = ballRadius * ((perpVec.dot(toPt) > 0.0) ? 1 : -1);
            perpVec.multiply(offset);
            cpy.p1.add(perpVec);
            cpy.p2.add(perpVec);
            return cpy.getIntersection(new LineSegment(ballPos.x, ballPos.y, ballEndPos.x, ballEndPos.y));
        };
        LineSegment.prototype.getIntersection = function (other) {
            // Line AB represented as a1x + b1y = c1 
            var a1 = this.p2.y - this.p1.y;
            var b1 = this.p1.x - this.p2.x;
            var c1 = a1 * (this.p1.x) + b1 * (this.p1.y);
            // Line CD represented as a2x + b2y = c2 
            var a2 = other.p2.y - other.p1.y;
            var b2 = other.p1.x - other.p2.x;
            var c2 = a2 * (other.p1.x) + b2 * (other.p1.y);
            var det = a1 * b2 - a2 * b1;
            if (det == 0) {
                // The lines are parallel.
                return this.p1.clone();
            }
            else {
                var x = (b2 * c1 - b1 * c2) / det;
                var y = (a1 * c2 - a2 * c1) / det;
                return new Magneon.Point(x, y);
            }
        };
        return LineSegment;
    }());
    Magneon.LineSegment = LineSegment;
})(Magneon || (Magneon = {}));
///<reference path="Point.ts"/>
///<reference path="LineSegment.ts"/>
var Magneon;
(function (Magneon) {
    var Border = /** @class */ (function (_super) {
        __extends(Border, _super);
        function Border() {
            var _this = _super.call(this) || this;
            _this.magnetic = false;
            _this.spring = false;
            // transform:PIXI.Transform;
            _this.animate = false;
            _this.animParam = 0;
            _this.wobbleAnimParam = 1;
            _this.segments = [];
            return _this;
        }
        Border.asLine = function (px, py, qx, qy, magnetic) {
            var result = new Border();
            result.magnetic = magnetic;
            result.segments.push(new Magneon.LineSegment(px, py, qx, qy));
            result.prepare();
            return result;
        };
        Border.asCurve = function (center, arcFrom, arcTo, radius, magnetic) {
            var result = new Border();
            result.magnetic = magnetic;
            var p = new Magneon.Point(0, 0);
            for (var i = 0; i < 50; ++i) {
                var t = i / 49.0;
                var angle = (1 - t) * arcFrom + t * arcTo;
                var to = new Magneon.Point(Math.cos(angle), Math.sin(angle));
                var q = center.clone().add(to.multiply(radius));
                if (i > 0)
                    result.segments.push(new Magneon.LineSegment(p.x, p.y, q.x, q.y));
                p = q;
            }
            result.prepare();
            return result;
        };
        Border.prototype.wobble = function () {
            if (this.spring)
                this.wobbleAnimParam = 0;
        };
        Border.prototype.prepare = function () {
            var avg = this.segments[0].p1.clone();
            for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
                var s = _a[_i];
                avg.add(s.p2);
            }
            var n = this.segments.length + 1;
            this.pivot.x = avg.x / n;
            this.pivot.y = avg.y / n;
            this.x = this.pivot.x;
            this.y = this.pivot.y;
            this.draw();
        };
        Border.prototype.update = function (dt) {
            this.x = this.pivot.x;
            if (this.animate) {
                this.animParam = (this.animParam + dt / 10.0) % 1.0;
                this.y = this.pivot.y + Math.sin(this.animParam * 2 * Math.PI) * 50;
                this.rotation = this.animParam * 2 * Math.PI;
            }
            else
                this.y = this.pivot.y;
            this.wobbleAnimParam = Math.min(1.0, this.wobbleAnimParam + dt);
            var offset = 2 * Math.sin(this.wobbleAnimParam * 40) * (1 - this.wobbleAnimParam);
            this.x += -this.segments[0].dir.y * offset;
            this.y += this.segments[0].dir.x * offset;
        };
        Border.prototype.transformPoint = function (p) {
            var p_trans = this.transform.localTransform.apply(new PIXI.Point(p.x, p.y));
            return new Magneon.Point(p_trans.x, p_trans.y);
        };
        Border.prototype.invTransformPoint = function (p) {
            var p_trans = this.transform.localTransform.applyInverse(new PIXI.Point(p.x, p.y));
            return new Magneon.Point(p_trans.x, p_trans.y);
        };
        Border.prototype.distanceToPoint = function (p) {
            p = this.invTransformPoint(p);
            var result = this.segments[0].distanceToPoint(p);
            for (var i = 1; i < this.segments.length; ++i)
                result = Math.min(result, this.segments[i].distanceToPoint(p));
            return result;
        };
        Border.prototype.projectPointToBorder = function (p) {
            p = this.invTransformPoint(p);
            var result = this.segments[0].projectPointToLineSegment(p);
            var minDistance = p.clone().subtract(result).lengthSquared();
            for (var i = 1; i < this.segments.length; ++i) {
                var opt = this.segments[i].projectPointToLineSegment(p);
                var distance = p.clone().subtract(opt).lengthSquared();
                if (distance < minDistance) {
                    minDistance = distance;
                    result = opt;
                }
            }
            return this.transformPoint(result);
        };
        Border.prototype.draw = function () {
            var clr = this.spring ? 0xffff00 : (this.magnetic ? 0x00ffff : 0xff00ff);
            for (var _i = 0, _a = this.segments; _i < _a.length; _i++) {
                var seg = _a[_i];
                seg.draw(this, clr);
            }
        };
        return Border;
    }(PIXI.Graphics));
    Magneon.Border = Border;
})(Magneon || (Magneon = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
var Magneon;
(function (Magneon) {
    var Ball = /** @class */ (function (_super) {
        __extends(Ball, _super);
        function Ball() {
            var _this = _super.call(this) || this;
            _this.velocity = new Magneon.Point(0, 0);
            _this.forceStickLocation = new Magneon.Point(0, 0);
            _this.forceStickEffect = 0;
            _this.forceStickDirection = new Magneon.Point(0, 0);
            _this.magnetVisual = new PIXI.Graphics();
            _this.addChild(_this.magnetVisual);
            _this.baseVisuals = new PIXI.Graphics();
            _this.addChild(_this.baseVisuals);
            _this.baseVisuals.clear();
            _this.baseVisuals.lineStyle(6, 0xffffff, 1);
            _this.baseVisuals.drawCircle(0, 0, Magneon.BALL_RADIUS - 6);
            _this.baseVisuals.moveTo(-.25 * Magneon.BALL_RADIUS, 0);
            _this.baseVisuals.lineTo(.25 * Magneon.BALL_RADIUS, 0);
            _this.baseVisuals.moveTo(0, -.25 * Magneon.BALL_RADIUS);
            _this.baseVisuals.lineTo(0, .25 * Magneon.BALL_RADIUS);
            _this.baseVisuals.lineStyle(0);
            _this.baseVisuals.beginFill(0xffffff);
            _this.baseVisuals.drawCircle(-.25 * Magneon.BALL_RADIUS, 0, 3);
            _this.baseVisuals.drawCircle(.25 * Magneon.BALL_RADIUS, 0, 3);
            _this.baseVisuals.drawCircle(0, -.25 * Magneon.BALL_RADIUS, 3);
            _this.baseVisuals.drawCircle(0, .25 * Magneon.BALL_RADIUS, 3);
            _this.baseVisuals.endFill();
            _this.directionVisuals = new PIXI.Graphics();
            _this.directionVisuals.alpha = 0;
            _this.addChild(_this.directionVisuals);
            _this.directionVisuals.lineStyle(2, 0xffffff, 1);
            _this.directionVisuals.moveTo(Magneon.BALL_RADIUS + 10, 5);
            _this.directionVisuals.lineTo(Magneon.BALL_RADIUS + 10, -5);
            _this.directionVisuals.lineTo(Magneon.BALL_RADIUS + 13, 0);
            _this.directionVisuals.closePath();
            return _this;
        }
        Ball.prototype.getCenter = function () {
            return new Magneon.Point(this.position.x, this.position.y);
        };
        Ball.prototype.setCenter = function (p) {
            this.position.x = p.x;
            this.position.y = p.y;
        };
        Ball.prototype.update = function (dt) {
            //clamp velocity:
            var max_speed = 500;
            if (this.velocity.length() > max_speed)
                this.velocity.normalize(max_speed);
            var displacement = this.velocity.clone().multiply(dt);
            var t = Math.pow(this.forceStickEffect, 5.0);
            this.position.x = (1 - t) * (this.position.x + displacement.x) + t * this.forceStickLocation.x;
            this.position.y = (1 - t) * (this.position.y + displacement.y) + t * this.forceStickLocation.y;
        };
        Ball.prototype.forceStick = function (pt, effect, dir) {
            this.forceStickLocation = pt;
            this.forceStickEffect = effect;
            this.forceStickDirection = dir;
            var calcEffect = Magneon.clamp(effect * (dir.length() - .7) / .3);
            this.setDirectionVisuals(this.forceStickDirection, Math.pow(calcEffect, .5));
        };
        Ball.prototype.release = function () {
            var shootEffect = this.forceStickEffect;
            if (this.forceStickDirection.length() > 0.7)
                shootEffect *= (this.forceStickDirection.length() - .7) / .3;
            else
                shootEffect = 0.0;
            this.velocity.multiply(1 - this.forceStickEffect).add(this.forceStickDirection.normalize().multiply(-1000 * shootEffect));
        };
        Ball.prototype.setMagnetVisuals = function (visibility, radius) {
            this.magnetVisual.clear();
            this.magnetVisual.lineStyle(0);
            this.magnetVisual.beginFill(0x00ffff, visibility);
            this.magnetVisual.drawCircle(0, 0, radius);
            this.magnetVisual.endFill();
        };
        Ball.prototype.setDirectionVisuals = function (dir, alpha) {
            this.directionVisuals.alpha = alpha;
            this.directionVisuals.rotation = Math.atan2(dir.y, dir.x) + Math.PI;
        };
        return Ball;
    }(PIXI.Graphics));
    Magneon.Ball = Ball;
})(Magneon || (Magneon = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
var Magneon;
(function (Magneon) {
    var MagnetAnchor = /** @class */ (function (_super) {
        __extends(MagnetAnchor, _super);
        function MagnetAnchor() {
            var _this = _super.call(this) || this;
            _this.baseVisuals = new PIXI.Graphics();
            _this.addChild(_this.baseVisuals);
            _this.baseVisuals.clear();
            _this.baseVisuals.lineStyle(2, 0x00ffff, .5);
            _this.baseVisuals.drawCircle(0, 0, 10);
            _this.baseVisuals.drawCircle(0, 0, 5);
            _this.directionVisuals = new PIXI.Graphics();
            _this.addChild(_this.directionVisuals);
            _this.directionVisuals.lineStyle(2, 0xffffff, 1);
            _this.directionVisuals.moveTo(Magneon.BALL_RADIUS + 10, 5);
            _this.directionVisuals.lineTo(Magneon.BALL_RADIUS + 10, -5);
            _this.directionVisuals.lineTo(Magneon.BALL_RADIUS + 13, 0);
            _this.directionVisuals.closePath();
            _this.setDirectionVisuals(new Magneon.Point(0, 0), 0);
            return _this;
        }
        MagnetAnchor.prototype.update = function (dt) {
        };
        MagnetAnchor.prototype.setDirectionVisuals = function (dir, alpha) {
            this.directionVisuals.alpha = alpha < .5 ? 0 : ((alpha - .5) / .5);
            this.directionVisuals.rotation = Math.atan2(dir.y, dir.x) + Math.PI;
            this.baseVisuals.alpha = 1 - this.directionVisuals.alpha;
        };
        return MagnetAnchor;
    }(PIXI.Graphics));
    Magneon.MagnetAnchor = MagnetAnchor;
})(Magneon || (Magneon = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Border.ts"/>
///<reference path="Ball.ts"/>
///<reference path="MagnetAnchor.ts"/>
var Magneon;
(function (Magneon) {
    Magneon.touchRad = 50.0;
    var Level = /** @class */ (function (_super) {
        __extends(Level, _super);
        function Level(w, h) {
            var _this = _super.call(this) || this;
            _this.railBuffer = [];
            _this.magnetAnchors = [];
            _this.bouncePending = false;
            _this.rotationSpeed = 0;
            _this.showDir = false;
            _this.showDirTimeBuffer = 0.0;
            _this.pts = [];
            // this.filters = [new PIXI.filters.BlurFilter(1)];
            var background = new PIXI.Graphics();
            background.beginFill(0x0, 0.8);
            background.drawRect(0, 0, w, h);
            background.endFill();
            _this.addChild(background);
            _this.hasInput = false;
            _this.inputTime = 0;
            _this.rotationAngle = 0;
            _this.inputSource = new Magneon.Point(0, 0);
            _this.inputLocation = new Magneon.Point(0, 0);
            _this.inputDirection = new Magneon.Point(0, 0);
            _this.ball = new Magneon.Ball();
            _this.graphics = new PIXI.Graphics();
            _this.addChild(_this.graphics);
            _this.resetLevel();
            _this.addChild(_this.ball);
            return _this;
        }
        Level.prototype.resetLevel = function () {
            this.ball.position.x = this.width * .5;
            this.ball.position.y = this.height * .33;
            this.ball.velocity = new Magneon.Point(0, 0);
            var m = 2 * Magneon.BALL_RADIUS;
            var tl = new Magneon.Point(m, m);
            var br = new Magneon.Point(this.width - m, this.height - m);
            var circleCenterY = m + 100 + Magneon.BALL_RADIUS;
            var bottomCircleY = this.height - m - 100;
            this.borders = [];
            //walls (top, left, right):
            this.borders.push(Magneon.Border.asLine(m + 340 + Magneon.BALL_RADIUS, tl.y, br.x - 7, tl.y, true));
            this.borders.push(Magneon.Border.asLine(tl.x, circleCenterY, tl.x, bottomCircleY - 10, true));
            this.borders.push(Magneon.Border.asLine(br.x, tl.y + 7, br.x, br.y, false));
            //floor:
            this.borders.push(Magneon.Border.asLine(m + 100, br.y, br.x - 160, br.y, false));
            this.borders.push(Magneon.Border.asLine(br.x - 150, br.y, br.x - 60, br.y, false));
            this.borders.push(Magneon.Border.asLine(br.x - 50, br.y, br.x, br.y, false));
            this.borders[this.borders.length - 2].spring = true;
            //slope and curves:
            this.borders.push(Magneon.Border.asLine(m + 100, .5 * this.height, .6 * this.width, .8 * this.height, false));
            this.borders.push(Magneon.Border.asCurve(new Magneon.Point(.4 * this.width, .33 * this.height), 0, .5 * Math.PI, 100, true));
            this.borders.push(Magneon.Border.asCurve(new Magneon.Point(m + 100, circleCenterY), Math.PI, 2 * Math.PI, 100, true));
            this.borders.push(Magneon.Border.asCurve(new Magneon.Point(m + 220, circleCenterY), 0, Math.PI, 20, true));
            this.borders.push(Magneon.Border.asCurve(new Magneon.Point(m + 340 + Magneon.BALL_RADIUS, circleCenterY), Math.PI, 1.5 * Math.PI, 100 + Magneon.BALL_RADIUS, true));
            this.borders.push(Magneon.Border.asCurve(new Magneon.Point(m + 100, bottomCircleY), .5 * Math.PI, 1.0 * Math.PI, 100, false));
            this.borders.push(Magneon.Border.asCurve(new Magneon.Point(this.width - m - 100, this.height / 2), 0.7 * Math.PI, 2.3 * Math.PI, 50, true));
            this.borders[this.borders.length - 1].animate = true;
            for (var _i = 0, _a = this.borders; _i < _a.length; _i++) {
                var b = _a[_i];
                this.addChild(b);
                b.draw();
            }
            var sa = new Magneon.MagnetAnchor();
            sa.x = m + 100;
            sa.y = circleCenterY;
            this.addChild(sa);
            this.magnetAnchors.push(sa);
            this.draw();
        };
        Level.prototype.update = function (dt) {
            this.railBuffer.push(this.rotationAngle);
            this.rotationAngle = 0;
            while (this.railBuffer.length > 20)
                this.railBuffer.splice(0, 1);
            //average movement:
            this.rotationSpeed = 0.0;
            if (this.railBuffer.length > 0) {
                for (var _i = 0, _a = this.railBuffer; _i < _a.length; _i++) {
                    var ang = _a[_i];
                    this.rotationSpeed += ang;
                }
                this.rotationSpeed /= this.railBuffer.length;
            }
            // if(Math.abs(this.rotationSpeed) < .05)
            //     this.rotationSpeed = 0;
            if (this.hasInput) {
                this.inputTime += dt;
            }
            for (var _b = 0, _c = this.borders; _b < _c.length; _b++) {
                var b = _c[_b];
                b.update(dt);
            }
            //apply forces: 
            var prevBallPos = this.ball.getCenter();
            this.ball.update(dt);
            //bounce off edges:
            var closestPoint = undefined;
            var closestDistance = 0;
            var sumRailForce = new Magneon.Point(0, 0);
            var ballCenter = this.ball.getCenter();
            for (var _d = 0, _e = this.borders; _d < _e.length; _d++) {
                var b = _e[_d];
                var projection = b.projectPointToBorder(ballCenter);
                var toPt = projection.clone().subtract(ballCenter);
                var dist = toPt.length() - Magneon.BALL_RADIUS;
                toPt.normalize();
                if ((!closestPoint || dist < closestDistance) && b.magnetic) {
                    closestPoint = b.projectPointToBorder(ballCenter);
                    closestDistance = dist;
                }
                if (dist < Magneon.BALL_RADIUS / 2 && this.bouncePending && b.spring) {
                    this.ball.velocity.add(toPt.clone().multiply(-1000));
                }
                //add rail force for colliding edges:
                if (dist < 0.0001) {
                    var dir = toPt.clone().makePerpendicular();
                    var addition = dir.clone().multiply((toPt.cross(dir) < 0) ? 1 : -1);
                    addition.multiply(b.magnetic ? 1 : .2);
                    sumRailForce.add(addition);
                }
                //push element outside of edge:
                if (dist < 0) {
                    //bounce off edge:
                    ballCenter = projection.clone().subtract(toPt.clone().multiply(Magneon.BALL_RADIUS));
                    this.ball.setCenter(ballCenter);
                    if (toPt.dot(this.ball.velocity) > 0) {
                        var loseVelocityFactor = Math.pow(Math.abs(this.ball.velocity.clone().normalize().dot(toPt)), 1.0);
                        //bounce velocity vector:
                        var perp = toPt.clone().makePerpendicular();
                        var dot = perp.dot(this.ball.velocity);
                        this.ball.velocity = perp.multiply(2 * dot).subtract(this.ball.velocity);
                        //friction:
                        this.ball.velocity.multiply(0.9 - .5 * loseVelocityFactor);
                    }
                    if (this.hasInput && b.magnetic) {
                        this.ball.velocity.x = 0;
                        this.ball.velocity.y = 0;
                    }
                }
            }
            this.bouncePending = false;
            var max_magnet_dist = 1.5 * Magneon.BALL_RADIUS;
            if (this.hasInput) {
                //apply rail force:
                this.ball.velocity.add(sumRailForce.multiply(dt * 30000 * this.rotationSpeed));
            }
            var forceStickMagnet = 0;
            //try to find magnet anchor that is even closer:
            if (this.hasInput) {
                for (var _f = 0, _g = this.magnetAnchors; _f < _g.length; _f++) {
                    var m = _g[_f];
                    var pt = new Magneon.Point(m.x, m.y);
                    var dist = pt.clone().subtract(ballCenter).length();
                    if (dist < closestDistance) {
                        closestDistance = dist;
                        closestPoint = pt;
                        if (dist < max_magnet_dist)
                            forceStickMagnet = 1.0 - dist / max_magnet_dist;
                    }
                }
            }
            var magnet_effect = 0.0;
            if (closestDistance < max_magnet_dist && this.hasInput) {
                var toPt = closestPoint.clone().subtract(ballCenter);
                magnet_effect = 1.0; //.25 + .75 * Math.pow(clamp(1 - toPt.length() / max_magnet_dist), .5);
                this.ball.velocity.add(toPt.normalize(dt * 8000 * magnet_effect));
                var t = Math.min(1.0, Math.max(1.0 - closestDistance / max_magnet_dist, 0));
                this.ball.setMagnetVisuals(0.2 + .8 * t, Magneon.BALL_RADIUS + (1 - t) * max_magnet_dist);
            }
            else {
                this.ball.setMagnetVisuals(this.hasInput ? .2 : 0, Magneon.BALL_RADIUS + max_magnet_dist);
            }
            //apply gravity:
            this.ball.velocity.y += dt * 500 * (1 - magnet_effect);
            var dAng = 0;
            if (this.hasInput && sumRailForce.length() > 0) {
                dAng = ballCenter.clone().subtract(prevBallPos).length() / Magneon.BALL_RADIUS;
                dAng *= this.rotationSpeed < 0 ? -1 : 1;
            }
            this.ball.baseVisuals.rotation += dAng;
            var toPt = this.inputLocation.clone().subtract(this.inputSource);
            if (toPt.length() > Magneon.touchRad)
                toPt.normalize(Magneon.touchRad);
            toPt.multiply(1.0 / Magneon.touchRad);
            this.ball.forceStick(closestPoint, forceStickMagnet, toPt);
            /*
            // if(Math.abs(this.rotationSpeed) > 0 && this.hasInput) {
            //     let takeFrac = Math.min(30 * dt, 1.0);
            //     this.inputSource = this.inputSource.clone().multiply(1 - takeFrac).add(this.inputLocation.clone().multiply(takeFrac));
            //     console.log(this.rotationSpeed);
            // }

            var toPt = this.inputLocation.clone().subtract(this.inputSource);
            if(toPt.length() > touchRad)
                toPt.normalize(touchRad);
            let d = toPt.length() / touchRad;
            toPt.normalize();
            if(d > .95 && this.hasInput) {
                this.showDir = true;
                this.showDirTimeBuffer = Math.min(1.0, this.showDirTimeBuffer + dt / 0.3);
            }
            else {
                this.showDir = false;
                this.showDirTimeBuffer = 0;
            }

            this.ball.setDirectionVisuals(toPt, this.showDirTimeBuffer);
            */
            //touch feedback:
            this.graphics.clear();
            if (this.hasInput && Magneon.DEBUG_MODE) {
                this.graphics.lineStyle(2, 0xffffff, .2);
                this.graphics.drawCircle(this.width / 2, 100, Magneon.touchRad);
                this.graphics.moveTo(this.width / 2, 100);
                var toPt = this.inputLocation.clone().subtract(this.inputSource);
                this.graphics.lineTo(this.width / 2 + toPt.x, 100 + toPt.y);
            }
        };
        Level.prototype.draw = function () {
            /*
            if(this.pts.length > 0) {
                var srcPt = this.pts[0];

                this.graphics.moveTo(this.width/2, 100);
                for(var i:number=1; i<this.pts.length; ++i) {

                    if(i > 1) {
                        let prevVec = this.pts[i-1].clone().subtract(this.pts[i-2]);
                        let currVec = this.pts[i].clone().subtract(this.pts[i-1]);
                        if(currVec.cross(prevVec) > 0)
                            this.graphics.lineStyle(1,0xff0000);
                        else
                            this.graphics.lineStyle(1,0x00ff00);
                    }
                    else
                        this.graphics.lineStyle(1, 0xffffff);

                    let p = this.pts[i].clone().subtract(srcPt).multiply(2.0);
                    this.graphics.lineTo(this.width/2 + p.x, 100 + p.y);
                }
            }*/
        };
        Level.prototype.touchDown = function (p) {
            this.hasInput = true;
            this.inputTime = 0;
            this.inputSource = p.clone();
            this.inputLocation = p.clone();
            this.inputDirection = new Magneon.Point(1, 0);
        };
        Level.prototype.touchMove = function (p) {
            var inputDir = p.clone().subtract(this.inputLocation);
            var distanceFactor = Magneon.clamp(inputDir.length() / 15.0);
            inputDir.normalize();
            this.pts.push(p.clone());
            if (this.pts.length > 100)
                this.pts.splice(0, 1);
            this.inputLocation = p.clone();
            var currInputDir = this.inputDirection.clone();
            var angle = Math.acos(Math.max(-1, Math.min(1, currInputDir.dot(inputDir))));
            var angleFactor = Magneon.clamp(3 * angle);
            if (currInputDir.clone().makePerpendicular().dot(inputDir) < 0)
                angleFactor = -angleFactor;
            this.rotationAngle += angleFactor * distanceFactor;
            this.inputDirection = inputDir;
            var toPt = this.inputLocation.clone().subtract(this.inputSource);
            if (toPt.length() > Magneon.touchRad) {
                toPt.normalize(Magneon.touchRad);
                this.inputSource = this.inputLocation.clone().subtract(toPt);
            }
        };
        Level.prototype.touchUp = function (p) {
            this.hasInput = false;
            this.bouncePending = true;
            this.pts = [];
            this.rotationAngle = 0;
            this.railBuffer = [];
            this.ball.release();
            for (var _i = 0, _a = this.borders; _i < _a.length; _i++) {
                var b = _a[_i];
                b.wobble();
            }
        };
        return Level;
    }(PIXI.Container));
    Magneon.Level = Level;
})(Magneon || (Magneon = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Level.ts"/>
var Magneon;
(function (Magneon) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(w, h) {
            var _this = _super.call(this) || this;
            _this.level = new Magneon.Level(w, h);
            _this.addChild(_this.level);
            _this.btnGraphics = new PIXI.Graphics();
            _this.btnGraphics.x = w - 30;
            _this.btnGraphics.y = 30;
            _this.btnGraphics.alpha = .8;
            _this.addChild(_this.btnGraphics);
            _this.debugText = new PIXI.Text(' ');
            _this.debugText.style.fontFamily = "courier";
            _this.debugText.style.fill = 0xffffff;
            _this.debugText.style.fontSize = 32;
            _this.addChild(_this.debugText);
            _this.updateButtonLayout();
            return _this;
        }
        Game.prototype.update = function (dt) {
            this.level.update(dt);
        };
        Game.prototype.updateButtonLayout = function () {
            this.btnGraphics.clear();
            this.btnGraphics.lineStyle(4, 0xaaaaaa, 1);
            this.btnGraphics.beginFill(0x555555, 1);
            this.btnGraphics.drawCircle(0, 0, 20);
            this.btnGraphics.endFill();
            this.debugText.text = Magneon.DEBUG_MODE ? '✓' : '•';
            this.debugText.x = this.btnGraphics.x - this.debugText.width / 2;
            this.debugText.y = this.btnGraphics.y - this.debugText.height / 2;
        };
        Game.prototype.touchDown = function (p) {
            var btnLoc = new Magneon.Point(this.btnGraphics.x, this.btnGraphics.y);
            if (btnLoc.subtract(p).length() < 20) {
                Magneon.DEBUG_MODE = !Magneon.DEBUG_MODE;
                this.updateButtonLayout();
            }
            this.level.touchDown(p);
        };
        Game.prototype.touchMove = function (p) {
            this.level.touchMove(p);
        };
        Game.prototype.touchUp = function (p) {
            this.level.touchUp(p);
        };
        Game.prototype.left = function () {
        };
        Game.prototype.right = function () {
        };
        Game.prototype.up = function () {
        };
        Game.prototype.down = function () {
        };
        Game.prototype.rotate = function () {
        };
        return Game;
    }(PIXI.Container));
    Magneon.Game = Game;
})(Magneon || (Magneon = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
var Magneon;
(function (Magneon) {
    var TileType;
    (function (TileType) {
        TileType[TileType["Path"] = 0] = "Path";
        TileType[TileType["Source"] = 1] = "Source";
        TileType[TileType["DoubleSource"] = 2] = "DoubleSource";
        TileType[TileType["TripleSource"] = 3] = "TripleSource";
        TileType[TileType["BombSource"] = 4] = "BombSource";
        TileType[TileType["EnabledBomb"] = 5] = "EnabledBomb";
        TileType[TileType["Blockade"] = 6] = "Blockade";
        TileType[TileType["Trash"] = 7] = "Trash";
        TileType[TileType["Wildcard"] = 8] = "Wildcard";
        TileType[TileType["Count"] = 9] = "Count";
    })(TileType = Magneon.TileType || (Magneon.TileType = {}));
    Magneon.APP_WIDTH = 600;
    Magneon.APP_HEIGHT = 800;
    Magneon.BALL_RADIUS = 25.0;
    Magneon.DEBUG_MODE = false;
    function clamp(n, floor, ceil) {
        if (floor === void 0) { floor = 0; }
        if (ceil === void 0) { ceil = 1; }
        return Math.max(floor, Math.min(ceil, n));
    }
    Magneon.clamp = clamp;
    Magneon.hexWidthFactor = 1.5 / Math.tan(Math.PI / 3.0);
    function drawHex(gr, center, unitWidth) {
        var halfHeight = .5 * unitWidth;
        var baseUnit = unitWidth * Magneon.hexWidthFactor / 3.0; // halfHeight / Math.tan(Math.PI / 3.0);
        var baseUnit2 = 2 * baseUnit;
        gr.moveTo(center.x + baseUnit2, center.y);
        gr.lineTo(center.x + baseUnit, center.y + halfHeight);
        gr.lineTo(center.x - baseUnit, center.y + halfHeight);
        gr.lineTo(center.x - baseUnit2, center.y);
        gr.lineTo(center.x - baseUnit, center.y - halfHeight);
        gr.lineTo(center.x + baseUnit, center.y - halfHeight);
        gr.lineTo(center.x + baseUnit2, center.y);
    }
    Magneon.drawHex = drawHex;
    var Coord = /** @class */ (function () {
        function Coord() {
        }
        return Coord;
    }());
    Magneon.Coord = Coord;
})(Magneon || (Magneon = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="game/Game.ts"/>
///<reference path="game/Defs.ts"/>
var Magneon;
(function (Magneon) {
    var touchElement = /** @class */ (function () {
        function touchElement() {
        }
        return touchElement;
    }());
    Magneon.touchElement = touchElement;
    var GameContainer = /** @class */ (function (_super) {
        __extends(GameContainer, _super);
        function GameContainer() {
            var _this = _super.call(this, Magneon.APP_WIDTH, Magneon.APP_HEIGHT, { antialias: true, backgroundColor: 0x000000, transparent: false }) || this;
            _this.app_scale = 0.85;
            _this.backgroundTexture = PIXI.Texture.fromImage('assets/background.jpg');
            _this.backgroundImage = new PIXI.Sprite(_this.backgroundTexture);
            _this.stage.addChild(_this.backgroundImage);
            _this.game = new Magneon.Game(Magneon.APP_WIDTH, Magneon.APP_HEIGHT);
            _this.stage.addChild(_this.game);
            _this.componentMask = new PIXI.Graphics();
            _this.componentMask.beginFill(0xFFFFFF);
            _this.componentMask.drawRect(0, 0, Magneon.APP_WIDTH, Magneon.APP_HEIGHT);
            _this.componentMask.endFill();
            _this.componentMask.isMask = true;
            _this.game.mask = _this.componentMask;
            _this.game.pivot.x = .5 * Magneon.APP_WIDTH;
            // this.game.position.x = APP_WIDTH;
            _this.hasFocusTouch = false;
            _this.componentBoundary = new PIXI.Graphics();
            _this.componentBoundary.clear();
            var thickness = [4, 3];
            var offset = [0, 0];
            var colors = [0xaaaaaa, 0xffffff];
            for (var i = 0; i < 2; ++i) {
                var t = offset[i];
                _this.componentBoundary.lineStyle(thickness[i], colors[i]);
                _this.componentBoundary.drawRoundedRect(-t, -t, Magneon.APP_WIDTH + 2 * t, Magneon.APP_HEIGHT + 2 * t, 5 + t);
            }
            _this.stage.addChild(_this.componentBoundary);
            _this.componentBoundary.pivot.x = _this.game.pivot.x = .5 * Magneon.APP_WIDTH;
            return _this;
        }
        GameContainer.prototype.setup = function () {
            this.ticker.add(this.update, this);
            this.stage.interactive = true;
            this.stage.on("pointerdown", this.pointerDown, this);
            this.stage.on("pointermove", this.pointerMove, this);
            this.stage.on("pointerupoutside", this.pointerUp, this);
            this.stage.on("pointercancel", this.pointerUp, this);
            this.stage.on("pointerup", this.pointerUp, this);
            this.stage.on("pointerout", this.pointerUp, this);
            this.touchPoints = [];
            this.debugText = new PIXI.Text('');
            this.debugText.x = 20;
            this.debugText.y = 10;
            this.debugText.style.fill = 0xffffff;
            this.debugText.style.fontSize = 12;
            this.game.addChild(this.debugText);
            this.debugGraphics = new PIXI.Graphics();
            this.game.addChild(this.debugGraphics);
        };
        GameContainer.prototype.keyDown = function (key) {
            switch (key) {
                case 37: //left
                    this.game.left();
                    break;
                case 38: //up
                    this.game.up();
                    break;
                case 39: //right
                    this.game.right();
                    break;
                case 40: //down
                    this.game.down();
                    break;
                case 32: //space
                    this.game.rotate();
                    break;
            }
        };
        GameContainer.prototype.pointerDown = function (event) {
            for (var i = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }
            var pos = event.data.getLocalPosition(this.game);
            var touch = new touchElement();
            touch.id = event.data.identifier;
            touch.currentX = pos.x;
            touch.currentY = pos.y;
            touch.originX = pos.x;
            touch.originY = pos.y;
            touch.timeAlive = 0;
            this.touchPoints.push(touch);
            if (this.touchPoints.length == 1) {
                this.hasFocusTouch = true;
                this.game.touchDown(new Magneon.Point(pos.x, pos.y));
            }
        };
        GameContainer.prototype.pointerMove = function (event) {
            var pos = event.data.getLocalPosition(this.game);
            for (var i = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints[i].currentX = pos.x;
                    this.touchPoints[i].currentY = pos.y;
                }
            }
            if (this.hasFocusTouch && this.touchPoints[0].id == event.data.identifier)
                this.game.touchMove(new Magneon.Point(pos.x, pos.y));
        };
        GameContainer.prototype.pointerUp = function (event) {
            if (this.hasFocusTouch && this.touchPoints[0].id == event.data.identifier) {
                this.hasFocusTouch = false;
                var pos = event.data.getLocalPosition(this.game);
                this.game.touchUp(new Magneon.Point(pos.x, pos.y));
            }
            for (var i = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {
                    if (this.touchPoints[i].timeAlive < .3) {
                        var dy = event.data.getLocalPosition(this.game).y - this.touchPoints[i].originY;
                        if (dy < -5) {
                            // var double = this.touchPoints.length > 1;
                            // this.player.jump(double);
                        }
                    }
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }
        };
        GameContainer.prototype.resize = function (w, h) {
            var bgScale = Math.max(w / 1280, h / 853);
            this.backgroundImage.scale.x = bgScale;
            this.backgroundImage.scale.y = bgScale;
            var resWidth = bgScale * 1280;
            var resHeight = bgScale * 853;
            this.backgroundImage.x = (w - resWidth) / 2;
            this.backgroundImage.y = (h - resHeight) / 2;
            this.game.x = (w - Magneon.APP_WIDTH) / 2 + Magneon.APP_WIDTH / 2;
            this.game.y = (h - Magneon.APP_HEIGHT) / 2;
            // this.componentBoundary.x = w / 2;
            // this.componentBoundary.y = h / 2;
            this.componentBoundary.x = this.game.x;
            this.componentBoundary.y = this.game.y;
            this.componentMask.clear();
            this.componentMask.beginFill(0xffffff);
            this.componentMask.drawRect(this.game.x - Magneon.APP_WIDTH / 2, this.game.y, Magneon.APP_WIDTH, Magneon.APP_HEIGHT);
            this.componentMask.endFill();
            this.renderer.resize(w, h);
            this.componentBoundary.scale.x = this.game.scale.x = this.app_scale;
            this.componentBoundary.scale.y = this.game.scale.y = this.app_scale;
        };
        GameContainer.prototype.update = function () {
            var dt = this.ticker.elapsedMS * .001;
            dt = Math.min(.1, dt);
            this.debugText.text = "FPS: " + Math.round(1.0 / dt);
            this.game.update(dt);
        };
        return GameContainer;
    }(PIXI.Application));
    Magneon.GameContainer = GameContainer;
})(Magneon || (Magneon = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="GameContainer.ts"/>
///<reference path="game/Defs.ts"/>
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}
function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}
function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel /*= document.onmousewheel*/ = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}
function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel /*= document.onmousewheel*/ = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}
function fitApp(app) {
    var margin = 10; //30;
    var body = document.getElementById('body');
    body.style.width = window.innerWidth + "px";
    body.style.height = window.innerHeight + "px";
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    var contentDiv = document.getElementById("content");
    var p_width = window.innerWidth;
    var p_height = window.innerHeight;
    var p_ratio = p_width / p_height;
    var containerWidth = Magneon.APP_WIDTH + 2 * margin;
    var containerHeight = Magneon.APP_HEIGHT + 2 * margin;
    var containerInnerRatio = containerWidth / containerHeight;
    if (containerInnerRatio < p_ratio)
        containerWidth = containerHeight * p_ratio;
    else
        containerHeight = containerWidth / p_ratio;
    var scale = p_width / containerWidth;
    app.view.style.webkitTransform = app.view.style.transform = "matrix(" + scale + ", 0, 0, " + scale + ", 0, 0)";
    app.view.style.webkitTransformOrigin = app.view.style.transformOrigin = "0 0";
    app.resize(containerWidth, containerHeight);
}
window.onload = function () {
    disableScroll();
    var app = new Magneon.GameContainer();
    app.view.style.position = "absolute";
    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);
    // PIXI.loader.add('oceanShader', 'assets/oceanShader.frag')
    //         .add('skyShader', 'assets/skyShader.frag')
    //         .add('ripples', 'assets/ripples.png');
    PIXI.loader.load(function (loader, resources) {
        app.setup();
    });
    fitApp(app);
    document.onresize = function () {
        fitApp(app);
    };
    // window.onresize = () => {
    //     fitApp(app);
    // }
    window.onkeydown = function (e) {
        app.keyDown(e.keyCode);
    };
    // window.onmousedown = (e) => {
    //     fitApp(app);
    // }
};
