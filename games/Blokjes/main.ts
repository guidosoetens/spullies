///<reference path="../../phaser/phaser.d.ts"/>

class SimpleGame {
    game: Phaser.Game;
    player: Phaser.Sprite;

    constructor() {
        this.game = new Phaser.Game(640, 480, Phaser.AUTO, 'content', {
            create: this.create, preload:this.preload, render: this.render
        });
    }
    preload() {
        this.game.load.image("decepticon", "../../assets/sprites/arrow.png");
    }
    render() {
        // This renders debug information about physics bodies
        //this.game.debug.body(this.player);
    }
    create() {
        this.player = this.game.add.sprite(this.game.width / 2, 0, "decepticon");

        // Start the ARCADE Physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Enable physics on the player sprite
        this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

        // Set the sprite to collide with the worlds edge
        this.player.body.collideWorldBounds = true;
        // And set bounce in the Y axis ( called restitution in most physics system ) to 1, 
        // which will make it bounce equal to 100 %
        this.player.body.bounce.y = 0.5;

        // Set the physics engines overall gravity.  98 == 98 pixels per second in this demo
        this.game.physics.arcade.gravity.y = 98;
    }
}

window.onload = () => {
    var game = new SimpleGame();
};