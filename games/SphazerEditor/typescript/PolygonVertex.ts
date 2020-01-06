///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="Definitions.ts"/>

module EditorModule
{    
    
    export class PolygonVertex extends Phaser.Group {
        
        private _lockTangents:boolean;
        private _hasCwTangent:boolean;
        cwAngle:number;
        cwOffset:number;
        private _hasCcwTangent:boolean;
        ccwAngle:number;
        ccwOffset:number;

        
        
        private handleIdx:number;
        
        public get lockTangents() {
            return this._lockTangents;
        }
        
        public set lockTangents(val:boolean) {
            this._lockTangents = val;
            
            if(val) {
                this.ccwAngle = this.cwAngle + Math.PI;
            }
            
            this.onPropertiesChanged();
        }
        
        public get hasCwTangent() {
            return this._hasCwTangent;
        }
        
        public set hasCwTangent(val:boolean) {
            this._hasCwTangent = val;
            this.onPropertiesChanged();
        }
        
        public get hasCcwTangent() {
            return this._hasCcwTangent;
        }
        
        public set hasCcwTangent(val:boolean) {
            this._hasCcwTangent = val;
            this.onPropertiesChanged();
        }
      
        hasInputFocus:boolean;
        graphics:Phaser.Graphics;
        
        shapeChangedCallback:Function;
        
        constructor(game:Phaser.Game, shapeChangedCallback:Function) {
            super(game);
            
            this.shapeChangedCallback = shapeChangedCallback;
            
            this.graphics = this.game.make.graphics();
            this.addChild(this.graphics);
            
            this._lockTangents = true;
            this._hasCwTangent = false;
            this.cwAngle = 0;
            this.cwOffset = 0;
            this._hasCcwTangent = false;
            this.ccwAngle = 0;
            this.ccwOffset = 0;
            
            this.hasInputFocus = false;
                       
            this.repaint();
        }
        
        
        serialize() : any {
            return  { 
                "x" : this.position.x,
                "y" : this.position.y,
                "lockTangents" : this._lockTangents,        //only store for future editing purposes...
                "hasCwTangent" : this._hasCwTangent,
                "cwAngle" : this.cwAngle,
                "cwOffset" : this.cwOffset,
                "hasCcwTangent" : this._hasCcwTangent,
                "ccwAngle" : this.ccwAngle,
                "ccwOffset" : this.ccwOffset
            };
        }
        
        static serializePolygonVertex(x:number, y:number) : any {
            
            return PolygonVertex.serializePolygonVertexWithControls(x, y, 0, 0, 0, 0);
        }
        
        static serializePolygonVertexWithControls(x:number, y:number, cwAngle:number, cwOffset:number, ccwAngle:number, ccwOffset:number) : any {
            
            var lockTangs = false;
            if(cwOffset < .01 || ccwOffset < .01) //one of the control points are disabled?
                lockTangs = true;
            else {
                var deltaAngle = ccwAngle - cwAngle;
                
                var toCW = new Phaser.Point(Math.cos(cwAngle), Math.sin(cwAngle));
                var toCcW = new Phaser.Point(Math.cos(ccwAngle), Math.sin(ccwAngle));
                
                if(toCcW.dot(toCW) < -.99)
                    lockTangs = true;
            }
               
            
            return {
                "x" : x,
                "y" : y,
                "lockTangents" : lockTangs, 
                "hasCwTangent" : cwOffset > 0.1,
                "cwAngle" : cwAngle,
                "cwOffset" : cwOffset,
                "hasCcwTangent" : ccwOffset > 0.1,
                "ccwAngle" : ccwAngle,
                "ccwOffset" : ccwOffset > 0.1 ? ccwOffset : Math.PI
            }
        }
        
        deserialize(data:any) {
            
            this.position.x = data.x;
            this.position.y = data.y;
            
            this._lockTangents = data.lockTangents;
            this._hasCwTangent = data.hasCwTangent;
            this.cwAngle = data.cwAngle;
            this.cwOffset = data.cwOffset;
            this._hasCcwTangent = data.hasCcwTangent;
            this.ccwAngle = data.ccwAngle;
            this.ccwOffset = data.ccwOffset;
            
            this.repaint();
            
             //return new Phaser.Point(data.x, data.y);
        }
        
        onPropertiesChanged() {
            this.repaint();
            this.shapeChangedCallback();
        }
      
        
        drawTangent(angle:number, offset:number, color:number) {
            var sumOffset = 2 * POLYGON_NODE_RADIUS + offset;
            
            var x = sumOffset * Math.cos(angle);
            var y = sumOffset * Math.sin(angle);
            
            this.graphics.lineStyle(2, color);
            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(x, y);
            this.graphics.beginFill(color, 1);
            this.graphics.drawCircle(x, y, 2 * POLYGON_NODE_RADIUS);
            this.graphics.endFill();
            
        }
        
        repaint() {
            
            this.graphics.clear();
            
            var clr:number = this.hasInputFocus ? 0xffffff : 0xaaaaaa;
            
            if(this.hasInputFocus) {
                if(this._hasCwTangent)
                    this.drawTangent(this.cwAngle, this.cwOffset, 0x00ff00);
                
                if(this._hasCcwTangent)
                    this.drawTangent(this.ccwAngle, this.ccwOffset, 0x0000ff);
            }
            
            this.graphics.lineStyle(0);
            this.graphics.beginFill(clr, 1);
            this.graphics.drawCircle(0,0,2 * POLYGON_NODE_RADIUS);
            this.graphics.endFill();
         
        }
        
        getControlPoint1() : Phaser.Point {
            return new Phaser.Point();
        }
        
        setHandlesFocus(focus:boolean) {
            this.hasInputFocus = focus;
            this.repaint();
        }
        
        captureMouse() {
            this.handleIdx = 0;
        }
        
        tryCaptureMouse(pt:Phaser.Point, testForSubhandles:boolean) : boolean {
            
            if(this.position.distance(pt) < POLYGON_NODE_RADIUS) {
                this.handleIdx = 0;
                return true;
            }
            
            if(testForSubhandles) 
            {
                var localPt = new Phaser.Point(pt.x - this.position.x, pt.y - this.position.y);
                
                if(this.hasCwTangent) {
                    var offset = this.cwOffset + 2 * POLYGON_NODE_RADIUS;
                    var angle = this.cwAngle;
                    var pt = new Phaser.Point(offset * Math.cos(angle), offset * Math.sin(angle));
                    if(pt.distance(localPt) < POLYGON_NODE_RADIUS) {
                        this.handleIdx = 1;
                        return true;
                    }
                }
                
                if(this.hasCcwTangent) {
                    var offset = this.ccwOffset + 2 * POLYGON_NODE_RADIUS;
                    var angle = this.ccwAngle;
                    var pt = new Phaser.Point(offset * Math.cos(angle), offset * Math.sin(angle));
                    if(pt.distance(localPt) < POLYGON_NODE_RADIUS) {
                        this.handleIdx = 2;
                        return true;
                    }
                }
            }
            
            return false;
        }
        
        performMouseMove(pt:Phaser.Point) {
            
            if(this.handleIdx == 0) {
                //update location:
                this.position.x = pt.x;
                this.position.y = pt.y;
            }
            else {
                
                var localPt = new Phaser.Point(pt.x - this.position.x, pt.y - this.position.y); 
                var angle = Math.atan2(localPt.y, localPt.x);
                var distance = localPt.getMagnitude();
                var offset = Math.max(0, distance - 2 * POLYGON_NODE_RADIUS);
                
                if(this.handleIdx == 1) {
                    this.cwAngle = angle;
                    this.cwOffset = offset;
                    if(this.lockTangents)
                        this.ccwAngle = angle + Math.PI;
                }
                else {
                    this.ccwAngle = angle;
                    this.ccwOffset = offset;
                    if(this.lockTangents)
                        this.cwAngle = angle + Math.PI;
                }
                
                this.repaint();
            }
        }
    }
}