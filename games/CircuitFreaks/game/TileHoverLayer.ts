///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>

module CircuitFreaks
{
    export class TileHoverLayer extends PIXI.Container {

        tileSet:TileSet;
        board:Board;

        constructor() {
            super();
        }

        startDragging(ts:TileSet, board:Board) {

        }

        hitTestPoint(p:PIXI.Point) : boolean {
            return true;
        }

        touchDown(p:InputPoint) {

        }

        touchMove(p:InputPoint) {

        }

        touchUp(p:InputPoint) {

        }
    }
}
