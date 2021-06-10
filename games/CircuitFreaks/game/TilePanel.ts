///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>
///<reference path="TileSet.ts"/>
///<reference path="InputListener.ts"/>

module CircuitFreaks {
    export class TilePanel extends PIXI.Container {

        prevSetIndex: number;
        prevSet: TileSet;

        nextSets: TileSet[];
        nextTypes: TileDescriptor[][];

        tileCount: number;
        tileWidth: number;
        selectorWidth: number;

        selectedIndex: number;

        selector: PIXI.Graphics;

        startDragCallback: Function;
        startDragListener: any;


        constructor(startDragCallback: Function, startDragListener: any) {
            super();

            this.startDragCallback = startDragCallback;
            this.startDragListener = startDragListener;

            this.tileCount = 3;
            this.tileWidth = 50;
            this.selectorWidth = 2.1 * this.tileWidth;

            this.selector = new PIXI.Graphics();
            this.selector.lineStyle(5, 0xffffff, 1);
            this.selector.drawRoundedRect(-this.selectorWidth / 2.0, -this.selectorWidth / 2.0, this.selectorWidth, this.selectorWidth, .2 * this.selectorWidth);
            this.selector.visible = false;
            this.addChild(this.selector);

            this.nextTypes = [];
            this.nextSets = [];
            this.resetPanel();
            this.setSelectedIndex(Math.min(this.tileCount - 1, 0));

            this.prevSet = null;
        }

        undo() {
            if (this.prevSet == null)
                return;

            this.setSelectedIndex(this.prevSetIndex);

            var curr = this.nextSets[this.selectedIndex];
            if (curr != null) {
                this.nextTypes.splice(0, 0, curr.types);
                this.removeChild(curr);
            }

            this.nextSets[this.selectedIndex] = this.prevSet;
            this.addChild(this.prevSet);
            this.prevSet = null;
        }

        getInputListener(pos: PIXI.Point): InputListener {

            let locPos = new PIXI.Point(pos.x - this.position.x, pos.y - this.position.y);

            var index = Math.floor(locPos.x / this.selectorWidth + this.tileCount / 2.0);
            if (index < 0 || index >= this.tileCount || Math.abs(locPos.y) > this.selectorWidth / 2.0)
                return null;

            this.setSelectedIndex(index);
            return this.nextSets[index];
        }

        update(dt: number) {
            for (var i: number = 0; i < this.nextSets.length; ++i)
                this.nextSets[i].update(dt);
        }

        resetPanel() {
            this.nextTypes = [];
            for (var i: number = 0; i < this.tileCount; ++i)
                this.changeTileIndex(i);
            this.prevSet = null;
        }

        changeTile(ts: TileSet) {
            for (var i: number = 0; i < this.nextSets.length; ++i) {
                if (this.nextSets[i] == ts) {
                    this.changeTileIndex(i);
                    break;
                }
            }
        }

        changeTileIndex(index: number) {

            if (this.nextSets[index] != null) {
                this.prevSet = this.nextSets[index];
                this.prevSetIndex = index;
                this.removeChild(this.prevSet);
            }

            var tileSet = new TileSet(this.tileWidth, this.getNextType(), this.startDragCallback, this.startDragListener);
            this.nextSets[index] = tileSet;
            this.addChild(tileSet);
            tileSet.position.x = (index - (this.tileCount - 1) / 2.0) * this.selectorWidth;
            tileSet.position.y = 0;
        }

        shuffle(array: Array<any>) {
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
            this.changeTileIndex(this.selectedIndex);
        }

        getCurrentTileSet(): TileSet {
            return this.nextSets[this.selectedIndex];
        }

        getNextType(): TileDescriptor[] {


            if (this.nextTypes.length == 0) {

                /*
                var topTypes: TileDescriptor[] = [];
                var btmTypes: TileDescriptor[] = [];
                for (var i: number = 0; i < 5; ++i) {
                    for (var it: number = 0; it < 2; ++it) {
                        let d1: Direction = it == 0 ? Direction.Down : Direction.Up;
                        let d2: Direction = (d1 + 1 + i) % 6;
                        let tile = new TileDescriptor(TileType.Path, 0);
                        tile.paths.push(new TilePathDescriptor(d1, d2));
                        if (it == 0)
                            topTypes.push(tile);
                        else
                            btmTypes.push(tile);
                    }
                }

                this.shuffle(btmTypes);

                for (let i in btmTypes)
                    this.nextTypes.push([topTypes[i], btmTypes[i]]);
                    */


                for (var i: number = 0; i < 3; ++i) {

                    let topTile = new TileDescriptor(TileType.Path, 0);
                    topTile.paths.push(new TilePathDescriptor(Direction.Down, (Direction.Down + 2 + i) % 6));

                    for (var j: number = 0; j < 3 - i; ++j) {

                        let btmTile = new TileDescriptor(TileType.Path, 0);
                        btmTile.paths.push(new TilePathDescriptor(Direction.Up, (Direction.Up + 4 - j) % 6));
                        this.nextTypes.push([topTile, btmTile]);
                    }
                }

                // this.nextTypes.push([new TileDescriptor(TileType.Wildcard, 0)]);

                // this.nextTypes.push([new TileDescriptor(TileType.Trash, 0)]);

                /*
                let tripleTile = new TileDescriptor(TileType.Path, 0);
                this.nextTypes.push([tripleTile]);
                for (var i: number = 0; i < 3; ++i) {
                    tripleTile.paths.push(new TilePathDescriptor(2 * i, 2 * i + 1));
                }

                let straightTile = new TileDescriptor(TileType.Path, 0);
                this.nextTypes.push([straightTile]);
                straightTile.paths.push(new TilePathDescriptor(Direction.Up, Direction.Down));
                for (var i: number = 0; i < 2; ++i) {
                    straightTile.paths.push(new TilePathDescriptor(3 * i + 1, 3 * i + 2));
                }

                let doubleTile = new TileDescriptor(TileType.Path, 0);
                this.nextTypes.push([doubleTile]);
                for (var i: number = 0; i < 2; ++i) {
                    doubleTile.paths.push(new TilePathDescriptor(3 * i + 2, (3 * i + 4) % 6));
                }

                for (var i: number = 0; i < 3; ++i) {
                    let baseTile = new TileDescriptor(TileType.Path, 0);
                    this.nextTypes.push([baseTile]);
                    let baseIdx = Math.floor(Math.random() * 6) % 6;
                    baseTile.paths.push(new TilePathDescriptor(baseIdx, (baseIdx + 1 + i) % 6));
                }
                */

                this.shuffle(this.nextTypes);
            }

            var res = this.nextTypes[0];
            this.nextTypes.splice(0, 1);

            return res;
        }

        setSelectedIndex(index: number) {
            this.selectedIndex = index;
            this.selector.position.x = this.nextSets[index].x;
            this.selector.position.y = this.nextSets[index].y;
        }

        // select(pos:PIXI.Point) : boolean {
        //     var index = Math.floor(pos.x / this.selectorWidth + this.tileCount / 2.0);
        //     if(index < 0 || index >= this.tileCount || Math.abs(pos.y) > this.selectorWidth / 2.0)
        //         return false;

        //     if(this.selectedIndex == index)
        //         this.nextSets[index].rotateSet();
        //     else
        //         this.setSelectedIndex(index);

        //     return true;
        // }
    }
}