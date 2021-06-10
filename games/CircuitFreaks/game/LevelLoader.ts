///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Button.ts"/>

module CircuitFreaks {
    export class TileData {
        type: TileType;
        group: number;
    }

    export class LevelData {

        index: number;
        rows: number;
        columns: number;
        tiles: TileDescriptor[];

        constructor(rows: number, cols: number) {
            this.rows = rows;
            this.columns = cols;
            this.tiles = [];

            let n = this.rows * this.columns;
            for (var i: number = 0; i < n; ++i)
                this.tiles[i] = undefined;
        }

        serialize(): any {
            var result = { rows: this.rows, columns: this.columns, tiles: [] };

            let groups = ["y", "b", "r"];
            for (let t of this.tiles) {
                let d = "--";
                if (t) {
                    switch (t.type) {
                        case TileType.Source:
                            d = groups[t.groupIndex] + "1";
                            break;
                        case TileType.DoubleSource:
                            d = groups[t.groupIndex] + "2";
                            break;
                        case TileType.TripleSource:
                            d = groups[t.groupIndex] + "3";
                            break;
                        case TileType.BombSource:
                            d = groups[t.groupIndex] + "b";
                            break;
                        case TileType.Blockade:
                            d = "XX";
                            break;
                        case TileType.Trash:
                            d = "##";
                            break;
                    }
                }
                result.tiles.push(d);
            }

            return result;
        }

        static deserializeTile(type: string): TileDescriptor {
            switch (type) {
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
                case 'yb':
                    return new TileDescriptor(TileType.BombSource, 0);
                case 'bb':
                    return new TileDescriptor(TileType.BombSource, 1);
                case 'rb':
                    return new TileDescriptor(TileType.BombSource, 2);
                case '##':
                    return new TileDescriptor(TileType.Trash, 0);
                case 'XX':
                    return new TileDescriptor(TileType.Blockade, 0);
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

        static deserialize(index: number, data: any): LevelData {
            var result: LevelData = new LevelData(data.rows, data.columns);
            result.index = index;
            let n = result.rows * result.columns;
            for (var i: number = 0; i < n; ++i) {
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

        filePath: string;
        static instance: LevelLoader;
        callback: Function;
        listener: any;

        constructor(cb: Function, listener: any) {
            this.callback = cb;
            this.listener = listener;
            LevelLoader.instance = this;
        }

        loadLevel(index: number) {

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "scripts/loadLevel.php");
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    // console.log("GO!", this.response);
                    var data: any = null;
                    try {
                        data = JSON.parse(this.response);
                    }
                    catch (e) {
                        data = null;
                    }
                    if (data) {
                        // console.log("istie dan:", data);
                        let levelData = LevelData.deserialize(index, data);
                        LevelLoader.instance.callback.call(LevelLoader.instance.listener, levelData);
                    }
                    else {
                        let ld = new LevelData(5, 5);
                        ld.index = index;
                        LevelLoader.instance.callback.call(LevelLoader.instance.listener, ld);
                    }
                }
            };


            var formData = new FormData();
            formData.append("index", '' + index);
            xmlhttp.send(formData);

            /*
            this.filePath = "levels/level" + index + ".json";
            let currRes = PIXI.loader.resources[this.filePath];
            if (currRes == undefined) {

                let finish = () => {
                    // let loader = LevelLoader.instance;
                    let data = PIXI.loader.resources[this.filePath].data;
                    if (data) {
                        console.log("istie dan:", data);
                        let levelData = LevelData.deserialize(index, data);
                        this.callback.call(this.listener, levelData);
                    }
                    else {
                        let ld = new LevelData(5, 5);
                        ld.index = index;
                        this.callback.call(this.listener, ld);
                    }
                }

                PIXI.loader.add([this.filePath]);
                PIXI.loader.load(finish);//LevelLoader.loadFinished);
            }
            else {
                let levelData = LevelData.deserialize(index, currRes.data);
                this.callback.call(this.listener, levelData);
            }
            */
        }

        saveLevel(data: any, index: number) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "scripts/storeLevel.php");
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("store result", this.response);
                }
            };

            var formData = new FormData();
            formData.append("data", JSON.stringify(data));
            formData.append("index", '' + index);
            xmlhttp.send(formData);
        }

        // static loadFinished() {
        //     let loader = LevelLoader.instance;
        //     let data = PIXI.loader.resources[loader.filePath].data;
        //     let levelData = LevelData.deserialize(data);
        //     loader.callback.call(loader.listener, levelData);
        // }
    }
}