///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Board.ts"/>
///<reference path="Tile.ts"/>
///<reference path="TilePanel.ts"/>
///<reference path="Button.ts"/>
///<reference path="LevelSelector.ts"/>
///<reference path="LevelLoader.ts"/>

module CircuitFreaks
{
    export class Game extends PIXI.Container {

        board:Board;
        tilePanel:TilePanel;
        buttons:Button[];
        levelSelector:LevelSelector;
        levelLoader:LevelLoader;

        text:PIXI.Text;

        constructor(w:number, h:number) {
            super();

            var background = new PIXI.Graphics();
            background.beginFill(0x00ff00, 0.5);
            background.drawRect(0, 0, w, h);
            background.endFill();
            this.addChild(background);

            this.tilePanel = new TilePanel();
            this.tilePanel.x = w / 2.0;
            this.tilePanel.y = h * .9;
            this.addChild(this.tilePanel);

            this.board = new Board(w * 0.95, h * 0.7);
            this.board.x = w * 0.025;
            this.board.y = h * 0.1;
            this.addChild(this.board);

            this.buttons = [];
            let txts:string[] = ['♚', '♞', '↺'];
            let callbacks:Function[] = [ this.openLevelSelect, this.loadDefault, this.undo ];
            for(var i:number=0; i<txts.length; ++i) {
                var btn = new Button(txts[i], callbacks[i]);
                btn.x = w * (i + 1) / 4.0;
                btn.y = h * .05;
                this.addChild(btn);
                this.buttons.push(btn);
            }

            this.levelSelector = new LevelSelector(w, h);
            this.addChild(this.levelSelector);

            this.levelLoader = new LevelLoader(this.loadLevel, this);
        }

        loadLevel(data:LevelData) {
            this.board.loadBoard(data);
        }

        openLevelSelect() {
            this.levelSelector.show();
        }

        resetGame() {
            this.board.clearBoard();
            this.tilePanel.resetPanel();
            this.board.createSnapshot(false);
        }

        loadDefault() {
            this.board.resetBoard();
            this.tilePanel.resetPanel();
            this.board.createSnapshot(false);
        }

        undo() {
            if(this.board.tileWasPushedTMP)
                this.tilePanel.undo();
            this.board.undo();
        }

        update(dt:number) {
            this.board.update(dt);
            this.tilePanel.update(dt);
        }

        touchDown(p:PIXI.Point) {

            if(this.levelSelector.isEnabled()) {
                var res = this.levelSelector.touchDown(p);
                if(res >= 0) {
                    this.levelLoader.loadLevel(res);
                }
                return;
            }

            for(let btn of this.buttons) {
                if(btn.hitTestPt(p)) {
                    btn.func.call(this);
                    return;
                }
            }

            var locPos = new PIXI.Point(p.x - this.tilePanel.position.x, p.y - this.tilePanel.position.y);
            if(this.tilePanel.select(locPos))
                return;

            //push random tile to board:
            locPos = new PIXI.Point(p.x - this.board.position.x, p.y - this.board.position.y);
            if(this.board.pushTile(locPos, this.tilePanel.getCurrentTileSet())) {
                this.tilePanel.changeCurrentTile();
            }
        }

        touchMove(p:PIXI.Point) {
            let locPos = new PIXI.Point(p.x - this.board.position.x, p.y - this.board.position.y);
            this.board.dragTo(locPos);
        }

        touchUp(p:PIXI.Point) {
            let locPos = new PIXI.Point(p.x - this.board.position.x, p.y - this.board.position.y);
            this.board.dragEnd(locPos);
        }

        left() {

        }

        right() {
            
        }

        up() {
            this.resetGame();
        }

        down() {
            
        }

        rotate() {
            this.loadDefault();
        }
    }
}
