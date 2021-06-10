///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Ball.ts"/>
///<reference path="Cylinder.ts"/>

module DrumRollGame {
    export const touchRad: number = 150.0;

    export class Level extends PIXI.Container {
        //input:
        hasInput: boolean;
        inputTime: number;
        inputSource: Point;
        inputLocation: Point;
        inputDirection: Point;
        rotationAngle: number;
        railBuffer: number[] = [];

        debugText: PIXI.Text;

        rotationSpeed: number;

        graphics: PIXI.Graphics;
        cylinder: Cylinder;
        ball: Ball;

        constructor(w: number, h: number) {
            super();

            this.hasInput = false;
            this.inputTime = 0;
            this.rotationAngle = 0;
            this.inputSource = new Point(0, 0);
            this.inputLocation = new Point(0, 0);
            this.inputDirection = new Point(0, 0);

            this.graphics = new PIXI.Graphics();
            this.graphics.beginFill(0x0, 1.0);
            this.graphics.drawRect(0, 0, w, h);
            this.addChild(this.graphics);

            this.debugText = new PIXI.Text(' ');
            this.debugText.style.fontFamily = "courier";
            this.debugText.style.fill = 0xffffff;
            this.debugText.style.fontSize = 32;
            // this.addChild(this.debugText);

            this.ball = new Ball();
            this.ball.x = w / 2;
            this.ball.y = h / 2 + w / 2 - 50;

            this.cylinder = new Cylinder(this.ball, w / 2);
            this.cylinder.x = w / 2;
            this.cylinder.y = h / 2;
            this.addChild(this.cylinder);
            this.cylinder.setup();

            this.addChild(this.ball);

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

            this.ball.update(dt);
            this.cylinder.update(dt, this.rotationSpeed);

            if (this.hasInput) {
                this.inputTime += dt;
            }

            // console.log(this.rotationSpeed);
            this.debugText.text = '' + this.cylinder.rollSideSpeed;
        }

        touchDown(p: Point) {
            this.hasInput = true;
            this.inputTime = 0;
            this.inputSource = p.clone();
            this.inputLocation = p.clone();
            this.inputDirection = new Point(1, 0);

            // console.log("down!");
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

            // console.log(distanceFactor, angleFactor);
            // console.log("move!");

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
            this.rotationAngle = 0;
            this.railBuffer = [];
            // console.log("up!");

            if (p.clone().subtract(this.inputSource).length() < 10 && this.inputTime < .33) {
                this.ball.jump();
            }
        }
    }
}
