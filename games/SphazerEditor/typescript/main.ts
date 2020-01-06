///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="MainState.ts"/>
///<reference path="Definitions.ts"/>
///<reference path="SidePanelInterface.ts"/>

module EditorModule
{
    export class SimpleGame {
        
        private game: Phaser.Game;
        private mainState:MainState;
        
        public get isAnimating() {
            return this.mainState.isAnimating;
        }
        
        public set isAnimating(val:boolean) {
            this.mainState.isAnimating = val;
        }
        
        constructor() {
            this.game = new Phaser.Game(STAGE_WIDTH, STAGE_HEIGHT, Phaser.AUTO, 'content');
            this.mainState = new MainState();
            this.game.state.add("MainState", this.mainState, true);
        }
        
        deserializeLevel(data:any) {
            this.mainState.loadLevel(data);
        }
        
        serializeCurrentLevel() : any {
            return this.mainState.serializeLevel();
        }
        
        clearLevel() {
            this.mainState.clearLevel();
        }
    }
}

var phaserGame;
window.onload = () => {
    phaserGame = new EditorModule.SimpleGame();
};