///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="Definitions.ts"/>

module EditorModule
{    
    export class DraggableComponent extends Phaser.Group {
        
        protected hasInput:boolean;
        
        private graphics:Phaser.Graphics;
        private tbText:Phaser.Text;
        
        constructor(game:Phaser.Game, parent:PIXI.DisplayObjectContainer, color:number, str:string) {
           
            super(game, parent);
           
            this.graphics = this.game.make.graphics(0,0);
            this.addChild(this.graphics);
            this.graphics.lineStyle(2, 0xffffff);
            this.graphics.beginFill(color);
            this.graphics.drawCircle(0,0, 2 * DRAGGABLE_CMP_RADIUS);
            this.graphics.endFill();
            
            var style = { font: "24px Arial", fill: "#ffffff", align: "center" };
            this.tbText = this.game.make.text(0, 0, str, style);
            this.tbText.position.x -= .5 * this.tbText.width;
            this.tbText.position.y -= .45 * this.tbText.height;
            this.addChild(this.tbText);
            
            this.game.input.addMoveCallback(this.onMove, this);
            this.game.input.onUp.add(this.onUp, this);
            
            this.hasInput = false;
        }
        
        setText(str:string) {
            
            this.tbText.setText(str);
            this.tbText.position.x = -.5 * this.tbText.width;
            
            /*
            this.graphics.clear();
            this.graphics.lineStyle(2, 0xffffff);
            this.graphics.beginFill(color);
            this.graphics.drawCircle(0,0, 2 * DRAGGABLE_CMP_RADIUS);
            this.graphics.endFill();
            */
        }
        
        isMouseOver() : boolean {
            var mousePos = Level.getMousePosition();
            return this.position.distance(mousePos) < DRAGGABLE_CMP_RADIUS;
        }
        
        tryCaptureMouse() : boolean {
            
            if(this.isMouseOver()) {
                this.alpha = 0.5;
                this.hasInput = true;
                return true;
            }
            
            return false;
        }
        
        onMove() {
            if(this.hasInput) {
                var mousePos = Level.getMousePosition();
                this.position.x = Math.max(DRAGGABLE_CMP_RADIUS, Math.min(LEVEL_WIDTH - DRAGGABLE_CMP_RADIUS, mousePos.x));
                this.position.y = Math.max(DRAGGABLE_CMP_RADIUS, Math.min(LEVEL_HEIGHT - DRAGGABLE_CMP_RADIUS, mousePos.y));
            }
        }
        
        onUp() {
            if(this.hasInput) {
                this.alpha = 1.0;
                this.hasInput = false;
            }
        }
    }
}