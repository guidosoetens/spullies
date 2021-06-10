///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>

module Magneon {
    export class Ball extends PIXI.Graphics {

        velocity: Point = new Point(0, 0);

        magnetVisual: PIXI.Graphics;
        baseVisuals: PIXI.Graphics;
        directionVisuals: PIXI.Graphics;

        forceStickLocation: Point = new Point(0, 0);
        forceStickEffect: number = 0;
        jumpEffect: number = 0;
        forceStickDirection: Point = new Point(0, 0);

        constructor() {
            super();

            this.magnetVisual = new PIXI.Graphics();
            this.addChild(this.magnetVisual);

            this.baseVisuals = new PIXI.Graphics();
            this.addChild(this.baseVisuals);
            this.baseVisuals.clear();
            this.baseVisuals.lineStyle(6, 0xffffff, 1);
            this.baseVisuals.drawCircle(0, 0, BALL_RADIUS - 6);
            this.baseVisuals.moveTo(-.25 * BALL_RADIUS, 0);
            this.baseVisuals.lineTo(.25 * BALL_RADIUS, 0);
            this.baseVisuals.moveTo(0, -.25 * BALL_RADIUS);
            this.baseVisuals.lineTo(0, .25 * BALL_RADIUS);

            this.baseVisuals.lineStyle(0);
            this.baseVisuals.beginFill(0xffffff);
            this.baseVisuals.drawCircle(-.25 * BALL_RADIUS, 0, 3);
            this.baseVisuals.drawCircle(.25 * BALL_RADIUS, 0, 3);
            this.baseVisuals.drawCircle(0, -.25 * BALL_RADIUS, 3);
            this.baseVisuals.drawCircle(0, .25 * BALL_RADIUS, 3);
            this.baseVisuals.endFill();

            this.directionVisuals = new PIXI.Graphics();
            this.directionVisuals.alpha = 0;
            this.addChild(this.directionVisuals);
            this.directionVisuals.lineStyle(2, 0xffffff, 1);
            this.directionVisuals.moveTo(BALL_RADIUS + 10, 5);
            this.directionVisuals.lineTo(BALL_RADIUS + 10, -5);
            this.directionVisuals.lineTo(BALL_RADIUS + 13, 0);
            this.directionVisuals.closePath();
        }

        getCenter(): Point {
            return new Point(this.position.x, this.position.y);
        }

        setCenter(p: Point) {
            this.position.x = p.x;
            this.position.y = p.y;
        }


        update(dt: number): void {

            //clamp velocity:
            let max_speed = 500;
            if (this.velocity.length() > max_speed)
                this.velocity.normalize(max_speed);

            let displacement = this.velocity.clone().multiply(dt);
            let t = Math.pow(this.forceStickEffect, 5.0);
            this.position.x = (1 - t) * (this.position.x + displacement.x) + t * this.forceStickLocation.x;
            this.position.y = (1 - t) * (this.position.y + displacement.y) + t * this.forceStickLocation.y;
        }

        forceStick(pt: Point, effect: number, dir: Point) {
            this.forceStickLocation = pt;
            this.forceStickEffect = effect;
            this.forceStickDirection = dir;

            let calcEffect = clamp(effect * (dir.length() - .7) / .3);
            this.setDirectionVisuals(this.forceStickDirection, Math.pow(calcEffect, .5));
        }

        setJumpEffect(effect: number, dir: Point) {
            this.jumpEffect = effect;
            let calcEffect = clamp(effect * (dir.length() - .7) / .3);
            this.forceStickDirection = dir;
            this.setDirectionVisuals(this.forceStickDirection, Math.pow(calcEffect, .5));
        }

        release() {
            var calcEffect = Math.max(this.jumpEffect, this.forceStickEffect);
            var shootEffect = calcEffect;
            if (this.forceStickDirection.length() > 0.7)
                shootEffect *= (this.forceStickDirection.length() - .7) / .3;
            else
                shootEffect = 0.0;
            this.velocity.multiply(1 - calcEffect).add(this.forceStickDirection.normalize().multiply(-1000 * shootEffect));
        }

        setMagnetVisuals(visibility: number, radius: number) {
            this.magnetVisual.clear();
            this.magnetVisual.lineStyle(0);
            this.magnetVisual.beginFill(0x00ffff, visibility);
            this.magnetVisual.drawCircle(0, 0, radius);
            this.magnetVisual.endFill();
        }

        setDirectionVisuals(dir: Point, alpha: number): void {
            this.directionVisuals.alpha = alpha;
            this.directionVisuals.rotation = Math.atan2(dir.y, dir.x) + Math.PI;
        }
    }
}