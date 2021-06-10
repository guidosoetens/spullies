///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Mat3.ts"/>

module DrumRollGame {
    export class Ball extends PIXI.Container {

        radius: number = 50;
        tubeAngle: number = 0;
        shaderUniforms: any;
        mat: Mat3;
        foo: number = 0;
        shadow: PIXI.Graphics;
        jumpParam: number = 1;
        mesh: PIXI.mesh.Mesh;

        constructor() {
            super();

            this.mat = new Mat3();

            let tex = PIXI.Texture.fromImage('assets/planet.jpg');
            tex.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

            this.shaderUniforms = {
                uTexture: { type: 'sampler2D', value: tex, textureData: { repeat: true } },
                uTextureSize: { type: 'vec2', value: { x: tex.orig.width, y: tex.orig.height } },
                uRotation: { type: 'mat3', value: [1, 0, 0, 0, 1, 0, 0, 0, 1] },
                uOffset: { type: 'vec2', value: [0, 0] }
            };

            this.shadow = new PIXI.Graphics();
            this.shadow.beginFill(0x0, 0.2);
            let rx = this.radius * .5;
            let ry = rx * .3;
            this.shadow.drawEllipse(0, 0, 2 * rx, 2 * ry);
            // this.shadow.y = this.radius - 0.5 * ry;
            // shadow.x = 0;
            // shadow.y = this.radius - 1.6 * ry;
            this.addChild(this.shadow);

            var shader = new PIXI.Filter(PIXI.loader.resources.vertexShader.data, PIXI.loader.resources.ballShader.data, this.shaderUniforms);
            shader.blendMode = PIXI.BLEND_MODES.NORMAL_NPM;
            let verts: any = [-1, -1, 1, -1, 1, 1, -1, 1];
            this.mesh = new PIXI.mesh.Mesh(null, verts);
            this.mesh.y = 0;
            this.mesh.scale.x = this.radius;
            this.mesh.scale.y = this.radius;
            this.mesh.filters = [shader];
            this.addChild(this.mesh);
        }

        update(dt: number) {
            // let r1 = Mat3.makeRotateX(dt * 2.0);
            // let r2 = Mat3.makeRotateZ(dt * 2.0 * this.rollSpeed);
            // this.mat = r2.multiply(r1).multiply(this.mat);

            this.foo += dt;
            this.foo -= Math.floor(this.foo);

            this.jumpParam = Math.min(1.0, this.jumpParam + dt / 1.0);
            let dir = new Point(Math.cos(this.tubeAngle - .5 * Math.PI), Math.sin(this.tubeAngle - .5 * Math.PI));
            let jump_effect = Math.sin(this.jumpParam / .8 * Math.PI);//Math.abs(Math.sin(this.jumpParam * 6.0)) * Math.pow(1 - this.jumpParam, 2.0);
            if (this.jumpParam > .8) {
                let t = (this.jumpParam - .8) / .2;
                jump_effect = .1 * Math.sin(t * 5.0) * (1 - t);
            }
            let jump_offset = this.radius * 5.0 * jump_effect;
            this.mesh.x = dir.x * jump_offset;
            this.mesh.y = dir.y * jump_offset;

            // this.mesh

            let vals = this.shaderUniforms.uRotation.value;
            for (let i = 0; i < 9; ++i)
                vals[i] = this.mat.vals[i];

            this.shadow.rotation = this.tubeAngle;
            this.shadow.alpha = 1.0 - jump_effect * 0.8;
            this.shadow.scale.x = this.shadow.scale.y = this.shadow.alpha;
            this.shadow.x = -dir.x * this.radius;
            this.shadow.y = -dir.y * this.radius;
        }

        jump() {
            if (this.jumpParam > .99)
                this.jumpParam = 0;
        }

        updateShader() {
            // let center = this.shaderUniforms.uCameraPosition.value;
            // center.x = this.levelContainer.x;
            // center.y = this.levelContainer.y;

            // let light = this.shaderUniforms.uRelativeLightPos.value;
            // light.x = (this.wizard.x + this.levelContainer.x) / APP_WIDTH;
            // light.y = (this.wizard.y + this.levelContainer.y) / APP_HEIGHT;
        }
    }
}
