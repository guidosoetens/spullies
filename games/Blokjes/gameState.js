///<reference path="../../phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameRunningState = (function (_super) {
    __extends(GameRunningState, _super);
    function GameRunningState() {
        _super.call(this);
    }
    GameRunningState.prototype.create = function () {
        var style = { font: "65px Arial", fill: "#ff0000", align: "center" };
        this.textValue = this.game.add.text(0, 0, "0", style);
        this.updateCount = 0;
    };
    GameRunningState.prototype.update = function () {
        this.textValue.text = (this.updateCount++).toString();
    };
    GameRunningState.prototype.render = function () {
        this.game.debug.text("This is drawn in render()", 0, 80);
    };
    return GameRunningState;
}(Phaser.State));
