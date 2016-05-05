var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../../phaser/phaser.d.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
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
        };
        TitleState.prototype.titleClicked = function () {
            this.game.state.start("GameRunningState");
            //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.game.scale.startFullScreen(true);
        };
        return TitleState;
    }(Phaser.State));
    BlokjesGame.TitleState = TitleState;
})(BlokjesGame || (BlokjesGame = {}));
///<reference path="../../phaser/phaser.d.ts"/>
var TOPROWCOUNT = 3;
var VISIBLEROWCOUNT = 12;
var ROWCOUNT = VISIBLEROWCOUNT + TOPROWCOUNT; //12 at the bottom
var COLUMNCOUNT = 6;
var COLORCODES = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff, 0x00ffff];
var TICKCOUNT = 1;
var GRIDWIDTH = 45;
var NEIGHBORDELTAINDICES = [[0, 1], [1, 0], [0, -1], [-1, 0]]; //(right, bottom, left, top) [row][column] - format
var debugText;
var noiseSprite;
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Defs.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var Blob = (function (_super) {
        __extends(Blob, _super);
        function Blob(game) {
            _super.call(this, game);
            this.dxs = [GRIDWIDTH / 3, 0, -GRIDWIDTH / 3, 0];
            this.dys = [0, GRIDWIDTH / 3, 0, -GRIDWIDTH / 3];
            this.blendMode = PIXI.blendModes.NORMAL;
            this.isBlocking = false;
            this.typeIndex = 0; //typeIndex;
            this.removing = false;
            this.testSource = null;
            this.chainedToNeighbor = [false, false, false, false];
            this.dropping = false;
            this.dropFromRow = 0;
            this.blobShader = new Phaser.Filter(this.game, null, this.game.cache.getShader('blobShader'));
            this.filters = [this.blobShader];
            //this.blobShader.uniforms.uSourceColor =  { type: '3f', value: [1.0, 1.0, 0.0] };
            this.blobShader.uniforms.uSourceColor = { type: '3f', value: { x: 0, y: 0, z: 0 } };
            this.blobShader.uniforms.uAlpha = { type: '1f', value: 1.0 };
            this.blobShader.uniforms.uWidth = { type: '1f', value: 1.0 };
            this.blobShader.uniforms.uGlobalOrigin = { type: '2f', value: { x: 0, y: 0 } };
            this.blobShader.uniforms.uCenterType = { type: '1i', value: 0 };
            this.blobShader.uniforms.uNoiseTexture = { type: 'sampler2D', value: noiseSprite.texture, textureData: { repeat: true } };
            //uNoiseTexture
            //this.width = gridWidth;
            //this.height = gridWidth;
            this.beginFill(0xffffff, 1);
            this.drawRect(0, 0, GRIDWIDTH, GRIDWIDTH);
            this.endFill();
        }
        Blob.prototype.updatePosition = function (x, y, alphaFactor) {
            this.position.x = x;
            this.position.y = y;
            var alpha = this.removing ? Math.pow(1.0 - alphaFactor, 2.0) : 1.0;
            if (this.removing)
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
            var color = COLORCODES[this.typeIndex];
            if (this.isBlocking) {
                color = 0x0;
            }
            var cls = this.getFractColor(color);
            this.blobShader.update();
            this.blobShader.uniforms.uSourceColor.value.x = cls[0];
            this.blobShader.uniforms.uSourceColor.value.y = cls[1];
            this.blobShader.uniforms.uSourceColor.value.z = cls[2];
            this.blobShader.uniforms.resolution.value.x = this.game.width;
            this.blobShader.uniforms.resolution.value.y = this.game.height;
            this.blobShader.uniforms.uAlpha.value = alpha;
            this.blobShader.uniforms.uCenterType.value = this.isBlocking ? -1 : this.typeIndex;
            this.blobShader.uniforms.uWidth.value = GRIDWIDTH; // =  { type: '1f', value: 1.0 };
            this.blobShader.uniforms.uGlobalOrigin.value.x = x; // =  { type: '2f', value: { x:0, y:0 } };
            this.blobShader.uniforms.uGlobalOrigin.value.y = (this.game.height - y);
            //debugText = this.blobShader.uniforms.resolution.value.x + " : " + this.blobShader.uniforms.resolution.value.y;
        };
        Blob.prototype.getFractColor = function (color) {
            var blue = color % 0x100; //0x0000XX
            var green = (color - blue) % 0x10000; //0x00XX00
            var red = (color - green - blue); //0xXX0000
            blue = blue / 0xff;
            green = green / 0xff00;
            red = red / 0xff0000;
            return [red, green, blue];
        };
        return Blob;
    }(Phaser.Graphics));
    BlokjesGame.Blob = Blob;
})(BlokjesGame || (BlokjesGame = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Blob.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var BlobTuple = (function () {
        function BlobTuple(blob1, blob2) {
            this._orientation = 0;
            this.renderOrientation = new Phaser.Point(0, -1);
            this.blob1 = blob1;
            this.blob2 = blob2;
            this.orientation = 3;
            this.row = TOPROWCOUNT;
            this.column = COLUMNCOUNT / 2 - 1;
        }
        Object.defineProperty(BlobTuple.prototype, "row2", {
            get: function () {
                return this.row + NEIGHBORDELTAINDICES[this.orientation][0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlobTuple.prototype, "column2", {
            get: function () {
                return this.column + NEIGHBORDELTAINDICES[this.orientation][1];
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
            var to = new Phaser.Point(NEIGHBORDELTAINDICES[this.orientation][1], NEIGHBORDELTAINDICES[this.orientation][0]);
            var angle = Math.acos(this.renderOrientation.dot(to));
            var cross = to.cross(this.renderOrientation);
            var sign = cross < 0 ? 1 : -1;
            this.renderOrientation.rotate(0, 0, sign * .75 * angle);
            this.blob1.updatePosition(x, y, 1);
            this.blob2.updatePosition(x + this.renderOrientation.x * GRIDWIDTH, y + this.renderOrientation.y * GRIDWIDTH, 1);
            //this.blob1.render(graphics, x, y, 1);
            //this.blob2.render(graphics, x + this.renderOrientation.x * gridWidth, y + this.renderOrientation.y * gridWidth, 1);
        };
        return BlobTuple;
    }());
    BlokjesGame.BlobTuple = BlobTuple;
})(BlokjesGame || (BlokjesGame = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="BlobTuple.ts"/>
///<reference path="Blob.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    /*
    const topRowCount:number = 3;
    const visibleRows:number = 12;
    const rows:number = visibleRows + topRowCount; //12 at the bottom
    const columns:number = 6;
    const colorCodes:number[] = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff, 0x00ffff];
    const tickCount:number = 1;
    const gridWidth:number = 45;
    const neighbourDeltaIndices:number[][] = [[0,1], [1,0], [0,-1], [-1,0]]; //(right, bottom, left, top) [row][column] - format
    */
    var GAMESTATE_PLAYING = 0;
    var GAMESTATE_REMOVING = 1;
    var GAMESTATE_DROPPING = 2;
    var GameState = (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            _super.call(this);
        }
        //blobShader:Phaser.Filter;
        GameState.prototype.preload = function () {
            this.game.load.audio("backgroundMusic", ["assets/music.mp3"]);
            this.game.load.image("button", "../../assets/sprites/mushroom2.png", false);
            this.game.load.shader("blobShader", 'assets/blobShader3.frag');
            this.game.load.image('blokje', "assets/blokje.png");
            this.game.load.image('galaxy', "assets/galaxy.jpg");
            this.game.load.image('noise', "assets/noise.jpg");
        };
        GameState.prototype.create = function () {
            var _this = this;
            this.tickParameter = 0;
            this.totalRowsDrop = 0;
            //set component containers:
            var bg = this.game.add.sprite(0, 0, 'galaxy');
            bg.width = this.game.width;
            bg.height = this.game.height;
            noiseSprite = new Phaser.Sprite(this.game, 0, 0, 'noise');
            this.gridGraphics = this.game.add.graphics(0, 0);
            this.gridGraphics.alpha = 0.2;
            this.gridGraphics.lineStyle(2, 0xffffff, 1);
            var srcX = (this.game.width - COLUMNCOUNT * GRIDWIDTH) * 0.5;
            var srcY = (this.game.height - VISIBLEROWCOUNT * GRIDWIDTH) * 0.5;
            for (var i = 0; i < ROWCOUNT; ++i) {
                var gridTop = srcY + (i - TOPROWCOUNT) * GRIDWIDTH;
                for (var j = 0; j < COLUMNCOUNT; ++j) {
                    var gridLeft = srcX + j * GRIDWIDTH;
                    if (i >= TOPROWCOUNT) {
                        this.gridGraphics.drawRect(gridLeft, gridTop, GRIDWIDTH, GRIDWIDTH);
                    }
                }
            }
            this.blobsContainer = this.game.add.group();
            var gr = new Phaser.Graphics(this.game);
            gr.beginFill(0xffffff, 1);
            gr.drawRect((this.game.width - COLUMNCOUNT * GRIDWIDTH) / 2, (this.game.height - VISIBLEROWCOUNT * GRIDWIDTH) / 2, COLUMNCOUNT * GRIDWIDTH, VISIBLEROWCOUNT * GRIDWIDTH);
            gr.drawRect((this.game.width + COLUMNCOUNT * GRIDWIDTH) / 2, (this.game.height - VISIBLEROWCOUNT * GRIDWIDTH) / 2, 300, 300);
            gr.endFill();
            this.blobsContainer.mask = gr;
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
            this.game.add.button(0, 0, "button", function () { _this.resetGame(); }, this);
            var sound = this.game.add.audio('backgroundMusic');
            //sound.play('', 0, .2, true);
            this.resetGame();
        };
        GameState.prototype.createRandomBlob = function () {
            var b = new BlokjesGame.Blob(this.game);
            this.blobsContainer.add(b);
            b.typeIndex = this.game.rnd.integerInRange(0, COLORCODES.length - 1);
            return b;
            //return new Blob(this.game.rnd.integerInRange(0,colorCodes.length - 1));
        };
        GameState.prototype.createBlockingBlob = function () {
            var b = new BlokjesGame.Blob(this.game);
            this.blobsContainer.add(b);
            b.isBlocking = true;
            return b;
        };
        GameState.prototype.createRandomBlobTuple = function () {
            return new BlokjesGame.BlobTuple(this.createRandomBlob(), this.createRandomBlob());
        };
        GameState.prototype.canPlayerBlobMoveToSlot = function (row, col) {
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
            this.blobsContainer.removeAll();
            for (var i = 0; i < ROWCOUNT; ++i) {
                this.slots[i] = [];
                for (var j = 0; j < COLUMNCOUNT; ++j) {
                    this.slots[i][j] = i > ROWCOUNT - 3 ? this.createRandomBlob() : null;
                }
            }
            this.nextBlob = this.createRandomBlobTuple();
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
                if (this.canPlayerBlobMoveToSlot(this.playerBlob.row, this.playerBlob.column - 1)
                    && this.canPlayerBlobMoveToSlot(this.playerBlob.row2, this.playerBlob.column2 - 1))
                    this.playerBlob.column--;
            }
        };
        GameState.prototype.moveRight = function () {
            if (this.gameState == GAMESTATE_PLAYING) {
                if (this.canPlayerBlobMoveToSlot(this.playerBlob.row, this.playerBlob.column + 1)
                    && this.canPlayerBlobMoveToSlot(this.playerBlob.row2, this.playerBlob.column2 + 1))
                    this.playerBlob.column++;
            }
        };
        GameState.prototype.rotate = function () {
            if (this.gameState == GAMESTATE_PLAYING) {
                var col = this.playerBlob.column;
                var row = this.playerBlob.row;
                var orientation = this.playerBlob.orientation;
                this.playerBlob.orientation++;
                if (!this.canPlayerBlobMoveToSlot(this.playerBlob.row2, this.playerBlob.column2)) {
                    //translate main blob to make rotation legal:
                    var deltaIndices = NEIGHBORDELTAINDICES[this.playerBlob.orientation];
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
                        this.playerCurrentTick = TICKCOUNT;
                    }
                }
            }
        };
        GameState.prototype.tickDown = function () {
            this.tickParameter--;
            this.playerCurrentTick++;
            if (this.playerCurrentTick > TICKCOUNT) {
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
                    this.slots[0][columnIdx] = this.createBlockingBlob();
            }
            else if (randomFrac < .975) {
                //7.5% chance that a single row of blocks drops
                for (var j = 0; j < COLUMNCOUNT; ++j) {
                    if (this.slots[0][j] == null)
                        this.slots[0][j] = this.createBlockingBlob();
                }
            }
            else {
                //2.5% chance that {MIN (3) and (number of top rows)} rows of blocks drop:
                var punishRows = Math.min(3, TOPROWCOUNT);
                for (var i = 0; i < punishRows; ++i) {
                    for (var j = 0; j < COLUMNCOUNT; ++j) {
                        if (this.slots[i][j] == null)
                            this.slots[i][j] = this.createBlockingBlob();
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
        GameState.prototype.getConnectedElements = function (startRow, startColumn) {
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
                    var ni = i + NEIGHBORDELTAINDICES[n][0];
                    var nj = j + NEIGHBORDELTAINDICES[n][1];
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
        GameState.prototype.resolveChains = function () {
            var foundChains = false;
            //unlink everything:
            for (var i = 0; i < ROWCOUNT; ++i) {
                for (var j = 0; j < COLUMNCOUNT; ++j) {
                    var blob = this.slots[i][j];
                    if (blob != null) {
                        blob.removing = false;
                        blob.testSource = null;
                    }
                }
            }
            for (var i = 0; i < ROWCOUNT; ++i) {
                for (var j = 0; j < COLUMNCOUNT; ++j) {
                    var blob = this.slots[i][j];
                    if (blob != null && !blob.isBlocking) {
                        //find connections to neighbors:
                        for (var n = 0; n < 4; ++n) {
                            var ni = i + NEIGHBORDELTAINDICES[n][0];
                            var nj = j + NEIGHBORDELTAINDICES[n][1];
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
        GameState.prototype.dropNewBlobTuple = function () {
            this.playerCurrentTick = 0;
            this.playerBlob = this.nextBlob;
            this.nextBlob = this.createRandomBlobTuple();
            this.gameState = GAMESTATE_PLAYING;
            this.gameStateParameter = 0;
            this.playerFracColumnBuffer = this.playerBlob.column;
            //test losing condition:
            if (this.slots[TOPROWCOUNT][this.playerBlob.column]) {
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
        };
        GameState.prototype.render = function () {
            this.graphics.clear();
            var srcX = (this.game.width - COLUMNCOUNT * GRIDWIDTH) * 0.5;
            var srcY = (this.game.height - VISIBLEROWCOUNT * GRIDWIDTH) * 0.5;
            var gridTop = 0;
            var gridLeft = 0;
            var color = 0x0;
            var resolveAlphaFactor = this.gameState == GAMESTATE_REMOVING ? this.gameStateParameter : 1;
            for (var i = 0; i < ROWCOUNT; ++i) {
                gridTop = srcY + (i - TOPROWCOUNT) * GRIDWIDTH;
                for (var j = 0; j < COLUMNCOUNT; ++j) {
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
                    var blob = this.slots[i][j];
                    if (blob != null) {
                        var y = gridTop;
                        if (this.gameState == GAMESTATE_DROPPING && blob.dropping) {
                            var totalDrop = i - blob.dropFromRow;
                            var dropIdx = blob.dropFromRow + totalDrop * (1 - Math.cos(this.gameStateParameter * .5 * Math.PI));
                            y = srcY + (dropIdx - TOPROWCOUNT) * GRIDWIDTH;
                        }
                        blob.updatePosition(gridLeft, y, resolveAlphaFactor);
                    }
                }
            }
            //render next blob:
            var nextX = this.game.width / 2 + GRIDWIDTH * COLUMNCOUNT / 2 + 50;
            var nextY = this.game.height / 2 - GRIDWIDTH * VISIBLEROWCOUNT / 2;
            this.graphics.lineStyle(1, 0xaaaaaa, 1);
            this.graphics.drawRoundedRect(nextX, nextY, 100, 100, 20);
            this.nextBlob.render(this.graphics, nextX + 50 - GRIDWIDTH / 2, nextY + 50);
            //render player blob:
            if (this.gameState == GAMESTATE_PLAYING) {
                // var t:number = Math.min(1,this.tickParameter * 1.5);
                var tickBufferOffset = Math.sin(Math.min(1, this.tickParameter * 1.5) * .5 * Math.PI); // (1 - Math.cos(this.tickParameter * Math.PI)) / 2;
                this.playerFracColumnBuffer = .5 * this.playerFracColumnBuffer + .5 * this.playerBlob.column;
                gridTop = srcY + (this.playerBlob.row - 1 + (this.playerCurrentTick + tickBufferOffset) / (TICKCOUNT + 1) - TOPROWCOUNT) * GRIDWIDTH;
                gridLeft = srcX + this.playerFracColumnBuffer * GRIDWIDTH;
                this.playerBlob.render(this.graphics, gridLeft, gridTop);
                this.graphics.lineStyle(2, 0xffffff, .5);
                this.graphics.drawRoundedRect(gridLeft, gridTop, GRIDWIDTH, GRIDWIDTH, 10);
                this.game.debug.text("ROW: " + this.playerBlob.row.toString(), 0, 50);
                this.game.debug.text("TICK: " + this.playerCurrentTick.toString(), 0, 100);
            }
            this.game.debug.text("DROPS: " + this.totalRowsDrop, 0, 150);
            this.game.debug.text("DEBUG: " + debugText, 0, this.game.height - 20);
            /*
            this.graphics.lineStyle(0);
            this.graphics.beginFill(0x0, 1);
            this.graphics.drawRect(this.game.width / 2 - columns * gridWidth / 2,
                                    this.game.height / 2 - (rows - topRowCount) * gridWidth / 2 - 100,
                                    columns * gridWidth, 100);
            this.graphics.endFill();
            */
        };
        return GameState;
    }(Phaser.State));
    BlokjesGame.GameState = GameState;
})(BlokjesGame || (BlokjesGame = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="TitleState.ts"/>
///<reference path="GameState.ts"/>
var BlokjesGame;
(function (BlokjesGame) {
    var SimpleGame = (function () {
        function SimpleGame() {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content');
            this.game.state.add("GameRunningState", BlokjesGame.GameState, false);
            this.game.state.add("TitleScreenState", BlokjesGame.TitleState, false);
            this.game.state.start("GameRunningState", true, true);
        }
        return SimpleGame;
    }());
    BlokjesGame.SimpleGame = SimpleGame;
})(BlokjesGame || (BlokjesGame = {}));
window.onload = function () {
    var game = new BlokjesGame.SimpleGame();
};
