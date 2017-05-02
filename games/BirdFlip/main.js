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
            var speed = 200;
            if (this.faceLeft) {
                if (this.mainBody.x > 50) {
                    this.beakGraphics.body.moveLeft(speed);
                    this.mainBody.body.moveLeft(speed);
                }
                else
                    this.faceLeft = false;
            }
            else {
                if (this.mainBody.x < this.game.width - 50) {
                    this.beakGraphics.body.moveRight(speed);
                    this.mainBody.body.moveRight(speed);
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
            var angVel = deltaAngle * 10;
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
        function Ball(game, pos, hasGrav) {
            _super.call(this, game);
            this.radius = 14 + 6 * this.game.rnd.frac();
            this.position.x = pos.x;
            this.position.y = pos.y + this.radius;
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
                Ball.rockReference = this;
            }
            this.beginFill(fillClr, .5);
            this.lineStyle(5, lineClr, 1);
            this.drawCircle(0, 0, 2 * this.radius - 5);
            this.game.physics.p2.enable(this);
            this.p2Body = this.body;
            this.p2Body.setCircle(this.radius);
            this.p2Body.mass = (Math.PI * this.radius * this.radius) / 50;
            this.p2Body.onBeginContact.add(this.onCollide, this);
            if (!hasGrav) {
                this.p2Body.data.gravityScale = 0.0;
                this.p2Body.static = true;
            }
        }
        Ball.prototype.onCollide = function (elem1, elem2) {
            if (this.p2Body.static && (elem1 == Ball.rockReference.body || elem2 == Ball.rockReference.body)) {
                this.p2Body.data.gravityScale = 1.0;
                this.p2Body.static = false;
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
var BirdFlip;
(function (BirdFlip) {
    var Obstacle = (function (_super) {
        __extends(Obstacle, _super);
        function Obstacle(game, pos) {
            _super.call(this, game);
            var polygonPts = [[pos.x, pos.y]];
            var samples = 20;
            var a1 = new Phaser.Point(.5 * this.game.width, 0);
            var c1 = new Phaser.Point((a1.x + pos.x) / 2, 0);
            var a2 = new Phaser.Point(pos.x, .5 * this.game.height);
            var c2 = new Phaser.Point(pos.x, (a1.y + pos.y) / 2);
            for (var i = 0; i < samples; ++i) {
                var t = i / (samples - 1.0);
                var tt = t * t;
                var min_t = 1.0 - t;
                var min_tt = min_t * min_t;
                var x = min_t * min_tt * a1.x + 3 * t * min_tt * c1.x + 3 * tt * min_t * c2.x + t * tt * a2.x;
                var y = min_t * min_tt * a1.y + 3 * t * min_tt * c1.y + 3 * tt * min_t * c2.y + t * tt * a2.y;
                polygonPts.push([x, y]);
            }
            this.beginFill(0xff0000, .5);
            this.lineStyle(3, 0xffffff, 1);
            this.moveTo(pos.x, pos.y);
            for (var i = 0; i < polygonPts.length; ++i)
                this.lineTo(polygonPts[i][0], polygonPts[i][1]);
            this.lineTo(pos.x, pos.y);
            this.game.physics.p2.enable(this);
            var p2Body = this.body;
            p2Body.static = true;
            p2Body.addPolygon({}, polygonPts);
        }
        return Obstacle;
    }(Phaser.Graphics));
    BirdFlip.Obstacle = Obstacle;
})(BirdFlip || (BirdFlip = {}));
///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Player.ts"/>
///<reference path="Ball.ts"/>
///<reference path="Obstacle.ts"/>
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
            //bind obstacles:
            this.elements.add(new BirdFlip.Obstacle(this.game, new Phaser.Point(0, 0)));
            this.elements.add(new BirdFlip.Obstacle(this.game, new Phaser.Point(this.game.width, 0)));
            this.cursors = this.game.input.keyboard.createCursorKeys();
            //bind keys:
            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.onLeft, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.onRight, this);
        };
        GameState.prototype.onLeft = function () {
            this.player.goLeft();
        };
        GameState.prototype.onRight = function () {
            this.player.goRight();
        };
        GameState.prototype.createBall = function (pos, isRock) {
            var ball = new BirdFlip.Ball(this.game, pos, isRock);
            this.elements.add(ball);
            this.balls.push(ball);
            return ball;
        };
        GameState.prototype.createBalls = function () {
            this.createBall(new Phaser.Point(this.game.width * .5, this.game.height * .8), true);
            var columns = 8;
            for (var i = 0; i < columns; ++i) {
                var x = (i + 1) / (columns + 1) * this.game.width;
                var rows = this.game.rnd.integerInRange(4, 10);
                var y = 0;
                for (var j = 0; j < rows; ++j) {
                    var pt = new Phaser.Point(x, y);
                    var ball = this.createBall(pt, false);
                    y += 2 * ball.radius;
                }
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
            var lose = false;
            for (var i = 0; i < this.balls.length; ++i) {
                var ball = this.balls[i];
                if (this.player.eatsAtLoc(ball.position)) {
                    if (i == 0)
                        lose = true;
                    //destroy!
                    ball.destroy();
                    this.elements.remove(ball);
                    this.balls.splice(i, 1);
                    --i;
                }
            }
            if (lose) {
                //flush balls:
                while (this.balls.length > 0) {
                    var ball = this.balls[0];
                    ball.destroy();
                    this.elements.remove(ball);
                    this.balls.splice(0, 1);
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
