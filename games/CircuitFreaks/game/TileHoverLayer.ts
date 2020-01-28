///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>
///<reference path="Board.ts"/>

module CircuitFreaks
{
    export class TileHoverLayer extends PIXI.Container {

        tileSet:TileSet;
        board:Board;
        tilePanel:TilePanel;
        callTile:TileSet;
        projectionGraphics:PIXI.Graphics;


        constructor() {
            super();

            this.tileSet = null;
            this.projectionGraphics = new PIXI.Graphics();
            this.projectionGraphics.alpha = 0.5;
            this.addChild(this.projectionGraphics);
        }

        startDragging(ts:TileSet, board:Board, tilePanel:TilePanel) {

            if(this.tileSet == null) {
                this.tileSet = new TileSet(board.tileWidth, ts.getTileDescriptions(), null, null);
                this.tileSet.alpha = 0.5;
                this.addChild(this.tileSet);
            }
            
            this.tileSet.cwRotations = ts.cwRotations;
            this.tileSet.setTypes(ts.getTileDescriptions());

            this.projectionGraphics.clear();
            ts.drawContourToTarget(this.projectionGraphics, board.tileWidth);

            this.board = board;
            this.tilePanel = tilePanel;
            this.callTile = ts;
            this.tileSet.visible = false;
            this.projectionGraphics.visible = false;
            this.visible = true;
        }

        hitTestPoint(p:PIXI.Point) : boolean {
            return true;
        }

        getDropLoc(p:PIXI.Point) : PIXI.Point {
            if(this.board == null)
                return p;
            return new PIXI.Point(p.x - this.board.position.x, p.y - this.board.position.y);
        }

        touchDown(p:InputPoint) {
            //...
        }

        touchMove(p:InputPoint) {
            //...

            this.tileSet.position.x = p.position.x;
            this.tileSet.position.y = p.position.y;
            this.tileSet.visible = true;

            let dropLoc = this.getDropLoc(p.position);
            var resultCoord:PIXI.Point = new PIXI.Point(0,0);
            if(this.board.getOpenSetCoord(dropLoc, this.tileSet, resultCoord)) {
                var pos = this.board.toScreenPos(resultCoord.x, resultCoord.y);
                this.projectionGraphics.x = pos.x + this.board.position.x;
                this.projectionGraphics.y = pos.y + this.board.position.y;
                this.projectionGraphics.visible = true;
            }
            else {
                this.projectionGraphics.visible = false;
            }

        }

        touchUp(p:InputPoint) {
            if(this.board.pushTile(this.getDropLoc(p.position), this.tileSet)) {
                this.tilePanel.changeTile(this.callTile);
            }
            this.visible = false;
        }
    }
}
