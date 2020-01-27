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
        tiles:TileDescriptor[];
        
        constructor(rows:number, cols:number) {
            this.rows = rows;
            this.columns = cols;
            this.tiles = [];
            
            let n = this.rows * this.columns;
            for(var i:number=0; i<n; ++i)
                this.tiles[i] = undefined;
        }

        static deserializeTile(type:string) : TileDescriptor {
            switch(type) {
                case 'y1':
                    return new TileDescriptor(TileType.Source, 0);
                case 'y2':
                    return new TileDescriptor(TileType.DoubleSource, 0);
                case 'y3':
                    return new TileDescriptor(TileType.TripleSource, 0);
                case 'b1':
                    return new TileDescriptor(TileType.Source, 1);
                case 'b2':
                    return new TileDescriptor(TileType.DoubleSource, 1);
                case 'b3':
                    return new TileDescriptor(TileType.TripleSource, 1);
                case 'r1':
                    return new TileDescriptor(TileType.Source, 2);
                case 'r2':
                    return new TileDescriptor(TileType.DoubleSource, 2);
                case 'r3':
                    return new TileDescriptor(TileType.TripleSource, 2);
                case '##':
                    return new TileDescriptor(TileType.Trash, 0);
            }
            return undefined;
        }

        // static serializeTile(type:TileDescriptor) : string {
        //     switch(type) {
        //         case TileType.Source:
        //             return 'y1';
        //         case TileType.DoubleSource:
        //             return 'y2';
        //         case TileType.TripleSource:
        //             return 'y3';
        //         case TileType.Trash:
        //             return '##';
        //     }
        //     return '--';
        // }

        static deserialize(data:any) : LevelData {
            var result:LevelData = new LevelData(data.rows, data.columns);
            let n = result.rows * result.columns;
            for(var i:number=0; i<n; ++i) {
                result.tiles[i] = LevelData.deserializeTile(data.tiles[i]);
            }

            return result;
        }

        // serialize() : any {
        //     var result:any = {};

        //     result.rows = this.rows;
        //     result.columns = this.columns;

        //     var tiles = [];
        //     result.tiles = tiles;

        //     let n = this.rows * this.columns;
        //     for(var i:number=0; i<n; ++i) {
        //         tiles.push(LevelData.serializeTile(this.tiles[i]));
        //     }

        //     return result;
        // }
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