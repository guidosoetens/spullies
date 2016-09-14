///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Player.ts"/>
///<reference path="Ball.ts"/>

module BirdFlip
{
    export class GameState extends Phaser.State {

        player:Player;
        cursors:Phaser.CursorKeys;
        spaceKey:Phaser.Key;
        customBounds:any;

        elements:Phaser.Group;

        balls:Ball[];

        constructor() {
            super();
        }
        
        preload() {
            /*
             this.game.load.audio("backgroundMusic", ["assets/music.mp3"]);
             this.game.load.image("button", "../../assets/sprites/mushroom2.png", false);
             this.game.load.shader("blobShader", 'assets/blobShader.frag');
             this.game.load.image('blokje', "assets/blokje.png");
             this.game.load.image('galaxy', "assets/galaxy.jpg");
             this.game.load.image('noise', "assets/noise.jpg");
             */
        }
        
        create() {

            this.elements = this.game.add.group();

            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.game.physics.p2.gravity.y = 500;

            this.balls = [];
            this.createBalls();

            //create player:
            this.player = new Player(this.game);
            this.elements.add(this.player);

            this.cursors = this.game.input.keyboard.createCursorKeys();

            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        }

        createBall(pos:Phaser.Point, isRock:boolean) : Ball {
            var ball = new Ball(this.game, pos, isRock);
            this.elements.add(ball);
            this.balls.push(ball);
            return ball;
        }

        createBalls() {

            this.createBall(new Phaser.Point(this.game.width * .5, this.game.height * .8), true);

            var columns:number = 8;
            for(var i=0; i<columns; ++i) {
                var x:number = (i + 1) / (columns + 1) * this.game.width;
                var rows:number = this.game.rnd.integerInRange(4, 10);

                var y:number = 0;
                for(var j=0; j<rows;++j) {
                    var pt = new Phaser.Point(x, y);
                    var ball = this.createBall(pt, false);
                    y += 2 * ball.radius;
                }
            }
        }

        update() {
            var dt:number = this.game.time.physicsElapsed;

            if (this.cursors.left.isDown)
                this.player.goLeft();
            else if (this.cursors.right.isDown)
                this.player.goRight();
            this.player.setOpen(this.spaceKey.isDown);

            this.player.updatePlayer(dt)

            //test which balls are still valid:
            var lose = false;
            for(var i:number=0; i<this.balls.length; ++i) {
                var ball = this.balls[i];
                if(this.player.eatsAtLoc(ball.position)) {
                    if(i == 0)
                        lose = true;

                    //destroy!
                    ball.destroy();
                    this.elements.remove(ball);
                    this.balls.splice(i, 1);
                    --i;
                }
            }

            if(lose) {
                //flush balls:
                while(this.balls.length > 0) {
                    var ball = this.balls[0];
                    ball.destroy();
                    this.elements.remove(ball);
                    this.balls.splice(0, 1);
                }
            }

            if(this.balls.length == 0) {
                this.createBalls();
            }
        }

        render() {
            
        }
    }

}