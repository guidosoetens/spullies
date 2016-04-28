///<reference path="../../phaser/phaser.d.ts"/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TitleScreenState = (function (_super) {
    __extends(TitleScreenState, _super);
    //game: Phaser.Game;
    function TitleScreenState() {
        _super.call(this);
    }
    TitleScreenState.prototype.preload = function () {
        this.load.image("title", "peachy.png");
    };
    TitleScreenState.prototype.create = function () {
        this.titleScreenImage = this.add.sprite(0, 0, "title");
        this.input.onTap.addOnce(this.titleClicked, this); // <-- that um, this is extremely important
    };
    TitleScreenState.prototype.titleClicked = function () {
        this.game.state.start("GameRunningState");
    };
    return TitleScreenState;
}(Phaser.State));
