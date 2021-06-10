///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Tile.ts"/>
///<reference path="Button.ts"/>

module CircuitFreaks {

    export class EditorPanel extends PIXI.Container {

        private types = [
            TileType.Source,
            TileType.DoubleSource,
            TileType.TripleSource,
            TileType.BombSource,
            TileType.Blockade,
            TileType.Trash
        ];

        static instance: EditorPanel;

        btns: Button[] = [];
        groupIndex: number = 0;
        tileBtns: Tile[] = [];

        rows: number = 0;
        columns: number = 0;

        sizeChanged: Function;
        dropTile: Function;
        serializeBoard: Function;

        levelText: PIXI.Text;
        private levelIndex: number = -1;
        tileIndex: number = 0;
        tileSelector: PIXI.Graphics;

        static eraseMode: boolean = false;

        constructor() {
            super();

            EditorPanel.instance = this;

            this.tileSelector = new PIXI.Graphics();
            this.addChild(this.tileSelector);
            this.tileSelector.beginFill(0xffffff, 0.5);
            this.tileSelector.drawCircle(0, 0, 20);

            let funcs = [
                () => { this.rows--; this.sizeChanged(); },
                () => { this.rows++; this.sizeChanged(); },
                () => { this.columns--; this.sizeChanged(); },
                () => { this.columns++; this.sizeChanged(); }
            ];

            //add row/col buttons:
            for (let i = 0; i < 2; ++i) {
                let y = (i - .5) * 30;
                for (let j = 0; j < 2; ++j) {
                    let idx = i * 2 + j;
                    let btn = new Button(j == 0 ? "-" : "+", funcs[idx], this, 0, 10, 30, 30);
                    btn.x = -200 + j * 80;
                    btn.y = y;
                    btn.scale = new PIXI.Point(.5, .5);
                    this.addChild(btn);
                    this.btns.push(btn);
                }

                let lbl = new PIXI.Text(i == 0 ? "rows" : "cols");
                lbl.style.fontFamily = "groboldregular";
                lbl.style.fontSize = 16;
                lbl.style.fill = 0xffffff;
                lbl.anchor.set(0.5, 0.5);
                lbl.x = -160
                lbl.y = y;
                this.addChild(lbl);
            }

            let names = ["group", "store"];
            let opts = [
                this.changeGroup,
                this.store
            ];

            //add operation buttons:
            for (let i = 0; i < opts.length; ++i) {
                let btn = new Button(names[i], opts[i], this, 0, 10, 120, 30);
                btn.x = 180 + Math.floor(i / 2) * 60;
                btn.y = (Math.floor(i % 2) - Math.floor(opts.length / 2.0) * .5) * 30;
                btn.scale = new PIXI.Point(.5, .5);
                this.addChild(btn);
                this.btns.push(btn);
            }

            this.updateTiles();

            this.levelText = new PIXI.Text();
            this.levelText.style.fontFamily = "groboldregular";
            this.levelText.style.fontSize = 16;
            this.levelText.style.fill = 0xffffff;
            this.levelText.anchor.set(0.5, 0.5);
            this.levelText.x = -100
            this.levelText.y = -40
            this.addChild(this.levelText);
            this.setLevelIndex(-1);

            this.setTileIndex(0);
        }

        store() {
            let data: any = this.serializeBoard();
            LevelLoader.instance.saveLevel(data, this.levelIndex);
        }

        setLevelIndex(idx: number) {
            this.levelText.text = "level: " + idx;
            this.levelIndex = idx;
        }

        changeGroup() {
            this.groupIndex = (this.groupIndex + 1) % 3;
            this.updateTiles();
        }

        updateTiles() {

            for (let t of this.tileBtns)
                this.removeChild(t);
            this.tileBtns = [];

            for (let i = 0; i < this.types.length; ++i) {
                let td: TileDescriptor = new TileDescriptor(this.types[i], this.groupIndex);
                let tile = new Tile(30, td);
                tile.x = 20 + (i - (this.types.length - 1) / 2.0) * 30;
                tile.y = (i % 2) * 20;
                this.addChild(tile);
                this.tileBtns.push(tile);
            }
        }

        getTileDescriptor(): TileDescriptor {
            return this.tileBtns[this.tileIndex].getTileDescriptor();
        }

        hitTestPoint(p: PIXI.Point): boolean {
            return true;
        }

        setTileIndex(idx: number) {
            this.tileIndex = idx;
            this.tileSelector.position = this.tileBtns[idx].position;
        }

        touchDown(p: InputPoint) {
            let pt = this.toLocal(p.position, this.parent);

            for (let b of this.btns) {
                if (b.hitTestPoint(pt)) {
                    b.touchUp(p);
                    break;
                }
            }

            //change button selection:
            for (let i = 0; i < this.tileBtns.length; ++i) {
                let b = this.tileBtns[i];
                let toPt = b.toLocal(pt, this);
                if (Math.sqrt(toPt.x * toPt.x + toPt.y * toPt.y) < 20) {
                    this.setTileIndex(i);
                    break;
                }
            }

            this.dropTile(p);
        }

        touchMove(p: InputPoint) {
            this.dropTile(p);
        }

        touchUp(p: InputPoint) {

        }

    }
}