///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="../game/Point.ts"/>
///<reference path="../game/Defs.ts"/>
///<reference path="EditorGrid.ts"/>
///<reference path="TileButton.ts"/>
///<reference path="RoomButton.ts"/>
///<reference path="OptionButton.ts"/>
///<reference path="../LairLoader.ts"/>
///<reference path="../game/LairData.ts"/>

module LividLair {


    export class Editor extends PIXI.Container {

        static instance: Editor;

        grid: EditorGrid;

        tileButtons: TileButton[];
        roomButtons: RoomButton[];
        optionButtons: OptionButton[];
        rightClick: boolean;

        constructor() {
            super();

            Editor.instance = this;

            this.visible = false;

            let gr = new PIXI.Graphics();
            //background:
            gr.beginFill(0x0, .85);
            gr.drawRect(0, 0, APP_WIDTH, APP_HEIGHT);
            let wLeft = 150;
            let hTop = 150;
            let m = 10;
            let hm = m / 2;

            //left panel:
            gr.beginFill(0x333333, 1);
            gr.drawRoundedRect(hm, hm, wLeft - m, hTop - m, 5);
            gr.drawRoundedRect(hm, hTop + hm, wLeft - m, APP_HEIGHT - hTop - m, 5);
            gr.drawRoundedRect(wLeft + hm, hm, APP_WIDTH - wLeft - m, hTop - m, 5);
            gr.endFill();
            gr.lineStyle(5, 0x333333);
            gr.drawRoundedRect(wLeft + hm, hTop + hm, APP_WIDTH - wLeft - m, APP_HEIGHT - hTop - m, 5);
            this.addChild(gr);

            this.grid = new EditorGrid();
            this.addChild(this.grid);

            this.rightClick = false;

            this.grid.x = wLeft + hm + 30;
            this.grid.y = hTop + hm + 30;
            let scaleX = (APP_WIDTH - wLeft - m - 60) / this.grid.size.x;
            let scaleY = (APP_HEIGHT - hTop - m - 60) / this.grid.size.y;
            this.grid.scale.x = this.grid.scale.y = Math.min(scaleX, scaleY);

            this.tileButtons = [];
            let slotOffset = .4 * wLeft;
            for (const key of Object.keys(TileType)) {

                let idx = this.tileButtons.length;
                let x = wLeft + (Math.floor(idx / 2) + 0.75) * slotOffset;
                let y = .5 * hTop + ((idx % 2) - .5) * slotOffset;
                let go = new TileButton(TileType[key]);
                go.x = x;
                go.y = y;
                this.addChild(go);
                this.tileButtons.push(go);
            }
            this.tileButtons[0].setEnabled(true);

            //OptionButton
            this.optionButtons = [];
            let symbols = ['➕', '💾', '🗑️', ' '];
            for (let i: number = 0; i < 3; ++i) {
                let x = ((i % 2) * .5 + 0.25) * wLeft;
                let y = (Math.floor(i / 2) * .5 + .25) * hTop;
                let ob = new OptionButton(symbols[i], () => { this.perfomOpt(i); });
                ob.x = x;
                ob.y = y;
                this.addChild(ob);
                this.optionButtons.push(ob);
            }

            this.focusTileButton(this.tileButtons[0]);
        }

        setup() {
            this.roomButtons = [];
            for (let r of LairData.instance.rooms)
                this.addRoomButton(r);

            if (this.roomButtons.length > 0)
                this.focusRoomButton(this.roomButtons[0]);
        }

        addRoomButton(r: RoomData): RoomButton {
            let b = new RoomButton(r);
            this.roomButtons.push(b);
            this.addChild(b);
            this.rearrangeRoomButtons();
            return b;
        }

        rearrangeRoomButtons() {
            for (let i: number = 0; i < this.roomButtons.length; ++i) {
                let b = this.roomButtons[i];
                b.x = 75;
                b.y = 180 + i * 30;
            }
        }

        perfomOpt(idx: number) {
            if (idx == 0) {
                let room = new RoomData(ROOM_TILE_ROWS, ROOM_TILE_COLUMNS);
                LairData.instance.rooms.push(room);
                this.focusRoomButton(this.addRoomButton(room))
            }
            else if (idx == 1) {
                //save all rooms:
                LairData.instance.save();
            }
            else if (idx == 2) {
                //trash current opt:
                let bs = this.roomButtons.filter((rb) => rb.enabled);
                if (bs.length > 0) {
                    let b = bs[0];
                    let idx = LairData.instance.rooms.indexOf(b.room);
                    if (idx >= 0) {
                        LairData.instance.rooms.splice(idx, 1);
                        idx = this.roomButtons.indexOf(b);
                        this.removeChild(b);
                        this.roomButtons.splice(idx, 1);
                        this.rearrangeRoomButtons();

                        if (this.roomButtons.length > 0)
                            this.focusRoomButton(this.roomButtons[0]);
                    }
                }
            }
        }

        focusRoomButton(focusButton: RoomButton) {
            for (let rb of this.roomButtons)
                rb.setEnabled(false);
            focusButton.setEnabled(true);
            this.grid.populate(focusButton.room);
        }

        focusTileButton(focusButton: TileButton) {
            for (let tb of this.tileButtons)
                tb.setEnabled(false);
            focusButton.setEnabled(true);
        }

        getCurrentTileType(): TileType {
            if (this.rightClick)
                return TileType.Empty;
            for (let tb of this.tileButtons) {
                if (tb.enabled)
                    return tb.type;
            }
            return TileType.Empty;
        }

        touchDown(p: Point) {
            if (!this.visible)
                return;

            for (let tb of this.tileButtons) {
                if (tb.hitTestPoint(Point.fromPixi(tb.toLocal(p.toPixi(), this)))) {
                    this.focusTileButton(tb);
                    return;
                }
            }

            for (let rb of this.roomButtons) {
                if (rb.hitTestPoint(Point.fromPixi(rb.toLocal(p.toPixi(), this)))) {
                    this.focusRoomButton(rb);
                    return;
                }
            }

            for (let rb of this.optionButtons) {
                if (rb.hitTestPoint(Point.fromPixi(rb.toLocal(p.toPixi(), this)))) {
                    rb.func();
                    return;
                }
            }

            let loc = Point.fromPixi(this.grid.toLocal(p.toPixi(), this));
            this.grid.dropElement(loc, this.getCurrentTileType());
            this.grid.click(loc);
        }

        touchMove(p: Point) {
            if (!this.visible)
                return;

            let loc = Point.fromPixi(this.grid.toLocal(p.toPixi(), this));
            this.grid.dropElement(loc, this.getCurrentTileType());
        }

        touchUp(p: Point) {
            if (!this.visible)
                return;
        }
    }
}