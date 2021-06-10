///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Border.ts"/>
///<reference path="Ball.ts"/>
///<reference path="MagnetAnchor.ts"/>

module Magneon {
    export const touchRad: number = 150.0;

    export class Level extends PIXI.Container {

        data: any;

        borders: Border[];
        ball: Ball;
        levelElementsContainer: PIXI.Container;

        //input:
        hasInput: boolean;
        inputTime: number;
        inputSource: Point;
        inputLocation: Point;
        inputDirection: Point;
        rotationAngle: number;
        railBuffer: number[] = [];
        magnetAnchors: MagnetAnchor[] = [];

        graphics: PIXI.Graphics;

        bouncePending: boolean = false;
        rotationSpeed = 0;

        showDir: boolean = false;
        showDirTimeBuffer: number = 0.0;

        constructor(w: number, h: number, data: any) {
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
            this.inputSource = new Point(0, 0);
            this.inputLocation = new Point(0, 0);
            this.inputDirection = new Point(0, 0);

            this.ball = new Ball();

            this.graphics = new PIXI.Graphics();
            this.addChild(this.graphics);

            this.levelElementsContainer = new PIXI.Container();
            this.addChild(this.levelElementsContainer);

            this.addChild(this.ball);

            this.loadLevel(data);
        }

        loadLevel(data: any) {

            this.data = data;

            //clear previous level:
            this.ball.velocity = new Point(0, 0);
            this.borders = [];
            this.magnetAnchors = [];
            this.levelElementsContainer.removeChildren();

            this.ball.position = Point.parseFromData(data["start"]).toPixi();

            let bs = data["borders"];
            if (bs) {
                for (let b of bs) {
                    this.borders.push(Border.fromData(b));
                }
            }

            for (let b of this.borders) {
                this.levelElementsContainer.addChild(b);
                b.drawWithOffsetFromOthers(this.borders);
            }

            let ans = data["anchors"];
            if (ans) {
                for (let a of ans) {
                    let sa = new MagnetAnchor();
                    sa.position = Point.parseFromData(a).toPixi();
                    this.levelElementsContainer.addChild(sa);
                    this.magnetAnchors.push(sa);
                }
            }
        }

        updateRotation() {
            let clampedAng = this.rotationAngle;
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
                for (let ang of this.railBuffer)
                    this.rotationSpeed += ang;
                this.rotationSpeed /= this.railBuffer.length;
            }

            if (Math.abs(this.rotationSpeed) < .1) {
                this.rotationSpeed = 0;
            }
            else {
                this.inputSource = this.inputLocation;
            }
        }

        update(dt: number) {

            this.updateRotation();

            if (this.hasInput) {
                this.inputTime += dt;
            }

            for (let b of this.borders)
                b.update(dt);

            //apply forces: 
            var prevBallPos = this.ball.getCenter();
            this.ball.update(dt);

            //bounce off edges:
            var closestPoint: Point = undefined;
            var closestDistance: number = 0;
            var sumRailForce = new Point(0, 0);

            var ballCenter = this.ball.getCenter();
            for (let b of this.borders) {

                let projection = b.projectPointToBorder(ballCenter);
                var toPt = projection.clone().subtract(ballCenter);
                let dist = toPt.length() - BALL_RADIUS;
                toPt.normalize();

                if ((!closestPoint || dist < closestDistance) && b.magnetic) {
                    closestPoint = b.projectPointToBorder(ballCenter);
                    closestDistance = dist;
                }

                if (dist < BALL_RADIUS / 2 && this.bouncePending && b.spring) {
                    this.ball.velocity.add(toPt.clone().multiply(-1000));
                }

                //add rail force for colliding edges:
                if (dist < 0.0001) {
                    let dir = toPt.clone().makePerpendicular();
                    let addition = dir.clone().multiply((toPt.cross(dir) < 0) ? 1 : -1);
                    addition.multiply(b.magnetic ? 1 : .2);
                    sumRailForce.add(addition);
                }

                //push element outside of edge:
                if (dist < 0) {

                    //bounce off edge:
                    ballCenter = projection.clone().subtract(toPt.clone().multiply(BALL_RADIUS));
                    this.ball.setCenter(ballCenter);
                    if (toPt.dot(this.ball.velocity) > 0) {
                        let loseVelocityFactor = Math.pow(Math.abs(this.ball.velocity.clone().normalize().dot(toPt)), 1.0);

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

            let max_magnet_dist = BALL_RADIUS * .1;

            if (this.hasInput) {
                //apply rail force:
                this.ball.velocity.add(sumRailForce.multiply(dt * 30000 * this.rotationSpeed));
            }

            var forceStickMagnet = 0;

            //try to find magnet anchor that is even closer:
            if (this.hasInput) {
                for (let m of this.magnetAnchors) {
                    let pt = new Point(m.x, m.y);
                    let dist = pt.clone().subtract(ballCenter).length();
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
            if (this.hasInput && sumRailForce.length() > 0) {
                dAng = ballCenter.clone().subtract(prevBallPos).length() / BALL_RADIUS;
                dAng *= this.rotationSpeed < 0 ? -1 : 1;
            }

            this.ball.baseVisuals.rotation += dAng;

            var toPt = this.inputLocation.clone().subtract(this.inputSource);
            if (toPt.length() > touchRad)
                toPt.normalize(touchRad);
            toPt.multiply(1.0 / touchRad);
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
            if (this.hasInput && DEBUG_MODE) {
                this.graphics.lineStyle(2, 0xffffff, .2);
                this.graphics.drawCircle(this.width / 2, 100, touchRad);
                this.graphics.moveTo(this.width / 2, 100);
                var toPt = this.inputLocation.clone().subtract(this.inputSource);
                this.graphics.lineTo(this.width / 2 + toPt.x, 100 + toPt.y);
            }
        }

        touchDown(p: Point) {
            this.hasInput = true;
            this.inputTime = 0;
            this.inputSource = p.clone();
            this.inputLocation = p.clone();
            this.inputDirection = new Point(1, 0);
        }

        touchMove(p: Point) {
            let inputDir = p.clone().subtract(this.inputLocation);
            let distanceFactor = clamp(inputDir.length() / 15.0);
            inputDir.normalize();
            this.inputLocation = p.clone();

            let currInputDir = this.inputDirection.clone();
            let angle = Math.acos(Math.max(-1, Math.min(1, currInputDir.dot(inputDir))));
            let angleFactor = clamp(3 * angle);
            if (currInputDir.clone().makePerpendicular().dot(inputDir) < 0)
                angleFactor = -angleFactor;

            console.log(distanceFactor, angleFactor);

            this.rotationAngle += angleFactor * distanceFactor;
            this.inputDirection = inputDir;

            var toPt = this.inputLocation.clone().subtract(this.inputSource);
            if (toPt.length() > touchRad) {
                toPt.normalize(touchRad);
                this.inputSource = this.inputLocation.clone().subtract(toPt);
            }
        }

        touchUp(p: Point) {
            this.hasInput = false;
            this.bouncePending = true;

            this.rotationAngle = 0;
            this.railBuffer = [];

            this.ball.release();

            for (let b of this.borders)
                b.wobble();
        }
    }
}
