///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>

module CircuitFreaks
{
    export class TileSet extends PIXI.Container {

        types:TileDescriptor[];
        tiles:Tile[];
        tileWidth:number;

        rotateAnimParam:number;
        cwRotations:number;

        startDragCallback:Function;
        startDragListener:any;

        constructor(tileWidth:number, types:TileDescriptor[], startDragCallback:Function, startDragListener:any) {
            super();

            this.startDragCallback = startDragCallback;
            this.startDragListener = startDragListener;

            this.types = types;
            this.tileWidth = tileWidth;
            this.tiles = [];

            this.rotateAnimParam = 1;
            this.cwRotations = 0;

            this.setTypes(types);
        }

        getTileDescriptions() : TileDescriptor[] {
            var res:TileDescriptor[] = [];

            for(let tile of this.tiles) {
                res.push(tile.getTileDescriptor());
            }

            return res;
        }

        hitTestPoint(p:PIXI.Point) : boolean {
            return true;
        }

        touchDown(p:InputPoint) {
            //...
        }

        touchMove(p:InputPoint) {
            //...
            let toPos = new PIXI.Point(p.position.x - p.sourcePosition.x, p.position.y - p.sourcePosition.y);
            if(toPos.x * toPos.x + toPos.y * toPos.y > 10) {
                this.startDragCallback.call(this.startDragListener, this);
            }
        }

        touchUp(p:InputPoint) {
            if(p.aliveTime < 0.5)
                this.rotateSet();
        }

        getDirection() {
            switch(this.cwRotations) {
                case 0:
                    return Direction.Down;
                case 1:
                    return Direction.DownLeft;
                default:
                    return Direction.UpLeft;
            }
        }

        update(dt:number) {

            this.rotateAnimParam = Math.min(this.rotateAnimParam + dt / 0.2, 1.0);
            // this.rotation = (1 - easeOutElastic(this.rotateAnimParam)) * -0.5 * Math.PI;
            this.rotation = -Math.PI / 3.0 * (1 - Math.sin(this.rotateAnimParam * .5 * Math.PI));

            for(var i:number=0; i<this.tiles.length; ++i) {
                this.tiles[i].update(dt);
            }
        }

        rotateSet() {

            this.rotateAnimParam = 0;

            var currTypes:TileDescriptor[] = [];
            for(let tile of this.tiles)
                currTypes.push(tile.getTileDescriptor());

            for(var i:number=0; i<currTypes.length; ++i)
                currTypes[i].rotateCW();// rotateTypeCW(currTypes[i]);

            this.cwRotations = this.cwRotations + 1;
            if(this.cwRotations > 2) {
                this.cwRotations = 0;
                currTypes.reverse();
            }

            this.setTypes(currTypes);

            // this.isHorizontal = !this.isHorizontal;
            // if(this.isHorizontal)
            //     currTypes.reverse();
            // this.setTypes(currTypes);


            // this.rotation = (this.rotation + .5 * Math.PI) % (2 * Math.PI);
            // if(this.tiles.length > 0)
            //     return this.tiles[0].mirrorTile();
        }

        getTmpType() : TileType {
            if(this.tiles.length > 0)
                return this.tiles[0].type;
            return TileType.Trash;
        }

        setTypes(types:TileDescriptor[]) {
            while(this.tiles.length > 0) {
                this.removeChild(this.tiles[0]);
                this.tiles.splice(0,1);
            }

            var offset = (types.length - 1) * .5 * this.tileWidth;

            for(var i:number=0; i<types.length; ++i) {
                let tile = new Tile(this.tileWidth, types[i]);
                this.addChild(tile);
                this.tiles.push(tile);

                var angle = (-.5 + this.cwRotations / 3.0 + i) * Math.PI;
                tile.x = Math.cos(angle) * offset;
                tile.y = Math.sin(angle) * offset;
            }
        }

        drawContourToTarget(gr:PIXI.Graphics, tileWidth:number) {
            let n = this.tiles.length;
            // var offset = (n - 1) * .5 * tileWidth;
            var angle = (.5 + this.cwRotations / 3.0) * Math.PI;
            for(var i:number=0; i<n; ++i) {
                let currOffset = i * tileWidth; 
                let pos = new PIXI.Point(Math.cos(angle) * currOffset, Math.sin(angle) * currOffset);
                gr.beginFill(0xffffff);
                drawHex(gr, pos, tileWidth);
                gr.endFill();
            }
        }
    }
}