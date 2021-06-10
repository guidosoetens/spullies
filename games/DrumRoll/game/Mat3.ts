
///<reference path="../../../pixi/pixi.js.d.ts"/>

module DrumRollGame {
    export class Mat3 {

        vals: any = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        constructor() {

        }

        static makeRotation(angle: number, idx: number): Mat3 {
            let result = new Mat3();

            let coords = [];
            for (let i: number = 0; i < 3; ++i) {
                if (idx == i)
                    continue;
                for (let j: number = 0; j < 3; ++j) {
                    if (idx == j)
                        continue;
                    coords.push(i * 3 + j);
                }
            }

            let cs = Math.cos(angle);
            let sn = Math.sin(angle) * (idx == 1 ? -1 : 1);

            result.vals[coords[0]] = cs;
            result.vals[coords[1]] = -sn;
            result.vals[coords[2]] = sn;
            result.vals[coords[3]] = cs;

            return result;
        }

        static makeRotateX(angle: number): Mat3 {
            return Mat3.makeRotation(angle, 0);
        }

        static makeRotateY(angle: number): Mat3 {
            return Mat3.makeRotation(angle, 1);
        }

        static makeRotateZ(angle: number): Mat3 {
            return Mat3.makeRotation(angle, 2);
        }

        multiply(other: Mat3): Mat3 {
            let result = new Mat3();
            for (let i = 0; i < 3; ++i) {
                for (let j = 0; j < 3; ++j) {
                    let val = 0;
                    for (let it = 0; it < 3; ++it)
                        val += this.vals[i * 3 + it] * other.vals[it * 3 + j];
                    result.vals[i * 3 + j] = val;
                }
            }
            return result;
        }
    }
}