var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../../phaser/phaser.d.ts"/>
var BirdFlip;
(function (BirdFlip) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game) {
            _super.call(this, game);
            this.mainBody = this.game.make.graphics();
            this.mainBody.position.x = 200;
            this.mainBody.position.y = this.game.height - 75;
            this.game.physics.p2.enable(this.mainBody);
            var baseWidth = 80;
            var baseHeight = 120;
            var baseOffsetY = 30;
            this.addChild(this.mainBody);
            this.mainBody.beginFill(0x00ff00, .5);
            this.mainBody.drawRect(-baseWidth / 2, -baseOffsetY, baseWidth, baseHeight);
            this.mainBody.beginFill(0xffffff, 1);
            this.mainBody.drawCircle(0, 0, 5);
            this.mainBody.endFill();
            this.mainBody.body.setRectangle(baseWidth, baseHeight, 0, .5 * baseHeight - baseOffsetY, 0);
            this.mainBody.body.kinematic = true;
            var beakWidth = 30;
            var beakLength = 200;
            this.beakGraphics = this.game.make.graphics();
            this.beakGraphics.position.x = this.mainBody.position.x;
            this.beakGraphics.position.y = this.mainBody.position.y;
            //this.beakGraphics.position = this.mainBody.position;
            this.addChild(this.beakGraphics);
            this.beakGraphics.beginFill(0xff0000, .5);
            this.beakGraphics.drawRect(-beakWidth / 2, -beakWidth / 2, beakLength, beakWidth);
            this.beakGraphics.beginFill(0xffff00, 1);
            this.beakGraphics.drawCircle(0, 0, 5);
            this.beakGraphics.endFill();
            this.game.physics.p2.enable(this.beakGraphics);
            this.beakGraphics.body.setRectangle(beakLength, beakWidth, (beakLength - beakWidth) / 2, 0, 0);
            this.beakGraphics.body.kinematic = true;
            this.faceLeft = false;
            this.beakOpen = false;
            this.debugGraphics = this.game.make.graphics();
            this.addChild(this.debugGraphics);
        }
        Player.prototype.goLeft = function () {
            this.faceLeft = true;
        };
        Player.prototype.goRight = function () {
            this.faceLeft = false;
        };
        Player.prototype.setOpen = function (isOpen) {
            this.beakOpen = isOpen;
        };
        Player.prototype.getBottomBasedAngle = function () {
            var currAngle = this.beakGraphics.body.angle - 90;
            if (currAngle > 180)
                currAngle -= 360;
            if (currAngle < -180)
                currAngle += 360;
            return currAngle;
        };
        Player.prototype.getEatRange = function () {
            var currAngle = this.getBottomBasedAngle();
            if (currAngle < 0) {
                return new Phaser.Rectangle(this.mainBody.position.x, this.mainBody.position.y + 50, 100, 100);
            }
            else
                return new Phaser.Rectangle(this.mainBody.position.x - 100, this.mainBody.position.y + 50, 100, 100);
        };
        Player.prototype.eatsAtLoc = function (loc) {
            var currAngle = this.getBottomBasedAngle();
            if (Math.abs(currAngle) > 90)
                return false;
            return this.getEatRange().contains(loc.x, loc.y);
        };
        Player.prototype.updatePlayer = function (dt) {
            //move:
            this.mainBody.body.setZeroVelocity();
            this.beakGraphics.body.setZeroVelocity();
            if (this.faceLeft) {
                if (this.mainBody.x > 30) {
                    this.beakGraphics.body.moveLeft(200);
                    this.mainBody.body.moveLeft(200);
                }
                else
                    this.faceLeft = false;
            }
            else {
                if (this.mainBody.x < this.game.width - 30) {
                    this.beakGraphics.body.moveRight(200);
                    this.mainBody.body.moveRight(200);
                }
                else
                    this.faceLeft = true;
            }
            //note: convert angle so that 'ang = 0' faces downwards
            var currAngle = this.getBottomBasedAngle();
            var goalAngle = (this.beakOpen ? 120 : 60);
            if (!this.faceLeft)
                goalAngle = -goalAngle;
            var deltaAngle = goalAngle - currAngle;
            var angVel = deltaAngle * 5;
            if (Math.abs(angVel) > 300)
                angVel = angVel < 0 ? -300 : 300;
            this.beakGraphics.body.rotateRight(angVel);
            this.debugGraphics.clear();
            this.debugGraphics.lineStyle(3, 0xffffff, .5);
            this.debugGraphics.beginFill(0x0, 0);
            this.debugGraphics.drawCircle(this.mainBody.position.x, this.mainBody.position.y, 50);
            this.debugGraphics.lineStyle(0);
            this.debugGraphics.beginFill(0xff0000, .1);
            var eatRect = this.getEatRange();
            this.debugGraphics.drawRect(eatRect.x, eatRect.y, eatRect.width, eatRect.height);
        };
        return Player;
    }(Phaser.Group));
    BirdFlip.Player = Player;
})(BirdFlip || (BirdFlip = {}));
///<reference path="../../phaser/phaser.d.ts"/>
var BirdFlip;
(function (BirdFlip) {
    var Ball = (function (_super) {
        __extends(Ball, _super);
        function Ball(game, hasGrav) {
            _super.call(this, game);
            this.position.x = this.game.rnd.frac() * this.game.width;
            this.position.y = this.game.rnd.frac() * .5 * this.game.height;
            this.radius = 20 + 15 * this.game.rnd.frac();
            var fillClr, lineClr;
            var typeIdx = this.game.rnd.integerInRange(0, 2);
            if (typeIdx == 0) {
                fillClr = 0xff0000;
                lineClr = 0xaa0000;
            }
            else if (typeIdx == 1) {
                fillClr = 0x00ff00;
                lineClr = 0x00aa00;
            }
            else {
                fillClr = 0x0000ff;
                lineClr = 0x0000aa;
            }
            if (hasGrav) {
                fillClr = 0xaaaaaa;
                lineClr = 0xcccccc;
                this.radius = 10;
            }
            this.beginFill(fillClr, .5);
            this.lineStyle(5, lineClr, 1);
            this.drawCircle(0, 0, 2 * this.radius);
            this.game.physics.p2.enable(this);
            this.p2Body = this.body;
            this.p2Body.setCircle(this.radius);
            this.p2Body.mass = (Math.PI * this.radius * this.radius) / 50;
            this.p2Body.onBeginContact.add(this.onCollide, this);
            this.isStuck = true;
            if (hasGrav) {
                Ball.rockRef = this;
                this.isStuck = false;
            }
            else {
                this.p2Body.data.gravityScale = 0.0;
            }
        }
        Ball.prototype.onCollide = function (elem1, elem2) {
            if (this.isStuck && (elem1 == Ball.rockRef.p2Body || elem2 == Ball.rockRef.p2Body)) {
                this.p2Body.data.gravityScale = 1.0;
                this.isStuck = false;
            }
        };
        Ball.prototype.destroy = function () {
            this.game.physics.p2.removeBody(this.body);
        };
        return Ball;
    }(Phaser.Graphics));
    BirdFlip.Ball = Ball;
})(BirdFlip || (BirdFlip = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Player.ts"/>
///<reference path="Ball.ts"/>
var BirdFlip;
(function (BirdFlip) {
    var GameState = (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            _super.call(this);
        }
        GameState.prototype.preload = function () {
            /*
             this.game.load.audio("backgroundMusic", ["assets/music.mp3"]);
             this.game.load.image("button", "../../assets/sprites/mushroom2.png", false);
             this.game.load.shader("blobShader", 'assets/blobShader.frag');
             this.game.load.image('blokje', "assets/blokje.png");
             this.game.load.image('galaxy', "assets/galaxy.jpg");
             this.game.load.image('noise', "assets/noise.jpg");
             */
        };
        GameState.prototype.create = function () {
            this.elements = this.game.add.group();
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.gravity.y = 500;
            this.balls = [];
            this.createBalls();
            //create player:
            this.player = new BirdFlip.Player(this.game);
            this.elements.add(this.player);
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        };
        GameState.prototype.createBalls = function () {
            for (var i = 0; i < 10; ++i) {
                var ball = new BirdFlip.Ball(this.game, i == 0);
                this.elements.add(ball);
                this.balls.push(ball);
            }
        };
        GameState.prototype.update = function () {
            var dt = this.game.time.physicsElapsed;
            if (this.cursors.left.isDown)
                this.player.goLeft();
            else if (this.cursors.right.isDown)
                this.player.goRight();
            this.player.setOpen(this.spaceKey.isDown);
            this.player.updatePlayer(dt);
            //test which balls are still valid:
            for (var i = 0; i < this.balls.length; ++i) {
                var ball = this.balls[i];
                if (this.player.eatsAtLoc(ball.position)) {
                    //destroy!
                    ball.destroy();
                    this.elements.remove(ball);
                    this.balls.splice(i, 1);
                    --i;
                }
            }
            if (this.balls.length == 0) {
                this.createBalls();
            }
        };
        GameState.prototype.render = function () {
        };
        return GameState;
    }(Phaser.State));
    BirdFlip.GameState = GameState;
})(BirdFlip || (BirdFlip = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="GameState.ts"/>
var BirdFlip;
(function (BirdFlip) {
    var SimpleGame = (function () {
        function SimpleGame() {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content');
            this.game.state.add("GameRunningState", BirdFlip.GameState, false);
            this.game.state.start("GameRunningState", true, true);
        }
        return SimpleGame;
    }());
    BirdFlip.SimpleGame = SimpleGame;
})(BirdFlip || (BirdFlip = {}));
window.onload = function () {
    var game = new BirdFlip.SimpleGame();
};
