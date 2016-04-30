///<reference path="../../phaser/phaser.d.ts"/>

module BlokjesGame
{
    const rows:number = 10;
    const cols:number = 6;
    const colorCodes:number[] = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    const tickCount:number = 2;
    const gridWidth:number = 40;
    
    export class BlobTuple {
        blob1:Blob;
        blob2:Blob;
        
        private _orientation:number = 0;
        
        row:number;
        column:number;
        
        get row2():number {
            return this.row + this.getDiffIndexSecondBlob()[0];
        }
        
        get column2():number {
            return this.column + this.getDiffIndexSecondBlob()[1];
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
            this.column = cols / 2 - 1;
        }
        
        getDiffIndexSecondBlob() : number[] {
            switch (this.orientation) {
                case 1:
                    return [1,0];
                case 2:
                    return [0,-1];
                case 3:
                    return [-1,0];
                default:
                    return [0,1];
            }
        }
        
        render(graphics:Phaser.Graphics, x:number, y:number) {
            this.blob1.render(graphics, x, y);
            var diffIndices:number[] = this.getDiffIndexSecondBlob();
            this.blob2.render(graphics, x + diffIndices[1] * gridWidth, y + diffIndices[0] * gridWidth);
        }
    }
    
    export class Blob {
        typeIndex:number;
        constructor(typeIndex:number) {
            this.typeIndex = typeIndex;
        }
        
        render(graphics:Phaser.Graphics, x:number, y:number) {
            var color:number = colorCodes[this.typeIndex];
            graphics.beginFill(color);
            graphics.drawCircle(x, y, gridWidth);
            graphics.endFill();
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
        //playerRow:number;
        //playerColumn:number;
        //playerOrientation:number;
        playerCurrentTick:number;
        
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
            this.game.load.image("button", "../../assets/sprites/mushroom2.png", false);
            this.game.add.button(0, 0, "button", () => { this.resetGame(); }, this);
            
            this.resetGame();
        }
        
        createRandomBlob() : Blob {
            return new Blob(this.game.rnd.integerInRange(0,5));
        }
        
        createRandomBlobTuple() : BlobTuple {
            return new BlobTuple(this.createRandomBlob(), this.createRandomBlob());
        }
        
        resetGame() {
            
            //set default layout:
            this.slots = [];
            for(var i:number=0; i<rows; ++i) {
                this.slots[i] = [];
                for(var j:number=0; j<cols; ++j) {
                    this.slots[i][j] = i > rows - 3 ? this.createRandomBlob() : null;
                }
            }
            
            this.nextBlob = this.createRandomBlobTuple();
            
            this.dropNewBlock();
        }
        
        onMouseMove() {
            
        }
        
        onMouseDown() {
            
        }
        
        moveDown() {
            this.tickDown();
        }
        
        moveLeft() {
            
            if(this.playerBlob.column > 0 && this.playerBlob.column2 > 0) {
                
                //does first blob allow translation?
                if(this.playerBlob.row < 0 || this.slots[this.playerBlob.row][this.playerBlob.column - 1] == null) {
                    
                    //does second blob allow translation?
                     if(this.playerBlob.row2 < 0 || this.slots[this.playerBlob.row2][this.playerBlob.column2 - 1] == null) {
                         this.playerBlob.column--;
                     }
                }
            }
        }
        
        moveRight() {
            
            if(this.playerBlob.column < cols - 1 && this.playerBlob.column2 < cols - 1) {
                
                //does first blob allow translation?
                if(this.playerBlob.row < 0 || this.slots[this.playerBlob.row][this.playerBlob.column + 1] == null) {
                    
                    //does second blob allow translation?
                     if(this.playerBlob.row2 < 0 || this.slots[this.playerBlob.row2][this.playerBlob.column2 + 1] == null) {
                         this.playerBlob.column++;
                     }
                }
            }
        }
        
        rotate() {
            this.playerBlob.orientation++;
            
            if(this.playerBlob.row2 < 0 || this.playerBlob.column2 < 0 || this.playerBlob.row2 >= rows || this.playerBlob.column2 >= cols)
                this.playerBlob.orientation--;
            else {
                if(this.slots[this.playerBlob.row2][this.playerBlob.column2] != null)
                    this.playerBlob.orientation--;
            }
        }
        
        tickDown() {
            this.tickParameter--;
            this.playerCurrentTick++;
            if(this.playerCurrentTick > tickCount) {
                
                if(this.slots[this.playerBlob.row + 1][this.playerBlob.column] != null 
                || this.slots[this.playerBlob.row2 + 1][this.playerBlob.column2] != null) {
                    //stop player blob:
                    this.slots[Math.max(0,this.playerBlob.row)][this.playerBlob.column] = this.playerBlob.blob1;
                    this.slots[Math.max(0,this.playerBlob.row2)][this.playerBlob.column2] = this.playerBlob.blob2;
                    this.dropNewBlock();
                }
                else {
                    //continue to next row:
                    this.playerCurrentTick = 0;
                    this.playerBlob.row++;
                }
            }
        }
        
        dropNewBlock() {
            this.playerCurrentTick = 0;
            this.playerBlob = this.nextBlob;
            this.nextBlob = this.createRandomBlobTuple();
        }

        update() {
            
            const speedUp:boolean = this.cursors.down.isDown;
            
            var dt:number = this.game.time.physicsElapsed;
            this.tickParameter += (speedUp ? 20 : 1) * dt;
            if(this.tickParameter > 1)
                this.tickDown();
        }

        render() {
            
            this.graphics.clear();
            
            var srcX:number = (this.game.width - cols * gridWidth) * 0.5;
            var srcY:number = (this.game.height - rows * gridWidth) * 0.5;
            
            var gridTop:number = 0;
            var gridLeft:number = 0;
            var color:number = 0x0;
            
            for(var i:number=0; i<rows; ++i) {
                
                gridTop = srcY + i * gridWidth;
                
                for(var j:number=0; j<cols; ++j) {
                    
                    gridLeft = srcX + j * gridWidth;
                    
                    this.graphics.lineStyle(1, 0xaaaaaa, 1);
                    this.graphics.drawRect(gridLeft, gridTop, gridWidth, gridWidth);
                    this.graphics.lineStyle(0);
                    
                    var blob:Blob = this.slots[i][j];
                    if(blob != null)
                        blob.render(this.graphics, gridLeft + gridWidth / 2, gridTop + gridWidth / 2);
                }
            }
            
            //render player blob:
            gridTop = srcY + (this.playerBlob.row - 1 + (this.playerCurrentTick + 1) / (tickCount + 1)) * gridWidth;
            gridLeft = srcX + this.playerBlob.column * gridWidth;
            this.playerBlob.render(this.graphics, gridLeft + gridWidth / 2, gridTop + gridWidth / 2);
            this.graphics.lineStyle(2, 0xffffff, .5);
            this.graphics.drawRoundedRect(gridLeft, gridTop, gridWidth, gridWidth, 10);
            
            
            
            //render next blob:
            var nextX:number = this.game.width / 2 + gridWidth * cols / 2 + 50;
            var nextY:number = this.game.height / 2 - gridWidth * rows / 2;
            this.graphics.lineStyle(1, 0xaaaaaa, 1);
            this.graphics.drawRoundedRect(nextX, nextY, 100, 100, 20);
            this.nextBlob.render(this.graphics, nextX + 50, nextY + 50);
           
            //this.game.debug.text("ROW: " + this.playerRow.toString(), 0, 50);
            //this.game.debug.text("TICK: " + this.playerCurrentTick.toString(), 0, 100);
        }
    }
}