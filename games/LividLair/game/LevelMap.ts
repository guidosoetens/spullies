///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>

module LividLair {

    export enum RoomDirection {
        Right = 0,
        Down,
        Left,
        Up
    }

    export interface RoomFilter { (val: LevelRoomData): boolean; }

    export class LevelRoomData {

        adjacent: LevelRoomData[];
        connected: boolean[];
        isStart: boolean;
        isFinish: boolean;
        isTreasureRoom: boolean;
        isMainPath: boolean;
        isConnected: boolean;
        propagationVisited: boolean;

        constructor() {
            this.adjacent = [null, null, null, null];
            this.connected = [false, false, false, false];
            this.isStart = false;
            this.isFinish = false;
            this.isMainPath = false;
            this.propagationVisited = false;
        }

        getRandomAdjacentIndex(filter: RoomFilter): number {
            let available = this.adjacent.filter(filter);
            let n = available.length;
            if (n > 0) {
                let idx = randomIndex(n);
                let room = available[idx];
                return this.adjacent.indexOf(room);
            }
            return -1;
        }

        connect(n: LevelRoomData) {
            let idx = this.adjacent.indexOf(n);
            if (idx >= 0)
                this.connected[idx] = true;
        }

        tryMakeTreasureRoom(): boolean {
            if (this.connectToMainPath(false, 2)) {
                this.isTreasureRoom = true;
                return true;
            }
            return false;
        }

        createMainPath(steps: number) {
            this.isStart = true;
            this.propagateMainPath(null, steps);
        }

        connectToMainPath(allowStart: boolean = false, stepsLeft: number = -1): boolean {

            if (stepsLeft == 0)
                return false;

            if (this.isFinish || (this.isStart && !allowStart) || this.isTreasureRoom)
                return false;

            if (this.isMainPath)
                return true;

            let opts = this.adjacent.filter((r) => { return r != null; }).filter((r) => { return !r.propagationVisited; });
            this.propagationVisited = true;
            for (let opt of opts) {
                if (opt.connectToMainPath(allowStart, stepsLeft - 1)) {
                    let idx = this.adjacent.indexOf(opt);
                    this.connected[idx] = true;
                    opt.connect(this);
                    this.propagationVisited = false;
                    this.isMainPath = true;
                    return true;
                }
            }

            this.propagationVisited = false;
            return false;
        }

        propagateMainPath(parent: LevelRoomData, itsLeft: number): boolean {
            if (itsLeft > 1) {

                //list open options:
                let opts = this.adjacent.filter((r) => { return r != null; }).filter((r) => { return !r.propagationVisited; });
                opts = shuffle(opts);
                this.propagationVisited = true;
                for (let opt of opts) {
                    if (opt.propagateMainPath(this, itsLeft - 1)) {

                        //open connection to 'opt'
                        let idx = this.adjacent.indexOf(opt);
                        this.connected[idx] = true;
                        opt.connect(this);
                        this.propagationVisited = false;
                        this.isMainPath = true;
                        return true;
                    }
                }

                this.propagationVisited = false;
                return false;
            }
            else {

                //make sure the parent was from a horizontal adjacent tile:
                if (parent) {
                    let it = this.adjacent.indexOf(parent);
                    if (it == RoomDirection.Up || it == RoomDirection.Down)
                        return false;
                }

                //this is the finish!
                this.isFinish = true;
                this.isMainPath = true;
                return true;
            }

        }
    }

    export class LevelData {
        rows: number;
        columns: number;
        rooms: LevelRoomData[];

        constructor(rows: number, cols: number) {
            this.rows = rows;
            this.columns = cols;
            let n = rows * cols;
            this.rooms = [];
            while (this.rooms.length < n)
                this.rooms.push(new LevelRoomData());

            //connect rooms:
            for (let i: number = 0; i < rows; ++i) {
                for (let j: number = 0; j < cols; ++j) {
                    let idx = i * cols + j;
                    let room = this.rooms[idx];
                    if (i > 0)
                        room.adjacent[RoomDirection.Up] = this.rooms[idx - cols];
                    if (i < rows - 1)
                        room.adjacent[RoomDirection.Down] = this.rooms[idx + cols];
                    if (j > 0)
                        room.adjacent[RoomDirection.Left] = this.rooms[idx - 1];
                    if (j < cols - 1)
                        room.adjacent[RoomDirection.Right] = this.rooms[idx + 1];
                }
            }

            //choose start chamber:
            let startIdx = randomIndex(n);
            let steps = Math.floor(n * .6);
            this.rooms[startIdx].createMainPath(steps);

            //choose treasure room:
            let opts = this.rooms.filter((room) => { return !room.isMainPath; });
            opts = shuffle(opts);
            for (let opt of opts) {
                if (opt.tryMakeTreasureRoom())
                    break;
            }

            opts = this.rooms.filter((room) => { return !room.isMainPath; });
            for (let opt of opts) {
                if (!opt.isMainPath)
                    opt.connectToMainPath(true);
            }
        }
    }

    export class LevelMap extends PIXI.Graphics {

        data: LevelData;
        gridWidth: number = 150;
        player: PIXI.Graphics;

        constructor() {
            super();

            this.player = new PIXI.Graphics();
            this.player.lineStyle(2, 0x0088aa)
            this.player.beginFill(0x55aaff);
            this.player.drawCircle(0, 0, 5);
            this.addChild(this.player);

            this.reset();
        }

        reset() {
            this.data = new LevelData(3, 4);
            this.redraw();
        }

        setWizardRoom(row: number, col: number) {
            let tileWidth = .9 * this.gridWidth / Math.max(this.data.rows, this.data.columns);
            let y = (row - (this.data.rows - 1) / 2.0) * tileWidth;
            let x = (col - (this.data.columns - 1) / 2.0) * tileWidth;
            this.player.x = x;
            this.player.y = y;
        }

        redraw() {
            this.clear();

            this.lineStyle(3, 0xffffff);
            this.beginFill(0x0, .5);
            this.drawRoundedRect(-this.gridWidth / 2, -this.gridWidth / 2, this.gridWidth, this.gridWidth, 5);
            this.endFill();

            let tileWidth = .9 * this.gridWidth / Math.max(this.data.rows, this.data.columns);
            let w = tileWidth * .6;

            this.lineStyle(3, 0xaaaaaa);
            for (var i: number = 0; i < this.data.rows; ++i) {
                let y = (i - (this.data.rows - 1) / 2.0) * tileWidth;
                for (var j: number = 0; j < this.data.columns; ++j) {
                    let x = (j - (this.data.columns - 1) / 2.0) * tileWidth;
                    let idx = i * this.data.columns + j;
                    let room = this.data.rooms[idx];

                    if (room.isStart)
                        this.beginFill(0x888888);
                    else if (room.isTreasureRoom)
                        this.beginFill(0xffffaa);
                    else if (room.isFinish)
                        this.beginFill(0xaa4400);
                    else
                        this.beginFill(0x0, 0);

                    this.lineStyle(3, 0xaaaaaa);
                    this.drawRoundedRect(x - w / 2, y - w / 2, w, w, w * .1);

                    this.lineStyle(8, 0xaaaaaa);
                    let dir = new Point(1, 0);
                    for (let dIdx = 0; dIdx < 4; ++dIdx) {
                        if (room.connected[dIdx]) {
                            this.moveTo(x + tileWidth * .3 * dir.x, y + tileWidth * .3 * dir.y);
                            this.lineTo(x + tileWidth * .7 * dir.x, y + tileWidth * .7 * dir.y);
                        }

                        dir = new Point(-dir.y, dir.x);
                    }
                }
            }
        }
    }
}