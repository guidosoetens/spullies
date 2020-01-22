///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>

module CircuitFreaks
{
    export class TileDragLayer extends PIXI.Container {

        dragSourceCoord:PIXI.Point;
        dragSourePoint:PIXI.Point;
        dragDirection:Direction;
        indexOffset:number;

        private tiles:Tile[];
        private dummyTile:Tile;
        private tileWidth:number;
        private borderPos:PIXI.Point;

        constructor() {
            super();

            this.dragSourceCoord = new PIXI.Point(0,0);
            this.dragSourePoint = new PIXI.Point(0,0);
            this.dragDirection = undefined;
            this.indexOffset = 0;

            this.dummyTile = new Tile(10, new TileDescriptor(TileType.Blockade, 0));
            this.addChild(this.dummyTile);

            this.visible = false;
        }

        startDrag(tiles:Tile[], borderPos:PIXI.Point) {
            this.borderPos = borderPos;
            if(tiles.length > 0)
                this.tileWidth = tiles[0].tileWidth;
            this.tiles = [];
            for(let tile of tiles) {
                this.tiles.push(tile);
                this.addChild(tile);
            }
            this.visible = true;
        }

        setOffsetToPoint(p:PIXI.Point, roundOffset:boolean) {
            let angle = -.5 * Math.PI + this.dragDirection * Math.PI / 3.0;
            let toX = Math.cos(angle);
            let toY = Math.sin(angle);

            let toPos = new PIXI.Point(p.x - this.dragSourePoint.x, p.y - this.dragSourePoint.y);
            let projection = toPos.x * toX + toPos.y * toY;

            let unitDistance = this.tileWidth;
            var addSteps = projection / unitDistance;
            if(roundOffset)
                addSteps = Math.round(addSteps);

            var fract_offset = (addSteps % 1.0);
            if(fract_offset < 0)
                fract_offset += 1.0;

            let n = this.tiles.length;
            var lastIndex = (n - 1 - Math.floor(addSteps)) % n;
            if(lastIndex < 0)
                lastIndex += n;

            this.indexOffset = (n - 1) - lastIndex;

            for(var i:number=0; i<n; ++i) {
                var loopOffset = (i + addSteps) % n;
                if(loopOffset < 0)
                    loopOffset += n;
                let tile = this.tiles[i];
                let steps = 1 + loopOffset;

                tile.position.x = this.borderPos.x + toX * steps * unitDistance;
                tile.position.y = this.borderPos.y + toY * steps * unitDistance;
                if(i == lastIndex)
                    tile.alpha = 1.0 - fract_offset;
                else
                    tile.alpha = 1.0;
            }

            this.dummyTile.alpha = fract_offset;
            this.dummyTile.reset(this.tileWidth, this.tiles[lastIndex].getTileDescriptor());
            this.dummyTile.position.x = this.borderPos.x + toX * fract_offset * unitDistance;
            this.dummyTile.position.y = this.borderPos.y + toY * fract_offset * unitDistance;
        }

        updateDrag(p:PIXI.Point) {
            this.setOffsetToPoint(p, false);
        }

        endDrag(p:PIXI.Point):Tile[] {

            this.setOffsetToPoint(p, true);

            for(let tile of this.tiles)
                this.removeChild(tile);
            let res = this.tiles;
            this.tiles = [];
            this.visible = false;
            return res;
        }
    }
}