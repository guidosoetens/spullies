///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>

module DrumRollGame {
    export class MagnetAnchor extends PIXI.Graphics {

        baseVisuals: PIXI.Graphics;
        directionVisuals: PIXI.Graphics;

        constructor() {
            super();

            this.baseVisuals = new PIXI.Graphics();
            this.addChild(this.baseVisuals);
            this.baseVisuals.clear();
            this.baseVisuals.lineStyle(2, 0x00ffff, .5);
            this.baseVisuals.drawCircle(0, 0, 10);
            this.baseVisuals.drawCircle(0, 0, 5);

            this.directionVisuals = new PIXI.Graphics();
            this.addChild(this.directionVisuals);
            this.directionVisuals.lineStyle(2, 0xffffff, 1);
            this.directionVisuals.moveTo(BALL_RADIUS + 10, 5);
            this.directionVisuals.lineTo(BALL_RADIUS + 10, -5);
            this.directionVisuals.lineTo(BALL_RADIUS + 13, 0);
            this.directionVisuals.closePath();

            this.setDirectionVisuals(new Point(0, 0), 0);
        }

        update(dt: number): void {

        }

        setDirectionVisuals(dir: Point, alpha: number): void {
            this.directionVisuals.alpha = alpha < .5 ? 0 : ((alpha - .5) / .5);
            this.directionVisuals.rotation = Math.atan2(dir.y, dir.x) + Math.PI;
            this.baseVisuals.alpha = 1 - this.directionVisuals.alpha;
        }
    }
}