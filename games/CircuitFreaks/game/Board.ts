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

        rows:number;
        columns:number;
        tileWidth:number;
        slots:Tile[][];

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

            this.rows = 10;
            this.columns = 6;
            this.tileWidth = Math.min(w / this.columns, h / this.rows);// 60;

            this.discardTiles = [];

            this.state = BoardState.Idle;
            this.stateParameter = 0;

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

            var center = new PIXI.Point(w / 2.0, h / 2.0);
            var size = new PIXI.Point(this.columns * this.tileWidth, this.rows * this.tileWidth);

            var grid = new PIXI.Graphics();
            grid.beginFill(0x0, 0.3);
            grid.lineStyle(this.tileWidth * .05, 0xffffff, 1);
            grid.drawRoundedRect(center.x - size.x / 2.0, center.y - size.y / 2.0, size.x, size.y, .1 * this.tileWidth);
            grid.endFill();
            for(var i:number=1; i<this.rows; ++i) {
                var y = center.y + (i / this.rows - .5) * size.y;
                grid.moveTo(center.x - size.x / 2.0, y);
                grid.lineTo(center.x + size.x / 2.0, y);
            }
            for(var i:number=1; i<this.columns; ++i) {
                var x = center.x + (i / this.columns - .5) * size.x;
                grid.moveTo(x, center.y - size.y / 2.0);
                grid.lineTo(x, center.y + size.y / 2.0);
            }
            this.addChild(grid);

            this.resetBoard();

            this.createSnapshot();
        }

        createSnapshot() {
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
                        var tile = new Tile(this.tileWidth, desc.type);
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

        resetBoard() {

            this.clearBoard();

            var centerRow = Math.floor(this.rows / 2);
            var centerColumn = Math.floor(this.columns / 2);


            //fill top few rows:
            for(var i:number=0; i<3; ++i) {
                for(var j:number=0; j<6; ++j) {

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
                            type = TileType.DoubleSource;
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
                    var tile = new Tile(this.tileWidth, type);
                    var res =  this.toScreenPos(row, column);
                    tile.position.x = res.x;
                    tile.position.y = res.y;
                    this.slots[row][column] = tile;
                    this.addChild(tile);
                    tile.groupIndex = group;
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
            for(var j:number=0; j<this.columns; ++j) {
                var numDrops = 0;
                for(var i:number=0; i<this.rows; ++i) {
                    var tile = this.slots[i][j];
                    if(tile == null) {
                        numDrops++;
                    }
                    else if(numDrops > 0) {
                        var goalRow = i - numDrops;
                        this.slots[goalRow][j] = tile;
                        this.slots[i][j] = null;
                        tile.position = this.toScreenPos(goalRow, j);
                        tile.drop(numDrops * this.tileWidth);
                    }
                }
            }
        }

        toScreenPos(row:number, col:number) : PIXI.Point {
            var res = new PIXI.Point();
            res.x = this.boardWidth / 2.0 + (col - (this.columns - 1) * .5) * this.tileWidth;
            res.y = this.boardHeight / 2.0 + (row - (this.rows - 1) * .5) * this.tileWidth;
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

        hasDropTiles() : boolean {
            for(var j:number=0; j<this.columns; ++j) {
                var encounteredEmpty = false;
                for(var i:number=0; i<this.rows; ++i) {
                    if(this.slots[i][j] == null)
                        encounteredEmpty = true;
                    else if(encounteredEmpty)
                        return true;
                }
            }
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

        pushTile(pos:PIXI.Point, set:TileSet) : boolean {

            if(this.state != BoardState.Idle)
                return false;

            var stepRows = 1, stepCols = 1;
            if(set.isHorizontal)
                stepCols = set.tiles.length;
            else
                stepRows = set.tiles.length;


            var offset = -(set.tiles.length - 1) * .5 * this.tileWidth;

            var slotsAvailable = true;
            var column = Math.floor((pos.x - this.boardWidth / 2.0 + (set.isHorizontal ? offset : 0)) / this.tileWidth + this.columns / 2.0);
            if(column < 0 || column > this.columns - stepCols) 
                slotsAvailable = false;

            var row = Math.floor((pos.y - this.boardHeight / 2.0 + (set.isHorizontal ? 0 : offset)) / this.tileWidth + this.rows / 2.0);
            if(row < 0 || row > this.rows - stepRows) 
                slotsAvailable = false;

            //make sure slots are empty:
            for(var i:number=0; i<set.tiles.length && slotsAvailable; ++i) {
                var calcRow = row + (set.isHorizontal ? 0 : i);
                var calcCol = column + (set.isHorizontal ? i : 0);
                if(this.slots[calcRow][calcCol] != null)
                    slotsAvailable = false;
            }

            if(slotsAvailable) {

                this.createSnapshot();

                for(var i:number=0; i<set.tiles.length; ++i) {
                    var calcRow = row + (set.isHorizontal ? 0 : i);
                    var calcCol = column + (set.isHorizontal ? i : 0);
                    var tile = new Tile(this.tileWidth, set.tiles[i].type);
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

                column = Math.floor((pos.x - this.boardWidth / 2.0) / this.tileWidth + this.columns / 2.0);
                if(column < 0 || column >= this.columns) 
                    return false;
    
                row = Math.floor((pos.y - this.boardHeight / 2.0) / this.tileWidth + this.rows / 2.0);
                if(row < 0 || row >= this.rows) 
                    return false;

                if(this.slots[row][column] != null) {
                    this.createSnapshot();
                    this.circuitDetector.degradeDeadlock(row, column);
                    this.setState(BoardState.DegradeDeadlock);
                }
            }

            return false;
        }
    }
}