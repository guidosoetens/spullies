///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="../game/Point.ts"/>
///<reference path="../game/LevelMap.ts"/>
///<reference path="../LairLoader.ts"/>

module LividLair {


    export class ConstructFile {

        constructIndex: number;
        rows: number;
        columns: number;
        tiles: TileType[];

        constructor(rows: number, cols: number) {
            this.rows = rows;
            this.columns = cols;
            this.tiles = [];
            let n = rows * cols;
            while (this.tiles.length < n)
                this.tiles.push(TileType.Empty);
        }

        resize(rows: number, cols: number) {
            let tiles = [];
            for (let i: number = 0; i < rows; ++i) {
                for (let j: number = 0; j < cols; ++j) {
                    let tile = TileType.Empty;
                    if (i < this.rows && j < this.columns)
                        tile = this.tiles[i * this.columns + j];
                    tiles[i * cols + j] = tile;
                }
            }

            this.rows = rows;
            this.columns = cols;
            this.tiles = [...tiles];
        }

        load(idx: number, cb: Function) {
            let roomLoaded = (data) => {
                this.dataFromJson(data);
                if (cb)
                    cb(this);
            };
            LairLoader.loadRoom(idx, roomLoaded);
        }

        dataFromJson(data: any) {
            // this.roomIndex = data.roomIndex;
            this.rows = data.rows;
            this.columns = data.columns;
            this.tiles = [...data.tiles];
        }

        save(cb: Function) {
            LairLoader.storeRoom(this.constructIndex, this, cb);
        }
    }
}