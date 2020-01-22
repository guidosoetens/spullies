///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>
///<reference path="CircuitDetector.ts"/>
///<reference path="TileDragLayer.ts"/>

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
        tilesLayer:PIXI.Container;

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

        dragging:boolean;
        dragLayer:TileDragLayer;

        constructor(w:number, h:number) {
            super();

            this.boardWidth = w;
            this.boardHeight = h;

            this.discardTiles = [];

            this.state = BoardState.Idle;
            this.stateParameter = 0;

            this.tileWasPushedTMP = false;

            this.gridGraphics = new PIXI.Graphics();
            this.addChild(this.gridGraphics);

            this.tilesLayer = new PIXI.Container();
            this.addChild(this.tilesLayer);

            this.dragging = false;
            this.dragLayer = new TileDragLayer();
            this.addChild(this.dragLayer);

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
        }

        createSnapshot(tilePushed:boolean) {
            this.tileWasPushedTMP = tilePushed;
            for(var i:number=0; i<this.rows; ++i) {
                for(var j:number=0; j<this.columns; ++j) {
                    let tile = this.slots[i][j];
                    this.snapshot[i][j] = (tile == null) ? null : tile.getTileDescriptor();
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
                        this.tilesLayer.addChild(tile);
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
                this.tilesLayer.removeChild(this.discardTiles[0]);
                this.discardTiles.splice(0, 1);
            }

            //clear old tiles:
            for(var i:number=0; i<this.rows; ++i) {
                for(var j:number=0; j<this.columns; ++j) {
                    var tile = this.slots[i][j];
                    if(tile != null)
                        this.tilesLayer.removeChild(tile);
                    this.slots[i][j] = null;
                }
            }
        }

        loadBoard(data:LevelData) {
            this.clearBoard();
            
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
                    this.tilesLayer.addChild(tile);
                    tile.groupIndex = 0;
                    tile.redraw();
                }
            }

            this.setState(BoardState.Idle);
        }

        resetBoard() {

            this.clearBoard();

            let types = [TileType.Trash, TileType.Source, TileType.DoubleSource, TileType.TripleSource ];

            //fill top few rows:
            for(var i:number=0; i<4; ++i) {
                for(var j:number=0; j<5; ++j) {

                    var typeIdx = Math.floor(Math.random() * 4);
                    if(i == 3 && typeIdx == 0)
                        typeIdx += 1 + Math.floor(Math.random() * 2);

                    let type = types[typeIdx];
                    
                    let group = Math.floor(Math.random() * 3);

                    var row = i;
                    var column = j;

                    // var type = Math.floor(Math.random() * TileType.Count);
                    var tile = new Tile(this.tileWidth, new TileDescriptor(type, group));
                    var res =  this.toScreenPos(row, column);
                    tile.position.x = res.x;
                    tile.position.y = res.y;
                    this.slots[row][column] = tile;
                    this.tilesLayer.addChild(tile);
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
                        this.tilesLayer.removeChild(this.discardTiles[0]);
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

        startDrag(p:PIXI.Point) {
            let coord = this.pointToCoord(p.x, p.y);
            if(coord.x >= 0 && coord.x < this.rows && coord.y >= 0 && coord.y < this.columns) {
                var tile = this.slots[coord.x][coord.y];
                if(tile != null) {
                    this.dragging = true;
                    this.dragLayer.dragSourceCoord.x = coord.x;
                    this.dragLayer.dragSourceCoord.y = coord.y;
                    this.dragLayer.dragSourePoint.x = p.x;
                    this.dragLayer.dragSourePoint.y = p.y;
                    this.dragLayer.dragDirection = undefined;
                }
            }
        }

        dragTo(p:PIXI.Point) {
            if(!this.dragging)
                return;

            if(this.dragLayer.dragDirection == undefined) {
                let toPos = new PIXI.Point(p.x - this.dragLayer.dragSourePoint.x, p.y - this.dragLayer.dragSourePoint.y);
                var maxDist = 0;
                var maxDir = 0;
                for(var i:number=0; i<3; ++i) {
                    let angle = -.5 * Math.PI + i * Math.PI / 3.0;
                    let toX = Math.cos(angle);
                    let toY = Math.sin(angle);

                    let projection = toPos.x * toX + toPos.y * toY;
                    if(Math.abs(projection) > Math.abs(maxDist)) {
                        maxDist = projection;
                        maxDir = i;
                    }
                }

                if(Math.abs(maxDist) > 10.0) {
                    this.dragLayer.dragDirection = maxDir;

                    //add children in current sequence:
                    var borderCoord:PIXI.Point = new PIXI.Point(this.dragLayer.dragSourceCoord.x, this.dragLayer.dragSourceCoord.y);
                    //step back until coord is outside of board:
                    let oppDir = getOppositeDir(this.dragLayer.dragDirection);
                    while(this.isBoardCoord(borderCoord)) {
                        this.stepCoord(borderCoord, oppDir);
                    }

                    var testCoord = new PIXI.Point(borderCoord.x, borderCoord.y);
                    this.stepCoord(testCoord, this.dragLayer.dragDirection);
                    var allPath = true;
                    let dragTiles = [];
                    while(this.isBoardCoord(testCoord) && allPath) {
                        let tile = this.slots[testCoord.x][testCoord.y];
                        if(tile == null)
                            allPath = false;
                        else if(tile.type != TileType.Path)
                            allPath = false;
                        this.stepCoord(testCoord, this.dragLayer.dragDirection);
                        dragTiles.push(tile);
                    }

                    if(!allPath) {
                        this.dragLayer.dragDirection = undefined;
                        this.dragging = false;
                        return;
                    }

                    for(let tile of dragTiles)
                        this.tilesLayer.removeChild(tile);
                    this.dragLayer.startDrag(dragTiles, this.toScreenPos(borderCoord.x, borderCoord.y));
                }
            }
            else if(this.dragging) {
                this.dragLayer.updateDrag(p);
            }
        }

        dragEnd(p:PIXI.Point) {
            if(this.dragging) {
                let tiles = this.dragLayer.endDrag(p);

                var coord:PIXI.Point = new PIXI.Point(this.dragLayer.dragSourceCoord.x, this.dragLayer.dragSourceCoord.y);
                let oppDir = getOppositeDir(this.dragLayer.dragDirection);
                while(this.isBoardCoord(coord)) {
                    this.stepCoord(coord, oppDir);
                }

                for(var i:number=0; i<tiles.length; ++i) {
                    this.stepCoord(coord, this.dragLayer.dragDirection);
                    var tileIndex = (i - this.dragLayer.indexOffset) % tiles.length;
                    if(tileIndex < 0)
                        tileIndex += tiles.length;
                    let tile = tiles[tileIndex];
                    this.slots[coord.x][coord.y] = tile;
                    this.tilesLayer.addChild(tile);
                }

                this.setState(BoardState.ProcessCircuits);
            }
            this.dragging = false;
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
                        var row:number = i;
                        while(this.isDropTileSlot(row, j) && row > 0) {
                            row = row - 1;
                        }

                        if(row != i) {
                            this.slots[row][j] = tile;
                            this.slots[i][j] = null;
                            console.log(row, j);
                            tile.position = this.toScreenPos(row, j);
                            tile.drop((i - row) * this.tileWidth);
                        }
                    }
                }
            }
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

        isBoardCoord(pt:PIXI.Point) {
            return pt.x >= 0 && pt.x < this.rows && pt.y >= 0 && pt.y < this.columns;
        }

        isCoordAvailable(pt:PIXI.Point) : boolean {
            if(!this.isBoardCoord(pt))
                return false;
            return this.slots[pt.x][pt.y] == null;
        }

        pointToCoord(x:number, y:number) : PIXI.Point {
            let slotHeight = this.tileWidth;
            let slotWidth = hexWidthFactor * slotHeight;

            let column = Math.floor((x - this.boardWidth / 2.0) / slotWidth + this.columns / 2.0);
            if(column % 2 == 0)
                y -= .5 * slotHeight;

             let row = Math.floor((y - this.boardHeight / 2.0) / slotHeight + this.rows / 2.0);
            return new PIXI.Point(row, column);
        }

        pushTile(pos:PIXI.Point, set:TileSet) : boolean {

            if(this.state != BoardState.Idle)
                return false;

            let descs = set.getTileDescriptions();

            let slotHeight = this.tileWidth;
            let slotWidth = hexWidthFactor * slotHeight;

            let samplePos = new PIXI.Point(pos.x, pos.y);
            if(descs.length) {
                let angle = (-.5 + set.cwRotations / 3.0) * Math.PI;
                let offset = (descs.length - 1) * .5 * slotHeight;
                samplePos.x += Math.cos(angle) * offset;
                samplePos.y += Math.sin(angle) * offset;
            }

            var coord = this.pointToCoord(samplePos.x, samplePos.y);
            var placesAvailable = this.isCoordAvailable(coord);
            for(var i:number=0; i<descs.length - 1; ++i) {
                this.stepCoord(coord, set.getDirection());
                placesAvailable = placesAvailable && this.isCoordAvailable(coord);
            }

            if(placesAvailable) {
                this.createSnapshot(true);
    
                coord = this.pointToCoord(samplePos.x, samplePos.y);
                for(var i:number=0; i<set.tiles.length; ++i) {
                    var tile = new Tile(this.tileWidth, descs[i]);
                    tile.position = this.toScreenPos(coord.x, coord.y);
                    tile.setState(TileState.Appearing);
                    this.slots[coord.x][coord.y] = tile;
                    this.tilesLayer.addChild(tile);
                    this.stepCoord(coord, set.getDirection());
                }

                this.setState(BoardState.Place);

                return true;
            }

            this.startDrag(pos);

            return false;
        }
    }
}