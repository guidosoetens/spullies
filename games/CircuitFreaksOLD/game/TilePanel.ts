///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>
///<reference path="TileSet.ts"/>

module CircuitFreaks
{
    export class TilePanel extends PIXI.Container {

        prevSet:TileSet;

        nextSets:TileSet[];
        nextTypes:TileType[][];

        tileCount:number;
        tileWidth:number;
        selectorWidth:number;

        selectedIndex:number;

        selector:PIXI.Graphics;


        constructor() {
            super();

            this.tileCount = 1;
            this.tileWidth = 50;
            this.selectorWidth = 2.1 * this.tileWidth;

            this.selector = new PIXI.Graphics();
            this.selector.lineStyle(5, 0xffffff, 1);
            this.selector.drawRoundedRect(-this.selectorWidth / 2.0, -this.selectorWidth / 2.0, this.selectorWidth, this.selectorWidth, .2 * this.selectorWidth);
            this.addChild(this.selector);

            this.nextTypes = [];
            this.nextSets = [];
            this.resetPanel();
            this.setSelectedIndex(Math.min(this.tileCount - 1, 0));

            this.prevSet = null;
        }

        undo() {
            if(this.prevSet == null)
                return;

            var curr = this.nextSets[this.selectedIndex];
            if(curr != null) {
                this.nextTypes.splice(0, 0, curr.types);
                this.removeChild(curr);
            }

            this.nextSets[this.selectedIndex] = this.prevSet;
            this.addChild(this.prevSet);
            this.prevSet = null;
        }

        update(dt:number) {
            for(var i:number = 0; i<this.nextSets.length; ++i)
                this.nextSets[i].update(dt);
        }

        resetPanel() {
            this.nextTypes = [];
            for(var i:number = 0; i<this.tileCount; ++i)
                this.changeTile(i);
            this.prevSet = null;
        }

        changeTile(index:number) {

            if(this.nextSets[index] != null) {
                this.prevSet = this.nextSets[index];
                this.removeChild(this.prevSet);
            }

            var tileSet = new TileSet(this.tileWidth, this.getNextType());
            this.nextSets[index] = tileSet;
            this.addChild(tileSet);
            tileSet.position.x = (index - (this.tileCount - 1) / 2.0) * this.selectorWidth;
            tileSet.position.y = 0;
        }

        shuffle(array:Array<any>) {
            var currentIndex = array.length;
            var temporaryValue = 0;
            var randomIndex = 0;
          
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
          
              // Pick a remaining element...
              randomIndex = Math.min(Math.floor(Math.random() * currentIndex), currentIndex - 1);
              currentIndex -= 1;
          
              // And swap it with the current element.
              temporaryValue = array[currentIndex];
              array[currentIndex] = array[randomIndex];
              array[randomIndex] = temporaryValue;
            }
          
            return array;
        }

        changeCurrentTile() {
            this.changeTile(this.selectedIndex);
        }

        getCurrentTileSet() : TileSet {
            return this.nextSets[this.selectedIndex];
        }

        getNextType() : TileType[] {

            if(this.nextTypes.length == 0) {

                var topTypes = [ TileType.Curve_NE, TileType.Curve_NW, TileType.Curve_SE, TileType.Curve_SW, 
                                TileType.Double_NW, TileType.Double_NE,
                                TileType.Straight_H, TileType.Straight_V ];
                var btmTypes =  [...topTypes];
                this.shuffle(btmTypes);

                for(let i in btmTypes) 
                    this.nextTypes.push([topTypes[i], btmTypes[i]]);
                // this.nextTypes.push([TileType.Double_NE]);
                this.nextTypes.push([TileType.Trash]);
                this.shuffle(this.nextTypes);

                //create new 
                // this.nextTypes = [ [TileType.Curve_NE], [TileType.Curve_NW], [TileType.Curve_SE], [TileType.Curve_SW], [TileType.Double_NE], [TileType.Double_NW]];
                // for(var i:number=0; i<TileType.Source; ++i) {
                //     this.nextTypes.push([i]);
                // }
                // this.shuffle(this.nextTypes);
            }

            var res = this.nextTypes[0];
            this.nextTypes.splice(0, 1);

            return res;
        }

        setSelectedIndex(index:number) {
            this.selectedIndex = index;
            this.selector.position.x = this.nextSets[index].x;
            this.selector.position.y = this.nextSets[index].y;
        }   

        select(pos:PIXI.Point) : boolean {
            var index = Math.floor(pos.x / this.selectorWidth + this.tileCount / 2.0);
            if(index < 0 || index >= this.tileCount || Math.abs(pos.y) > this.selectorWidth / 2.0)
                return false;

            if(this.selectedIndex == index)
                this.nextSets[index].rotateSet();
            else
                this.setSelectedIndex(index);

            return true;
        }
    }
}