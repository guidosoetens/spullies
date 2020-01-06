///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>

module CircuitFreaks
{
    export class TileSet extends PIXI.Container {

        tiles:Tile[];
        tileWidth:number;

        rotateAnimParam:number;
        isHorizontal:boolean;

        constructor(tileWidth:number, types:TileType[]) {
            super();
            this.tileWidth = tileWidth;
            this.tiles = [];

            this.rotateAnimParam = 1;
            this.isHorizontal = true;

            this.setTypes(types);
        }

        update(dt:number) {

            this.rotateAnimParam = Math.min(this.rotateAnimParam + dt / 0.2, 1.0);
            // this.rotation = (1 - easeOutElastic(this.rotateAnimParam)) * -0.5 * Math.PI;
            this.rotation = -.5 * Math.PI * (1 - Math.sin(this.rotateAnimParam * .5 * Math.PI));

            for(var i:number=0; i<this.tiles.length; ++i) {
                this.tiles[i].update(dt);
            }
        }

        rotateSet() {

            this.rotateAnimParam = 0;

            var currTypes:TileType[] = [];
            for(let tile of this.tiles)
                currTypes.push(tile.type);

            for(var i:number=0; i<currTypes.length; ++i)
                currTypes[i] = rotateTypeCW(currTypes[i]);

            this.isHorizontal = !this.isHorizontal;
            if(this.isHorizontal)
                currTypes.reverse();
            this.setTypes(currTypes);


            // this.rotation = (this.rotation + .5 * Math.PI) % (2 * Math.PI);
            // if(this.tiles.length > 0)
            //     return this.tiles[0].mirrorTile();
        }

        getTmpType() : TileType {
            if(this.tiles.length > 0)
                return this.tiles[0].type;
            return TileType.Trash;
        }

        setTypes(types:TileType[]) {
            while(this.tiles.length > 0) {
                this.removeChild(this.tiles[0]);
                this.tiles.splice(0,1);
            }

            for(var i:number=0; i<types.length; ++i) {
                let tile = new Tile(this.tileWidth, types[i]);
                this.addChild(tile);
                this.tiles.push(tile);

                var offset = (i - (types.length - 1) * 0.5) * this.tileWidth;
                if(this.isHorizontal)
                    tile.x = offset;
                else
                    tile.y = offset;
            }
        }
    }
}