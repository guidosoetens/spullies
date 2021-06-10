///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="../LairLoader.ts"/>

module LividLair {

    export enum TileType {
        Empty = "E",
        Block = "B",
        BrittleBlock = "X",
        Platform = "-",
        Ladder = "|",
        CrossLadder = "+",
        PushBlock = "O",
        Wizard = "W",
        Chest = "C",
        Pot = "P",
        Rubee = "R",
        Exit = "F",
        Trampoline = "^"
    }

    export enum RoomEntrancePosition {
        LeftWallTop = 0,
        LeftWallBottom,
        RightWallTop,
        RightWallBottom,
        CeilingLeft,
        CeilingRight,
        FloorLeft,
        FloorRight,
        Count
    }

    export enum RoomEntranceType {
        Bidirectional = 0,
        Incoming,
        Outgoing,
        Blocked,
        Count
    }

    export class RoomData {
        rows: number;
        columns: number;
        tiles: TileType[];
        entrances: RoomEntranceType[];

        constructor(rows: number, cols: number) {
            this.rows = rows;
            this.columns = cols;
            this.tiles = [];
            let n = rows * cols;
            while (this.tiles.length < n)
                this.tiles.push(TileType.Empty);

            this.entrances = [];
            while (this.entrances.length < RoomEntrancePosition.Count)
                this.entrances.push(RoomEntranceType.Bidirectional);
        }

        static parse(json: any) {
            let result = new RoomData(json.rows, json.columns);
            result.rows = json.rows;
            result.columns = json.columns;
            if (json.tiles)
                result.tiles = [...json.tiles];
            if (json.entrances)
                result.entrances = [...json.entrances];
            result.resize(ROOM_TILE_ROWS, ROOM_TILE_COLUMNS);
            return result;
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
    }

    export class ConstructData {
        rows: number;
        columns: number;
        tiles: TileType[];

        static parse(json: any) {
            let result = new ConstructData();
            result.rows = json.rows;
            result.columns = json.columns;
            if (json.tiles)
                result.tiles = [...json.tiles];
            return result;
        }
    }

    export class LairData {

        static instance: LairData = new LairData();

        rooms: RoomData[];
        constructs: ConstructData[];

        private constructor() {
            //...
        }

        parse(json: any) {
            this.rooms = [];
            for (let r of json.rooms)
                this.rooms.push(RoomData.parse(r));

            this.constructs = [];
            for (let c of json.constructs)
                this.constructs.push(ConstructData.parse(c));
        }

        save() {
            LairLoader.saveLair(this, () => { console.log("lair saved..."); });
        }
    }
}