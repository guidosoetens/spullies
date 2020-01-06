///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Tile.ts"/>

module CircuitFreaks
{
    export class CircuitDetector {

        slots:Tile[][];
        rows:number;
        columns:number;

        constructor(slots:Tile[][], rows:number, columns:number) {
            this.slots = slots;
            this.rows = rows;
            this.columns = columns;
        }

        performFunctionOnTiles(f:Function) {
            for(var i:number=0; i<this.rows; ++i) {
                for(var j:number=0; j<this.columns; ++j) {
                    if(this.slots[i][j] != null) {
                        f(this, i, j, this.slots[i][j]);
                    }
                }
            }
        }

        stepCoord(coord:PIXI.Point, dir:Direction) {
            //NOTE: x is row, y is column!
            switch(dir) {
                case Direction.Up:
                    --coord.x;
                    break;
                case Direction.Down:
                    ++coord.x;
                    break;
                case Direction.Left:
                    --coord.y;
                    break;
                case Direction. Right:
                    ++coord.y;
                    break;
            }
        }

        connects(row:number, column:number, dir:Direction) : boolean {
            var tile = this.getTile(row, column);
            if(tile == null)
                return false;
            return tile.connects(dir);
        }
        
        getTile(row:number, column:number) : Tile {
            if(row < 0 || row >= this.rows || column < 0 || column >= this.columns)
                return null;
            return this.slots[row][column];
        }

        isSourceType(type:TileType) : boolean {
            switch(type) {
                case TileType.Source:
                case TileType.DoubleSource:
                case TileType.Trash:
                    return true;
                default:
                    return false;
            }
        }

        isPathType(type:TileType) {
            switch(type) {
                case TileType.Curve_NE:
                case TileType.Curve_NW:
                case TileType.Curve_SE:
                case TileType.Curve_SW:
                case TileType.Straight_H:
                case TileType.Straight_V:
                case TileType.Double_NE:
                case TileType.Double_NW:
                    return true;
                default:
                    return false;
            }
        }

        sourcesConnect(t1:Tile, t2:Tile) : boolean {

            if(t1.groupIndex != t2.groupIndex)
                return false;

            switch(t1.type) {
                case TileType.Source:
                case TileType.DoubleSource:
                    return t2.type == TileType.Source || t2.type == TileType.DoubleSource;
                case TileType.Blockade:
                case TileType.Trash:
                    return t1.type == t2.type;
            }
            return false;
        }

        connectsToType(row:number, col:number, dir:Direction, root:Tile) : Tile {

            var tile = this.getTile(row, col);
            if(tile == null)
                return null;
            
            if(this.isSourceType(tile.type)) {
                if(this.sourcesConnect(root, tile)) {
                    tile.setStateFromDirection(dir, CircuitState.Circuit);
                    return tile;
                }
                else
                    return null;
            }

            //other type of tile...
            var nextDir = tile.getNextDirection(dir);
            var coord = new PIXI.Point(row, col);
            this.stepCoord(coord, nextDir);

            if(this.connects(coord.x, coord.y, nextDir)) {
                var goalTile = this.connectsToType(coord.x, coord.y, nextDir, root);
                if(goalTile != null) {
                    tile.setStateFromDirection(dir, CircuitState.Circuit);
                    return goalTile;
                }
            }
            
            return null;
        }

        loopsToTile(row:number, col:number, dir:Direction, root:Tile, rootDir:Direction) : boolean {

            var tile = this.getTile(row, col);
            if(tile == null)
                return false;

            var nextDir = tile.getNextDirection(dir);
            if(tile == root && nextDir == rootDir) {
                //full circle!
                tile.setStateFromDirection(dir, CircuitState.Circuit);
                return true;
            }

            var coord = new PIXI.Point(row, col);
            this.stepCoord(coord, nextDir);
            if(this.connects(coord.x, coord.y, nextDir)) {
                if(this.loopsToTile(coord.x, coord.y, nextDir, root, rootDir)) {
                    tile.setStateFromDirection(dir, CircuitState.Circuit);
                    return true;
                }
            }

            return false;
        }

        hasElement(tiles:Tile[], tile:Tile) : boolean {
            for(var i:number=0; i<tiles.length; ++i) {
                if(tiles[i] == tile)
                    return true;
            }
            return false;
        }

        clearTrashAdjacentToCircuits(discardTiles:Tile[]) {
            for(var i:number=0; i<this.rows; ++i) {
                for(var j:number=0; j<this.columns; ++j) {
                    var tile = this.getTile(i, j);
                    if(tile == null)
                        continue;

                    if(tile.type != TileType.Trash || tile.hasCircuit())
                        continue;

                    var adjacentToCircuit = false;

                    var di = 0;
                    var dj = 1;
                    for(var nIdx:number=0; nIdx<4 && !adjacentToCircuit; ++nIdx) {
                        var neighbor = this.getTile(i + di, j + dj);
                        if(neighbor != null) {
                            if(neighbor.hasCircuit() && neighbor.type != TileType.Trash)
                                adjacentToCircuit = true;
                        }

                        var cpy = di;
                        di = -dj;
                        dj = cpy;
                    }

                    if(adjacentToCircuit) {
                        discardTiles.push(tile);
                        tile.setState(TileState.Disappearing);
                        this.slots[i][j] = null;
                    }
                }
            }
        }

        propagateCircuits() {

            let clearPropState = function(caller:CircuitDetector, i:number, j:number, tile:Tile) { tile.clearCircuitState(); }
            this.performFunctionOnTiles(clearPropState);

            let pushSource = function(caller:CircuitDetector, i:number, j:number, tile:Tile) { 
                if(caller.isSourceType(tile.type)) {
                    var goalTiles:Tile[] = [];
                    for(var dirIdx=0; dirIdx<4; ++dirIdx) {
                        var coord = new PIXI.Point(i, j);
                        caller.stepCoord(coord, dirIdx);
                        if(caller.connects(coord.x, coord.y, dirIdx)) {
                            //make sure the adjacent tile-type is not already the source type:
                            if(caller.sourcesConnect(caller.slots[coord.x][coord.y], tile))
                                continue;

                            var goalTile = caller.connectsToType(coord.x, coord.y, dirIdx, tile);
                            let hasTile = caller.hasElement(goalTiles, goalTile);
                            if(goalTile != null && !hasTile)
                                goalTiles.push(goalTile);
                        }
                    }

                    tile.sourceHitCount = goalTiles.length;
                    if(goalTiles.length > 0)
                        tile.setStateFromDirection(Direction.Up, CircuitState.Circuit);
                }
            }
            this.performFunctionOnTiles(pushSource);


            //also look for loops:
            let gatherLoops = function(caller:CircuitDetector, i:number, j:number, tile:Tile) { 
                if(caller.isPathType(tile.type)) {
                    var dirs:Direction[] = [];
                    tile.getOutwardDirectionsWithState(dirs, CircuitState.None);
                    for(var dirIdx:number=0; dirIdx<dirs.length-1; dirIdx += 2) {
                        let dir = dirs[dirIdx];
                        var coord = new PIXI.Point(i, j);
                        caller.stepCoord(coord, dir);
                        if(caller.connects(coord.x, coord.y, dir)) {
                            caller.loopsToTile(coord.x, coord.y, dir, tile, dir);
                        }
                    }
                }
            }
            this.performFunctionOnTiles(gatherLoops);
        }

        breaksCircuit(row:number, column:number, dir:Direction) : boolean {
            if(row < 0 || row >= this.rows || column < 0 || column >= this.columns)
                return true;
            var tile = this.slots[row][column];
            if(tile == null)
                return false;

            //any source type breaks the circuit, when we are looking for deadlocks:
            if(this.isSourceType(tile.type))
                return true;

            return !tile.connects(dir);
        }

        connectsToDeadlock(row:number, col:number, dir:Direction) : boolean {

            if(this.breaksCircuit(row, col, dir))
                return true;

            var tile = this.getTile(row, col);
            if(tile == null)
                return false;

            //other type of tile...
            var nextDir = tile.getNextDirection(dir);
            var coord = new PIXI.Point(row, col);
            this.stepCoord(coord, nextDir);

            if(this.connectsToDeadlock(coord.x, coord.y, nextDir)) {
                tile.setStateFromDirection(dir, CircuitState.DeadLock);
                return true;
            }
            
            return false;
        }

        traverseDegrade(row:number, col:number, dir:Direction) {

            var tile = this.getTile(row, col);
            if(tile == null)
                return;

            if(this.breaksCircuit(row, col, dir) || !tile.directionIntoState(dir, CircuitState.DeadLock))
                return;

            let nextDir = tile.getNextDirection(dir);
            var coord = new PIXI.Point(row, col);
            this.stepCoord(coord, nextDir);
            this.traverseDegrade(coord.x, coord.y, nextDir);
            tile.partialDegrade(dir);
        }

        degradeDeadlock(row:number, col:number) {
            var tile = this.getTile(row, col);
            if(tile == null)
                return;
            if(!tile.hasDeadlock())
                return;

            var dirs:Direction[] = [];
            tile.getOutwardDirectionsWithState(dirs, CircuitState.DeadLock);
            for(var i:number=0; i<dirs.length; ++i) {
                var coord = new PIXI.Point(row, col);
                let dir = dirs[i];
                this.stepCoord(coord, dir);
                this.traverseDegrade(coord.x, coord.y, dir);
            }
            
            tile.degrade();
        }

        getOppositeDir(dir:Direction) : Direction {
            switch(dir) {
                case Direction.Down:
                    return Direction.Up;
                case Direction.Up:
                    return Direction.Down;
                case Direction.Left:
                    return Direction.Right;
                case Direction.Right:
                    return Direction.Left;
            }
        }

        findDeadlocks() {

            let clearPropState = function(caller:CircuitDetector, i:number, j:number, tile:Tile) { tile.clearCircuitState(); }
            this.performFunctionOnTiles(clearPropState);

            let assignDeadlocks = function(caller:CircuitDetector, i:number, j:number, tile:Tile) { 

                if(caller.isPathType(tile.type)) {
                    var dirs:Direction[] = [];
                    tile.getOutwardDirections(dirs);
                    for(var dIdx=0; dIdx<dirs.length - 1; dIdx += 2) {

                        var dir = dirs[dIdx];
                        var seekDir = dirs[dIdx + 1];

                        var coord = new PIXI.Point(i, j);
                        caller.stepCoord(coord, dir);
                        if(!caller.breaksCircuit(coord.x, coord.y, dir)) {
                            //try other direction:
                            coord = new PIXI.Point(i, j);
                            caller.stepCoord(coord, seekDir);
                            if(!caller.breaksCircuit(coord.x, coord.y, seekDir)) {
                                //this is not the end-point of a deadlock, so skip this one:
                                continue;
                            }

                            //swap seek direction:
                            let tmp = seekDir;
                            seekDir = dir;
                            dir = tmp;
                        }

                        coord = new PIXI.Point(i, j);
                        caller.stepCoord(coord, seekDir);

                        if(caller.connectsToDeadlock(coord.x, coord.y, seekDir))
                            tile.setStateFromDirection(caller.getOppositeDir(dir), CircuitState.DeadLock);
                    }
                }
            }

            this.performFunctionOnTiles(assignDeadlocks);


            let showDeadlocks = function(caller:CircuitDetector, i:number, j:number, tile:Tile) { 
                tile.redraw();
            }
            this.performFunctionOnTiles(showDeadlocks);
        }
    }
}