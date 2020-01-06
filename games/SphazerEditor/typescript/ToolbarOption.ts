///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="Definitions.ts"/>

module EditorModule
{    
    export class ToolbarOption extends Phaser.Group {
        
        private dropCallback:Function;
        private hasInput:boolean;
        private goalLoc:Phaser.Point;
        
        constructor(game:Phaser.Game, goalLoc:Phaser.Point, dropCallback:Function, str:string) {
            
            super(game);
            
            this.goalLoc = goalLoc;
            this.dropCallback = dropCallback;
            this.position.x = goalLoc.x;
            this.position.y = goalLoc.y;
            
            var gr:Phaser.Graphics = this.game.make.graphics(0,0);
            this.addChild(gr);
            gr.lineStyle(0);
            gr.beginFill(0x555555, .3);
            gr.drawRoundedRect(-.5 * TOOL_OPT_WIDTH + 5, -.5 * TOOL_OPT_WIDTH + 5, TOOL_OPT_WIDTH, TOOL_OPT_WIDTH, 10);
            gr.endFill();
            
            gr.lineStyle(2, 0x333333);
            gr.beginFill(0x555555);
            gr.drawRoundedRect(-.5 * TOOL_OPT_WIDTH, -.5 * TOOL_OPT_WIDTH, TOOL_OPT_WIDTH, TOOL_OPT_WIDTH, 10);
            gr.endFill();
            
            var style = { font: "24px Arial", fill: "#ffffff", align: "center" };
            var tbText = this.game.make.text(0, 0, str, style);
            tbText.position.x -= .5 * tbText.width;
            tbText.position.y -= .45 * tbText.height;
            this.addChild(tbText);
            
            //this.game.input.onDown.add(this.onDown, this);
            this.game.input.addMoveCallback(this.onMove, this);
            this.game.input.onUp.add(this.onUp, this);
            
            this.hasInput = false;
        }
        
        isMouseOver() : boolean {
            return  Math.abs(this.position.x - this.game.input.mousePointer.x) < .5 * TOOL_OPT_WIDTH && 
                    Math.abs(this.position.y - this.game.input.mousePointer.y) < .5 * TOOL_OPT_WIDTH;
        }
        
                
        tryCaptureMouse() : boolean {
            
            if(this.isMouseOver()) {
                this.hasInput = true;
                return true;
            }
            
            return false;
        }

        
        /*
        onDown() {
            if(this.isMouseOver())
                this.hasInput = true;
        }*/
        
        onMove() {
            if(this.hasInput) {
                var mousePos = this.game.input.mousePointer.position;
                this.position.x = mousePos.x;
                this.position.y = mousePos.y;
            }
        }
        
        onUp() {
            if(this.hasInput) {
                this.hasInput = false;
                
                if(this.position.x > 0 && this.position.y > 0 && this.position.x < LEVEL_WIDTH && this.position.y < LEVEL_HEIGHT)
                    this.dropCallback(this);
                    
                this.position.x = this.goalLoc.x;
                this.position.y = this.goalLoc.y;
            }
        }
    }
}