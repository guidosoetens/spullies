///<reference path="../../phaser/phaser.d.ts"/>
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(640, 480, Phaser.AUTO, 'content', {
            create: this.create, preload: this.preload, render: this.render, onmousedown: this.onmousedown
        });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.image("balletje", "../../assets/sprites/aqua_ball.png");
    };
    SimpleGame.prototype.render = function () {
        // This renders debug information about physics bodies
        //this.game.debug.body(this.player);
    };
    SimpleGame.prototype.create = function () {
        this.player = this.game.add.sprite(this.game.width / 2, 0, "balletje");
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
        this.graphics = this.game.add.graphics(100, 100);
        this.graphics.clear();
        this.graphics.beginFill(0xFF33FF);
        this.graphics.drawCircle(200, 200, 100);
        this.graphics.endFill();
    };
    SimpleGame.prototype.onmousedown = function (ev) {
        alert("mouse down...");
        this.graphics.clear();
        this.graphics.beginFill(0xFF3300);
        this.graphics.drawCircle(200, 200, 100);
        this.graphics.endFill();
    };
    return SimpleGame;
}());
window.onload = function () {
    var game = new SimpleGame();
};
