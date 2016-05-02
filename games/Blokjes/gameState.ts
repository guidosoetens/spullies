///<reference path="../../phaser/phaser.d.ts"/>

module BlokjesGame
{
    const topRowCount:number = 3;
    const visibleRows:number = 12;
    const rows:number = visibleRows + topRowCount; //12 at the bottom
    const columns:number = 6;
    const colorCodes:number[] = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff];//, 0x00ffff];
    const tickCount:number = 1;
    const gridWidth:number = 40;
    const neighbourDeltaIndices:number[][] = [[0,1], [1,0], [0,-1], [-1,0]]; //(right, bottom, left, top) [row][column] - format
    
    const GAMESTATE_PLAYING:number = 0;
    const GAMESTATE_REMOVING:number = 1;
    const GAMESTATE_DROPPING:number = 2;
    
    var debugText:string;
   
    
    export class BlobTuple {
        blob1:Blob;
        blob2:Blob;
        
        private _orientation:number = 0;
        private renderOrientation:Phaser.Point = new Phaser.Point(0,-1);
        
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
            this.orientation = 3;
            this.row = topRowCount;
            this.column = columns / 2 - 1;
        }
        
        render(graphics:Phaser.Graphics, x:number, y:number) {
            
            var to:Phaser.Point = new Phaser.Point( neighbourDeltaIndices[this.orientation][1], 
                                                    neighbourDeltaIndices[this.orientation][0]);
                                  
            var angle:number = Math.acos(this.renderOrientation.dot(to));
            var cross:number = to.cross(this.renderOrientation);
            var sign:number = cross < 0 ? 1 : -1;
            
            this.renderOrientation.rotate(0, 0, sign * .75 * angle);
            
            this.blob1.updatePosition(x, y, 1);
            this.blob2.updatePosition(x + this.renderOrientation.x * gridWidth, y + this.renderOrientation.y * gridWidth, 1);
            
            //this.blob1.render(graphics, x, y, 1);
            //this.blob2.render(graphics, x + this.renderOrientation.x * gridWidth, y + this.renderOrientation.y * gridWidth, 1);
        }
    }
    
    export class Blob extends Phaser.Graphics {
        
        private dxs:number[] = [gridWidth / 3,0,-gridWidth / 3,0];
        private dys:number[] = [0,gridWidth / 3,0,-gridWidth / 3];
        
        isBlocking:boolean;
        typeIndex:number;
        removing:boolean;
        testSource:Blob;
        chainedToNeighbor:boolean[];
        dropping:boolean;
        dropFromRow:number;
        blobShader:Phaser.Filter;
        
        constructor(game:Phaser.Game) {//typeIndex:number) {
            
            super(game);
            
            this.blendMode = PIXI.blendModes.NORMAL;
            
            this.isBlocking = false;
            this.typeIndex = 0;//typeIndex;
            this.removing = false;
            this.testSource = null;
            this.chainedToNeighbor = [false, false, false, false];
            this.dropping = false;
            this.dropFromRow = 0;
            
            this.blobShader = new Phaser.Filter(this.game, null, this.game.cache.getShader('blobShader'));
            this.filters = [ this.blobShader ];
            //this.blobShader.uniforms.uSourceColor =  { type: '3f', value: [1.0, 1.0, 0.0] };
            this.blobShader.uniforms.uSourceColor =  { type: '3f', value: { x:0, y:0, z:0 } };
            this.blobShader.uniforms.uAlpha =  { type: '1f', value: 1.0 };
            this.blobShader.uniforms.uWidth =  { type: '1f', value: 1.0 };
            this.blobShader.uniforms.uGlobalOrigin =  { type: '2f', value: { x:0, y:0 } };
            
            //this.width = gridWidth;
            //this.height = gridWidth;
            
            
            this.beginFill(0xffffff, 1);
            this.drawRect(0,0,gridWidth, gridWidth);
            this.endFill();
            
            
        }
        
        updatePosition(x:number, y:number, alphaFactor:number) {
            
            this.position.x = x;
            this.position.y = y;
            
            var alpha:number = this.removing ? Math.pow(1.0 - alphaFactor, 2.0) : 1.0;
            if(this.removing)
                debugText = "" + alpha;
            //alpha = 0.00001;
            //alpha = 0.0;
            /*
            this.clear();
            this.alpha = alpha;
            this.beginFill(0x0, alpha);
            this.drawRect(0,0,gridWidth, gridWidth);
            this.endFill();
            */
            
            var color:number = colorCodes[this.typeIndex];
            if(this.isBlocking) {
                color = 0xaaaaaa;
            }
            
            var cls:number[] = this.getFractColor(color);
            
            this.blobShader.update();
            this.blobShader.uniforms.uSourceColor.value.x = cls[0];
            this.blobShader.uniforms.uSourceColor.value.y = cls[1];
            this.blobShader.uniforms.uSourceColor.value.z = cls[2];
            this.blobShader.uniforms.resolution.value.x = this.game.width;
            this.blobShader.uniforms.resolution.value.y = this.game.height;
            this.blobShader.uniforms.uAlpha.value = alpha;
            
            this.blobShader.uniforms.uWidth.value = gridWidth;// =  { type: '1f', value: 1.0 };
            this.blobShader.uniforms.uGlobalOrigin.value.x = x;// =  { type: '2f', value: { x:0, y:0 } };
            this.blobShader.uniforms.uGlobalOrigin.value.y = (this.game.height - y);
            
            //debugText = this.blobShader.uniforms.resolution.value.x + " : " + this.blobShader.uniforms.resolution.value.y;
        }
        
        private getFractColor(color:number) : number[] {
            
            var blue:number = color % 0x100;                //0x0000XX
            var green:number = (color - blue) % 0x10000;    //0x00XX00
            var red:number = (color - green - blue);        //0xXX0000
            
            blue = blue / 0xff;
            green = green / 0xff00;
            red = red / 0xff0000;
            
            return [red, green, blue];
        }
        
        
        
        /*
        update() {
            
        }
        
        render(graphics:Phaser.Graphics, x:number, y:number, alphaParameter:number) {
            
            var alpha:number = this.removing ? (1.0 - alphaParameter) : 1.0;
            
            var color:number = colorCodes[this.typeIndex];
            if(this.isBlocking) {
                color = 0x777777;
            }
            
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
        */
    }
    
    export class GameRunningState extends Phaser.State {
        constructor() {
            super();
        }
        
        cursors: Phaser.CursorKeys;
        graphics: Phaser.Graphics;
        slots:Blob[][];
        tickParameter:number;
        blobsContainer:Phaser.Group;
        
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
             this.game.load.audio("backgroundMusic", ["music2.mp3"]);
             this.game.load.image("button", "../../assets/sprites/mushroom2.png", false);
             this.game.load.shader("blobShader", 'blobShader.frag');
             this.game.load.image('blokje', "blokje.png");
             this.game.load.image('galaxy', "galaxy.jpg");
        }
        
        create() {
            
            this.tickParameter = 0;
            this.totalRowsDrop = 0;
            
            //set component containers:
            var bg = this.game.add.sprite(0,0,'galaxy');
            bg.width = this.game.width;
            bg.height = this.game.height;
            this.blobsContainer = this.game.add.group();
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
            this.blobsContainer.add(b);
            b.typeIndex = this.game.rnd.integerInRange(0,colorCodes.length - 1);
            return b;
            //return new Blob(this.game.rnd.integerInRange(0,colorCodes.length - 1));
        }
        
        createBlockingBlob() : Blob {
            var b:Blob = new Blob(this.game);
            this.blobsContainer.add(b);
            b.isBlocking = true;
            return b;
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
            this.blobsContainer.removeAll();
            for(var i:number=0; i<rows; ++i) {
                this.slots[i] = [];
                for(var j:number=0; j<columns; ++j) {
                    this.slots[i][j] = i > rows - 3 ? this.createRandomBlob() : null;
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
        
        pushPunishment() {
            
            //just to be safe: 
            if(topRowCount <= 0)
                return;
            
            var randomFrac:number = this.game.rnd.frac();
            
            if(randomFrac < .75) {
                //75% chance that nothing happens...
            }
            else if(randomFrac < .9) {
                //15% chance that a single block drops 
                var columnIdx:number = this.game.rnd.integerInRange(0, columns - 1);
                if(this.slots[0][columnIdx] == null)
                    this.slots[0][columnIdx] = this.createBlockingBlob();
            }
            else if(randomFrac < .975) {
                //7.5% chance that a single row of blocks drops
                for(var j:number=0; j<columns; ++j)
                {
                    if(this.slots[0][j] == null)
                        this.slots[0][j] = this.createBlockingBlob();
                }
            }
            else {
                //2.5% chance that {MIN (3) and (number of top rows)} rows of blocks drop:
                var punishRows:number = Math.min(3, topRowCount);
                for(var i:number=0; i<punishRows; ++i) {
                    for(var j:number=0; j<columns; ++j)
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
                    var ni = i + neighbourDeltaIndices[n][0];
                    var nj = j + neighbourDeltaIndices[n][1];
                    
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
                    if(blob != null && !blob.isBlocking) {
                        
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
            if(this.slots[topRowCount][this.playerBlob.column])
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
                        for(var i:number=0; i<rows; ++i) {
                            for(var j:number=0; j<columns; ++j) {
                                var b:Blob = this.slots[i][j];
                                if(b != null && b.removing) {
                                    this.slots[i][j] = null;
                                    this.blobsContainer.remove(b);
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
        }

        render() {
            
            this.graphics.clear();
            
            var srcX:number = (this.game.width - columns * gridWidth) * 0.5;
            var srcY:number = (this.game.height - visibleRows * gridWidth) * 0.5;
            
            var gridTop:number = 0;
            var gridLeft:number = 0;
            var color:number = 0x0;
            
            var resolveAlphaFactor:number = this.gameState == GAMESTATE_REMOVING ? this.gameStateParameter : 1;
            
            for(var i:number=0; i<rows; ++i) {
                
                gridTop = srcY + (i - topRowCount) * gridWidth;
                
                for(var j:number=0; j<columns; ++j) {
                    
                    gridLeft = srcX + j * gridWidth;
                    
                    if(i >= topRowCount) {
                        this.graphics.lineStyle(1, 0xaaaaaa, 1);
                        this.graphics.drawRect(gridLeft, gridTop, gridWidth, gridWidth);
                        this.graphics.lineStyle(0);
                    }
                    
                    /*
                    this.graphics.lineStyle(1, 0xaaaaaa, 1);
                    this.graphics.drawRect(gridLeft, gridTop, gridWidth, gridWidth);
                    this.graphics.lineStyle(0);
                    */
                    
                    var blob:Blob = this.slots[i][j];
                    if(blob != null) {
                        
                        var y:number = gridTop;
                        if(this.gameState == GAMESTATE_DROPPING && blob.dropping) {
                            
                            var totalDrop:number = i - blob.dropFromRow;
                            var dropIdx:number = blob.dropFromRow + totalDrop * (1 - Math.cos(this.gameStateParameter * .5 * Math.PI));
                            y = srcY + (dropIdx - topRowCount) * gridWidth;
                        }
                        
                        blob.updatePosition(gridLeft, y, resolveAlphaFactor);
                        
                        //blob.render(this.graphics, gridLeft + gridWidth / 2, y + gridWidth / 2, resolveAlphaFactor);
                    }
                }
            }
            
            //render next blob:
            var nextX:number = this.game.width / 2 + gridWidth * columns / 2 + 50;
            var nextY:number = this.game.height / 2 - gridWidth * visibleRows / 2;
            this.graphics.lineStyle(1, 0xaaaaaa, 1);
            this.graphics.drawRoundedRect(nextX, nextY, 100, 100, 20);
            this.nextBlob.render(this.graphics, nextX + 50 - gridWidth / 2, nextY + 50);
            
            //render player blob:
            if(this.gameState == GAMESTATE_PLAYING) {
                
               // var t:number = Math.min(1,this.tickParameter * 1.5);
                var tickBufferOffset:number = Math.sin(Math.min(1,this.tickParameter * 1.5) * .5 * Math.PI);// (1 - Math.cos(this.tickParameter * Math.PI)) / 2;
                
                this.playerFracColumnBuffer = .5 * this.playerFracColumnBuffer + .5 * this.playerBlob.column;
                
                gridTop = srcY + (this.playerBlob.row - 1 + (this.playerCurrentTick + tickBufferOffset) / (tickCount + 1) - topRowCount) * gridWidth;
                gridLeft = srcX + this.playerFracColumnBuffer * gridWidth;
                
                this.playerBlob.render(this.graphics, gridLeft, gridTop);
                this.graphics.lineStyle(2, 0xffffff, .5);
                this.graphics.drawRoundedRect(gridLeft, gridTop, gridWidth, gridWidth, 10);  
                
                this.game.debug.text("ROW: " + this.playerBlob.row.toString(), 0, 50);
                this.game.debug.text("TICK: " + this.playerCurrentTick.toString(), 0, 100);
            }
            
            this.game.debug.text("DROPS: " +  this.totalRowsDrop, 0, 150);
            this.game.debug.text("DEBUG: " +  debugText, 0, this.game.height - 20);
            
            this.graphics.lineStyle(0);
            this.graphics.beginFill(0x0, 1);
            this.graphics.drawRect(this.game.width / 2 - columns * gridWidth / 2,
                                    this.game.height / 2 - (rows - topRowCount) * gridWidth / 2 - 100,
                                    columns * gridWidth, 100);
            this.graphics.endFill();
        }
    }
}