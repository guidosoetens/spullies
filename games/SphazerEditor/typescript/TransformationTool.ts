///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="Definitions.ts"/>

module EditorModule
{ 
    const CONTROL_RADIUS:number = 100;
    const SIDE_HANDLE_RADIUS:number = 10;
    
    export class TransformationTool extends Phaser.Group {
        
        hasInputFocus:boolean;
        private inputPivot:Phaser.Point;
        private handleIdx:number;
        private graphics:Phaser.Graphics;
        private transformationCallback:Function;
        private transformationFinishedCallback:Function;
        
        constructor(game:Phaser.Game, transformationCallback:Function, transformationFinishedCallback:Function) {
            super(game);
            
            this.transformationCallback = transformationCallback;
            this.transformationFinishedCallback = transformationFinishedCallback;
            
            this.graphics = this.game.make.graphics();
            this.addChild(this.graphics);
            
            this.hasInputFocus = false;
            
            this.inputPivot = new Phaser.Point(0,0);
                       
            this.repaint();
            
            this.game.input.addMoveCallback(this.onMove, this);
            this.game.input.onUp.add(this.onUp, this);
        }
      
        repaint() {
            
            this.graphics.clear();
            
            this.graphics.lineStyle(2, 0xffffff, 0.5);
            this.graphics.beginFill(0xffffff, 0.1);
            this.graphics.drawCircle(0, 0, 2 * CONTROL_RADIUS);
            this.graphics.lineStyle(1, 0xffffff, 0.2);
            this.graphics.moveTo(0, -CONTROL_RADIUS);
            this.graphics.lineTo(0, CONTROL_RADIUS);
            this.graphics.moveTo(-CONTROL_RADIUS, 0);
            this.graphics.lineTo(CONTROL_RADIUS, 0);
            this.graphics.endFill();
            
            var sqrt_half = Math.sqrt(.5);
            
            this.graphics.lineStyle(0);
            this.graphics.beginFill(0xffffff);
            this.graphics.drawRect(CONTROL_RADIUS - SIDE_HANDLE_RADIUS, - SIDE_HANDLE_RADIUS, 2 * SIDE_HANDLE_RADIUS, 2 * SIDE_HANDLE_RADIUS);
            this.graphics.drawRect(- SIDE_HANDLE_RADIUS, -CONTROL_RADIUS - SIDE_HANDLE_RADIUS, 2 * SIDE_HANDLE_RADIUS, 2 * SIDE_HANDLE_RADIUS);
            this.graphics.drawRect(sqrt_half * CONTROL_RADIUS - SIDE_HANDLE_RADIUS, -sqrt_half * CONTROL_RADIUS - SIDE_HANDLE_RADIUS, 2 * SIDE_HANDLE_RADIUS, 2 * SIDE_HANDLE_RADIUS);
            this.graphics.drawCircle(-sqrt_half * CONTROL_RADIUS, sqrt_half * CONTROL_RADIUS, 2 * SIDE_HANDLE_RADIUS);
            this.graphics.endFill();
        }
        
        reset() {

            this.position.x = CONTROL_RADIUS + 10;
            this.position.y = LEVEL_HEIGHT - CONTROL_RADIUS - 10;

            /*
            this.position.x = CONTROL_RADIUS + 10;
            this.position.y = this.game.height - 2 * CONTROL_RADIUS + 10;
            */
        }
        
        tryCaptureMouse() : boolean {
            
            if(!this.visible)
                return false;
            
            var pt = Level.getMousePosition();
            var toPt = new Phaser.Point(pt.x - this.position.x, pt.y - this.position.y);
            
            var sqrt_half = Math.sqrt(.5);
            var locs = [[1,0], [sqrt_half, -sqrt_half], [0,-1], [-sqrt_half, sqrt_half]];
            
            for(var i:number=0; i<4; ++i) {
                
                var x = locs[i][0] * CONTROL_RADIUS;
                var y = locs[i][1] * CONTROL_RADIUS;
                var to = new Phaser.Point(x - toPt.x, y - toPt.y);
                if(Math.max(Math.abs(to.x), Math.abs(to.y)) < SIDE_HANDLE_RADIUS) {
                    this.inputPivot.x = to.x;
                    this.inputPivot.y = to.y;
                    this.hasInputFocus = true;
                    this.handleIdx = i;
                    
                    return true;
                }
            }
            
            if(this.position.distance(pt) < CONTROL_RADIUS) {
                this.hasInputFocus = true;
                this.handleIdx = -1;
                
                this.inputPivot.x = pt.x - this.position.x;
                this.inputPivot.y = pt.y - this.position.y;
                
                return true;
            } 
            
            return false;
        }
        
        onMove() {
            var pt = Level.getMousePosition();
             
            if(this.hasInputFocus) {
                
                if(this.handleIdx < 0) {
                    //translate:
                    this.position.x = pt.x - this.inputPivot.x;
                    this.position.y = pt.y - this.inputPivot.y;
                }
                else {
                    
                    var rot:number = 0;
                    var scaleX:number = 1;
                    var scaleY:number = 1;
                    
                    var to = new Phaser.Point(pt.x - this.position.x + this.inputPivot.x, pt.y - this.position.y + this.inputPivot.y);
                    
                    if(this.handleIdx == 0)
                        scaleX = to.x / CONTROL_RADIUS;
                    else if(this.handleIdx == 1)
                        scaleX = scaleY = to.getMagnitude() / CONTROL_RADIUS;
                    else if(this.handleIdx == 2)
                        scaleY = -to.y / CONTROL_RADIUS;
                    else 
                        rot = Math.atan2(to.y, to.x) - .75 * Math.PI;
                        
                    var pivot = new Phaser.Point(this.position.x, this.position.y);
                    this.transformationCallback(pivot, rot, scaleX, scaleY);
                }
                
            }
        }
        
        onUp() {
            this.hasInputFocus = false;
            this.transformationFinishedCallback();
        }
    }
}