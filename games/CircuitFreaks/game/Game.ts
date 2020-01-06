///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Board.ts"/>
///<reference path="Tile.ts"/>
///<reference path="TilePanel.ts"/>

module CircuitFreaks
{
    export class Game extends PIXI.Container {

        board:Board;
        tilePanel:TilePanel;

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

            this.board = new Board(w * 0.95, h * 0.775);
            this.board.x = w * 0.025;
            this.board.y = h * 0.025;
            this.addChild(this.board);
        }

        resetGame() {

        }

        update(dt:number) {
            this.board.update(dt);
            this.tilePanel.update(dt);
        }

        touchDown(p:PIXI.Point) {

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
            this.board.clearBoard();
            this.tilePanel.resetPanel();
        }

        down() {
            
        }

        rotate() {
            this.board.resetBoard();
            this.tilePanel.resetPanel();
        }
    }
}
