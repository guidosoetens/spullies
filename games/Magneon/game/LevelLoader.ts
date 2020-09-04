///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>

module Magneon
{
    export class LevelData {

        constructor() {
            //...
        }

        static deserialize(data:any) : LevelData {
            var result:LevelData = new LevelData();
            // let n = result.rows * result.columns;
            // for(var i:number=0; i<n; ++i) {
            //     result.tiles[i] = LevelData.deserializeTile(data.tiles[i]);
            // }
            return result;
        }
    }

    export class LevelLoader {

        filePath:string;
        static instance:LevelLoader;
        isDone:boolean;
        callback:Function;
        listener:any;

        constructor(cb:Function, listener:any) {
            this.callback = cb;
            this.listener = listener;
            LevelLoader.instance = this;
        }

        loadLevel(index:number) {
            this.isDone = false;
            this.filePath = "levels/level" + index + ".json";
            let currRes = PIXI.loader.resources[this.filePath];
            if(currRes == undefined) {
                PIXI.loader.add([this.filePath]);
                PIXI.loader.load(LevelLoader.loadFinished);
            }
            else {
                let levelData = LevelData.deserialize(currRes.data);
                this.callback.call(this.listener, levelData);
            }
        }

        static loadFinished() {
            let loader = LevelLoader.instance;
            let data = PIXI.loader.resources[loader.filePath].data;
            let levelData = LevelData.deserialize(data);
            loader.callback.call(loader.listener, levelData);
        }
    }
}