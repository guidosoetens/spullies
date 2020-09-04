///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Border.ts"/>
///<reference path="Ball.ts"/>
///<reference path="MagnetAnchor.ts"/>

module Magneon
{
    export const touchRad:number = 50.0;

    export class Level extends PIXI.Container {

        borders:Border[];
        ball:Ball;

        //input:
        hasInput:boolean;
        inputTime:number;
        inputSource:Point;
        inputLocation:Point;
        inputDirection:Point;
        rotationAngle:number;
        railBuffer:number[] = [];
        magnetAnchors:MagnetAnchor[] = [];

        graphics:PIXI.Graphics;

        bouncePending:boolean = false;
        rotationSpeed = 0;

        showDir:boolean = false;
        showDirTimeBuffer:number = 0.0;

        constructor(w:number, h:number) {
            super();

            // this.filters = [new PIXI.filters.BlurFilter(1)];

            var background = new PIXI.Graphics();
            background.beginFill(0x0, 0.8);
            background.drawRect(0, 0, w, h);
            background.endFill();
            this.addChild(background);

            this.hasInput = false;
            this.inputTime = 0;
            this.rotationAngle = 0;
            this.inputSource = new Point(0,0);
            this.inputLocation = new Point(0,0);
            this.inputDirection = new Point(0,0);

            this.ball = new Ball();

            this.graphics = new PIXI.Graphics();
            this.addChild(this.graphics);

            this.resetLevel();

            this.addChild(this.ball);
        }

        resetLevel() {

            this.ball.position.x = this.width * .5;
            this.ball.position.y = this.height * .33;
            this.ball.velocity = new Point(0,0);

            let m:number = 2 * BALL_RADIUS;
            let tl:Point = new Point(m, m);
            let br:Point = new Point(this.width - m, this.height - m);
            var circleCenterY:number = m + 100 + BALL_RADIUS;
            var bottomCircleY:number = this.height - m - 100;

            this.borders = [];

            //walls (top, left, right):
            this.borders.push(Border.asLine(m + 340 + BALL_RADIUS, tl.y, br.x - 7, tl.y, true));
            this.borders.push(Border.asLine(tl.x, circleCenterY, tl.x, bottomCircleY - 10, true));
            this.borders.push(Border.asLine(br.x, tl.y + 7, br.x, br.y, false));

            //floor:
            this.borders.push(Border.asLine(m + 100, br.y, br.x - 160, br.y, false));
            this.borders.push(Border.asLine(br.x - 150, br.y, br.x - 60, br.y, false));
            this.borders.push(Border.asLine(br.x - 50, br.y, br.x, br.y, false));
            this.borders[this.borders.length - 2].spring = true;

            //slope and curves:
            this.borders.push(Border.asLine(m + 100, .5 * this.height, .6 * this.width, .8 * this.height, false));
            this.borders.push(Border.asCurve(new Point(.4 * this.width, .33 * this.height), 0, .5 * Math.PI, 100, true));
            this.borders.push(Border.asCurve(new Point(m + 100, circleCenterY), Math.PI, 2 * Math.PI, 100, true));
            this.borders.push(Border.asCurve(new Point(m + 220, circleCenterY), 0, Math.PI, 20, true));
            this.borders.push(Border.asCurve(new Point(m + 340 + BALL_RADIUS, circleCenterY),  Math.PI, 1.5 * Math.PI, 100 + BALL_RADIUS, true));
            this.borders.push(Border.asCurve(new Point(m + 100, bottomCircleY),  .5 * Math.PI, 1.0 * Math.PI, 100, false));

            this.borders.push(Border.asCurve(new Point(this.width - m - 100, this.height / 2),  0.7 * Math.PI, 2.3 * Math.PI, 50, true));
            this.borders[this.borders.length - 1].animate = true;

            for(let b of this.borders) {
                this.addChild(b);
                b.draw();
            }

            let sa = new MagnetAnchor();
            sa.x = m + 100;
            sa.y = circleCenterY;
            this.addChild(sa);
            this.magnetAnchors.push(sa);

            this.draw();
        }

        update(dt:number) {

            this.railBuffer.push(this.rotationAngle);
            this.rotationAngle = 0;
            while(this.railBuffer.length > 20)
                this.railBuffer.splice(0, 1);

            //average movement:
            this.rotationSpeed = 0.0;
            if(this.railBuffer.length > 0) {
                for(let ang of this.railBuffer)
                    this.rotationSpeed += ang;
                this.rotationSpeed /= this.railBuffer.length;
            }

            // if(Math.abs(this.rotationSpeed) < .05)
            //     this.rotationSpeed = 0;

            if(this.hasInput) {
                this.inputTime += dt;
            }

            for(let b of this.borders)
                b.update(dt);

            //apply forces: 
            var prevBallPos = this.ball.getCenter();
            this.ball.update(dt);

            //bounce off edges:
            var closestPoint:Point = undefined;
            var closestDistance:number = 0;
            var sumRailForce = new Point(0, 0);

            var ballCenter = this.ball.getCenter();
            for(let b of this.borders) {

                let projection = b.projectPointToBorder(ballCenter);
                var toPt = projection.clone().subtract(ballCenter);
                let dist = toPt.length() - BALL_RADIUS;
                toPt.normalize();

                if((!closestPoint || dist < closestDistance) && b.magnetic) {
                    closestPoint = b.projectPointToBorder(ballCenter);
                    closestDistance = dist;
                }

                if(dist < BALL_RADIUS / 2 && this.bouncePending && b.spring) {
                    this.ball.velocity.add(toPt.clone().multiply(-1000));
                }

                //add rail force for colliding edges:
                if(dist < 0.0001) {
                    let dir = toPt.clone().makePerpendicular();
                    let addition = dir.clone().multiply((toPt.cross(dir) < 0) ? 1 : -1);
                    addition.multiply(b.magnetic ? 1 : .2);
                    sumRailForce.add(addition);
                }

                //push element outside of edge:
                if(dist < 0) {

                    //bounce off edge:
                    ballCenter = projection.clone().subtract(toPt.clone().multiply(BALL_RADIUS));
                    this.ball.setCenter(ballCenter);
                    if(toPt.dot(this.ball.velocity) > 0) {
                        let loseVelocityFactor = Math.pow(Math.abs(this.ball.velocity.clone().normalize().dot(toPt)), 1.0);

                        //bounce velocity vector:
                        var perp = toPt.clone().makePerpendicular();
                        var dot = perp.dot(this.ball.velocity);
                        this.ball.velocity = perp.multiply(2 * dot).subtract(this.ball.velocity);

                        //friction:
                        this.ball.velocity.multiply(0.9 - .5 * loseVelocityFactor);
                    }

                    if(this.hasInput && b.magnetic) {
                        this.ball.velocity.x = 0;
                        this.ball.velocity.y = 0;
                    }
                }
            }
            this.bouncePending = false;

            let max_magnet_dist = 1.5 * BALL_RADIUS;

            if(this.hasInput) {
                //apply rail force:
                this.ball.velocity.add(sumRailForce.multiply(dt * 30000 * this.rotationSpeed));
            }

            var forceStickMagnet = 0;

            //try to find magnet anchor that is even closer:
            if(this.hasInput) {
                for(let m of this.magnetAnchors) {
                    let pt = new Point(m.x, m.y);
                    let dist = pt.clone().subtract(ballCenter).length();
                    if(dist < closestDistance) {
                        closestDistance = dist;
                        closestPoint = pt;

                        if(dist < max_magnet_dist)
                            forceStickMagnet = 1.0 - dist / max_magnet_dist;
                    }
                }
            }

            var magnet_effect = 0.0;
            if(closestDistance < max_magnet_dist && this.hasInput) {
                var toPt = closestPoint.clone().subtract(ballCenter);
                magnet_effect = 1.0;//.25 + .75 * Math.pow(clamp(1 - toPt.length() / max_magnet_dist), .5);
                this.ball.velocity.add(toPt.normalize(dt * 8000 * magnet_effect));
                let t = Math.min(1.0, Math.max(1.0 - closestDistance / max_magnet_dist, 0));
                this.ball.setMagnetVisuals(0.2 + .8 * t, BALL_RADIUS + (1 - t) * max_magnet_dist);
            }
            else {
                this.ball.setMagnetVisuals(this.hasInput ? .2 : 0, BALL_RADIUS + max_magnet_dist);
            }

            //apply gravity:
            this.ball.velocity.y += dt * 500 * (1 - magnet_effect);

            var dAng = 0;
            if(this.hasInput && sumRailForce.length() > 0) {
                dAng = ballCenter.clone().subtract(prevBallPos).length() / BALL_RADIUS;
                dAng *= this.rotationSpeed < 0 ? -1 : 1;
            }

            this.ball.baseVisuals.rotation += dAng;

            var toPt = this.inputLocation.clone().subtract(this.inputSource);
            if(toPt.length() > touchRad)
                toPt.normalize(touchRad);
            toPt.multiply(1.0 / touchRad);
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
            if(this.hasInput && DEBUG_MODE) {
                this.graphics.lineStyle(2, 0xffffff, .2);
                this.graphics.drawCircle(this.width / 2, 100, touchRad);
                this.graphics.moveTo(this.width / 2, 100);
                var toPt = this.inputLocation.clone().subtract(this.inputSource);
                this.graphics.lineTo(this.width / 2 + toPt.x, 100 + toPt.y);
            }
        }

        pts:Point[] = [];

        draw() {
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
        }


        touchDown(p:Point) {
            this.hasInput = true;
            this.inputTime = 0;
            this.inputSource = p.clone();
            this.inputLocation = p.clone();
            this.inputDirection = new Point(1,0);
        }

        touchMove(p:Point) {
            let inputDir = p.clone().subtract(this.inputLocation);
            let distanceFactor = clamp(inputDir.length() / 15.0);
            inputDir.normalize();
            this.pts.push(p.clone());
            if(this.pts.length > 100)
                this.pts.splice(0, 1);
            this.inputLocation = p.clone();

            let currInputDir = this.inputDirection.clone();
            let angle = Math.acos(Math.max(-1, Math.min(1, currInputDir.dot(inputDir))));
            let angleFactor = clamp(3 * angle);
            if(currInputDir.clone().makePerpendicular().dot(inputDir) < 0)
            angleFactor = -angleFactor;

            this.rotationAngle += angleFactor * distanceFactor;
            this.inputDirection = inputDir;

            var toPt = this.inputLocation.clone().subtract(this.inputSource);
            if(toPt.length() > touchRad) {
                toPt.normalize(touchRad);
                this.inputSource = this.inputLocation.clone().subtract(toPt);
            }
        }

        touchUp(p:Point) {
            this.hasInput = false;
            this.bouncePending = true;
            this.pts = [];

            this.rotationAngle = 0;
            this.railBuffer = [];

            this.ball.release();

            for(let b of this.borders)
                b.wobble();
        }
    }
}
