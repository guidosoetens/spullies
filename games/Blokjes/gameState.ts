///<reference path="../../phaser/phaser.d.ts"/>

class GameRunningState extends Phaser.State {
    constructor() {
        super();
    }
    textValue: Phaser.Text;
    updateCount: number;

    create() {
        var style = { font: "65px Arial", fill: "#ff0000", align: "center" };
        this.textValue = this.game.add.text(0, 0, "0", style);
        this.updateCount = 0;
    }

    update() {
        this.textValue.text = (this.updateCount++).toString();
    }

    render() {
        this.game.debug.text("This is drawn in render()", 0, 80);
    }
}