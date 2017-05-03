var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../../phaser/phaser.d.ts"/>
var CircuitGame;
(function (CircuitGame) {
    var TitleState = (function (_super) {
        __extends(TitleState, _super);
        function TitleState() {
            _super.call(this);
        }
        TitleState.prototype.preload = function () {
            this.load.image("peach", "peachy.png");
        };
        TitleState.prototype.create = function () {
            var image = this.game.cache.getImage("peach");
            this.titleScreenImage = this.add.sprite((this.game.width - image.width) / 2, (this.game.height - image.height) / 2, "peach");
            this.input.onTap.addOnce(this.titleClicked, this);
            //this.game.add.button(0, 0, "button", () => { this.resetGame(); }, this);
        };
        TitleState.prototype.titleClicked = function () {
            this.game.state.start("GameRunningState");
            //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.game.scale.startFullScreen(true);
        };
        return TitleState;
    }(Phaser.State));
    CircuitGame.TitleState = TitleState;
})(CircuitGame || (CircuitGame = {}));
///<reference path="../../phaser/phaser.d.ts"/>
var TOPROWCOUNT = 3;
var VISIBLEROWCOUNT = 11;
var ROWCOUNT = VISIBLEROWCOUNT + TOPROWCOUNT; //12 at the bottom
var COLUMNCOUNT = 6; // 6;
var COLORCODES = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff]; //, 0x00ffff];
var TICKCOUNT = 1;
var GRIDWIDTH = 50; // 45;
var NEIGHBORDELTAINDICES = [[0, 1], [1, 0], [0, -1], [-1, 0]]; //(right, bottom, left, top) [row][column] - format
var debugText;
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Defs.ts"/>
var CircuitGame;
(function (CircuitGame) {
    var Block = (function () {
        function Block(game) {
            this.game = game;
            this.isBlocking = false;
            this.typeIndex = 0;
            this.removing = false;
            this.testSource = null;
            this.chainedToNeighbor = [false, false, false, false];
            this.dropping = false;
            this.dropFromRow = 0;
            this.flips = 0;
            this.graphics = this.game.add.graphics(0, 0);
        }
        Block.prototype.destroy = function () {
            this.graphics.destroy();
        };
        Block.prototype.draw = function (i, j) {
            this.graphics.clear();
            var topLeft = new Phaser.Point();
            topLeft.x = (this.game.width - COLUMNCOUNT * GRIDWIDTH) / 2;
            topLeft.y = (this.game.height - VISIBLEROWCOUNT * GRIDWIDTH) / 2;
            var y = topLeft.y + (i - TOPROWCOUNT) * GRIDWIDTH;
            var x = topLeft.x + j * GRIDWIDTH;
            x = Math.round(x);
            y = Math.round(y);
            var colorIdx = this.isBlocking ? -1 : (this.typeIndex % COLORCODES.length);
            var clr = colorIdx < 0 ? 0 : COLORCODES[colorIdx % COLORCODES.length];
            this.graphics.beginFill(clr, 1);
            //gr.drawCircle(x + GRIDWIDTH / 2, y + GRIDWIDTH / 2, GRIDWIDTH * .8);
            var offset = GRIDWIDTH * 0.45;
            this.graphics.drawRoundedRect(-offset, -offset, 2 * offset, 2 * offset, 3);
            this.graphics.beginFill(0xffffff, 1);
            if (colorIdx >= 0 && colorIdx < 4) {
                var tos = [];
                tos.push(new Phaser.Point(0, 1));
                if (colorIdx != 1)
                    tos.push(new Phaser.Point(1, 0));
                if (colorIdx > 0)
                    tos.push(new Phaser.Point(0, -1));
                if (colorIdx == 3)
                    tos.push(new Phaser.Point(-1, 0));
                this.graphics.lineStyle(0, 0xffffff, 1);
                this.graphics.drawCircle(0, 0, 5);
                this.graphics.lineStyle(10, 0xffffff, 1);
                for (var i = 0; i < tos.length; ++i) {
                    this.graphics.moveTo(0, 0);
                    var to = tos[i];
                    to.multiply(GRIDWIDTH / 2, GRIDWIDTH / 2);
                    this.graphics.lineTo(to.x, to.y);
                }
            }
            this.graphics.lineStyle(1, 0xffffff, 1);
            var center = new Phaser.Point(x + GRIDWIDTH / 2, y + GRIDWIDTH / 2);
            this.graphics.x = center.x;
            this.graphics.y = center.y;
            this.graphics.rotation = this.flips * .5 * Math.PI;
        };
        return Block;
    }());
    CircuitGame.Block = Block;
})(CircuitGame || (CircuitGame = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Block.ts"/>
var CircuitGame;
(function (CircuitGame) {
    var GAMESTATE_PLAYING = 0;
    var GAMESTATE_REMOVING = 1;
    var GAMESTATE_DROPPING = 2;
    var GameState = (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            _super.call(this);
        }
        GameState.prototype.preload = function () {
            this.game.load.audio("backgroundMusic", ["assets/music.mp3"]);
            this.game.load.image("button", "../../assets/sprites/mushroom2.png", false);
            this.game.load.shader("blobShader", 'assets/blobShader.frag');
            this.game.load.image('blokje', "assets/blokje.png");
            this.game.load.image('galaxy', "assets/galaxy.jpg");
            this.game.load.image('noise', "assets/noise.jpg");
        };
        GameState.prototype.create = function () {
            this.tickParameter = 0;
            this.totalRowsDrop = 0;
            //set component containers:
            var bg = this.game.add.sprite(0, 0, 'galaxy');
            bg.width = this.game.width;
            bg.height = this.game.height;
            bg.alpha = .8;
            this.gridGraphics = this.game.add.graphics(0, 0);
            this.gridGraphics.lineStyle(1, 0x777777);
            this.gridGraphics.beginFill(0x0, .3);
            var srcX = (this.game.width - COLUMNCOUNT * GRIDWIDTH) * 0.5;
            var srcY = (this.game.height - VISIBLEROWCOUNT * GRIDWIDTH) * 0.5;
            for (var i = 0; i < ROWCOUNT; ++i) {
                var gridTop = srcY + (i - TOPROWCOUNT) * GRIDWIDTH;
                for (var j = 0; j < COLUMNCOUNT; ++j) {
                    var gridLeft = srcX + j * GRIDWIDTH;
                    if (i >= TOPROWCOUNT) {
                        this.gridGraphics.drawRoundedRect(gridLeft, gridTop, GRIDWIDTH, GRIDWIDTH, 5);
                    }
                }
            }
            this.blocksGraphics = this.game.add.graphics(0, 0);
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
            for (var i = 0; i < 3; ++i) {
                var key = this.game.input.keyboard.addKey(keys[i]);
                key.onDown.add(listeners[i], this);
            }
            //register mouse/touch events:
            this.input.addMoveCallback(this.onMouseMove, this);
            this.input.onDown.add(this.onMouseDown, this);
            var sound = this.game.add.audio('backgroundMusic');
            //sound.play('', 0, .2, true);
            this.resetGame();
        };
        GameState.prototype.createRandomBlock = function () {
            var b = new CircuitGame.Block(this.game);
            //this.blobsContainer.add(b);
            b.typeIndex = this.game.rnd.integerInRange(0, COLORCODES.length - 1);
            return b;
            //return new Blob(this.game.rnd.integerInRange(0,colorCodes.length - 1));
        };
        GameState.prototype.createBlockingBlock = function () {
            var b = new CircuitGame.Block(this.game);
            //this.blobsContainer.add(b);
            b.isBlocking = true;
            return b;
        };
        GameState.prototype.canPlayerBlockMoveToSlot = function (row, col) {
            if (col < 0 || col >= COLUMNCOUNT || row >= ROWCOUNT)
                return false;
            if (row < 0)
                return true;
            return this.slots[row][col] == null;
        };
        GameState.prototype.isValidSlotIndex = function (i, j) {
            if (i < 0 || i >= ROWCOUNT || j < 0 || j >= COLUMNCOUNT)
                return false;
            return true;
        };
        GameState.prototype.resetGame = function () {
            //set default layout:
            this.slots = [];
            //this.blobsContainer.removeAll();
            for (var i = 0; i < ROWCOUNT; ++i) {
                this.slots[i] = [];
                for (var j = 0; j < COLUMNCOUNT; ++j) {
                    this.slots[i][j] = i > ROWCOUNT - 3 ? this.createRandomBlock() : null;
                }
            }
            this.nextBlock = this.createRandomBlock();
            this.punishmentPending = false;
            this.dropStructure();
        };
        GameState.prototype.onMouseMove = function () {
        };
        GameState.prototype.onMouseDown = function () {
        };
        GameState.prototype.moveDown = function () {
            if (this.gameState == GAMESTATE_PLAYING)
                this.tickDown();
        };
        GameState.prototype.moveLeft = function () {
            if (this.gameState == GAMESTATE_PLAYING) {
                if (this.canPlayerBlockMoveToSlot(this.playerBlockRow, this.playerBlockColumn - 1))
                    this.playerBlockColumn--;
            }
        };
        GameState.prototype.moveRight = function () {
            if (this.gameState == GAMESTATE_PLAYING) {
                if (this.canPlayerBlockMoveToSlot(this.playerBlockRow, this.playerBlockColumn + 1))
                    this.playerBlockColumn++;
            }
        };
        GameState.prototype.rotate = function () {
            if (this.gameState == GAMESTATE_PLAYING) {
                var col = this.playerBlockColumn;
                var row = this.playerBlockRow;
                this.playerBlock.flips++;
            }
        };
        GameState.prototype.tickDown = function () {
            this.tickParameter--;
            this.playerCurrentTick++;
            if (this.playerCurrentTick > TICKCOUNT) {
                if (this.canPlayerBlockMoveToSlot(this.playerBlockRow + 1, this.playerBlockColumn)) {
                    //player blob tuple can move down:
                    this.playerCurrentTick = 0;
                    this.playerBlockRow++;
                }
                else {
                    //stop player blob tuple:
                    this.slots[Math.max(0, this.playerBlockRow)][this.playerBlockColumn] = this.playerBlock;
                    //this.slots[Math.max(0,this.playerBlob.row2)][this.playerBlob.column2] = this.playerBlob.blob2;
                    this.dropStructure();
                }
            }
        };
        GameState.prototype.pushPunishment = function () {
            //just to be safe: 
            if (TOPROWCOUNT <= 0)
                return;
            var randomFrac = this.game.rnd.frac();
            if (randomFrac < .75) {
            }
            else if (randomFrac < .9) {
                //15% chance that a single block drops 
                var columnIdx = this.game.rnd.integerInRange(0, COLUMNCOUNT - 1);
                if (this.slots[0][columnIdx] == null)
                    this.slots[0][columnIdx] = this.createBlockingBlock();
            }
            else if (randomFrac < .975) {
                //7.5% chance that a single row of blocks drops
                for (var j = 0; j < COLUMNCOUNT; ++j) {
                    if (this.slots[0][j] == null)
                        this.slots[0][j] = this.createBlockingBlock();
                }
            }
            else {
                //2.5% chance that {MIN (3) and (number of top rows)} rows of blocks drop:
                var punishRows = Math.min(3, TOPROWCOUNT);
                for (var i = 0; i < punishRows; ++i) {
                    for (var j = 0; j < COLUMNCOUNT; ++j) {
                        if (this.slots[i][j] == null)
                            this.slots[i][j] = this.createBlockingBlock();
                    }
                }
            }
            this.dropStructure();
        };
        GameState.prototype.dropStructure = function () {
            var dropping = false;
            this.totalRowsDrop = 0;
            //resolve per column:
            for (var j = 0; j < COLUMNCOUNT; ++j) {
                var foundFirstEmptySlot = false;
                var nextEmptyIndex = 0;
                //bottom up:
                for (var i = ROWCOUNT - 1; i >= 0; i--) {
                    var block = this.slots[i][j];
                    if (block == null) {
                        if (!foundFirstEmptySlot) {
                            foundFirstEmptySlot = true;
                            nextEmptyIndex = i;
                        }
                    }
                    else {
                        if (foundFirstEmptySlot) {
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
            if (dropping) {
                this.gameState = GAMESTATE_DROPPING;
                this.gameStateParameter = 0;
            }
            else {
                this.resolveChains();
            }
        };
        GameState.prototype.getConnectedElements = function (startRow, startColumn) {
            var queue = [];
            var queueIndices = [];
            var srcBlock = this.slots[startRow][startColumn];
            srcBlock.testSource = srcBlock;
            queue[0] = srcBlock;
            queueIndices[0] = [startRow, startColumn];
            var queueIdx = 0;
            while (queueIdx < queue.length) {
                var i = queueIndices[queueIdx][0];
                var j = queueIndices[queueIdx][1];
                var block = queue[queueIdx];
                queueIdx++;
                if (block.isBlocking)
                    continue;
                //traverse neighbors:
                for (var n = 0; n < 4; ++n) {
                    var ni = i + NEIGHBORDELTAINDICES[n][0];
                    var nj = j + NEIGHBORDELTAINDICES[n][1];
                    if (this.isValidSlotIndex(ni, nj)) {
                        var nBlock = this.slots[ni][nj];
                        if (nBlock != null && nBlock.testSource != srcBlock && (nBlock.isBlocking || nBlock.typeIndex == srcBlock.typeIndex)) {
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
        };
        GameState.prototype.resolveChains = function () {
            var foundChains = false;
            //unlink everything:
            for (var i = 0; i < ROWCOUNT; ++i) {
                for (var j = 0; j < COLUMNCOUNT; ++j) {
                    var block = this.slots[i][j];
                    if (block != null) {
                        block.removing = false;
                        block.testSource = null;
                    }
                }
            }
            for (var i = 0; i < ROWCOUNT; ++i) {
                for (var j = 0; j < COLUMNCOUNT; ++j) {
                    var block = this.slots[i][j];
                    if (block != null && !block.isBlocking) {
                        //find connections to neighbors:
                        for (var n = 0; n < 4; ++n) {
                            var ni = i + NEIGHBORDELTAINDICES[n][0];
                            var nj = j + NEIGHBORDELTAINDICES[n][1];
                            if (this.isValidSlotIndex(ni, nj)) {
                                var nBlob = this.slots[ni][nj];
                                block.chainedToNeighbor[n] = (nBlob != null && block.typeIndex == nBlob.typeIndex);
                            }
                            else {
                                block.chainedToNeighbor[n] = false;
                            }
                        }
                        //test if blob should be removed:
                        if (!block.removing && block.testSource == null) {
                            var chain = this.getConnectedElements(i, j);
                            var coloredCount = 0;
                            chain.forEach(function (b) { if (!b.isBlocking)
                                ++coloredCount; });
                            if (coloredCount >= 4) {
                                chain.forEach(function (b) { b.removing = true; });
                                foundChains = true;
                            }
                        }
                    }
                }
            }
            if (foundChains) {
                //resolve chains...
                this.gameState = GAMESTATE_REMOVING;
                this.gameStateParameter = 0;
            }
            else {
                //continue game...
                if (this.punishmentPending) {
                    this.punishmentPending = false;
                    this.pushPunishment();
                }
                else {
                    this.dropNewBlock();
                    this.punishmentPending = true;
                }
            }
        };
        GameState.prototype.dropNewBlock = function () {
            this.playerCurrentTick = 0;
            this.playerBlock = this.nextBlock;
            this.nextBlock = this.createRandomBlock();
            this.gameState = GAMESTATE_PLAYING;
            this.gameStateParameter = 0;
            this.playerBlockColumn = COLUMNCOUNT / 2 - 1;
            this.playerBlockRow = TOPROWCOUNT;
            this.playerFracColumnBuffer = this.playerBlockColumn;
            //test losing condition:
            if (this.slots[TOPROWCOUNT][this.playerBlockColumn]) {
                //LOSE:
                this.resetGame();
            }
        };
        GameState.prototype.update = function () {
            var dt = this.game.time.physicsElapsed;
            switch (this.gameState) {
                case GAMESTATE_PLAYING:
                    {
                        var speedUp = this.cursors.down.isDown;
                        this.tickParameter += (speedUp ? 45 : 2) * dt;
                        if (this.tickParameter > 1)
                            this.tickDown();
                        break;
                    }
                case GAMESTATE_DROPPING:
                    {
                        var dropDuration = 0.3 + this.totalRowsDrop * .05;
                        this.gameStateParameter += dt / dropDuration;
                        if (this.gameStateParameter > 1) {
                            //after drop, always resolve potential new chain:
                            this.resolveChains();
                        }
                        break;
                    }
                case GAMESTATE_REMOVING:
                    {
                        this.gameStateParameter += 1.5 * dt;
                        if (this.gameStateParameter > 1) {
                            //remove 'removing' blobs from slots:
                            for (var i = 0; i < ROWCOUNT; ++i) {
                                for (var j = 0; j < COLUMNCOUNT; ++j) {
                                    var b = this.slots[i][j];
                                    if (b != null && b.removing) {
                                        this.slots[i][j] = null;
                                        b.destroy();
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
        };
        GameState.prototype.drawBlocks = function () {
            var resolveAlphaFactor = this.gameState == GAMESTATE_REMOVING ? this.gameStateParameter : 1;
            this.blocksGraphics.clear();
            for (var i = 0; i < ROWCOUNT; ++i) {
                for (var j = 0; j < COLUMNCOUNT; ++j) {
                    var block = this.slots[i][j];
                    if (block != null) {
                        var iIdx = i;
                        if (this.gameState == GAMESTATE_DROPPING && block.dropping) {
                            var totalDrop = i - block.dropFromRow;
                            var dropIdx = block.dropFromRow + totalDrop * (1 - Math.cos(this.gameStateParameter * .5 * Math.PI));
                            iIdx = (dropIdx);
                        }
                        block.draw(iIdx, j);
                    }
                }
            }
            if (this.gameState == GAMESTATE_PLAYING) {
                var tickBufferOffset = Math.sin(Math.min(1, this.tickParameter * 1.5) * .5 * Math.PI);
                this.playerFracColumnBuffer = .5 * this.playerFracColumnBuffer + .5 * this.playerBlockColumn;
                var fracPlayerRow = this.playerBlockRow - 1 + (this.playerCurrentTick + tickBufferOffset) / (TICKCOUNT + 1);
                //this.playerBlob.drawTupleAtIndices(this.blobRenderer, fracPlayerRow, this.playerFracColumnBuffer);
                this.playerBlock.draw(fracPlayerRow, this.playerFracColumnBuffer);
                debugText = fracPlayerRow + " " + this.playerFracColumnBuffer;
            }
            //render next blob:
            //this.nextBlob.drawTupleAtIndices(this.blobRenderer, TOPROWCOUNT + 1, COLUMNCOUNT + 1.5);
            this.nextBlock.draw(TOPROWCOUNT + 1, COLUMNCOUNT + 1.5);
            //this.blobRenderer.end();
        };
        GameState.prototype.render = function () {
            this.graphics.clear();
            var srcX = (this.game.width - COLUMNCOUNT * GRIDWIDTH) * 0.5;
            var srcY = (this.game.height - VISIBLEROWCOUNT * GRIDWIDTH) * 0.5;
            var gridTop = 0;
            var gridLeft = 0;
            var color = 0x0;
            //render next blob:
            var nextX = this.game.width / 2 + GRIDWIDTH * COLUMNCOUNT / 2 + 50;
            var nextY = this.game.height / 2 - GRIDWIDTH * VISIBLEROWCOUNT / 2;
            this.graphics.lineStyle(3, 0xaaaaaa, 1);
            this.graphics.beginFill(0x0, .5);
            this.graphics.drawRoundedRect(nextX - 10, nextY - 10, 120, 120, 20);
            this.graphics.endFill();
            //this.nextBlob.render(this.graphics, nextX + 50 - GRIDWIDTH / 2, nextY + 50);
            //render player blob:
            if (this.gameState == GAMESTATE_PLAYING) {
                // var t:number = Math.min(1,this.tickParameter * 1.5);
                var tickBufferOffset = Math.sin(Math.min(1, this.tickParameter * 1.5) * .5 * Math.PI); // (1 - Math.cos(this.tickParameter * Math.PI)) / 2;
                this.playerFracColumnBuffer = .5 * this.playerFracColumnBuffer + .5 * this.playerBlockColumn;
                gridTop = srcY + (this.playerBlockRow - 1 + (this.playerCurrentTick + tickBufferOffset) / (TICKCOUNT + 1) - TOPROWCOUNT) * GRIDWIDTH;
                gridLeft = srcX + this.playerFracColumnBuffer * GRIDWIDTH;
                //this.playerBlob.render(this.graphics, gridLeft, gridTop);
                this.graphics.lineStyle(2, 0xffffff, .5);
                this.graphics.drawRoundedRect(gridLeft, gridTop, GRIDWIDTH, GRIDWIDTH, 10);
            }
            this.game.debug.text("DEBUG: " + debugText, 0, this.game.height - 30);
        };
        return GameState;
    }(Phaser.State));
    CircuitGame.GameState = GameState;
})(CircuitGame || (CircuitGame = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="TitleState.ts"/>
///<reference path="GameState.ts"/>
var CircuitGame;
(function (CircuitGame) {
    var SimpleGame = (function () {
        function SimpleGame() {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content');
            this.game.state.add("GameRunningState", CircuitGame.GameState, false);
            this.game.state.add("TitleScreenState", CircuitGame.TitleState, false);
            this.game.state.start("GameRunningState", true, true);
        }
        return SimpleGame;
    }());
    CircuitGame.SimpleGame = SimpleGame;
})(CircuitGame || (CircuitGame = {}));
window.onload = function () {
    var game = new CircuitGame.SimpleGame();
};
