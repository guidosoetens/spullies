///<reference path="../../phaser/phaser.d.ts"/>

module BlokjesGame
{
    const rows:number = 12;
    const columns:number = 6;
    const colorCodes:number[] = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];//, 0x00ffff];
    const tickCount:number = 2;
    const gridWidth:number = 40;
    const neighbourDeltaIndices:number[][] = [[0,1], [1,0], [0,-1], [-1,0]]; //(right, bottom, left, top) [row][column] - format
    
    const GAMESTATE_PLAYING:number = 0;
    const GAMESTATE_REMOVING:number = 1;
    const GAMESTATE_DROPPING:number = 2;
    
    export class BlobTuple {
        blob1:Blob;
        blob2:Blob;
        
        private _orientation:number = 0;
        
        row:number;
        column:number;
        
        get row2():number {
            return this.row + neighbourDeltaIndices[this.orientation][0];
        }
        
        get column2():number {
            return this.column + neighbourDeltaIndices[this.orientation][1];
        }
        
        get orientation():number {
            return this._orientation;
        }
        set orientation(value:number) {
            value = Math.round(value);
            if(value < 0)
                value += 4;
            value = value % 4;
            this._orientation = value;
        }
        
        constructor(blob1:Blob, blob2:Blob) {
            this.blob1 = blob1;
            this.blob2 = blob2;
            this.orientation = 0;
            this.row = -1;
            this.column = columns / 2 - 1;
        }
        
        render(graphics:Phaser.Graphics, x:number, y:number) {
            this.blob1.render(graphics, x, y, 1);
            var diffIndices:number[] = neighbourDeltaIndices[this.orientation];
            this.blob2.render(graphics, x + diffIndices[1] * gridWidth, y + diffIndices[0] * gridWidth, 1);
        }
    }
    
    export class Blob {
        
        private dxs:number[] = [gridWidth / 3,0,-gridWidth / 3,0];
        private dys:number[] = [0,gridWidth / 3,0,-gridWidth / 3];
        
        typeIndex:number;
        removing:boolean;
        testSource:Blob;
        chainedToNeighbor:boolean[];
        dropping:boolean;
        dropFromRow:number;
        
        constructor(typeIndex:number) {
            this.typeIndex = typeIndex;
            this.removing = false;
            this.testSource = null;
            this.chainedToNeighbor = [false, false, false, false];
            this.dropping = false;
            this.dropFromRow = 0;
        }
        
        render(graphics:Phaser.Graphics, x:number, y:number, alphaParameter:number) {
            
            var alpha:number = this.removing ? (1.0 - alphaParameter) : 1.0;
            
            var color:number = colorCodes[this.typeIndex];
            graphics.lineStyle(0);
            graphics.beginFill(color, alpha);
            graphics.drawCircle(x, y, gridWidth);
            graphics.endFill();
            
            for(var i:number=0; i<4; ++i) {
                if(this.chainedToNeighbor[i]) {
                    
                    graphics.lineStyle(1, 0x0, 1 * alpha);
                    graphics.beginFill(0xffffff, 0.8 * alpha);
                    graphics.drawCircle(x + this.dxs[i], y + this.dys[i], 5);
                    graphics.endFill();
                }
            }
        }
    }
    
    export class GameRunningState extends Phaser.State {
        constructor() {
            super();
        }
        
        cursors: Phaser.CursorKeys;
        graphics: Phaser.Graphics;
        slots:Blob[][];
        tickParameter:number;
        
        nextBlob:BlobTuple;
        playerBlob:BlobTuple;
        playerCurrentTick:number;
        
        gameState:number;
        gameStateParameter:number;
        
        preload() {
             this.game.load.audio("backgroundMusic", ["music2.mp3"]);
             this.game.load.image("button", "../../assets/sprites/mushroom2.png", false);
        }
        
        create() {
            
            this.tickParameter = 0;
            
            //init graphics:
            this.graphics = this.game.add.graphics(0, 0);
            
            //register keyboard events:
            this.cursors = this.game.input.keyboard.createCursorKeys();
            var keys = [Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.DOWN];
            var listeners = [this.moveLeft, this.moveRight, this.rotate, this.moveDown];
            for(var i:number = 0; i<3; ++i) {
                var key = this.game.input.keyboard.addKey(keys[i]);
                key.onDown.add(listeners[i], this);   
            }
           
            //register mouse/touch events:
            this.input.addMoveCallback(this.onMouseMove, this);
            this.input.onDown.add(this.onMouseDown, this);
            
            //reset button:
            //this.game.load.image("button", "../../assets/sprites/mushroom2.png", false);
            this.game.add.button(0, 0, "button", () => { this.resetGame(); }, this);
            
            var sound = this.game.add.audio('backgroundMusic');
            //sound.play('', 0, 1, true);
            
            this.resetGame();
        }
        
        createRandomBlob() : Blob {
            return new Blob(this.game.rnd.integerInRange(0,colorCodes.length - 1));
        }
        
        createRandomBlobTuple() : BlobTuple {
            return new BlobTuple(this.createRandomBlob(), this.createRandomBlob());
        }
        
        canPlayerBlobMoveToSlot(row:number, col:number):boolean {
            if(col < 0 || col >= columns || row >= rows)
                return false;
            if(row < 0)
                return true;
            return this.slots[row][col] == null;
        }
        
        isValidSlotIndex(i:number, j:number):boolean {
             if(i < 0 || i >= rows || j < 0 || j >= columns)
                return false;
             return true;
        }
        
        resetGame() {
            
            //set default layout:
            this.slots = [];
            for(var i:number=0; i<rows; ++i) {
                this.slots[i] = [];
                for(var j:number=0; j<columns; ++j) {
                    this.slots[i][j] = i > rows - 3 ? this.createRandomBlob() : null;
                }
            }
            
            this.nextBlob = this.createRandomBlobTuple();
            
            this.dropStructure();
        }
        
        onMouseMove() {
            
        }
        
        onMouseDown() {
            
        }
        
        moveDown() {
            if(this.gameState == GAMESTATE_PLAYING)
                this.tickDown();
        }
        
        moveLeft() {
            
             if(this.gameState == GAMESTATE_PLAYING) {
                if(this.canPlayerBlobMoveToSlot(this.playerBlob.row, this.playerBlob.column - 1) 
                && this.canPlayerBlobMoveToSlot(this.playerBlob.row2, this.playerBlob.column2 - 1))
                    this.playerBlob.column--;
                 
             }
        }
        
        moveRight() {
            
            if(this.gameState == GAMESTATE_PLAYING) {
                if(this.canPlayerBlobMoveToSlot(this.playerBlob.row, this.playerBlob.column + 1) 
                && this.canPlayerBlobMoveToSlot(this.playerBlob.row2, this.playerBlob.column2 + 1))
                    this.playerBlob.column++;
            }
        }
        
        rotate() {
            
            if(this.gameState == GAMESTATE_PLAYING) {
            
                var col:number = this.playerBlob.column;
                var row:number = this.playerBlob.row;
                var orientation = this.playerBlob.orientation;
                
                this.playerBlob.orientation++;
                
                if(!this.canPlayerBlobMoveToSlot(this.playerBlob.row2, this.playerBlob.column2)) {
                    
                    //translate main blob to make rotation legal:
                    var deltaIndices:number[] = neighbourDeltaIndices[this.playerBlob.orientation];
                    this.playerBlob.row -= deltaIndices[0];
                    this.playerBlob.column -= deltaIndices[1];
                    
                    if(!this.canPlayerBlobMoveToSlot(this.playerBlob.row, this.playerBlob.column)) {
                        
                        //rotation seems to be illegal -> revert to original state:
                        this.playerBlob.row = row;
                        this.playerBlob.column = col;
                        this.playerBlob.orientation = orientation;
                    }
                    else if(deltaIndices[0] == 1) {
                        //note: in this case, the blob was pushed upwards, so adjust the current 'tick' accordingly...
                        this.playerCurrentTick = tickCount;
                    }
                }
            }
        }
        
        tickDown() {
            this.tickParameter--;
            this.playerCurrentTick++;
            if(this.playerCurrentTick > tickCount) {
                
                if(this.canPlayerBlobMoveToSlot(this.playerBlob.row + 1, this.playerBlob.column) && this.canPlayerBlobMoveToSlot(this.playerBlob.row2 + 1, this.playerBlob.column2)) {
                    //player blob tuple can move down:
                    this.playerCurrentTick = 0;
                    this.playerBlob.row++;
                }
                else {
                    //stop player blob tuple:
                    this.slots[Math.max(0,this.playerBlob.row)][this.playerBlob.column] = this.playerBlob.blob1;
                    this.slots[Math.max(0,this.playerBlob.row2)][this.playerBlob.column2] = this.playerBlob.blob2;
                    
                    this.dropStructure();
                    
                    //this.dropNewBlock();
                }
            }
        }
        
        dropStructure() {
            
            var dropping:boolean = false;
            
            //resolve per column:
            for(var j:number=0; j<columns; ++j) {
                var foundFirstEmptySlot:boolean = false;
                var nextEmptyIndex:number = 0;
                
                //bottom up:
                for(var i:number=rows-1; i>=0; i--) {
                    
                    var blob:Blob = this.slots[i][j];
                    
                    if(blob == null) {
                        if(!foundFirstEmptySlot) {
                            foundFirstEmptySlot = true;
                            nextEmptyIndex = i;
                        }
                    }
                    else {
                        if(foundFirstEmptySlot) {
                            //drop down:
                            blob.dropping = true;
                            blob.dropFromRow = i;
                            
                            this.slots[nextEmptyIndex][j] = blob;
                            this.slots[i][j] = null;
                            nextEmptyIndex--;
                            dropping = true;
                        }
                        else
                            blob.dropping = false;
                    }
                }
            }
            
            if(dropping) {
                this.gameState = GAMESTATE_DROPPING;
                this.gameStateParameter = 0;
            } else {
                this.resolveChains();
            }
        }
        
        getConnectedElements(startRow:number, startColumn:number):Blob[] {
            
            var queue:Blob[] = [];
            var queueIndices:number[][] = [];
            
            var srcBlob:Blob = this.slots[startRow][startColumn];
            srcBlob.testSource = srcBlob;
            queue[0] = srcBlob;
            queueIndices[0] = [startRow, startColumn];
            
            var queueIdx:number = 0;
            
            while(queueIdx < queue.length) {
                
                var i:number = queueIndices[queueIdx][0];
                var j:number = queueIndices[queueIdx][1];
                var blob:Blob = queue[queueIdx];
                
                //traverse neighbors:
                for(var n:number=0; n<4; ++n) {
                    var ni = i + neighbourDeltaIndices[n][0];
                    var nj = j + neighbourDeltaIndices[n][1];
                    
                    if(this.isValidSlotIndex(ni, nj)) {
                        
                        var nBlob:Blob = this.slots[ni][nj];
                        if(nBlob != null && nBlob.testSource != srcBlob && nBlob.typeIndex == srcBlob.typeIndex) {
                            //chained element found!
                            var nIdx = queue.length;
                            queue[nIdx] = nBlob;
                            queueIndices[nIdx] = [ni, nj];
                            nBlob.testSource = srcBlob;
                        }
                    }
                }
                
                queueIdx++;
            }
            
            
            return queue;
        }
        
        resolveChains() {
            
            var foundChains:boolean = false;
            
            //unlink everything:
            for(var i:number=0; i<rows; ++i) {
                for(var j:number=0; j<columns; ++j) {
                    var blob:Blob = this.slots[i][j];
                    if(blob != null) {
                        blob.removing = false;
                        blob.testSource = null;
                    }
                }
            }
            
            for(var i:number=0; i<rows; ++i) {
                for(var j:number=0; j<columns; ++j) {
                    
                    var blob:Blob = this.slots[i][j];
                    if(blob != null) {
                        
                        //find connections to neighbors:
                        for(var n:number=0; n<4; ++n) {
                            var ni = i + neighbourDeltaIndices[n][0];
                            var nj = j + neighbourDeltaIndices[n][1];
                            
                            if(this.isValidSlotIndex(ni, nj)) {
                                var nBlob = this.slots[ni][nj];
                                blob.chainedToNeighbor[n] = (nBlob != null && blob.typeIndex == nBlob.typeIndex);
                            }
                            else {
                                blob.chainedToNeighbor[n] = false;
                            }
                        }
                        
                        //test if blob should be removed:
                        if(!blob.removing && blob.testSource == null) {
                            var chain:Blob[] = this.getConnectedElements(i, j);
                            
                            if(chain.length >= 4) {
                                chain.forEach((b:Blob) => {b.removing = true;});
                                foundChains = true;
                            }
                        }
                    }
                }
            }
            
            if(foundChains) {
                //resolve chains...
                this.gameState = GAMESTATE_REMOVING;
                this.gameStateParameter = 0;
            }
            else {
                //continue game...
                this.dropNewBlobTuple();
            }
        }
        
        dropNewBlobTuple() {
            this.playerCurrentTick = 0;
            this.playerBlob = this.nextBlob;
            this.nextBlob = this.createRandomBlobTuple();
            this.gameState = GAMESTATE_PLAYING;
            this.gameStateParameter = 0;
        }

        update() {
            
            var dt:number = this.game.time.physicsElapsed;
            
            switch(this.gameState) {
                case GAMESTATE_PLAYING:
                {
                    const speedUp:boolean = this.cursors.down.isDown;
            
                    this.tickParameter += (speedUp ? 30 : 1) * dt;
                    if(this.tickParameter > 1)
                        this.tickDown();
                
                    break;
                }
                case GAMESTATE_DROPPING:
                {
                    this.gameStateParameter += 2 * dt;
                    if(this.gameStateParameter > 1) {
                        
                        //after drop, always resolve potential new chain:
                        this.resolveChains();
                    }
                    
                    break;
                }
                case GAMESTATE_REMOVING:
                {
                    this.gameStateParameter += dt;
                    if(this.gameStateParameter > 1) {
                        
                        //remove 'removing' blobs from slots:
                        for(var i:number=0; i<rows; ++i) {
                            for(var j:number=0; j<columns; ++j) {
                                var b:Blob = this.slots[i][j];
                                if(b != null && b.removing)
                                    this.slots[i][j] = null;
                            }
                        }
                        
                        //after resolving chains, do a new drop:
                        this.dropStructure();
                    }
                    
                    break;
                }
            }
        }

        render() {
            
            this.graphics.clear();
            
            var srcX:number = (this.game.width - columns * gridWidth) * 0.5;
            var srcY:number = (this.game.height - rows * gridWidth) * 0.5;
            
            var gridTop:number = 0;
            var gridLeft:number = 0;
            var color:number = 0x0;
            
            var resolveAlphaFactor:number = this.gameState == GAMESTATE_REMOVING ? this.gameStateParameter : 1;
            
            for(var i:number=0; i<rows; ++i) {
                
                gridTop = srcY + i * gridWidth;
                
                for(var j:number=0; j<columns; ++j) {
                    
                    gridLeft = srcX + j * gridWidth;
                    
                    this.graphics.lineStyle(1, 0xaaaaaa, 1);
                    this.graphics.drawRect(gridLeft, gridTop, gridWidth, gridWidth);
                    this.graphics.lineStyle(0);
                    
                    var blob:Blob = this.slots[i][j];
                    if(blob != null) {
                        
                        var y:number = gridTop;
                        if(this.gameState == GAMESTATE_DROPPING && blob.dropping) {
                            
                            var totalDrop:number = i - blob.dropFromRow;
                            var dropIdx:number = blob.dropFromRow + totalDrop * (1 - Math.cos(this.gameStateParameter * .5 * Math.PI));
                            y = srcY + dropIdx * gridWidth;
                        }
                        
                        blob.render(this.graphics, gridLeft + gridWidth / 2, y + gridWidth / 2, resolveAlphaFactor);
                    }
                }
            }
            
            //render next blob:
            var nextX:number = this.game.width / 2 + gridWidth * columns / 2 + 50;
            var nextY:number = this.game.height / 2 - gridWidth * rows / 2;
            this.graphics.lineStyle(1, 0xaaaaaa, 1);
            this.graphics.drawRoundedRect(nextX, nextY, 100, 100, 20);
            this.nextBlob.render(this.graphics, nextX + 50 - gridWidth / 2, nextY + 50);
            
            //render player blob:
            if(this.gameState == GAMESTATE_PLAYING) {
                gridTop = srcY + (this.playerBlob.row - 1 + (this.playerCurrentTick + 1) / (tickCount + 1)) * gridWidth;
                gridLeft = srcX + this.playerBlob.column * gridWidth;
                this.playerBlob.render(this.graphics, gridLeft + gridWidth / 2, gridTop + gridWidth / 2);
                this.graphics.lineStyle(2, 0xffffff, .5);
                this.graphics.drawRoundedRect(gridLeft, gridTop, gridWidth, gridWidth, 10);   
                
                this.game.debug.text("ROW: " + this.playerBlob.row.toString(), 0, 50);
                this.game.debug.text("TICK: " + this.playerCurrentTick.toString(), 0, 100);
            }
        }
    }
}