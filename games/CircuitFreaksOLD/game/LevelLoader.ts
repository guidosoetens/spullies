///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Button.ts"/>

module CircuitFreaks
{
    export class TileData {
        type:TileType;
        group:number;
    }

    export class LevelData {

        rows:number;
        columns:number;
        tiles:TileType[];
        
        constructor(rows:number, cols:number) {
            this.rows = rows;
            this.columns = cols;
            this.tiles = [];
            
            let n = this.rows * this.columns;
            for(var i:number=0; i<n; ++i)
                this.tiles[i] = undefined;
        }

        static deserializeTile(type:string) : TileType {
            switch(type) {
                case 'y1':
                    return TileType.Source;
                case 'y2':
                    return TileType.DoubleSource;
                case 'y3':
                    return TileType.TripleSource;
                case '##':
                    return TileType.Trash;
            }
            return undefined;
        }

        static serializeTile(type:TileType) : string {
            switch(type) {
                case TileType.Source:
                    return 'y1';
                case TileType.DoubleSource:
                    return 'y2';
                case TileType.TripleSource:
                    return 'y3';
                case TileType.Trash:
                    return '##';
            }
            return '--';
        }

        static deserialize(data:any) : LevelData {
            var result:LevelData = new LevelData(data.rows, data.columns);
            let n = result.rows * result.columns;
            for(var i:number=0; i<n; ++i) {
                result.tiles[i] = LevelData.deserializeTile(data.tiles[i]);
            }

            return result;
        }

        serialize() : any {
            var result:any = {};

            result.rows = this.rows;
            result.columns = this.columns;

            var tiles = [];
            result.tiles = tiles;

            let n = this.rows * this.columns;
            for(var i:number=0; i<n; ++i) {
                tiles.push(LevelData.serializeTile(this.tiles[i]));
            }

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
            console.log(currRes);
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