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
///<reference path="../../../pixi/pixi.js.d.ts"/>
var Magneon;
(function (Magneon) {
    var Point = /** @class */ (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.parseFromData = function (data) {
            return new Point(data["x"] * Magneon.GRID_UNIT_SIZE, data["y"] * Magneon.GRID_UNIT_SIZE);
        };
        Point.prototype.toPixi = function () {
            return new PIXI.Point(this.x, this.y);
        };
        Point.prototype.clone = function () {
            return new Point(this.x, this.y);
        };
        Point.prototype.equals = function (other) {
            return this.x == other.x && this.y == other.y;
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
            _this.wobbleGraphics = new PIXI.Graphics();
            _this.addChild(_this.wobbleGraphics);
            return _this;
        }
        Border.fromData = function (data) {
            var result = new Border();
            var type = data["type"];
            result.magnetic = type == "magnet";
            result.spring = type == "spring";
            var animData = data["anim"];
            if (animData) {
                result.pivot = Magneon.Point.parseFromData(animData["pivot"]).toPixi();
                result.x = result.pivot.x;
                result.y = result.pivot.y;
                result.animate = true;
            }
            var prevPt = Magneon.Point.parseFromData(data["src"]);
            for (var _i = 0, _a = data["segs"]; _i < _a.length; _i++) {
                var seg = _a[_i];
                var pt = Magneon.Point.parseFromData(seg);
                var or = seg["or"];
                if (or == 0) {
                    //create straight line:
                    result.segments.push(new Magneon.LineSegment(prevPt.x, prevPt.y, pt.x, pt.y));
                }
                else {
                    //create curve:
                    var center = pt.clone();
                    center.x = or < 0 ? pt.x : prevPt.x;
                    center.y = or > 0 ? pt.y : prevPt.y;
                    var toA = prevPt.clone().subtract(center);
                    var toB = pt.clone().subtract(center);
                    var reps = 30;
                    var locPrev = prevPt;
                    for (var rep = 0; rep < reps; ++rep) {
                        var t = (rep + 1) / reps;
                        var ang = t * Math.PI * .5;
                        var p = toA.clone().multiply(Math.cos(ang)).add(toB.clone().multiply(Math.sin(ang))).add(center);
                        result.segments.push(new Magneon.LineSegment(locPrev.x, locPrev.y, p.x, p.y));
                        locPrev = p;
                    }
                }
                prevPt = pt;
            }
            result.prepare();
            return result;
        };
        Border.prototype.drawWithOffsetFromOthers = function (bs, gr, alpha, rad) {
            if (gr === void 0) { gr = this; }
            if (alpha === void 0) { alpha = 1; }
            if (rad === void 0) { rad = 3; }
            this.otherBorders = bs;
            gr.clear();
            var n = this.segments.length;
            if (n == 0)
                return;
            var pts = [this.segments[0].p1, this.segments[this.segments.length - 1].p2];
            var closest = [1000, 1000];
            for (var i = 0; i < 2; ++i) {
                for (var _i = 0, bs_1 = bs; _i < bs_1.length; _i++) {
                    var b = bs_1[_i];
                    if (this == b)
                        continue;
                    var p = b.projectPointToBorder(pts[i]);
                    closest[i] = Math.min(closest[i], p.subtract(pts[i]).length());
                }
            }
            var totalLength = 0;
            for (var _a = 0, _b = this.segments; _a < _b.length; _a++) {
                var s = _b[_a];
                totalLength += s.length;
            }
            var distance = 6;
            var minOffset = Math.max(0, distance - closest[0]);
            var maxOffset = totalLength - Math.max(0, distance - closest[1]);
            var clr = this.spring ? 0xffff00 : (this.magnetic ? 0x00ffff : 0xff00ff);
            var sumOffset1 = 0;
            var drawnFirst = false;
            for (var i = 0; i < n; ++i) {
                var seg = this.segments[i];
                gr.lineStyle(2 * rad, clr, alpha);
                var sumOffset2 = sumOffset1 + seg.length;
                if (sumOffset2 < minOffset) {
                    //skip this segment:
                    sumOffset1 = sumOffset2;
                    continue;
                }
                var p1 = seg.p1.clone();
                var p2 = seg.p2.clone();
                var isStart = !drawnFirst && sumOffset2 > minOffset;
                if (isStart) {
                    drawnFirst = true;
                    var t = (minOffset - sumOffset1) / seg.length;
                    p1 = seg.p1.clone().add(seg.dir.clone().multiply(t * seg.length));
                }
                var isEnd = i == (n - 1) || maxOffset < sumOffset2;
                if (isEnd) {
                    var t = (maxOffset - sumOffset1) / seg.length;
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
                if (isEnd)
                    break;
            }
        };
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
            // this.draw();
        };
        Border.prototype.update = function (dt) {
            this.x = this.pivot.x;
            if (this.animate) {
                this.animParam = (this.animParam + dt / 10.0) % 1.0;
                this.y = this.pivot.y + Math.sin(this.animParam * 2 * Math.PI) * 50;
                this.rotation = this.animParam * 2 * Math.PI;
            }
            else {
                this.wobbleGraphics.visible = false;
                this.y = this.pivot.y;
            }
            this.wobbleAnimParam = Math.min(1.0, this.wobbleAnimParam + dt / .5);
            if (this.wobbleAnimParam < 1.0) {
                this.wobbleGraphics.visible = true;
                var rad = 3 + 15 * Math.abs(Math.sin(this.wobbleAnimParam * 5)) * (1 - this.wobbleAnimParam);
                this.drawWithOffsetFromOthers(this.otherBorders, this.wobbleGraphics, 1, rad);
            }
            else {
                this.wobbleGraphics.visible = false;
            }
            // let offset = 2 * Math.sin(this.wobbleAnimParam * 40) * (1 - this.wobbleAnimParam);
            // this.x += -this.segments[0].dir.y * offset;
            // this.y += this.segments[0].dir.x * offset;
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
            var clr = 0xffffff; // this.spring ? 0xffff00 : (this.magnetic ? 0x00ffff : 0xff00ff);
            var n = this.segments.length;
            for (var i = 0; i < n; ++i) {
                var seg = this.segments[i];
                this.lineStyle(6, clr, 0.5);
                this.moveTo(seg.p1.x, seg.p1.y);
                this.lineTo(seg.p2.x, seg.p2.y);
                if (i == 0 || i == n - 1) {
                    this.lineStyle(0);
                    this.beginFill(clr, 0.5);
                    if (i == 0)
                        this.drawCircle(seg.p1.x, seg.p1.y, 3);
                    if (i == n - 1)
                        this.drawCircle(seg.p2.x, seg.p2.y, 3);
                    this.endFill();
                }
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
            _this.jumpEffect = 0;
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
        Ball.prototype.setJumpEffect = function (effect, dir) {
            this.jumpEffect = effect;
            var calcEffect = Magneon.clamp(effect * (dir.length() - .7) / .3);
            this.forceStickDirection = dir;
            this.setDirectionVisuals(this.forceStickDirection, Math.pow(calcEffect, .5));
        };
        Ball.prototype.release = function () {
            var calcEffect = Math.max(this.jumpEffect, this.forceStickEffect);
            var shootEffect = calcEffect;
            if (this.forceStickDirection.length() > 0.7)
                shootEffect *= (this.forceStickDirection.length() - .7) / .3;
            else
                shootEffect = 0.0;
            this.velocity.multiply(1 - calcEffect).add(this.forceStickDirection.normalize().multiply(-1000 * shootEffect));
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
    Magneon.touchRad = 150.0;
    var Level = /** @class */ (function (_super) {
        __extends(Level, _super);
        function Level(w, h, data) {
            var _this = _super.call(this) || this;
            _this.railBuffer = [];
            _this.magnetAnchors = [];
            _this.bouncePending = false;
            _this.rotationSpeed = 0;
            _this.showDir = false;
            _this.showDirTimeBuffer = 0.0;
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
            _this.levelElementsContainer = new PIXI.Container();
            _this.addChild(_this.levelElementsContainer);
            _this.addChild(_this.ball);
            _this.loadLevel(data);
            return _this;
        }
        Level.prototype.loadLevel = function (data) {
            this.data = data;
            //clear previous level:
            this.ball.velocity = new Magneon.Point(0, 0);
            this.borders = [];
            this.magnetAnchors = [];
            this.levelElementsContainer.removeChildren();
            this.ball.position = Magneon.Point.parseFromData(data["start"]).toPixi();
            var bs = data["borders"];
            if (bs) {
                for (var _i = 0, bs_2 = bs; _i < bs_2.length; _i++) {
                    var b = bs_2[_i];
                    this.borders.push(Magneon.Border.fromData(b));
                }
            }
            for (var _a = 0, _b = this.borders; _a < _b.length; _a++) {
                var b = _b[_a];
                this.levelElementsContainer.addChild(b);
                b.drawWithOffsetFromOthers(this.borders);
            }
            var ans = data["anchors"];
            if (ans) {
                for (var _c = 0, ans_1 = ans; _c < ans_1.length; _c++) {
                    var a = ans_1[_c];
                    var sa = new Magneon.MagnetAnchor();
                    sa.position = Magneon.Point.parseFromData(a).toPixi();
                    this.levelElementsContainer.addChild(sa);
                    this.magnetAnchors.push(sa);
                }
            }
        };
        Level.prototype.updateRotation = function () {
            var clampedAng = this.rotationAngle;
            if (clampedAng < -.1)
                clampedAng += .1;
            else if (clampedAng > .1)
                clampedAng -= .1;
            else
                clampedAng = 0;
            this.railBuffer.push(clampedAng);
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
            if (Math.abs(this.rotationSpeed) < .1) {
                this.rotationSpeed = 0;
            }
            else {
                this.inputSource = this.inputLocation;
            }
        };
        Level.prototype.update = function (dt) {
            this.updateRotation();
            if (this.hasInput) {
                this.inputTime += dt;
            }
            for (var _i = 0, _a = this.borders; _i < _a.length; _i++) {
                var b = _a[_i];
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
            for (var _b = 0, _c = this.borders; _b < _c.length; _b++) {
                var b = _c[_b];
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
            var max_magnet_dist = Magneon.BALL_RADIUS * .1;
            if (this.hasInput) {
                //apply rail force:
                this.ball.velocity.add(sumRailForce.multiply(dt * 30000 * this.rotationSpeed));
            }
            var forceStickMagnet = 0;
            //try to find magnet anchor that is even closer:
            if (this.hasInput) {
                for (var _d = 0, _e = this.magnetAnchors; _d < _e.length; _d++) {
                    var m = _e[_d];
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
            if (closestPoint && closestDistance < max_magnet_dist && this.hasInput) {
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
            if (closestPoint)
                this.ball.forceStick(closestPoint, forceStickMagnet, toPt);
            else
                this.ball.forceStick(ballCenter, 0, toPt);
            if (forceStickMagnet < 0.0001 && closestDistance < max_magnet_dist) {
                console.log("closest dist:", closestDistance);
                this.ball.setJumpEffect(toPt.length(), toPt);
            }
            // else {
            //     this.ball.setJumpEffect(0, toPt);
            // }
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
            this.inputLocation = p.clone();
            var currInputDir = this.inputDirection.clone();
            var angle = Math.acos(Math.max(-1, Math.min(1, currInputDir.dot(inputDir))));
            var angleFactor = Magneon.clamp(3 * angle);
            if (currInputDir.clone().makePerpendicular().dot(inputDir) < 0)
                angleFactor = -angleFactor;
            console.log(distanceFactor, angleFactor);
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
var Magneon;
(function (Magneon) {
    Magneon.APP_WIDTH = 600;
    Magneon.APP_HEIGHT = 800;
    Magneon.GRID_UNIT_SIZE = 25.0;
    Magneon.BALL_RADIUS = .999 * Magneon.GRID_UNIT_SIZE; //25.0;
    Magneon.DEBUG_MODE = true;
    Magneon.CTRL_PRESSED = false;
    function clamp(n, floor, ceil) {
        if (floor === void 0) { floor = 0; }
        if (ceil === void 0) { ceil = 1; }
        return Math.max(floor, Math.min(ceil, n));
    }
    Magneon.clamp = clamp;
})(Magneon || (Magneon = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>
var Magneon;
(function (Magneon) {
    var LevelLoader = /** @class */ (function () {
        function LevelLoader() {
        }
        LevelLoader.loadLevel = function (index, cb) {
            var filePath = "levels/custom/level" + index + ".json";
            var callback = function () {
                var data = PIXI.loader.resources[filePath].data;
                if (!data)
                    data = PIXI.loader.resources['defaultLevel'].data;
                cb(data);
            };
            var ress = PIXI.loader.resources;
            ress[filePath] = undefined;
            PIXI.loader.add([filePath]);
            PIXI.loader.load(callback);
        };
        LevelLoader.listLevels = function (cb) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "scripts/getLevelList.php");
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var obj = JSON.parse(this.response);
                    cb(obj);
                }
            };
            xmlhttp.send();
        };
        LevelLoader.storeLevel = function (levelIndex, data, cb, listener) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "scripts/getLevelList.php");
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var obj = JSON.parse(this.response);
                    cb.call(listener, obj);
                }
            };
            var formData = new FormData();
            formData.append("data", JSON.stringify(data));
            formData.append("id", '' + levelIndex);
            xmlhttp.send(formData);
        };
        LevelLoader.makeNewLevel = function (cb) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "scripts/createLevel.php");
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log('RESP:', this.response);
                    cb(this.response);
                }
            };
            xmlhttp.send();
        };
        return LevelLoader;
    }());
    Magneon.LevelLoader = LevelLoader;
})(Magneon || (Magneon = {}));
///<reference path="../../../../pixi/pixi.js.d.ts"/>
var Magneon;
(function (Magneon) {
    var SquareButton = /** @class */ (function (_super) {
        __extends(SquareButton, _super);
        function SquareButton(txt, clr) {
            var _this = _super.call(this) || this;
            var gr = new PIXI.Graphics();
            gr.beginFill(0x0, .2);
            gr.lineStyle(4, clr, 1);
            gr.drawRoundedRect(-40, -40, 80, 80, 15);
            gr.endFill();
            _this.addChild(gr);
            var tb = new PIXI.Text(txt);
            tb.style.fontFamily = 'Title Font';
            tb.style.fill = clr;
            tb.style.fontWeight = 'bold';
            tb.style.fontSize = txt.length < 3 ? 50 : 20; //(4 - txt.length) * 20;
            tb.anchor.set(0.5);
            // tb.pivot.x = .5;
            // tb.pivot.y = .5;
            // tb.x = -tb.width / 2;
            // tb.y = -tb.height / 2;
            _this.addChild(tb);
            return _this;
        }
        SquareButton.prototype.hitTestPoint = function (p) {
            p = this.toLocal(p, Magneon.GLOBAL_SCENE);
            return Math.abs(p.x) < 40 && Math.abs(p.y) < 40;
        };
        return SquareButton;
    }(PIXI.Container));
    Magneon.SquareButton = SquareButton;
})(Magneon || (Magneon = {}));
///<reference path="../../../../pixi/pixi.js.d.ts"/>
var Magneon;
(function (Magneon) {
    var ScrollPanel = /** @class */ (function (_super) {
        __extends(ScrollPanel, _super);
        function ScrollPanel(w, h) {
            var _this = _super.call(this) || this;
            _this.barWidth = 40;
            _this.leftMargin = 10;
            _this.size = new Magneon.Point(w, h);
            _this.unitSize = (_this.size.x - _this.barWidth - _this.leftMargin) / 3;
            _this.levelButtonContainer = new PIXI.Container();
            _this.addChild(_this.levelButtonContainer);
            var gr = new PIXI.Graphics();
            gr.beginFill(0xffffff, 1);
            gr.drawRect(0, 0, w, h);
            gr.isMask = true;
            _this.addChild(gr);
            _this.levelButtonContainer.mask = gr;
            _this.levelButtonScrollPanel = new PIXI.Container();
            _this.levelButtonContainer.addChild(_this.levelButtonScrollPanel);
            var gr = new PIXI.Graphics();
            gr.lineStyle(4, 0x00ff00, 1);
            gr.drawRoundedRect(0, 0, w, h, 10);
            _this.addChild(gr);
            gr = new PIXI.Graphics();
            gr.lineStyle(0);
            gr.beginFill(0x00ff00, .2);
            gr.drawRoundedRect(8, 0, _this.barWidth - 16, h - 20, 5);
            gr.endFill();
            gr.x = _this.size.x - _this.barWidth;
            gr.y = 10;
            _this.addChild(gr);
            _this.scrollGraphics = new PIXI.Graphics();
            _this.addChild(_this.scrollGraphics);
            _this.scrollGraphics.beginFill(0x00ff00);
            _this.scrollGraphics.drawRoundedRect(-_this.barWidth / 2 + 8, -_this.barWidth / 2 + 5, _this.barWidth - 16, _this.barWidth - 10, 5);
            _this.scrollGraphics.endFill();
            _this.setOffset(0);
            return _this;
        }
        ScrollPanel.prototype.push = function (elem) {
            var idx = this.levelButtonScrollPanel.children.length;
            var col = idx % 3;
            var row = Math.floor(idx / 3);
            elem.x = this.leftMargin + (col + 0.5) * this.unitSize;
            elem.y = (row + 0.5) * this.unitSize;
            this.levelButtonScrollPanel.addChild(elem);
        };
        ScrollPanel.prototype.clear = function () {
            this.levelButtonScrollPanel.removeChildren();
        };
        ScrollPanel.prototype.update = function (dt) {
            var minY = 0, maxY = 0;
            for (var _i = 0, _a = this.levelButtonScrollPanel.children; _i < _a.length; _i++) {
                var c = _a[_i];
                minY = Math.min(minY, c.y - 100);
                maxY = Math.max(maxY, c.y + 100);
            }
        };
        ScrollPanel.prototype.setOffset = function (offset) {
            offset = Magneon.clamp(offset, 0, 1);
            this.scrollGraphics.x = this.size.x - this.barWidth / 2;
            this.scrollGraphics.y = 20 + offset * (this.size.y - 40);
            var rows = Math.floor((this.levelButtonScrollPanel.children.length - 1) / 3) + 1;
            rows = Math.max(rows, 1);
            var overflow = rows * this.unitSize - this.size.y;
            this.levelButtonScrollPanel.y = -offset * Math.max(0, overflow);
        };
        ScrollPanel.prototype.touchDown = function (p) {
            var pt = this.localTransform.applyInverse(p.toPixi());
            if (pt.x > this.size.x - this.barWidth && pt.x < this.size.x && pt.y > 0 && pt.y < this.size.y) {
                this.scrolling = true;
                this.setOffset(pt.y / this.size.y);
            }
        };
        ScrollPanel.prototype.touchMove = function (p) {
            if (this.scrolling) {
                var pt = this.localTransform.applyInverse(p.toPixi());
                this.setOffset(pt.y / this.size.y);
            }
        };
        ScrollPanel.prototype.touchUp = function (p) {
            this.scrolling = false;
        };
        return ScrollPanel;
    }(PIXI.Container));
    Magneon.ScrollPanel = ScrollPanel;
})(Magneon || (Magneon = {}));
///<reference path="../../../../pixi/pixi.js.d.ts"/>
///<reference path="SquareButton.ts"/>
///<reference path="../Point.ts"/>
///<reference path="ScrollPanel.ts"/>
var Magneon;
(function (Magneon) {
    function checkIfMobile() {
        var check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true; })(navigator.userAgent || navigator.vendor);
        return check;
    }
    Magneon.checkIfMobile = checkIfMobile;
    ;
    var Menu = /** @class */ (function (_super) {
        __extends(Menu, _super);
        function Menu(w, h) {
            var _this = _super.call(this) || this;
            _this.isBusy = false;
            _this.buttons = [];
            _this.onOpenLevel = undefined;
            _this.onOpenEditor = undefined;
            _this.size = new PIXI.Point(w, h);
            var bg = new PIXI.Graphics();
            bg.beginFill(0x0, .8);
            bg.drawRect(0, 0, w, h);
            bg.endFill();
            _this.addChild(bg);
            var panel = new PIXI.Graphics();
            panel.lineStyle(4, 0x00ffff);
            panel.beginFill(0x0, .3);
            panel.drawRoundedRect(-200, -300, 400, 600, 10);
            _this.addChild(panel);
            panel.x = w / 2;
            panel.y = h / 2;
            _this.text = new PIXI.Text('');
            _this.text.x = w / 2;
            _this.text.y = h / 2 - 200;
            _this.text.style.align = 'center';
            _this.text.style.fill = 0xffffff;
            _this.text.style.fontSize = 12;
            _this.addChild(_this.text);
            _this.regButtonContainer = new PIXI.Container();
            _this.addChild(_this.regButtonContainer);
            var btn = new Magneon.SquareButton('NEW', 0xffaa00);
            btn.callback = function () { _this.makeNewLevel(); };
            _this.regButtonContainer.addChild(btn);
            _this.buttons.push(btn);
            btn.x = Magneon.APP_WIDTH / 2 - 100;
            btn.y = Magneon.APP_HEIGHT / 2 - 240;
            btn = new Magneon.SquareButton('EDIT', 0x00ffaa);
            btn.callback = function () {
                if (window.innerWidth < window.innerHeight)
                    alert('Please make sure this window is in landscape mode (i.e.: it has a horizontal layout).');
                else if (checkIfMobile())
                    alert('The editor-option is only available in a Desktop browser.');
                else {
                    _this.onOpenEditor();
                    _this.visible = false;
                }
            };
            _this.regButtonContainer.addChild(btn);
            _this.buttons.push(btn);
            btn.x = Magneon.APP_WIDTH / 2;
            btn.y = Magneon.APP_HEIGHT / 2 - 240;
            _this.scrollPanel = new Magneon.ScrollPanel(360, 460);
            _this.scrollPanel.x = w / 2 - 180;
            _this.scrollPanel.y = h / 2 - 180;
            _this.addChild(_this.scrollPanel);
            _this.visible = false;
            return _this;
        }
        Menu.prototype.loadLevel = function (index, openEditor) {
            var _this = this;
            if (openEditor === void 0) { openEditor = false; }
            this.isBusy = true;
            var onLevelLoaded = function (result) {
                _this.isBusy = false;
                _this.visible = false;
                if (_this.onOpenLevel)
                    _this.onOpenLevel(result);
                if (openEditor && _this.onOpenEditor)
                    _this.onOpenEditor();
            };
            Magneon.LevelLoader.loadLevel(index, onLevelLoaded);
        };
        Menu.prototype.makeNewLevel = function () {
            var _this = this;
            var cb = function (idx) { _this.loadLevel(idx, true); };
            Magneon.LevelLoader.makeNewLevel(cb);
        };
        Menu.prototype.update = function (dt) {
            this.scrollPanel.update(dt);
        };
        Menu.prototype.open = function () {
            var _this = this;
            this.isBusy = true;
            this.visible = true;
            this.buttons = [];
            this.scrollPanel.clear();
            for (var _i = 0, _a = this.regButtonContainer.children; _i < _a.length; _i++) {
                var c = _a[_i];
                this.buttons.push(c);
            }
            var onLevelListLoaded = function (result) {
                console.log(result);
                if (!result) {
                    console.log('no result');
                    _this.isBusy = false;
                    return;
                }
                result.sort(function (a, b) { return a - b; });
                _this.text.text = '';
                var _loop_1 = function (r) {
                    var btn = new Magneon.SquareButton('' + r, 0x00ff00);
                    btn.data = r;
                    btn.callback = function () { _this.loadLevel(btn.data); };
                    _this.scrollPanel.push(btn);
                    _this.buttons.push(btn);
                };
                for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                    var r = result_1[_i];
                    _loop_1(r);
                }
                _this.isBusy = false;
            };
            Magneon.LevelLoader.listLevels(onLevelListLoaded);
        };
        Menu.prototype.touchDown = function (p) {
            if (this.isBusy)
                return;
            this.scrollPanel.touchDown(p);
            for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
                var b = _a[_i];
                if (b.hitTestPoint(p.toPixi())) {
                    b.callback();
                }
            }
            var pp = p.clone();
            pp.subtract(new Magneon.Point(Magneon.APP_WIDTH / 2, Magneon.APP_HEIGHT / 2));
            if (Math.abs(pp.x) > 200 || Math.abs(pp.y) > 300) {
                this.visible = false;
            }
        };
        Menu.prototype.touchMove = function (p) {
            this.scrollPanel.touchMove(p);
        };
        Menu.prototype.touchUp = function (p) {
            this.scrollPanel.touchUp(p);
        };
        return Menu;
    }(PIXI.Container));
    Magneon.Menu = Menu;
})(Magneon || (Magneon = {}));
///<reference path="../../../../pixi/pixi.js.d.ts"/>
///<reference path="../Level.ts"/>
var Magneon;
(function (Magneon) {
    var EditorNode = /** @class */ (function (_super) {
        __extends(EditorNode, _super);
        function EditorNode(gridX, gridY) {
            var _this = _super.call(this) || this;
            _this.beginFill(0xffff00);
            _this.lineStyle(2, 0xaaaa00);
            _this.drawCircle(0, 0, 10);
            _this.drawCircle(0, 0, 5);
            _this.endFill();
            _this.setPosition(gridX, gridY);
            return _this;
        }
        EditorNode.prototype.setPosition = function (gridX, gridY) {
            this.x = gridX * Magneon.GRID_UNIT_SIZE;
            this.y = gridY * Magneon.GRID_UNIT_SIZE;
        };
        EditorNode.prototype.getGridPos = function () {
            return new Magneon.Point(Math.round(this.x / Magneon.GRID_UNIT_SIZE), Math.round(this.y / Magneon.GRID_UNIT_SIZE));
        };
        return EditorNode;
    }(PIXI.Graphics));
    Magneon.EditorNode = EditorNode;
})(Magneon || (Magneon = {}));
var Magneon;
(function (Magneon) {
    var ElementType;
    (function (ElementType) {
        ElementType[ElementType["None"] = 0] = "None";
        ElementType[ElementType["Border"] = 1] = "Border";
        ElementType[ElementType["Start"] = 2] = "Start";
        ElementType[ElementType["Anchor"] = 3] = "Anchor";
    })(ElementType = Magneon.ElementType || (Magneon.ElementType = {}));
})(Magneon || (Magneon = {}));
///<reference path="../../../../pixi/pixi.js.d.ts"/>
///<reference path="../Level.ts"/>
///<reference path="EditorNode.ts"/>
///<reference path="ElementType.ts"/>
var Magneon;
(function (Magneon) {
    var EditorGrid = /** @class */ (function (_super) {
        __extends(EditorGrid, _super);
        function EditorGrid() {
            var _this = _super.call(this) || this;
            _this.level = null;
            _this.data = null;
            _this.nodeIdx = -1;
            _this.nodes = [];
            _this.currElementData = null;
            _this.currType = Magneon.ElementType.None;
            var gridOverlay = new PIXI.Graphics();
            _this.addChild(gridOverlay);
            var rows = Magneon.APP_HEIGHT / Magneon.GRID_UNIT_SIZE;
            var cols = Magneon.APP_WIDTH / Magneon.GRID_UNIT_SIZE;
            gridOverlay.beginFill(0xffffff, 0.1);
            gridOverlay.drawRect(0, 0, Magneon.APP_WIDTH, Magneon.APP_HEIGHT);
            gridOverlay.endFill();
            gridOverlay.beginFill(0xffff00, .5);
            for (var i = 0; i < rows; ++i) {
                for (var j = 0; j < cols; ++j) {
                    gridOverlay.drawCircle(j * Magneon.GRID_UNIT_SIZE, i * Magneon.GRID_UNIT_SIZE, 2);
                }
            }
            gridOverlay.endFill();
            Magneon.ElementsPanel.instance.visible = false;
            Magneon.ElementsPanel.instance.onAddBorder = function (p) {
                if (!_this.isPointOnGrid(p))
                    return;
                var c = _this.getClampedCoord(p);
                var cols = Magneon.APP_WIDTH / Magneon.GRID_UNIT_SIZE;
                c.x = Math.min(cols - 3, c.x);
                if (_this.data) {
                    var elem = { "type": "normal", "src": { "x": c.x, "y": c.y }, "anim": null, "segs": [{ "x": c.x + 3, "y": c.y, "or": 0 }] };
                    _this.data["borders"].push(elem);
                    _this.updateLevelLayout();
                }
            };
            Magneon.ElementsPanel.instance.onAddAnchor = function (p) {
                if (!_this.isPointOnGrid(p))
                    return;
                var c = _this.getClampedCoord(p);
                if (_this.data) {
                    _this.data["anchors"].push({ "x": c.x, "y": c.y });
                    _this.updateLevelLayout();
                }
            };
            Magneon.PropertiesPanel.instance.onDelete = function () {
                console.log('delete!');
                var array = null;
                if (_this.currType == Magneon.ElementType.Border)
                    array = _this.data["borders"];
                else if (_this.currType == Magneon.ElementType.Anchor)
                    array = _this.data["anchors"];
                if (array) {
                    var idx = array.indexOf(_this.currElementData);
                    console.log(array, idx);
                    if (idx > -1) {
                        array.splice(idx, 1);
                        _this.updateLevelLayout();
                    }
                }
            };
            Magneon.PropertiesPanel.instance.onPropertiesChanged = function () {
                _this.updateLevelLayout();
            };
            Magneon.PropertiesPanel.instance.visible = false;
            return _this;
        }
        EditorGrid.prototype.open = function (level) {
            Magneon.ElementsPanel.instance.visible = true;
            this.level = level;
            this.data = JSON.parse(JSON.stringify(level.data));
            this.visible = true;
            this.clearNodes();
        };
        EditorGrid.prototype.close = function () {
            this.visible = false;
            Magneon.ElementsPanel.instance.visible = false;
        };
        EditorGrid.prototype.clearNodes = function () {
            this.nodeIdx = 0;
            for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
                var n = _a[_i];
                this.removeChild(n);
            }
            this.nodes = [];
        };
        EditorGrid.prototype.update = function (dt) {
        };
        EditorGrid.prototype.isCoordOnGrid = function (p) {
            var rows = Magneon.APP_HEIGHT / Magneon.GRID_UNIT_SIZE;
            var cols = Magneon.APP_WIDTH / Magneon.GRID_UNIT_SIZE;
            return p.x >= 0 && p.x <= cols && p.y > 0 && p.y < rows;
        };
        EditorGrid.prototype.isPointOnGrid = function (p) {
            var x = Math.round(p.x / Magneon.GRID_UNIT_SIZE);
            var y = Math.round(p.y / Magneon.GRID_UNIT_SIZE);
            return this.isCoordOnGrid(new Magneon.Point(x, y));
        };
        EditorGrid.prototype.coordToScreen = function (p) {
            return new Magneon.Point(p.x * Magneon.GRID_UNIT_SIZE, p.y * Magneon.GRID_UNIT_SIZE);
        };
        EditorGrid.prototype.getClampedCoord = function (p) {
            var x = Math.round(p.x / Magneon.GRID_UNIT_SIZE);
            var y = Math.round(p.y / Magneon.GRID_UNIT_SIZE);
            var rows = Magneon.APP_HEIGHT / Magneon.GRID_UNIT_SIZE;
            var cols = Magneon.APP_WIDTH / Magneon.GRID_UNIT_SIZE;
            x = Math.max(0, Math.min(cols, x));
            y = Math.max(0, Math.min(rows, y));
            return new Magneon.Point(x, y);
        };
        EditorGrid.prototype.touchDown = function (p) {
            Magneon.ElementsPanel.instance.touchDown(p);
            Magneon.PropertiesPanel.instance.touchDown(p);
            this.currType = Magneon.ElementType.None;
            this.nodeIdx = -1;
            if (this.nodes.length > 0) {
                //edit element:
                for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
                    var n = _a[_i];
                    if (p.clone().subtract(new Magneon.Point(n.x, n.y)).length() < 15) {
                        this.nodeIdx = this.nodes.indexOf(n);
                        this.currType = Magneon.ElementType.Border;
                        break;
                    }
                }
                //deselect editing:
                if (this.nodeIdx < 0) {
                    var gridPos = this.getClampedCoord(p);
                    //add new node?
                    var stuffChanged = false;
                    for (var i = 1; i < this.nodes.length; ++i) {
                        var p1 = this.nodes[i - 1].getGridPos();
                        var obj = {};
                        obj["src"] = { "x": p1.x, "y": p1.y };
                        obj["segs"] = [this.currElementData["segs"][i - 1]];
                        var b = Magneon.Border.fromData(obj);
                        if (b.projectPointToBorder(p).subtract(p).length() < 5) {
                            if (EditorGrid.rightClick) {
                                //change curve orientation:
                                var seg = this.currElementData["segs"][i - 1];
                                var or = seg["or"] + 1;
                                if (or > 1)
                                    or = -1;
                                seg["or"] = or;
                            }
                            else {
                                //add node to curve:
                                var n = new Magneon.EditorNode(gridPos.x, gridPos.y);
                                this.nodes.splice(i, 0, n);
                                this.currElementData["segs"].splice(i - 1, 0, { "x": gridPos.x, "y": gridPos.y, "or": 0 });
                                this.addChild(n);
                            }
                            //make new point:
                            this.updateLevelLayout();
                            stuffChanged = true;
                            break;
                        }
                    }
                    if (!stuffChanged)
                        this.clearNodes();
                }
                else if (EditorGrid.rightClick) {
                    //delete node:
                    if (this.nodes.length > 2) {
                        var node = this.nodes[this.nodeIdx];
                        this.removeChild(node);
                        this.nodes.splice(this.nodeIdx, 1);
                        if (this.nodeIdx == 0) {
                            //replace source:
                            var p_1 = this.currElementData["segs"][0];
                            this.currElementData["src"] = { "x": p_1.x, "y": p_1.y };
                            this.currElementData["segs"].splice(0, 1);
                        }
                        else {
                            this.currElementData["segs"].splice(this.nodeIdx - 1, 1);
                        }
                        this.nodeIdx = -1;
                        this.updateLevelLayout();
                    }
                }
            }
            else {
                //find closest border:
                var closestDistance = 0;
                var closestBorder = undefined;
                for (var _b = 0, _c = this.data["borders"]; _b < _c.length; _b++) {
                    var b = _c[_b];
                    var border = Magneon.Border.fromData(b);
                    var proj = border.projectPointToBorder(p);
                    var dist = proj.subtract(p).length();
                    if (dist < closestDistance || !closestBorder) {
                        closestDistance = dist;
                        closestBorder = border;
                        this.currElementData = b;
                    }
                }
                if (closestDistance < 10) {
                    //select border:
                    this.currType = Magneon.ElementType.Border;
                    var start = this.currElementData["src"];
                    this.nodes.push(new Magneon.EditorNode(start["x"], start["y"]));
                    for (var _d = 0, _e = this.currElementData["segs"]; _d < _e.length; _d++) {
                        var s = _e[_d];
                        this.nodes.push(new Magneon.EditorNode(s["x"], s["y"]));
                    }
                    for (var _f = 0, _g = this.nodes; _f < _g.length; _f++) {
                        var n = _g[_f];
                        this.addChild(n);
                    }
                }
                else if (Magneon.Point.parseFromData(this.data["start"]).subtract(p).length() < Magneon.BALL_RADIUS) {
                    this.currElementData = this.data["start"];
                    this.currType = Magneon.ElementType.Start;
                }
                else {
                    //try to find anchor point:
                    for (var _h = 0, _j = this.data["anchors"]; _h < _j.length; _h++) {
                        var a = _j[_h];
                        var q = Magneon.Point.parseFromData(a);
                        if (q.subtract(p).length() < 10) {
                            this.currElementData = a;
                            this.currType = Magneon.ElementType.Anchor;
                            break;
                        }
                    }
                }
            }
            Magneon.PropertiesPanel.instance.setEditor(this.currType, this.currElementData);
        };
        EditorGrid.prototype.updateLevelLayout = function () {
            if (this.nodes.length > 1) {
                var p1 = this.nodes[0].getGridPos();
                console.log("src", this.currElementData["src"]);
                this.currElementData["src"]["x"] = p1.x;
                this.currElementData["src"]["y"] = p1.y;
                for (var i = 1; i < this.nodes.length; ++i) {
                    console.log("seg i", this.currElementData["src"]);
                    var pi = this.nodes[i].getGridPos();
                    this.currElementData["segs"][i - 1]["x"] = pi.x;
                    this.currElementData["segs"][i - 1]["y"] = pi.y;
                }
            }
            this.level.loadLevel(this.data);
        };
        EditorGrid.prototype.touchMove = function (p) {
            Magneon.ElementsPanel.instance.touchMove(p);
            Magneon.PropertiesPanel.instance.touchMove(p);
            var gp = this.getClampedCoord(p);
            if (this.currType == Magneon.ElementType.Start || this.currType == Magneon.ElementType.Anchor) {
                this.currElementData["x"] = gp.x;
                this.currElementData["y"] = gp.y;
                this.updateLevelLayout();
            }
            else if (this.nodeIdx >= 0) {
                var n = this.nodes[this.nodeIdx];
                var currPos = n.getGridPos();
                if (!gp.equals(currPos)) {
                    //movement!
                    if (Magneon.CTRL_PRESSED) {
                        var delta = gp.clone().subtract(currPos);
                        console.log(delta);
                        var moveAllowed = true;
                        var minPos = currPos.clone();
                        var maxPos = currPos.clone();
                        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
                            var n_1 = _a[_i];
                            var p_2 = n_1.getGridPos();
                            minPos.x = Math.min(p_2.x, minPos.x);
                            minPos.y = Math.min(p_2.y, minPos.y);
                            maxPos.x = Math.max(p_2.x, maxPos.x);
                            maxPos.y = Math.max(p_2.y, maxPos.y);
                        }
                        var rows = Magneon.APP_HEIGHT / Magneon.GRID_UNIT_SIZE;
                        var cols = Magneon.APP_WIDTH / Magneon.GRID_UNIT_SIZE;
                        delta.x = Math.max(-minPos.x, Math.min(cols - maxPos.x, delta.x));
                        delta.y = Math.max(-minPos.y, Math.min(rows - maxPos.y, delta.y));
                        if (delta.length() > .5) {
                            for (var _b = 0, _c = this.nodes; _b < _c.length; _b++) {
                                var n_2 = _c[_b];
                                var p_3 = n_2.getGridPos();
                                n_2.setPosition(p_3.x + delta.x, p_3.y + delta.y);
                            }
                            this.updateLevelLayout();
                        }
                    }
                    else {
                        n.setPosition(gp.x, gp.y);
                        this.updateLevelLayout();
                    }
                }
            }
        };
        EditorGrid.prototype.touchUp = function (p) {
            Magneon.ElementsPanel.instance.touchUp(p);
            Magneon.PropertiesPanel.instance.touchUp(p);
        };
        EditorGrid.rightClick = false;
        return EditorGrid;
    }(PIXI.Container));
    Magneon.EditorGrid = EditorGrid;
})(Magneon || (Magneon = {}));
///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Level.ts"/>
///<reference path="LevelLoader.ts"/>
///<reference path="menu/Menu.ts"/>
///<reference path="editor/EditorGrid.ts"/>
///<reference path="Defs.ts"/>
var Magneon;
(function (Magneon) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(w, h) {
            var _this = _super.call(this) || this;
            _this.level = null;
            _this.size = new PIXI.Point(w, h);
            _this.btnGraphics = new PIXI.Graphics();
            _this.btnGraphics.x = w - 30;
            _this.btnGraphics.y = 30;
            _this.btnGraphics.alpha = .8;
            _this.addChild(_this.btnGraphics);
            _this.buttonText = new PIXI.Text(' ');
            _this.buttonText.style.fontFamily = "courier";
            _this.buttonText.style.fill = 0xffffff;
            _this.buttonText.style.fontSize = 32;
            _this.addChild(_this.buttonText);
            _this.menu = new Magneon.Menu(w, h);
            _this.menu.onOpenLevel = function (data) { _this.loadLevel(data); };
            _this.menu.onOpenEditor = function () { _this.loadLevel(_this.level.data); _this.editor.open(_this.level); _this.buttonText.text = '▶'; };
            _this.addChild(_this.menu);
            _this.updateButtonLayout();
            _this.editor = new Magneon.EditorGrid();
            _this.addChild(_this.editor);
            _this.editor.close();
            Magneon.GLOBAL_SCENE = _this;
            return _this;
        }
        Game.prototype.loadLevel = function (data) {
            if (this.level)
                this.removeChild(this.level);
            this.level = new Magneon.Level(this.size.x, this.size.y, data);
            this.addChildAt(this.level, 0);
        };
        Game.prototype.update = function (dt) {
            if (this.menu.visible)
                this.menu.update(dt);
            else if (this.editor.visible)
                this.editor.update(dt);
            else if (this.level)
                this.level.update(dt);
        };
        Game.prototype.updateButtonLayout = function () {
            this.btnGraphics.clear();
            this.btnGraphics.lineStyle(4, 0xaaaaaa, 1);
            this.btnGraphics.beginFill(0x555555, 1);
            this.btnGraphics.drawCircle(0, 0, 20);
            this.btnGraphics.endFill();
            this.buttonText.text = '⚙';
            this.buttonText.x = this.btnGraphics.x - this.buttonText.width / 2;
            this.buttonText.y = this.btnGraphics.y - this.buttonText.height / 2;
        };
        Game.prototype.touchDown = function (p) {
            if (this.menu.visible)
                this.menu.touchDown(p);
            else if (this.editor.visible)
                this.editor.touchDown(p);
            else if (this.level)
                this.level.touchDown(p);
        };
        Game.prototype.touchMove = function (p) {
            if (this.menu.visible)
                this.menu.touchMove(p);
            else if (this.editor.visible)
                this.editor.touchMove(p);
            else if (this.level)
                this.level.touchMove(p);
        };
        Game.prototype.touchUp = function (p) {
            if (this.menu.visible)
                this.menu.touchUp(p);
            else {
                if (this.editor.visible)
                    this.editor.touchUp(p);
                else if (this.level)
                    this.level.touchUp(p);
                var btnLoc = new Magneon.Point(this.btnGraphics.x, this.btnGraphics.y);
                if (btnLoc.subtract(p).length() < 20) {
                    if (this.editor.visible)
                        this.editor.close();
                    else
                        this.menu.open();
                    this.buttonText.text = this.editor.visible ? '▶' : '⚙';
                }
            }
        };
        Game.prototype.levelMade = function (obj) {
            //levelMade
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
///<reference path="../../../../pixi/pixi.js.d.ts"/>
///<reference path="../Level.ts"/>
///<reference path="EditorNode.ts"/>
var Magneon;
(function (Magneon) {
    var ElementsPanel = /** @class */ (function (_super) {
        __extends(ElementsPanel, _super);
        function ElementsPanel() {
            var _this = _super.call(this) || this;
            _this.buttons = [];
            _this.dragIndex = -1;
            ElementsPanel.instance = _this;
            // this.visible = false;
            var gr = new PIXI.Graphics();
            gr.beginFill(0x0, 0.5);
            gr.drawRoundedRect(0, 0, 60, 200, 5);
            gr.endFill();
            _this.addChild(gr);
            gr = _this.pushButton();
            gr.lineStyle(2, 0xffffff);
            gr.moveTo(-10, -10);
            gr.lineTo(10, 10);
            gr = _this.pushButton();
            gr.lineStyle(2, 0xffffff);
            gr.drawCircle(0, 0, 10);
            gr.drawCircle(0, 0, 5);
            _this.resetButtonPositions();
            return _this;
        }
        ElementsPanel.prototype.pushButton = function () {
            var gr = new PIXI.Graphics();
            gr.lineStyle(2, 0x005500);
            gr.beginFill(0x00aa00, 1);
            gr.drawRoundedRect(-20, -20, 40, 40, 5);
            gr.endFill();
            this.addChild(gr);
            this.buttons.push(gr);
            return gr;
        };
        ElementsPanel.prototype.resetButtonPositions = function () {
            var idx = 0;
            for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
                var b = _a[_i];
                b.x = 30;
                b.y = 30 + idx * 50;
                ++idx;
            }
        };
        ElementsPanel.prototype.touchDown = function (p) {
            if (!this.visible)
                return;
            this.dragIndex = -1;
            var pLoc = this.toLocal(p.toPixi(), Magneon.GLOBAL_SCENE);
            for (var i = 0; i < this.buttons.length; ++i) {
                var b = this.buttons[i];
                var dx = pLoc.x - b.x;
                var dy = pLoc.y - b.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 20) {
                    this.dragIndex = i;
                }
            }
        };
        ElementsPanel.prototype.touchMove = function (p) {
            if (this.dragIndex < 0)
                return;
            var pLoc = this.toLocal(p.toPixi(), Magneon.GLOBAL_SCENE);
            this.buttons[this.dragIndex].position = pLoc;
        };
        ElementsPanel.prototype.touchUp = function (p) {
            if (this.dragIndex < 0)
                return;
            this.resetButtonPositions();
            switch (this.dragIndex) {
                case 0:
                    this.onAddBorder(p);
                    break;
                case 1:
                    this.onAddAnchor(p);
                    break;
            }
            this.dragIndex = -1;
        };
        return ElementsPanel;
    }(PIXI.Container));
    Magneon.ElementsPanel = ElementsPanel;
})(Magneon || (Magneon = {}));
///<reference path="../../../../pixi/pixi.js.d.ts"/>
var Magneon;
(function (Magneon) {
    var BorderTypeSelector = /** @class */ (function (_super) {
        __extends(BorderTypeSelector, _super);
        function BorderTypeSelector() {
            var _this = _super.call(this) || this;
            _this.index = 0;
            _this.types = ["normal", "spring", "magnet"]; //, "danger" ];
            _this.ctrlWidth = 70;
            return _this;
        }
        BorderTypeSelector.prototype.bindBorder = function (data) {
            this.visible = true;
            this.data = data;
            this.index = this.types.indexOf(this.data["type"]);
            this.redraw();
        };
        BorderTypeSelector.prototype.redraw = function () {
            var n = this.types.length;
            this.clear();
            this.beginFill(0x0, .5);
            this.drawRoundedRect(0, 0, this.ctrlWidth, 30, 5);
            var clrs = [0xff00ff, 0xffff00, 0x00ffff, 0xff0000];
            for (var i = 0; i < n; ++i) {
                var x = (i + 0.5) / n * this.ctrlWidth;
                if (i == this.index) {
                    this.beginFill(0xffffff);
                    this.drawCircle(x, 15, 12);
                }
                this.beginFill(clrs[i % clrs.length]);
                this.drawCircle(x, 15, 10);
            }
        };
        BorderTypeSelector.prototype.tryTouchDown = function (p) {
            if (!this.visible)
                return false;
            var locPt = this.toLocal(p.toPixi(), Magneon.GLOBAL_SCENE);
            if (locPt.x < 0 || locPt.x > this.ctrlWidth || locPt.y < 0 || locPt.y > this.height)
                return false;
            var idx = Math.floor(this.types.length * locPt.x / this.ctrlWidth);
            idx = Magneon.clamp(idx, 0, this.types.length - 1);
            if (idx != this.index) {
                this.index = idx;
                this.data["type"] = this.types[idx];
                this.redraw();
                return true;
            }
            return false;
        };
        return BorderTypeSelector;
    }(PIXI.Graphics));
    Magneon.BorderTypeSelector = BorderTypeSelector;
})(Magneon || (Magneon = {}));
///<reference path="../../../../pixi/pixi.js.d.ts"/>
///<reference path="../Level.ts"/>
///<reference path="EditorNode.ts"/>
///<reference path="ElementType.ts"/>
///<reference path="BorderTypeSelector.ts"/>
var Magneon;
(function (Magneon) {
    var PropertiesPanel = /** @class */ (function (_super) {
        __extends(PropertiesPanel, _super);
        function PropertiesPanel() {
            var _this = _super.call(this) || this;
            _this.buttons = [];
            PropertiesPanel.instance = _this;
            // this.visible = false;
            var gr = new PIXI.Graphics();
            gr.beginFill(0x0, 0.5);
            gr.drawRoundedRect(0, 0, 100, 200, 5);
            gr.endFill();
            _this.addChild(gr);
            gr = _this.pushButton();
            gr.lineStyle(2, 0xffffff);
            // gr.beginFill(0xffffff);
            gr.moveTo(-5, 10);
            gr.lineTo(5, 10);
            gr.lineTo(10, -5);
            gr.lineTo(-10, -5);
            gr.closePath();
            gr.moveTo(-10, -8);
            gr.lineTo(10, -8);
            gr.lineTo(8, -10);
            gr.lineTo(-8, -10);
            gr.closePath();
            _this.typeSelector = new Magneon.BorderTypeSelector();
            _this.typeSelector.x = 10;
            _this.typeSelector.y = 100;
            _this.addChild(_this.typeSelector);
            // gr = this.pushButton();
            // gr.lineStyle(2, 0xffffff);
            // gr.drawCircle(0, 0, 10);
            // gr.drawCircle(0, 0, 5);
            _this.resetButtonPositions();
            _this.txt = new PIXI.Text();
            _this.txt.style.fontFamily = "courier";
            _this.txt.x = 10;
            _this.txt.y = 10;
            _this.txt.style.fill = 0xffffff;
            _this.txt.style.fontSize = 14;
            _this.addChild(_this.txt);
            return _this;
        }
        PropertiesPanel.prototype.setEditor = function (type, data) {
            if (type == Magneon.ElementType.None) {
                this.visible = false;
                return;
            }
            else {
                this.visible = true;
                this.typeSelector.visible = false;
                switch (type) {
                    case Magneon.ElementType.Anchor:
                        this.txt.text = 'anchor:';
                        break;
                    case Magneon.ElementType.Border:
                        this.txt.text = 'border:';
                        this.typeSelector.bindBorder(data);
                        break;
                    case Magneon.ElementType.Start:
                        this.txt.text = 'start:';
                        break;
                }
            }
        };
        PropertiesPanel.prototype.pushButton = function () {
            var gr = new PIXI.Graphics();
            gr.beginFill(0x0, .5);
            gr.drawRoundedRect(-18, -18, 40, 40, 5);
            // gr.lineStyle(2, 0x555555);
            gr.beginFill(0x555555, 1);
            gr.drawRoundedRect(-20, -20, 40, 40, 5);
            gr.beginFill(0x888888, 1);
            gr.drawRoundedRect(-15, -15, 30, 30, 5);
            gr.endFill();
            this.addChild(gr);
            this.buttons.push(gr);
            return gr;
        };
        PropertiesPanel.prototype.resetButtonPositions = function () {
            var idx = 0;
            for (var _i = 0, _a = this.buttons; _i < _a.length; _i++) {
                var b = _a[_i];
                b.x = 30;
                b.y = 50 + idx * 50;
                ++idx;
            }
        };
        PropertiesPanel.prototype.touchDown = function (p) {
            if (!this.visible)
                return;
            if (this.typeSelector.tryTouchDown(p)) {
                this.onPropertiesChanged();
            }
            var pLoc = this.toLocal(p.toPixi(), Magneon.GLOBAL_SCENE);
            for (var i = 0; i < this.buttons.length; ++i) {
                var b = this.buttons[i];
                var dx = pLoc.x - b.x;
                var dy = pLoc.y - b.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 20) {
                    this.onDelete(p);
                    break;
                }
            }
        };
        PropertiesPanel.prototype.touchMove = function (p) {
        };
        PropertiesPanel.prototype.touchUp = function (p) {
        };
        return PropertiesPanel;
    }(PIXI.Container));
    Magneon.PropertiesPanel = PropertiesPanel;
})(Magneon || (Magneon = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="game/Game.ts"/>
///<reference path="game/Defs.ts"/>
///<reference path="game/editor/ElementsPanel.ts"/>
///<reference path="game/editor/PropertiesPanel.ts"/>
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
            _this.elemsPanel = new Magneon.ElementsPanel();
            _this.propsPanel = new Magneon.PropertiesPanel();
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
            _this.stage.addChild(_this.elemsPanel);
            _this.stage.addChild(_this.propsPanel);
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
            this.game.loadLevel(PIXI.loader.resources['defaultLevel'].data);
        };
        GameContainer.prototype.keyUp = function (key) {
            console.log(key);
            switch (key) {
                case 17: //ctrl
                    Magneon.CTRL_PRESSED = false;
                    break;
            }
        };
        GameContainer.prototype.keyDown = function (key) {
            console.log(key);
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
                case 17: //ctrl:
                    Magneon.CTRL_PRESSED = true;
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
            Magneon.EditorGrid.rightClick = event.data.button == 2;
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
            this.elemsPanel.x = this.game.x - this.app_scale * Magneon.APP_WIDTH * .5 - 70;
            this.elemsPanel.y = this.game.y;
            this.propsPanel.x = this.game.x + this.app_scale * Magneon.APP_WIDTH * .5 + 10;
            this.propsPanel.y = this.game.y;
        };
        GameContainer.prototype.update = function () {
            var dt = this.ticker.elapsedMS * .001;
            dt = Math.min(.033, dt);
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
document.addEventListener('contextmenu', function (event) { if (event.clientY < (window.innerHeight * .9)) {
    event.preventDefault();
} });
window.onload = function () {
    disableScroll();
    var app = new Magneon.GameContainer();
    app.view.style.position = "absolute";
    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);
    PIXI.loader.add('defaultLevel', 'levels/default.json');
    PIXI.loader.add('mechFont', 'assets/fonts/Ausweis.ttf');
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
    window.onresize = function () {
        fitApp(app);
    };
    window.onkeydown = function (e) {
        app.keyDown(e.keyCode);
    };
    window.onkeyup = function (e) {
        app.keyUp(e.keyCode);
    };
    // window.onmousedown = (e) => {
    //     fitApp(app);
    // }
};
