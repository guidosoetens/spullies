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

            for (var i=0; i<6; ++i) {
                var ball = new Ball(this.game);
                this.elements.add(ball);
            }

            //create player:
            this.player = new Player(this.game);
            this.elements.add(this.player);

            this.cursors = this.game.input.keyboard.createCursorKeys();

            this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        }

        update() {
            var dt:number = this.game.time.physicsElapsed;

            if (this.cursors.left.isDown)
                this.player.goLeft();
            else if (this.cursors.right.isDown)
                this.player.goRight();
            this.player.setOpen(this.spaceKey.isDown);

            this.player.updatePlayer(dt)
        }

        render() {
            
        }
    }

}