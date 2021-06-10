///<reference path="../../pixi/pixi.js.d.ts"/>

module LividLair {
    export class LairLoader {

        private constructor() {
        }

        static loadLair(cb: Function) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "scripts/loadLair.php");
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var obj = JSON.parse(this.response);
                    cb(obj);
                }
            };

            var formData = new FormData();
            xmlhttp.send(formData);
        }

        static saveLair(data: any, cb: Function) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "scripts/saveLair.php");
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("store result", this.response);
                    cb();
                }
            };

            var formData = new FormData();
            formData.append("data", JSON.stringify(data));
            xmlhttp.send(formData);
        }
    }
}