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
    var rows = 10;
    var cols = 6;
    var colorCodes = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    var tickCount = 2;
    var gridWidth = 40;
    var BlobTuple = (function () {
        function BlobTuple(blob1, blob2) {
            this._orientation = 0;
            this.blob1 = blob1;
            this.blob2 = blob2;
            this.orientation = 0;
            this.row = -1;
            this.column = cols / 2 - 1;
        }
        Object.defineProperty(BlobTuple.prototype, "row2", {
            get: function () {
                return this.row + this.getDiffIndexSecondBlob()[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BlobTuple.prototype, "column2", {
            get: function () {
                return this.column + this.getDiffIndexSecondBlob()[1];
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
        BlobTuple.prototype.getDiffIndexSecondBlob = function () {
            switch (this.orientation) {
                case 1:
                    return [1, 0];
                case 2:
                    return [0, -1];
                case 3:
                    return [-1, 0];
                default:
                    return [0, 1];
            }
        };
        BlobTuple.prototype.render = function (graphics, x, y) {
            this.blob1.render(graphics, x, y);
            var diffIndices = this.getDiffIndexSecondBlob();
            this.blob2.render(graphics, x + diffIndices[1] * gridWidth, y + diffIndices[0] * gridWidth);
        };
        return BlobTuple;
    }());
    BlokjesGame.BlobTuple = BlobTuple;
    var Blob = (function () {
        function Blob(typeIndex) {
            this.typeIndex = typeIndex;
        }
        Blob.prototype.render = function (graphics, x, y) {
            var color = colorCodes[this.typeIndex];
            graphics.beginFill(color);
            graphics.drawCircle(x, y, gridWidth);
            graphics.endFill();
        };
        return Blob;
    }());
    BlokjesGame.Blob = Blob;
    var GameRunningState = (function (_super) {
        __extends(GameRunningState, _super);
        function GameRunningState() {
            _super.call(this);
        }
        GameRunningState.prototype.create = function () {
            var _this = this;
            this.tickParameter = 0;
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
            this.game.load.image("button", "../../assets/sprites/mushroom2.png", false);
            this.game.add.button(0, 0, "button", function () { _this.resetGame(); }, this);
            this.resetGame();
        };
        GameRunningState.prototype.createRandomBlob = function () {
            return new Blob(this.game.rnd.integerInRange(0, 5));
        };
        GameRunningState.prototype.createRandomBlobTuple = function () {
            return new BlobTuple(this.createRandomBlob(), this.createRandomBlob());
        };
        GameRunningState.prototype.resetGame = function () {
            //set default layout:
            this.slots = [];
            for (var i = 0; i < rows; ++i) {
                this.slots[i] = [];
                for (var j = 0; j < cols; ++j) {
                    this.slots[i][j] = i > rows - 3 ? this.createRandomBlob() : null;
                }
            }
            this.nextBlob = this.createRandomBlobTuple();
            this.dropNewBlock();
        };
        GameRunningState.prototype.onMouseMove = function () {
        };
        GameRunningState.prototype.onMouseDown = function () {
        };
        GameRunningState.prototype.moveDown = function () {
            this.tickDown();
        };
        GameRunningState.prototype.moveLeft = function () {
            if (this.playerBlob.column > 0 && this.playerBlob.column2 > 0) {
                //does first blob allow translation?
                if (this.playerBlob.row < 0 || this.slots[this.playerBlob.row][this.playerBlob.column - 1] == null) {
                    //does second blob allow translation?
                    if (this.playerBlob.row2 < 0 || this.slots[this.playerBlob.row2][this.playerBlob.column2 - 1] == null) {
                        this.playerBlob.column--;
                    }
                }
            }
        };
        GameRunningState.prototype.moveRight = function () {
            if (this.playerBlob.column < cols - 1 && this.playerBlob.column2 < cols - 1) {
                //does first blob allow translation?
                if (this.playerBlob.row < 0 || this.slots[this.playerBlob.row][this.playerBlob.column + 1] == null) {
                    //does second blob allow translation?
                    if (this.playerBlob.row2 < 0 || this.slots[this.playerBlob.row2][this.playerBlob.column2 + 1] == null) {
                        this.playerBlob.column++;
                    }
                }
            }
        };
        GameRunningState.prototype.rotate = function () {
            this.playerBlob.orientation++;
            if (this.playerBlob.row2 < 0 || this.playerBlob.column2 < 0 || this.playerBlob.row2 >= rows || this.playerBlob.column2 >= cols)
                this.playerBlob.orientation--;
            else {
                if (this.slots[this.playerBlob.row2][this.playerBlob.column2] != null)
                    this.playerBlob.orientation--;
            }
        };
        GameRunningState.prototype.tickDown = function () {
            this.tickParameter--;
            this.playerCurrentTick++;
            if (this.playerCurrentTick > tickCount) {
                if (this.slots[this.playerBlob.row + 1][this.playerBlob.column] != null
                    || this.slots[this.playerBlob.row2 + 1][this.playerBlob.column2] != null) {
                    //stop player blob:
                    this.slots[Math.max(0, this.playerBlob.row)][this.playerBlob.column] = this.playerBlob.blob1;
                    this.slots[Math.max(0, this.playerBlob.row2)][this.playerBlob.column2] = this.playerBlob.blob2;
                    this.dropNewBlock();
                }
                else {
                    //continue to next row:
                    this.playerCurrentTick = 0;
                    this.playerBlob.row++;
                }
            }
        };
        GameRunningState.prototype.dropNewBlock = function () {
            this.playerCurrentTick = 0;
            this.playerBlob = this.nextBlob;
            this.nextBlob = this.createRandomBlobTuple();
        };
        GameRunningState.prototype.update = function () {
            var speedUp = this.cursors.down.isDown;
            var dt = this.game.time.physicsElapsed;
            this.tickParameter += (speedUp ? 20 : 1) * dt;
            if (this.tickParameter > 1)
                this.tickDown();
        };
        GameRunningState.prototype.render = function () {
            this.graphics.clear();
            var srcX = (this.game.width - cols * gridWidth) * 0.5;
            var srcY = (this.game.height - rows * gridWidth) * 0.5;
            var gridTop = 0;
            var gridLeft = 0;
            var color = 0x0;
            for (var i = 0; i < rows; ++i) {
                gridTop = srcY + i * gridWidth;
                for (var j = 0; j < cols; ++j) {
                    gridLeft = srcX + j * gridWidth;
                    this.graphics.lineStyle(1, 0xaaaaaa, 1);
                    this.graphics.drawRect(gridLeft, gridTop, gridWidth, gridWidth);
                    this.graphics.lineStyle(0);
                    var blob = this.slots[i][j];
                    if (blob != null)
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
            var nextX = this.game.width / 2 + gridWidth * cols / 2 + 50;
            var nextY = this.game.height / 2 - gridWidth * rows / 2;
            this.graphics.lineStyle(1, 0xaaaaaa, 1);
            this.graphics.drawRoundedRect(nextX, nextY, 100, 100, 20);
            this.nextBlob.render(this.graphics, nextX + 50, nextY + 50);
            //this.game.debug.text("ROW: " + this.playerRow.toString(), 0, 50);
            //this.game.debug.text("TICK: " + this.playerCurrentTick.toString(), 0, 100);
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
            this.game = new Phaser.Game(800, 600, Phaser.WEBGL, 'content');
            this.game.state.add("GameRunningState", BlokjesGame.GameRunningState, false);
            this.game.state.add("TitleScreenState", BlokjesGame.TitleScreenState, false);
            this.game.state.start("TitleScreenState", true, true);
        }
        return SimpleGame;
    }());
    BlokjesGame.SimpleGame = SimpleGame;
})(BlokjesGame || (BlokjesGame = {}));
window.onload = function () {
    var game = new BlokjesGame.SimpleGame();
};
