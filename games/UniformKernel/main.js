///<reference path="../../phaser/phaser.d.ts"/>
var KernelTest;
(function (KernelTest) {
    var KERNEL_CENTER = new Phaser.Point(300, 200);
    var KERNEL_SLOT_WIDTH = 50;
    var SimpleGame = (function () {
        function SimpleGame() {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
        }
        SimpleGame.prototype.preload = function () {
        };
        SimpleGame.prototype.create = function () {
            this.graphics = this.game.add.graphics(0, 0);
            this.angle = 0;
            this.values = [];
            for (var i = 0; i < 3; ++i) {
                this.values[i] = [];
                for (var j = 0; j < 3; ++j) {
                    this.values[i][j] = 0.5;
                }
            }
        };
        SimpleGame.prototype.update = function () {
            var pt = this.game.input.position;
            var toPt = new Phaser.Point(pt.x - KERNEL_CENTER.x, pt.y - KERNEL_CENTER.y);
            toPt = toPt.normalize();
            var sumNumber = 0;
            for (var i = 0; i < 3; ++i) {
                for (var j = 0; j < 3; ++j) {
                    if (i == 1 && j == 1)
                        continue;
                    var to = new Phaser.Point(j - 1, i - 1);
                    to = to.normalize();
                    var dot = toPt.dot(to);
                    var weight = 0;
                    if (dot > 0) {
                        weight = Math.max(0, 1.0 - Math.acos(dot) / (.25 * Math.PI));
                    }
                    this.values[i][j] = weight;
                    sumNumber += weight;
                }
            }
            this.game.debug.text("getalletje" + sumNumber, 20, 20);
        };
        SimpleGame.prototype.renderBlock = function () {
        };
        SimpleGame.prototype.render = function () {
            this.graphics.clear();
            //draw background:
            this.graphics.beginFill(0xffee66);
            this.graphics.drawRect(0, 0, 800, 600);
            this.graphics.endFill();
            for (var i = 0; i < 3; ++i) {
                for (var j = 0; j < 3; ++j) {
                    var x = KERNEL_CENTER.x + (j - 1.5) * KERNEL_SLOT_WIDTH;
                    var y = KERNEL_CENTER.y + (i - 1.5) * KERNEL_SLOT_WIDTH;
                    //draw slot:
                    this.graphics.lineStyle(3, 0x333333);
                    this.graphics.beginFill(0x555555);
                    this.graphics.drawRoundedRect(x, y, KERNEL_SLOT_WIDTH, KERNEL_SLOT_WIDTH, .2 * KERNEL_SLOT_WIDTH);
                    this.graphics.endFill();
                    if (i == 1 && j == 1)
                        continue;
                    //draw filler:
                    var m = .2 * KERNEL_SLOT_WIDTH;
                    var w = KERNEL_SLOT_WIDTH - 2 * m;
                    this.graphics.lineStyle(0);
                    this.graphics.beginFill(0xaaaaaa);
                    this.graphics.drawRect(x + m, y + m, w * this.values[i][j], w);
                    this.graphics.endFill();
                }
            }
        };
        return SimpleGame;
    }());
    KernelTest.SimpleGame = SimpleGame;
})(KernelTest || (KernelTest = {}));
window.onload = function () {
    var game = new KernelTest.SimpleGame();
};
