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

        // performFunctionOnBorderTiles(f:Function) {
        //     var dirs:Direction[] = [Direction.Right, Direction.Down, Direction.Left, Direction.Up];
        //     for(var sideIdx:number=0; sideIdx<4; ++sideIdx) {
        //         let dir = dirs[sideIdx];
        //         var row:number = sideIdx < 2 ? -1 : this.rows;
        //         var col:number = sideIdx < 2 ? -1 : this.columns;
        //         var travRow = sideIdx % 2 == 0;
        //         var its = travRow ? this.rows : this.columns;
        //         for(var i:number=0; i<its; ++i) {
        //             if(travRow)
        //                 row = i;
        //             else col = i;
        //             var n = new PIXI.Point(row, col);
        //             this.stepCoord(n, dir);
        //             var tile = this.slots[n.x][n.y];
        //             if(tile != null) {
        //                 if(this.connects(n.x, n.y, dir) && this.isPathType(tile.type))
        //                     f(this, n.x, n.y, tile, dir);
        //             }
        //         }
        //     }
        // }

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
                case TileType.TripleSource:
                case TileType.Wildcard:
                case TileType.BombSource:
                // case TileType.Trash:
                    return true;
                default:
                    return false;
            }
        }

        isPathType(type:TileType) {
            return type == TileType.Path;
        }

        sourcesConnect(t1:Tile, t2:Tile) : boolean {
            if(!this.isSourceType(t1.type) || !this.isSourceType(t2.type))
                return false;
            if(t1.type == TileType.Wildcard || t2.type == TileType.Wildcard)
                return true;
            return t1.groupIndex == t2.groupIndex;
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

                    for(var dir:number=0; dir<6 && !adjacentToCircuit; ++dir) {
                        var coord = new PIXI.Point(i, j);
                        this.stepCoord(coord, dir);

                        var neighbor = this.getTile(coord.x, coord.y);
                        if(neighbor != null) {
                            if(neighbor.hasCircuit() && neighbor.circuitEliminatesTile() && neighbor.type != TileType.Trash)
                                adjacentToCircuit = true;
                        }
                    }

                    if(adjacentToCircuit) {
                        discardTiles.push(tile);
                        tile.setState(TileState.Disappearing);
                        this.slots[i][j] = null;
                    }
                }
            }
        }

        coordOutOfBounds(i:number, j:number) : boolean {
            if(i < 0 || i >= this.rows)
                return true;
            else if(j < 0 || j >= this.columns)
                return true;
            return false;
        }

        propagateCircuits() {

            let clearPropState = function(caller:CircuitDetector, i:number, j:number, tile:Tile) { tile.clearCircuitState(); }
            this.performFunctionOnTiles(clearPropState);

            /*
            let pushBorderTiles = function(caller:CircuitDetector, i:number, j:number, tile:Tile, dir:Direction) : boolean {

                var isCircuit = false;
                if(tile.type == TileType.Trash) {
                    isCircuit = true;
                }
                else if(caller.isPathType(tile.type)) {
                    //continue propagation:
                    var nextDir = tile.getNextDirection(dir);
                    var coord = new PIXI.Point(i, j);
                    caller.stepCoord(coord, nextDir);

                    if(caller.coordOutOfBounds(coord.x, coord.y)) {
                        isCircuit = true;
                    }
                    else {
                        var nextTile = caller.getTile(coord.x, coord.y);
                        if(nextTile != null) {
                            if(nextTile.connects(nextDir)) {
                                isCircuit = pushBorderTiles(caller, coord.x, coord.y, nextTile, nextDir);
                            }
                        }
                    }

                }

                if(isCircuit)
                    tile.setStateFromDirection(dir, CircuitState.Circuit);
                return isCircuit;
            }
            this.performFunctionOnBorderTiles(pushBorderTiles);
            */

            let pushSource = function(caller:CircuitDetector, i:number, j:number, tile:Tile) { 
                if(caller.isSourceType(tile.type)) {
                    var goalTiles:Tile[] = [];
                    for(var dirIdx=0; dirIdx<6; ++dirIdx) {
                        var coord = new PIXI.Point(i, j);
                        caller.stepCoord(coord, dirIdx);
                        if(caller.connects(coord.x, coord.y, dirIdx)) {
                            //make sure the adjacent tile-type is not already the source type:
                            if(caller.sourcesConnect(caller.slots[coord.x][coord.y], tile))
                                continue;

                            var goalTile = caller.connectsToType(coord.x, coord.y, dirIdx, tile);
                            let hasTile = caller.hasElement(goalTiles, goalTile);
                            if(goalTile != null && !hasTile) {
                                goalTiles.push(goalTile);
                            }
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
                            tile.setStateFromDirection(getOppositeDir(dir), CircuitState.DeadLock);
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