///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="DraggableComponent.ts"/>
///<reference path="Definitions.ts"/>

module EditorModule
{    
    export class RotateableComponent extends DraggableComponent {
        
        private rotateMode:boolean;
        private colorIndex:number;
        private colorHandle:Phaser.Graphics;
        private colorChangedCallback:Function;
        private lineGraphics:Phaser.Graphics;
        
        constructor(game:Phaser.Game, parent:PIXI.DisplayObjectContainer, str:string, colorChangedCallback:Function) {
         
           super(game, parent, 0xaaaaaa, str);
          
           this.colorChangedCallback = colorChangedCallback; 
           this.colorIndex = 0;
           this.rotateMode = false;
           
           var gr = this.game.make.graphics(0, DRAGGABLE_CMP_RADIUS);
           this.addChild(gr);
           gr.beginFill(0xffffff);
           gr.drawCircle(0,0,20);
           gr.endFill();

           this.lineGraphics = this.game.make.graphics(0,DRAGGABLE_CMP_RADIUS);
           this.addChild(this.lineGraphics);
           this.lineGraphics.lineStyle(2,0xffffff);
           this.lineGraphics.moveTo(0,0);
           this.lineGraphics.lineTo(0,300);
           this.lineGraphics.visible = false;
           
           this.colorHandle = this.game.make.graphics(0, -DRAGGABLE_CMP_RADIUS);
           this.addChild(this.colorHandle);
           this.setColorIndex(this.colorIndex);
        }
        
        serialize() : any {
            return { "angleDeg" : this.angle, "x" : this.position.x, "y" : this.position.y, "colorIndex" : this.colorIndex, "color" : TUNNEL_COLORS[this.colorIndex] };
        }
        
        deserialize(data:any) {
            this.position.x = data.x;
            this.position.y = data.y;
            this.angle = data.angleDeg;
            this.colorIndex = data.colorIndex;
            this.setColorIndex(this.colorIndex);
        }
        
        isMouseOver() : boolean {
            var mousePos = Level.getMousePosition();
            return this.position.distance(mousePos) < DRAGGABLE_CMP_RADIUS + 10;
        }
        
        getColorIndex() : number {
            return this.colorIndex;
        }
        
        setColorIndex(colorIndex:number) {
            this.colorIndex = colorIndex;
            
            this.colorHandle.clear();
            this.colorHandle.lineStyle(2, 0xffffff);
            this.colorHandle.beginFill(TUNNEL_COLORS[this.colorIndex]);
            this.colorHandle.drawCircle(0,0,20);
            this.colorHandle.endFill();
        }
        
        private changeColor() {
            this.colorIndex = (this.colorIndex + 1) % TUNNEL_COLORS.length;
            this.setColorIndex(this.colorIndex);
            this.colorChangedCallback(this, this.colorIndex);
        }
        
        tryCaptureMouse() : boolean {
            
            if(super.tryCaptureMouse()) {

                this.lineGraphics.visible = true;
                
                var radAng = (this.angle + 90) * Math.PI / 180.0;
                var globalHandleLoc = new Phaser.Point(DRAGGABLE_CMP_RADIUS * Math.cos(radAng), DRAGGABLE_CMP_RADIUS * Math.sin(radAng));
                var mousePos = Level.getMousePosition();
                var toMousePos = new Phaser.Point(mousePos.x - this.position.x, mousePos.y - this.position.y);
                this.rotateMode = globalHandleLoc.distance(toMousePos) < 10;
                if(!this.rotateMode) {
                    //try change color:
                    var colorChangeLoc = new Phaser.Point(-DRAGGABLE_CMP_RADIUS * Math.cos(radAng), -DRAGGABLE_CMP_RADIUS * Math.sin(radAng));
                    if(colorChangeLoc.distance(toMousePos) < 10) {
                        //change color:
                        this.changeColor();
                        this.onUp();
                    }
                }
                return true;
            }
            
            return false;
        }

        onUp() {
            this.lineGraphics.visible = false;
            super.onUp();
        }
        
        onMove() {
            if(this.hasInput &&  this.rotateMode) {
                var mousePos = Level.getMousePosition();
                this.angle = 180 * Math.atan2(mousePos.y - this.position.y, mousePos.x - this.position.x) / Math.PI - 90;
            }
            else
                super.onMove();
        }
    }
}