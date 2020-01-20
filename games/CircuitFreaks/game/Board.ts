///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>
///<reference path="CircuitDetector.ts"/>

module CircuitFreaks
{
    export enum BoardState {
        Idle,
        RemoveCircuits,
        Drop,
        Place,
        DegradeDeadlock,
        ProcessCircuits
    }

    export class Board extends PIXI.Container {

        gridGraphics:PIXI.Graphics;

        rows:number;
        columns:number;
        tileWidth:number;
        slots:Tile[][];
        tileWasPushedTMP:boolean;

        snapshot:TileDescriptor[][];

        discardTiles:Tile[];

        boardWidth:number;
        boardHeight:number;
        state:BoardState;
        stateParameter:number;

        circuitDetector:CircuitDetector;

        stateChangedListener:any;
        onStateChanged:Function;

        constructor(w:number, h:number) {
            super();

            this.boardWidth = w;
            this.boardHeight = h;

            // this.rows = 8;
            // this.columns = 6;
            // this.tileWidth = Math.min(w / this.columns, h / this.rows);// 60;

            this.discardTiles = [];

            this.state = BoardState.Idle;
            this.stateParameter = 0;

            this.tileWasPushedTMP = false;

            // //create empty grid:
            // this.slots = [];
            // this.snapshot = [];
            // for(var i:number=0; i<this.rows; ++i) {
            //     this.slots[i] = [];
            //     this.snapshot[i] = [];
            //     for(var j:number=0; j<this.columns; ++j) {
            //         this.slots[i][j] = null;
            //         this.snapshot[i][j] = null;
            //     }
            // }

            // this.circuitDetector = new CircuitDetector(this.slots, this.rows, this.columns);

            // var center = new PIXI.Point(w / 2.0, h / 2.0);
            // var size = new PIXI.Point(this.columns * this.tileWidth, this.rows * this.tileWidth);

            this.gridGraphics = new PIXI.Graphics();
            // this.gridGraphics.beginFill(0x0, 0.3);
            // this.gridGraphics.lineStyle(this.tileWidth * .05, 0xffffff, 1);
            // this.gridGraphics.drawRoundedRect(center.x - size.x / 2.0, center.y - size.y / 2.0, size.x, size.y, .1 * this.tileWidth);
            // this.gridGraphics.endFill();
            // for(var i:number=1; i<this.rows; ++i) {
            //     var y = center.y + (i / this.rows - .5) * size.y;
            //     this.gridGraphics.moveTo(center.x - size.x / 2.0, y);
            //     this.gridGraphics.lineTo(center.x + size.x / 2.0, y);
            // }
            // for(var i:number=1; i<this.columns; ++i) {
            //     var x = center.x + (i / this.columns - .5) * size.x;
            //     this.gridGraphics.moveTo(x, center.y - size.y / 2.0);
            //     this.gridGraphics.lineTo(x, center.y + size.y / 2.0);
            // }
            this.addChild(this.gridGraphics);

            this.setBoardSize(8, 5);

            this.resetBoard();

            this.createSnapshot(false);
        }

        setBoardSize(rows:number, cols:number) {
            this.rows = rows;
            this.columns = cols;
            this.tileWidth = Math.min(this.boardWidth / this.columns, this.boardHeight / (this.rows + 1));

            //create empty grid:
            this.slots = [];
            this.snapshot = [];
            for(var i:number=0; i<this.rows; ++i) {
                this.slots[i] = [];
                this.snapshot[i] = [];
                for(var j:number=0; j<this.columns; ++j) {
                    this.slots[i][j] = null;
                    this.snapshot[i][j] = null;
                }
            }

            this.circuitDetector = new CircuitDetector(this.slots, this.rows, this.columns);

            var center = new PIXI.Point(this.boardWidth / 2.0, this.boardHeight / 2.0);
            var size = new PIXI.Point(this.columns * this.tileWidth, this.rows * this.tileWidth);

            this.gridGraphics.clear();
            for(var i:number=0; i<this.rows; ++i) {
                for(var j:number=0; j<this.columns; ++j) {
                    let pos = this.toScreenPos(i, j);
                    this.gridGraphics.beginFill(0x0, 0.3);
                    this.gridGraphics.lineStyle(this.tileWidth * 0.15, 0xffffff, 1);
                    drawHex(this.gridGraphics, pos, this.tileWidth);
                    this.gridGraphics.endFill();
                }
            }

            // this.gridGraphics.drawRoundedRect(center.x - size.x / 2.0, center.y - size.y / 2.0, size.x, size.y, .1 * this.tileWidth);
            // this.gridGraphics.endFill();
            // for(var i:number=1; i<this.rows; ++i) {
            //     var y = center.y + (i / this.rows - .5) * size.y;
            //     this.gridGraphics.moveTo(center.x - size.x / 2.0, y);
            //     this.gridGraphics.lineTo(center.x + size.x / 2.0, y);
            // }
            // for(var i:number=1; i<this.columns; ++i) {
            //     var x = center.x + (i / this.columns - .5) * size.x;
            //     this.gridGraphics.moveTo(x, center.y - size.y / 2.0);
            //     this.gridGraphics.lineTo(x, center.y + size.y / 2.0);
            // }
        }

        createSnapshot(tilePushed:boolean) {
            this.tileWasPushedTMP = tilePushed;
            for(var i:number=0; i<this.rows; ++i) {
                for(var j:number=0; j<this.columns; ++j) {
                    let tile = this.slots[i][j];
                    this.snapshot[i][j] = (tile == null) ? null : new TileDescriptor(tile.type, tile.groupIndex);
                }
            }
        }

        revertToSnapshot() {
            this.clearBoard();

            for(var i:number=0; i<this.rows; ++i) {
                for(var j:number=0; j<this.columns; ++j) {
                    if(this.snapshot[i][j] != null) {
                        let desc = this.snapshot[i][j];
                        var tile = new Tile(this.tileWidth, desc);
                        var res =  this.toScreenPos(i, j);
                        tile.position.x = res.x;
                        tile.position.y = res.y;
                        this.slots[i][j] = tile;
                        this.addChild(tile);
                        tile.groupIndex = desc.groupIndex;
                        tile.redraw();
                    }
                }
            }

            this.tileWasPushedTMP = false;

            this.setState(BoardState.ProcessCircuits);
        }

        clearBoard() {
            while(this.discardTiles.length > 0) {
                this.removeChild(this.discardTiles[0]);
                this.discardTiles.splice(0, 1);
            }

            //clear old tiles:
            for(var i:number=0; i<this.rows; ++i) {
                for(var j:number=0; j<this.columns; ++j) {
                    var tile = this.slots[i][j];
                    if(tile != null)
                        this.removeChild(tile);
                    this.slots[i][j] = null;
                }
            }
        }

        loadBoard(data:LevelData) {
            this.clearBoard();
            /*
            console.log("gaat ie");

            this.setBoardSize(data.rows, data.columns);

            console.log(data);

            //fill top few rows:
            for(var i:number=0; i<data.rows; ++i) {
                for(var j:number=0; j<data.columns; ++j) {
                    var idx = i * data.columns + j;
                    if(data.tiles[idx] == undefined)
                        continue;

                    console.log("ok");

                    var tile = new Tile(this.tileWidth, data.tiles[idx]);
                    var res =  this.toScreenPos(i, j);
                    tile.position.x = res.x;
                    tile.position.y = res.y;
                    this.slots[i][j] = tile;
                    this.addChild(tile);
                    tile.groupIndex = 0;
                    tile.redraw();
                }
            }

            this.setState(BoardState.Idle);
            */
        }

        resetBoard() {

            this.clearBoard();

            var centerRow = Math.floor(this.rows / 2);
            var centerColumn = Math.floor(this.columns / 2);


            //fill top few rows:
            for(var i:number=0; i<3; ++i) {
                for(var j:number=0; j<5; ++j) {

                    var type = TileType.Trash;
                    var group = 0;
                    if(i == 0) {
                        if(j == 1) {
                            type = TileType.Source;
                            group = 1;
                        }
                        else if(j == 4) {
                            type = TileType.DoubleSource;
                            group = 1;
                        }
                    }
                    else if(i == 1) {
                        if(j == 2) {
                            type = TileType.TripleSource;
                            group = 0;
                        }
                        else if(j == 3) {
                            type = TileType.Source;
                            group = 0;
                        }
                    }
                    else if(i == 2) {
                        if(j == 0) {
                            type = TileType.Source;
                            group = 0;
                        }
                        else if(j == 5) {
                            type = TileType.DoubleSource;
                            group = 0;
                        }
                    }

                    var row = i;//centerRow + i - 1;
                    var column = j;//centerColumn + j - 2;

                    // var type = Math.floor(Math.random() * TileType.Count);
                    var tile = new Tile(this.tileWidth, new TileDescriptor(type, group));
                    var res =  this.toScreenPos(row, column);
                    tile.position.x = res.x;
                    tile.position.y = res.y;
                    this.slots[row][column] = tile;
                    this.addChild(tile);
                    tile.redraw();
                }
            }

            this.setState(BoardState.Idle);
        }

        undo() {
            this.revertToSnapshot();
        }

        setState(state:BoardState) {
            this.state = state;
            this.stateParameter = 0;

            switch(this.state) {
                case BoardState.Idle:
                    this.circuitDetector.findDeadlocks();
                    break;
                case BoardState.Place:
                    break;
                case BoardState.RemoveCircuits:
                    this.clearCircuitTiles();
                    break;
                case BoardState.Drop:
                    this.dropTiles();
                    break;
                case BoardState.DegradeDeadlock:
                    ///...
                    break;
                case BoardState.ProcessCircuits:

                    while(this.discardTiles.length > 0) {
                        this.removeChild(this.discardTiles[0]);
                        this.discardTiles.splice(0,1);
                    }

                    //switch to some other state:
                    if(this.hasDropTiles()) {
                        //drop tiles...
                        this.setState(BoardState.Drop);
                    }
                    else {
                        this.circuitDetector.propagateCircuits();
                        if(this.hasCircuit())
                            this.setState(BoardState.RemoveCircuits);
                        else
                            this.setState(BoardState.Idle);
                    }
                    break;
            }
        }

        updateCurrentState(dt:number, duration:number, nextState:BoardState) {
            this.stateParameter += dt / duration;
            if(this.stateParameter > 1.0) {
                this.setState(nextState);
            }
        }

        updateState(dt:number) {
            switch(this.state) {
                case BoardState.Idle:
                    break;
                case BoardState.Place:
                    this.updateCurrentState(dt, 0.5, BoardState.ProcessCircuits);
                    break;
                case BoardState.DegradeDeadlock:
                    this.updateCurrentState(dt, 0.5, BoardState.ProcessCircuits);
                    break;
                case BoardState.RemoveCircuits:
                    this.updateCurrentState(dt, 0.5, BoardState.ProcessCircuits);
                    break;
                case BoardState.Drop:
                    this.updateCurrentState(dt, 0.66, BoardState.ProcessCircuits);
                    break;
                case BoardState.ProcessCircuits:
                    //not a continuous state: changes to other state when set to 'ProcessCircuits'
                    break;
            }
        }

        update(dt:number) {
            this.updateState(dt);

            for(var i:number=0; i<this.discardTiles.length; ++i)
                this.discardTiles[i].update(dt);

            for(var i:number=0; i<this.rows; ++i) {
                for(var j:number=0; j<this.columns; ++j) {
                    var tile = this.slots[i][j];
                    if(tile != null)
                        tile.update(dt);
                }
            }
        }


        clearCircuitTiles() {

            this.circuitDetector.clearTrashAdjacentToCircuits(this.discardTiles);

            for(var i:number=0; i<this.rows; ++i) {
                for(var j:number=0; j<this.columns; ++j) {
                    var tile = this.slots[i][j];
                    if(tile == null)
                        continue;

                    if(tile.hasCircuit()) {
                        if(tile.circuitEliminatesTile()) {
                            this.discardTiles.push(tile);
                            tile.setState(TileState.Disappearing);
                            this.slots[i][j] = null;
                        }
                        else {
                            tile.filterCircuitFromTile();
                        }
                    }
                }
            }
        }

        dropTiles() {


            for(var i:number=0; i<this.rows; ++i) {
                for(var oddIt=0; oddIt<2; ++oddIt) {
                    for(var j=(1 - oddIt); j<this.columns; j+=2) {
                        let tile = this.slots[i][j];
                        if(tile == null)
                            continue;
                        var row = i;
                        while(this.isDropTileSlot(row, j) && row > 0) {
                            row = row - 1;
                            console.log("drop to", row)
                        }

                        if(row != i) {
                            console.log("do drop");
                            this.slots[row][j] = tile;
                            this.slots[i][j] = null;
                            tile.position = this.toScreenPos(row, j);
                            tile.drop((i - row) * this.tileWidth);
                        }

                        // while(this.isDropTile(row, j)) {
                        //     //drop tile:
                        //     var goalRow = i - numDrops;
                        //     this.slots[goalRow][j] = tile;
                        //     this.slots[i][j] = null;
                        //     tile.position = this.toScreenPos(goalRow, j);
                        //     tile.drop(numDrops * this.tileWidth);
                        // }
                        // if(this.isDropTile(i, j)) {

                        //     var 



                        // }
                    }
                }
            }



            // for(var j:number=0; j<this.columns; ++j) {
            //     var numDrops = 0;
            //     for(var i:number=0; i<this.rows; ++i) {
            //         var tile = this.slots[i][j];
            //         if(tile == null) {
            //             numDrops++;
            //         }
            //         else if(numDrops > 0) {
            //             var goalRow = i - numDrops;
            //             this.slots[goalRow][j] = tile;
            //             this.slots[i][j] = null;
            //             tile.position = this.toScreenPos(goalRow, j);
            //             tile.drop(numDrops * this.tileWidth);
            //         }
            //     }
            // }
        }

        toScreenPos(row:number, col:number) : PIXI.Point {
            let baseUnit = hexWidthFactor * this.tileWidth;
            var res = new PIXI.Point();
            res.x = this.boardWidth / 2.0 + (col - (this.columns - 1) * .5) * baseUnit;
            res.y = this.boardHeight / 2.0 + (row - (this.rows - 1) * .5) * this.tileWidth;
            if(col % 2 == 0)
                res.y += .5 * this.tileWidth;
            return res;
        }

        countExisting(slots:Tile[][]) : number {
            var res = 0;
            for(var i:number=0; i<this.rows; ++i) {
                for(var j:number=0; j<this.columns; ++j) {
                    if(slots[i][j] != null)
                        ++res;
                }
            }

            return res;
        }

        isEmptyTileAt(row:number, column:number) : boolean {
            if(row < 0 || row >= this.rows || column < 0 || column >= this.columns)
                return false;
            return this.slots[row][column] == null;
        }

        isDropTileSlot(row:number, column:number) {
            if(row < 0 || row >= this.rows || column < 0 || column >= this.columns)
                return false;
            var dirs:Direction[] = [ Direction.UpLeft, Direction.Up, Direction.UpRight ];
            for(let d of dirs) {
                let coord = new PIXI.Point(row, column);
                this.stepCoord(coord, d);
                //ignore left and right boundary:
                if(coord.y < 0 || coord.y >= this.columns)
                    continue;
                if(!this.isEmptyTileAt(coord.x, coord.y))
                    return false;
            }

            return true;
        }

        hasDropTiles() : boolean {
            for(var i:number=0; i<this.rows; ++i) {
                for(var j:number=0; j<this.columns; ++j) {
                    if(this.isDropTileSlot(i, j) && this.slots[i][j] != null)
                        return true;
                }
            }
            // for(var j:number=0; j<this.columns; ++j) {
            //     var encounteredEmpty = false;
            //     for(var i:number=0; i<this.rows; ++i) {
            //         if(this.slots[i][j] == null)
            //             encounteredEmpty = true;
            //         else if(encounteredEmpty)
            //             return true;
            //     }
            // }
            return false;
        }

        hasCircuit() {
            for(var i:number=0; i<this.rows; ++i) {
                for(var j:number=0; j<this.columns; ++j) {
                    let tile = this.slots[i][j];
                    if(tile != null) {
                        if(tile.hasCircuit())
                            return true;
                    }
                }
            }
            return false;
        }

        stepCoord(coord:PIXI.Point, dir:Direction) {
            //NOTE: x is row, y is column!
            let evenCol:boolean = coord.y % 2 == 0;
            switch(dir) {
                case Direction.Up:
                    --coord.x;
                    break;
                case Direction.Down:
                    ++coord.x;
                    break;
                case Direction.DownLeft:
                    --coord.y;
                    if(evenCol)
                        ++coord.x;
                    break;
                case Direction.DownRight:
                    ++coord.y;
                    if(evenCol)
                        ++coord.x;
                    break;
                case Direction.UpLeft:
                    --coord.y;
                    if(!evenCol)
                        --coord.x;
                    break;
                case Direction.UpRight:
                    ++coord.y;
                    if(!evenCol)
                        --coord.x;
                    break;
            }
        }

        isCoordAvailable(pt:PIXI.Point) : boolean {
            if(pt.x < 0 || pt.x >= this.rows || pt.y < 0 || pt.y >= this.columns)
                return false;
            return this.slots[pt.x][pt.y] == null;
        }

        pushTile(pos:PIXI.Point, set:TileSet) : boolean {
            let descs = set.getTileDescriptions();

            if(this.state != BoardState.Idle)
                return false;

            let slotHeight = this.tileWidth;
            let slotWidth = hexWidthFactor * slotHeight;

            let samplePos = new PIXI.Point(pos.x, pos.y);
            if(descs.length) {
                let angle = (-.5 + set.cwRotations / 3.0) * Math.PI;
                let offset = (descs.length - 1) * .5 * slotHeight;
                samplePos.x += Math.cos(angle) * offset;
                samplePos.y += Math.sin(angle) * offset;
            }

            var column = Math.floor((samplePos.x - this.boardWidth / 2.0) / slotWidth + this.columns / 2.0);
            if(column % 2 == 0)
                samplePos.y -= .5 * slotHeight;

            var row = Math.floor((samplePos.y - this.boardHeight / 2.0) / slotHeight + this.rows / 2.0);

            var coord = new PIXI.Point(row, column);
            var placesAvailable = this.isCoordAvailable(coord);
            for(var i:number=0; i<descs.length - 1; ++i) {
                this.stepCoord(coord, set.getDirection());
                placesAvailable = placesAvailable && this.isCoordAvailable(coord);
            }



            if(placesAvailable) {
                this.createSnapshot(true);
    
                coord = new PIXI.Point(row, column);
                for(var i:number=0; i<set.tiles.length; ++i) {
                    var tile = new Tile(this.tileWidth, descs[i]);
                    tile.position = this.toScreenPos(coord.x, coord.y);
                    tile.setState(TileState.Appearing);
                    this.slots[coord.x][coord.y] = tile;
                    this.addChild(tile);
                    this.stepCoord(coord, set.getDirection());
                }

                // var tile = new Tile(this.tileWidth, type);
                // tile.position = this.toScreenPos(row, column);
                // this.slots[row][column] = tile;
                // this.addChild(tile);

                this.setState(BoardState.Place);

                return true;
            }



            /*
            let isHor = false;

            var stepRows = 1, stepCols = 1;
            stepCols = set.tiles.length;
            if(isHor)
                stepCols = set.tiles.length;
            else
                stepRows = set.tiles.length;


            var offset = -(set.tiles.length - 1) * .5 * this.tileWidth;

            var slotsAvailable = true;
            var column = Math.floor((pos.x - this.boardWidth / 2.0 + (isHor ? offset : 0)) / this.tileWidth + this.columns / 2.0);
            if(column < 0 || column > this.columns - stepCols) 
                slotsAvailable = false;

            var row = Math.floor((pos.y - this.boardHeight / 2.0 + (isHor ? 0 : offset)) / this.tileWidth + this.rows / 2.0);
            if(row < 0 || row > this.rows - stepRows) 
                slotsAvailable = false;

            //make sure slots are empty:
            for(var i:number=0; i<set.tiles.length && slotsAvailable; ++i) {
                var calcRow = row + (isHor ? 0 : i);
                var calcCol = column + (isHor ? i : 0);
                if(this.slots[calcRow][calcCol] != null)
                    slotsAvailable = false;
            }

            if(slotsAvailable) {

                this.createSnapshot(true);

                for(var i:number=0; i<set.tiles.length; ++i) {
                    var calcRow = row + (isHor ? 0 : i);
                    var calcCol = column + (isHor ? i : 0);
                    var tile = new Tile(this.tileWidth, descs[i]);
                    tile.position = this.toScreenPos(calcRow, calcCol);
                    tile.setState(TileState.Appearing);
                    this.slots[calcRow][calcCol] = tile;
                    this.addChild(tile);
                }

                // var tile = new Tile(this.tileWidth, type);
                // tile.position = this.toScreenPos(row, column);
                // this.slots[row][column] = tile;
                // this.addChild(tile);

                this.setState(BoardState.Place);

                return true;
            }
            else {

                //don't do anything deadlock-related for now...

                // column = Math.floor((pos.x - this.boardWidth / 2.0) / this.tileWidth + this.columns / 2.0);
                // if(column < 0 || column >= this.columns) 
                //     return false;
    
                // row = Math.floor((pos.y - this.boardHeight / 2.0) / this.tileWidth + this.rows / 2.0);
                // if(row < 0 || row >= this.rows) 
                //     return false;

                // if(this.slots[row][column] != null) {
                //     this.createSnapshot(false);
                //     this.circuitDetector.degradeDeadlock(row, column);
                //     this.setState(BoardState.DegradeDeadlock);
                // }
            }
            */

            return false;
        }
    }
}