///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Board.ts"/>
///<reference path="Tile.ts"/>
///<reference path="TilePanel.ts"/>
///<reference path="Button.ts"/>

module CircuitFreaks
{
    export class Game extends PIXI.Container {

        board:Board;
        tilePanel:TilePanel;
        buttons:Button[];

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
            let callbacks:Function[] = [ this.resetGame, this.loadDefault, this.undo ];
            for(var i:number=0; i<txts.length; ++i) {
                var btn = new Button(txts[i], callbacks[i]);
                btn.x = w * (i + 1) / 4.0;
                btn.y = h * .05;
                this.addChild(btn);
                this.buttons.push(btn);
            }
        }

        resetGame() {
            this.board.clearBoard();
            this.tilePanel.resetPanel();
        }

        loadDefault() {
            this.board.resetBoard();
            this.tilePanel.resetPanel();
        }

        undo() {
            this.board.undo();
            this.tilePanel.undo();
        }

        update(dt:number) {
            this.board.update(dt);
            this.tilePanel.update(dt);
        }

        touchDown(p:PIXI.Point) {

            for(let btn of this.buttons) {
                var toBtn = new PIXI.Point(p.x - btn.position.x, p.y - btn.position.y);
                if(Math.abs(toBtn.x) < 50 && Math.abs(toBtn.y) < 20) {
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

        }

        touchUp(p:PIXI.Point) {

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
