///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>

module Magneon
{
    export class LevelLoader {

        private constructor() {
        }

        static loadLevel(index:number, cb:Function) {

            let filePath = "levels/custom/level" + index + ".json";
            
            let callback = () => {
                var data = PIXI.loader.resources[filePath].data;
                if(!data)
                    data = PIXI.loader.resources['defaultLevel'].data;
                cb(data);
            }

            let ress = PIXI.loader.resources;
            ress[filePath] = undefined;
            PIXI.loader.add([filePath]);
            PIXI.loader.load(callback);
        }

        static listLevels(cb:Function) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "scripts/getLevelList.php");
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var obj = JSON.parse(this.response);
                    cb(obj);
                }
            };
            xmlhttp.send();
        }

        static storeLevel(levelIndex:number, data:any, cb:Function, listener:any) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "scripts/getLevelList.php");
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var obj = JSON.parse(this.response);
                    cb.call(listener, obj);
                }
            };
        
            var formData = new FormData();
            formData.append("data", JSON.stringify(data));
            formData.append("id", '' + levelIndex);
            xmlhttp.send(formData);
        }

        static makeNewLevel(cb:Function) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", "scripts/createLevel.php");
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log('RESP:', this.response);
                    cb(this.response);
                }
            };
            xmlhttp.send();
        }
    }
}