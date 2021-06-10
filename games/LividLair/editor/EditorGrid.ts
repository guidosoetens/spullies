///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="../game/Point.ts"/>
///<reference path="../game/Defs.ts"/>
///<reference path="Defs.ts"/>
///<reference path="../game/LairData.ts"/>

module LividLair {

    export class EditorGrid extends PIXI.Container {

        size: Point;
        elemsCanvas: PIXI.Graphics;
        room: RoomData;
        textElems: PIXI.Text[];

        constructor() {
            super();

            let gr = new PIXI.Graphics();
            gr.lineStyle(5, 0x555555);

            this.size = new Point((ROOM_TILE_COLUMNS + 2) * GRID_UNIT_SIZE, (ROOM_TILE_ROWS + 2) * GRID_UNIT_SIZE);

            //horizontal lines:
            for (let i: number = 1; i < ROOM_TILE_ROWS; ++i) {
                let y = (i + 1) * GRID_UNIT_SIZE;
                gr.moveTo(GRID_UNIT_SIZE, y);
                gr.lineTo((ROOM_TILE_COLUMNS + 1) * GRID_UNIT_SIZE, y);
            }

            //vertical lines:
            for (let j: number = 1; j < ROOM_TILE_COLUMNS; ++j) {
                let x = (j + 1) * GRID_UNIT_SIZE;
                gr.moveTo(x, GRID_UNIT_SIZE);
                gr.lineTo(x, (ROOM_TILE_ROWS + 1) * GRID_UNIT_SIZE);
            }

            gr.drawRoundedRect(GRID_UNIT_SIZE, GRID_UNIT_SIZE, this.size.x - 2 * GRID_UNIT_SIZE, this.size.y - 2 * GRID_UNIT_SIZE, 10);

            this.addChild(gr);

            this.elemsCanvas = new PIXI.Graphics();
            this.addChild(this.elemsCanvas);

            //EAST/WEST connections:
            this.textElems = [];
            for (let i = 0; i < 4; ++i) {
                let x = Math.floor(i / 2);
                let col = (ROOM_TILE_COLUMNS + 1) * x;
                let height = (ROOM_TILE_ROWS - 2) / 2;
                let row = 2 + (i % 2) * height;
                gr.drawRoundedRect(col * GRID_UNIT_SIZE, row * GRID_UNIT_SIZE, GRID_UNIT_SIZE, height * GRID_UNIT_SIZE, 10);

                let txt = new PIXI.Text('' + i);
                txt.x = (col + .5) * GRID_UNIT_SIZE - 10;
                txt.y = (row + .5 * height) * GRID_UNIT_SIZE - 18;
                txt.style.fill = 0xffffff;
                txt.style.fontSize = 32;
                this.addChild(txt);
                this.textElems.push(txt);
            }

            //NORTH/SOUTH connections:
            for (let i = 0; i < 4; ++i) {
                let row = (ROOM_TILE_ROWS + 1) * Math.floor(i / 2);
                let width = (ROOM_TILE_COLUMNS - 2) / 2;
                let col = 2 + (i % 2) * width;
                gr.drawRoundedRect(col * GRID_UNIT_SIZE, row * GRID_UNIT_SIZE, width * GRID_UNIT_SIZE, GRID_UNIT_SIZE, 10);

                let txt = new PIXI.Text('' + (4 + i));
                txt.x = (col + .5 * width) * GRID_UNIT_SIZE - 10;
                txt.y = (row + .5) * GRID_UNIT_SIZE - 18;
                txt.style.fill = 0xffffff;
                txt.style.fontSize = 32;
                this.addChild(txt);
                this.textElems.push(txt);
            }

            //create dummy version:
            this.room = new RoomData(ROOM_TILE_ROWS, ROOM_TILE_COLUMNS);

            this.redraw();
        }

        populate(room: RoomData) {
            this.room = room;
            this.room.resize(ROOM_TILE_ROWS, ROOM_TILE_COLUMNS);
            this.redraw();
        }

        click(p: Point) {
            let row = Math.floor(p.y / GRID_UNIT_SIZE - 1);
            let col = Math.floor(p.x / GRID_UNIT_SIZE - 1);

            //if outside of bounds of outer buttons, then cancel:
            if (row < -1 || row > ROOM_TILE_ROWS || col < -1 || col > ROOM_TILE_COLUMNS)
                return;

            //if outside of bounds of inner grid, then process
            if (row < 0 || row > ROOM_TILE_ROWS - 1 || col < 0 || col > ROOM_TILE_COLUMNS - 1) {
                let idx = 0;
                if (row == -1)
                    idx = RoomEntrancePosition.CeilingLeft + (col < ROOM_TILE_COLUMNS / 2 ? 0 : 1);
                else if (row == ROOM_TILE_ROWS)
                    idx = RoomEntrancePosition.FloorLeft + (col < ROOM_TILE_COLUMNS / 2 ? 0 : 1);
                else if (col == -1)
                    idx = RoomEntrancePosition.LeftWallTop + (row < ROOM_TILE_ROWS / 2 ? 0 : 1);
                else
                    idx = RoomEntrancePosition.RightWallTop + (row < ROOM_TILE_ROWS / 2 ? 0 : 1);
                this.room.entrances[idx] = (this.room.entrances[idx] + 1) % RoomEntranceType.Count;
                this.redraw();
                return;
            }
        }

        dropElement(p: Point, type: TileType) {
            let row = Math.floor(p.y / GRID_UNIT_SIZE - 1);
            let col = Math.floor(p.x / GRID_UNIT_SIZE - 1);

            if (row < 0 || row >= ROOM_TILE_ROWS || col < 0 || col >= ROOM_TILE_COLUMNS)
                return;

            let idx = row * ROOM_TILE_COLUMNS + col;
            if (this.room.tiles[idx] != type) {
                this.room.tiles[idx] = type;
                this.redraw();
            }
        }

        redraw() {
            this.elemsCanvas.clear();
            for (let i: number = 0; i < ROOM_TILE_ROWS; ++i) {
                for (let j: number = 0; j < ROOM_TILE_COLUMNS; ++j) {
                    let idx = i * ROOM_TILE_COLUMNS + j;
                    let pt = new Point((j + 1.5) * GRID_UNIT_SIZE, (i + 1.5) * GRID_UNIT_SIZE);
                    drawGameObject(this.elemsCanvas, this.room.tiles[idx], pt, GRID_UNIT_SIZE);
                }
            }

            //update directions:
            let symbols = [['⇆', '↦', '↤', '#'], ['⇆', '↤', '↦', '#'], ['⇅', '↧', '↥', '#'], ['⇅', '↥', '↧', '#']];
            for (let i: number = 0; i < RoomEntrancePosition.Count; ++i) {
                let type = this.room.entrances[i];
                this.textElems[i].text = symbols[Math.floor(i / 2)][type];
            }
        }
    }
}