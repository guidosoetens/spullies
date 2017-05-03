///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Block.ts"/>

module CircuitGame
{
    const GAMESTATE_PLAYING:number = 0;
    const GAMESTATE_REMOVING:number = 1;
    const GAMESTATE_DROPPING:number = 2;
    
    export class GameState extends Phaser.State {
        constructor() {
            super();
        }
        
        cursors: Phaser.CursorKeys;
        graphics: Phaser.Graphics;
        gridGraphics:Phaser.Graphics;
        blocksGraphics:Phaser.Graphics;
        slots:Block[][];
        tickParameter:number;

        playerBlockColumn:number;
        playerBlockRow:number;
        
        nextBlock:Block;
        playerBlock:Block;
        playerCurrentTick:number;
        totalRowsDrop:number;
        playerFracColumnBuffer:number;
        punishmentPending:boolean;
        
        gameState:number;
        gameStateParameter:number;
    
        preload() {
             this.game.load.audio("backgroundMusic", ["assets/music.mp3"]);
             this.game.load.image("button", "../../assets/sprites/mushroom2.png", false);
             this.game.load.shader("blobShader", 'assets/blobShader.frag');
             this.game.load.image('blokje', "assets/blokje.png");
             this.game.load.image('galaxy', "assets/galaxy.jpg");
             this.game.load.image('noise', "assets/noise.jpg");
        }
        
        create() {
            
            this.tickParameter = 0;
            this.totalRowsDrop = 0;
           
            //set component containers:
            var bg = this.game.add.sprite(0,0,'galaxy');
            bg.width = this.game.width;
            bg.height = this.game.height;
            bg.alpha = .8;
            
            this.gridGraphics = this.game.add.graphics(0,0);
            this.gridGraphics.lineStyle(1, 0x777777);
            this.gridGraphics.beginFill(0x0, .3);
            var srcX:number = (this.game.width - COLUMNCOUNT * GRIDWIDTH) * 0.5;
            var srcY:number = (this.game.height - VISIBLEROWCOUNT * GRIDWIDTH) * 0.5;
            for(var i:number=0; i<ROWCOUNT; ++i) {
                var gridTop = srcY + (i - TOPROWCOUNT) * GRIDWIDTH;
                
                for(var j:number=0; j<COLUMNCOUNT; ++j) {
                    
                    var gridLeft = srcX + j * GRIDWIDTH;
                    
                    if(i >= TOPROWCOUNT) {
                        this.gridGraphics.drawRoundedRect(gridLeft, gridTop, GRIDWIDTH, GRIDWIDTH, 5);
                    }
                }
            }

            this.blocksGraphics = this.game.add.graphics(0,0);
            
            /*
            var bmd = this.game.add.bitmapData(this.game.width, this.game.height);
            bmd.fill(255,0,0);
            bmd.addToWorld();
            bmd.draw(this.gridGraphics, 0, 0, this.game.width, this.game.height);
            */
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
            
            var sound = this.game.add.audio('backgroundMusic');
            //sound.play('', 0, .2, true);
            
            this.resetGame();
        }
        
        createRandomBlock() : Block {
            var b:Block = new Block(this.game);
            //this.blobsContainer.add(b);
            b.typeIndex = this.game.rnd.integerInRange(0, COLORCODES.length - 1);
            return b;
            //return new Blob(this.game.rnd.integerInRange(0,colorCodes.length - 1));
        }
        
        createBlockingBlock() : Block {
            var b:Block = new Block(this.game);
            //this.blobsContainer.add(b);
            b.isBlocking = true;
            return b;
        }
        
        canPlayerBlockMoveToSlot(row:number, col:number):boolean {
            if(col < 0 || col >= COLUMNCOUNT || row >= ROWCOUNT)
                return false;
            if(row < 0)
                return true;
            return this.slots[row][col] == null;
        }
        
        isValidSlotIndex(i:number, j:number):boolean {
             if(i < 0 || i >= ROWCOUNT || j < 0 || j >= COLUMNCOUNT)
                return false;
             return true;
        }
        
        resetGame() {
            
            //set default layout:
            this.slots = [];
            //this.blobsContainer.removeAll();
            for(var i:number=0; i<ROWCOUNT; ++i) {
                this.slots[i] = [];
                for(var j:number=0; j<COLUMNCOUNT; ++j) {
                    this.slots[i][j] = i > ROWCOUNT - 3 ? this.createRandomBlock() : null;
                }
            }
            
            this.nextBlock = this.createRandomBlock();
            
            this.punishmentPending = false;
            
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
                if(this.canPlayerBlockMoveToSlot(this.playerBlockRow, this.playerBlockColumn - 1))
                    this.playerBlockColumn--;
                 
             }
        }
        
        moveRight() {
            
            if(this.gameState == GAMESTATE_PLAYING) {
                if(this.canPlayerBlockMoveToSlot(this.playerBlockRow, this.playerBlockColumn + 1))
                    this.playerBlockColumn++;
            }
        }
        
        rotate() {
            
            if(this.gameState == GAMESTATE_PLAYING) {
                var col:number = this.playerBlockColumn;
                var row:number = this.playerBlockRow;
                this.playerBlock.flips++;
            }
        }
        
        tickDown() {
            this.tickParameter--;
            this.playerCurrentTick++;
            
            if(this.playerCurrentTick > TICKCOUNT) {
                
                if(this.canPlayerBlockMoveToSlot(this.playerBlockRow + 1, this.playerBlockColumn)) {
                    //player blob tuple can move down:
                    this.playerCurrentTick = 0;
                    this.playerBlockRow++;
                }
                else {
                    //stop player blob tuple:
                    this.slots[Math.max(0,this.playerBlockRow)][this.playerBlockColumn] = this.playerBlock;
                    //this.slots[Math.max(0,this.playerBlob.row2)][this.playerBlob.column2] = this.playerBlob.blob2;
                    
                    this.dropStructure();
                    
                    //this.dropNewBlock();
                }
            }
        }
        
        pushPunishment() {
            
            //just to be safe: 
            if(TOPROWCOUNT <= 0)
                return;
            
            var randomFrac:number = this.game.rnd.frac();
            
            if(randomFrac < .75) {
                //75% chance that nothing happens...
            }
            else if(randomFrac < .9) {
                //15% chance that a single block drops 
                var columnIdx:number = this.game.rnd.integerInRange(0, COLUMNCOUNT - 1);
                if(this.slots[0][columnIdx] == null)
                    this.slots[0][columnIdx] = this.createBlockingBlock();
            }
            else if(randomFrac < .975) {
                //7.5% chance that a single row of blocks drops
                for(var j:number=0; j<COLUMNCOUNT; ++j)
                {
                    if(this.slots[0][j] == null)
                        this.slots[0][j] = this.createBlockingBlock();
                }
            }
            else {
                //2.5% chance that {MIN (3) and (number of top rows)} rows of blocks drop:
                var punishRows:number = Math.min(3, TOPROWCOUNT);
                for(var i:number=0; i<punishRows; ++i) {
                    for(var j:number=0; j<COLUMNCOUNT; ++j)
                    {
                        if(this.slots[i][j] == null)
                            this.slots[i][j] = this.createBlockingBlock();
                    }
                }
            }
            
            this.dropStructure();
        }
        
        dropStructure() {
            
            var dropping:boolean = false;
            this.totalRowsDrop = 0;
            
            //resolve per column:
            for(var j:number=0; j<COLUMNCOUNT; ++j) {
                var foundFirstEmptySlot:boolean = false;
                var nextEmptyIndex:number = 0;
                
                //bottom up:
                for(var i:number=ROWCOUNT-1; i>=0; i--) {
                    
                    var block:Block = this.slots[i][j];
                    
                    if(block == null) {
                        if(!foundFirstEmptySlot) {
                            foundFirstEmptySlot = true;
                            nextEmptyIndex = i;
                        }
                    }
                    else {
                        if(foundFirstEmptySlot) {
                            //drop down:
                            block.dropping = true;
                            block.dropFromRow = i;
                            
                            this.slots[nextEmptyIndex][j] = block;
                            this.slots[i][j] = null;
                            this.totalRowsDrop = Math.max(this.totalRowsDrop, nextEmptyIndex - i);
                            nextEmptyIndex--;
                            dropping = true;
                        }
                        else
                            block.dropping = false;
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
        
        getConnectedElements(startRow:number, startColumn:number):Block[] {
            
            var queue:Block[] = [];
            var queueIndices:number[][] = [];
            
            var srcBlock:Block = this.slots[startRow][startColumn];
            srcBlock.testSource = srcBlock;
            queue[0] = srcBlock;
            queueIndices[0] = [startRow, startColumn];
            
            var queueIdx:number = 0;
            
            while(queueIdx < queue.length) {
                
                var i:number = queueIndices[queueIdx][0];
                var j:number = queueIndices[queueIdx][1];
                var block:Block = queue[queueIdx];
                queueIdx++;
                
                if(block.isBlocking)
                    continue;
                
                //traverse neighbors:
                for(var n:number=0; n<4; ++n) {
                    var ni = i + NEIGHBORDELTAINDICES[n][0];
                    var nj = j + NEIGHBORDELTAINDICES[n][1];
                    
                    if(this.isValidSlotIndex(ni, nj)) {
                        
                        var nBlock:Block = this.slots[ni][nj];
                       
                        if(nBlock != null && nBlock.testSource != srcBlock && (nBlock.isBlocking || nBlock.typeIndex == srcBlock.typeIndex)) {
                            //chained element found!
                            var nIdx = queue.length;
                            queue[nIdx] = nBlock;
                            queueIndices[nIdx] = [ni, nj];
                            nBlock.testSource = srcBlock;
                        }
                    }
                }
            }
            
            
            return queue;
        }
        
        resolveChains() {
            
            var foundChains:boolean = false;
            
            //unlink everything:
            for(var i:number=0; i<ROWCOUNT; ++i) {
                for(var j:number=0; j<COLUMNCOUNT; ++j) {
                    var block:Block = this.slots[i][j];
                    if(block != null) {
                        block.removing = false;
                        block.testSource = null;
                    }
                }
            }
            
            for(var i:number=0; i<ROWCOUNT; ++i) {
                for(var j:number=0; j<COLUMNCOUNT; ++j) {
                    
                    var block:Block = this.slots[i][j];
                    if(block != null && !block.isBlocking) {
                        
                        //find connections to neighbors:
                        for(var n:number=0; n<4; ++n) {
                            var ni = i + NEIGHBORDELTAINDICES[n][0];
                            var nj = j + NEIGHBORDELTAINDICES[n][1];
                            
                            if(this.isValidSlotIndex(ni, nj)) {
                                var nBlob = this.slots[ni][nj];
                                block.chainedToNeighbor[n] = (nBlob != null && block.typeIndex == nBlob.typeIndex);
                            }
                            else {
                                block.chainedToNeighbor[n] = false;
                            }
                        }
                        
                        //test if blob should be removed:
                        if(!block.removing && block.testSource == null) {
                            var chain:Block[] = this.getConnectedElements(i, j);
                            
                            var coloredCount = 0;
                            chain.forEach((b:Block) => { if(!b.isBlocking) ++ coloredCount;});
                            
                            if(coloredCount >= 4) {
                                chain.forEach((b:Block) => {b.removing = true;});
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
                
                if(this.punishmentPending) {
                    this.punishmentPending = false;
                    this.pushPunishment();
                }
                else {
                    this.dropNewBlock();
                    this.punishmentPending = true;
                }
                
                //this.pushPunishment();
                //this.dropNewBlobTuple();
            }
        }
        
        dropNewBlock() {
            this.playerCurrentTick = 0;
            this.playerBlock = this.nextBlock;
            this.nextBlock = this.createRandomBlock();
            this.gameState = GAMESTATE_PLAYING;
            this.gameStateParameter = 0;

            this.playerBlockColumn = COLUMNCOUNT / 2 - 1;
            this.playerBlockRow = TOPROWCOUNT;

            this.playerFracColumnBuffer = this.playerBlockColumn;
            
            //test losing condition:
            if(this.slots[TOPROWCOUNT][this.playerBlockColumn])
            {
                //LOSE:
                this.resetGame();
            }
        }

        update() {
          
            var dt:number = this.game.time.physicsElapsed;
            
            switch(this.gameState) {
                case GAMESTATE_PLAYING:
                {
                    const speedUp:boolean = this.cursors.down.isDown;
            
                    this.tickParameter += (speedUp ? 45 : 2) * dt;
                    if(this.tickParameter > 1)
                        this.tickDown();
                
                    break;
                }
                case GAMESTATE_DROPPING:
                {
                    var dropDuration:number = 0.3 + this.totalRowsDrop * .05;
                    
                    this.gameStateParameter += dt / dropDuration;
                    if(this.gameStateParameter > 1) {
                        
                        //after drop, always resolve potential new chain:
                        this.resolveChains();
                    }
                    
                    break;
                }
                case GAMESTATE_REMOVING:
                {
                    this.gameStateParameter += 1.5 * dt;
                    if(this.gameStateParameter > 1) {
                        
                        //remove 'removing' blobs from slots:
                        for(var i:number=0; i<ROWCOUNT; ++i) {
                            for(var j:number=0; j<COLUMNCOUNT; ++j) {
                                var b:Block = this.slots[i][j];
                                if(b != null && b.removing) {
                                    this.slots[i][j] = null;
                                    b.destroy();
                                    //this.blobsContainer.remove(b);
                                }
                            }
                        }
                        
                        //after resolving chains, do a new drop:
                        this.dropStructure();
                    }
                    
                    break;
                }
            }
            
            //update graphics:
            
            this.drawBlocks();
        }
        
        drawBlocks() {
            
            var resolveAlphaFactor:number = this.gameState == GAMESTATE_REMOVING ? this.gameStateParameter : 1;

            this.blocksGraphics.clear();
            
            
            for(var i:number=0; i<ROWCOUNT; ++i) {
                
                for(var j:number=0; j<COLUMNCOUNT; ++j) {
                    
                    var block:Block = this.slots[i][j];
                    if(block != null) {
                        
                        var iIdx = i;
                        
                        if(this.gameState == GAMESTATE_DROPPING && block.dropping) {
                            
                            var totalDrop:number = i - block.dropFromRow;
                            var dropIdx:number = block.dropFromRow + totalDrop * (1 - Math.cos(this.gameStateParameter * .5 * Math.PI));
                            iIdx = (dropIdx);
                        }
                        
                        block.draw(iIdx, j);
                        //this.blobRenderer.drawBlobAtIndices(iIdx, j, block);
                    }
                }
            }
            
            if(this.gameState == GAMESTATE_PLAYING) {
                
                var tickBufferOffset:number = Math.sin(Math.min(1,this.tickParameter * 1.5) * .5 * Math.PI);
                this.playerFracColumnBuffer = .5 * this.playerFracColumnBuffer + .5 * this.playerBlockColumn;
                var fracPlayerRow:number = this.playerBlockRow - 1 + (this.playerCurrentTick + tickBufferOffset) / (TICKCOUNT + 1);
                //this.playerBlob.drawTupleAtIndices(this.blobRenderer, fracPlayerRow, this.playerFracColumnBuffer);
                this.playerBlock.draw(fracPlayerRow, this.playerFracColumnBuffer);
                debugText = fracPlayerRow + " " + this.playerFracColumnBuffer;
            }
            
            //render next blob:
            //this.nextBlob.drawTupleAtIndices(this.blobRenderer, TOPROWCOUNT + 1, COLUMNCOUNT + 1.5);
            this.nextBlock.draw(TOPROWCOUNT + 1, COLUMNCOUNT + 1.5);
            
            
            //this.blobRenderer.end();
        }

        render() {
            
            this.graphics.clear();
            
            var srcX:number = (this.game.width - COLUMNCOUNT * GRIDWIDTH) * 0.5;
            var srcY:number = (this.game.height - VISIBLEROWCOUNT * GRIDWIDTH) * 0.5;
            
            var gridTop:number = 0;
            var gridLeft:number = 0;
            var color:number = 0x0;
            
            //render next blob:
            var nextX:number = this.game.width / 2 + GRIDWIDTH * COLUMNCOUNT / 2 + 50;
            var nextY:number = this.game.height / 2 - GRIDWIDTH * VISIBLEROWCOUNT / 2;
            this.graphics.lineStyle(3, 0xaaaaaa, 1);
            this.graphics.beginFill(0x0, .5);
            this.graphics.drawRoundedRect(nextX - 10, nextY - 10, 120, 120, 20);
            this.graphics.endFill();
            //this.nextBlob.render(this.graphics, nextX + 50 - GRIDWIDTH / 2, nextY + 50);
            
            //render player blob:
            if(this.gameState == GAMESTATE_PLAYING) {
                
               // var t:number = Math.min(1,this.tickParameter * 1.5);
                var tickBufferOffset:number = Math.sin(Math.min(1,this.tickParameter * 1.5) * .5 * Math.PI);// (1 - Math.cos(this.tickParameter * Math.PI)) / 2;
                
                this.playerFracColumnBuffer = .5 * this.playerFracColumnBuffer + .5 * this.playerBlockColumn;
                
                gridTop = srcY + (this.playerBlockRow - 1 + (this.playerCurrentTick + tickBufferOffset) / (TICKCOUNT + 1) - TOPROWCOUNT) * GRIDWIDTH;
                gridLeft = srcX + this.playerFracColumnBuffer * GRIDWIDTH;
                
                //this.playerBlob.render(this.graphics, gridLeft, gridTop);
                this.graphics.lineStyle(2, 0xffffff, .5);
                this.graphics.drawRoundedRect(gridLeft, gridTop, GRIDWIDTH, GRIDWIDTH, 10);  
            }
            
            this.game.debug.text("DEBUG: " + debugText, 0, this.game.height - 30);
        }
    }
}