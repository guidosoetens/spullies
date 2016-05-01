var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../../phaser/phaser.d.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var TitleScreenState = (function (_super) {
        __extends(TitleScreenState, _super);
        function TitleScreenState() {
            _super.call(this);
        }
        TitleScreenState.prototype.preload = function () {
            this.load.image("peach", "peachy.png");
        };
        TitleScreenState.prototype.create = function () {
            var image = this.game.cache.getImage("peach");
            this.titleScreenImage = this.add.sprite((this.game.width - image.width) / 2, (this.game.height - image.height) / 2, "peach");
            this.input.onTap.addOnce(this.titleClicked, this);
        };
        TitleScreenState.prototype.titleClicked = function () {
            this.game.state.start("GameRunningState");
            //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.game.scale.startFullScreen(true);
        };
        return TitleScreenState;
    }(Phaser.State));
    BlokjesGame.TitleScreenState = TitleScreenState;
})(BlokjesGame || (BlokjesGame = {}));
///<reference path="../../phaser/phaser.d.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var topRowCount = 3;
    var visibleRows = 12;
    var rows = visibleRows + topRowCount; //12 at the bottom
    var columns = 6;
    var colorCodes = [0xff0000, 0x00ff00, 0x0000ff]; //, 0xffff00, 0xff00ff];//, 0x00ffff];
    var tickCount = 1;
    var gridWidth = 40;
    var neighbourDeltaIndices = [[0, 1], [1, 0], [0, -1], [-1, 0]]; //(right, bottom, left, top) [row][column] - format
    var GAMESTATE_PLAYING = 0;
    var GAMESTATE_REMOVING = 1;
    var GAMESTATE_DROPPING = 2;
    var debugText;
    var BlobTuple = (function () {
        function BlobTuple(blob1, blob2) {
            this._orientation = 0;
            this.renderOrientation = new Phaser.Point(0, -1);
            this.blob1 = blob1;
            this.blob2 = blob2;
            this.orientation = 3;
            this.row = topRowCount;
            this.column = columns / 2 - 1;
        }
        Object.defineProperty(BlobTuple.prototype, "row2", {
            get: function () {
                return this.row + neighbourDeltaIndices[this.orientation][0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlobTuple.prototype, "column2", {
            get: function () {
                return this.column + neighbourDeltaIndices[this.orientation][1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlobTuple.prototype, "orientation", {
            get: function () {
                return this._orientation;
            },
            set: function (value) {
                value = Math.round(value);
                if (value < 0)
                    value += 4;
                value = value % 4;
                this._orientation = value;
            },
            enumerable: true,
            configurable: true
        });
        BlobTuple.prototype.render = function (graphics, x, y) {
            var to = new Phaser.Point(neighbourDeltaIndices[this.orientation][1], neighbourDeltaIndices[this.orientation][0]);
            var angle = Math.acos(this.renderOrientation.dot(to));
            var cross = to.cross(this.renderOrientation);
            var sign = cross < 0 ? 1 : -1;
            this.renderOrientation.rotate(0, 0, sign * .75 * angle);
            this.blob1.render(graphics, x, y, 1);
            this.blob2.render(graphics, x + this.renderOrientation.x * gridWidth, y + this.renderOrientation.y * gridWidth, 1);
        };
        return BlobTuple;
    }());
    BlokjesGame.BlobTuple = BlobTuple;
    var Blob = (function () {
        function Blob() {
            this.dxs = [gridWidth / 3, 0, -gridWidth / 3, 0];
            this.dys = [0, gridWidth / 3, 0, -gridWidth / 3];
            this.isBlocking = false;
            this.typeIndex = 0; //typeIndex;
            this.removing = false;
            this.testSource = null;
            this.chainedToNeighbor = [false, false, false, false];
            this.dropping = false;
            this.dropFromRow = 0;
        }
        Blob.prototype.render = function (graphics, x, y, alphaParameter) {
            var alpha = this.removing ? (1.0 - alphaParameter) : 1.0;
            var color = colorCodes[this.typeIndex];
            if (this.isBlocking) {
                color = 0x777777;
            }
            graphics.lineStyle(0);
            graphics.beginFill(color, alpha);
            graphics.drawCircle(x, y, gridWidth);
            graphics.endFill();
            for (var i = 0; i < 4; ++i) {
                if (this.chainedToNeighbor[i]) {
                    graphics.lineStyle(1, 0x0, 1 * alpha);
                    graphics.beginFill(0xffffff, 0.8 * alpha);
                    graphics.drawCircle(x + this.dxs[i], y + this.dys[i], 5);
                    graphics.endFill();
                }
            }
        };
        return Blob;
    }());
    BlokjesGame.Blob = Blob;
    var GameRunningState = (function (_super) {
        __extends(GameRunningState, _super);
        function GameRunningState() {
            _super.call(this);
        }
        GameRunningState.prototype.preload = function () {
            this.game.load.audio("backgroundMusic", ["music2.mp3"]);
            this.game.load.image("button", "../../assets/sprites/mushroom2.png", false);
            this.game.load.shader("blobShader", 'blobShader.frag');
            this.game.load.image('blokje', "blokje.png");
        };
        GameRunningState.prototype.create = function () {
            var _this = this;
            this.tickParameter = 0;
            this.totalRowsDrop = 0;
            //init graphics:
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
            //reset button:
            //this.game.load.image("button", "../../assets/sprites/mushroom2.png", false);
            this.game.add.button(0, 0, "button", function () { _this.resetGame(); }, this);
            var sound = this.game.add.audio('backgroundMusic');
            //sound.play('', 0, .2, true);
            this.blobShader = new Phaser.Filter(this.game, null, this.game.cache.getShader('blobShader'));
            this.blobShader.uniforms.iChannel0 = { type: 'sampler2D', value: null, textureData: { repeat: true } };
            this.blobShader.uniforms.yoloSwaggeriez = { type: '1f', value: 1.0 };
            var sprite = this.game.add.sprite(0, 0, 'blokje');
            sprite.width = 100;
            sprite.height = 100;
            sprite.filters = [this.blobShader];
            this.resetGame();
        };
        GameRunningState.prototype.createRandomBlob = function () {
            var b = new Blob();
            b.typeIndex = this.game.rnd.integerInRange(0, colorCodes.length - 1);
            return b;
            //return new Blob(this.game.rnd.integerInRange(0,colorCodes.length - 1));
        };
        GameRunningState.prototype.createBlockingBlob = function () {
            var b = new Blob();
            b.isBlocking = true;
            return b;
        };
        GameRunningState.prototype.createRandomBlobTuple = function () {
            return new BlobTuple(this.createRandomBlob(), this.createRandomBlob());
        };
        GameRunningState.prototype.canPlayerBlobMoveToSlot = function (row, col) {
            if (col < 0 || col >= columns || row >= rows)
                return false;
            if (row < 0)
                return true;
            return this.slots[row][col] == null;
        };
        GameRunningState.prototype.isValidSlotIndex = function (i, j) {
            if (i < 0 || i >= rows || j < 0 || j >= columns)
                return false;
            return true;
        };
        GameRunningState.prototype.resetGame = function () {
            //set default layout:
            this.slots = [];
            for (var i = 0; i < rows; ++i) {
                this.slots[i] = [];
                for (var j = 0; j < columns; ++j) {
                    this.slots[i][j] = i > rows - 3 ? this.createRandomBlob() : null;
                }
            }
            this.nextBlob = this.createRandomBlobTuple();
            this.punishmentPending = false;
            this.dropStructure();
        };
        GameRunningState.prototype.onMouseMove = function () {
        };
        GameRunningState.prototype.onMouseDown = function () {
        };
        GameRunningState.prototype.moveDown = function () {
            if (this.gameState == GAMESTATE_PLAYING)
                this.tickDown();
        };
        GameRunningState.prototype.moveLeft = function () {
            if (this.gameState == GAMESTATE_PLAYING) {
                if (this.canPlayerBlobMoveToSlot(this.playerBlob.row, this.playerBlob.column - 1)
                    && this.canPlayerBlobMoveToSlot(this.playerBlob.row2, this.playerBlob.column2 - 1))
                    this.playerBlob.column--;
            }
        };
        GameRunningState.prototype.moveRight = function () {
            if (this.gameState == GAMESTATE_PLAYING) {
                if (this.canPlayerBlobMoveToSlot(this.playerBlob.row, this.playerBlob.column + 1)
                    && this.canPlayerBlobMoveToSlot(this.playerBlob.row2, this.playerBlob.column2 + 1))
                    this.playerBlob.column++;
            }
        };
        GameRunningState.prototype.rotate = function () {
            if (this.gameState == GAMESTATE_PLAYING) {
                var col = this.playerBlob.column;
                var row = this.playerBlob.row;
                var orientation = this.playerBlob.orientation;
                this.playerBlob.orientation++;
                if (!this.canPlayerBlobMoveToSlot(this.playerBlob.row2, this.playerBlob.column2)) {
                    //translate main blob to make rotation legal:
                    var deltaIndices = neighbourDeltaIndices[this.playerBlob.orientation];
                    this.playerBlob.row -= deltaIndices[0];
                    this.playerBlob.column -= deltaIndices[1];
                    if (!this.canPlayerBlobMoveToSlot(this.playerBlob.row, this.playerBlob.column)) {
                        //rotation seems to be illegal -> revert to original state:
                        this.playerBlob.row = row;
                        this.playerBlob.column = col;
                        this.playerBlob.orientation = orientation;
                    }
                    else if (deltaIndices[0] == 1) {
                        //note: in this case, the blob was pushed upwards, so adjust the current 'tick' accordingly...
                        this.playerCurrentTick = tickCount;
                    }
                }
            }
        };
        GameRunningState.prototype.tickDown = function () {
            this.tickParameter--;
            this.playerCurrentTick++;
            if (this.playerCurrentTick > tickCount) {
                if (this.canPlayerBlobMoveToSlot(this.playerBlob.row + 1, this.playerBlob.column) && this.canPlayerBlobMoveToSlot(this.playerBlob.row2 + 1, this.playerBlob.column2)) {
                    //player blob tuple can move down:
                    this.playerCurrentTick = 0;
                    this.playerBlob.row++;
                }
                else {
                    //stop player blob tuple:
                    this.slots[Math.max(0, this.playerBlob.row)][this.playerBlob.column] = this.playerBlob.blob1;
                    this.slots[Math.max(0, this.playerBlob.row2)][this.playerBlob.column2] = this.playerBlob.blob2;
                    this.dropStructure();
                }
            }
        };
        GameRunningState.prototype.pushPunishment = function () {
            //just to be safe: 
            if (topRowCount <= 0)
                return;
            var randomFrac = this.game.rnd.frac();
            if (randomFrac < .75) {
            }
            else if (randomFrac < .9) {
                //15% chance that a single block drops 
                var columnIdx = this.game.rnd.integerInRange(0, columns - 1);
                if (this.slots[0][columnIdx] == null)
                    this.slots[0][columnIdx] = this.createBlockingBlob();
            }
            else if (randomFrac < .975) {
                //7.5% chance that a single row of blocks drops
                for (var j = 0; j < columns; ++j) {
                    if (this.slots[0][j] == null)
                        this.slots[0][j] = this.createBlockingBlob();
                }
            }
            else {
                //2.5% chance that {MIN (3) and (number of top rows)} rows of blocks drop:
                var punishRows = Math.min(3, topRowCount);
                for (var i = 0; i < punishRows; ++i) {
                    for (var j = 0; j < columns; ++j) {
                        if (this.slots[i][j] == null)
                            this.slots[i][j] = this.createBlockingBlob();
                    }
                }
            }
            this.dropStructure();
        };
        GameRunningState.prototype.dropStructure = function () {
            var dropping = false;
            this.totalRowsDrop = 0;
            //resolve per column:
            for (var j = 0; j < columns; ++j) {
                var foundFirstEmptySlot = false;
                var nextEmptyIndex = 0;
                //bottom up:
                for (var i = rows - 1; i >= 0; i--) {
                    var blob = this.slots[i][j];
                    if (blob == null) {
                        if (!foundFirstEmptySlot) {
                            foundFirstEmptySlot = true;
                            nextEmptyIndex = i;
                        }
                    }
                    else {
                        if (foundFirstEmptySlot) {
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
            if (dropping) {
                this.gameState = GAMESTATE_DROPPING;
                this.gameStateParameter = 0;
            }
            else {
                this.resolveChains();
            }
        };
        GameRunningState.prototype.getConnectedElements = function (startRow, startColumn) {
            var queue = [];
            var queueIndices = [];
            var srcBlob = this.slots[startRow][startColumn];
            srcBlob.testSource = srcBlob;
            queue[0] = srcBlob;
            queueIndices[0] = [startRow, startColumn];
            var queueIdx = 0;
            while (queueIdx < queue.length) {
                var i = queueIndices[queueIdx][0];
                var j = queueIndices[queueIdx][1];
                var blob = queue[queueIdx];
                queueIdx++;
                if (blob.isBlocking)
                    continue;
                //traverse neighbors:
                for (var n = 0; n < 4; ++n) {
                    var ni = i + neighbourDeltaIndices[n][0];
                    var nj = j + neighbourDeltaIndices[n][1];
                    if (this.isValidSlotIndex(ni, nj)) {
                        var nBlob = this.slots[ni][nj];
                        if (nBlob != null && nBlob.testSource != srcBlob && (nBlob.isBlocking || nBlob.typeIndex == srcBlob.typeIndex)) {
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
        };
        GameRunningState.prototype.resolveChains = function () {
            var foundChains = false;
            //unlink everything:
            for (var i = 0; i < rows; ++i) {
                for (var j = 0; j < columns; ++j) {
                    var blob = this.slots[i][j];
                    if (blob != null) {
                        blob.removing = false;
                        blob.testSource = null;
                    }
                }
            }
            for (var i = 0; i < rows; ++i) {
                for (var j = 0; j < columns; ++j) {
                    var blob = this.slots[i][j];
                    if (blob != null && !blob.isBlocking) {
                        //find connections to neighbors:
                        for (var n = 0; n < 4; ++n) {
                            var ni = i + neighbourDeltaIndices[n][0];
                            var nj = j + neighbourDeltaIndices[n][1];
                            if (this.isValidSlotIndex(ni, nj)) {
                                var nBlob = this.slots[ni][nj];
                                blob.chainedToNeighbor[n] = (nBlob != null && blob.typeIndex == nBlob.typeIndex);
                            }
                            else {
                                blob.chainedToNeighbor[n] = false;
                            }
                        }
                        //test if blob should be removed:
                        if (!blob.removing && blob.testSource == null) {
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
                    this.dropNewBlobTuple();
                    this.punishmentPending = true;
                }
            }
        };
        GameRunningState.prototype.dropNewBlobTuple = function () {
            this.playerCurrentTick = 0;
            this.playerBlob = this.nextBlob;
            this.nextBlob = this.createRandomBlobTuple();
            this.gameState = GAMESTATE_PLAYING;
            this.gameStateParameter = 0;
            this.playerFracColumnBuffer = this.playerBlob.column;
            //test losing condition:
            if (this.slots[topRowCount][this.playerBlob.column]) {
                //LOSE:
                this.resetGame();
            }
        };
        GameRunningState.prototype.update = function () {
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
                            for (var i = 0; i < rows; ++i) {
                                for (var j = 0; j < columns; ++j) {
                                    var b = this.slots[i][j];
                                    if (b != null && b.removing)
                                        this.slots[i][j] = null;
                                }
                            }
                            //after resolving chains, do a new drop:
                            this.dropStructure();
                        }
                        break;
                    }
            }
            this.blobShader.update(this.game.input.mousePointer);
            this.blobShader.uniforms.yoloSwaggeriez.value = 1.0;
            if (this.gameState == GAMESTATE_PLAYING)
                this.blobShader.uniforms.yoloSwaggeriez.value = this.playerBlob.row / rows;
        };
        GameRunningState.prototype.render = function () {
            this.graphics.clear();
            var srcX = (this.game.width - columns * gridWidth) * 0.5;
            var srcY = (this.game.height - visibleRows * gridWidth) * 0.5;
            var gridTop = 0;
            var gridLeft = 0;
            var color = 0x0;
            var resolveAlphaFactor = this.gameState == GAMESTATE_REMOVING ? this.gameStateParameter : 1;
            for (var i = 0; i < rows; ++i) {
                gridTop = srcY + (i - topRowCount) * gridWidth;
                for (var j = 0; j < columns; ++j) {
                    gridLeft = srcX + j * gridWidth;
                    if (i >= topRowCount) {
                        this.graphics.lineStyle(1, 0xaaaaaa, 1);
                        this.graphics.drawRect(gridLeft, gridTop, gridWidth, gridWidth);
                        this.graphics.lineStyle(0);
                    }
                    /*
                    this.graphics.lineStyle(1, 0xaaaaaa, 1);
                    this.graphics.drawRect(gridLeft, gridTop, gridWidth, gridWidth);
                    this.graphics.lineStyle(0);
                    */
                    var blob = this.slots[i][j];
                    if (blob != null) {
                        var y = gridTop;
                        if (this.gameState == GAMESTATE_DROPPING && blob.dropping) {
                            var totalDrop = i - blob.dropFromRow;
                            var dropIdx = blob.dropFromRow + totalDrop * (1 - Math.cos(this.gameStateParameter * .5 * Math.PI));
                            y = srcY + (dropIdx - topRowCount) * gridWidth;
                        }
                        blob.render(this.graphics, gridLeft + gridWidth / 2, y + gridWidth / 2, resolveAlphaFactor);
                    }
                }
            }
            //render next blob:
            var nextX = this.game.width / 2 + gridWidth * columns / 2 + 50;
            var nextY = this.game.height / 2 - gridWidth * visibleRows / 2;
            this.graphics.lineStyle(1, 0xaaaaaa, 1);
            this.graphics.drawRoundedRect(nextX, nextY, 100, 100, 20);
            this.nextBlob.render(this.graphics, nextX + 50, nextY + 50 + gridWidth / 2);
            //render player blob:
            if (this.gameState == GAMESTATE_PLAYING) {
                // var t:number = Math.min(1,this.tickParameter * 1.5);
                var tickBufferOffset = Math.sin(Math.min(1, this.tickParameter * 1.5) * .5 * Math.PI); // (1 - Math.cos(this.tickParameter * Math.PI)) / 2;
                this.playerFracColumnBuffer = .5 * this.playerFracColumnBuffer + .5 * this.playerBlob.column;
                gridTop = srcY + (this.playerBlob.row - 1 + (this.playerCurrentTick + tickBufferOffset) / (tickCount + 1) - topRowCount) * gridWidth;
                gridLeft = srcX + this.playerFracColumnBuffer * gridWidth;
                this.playerBlob.render(this.graphics, gridLeft + gridWidth / 2, gridTop + gridWidth / 2);
                this.graphics.lineStyle(2, 0xffffff, .5);
                this.graphics.drawRoundedRect(gridLeft, gridTop, gridWidth, gridWidth, 10);
                this.game.debug.text("ROW: " + this.playerBlob.row.toString(), 0, 50);
                this.game.debug.text("TICK: " + this.playerCurrentTick.toString(), 0, 100);
            }
            this.game.debug.text("DROPS: " + this.totalRowsDrop, 0, 150);
            this.game.debug.text("DEBUG: " + debugText, 0, this.game.height - 20);
            this.graphics.lineStyle(0);
            this.graphics.beginFill(0x0, 1);
            this.graphics.drawRect(this.game.width / 2 - columns * gridWidth / 2, this.game.height / 2 - (rows - topRowCount) * gridWidth / 2 - 100, columns * gridWidth, 100);
            this.graphics.endFill();
        };
        return GameRunningState;
    }(Phaser.State));
    BlokjesGame.GameRunningState = GameRunningState;
})(BlokjesGame || (BlokjesGame = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="titleState.ts"/>
///<reference path="gameState.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var SimpleGame = (function () {
        function SimpleGame() {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content');
            this.game.state.add("GameRunningState", BlokjesGame.GameRunningState, false);
            this.game.state.add("TitleScreenState", BlokjesGame.TitleScreenState, false);
            this.game.state.start("GameRunningState", true, true);
        }
        return SimpleGame;
    }());
    BlokjesGame.SimpleGame = SimpleGame;
})(BlokjesGame || (BlokjesGame = {}));
window.onload = function () {
    var game = new BlokjesGame.SimpleGame();
};
