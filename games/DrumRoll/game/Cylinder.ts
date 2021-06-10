///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Mat3.ts"/>
///<reference path="Ball.ts"/>

module DrumRollGame {
    export class Cylinder extends PIXI.Container {

        mesh: PIXI.mesh.Mesh;
        shaderUniforms: any;
        angle: number = 0;
        radius: number;
        ball: Ball;
        rollSideSpeed: number = 0;
        rollForwardSpeed: number = 0;
        rotMatrix: Mat3;
        wobble: number = 0;
        offset: number = 0;

        constructor(ball: Ball, radius: number) {
            super();

            this.radius = radius;
            this.ball = ball;

            let tex = PIXI.Texture.fromImage('assets/wood.jpg');
            tex.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

            this.shaderUniforms = {
                uTexture: { type: 'sampler2D', value: tex, textureData: { repeat: true } },
                uRotation: { type: 'mat3', value: [1, 0, 0, 0, 1, 0, 0, 0, 1] },
                uDepth: { type: 'vec2', value: [0, 0] },
                uCenter: { type: 'vec2', value: [0, 0] }
            };

            // let geom  = new PIXI.mesh.Mesh()
            var shader = new PIXI.Filter(PIXI.loader.resources.vertexShader.data, PIXI.loader.resources.cylinderShader.data, this.shaderUniforms);
            shader.blendMode = PIXI.BLEND_MODES.NORMAL_NPM;
            let verts: any = [-1, -1, 1, -1, 1, 1, -1, 1];
            this.mesh = new PIXI.mesh.Mesh(null, verts);
            radius *= 1.0;
            this.mesh.scale.x = radius;
            this.mesh.scale.y = radius;
            this.mesh.filters = [shader];
            this.addChild(this.mesh);

            this.rotMatrix = new Mat3();
        }

        setup() {
            let p1 = this.mesh.toGlobal(new PIXI.Point(0, 0));
            let p2 = this.mesh.toGlobal(new PIXI.Point(1, 1));
            console.log(p2.x - p1.x, p2.y - p1.y);
        }

        update(dt: number, rollZ: number) {

            this.rollSideSpeed = .95 * this.rollSideSpeed + .05 * rollZ;

            let threshold = 1;
            if (this.rollSideSpeed < -threshold)
                this.rollSideSpeed = -threshold;
            if (this.rollSideSpeed > threshold)
                this.rollSideSpeed = threshold;


            let goalSpeed = 1.0 - .5 * Math.abs(this.rollSideSpeed) / threshold;
            this.rollForwardSpeed = .95 * this.rollForwardSpeed + .05 * goalSpeed;

            let calcRoll = dt * this.rollSideSpeed * 4.0;

            let ball_offset = this.radius - 1.5 * this.ball.radius;
            if (DrumRollGame.ROLL_DRUM_MODE) {
                let rotation = Mat3.makeRotateZ(DrumRollGame.ROLL_DRUM_MODE ? calcRoll : 0);
                this.rotMatrix = rotation.multiply(this.rotMatrix);

                this.ball.x = this.x;
                this.ball.y = this.y + ball_offset;
                this.ball.tubeAngle = 0;
            }
            else {
                //rotate ball:
                let pt = new Point(this.ball.x - this.x, this.ball.y - this.y);
                pt = pt.normalize(1);
                let ang = Math.atan2(pt.y, pt.x) - calcRoll;
                let dir = new Point(Math.cos(ang), Math.sin(ang));
                this.ball.x = this.x + dir.x * ball_offset;
                this.ball.y = this.y + dir.y * ball_offset;
                this.ball.tubeAngle = (ang - .5 * Math.PI);
            }

            let vals = this.shaderUniforms.uRotation.value;
            for (let i = 0; i < 9; ++i)
                vals[i] = this.rotMatrix.vals[i];

            let depthVals = this.shaderUniforms.uDepth.value;
            this.wobble = (this.wobble + dt / 10.0) % 1.0;
            depthVals[0] = (depthVals[0] + this.rollForwardSpeed * dt / 8.0) % 1.0;
            depthVals[1] = Math.sin(this.wobble * 2 * Math.PI);

            this.offset += dt / 10.0;
            let centerVals = this.shaderUniforms.uCenter.value;
            let angle = this.offset % (2.0 * Math.PI);// Math.sin(this.offset) * 2 * Math.PI;
            let offset = .5 * Math.sin(.53 * this.offset + 1.356);
            centerVals[0] = offset * Math.cos(angle);
            centerVals[1] = offset * Math.sin(angle);


            let ballRot = new Mat3();
            // ballRot = ballRot.multiply(Mat3.makeRotateZ(calcRoll * this.radius / this.ball.radius));
            ballRot = ballRot.multiply(Mat3.makeRotateZ(this.ball.tubeAngle));
            ballRot = ballRot.multiply(Mat3.makeRotateX(this.rollForwardSpeed * dt * 8.0));
            ballRot = ballRot.multiply(Mat3.makeRotateZ(-this.ball.tubeAngle));
            ballRot = ballRot.multiply(Mat3.makeRotateZ(calcRoll * this.radius / this.ball.radius));
            // ballRot = ballRot.multiply(Mat3.makeRotateZ(this.ball.tubeAngle));
            this.ball.mat = ballRot.multiply(this.ball.mat);
        }
    }
}
