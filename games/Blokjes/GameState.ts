///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="BlobTuple.ts"/>
///<reference path="Blob.ts"/>
///<reference path="BlobRenderer.ts"/>

module BlokjesGame
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
        slots:Blob[][];
        tickParameter:number;
        //blobsContainer:Phaser.Group;
        
        blobRenderer:BlobRenderer;
        
        nextBlob:BlobTuple;
        playerBlob:BlobTuple;
        playerCurrentTick:number;
        totalRowsDrop:number;
        playerFracColumnBuffer:number;
        punishmentPending:boolean;
        
        gameState:number;
        gameStateParameter:number;
        
        //blobShader:Phaser.Filter;
        
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
            bg.alpha = .4;
            
            noiseSprite = new Phaser.Sprite(this.game, 0, 0, 'noise');
            
            this.gridGraphics = this.game.add.graphics(0,0);
            this.gridGraphics.alpha = 0.2;
            this.gridGraphics.lineStyle(2, 0xffffff, 1);
            var srcX:number = (this.game.width - COLUMNCOUNT * GRIDWIDTH) * 0.5;
            var srcY:number = (this.game.height - VISIBLEROWCOUNT * GRIDWIDTH) * 0.5;
            for(var i:number=0; i<ROWCOUNT; ++i) {
                var gridTop = srcY + (i - TOPROWCOUNT) * GRIDWIDTH;
                
                for(var j:number=0; j<COLUMNCOUNT; ++j) {
                    
                    var gridLeft = srcX + j * GRIDWIDTH;
                    
                    if(i >= TOPROWCOUNT) {
                        this.gridGraphics.drawRect(gridLeft, gridTop, GRIDWIDTH, GRIDWIDTH);
                    }
                }
            }
            
            this.blobRenderer = new BlobRenderer(this.game);
            
            /*
            this.blobsContainer = this.game.add.group();
            var gr = new Phaser.Graphics(this.game);
            gr.beginFill(0xffffff, 1);
            gr.drawRect((this.game.width - COLUMNCOUNT * GRIDWIDTH) / 2, (this.game.height - VISIBLEROWCOUNT * GRIDWIDTH) / 2, COLUMNCOUNT * GRIDWIDTH, VISIBLEROWCOUNT * GRIDWIDTH);
            gr.drawRect((this.game.width + COLUMNCOUNT * GRIDWIDTH) / 2, (this.game.height - VISIBLEROWCOUNT * GRIDWIDTH) / 2, 300, 300);
            gr.endFill();
            this.blobsContainer.mask = gr;
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
            
            //reset button:
            this.game.add.button(0, 0, "button", () => { this.resetGame(); }, this);
            
            var sound = this.game.add.audio('backgroundMusic');
            //sound.play('', 0, .2, true);
            
            this.resetGame();
        }
        
        
        
        createRandomBlob() : Blob {
            var b:Blob = new Blob(this.game);
            //this.blobsContainer.add(b);
            b.typeIndex = this.game.rnd.integerInRange(0,COLORCODES.length - 1);
            return b;
            //return new Blob(this.game.rnd.integerInRange(0,colorCodes.length - 1));
        }
        
        createBlockingBlob() : Blob {
            var b:Blob = new Blob(this.game);
            //this.blobsContainer.add(b);
            b.isBlocking = true;
            return b;
        }
        
        createRandomBlobTuple() : BlobTuple {
            return new BlobTuple(this.createRandomBlob(), this.createRandomBlob());
        }
        
        canPlayerBlobMoveToSlot(row:number, col:number):boolean {
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
                    this.slots[i][j] = i > ROWCOUNT - 3 ? this.createRandomBlob() : null;
                }
            }
            
            this.nextBlob = this.createRandomBlobTuple();
            
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
                    var deltaIndices:number[] = NEIGHBORDELTAINDICES[this.playerBlob.orientation];
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
                        this.playerCurrentTick = TICKCOUNT;
                    }
                }
            }
        }
        
        tickDown() {
            this.tickParameter--;
            this.playerCurrentTick++;
            if(this.playerCurrentTick > TICKCOUNT) {
                
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
                    this.slots[0][columnIdx] = this.createBlockingBlob();
            }
            else if(randomFrac < .975) {
                //7.5% chance that a single row of blocks drops
                for(var j:number=0; j<COLUMNCOUNT; ++j)
                {
                    if(this.slots[0][j] == null)
                        this.slots[0][j] = this.createBlockingBlob();
                }
            }
            else {
                //2.5% chance that {MIN (3) and (number of top rows)} rows of blocks drop:
                var punishRows:number = Math.min(3, TOPROWCOUNT);
                for(var i:number=0; i<punishRows; ++i) {
                    for(var j:number=0; j<COLUMNCOUNT; ++j)
                    {
                        if(this.slots[i][j] == null)
                            this.slots[i][j] = this.createBlockingBlob();
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
                            this.totalRowsDrop = Math.max(this.totalRowsDrop, nextEmptyIndex - i);
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
                queueIdx++;
                
                if(blob.isBlocking)
                    continue;
                
                //traverse neighbors:
                for(var n:number=0; n<4; ++n) {
                    var ni = i + NEIGHBORDELTAINDICES[n][0];
                    var nj = j + NEIGHBORDELTAINDICES[n][1];
                    
                    if(this.isValidSlotIndex(ni, nj)) {
                        
                        var nBlob:Blob = this.slots[ni][nj];
                       
                        if(nBlob != null && nBlob.testSource != srcBlob && (nBlob.isBlocking || nBlob.typeIndex == srcBlob.typeIndex)) {
                            //chained element found!
                            var nIdx = queue.length;
                            queue[nIdx] = nBlob;
                            queueIndices[nIdx] = [ni, nj];
                            nBlob.testSource = srcBlob;
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
                    var blob:Blob = this.slots[i][j];
                    if(blob != null) {
                        blob.removing = false;
                        blob.testSource = null;
                    }
                }
            }
            
            for(var i:number=0; i<ROWCOUNT; ++i) {
                for(var j:number=0; j<COLUMNCOUNT; ++j) {
                    
                    var blob:Blob = this.slots[i][j];
                    if(blob != null && !blob.isBlocking) {
                        
                        //find connections to neighbors:
                        for(var n:number=0; n<4; ++n) {
                            var ni = i + NEIGHBORDELTAINDICES[n][0];
                            var nj = j + NEIGHBORDELTAINDICES[n][1];
                            
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
                            
                            var coloredCount = 0;
                            chain.forEach((b:Blob) => { if(!b.isBlocking) ++ coloredCount;});
                            
                            if(coloredCount >= 4) {
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
                
                if(this.punishmentPending) {
                    this.punishmentPending = false;
                    this.pushPunishment();
                }
                else {
                    this.dropNewBlobTuple();
                    this.punishmentPending = true;
                }
                
                //this.pushPunishment();
                //this.dropNewBlobTuple();
            }
        }
        
        dropNewBlobTuple() {
            this.playerCurrentTick = 0;
            this.playerBlob = this.nextBlob;
            this.nextBlob = this.createRandomBlobTuple();
            this.gameState = GAMESTATE_PLAYING;
            this.gameStateParameter = 0;
            this.playerFracColumnBuffer = this.playerBlob.column;
            
            //test losing condition:
            if(this.slots[TOPROWCOUNT][this.playerBlob.column])
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
                                var b:Blob = this.slots[i][j];
                                if(b != null && b.removing) {
                                    this.slots[i][j] = null;
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
            
            /*
            this.blobShader.update(this.game.input.mousePointer);
            this.blobShader.uniforms.yoloSwaggeriez.value = 1.0;
            if(this.gameState == GAMESTATE_PLAYING)
                this.blobShader.uniforms.yoloSwaggeriez.value = this.playerBlob.row / rows;
            */
            
            this.blobRenderer.update();
            
            this.drawBlobs();
        }
        
        drawBlobs() {
            
            var resolveAlphaFactor:number = this.gameState == GAMESTATE_REMOVING ? this.gameStateParameter : 1;
            this.blobRenderer.begin(resolveAlphaFactor);
            
            for(var i:number=0; i<ROWCOUNT; ++i) {
                
                for(var j:number=0; j<COLUMNCOUNT; ++j) {
                    
                    var blob:Blob = this.slots[i][j];
                    if(blob != null) {
                        
                        var iIdx = i;
                        
                        if(this.gameState == GAMESTATE_DROPPING && blob.dropping) {
                            
                            var totalDrop:number = i - blob.dropFromRow;
                            var dropIdx:number = blob.dropFromRow + totalDrop * (1 - Math.cos(this.gameStateParameter * .5 * Math.PI));
                            iIdx = (dropIdx);
                        }
                        
                        this.blobRenderer.drawBlobAtIndices(iIdx, j, blob);
                        
                        //blob.updatePosition(gridLeft, y, resolveAlphaFactor);
                        
                        //blob.render(this.graphics, gridLeft + gridWidth / 2, y + gridWidth / 2, resolveAlphaFactor);
                    }
                }
            }
            
            if(this.gameState == GAMESTATE_PLAYING) {
                
                //var t:number = Math.min(1,this.tickParameter * 1.5);
                var tickBufferOffset:number = Math.sin(Math.min(1,this.tickParameter * 1.5) * .5 * Math.PI);// (1 - Math.cos(this.tickParameter * Math.PI)) / 2;
                
                this.playerFracColumnBuffer = .5 * this.playerFracColumnBuffer + .5 * this.playerBlob.column;
                
                var fracPlayerRow:number = this.playerBlob.row - 1 + (this.playerCurrentTick + tickBufferOffset) / (TICKCOUNT + 1);
                this.playerBlob.drawTupleAtIndices(this.blobRenderer, fracPlayerRow, this.playerFracColumnBuffer);
                
                /*
                this.blobRenderer.drawBlobAtIndices( this.playerFracColumnBuffer, );
                
                //gridTop = srcY + (this.playerBlob.row - 1 + (this.playerCurrentTick + tickBufferOffset) / (TICKCOUNT + 1) - TOPROWCOUNT) * GRIDWIDTH;
                //gridLeft = srcX + this.playerFracColumnBuffer * GRIDWIDTH;
                
                this.playerBlob.render(this.graphics, gridLeft, gridTop);
                this.graphics.lineStyle(2, 0xffffff, .5);
                this.graphics.drawRoundedRect(gridLeft, gridTop, GRIDWIDTH, GRIDWIDTH, 10);  
                
                this.game.debug.text("ROW: " + this.playerBlob.row.toString(), 0, 50);
                this.game.debug.text("TICK: " + this.playerCurrentTick.toString(), 0, 100);
                */
            }
            
            
            this.blobRenderer.end();
        }

        render() {
            
            this.graphics.clear();
            
            var srcX:number = (this.game.width - COLUMNCOUNT * GRIDWIDTH) * 0.5;
            var srcY:number = (this.game.height - VISIBLEROWCOUNT * GRIDWIDTH) * 0.5;
            
            var gridTop:number = 0;
            var gridLeft:number = 0;
            var color:number = 0x0;
            
            var resolveAlphaFactor:number = this.gameState == GAMESTATE_REMOVING ? this.gameStateParameter : 1;
            
            for(var i:number=0; i<ROWCOUNT; ++i) {
                
                gridTop = srcY + (i - TOPROWCOUNT) * GRIDWIDTH;
                
                for(var j:number=0; j<COLUMNCOUNT; ++j) {
                    
                    gridLeft = srcX + j * GRIDWIDTH;
                    
                    /*
                    if(i >= topRowCount) {
                        this.graphics.lineStyle(3, 0xffffff, 1);
                        this.graphics.drawRect(gridLeft, gridTop, gridWidth, gridWidth);
                        this.graphics.lineStyle(0);
                    }
                    */ 
                    
                    /*
                    this.graphics.lineStyle(1, 0xaaaaaa, 1);
                    this.graphics.drawRect(gridLeft, gridTop, gridWidth, gridWidth);
                    this.graphics.lineStyle(0);
                    */
                    
                    /*
                    var blob:Blob = this.slots[i][j];
                    if(blob != null) {
                        
                        var y:number = gridTop;
                        if(this.gameState == GAMESTATE_DROPPING && blob.dropping) {
                            
                            var totalDrop:number = i - blob.dropFromRow;
                            var dropIdx:number = blob.dropFromRow + totalDrop * (1 - Math.cos(this.gameStateParameter * .5 * Math.PI));
                            y = srcY + (dropIdx - TOPROWCOUNT) * GRIDWIDTH;
                        }
                        
                        blob.updatePosition(gridLeft, y, resolveAlphaFactor);
                        
                        //blob.render(this.graphics, gridLeft + gridWidth / 2, y + gridWidth / 2, resolveAlphaFactor);
                    }*/
                }
            }
            
            //render next blob:
            var nextX:number = this.game.width / 2 + GRIDWIDTH * COLUMNCOUNT / 2 + 50;
            var nextY:number = this.game.height / 2 - GRIDWIDTH * VISIBLEROWCOUNT / 2;
            this.graphics.lineStyle(1, 0xaaaaaa, 1);
            this.graphics.drawRoundedRect(nextX, nextY, 100, 100, 20);
            //this.nextBlob.render(this.graphics, nextX + 50 - GRIDWIDTH / 2, nextY + 50);
            
            //render player blob:
            if(this.gameState == GAMESTATE_PLAYING) {
                
               // var t:number = Math.min(1,this.tickParameter * 1.5);
                var tickBufferOffset:number = Math.sin(Math.min(1,this.tickParameter * 1.5) * .5 * Math.PI);// (1 - Math.cos(this.tickParameter * Math.PI)) / 2;
                
                this.playerFracColumnBuffer = .5 * this.playerFracColumnBuffer + .5 * this.playerBlob.column;
                
                gridTop = srcY + (this.playerBlob.row - 1 + (this.playerCurrentTick + tickBufferOffset) / (TICKCOUNT + 1) - TOPROWCOUNT) * GRIDWIDTH;
                gridLeft = srcX + this.playerFracColumnBuffer * GRIDWIDTH;
                
                //this.playerBlob.render(this.graphics, gridLeft, gridTop);
                this.graphics.lineStyle(2, 0xffffff, .5);
                this.graphics.drawRoundedRect(gridLeft, gridTop, GRIDWIDTH, GRIDWIDTH, 10);  
                
                this.game.debug.text("ROW: " + this.playerBlob.row.toString(), 0, 50);
                this.game.debug.text("TICK: " + this.playerCurrentTick.toString(), 0, 100);
            }
            
            this.game.debug.text("DROPS: " +  this.totalRowsDrop, 0, 150);
            this.game.debug.text("DEBUG: " +  debugText, 0, this.game.height - 20);
            
            /*
            this.graphics.lineStyle(0);
            this.graphics.beginFill(0x0, 1);
            this.graphics.drawRect(this.game.width / 2 - columns * gridWidth / 2,
                                    this.game.height / 2 - (rows - topRowCount) * gridWidth / 2 - 100,
                                    columns * gridWidth, 100);
            this.graphics.endFill();
            */
        }
    }
}