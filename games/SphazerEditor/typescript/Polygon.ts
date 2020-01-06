///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="PolygonVertex.ts"/>
///<reference path="Definitions.ts"/>
///<reference path="TransformationTool.ts"/>

module EditorModule
{    
    export class Polygon extends Phaser.Group {
        
        _transformation:any;
        _polygonType:number;

        //private points:Phaser.Point[];
        private hasInput:boolean;
        private inputIndex:number;
        private inputPivot:Phaser.Point;
        private graphics:Phaser.Graphics;
        private pivotBullet:Phaser.Graphics;
        private visualContainer:Phaser.Group;
        private movingPivot:boolean;
        private handlesLayer:Phaser.Group;
        private preTransformCopy:any;
        
        
        public get polygonType() {
            return this._polygonType;
        }
        
        public set polygonType(val:number) {
            this._polygonType = val;
            this.repaint();
        }
        
        public get transformation() {
            return this._transformation;
        }
        
        constructor(game:Phaser.Game) {
            
            super(game);
            
            this.visualContainer = this.game.make.group();
            this.addChild(this.visualContainer);
            
            this.graphics = this.game.make.graphics(0,0);
            this.visualContainer.addChild(this.graphics);
            
            this.pivotBullet = this.game.make.graphics();
            this.pivotBullet.lineStyle(2, 0xffffff);
            this.pivotBullet.beginFill(0xff6600);
            this.pivotBullet.drawCircle(0,0,20);
            this.pivotBullet.endFill();
            this.visualContainer.addChild(this.pivotBullet);
            this.pivotBullet.visible = false;
            
            this.handlesLayer = this.game.make.group();
            this.visualContainer.addChild(this.handlesLayer);
            
            var radius:number = 100.0;
            for(var i:number=0; i<5; ++i) {
                var angle:number = (i / 5.0 + .75) * 2 * Math.PI;
                var pt = new Phaser.Point(radius * Math.cos(angle), radius * Math.sin(angle));
                var vertex = new PolygonVertex(this.game, () => { this.vertexPropertiesChanged(); });
                vertex.position = pt;
                this.handlesLayer.addChild(vertex);
            }
            
            //this.game.input.onDown.add(this.onDown, this);
            this.game.input.addMoveCallback(this.onMove, this);
            this.game.input.onUp.add(this.onUp, this);
            
            this.hasInput = false;
            this.inputIndex = -1;
            this.inputPivot = new Phaser.Point(0,0);
            
            this.polygonType = 0;
            
            this.movingPivot = false;
            
            this._transformation = {
                
                //translate x:
                "doTransX"          :   false,
                "transXMode"        :   'cos',
                "transXDuration"    :   3,
                "transXOffset"      :   20,
                
                //translate y:
                "doTransY"          :   false,
                "transYMode"        :   'cos',
                "transYDuration"    :   3,
                "transYOffset"      :   20,
                
                //rotation:
                "doRotate"          :   false,
                "rotDirection"      :   'cw',
                "rotMode"           :   'cos',
                "rotDuration"       :   3,
                "rotOffset"         :   0,
            };
            
            this.repaint();
        }
        
        vertexPropertiesChanged() {
            this.repaint();
        }
       
        
        setSidePanels() {
             SidePanelInterface.setPolygonFocus(this);
             if(this.hasInput && !this.movingPivot && this.inputIndex >= 0) {
                 SidePanelInterface.setNodeFocus(<PolygonVertex>this.handlesLayer.getChildAt(this.inputIndex));
             }
        }
        
        serializePoint(pt:Phaser.Point) : any {
            return { "x" : pt.x, "y" : pt.y };
        }
        
        deserializePoint(data:any) : Phaser.Point {
            return new Phaser.Point(data.x, data.y);
        }
        
        private calculateTransfomation(time:number, duration:number, offset:number, mode:string) : number {
            
            var t:number = time / duration * 2 * Math.PI;
            
            var value = offset;
            if(mode == 'cos') {
                value *= Math.cos(t);
            }
            else if(mode == 'sin') {
                value *= Math.sin(t);
            }
            else if(mode == 'negcos') {
                value *= 1.0 - Math.cos(t);
            }
            else {
                value *= 1.0 - Math.sin(t);
            }
            
            return value;
        }
        
        setAnimationTime(time:number) {
            
            //calculate transfomation:
            var transX:number = 0;
            var transY:number = 0;
            var angle:number = 0;
            
            if((this.polygonType == 0) && time > 0) {
                
                if(this.transformation.doTransX)
                    transX = this.calculateTransfomation(time, this.transformation.transXDuration, this.transformation.transXOffset, this.transformation.transXMode);
                    
                if(this.transformation.doTransY)
                    transY = this.calculateTransfomation(time, this.transformation.transYDuration, this.transformation.transYOffset, this.transformation.transYMode);
                    
                if(this.transformation.doRotate) {
                    
                    if(this.transformation.rotDirection == 'osc') {
                        angle = this.calculateTransfomation(time, this.transformation.rotDuration, this.transformation.rotOffset, this.transformation.rotMode);
                    }
                    else {
                        
                        angle = time / this.transformation.rotDuration * 360;
                        if(this.transformation.rotDirection == 'ccw')
                            angle = -angle;
                    }
                }
            }
            
            //apply transformation:
            this.visualContainer.position.x = transX;
            this.visualContainer.position.y = transY;
            this.visualContainer.angle = angle;
        }
        
        serialize() : any {
            
            var ptsData = [];
            
            var n =  this.handlesLayer.children.length;
            for(var i:number=0; i<n; ++i) {
                var point = <PolygonVertex>this.handlesLayer.getChildAt(i);
                ptsData[ptsData.length] = point.serialize();
            }
            
            var copyTrans:any = {};
            for (var key in this._transformation)
                copyTrans[key] = this._transformation[key];
            
            return {
                "center" : this.serializePoint(this.position),
                "polygonType" : this.polygonType,
                "points" : ptsData,
                "transformation" : copyTrans//this._transformation
            };
        }
        
        deserializeVertices(data:any) {
            this.handlesLayer.removeChildren();
            for(var i:number=0; i<data.length; ++i) {
                var vertex = new PolygonVertex(this.game, () => { this.vertexPropertiesChanged(); });
                vertex.deserialize(data[i]);
                this.handlesLayer.addChild(vertex);
            }
            
            this.repaint();
        }
        
        deserialize(data:any) {
            
            this.handlesLayer.removeChildren();
            
            this.position = data.center;
            
            this.deserializeVertices(data.points);
            /*
            for(var i:number=0; i<data.points.length; ++i) {
                var vertex = new PolygonVertex(this.game, () => { this.vertexPropertiesChanged(); });
                vertex.deserialize(data.points[i]);
                this.handlesLayer.addChild(vertex);
            }
            */
            
            //next statement also repaints polygon:
            this.polygonType = data.polygonType;
            this._transformation = data.transformation;
        }
        
        prepareForTransform() {
            
            var pts = {};
            var n:number = this.handlesLayer.children.length;
            for(var i:number=0; i<n; ++i) {
                var p = <PolygonVertex>this.handlesLayer.getChildAt(i);
                var data =
                {
                    "x" : p.position.x,
                    "y" : p.position.y,
                    "cwx" : p.position.x + p.cwOffset * Math.cos(p.cwAngle),
                    "cwy" : p.position.y + p.cwOffset * Math.sin(p.cwAngle),
                    "ccwx" : p.position.x + p.ccwOffset * Math.cos(p.ccwAngle),
                    "ccwy" : p.position.y + p.ccwOffset * Math.sin(p.ccwAngle),
                };
                pts[i] = data;
            }
            
            debugTekstje = "ORIGIN: [" + this.pivotBullet.position.x + ", " + this.pivotBullet.position.y + "]";
            
            var copy = {
                "pivotX" : this.pivotBullet.position.x,
                "pivotY" : this.pivotBullet.position.y,
                "pts" : pts
            }
            
            
            this.preTransformCopy = copy;
        }
        
        transform(matrix:Phaser.Matrix) {
            
            var pivotLoc = matrix.apply(new Phaser.Point(this.preTransformCopy.pivotX, this.preTransformCopy.pivotY));
            this.pivotBullet.position.x = pivotLoc.x;
            this.pivotBullet.position.y = pivotLoc.y;
            
            //transform vertex points...
            var n = this.handlesLayer.children.length;
            for(var i:number=0; i<n; ++i) {
                
                var p = <PolygonVertex>this.handlesLayer.getChildAt(i);
                var data = this.preTransformCopy.pts[i];
                
                var prePos = new Phaser.Point(data.x, data.y);
                var cwPt = new Phaser.Point(data.cwx, data.cwy);
                var ccwPt = new Phaser.Point(data.ccwx, data.ccwy);
                                
                var newPos = matrix.apply(prePos);
                
                if(p.hasCwTangent) {
                    var newCw = matrix.apply(cwPt);
                    newCw.x -= newPos.x;
                    newCw.y -= newPos.y;
                    p.cwOffset = newCw.getMagnitude();
                    p.cwAngle = Math.atan2(newCw.y, newCw.x);
                }
                
                if(p.hasCcwTangent) {
                    var newCcw = matrix.apply(ccwPt);
                    newCcw.x -= newPos.x;
                    newCcw.y -= newPos.y;
                    p.ccwOffset = newCcw.getMagnitude();
                    p.ccwAngle = Math.atan2(newCcw.y, newCcw.x);
                }
                
                p.position = newPos;
                p.repaint();
            }
            
            this.repaint();
        }
        
        finalizeTransform() {
            var dx = this.pivotBullet.position.x;
            var dy = this.pivotBullet.position.y;
            this.pivotBullet.position.x = 0;
            this.pivotBullet.position.y = 0;
            this.position.x += dx;
            this.position.y += dy;
            
            for(var i:number=0; i<this.handlesLayer.children.length; ++i) {
                var c = this.handlesLayer.getChildAt(i);
                c.position.x -= dx;
                c.position.y -= dy;
            }
            
            this.repaint();
        }
        
        setFocus(isShown:boolean, showControls:boolean) {
            this.alpha = isShown ? 1.0 : 0.4;
            this.pivotBullet.visible = showControls;
            this.handlesLayer.visible = showControls;
        }
        
        private hitTestLineSegment(p:Phaser.Point, q:Phaser.Point, pt:Phaser.Point) : boolean {
            var to = new Phaser.Point(q.x - p.x, q.y - p.y);
            var distance = to.getMagnitude();
            to = to.divide(distance, distance);
            var perp = new Phaser.Point(-to.y, to.x);
            
            var toInput =  new Phaser.Point(pt.x - p.x, pt.y - p.y);
            
            var dot = to.dot(toInput);
            if(dot > 0 && dot < distance) {
                var dotPerp = perp.dot(toInput);
                if(Math.abs(dotPerp) < POLYGON_NODE_RADIUS) {
                    return true;
                }
            }
            
            return false;
        }
        
        private hitTestEdge(idx:number, pt:Phaser.Point):boolean {
            var p1 = <PolygonVertex>this.handlesLayer.getChildAt(idx);
            var p2 = <PolygonVertex>this.handlesLayer.getChildAt((idx + 1) % this.handlesLayer.children.length);
            
            if(p1.hasCwTangent || p2.hasCcwTangent) {
                //do bezier test:
                var c1x = p1.position.x;
                var c1y = p1.position.y;
                var c2x = p2.position.x;
                var c2y = p2.position.y;
                
                if(p1.hasCwTangent) {
                    c1x = p1.position.x + p1.cwOffset * Math.cos(p1.cwAngle);
                    c1y = p1.position.y + p1.cwOffset * Math.sin(p1.cwAngle);
                }
                
                if(p2.hasCcwTangent) {
                    c2x = p2.position.x + p2.ccwOffset * Math.cos(p2.ccwAngle);
                    c2y = p2.position.y + p2.ccwOffset * Math.sin(p2.ccwAngle);
                }
                
                var minX = Math.min(c1x, c2x, p1.position.x, p2.position.x);
                var maxX = Math.max(c1x, c2x, p1.position.x, p2.position.x);
                var minY = Math.min(c1y, c2y, p1.position.y, p2.position.y);
                var maxY = Math.max(c1y, c2y, p1.position.y, p2.position.y);
                
                if((pt.x > (minX - POLYGON_NODE_RADIUS)) && (pt.x < (maxX + POLYGON_NODE_RADIUS)) && (pt.y > (minY - POLYGON_NODE_RADIUS)) && (pt.y < (maxY + POLYGON_NODE_RADIUS))) {
                    
                    var iterations = 10;
                    var prevPt = p1.position;
                    for(var i:number=0; i<iterations; ++i) {
                        var t = (i + 1) / (iterations);
                        var h0 = Math.pow(1 - t, 3.0);
                        var h1 = 3 * t * Math.pow(1 - t, 2.0);
                        var h2 = 3 * t * t * (1 - t);
                        var h3 = Math.pow(t, 3.0);
                        
                        var samplePt = new Phaser.Point(
                            h0 * p1.position.x + h1 * c1x + h2 * c2x + h3 * p2.position.x,
                            h0 * p1.position.y + h1 * c1y + h2 * c2y + h3 * p2.position.y
                        );
                        
                        if(this.hitTestLineSegment(prevPt, samplePt, pt))
                            return true;
                        
                        prevPt = samplePt;
                    }
                }
                
            }
            else {
                
                return this.hitTestLineSegment(p1.position, p2.position, pt);
            }
            
            return false;
        }
        
        private polygonHitTestPoint(pt:Phaser.Point) : boolean {
            
            return Level.instance.hitTestPoint(this.graphics, new Phaser.Point(pt.x + this.position.x, pt.y + this.position.y));
            /*
            var pts = new Array<Phaser.Point>();
            
            for(var i:number=0; i<this.handlesLayer.children.length; ++i) {
                var vertex = <PolygonVertex>this.handlesLayer.getChildAt(i);
                pts[i] = new Phaser.Point(vertex.position.x, vertex.position.y);
            }
            
            var polygon = new Phaser.Polygon(pts);
            return polygon.contains(pt.x, pt.y);
            */
        }
        
        transformedHitTestPoint() : boolean {
            
            var mousePt = Level.getMousePosition();
            var localMousePt = new Phaser.Point(mousePt.x - (this.position.x + this.visualContainer.position.x), mousePt.y - (this.position.y + this.visualContainer.position.y));
            var pt = localMousePt.rotate(0, 0, -this.visualContainer.angle, true);
            return this.polygonHitTestPoint(pt);
        }
        
        isMouseOver() : boolean {
            /*
            var points = this.getPointsArray();
            
            var rect:Phaser.Rectangle = new Phaser.Rectangle(points[0].x, points[0].y, 1, 1);
            for(var i:number=0; i<points.length; ++i) {
                rect = rect.union(new Phaser.Rectangle(points[i].x, points[i].y, 1, 1));
            }
            
            var margin = 10.0;
            rect.x -= margin;
            rect.y -= margin;
            rect.width += 2 * margin;
            rect.height += 2 * margin;
            
            var pt = this.game.input.mousePointer.position;
            var localMousePt = new Phaser.Point(pt.x - this.position.x, pt.y - this.position.y);
            return rect.contains(localMousePt.x, localMousePt.y) || localMousePt.getMagnitude() < 20.0;
            */
            return true;
        }

        renderPoints() {
            var n = this.handlesLayer.children.length;

            // var last = this.handlesLayer.getChildAt(n-1).position;
            // this.graphics.moveTo(last.x, last.y);
            var first = this.handlesLayer.getChildAt(0).position;
            this.graphics.moveTo(first.x, first.y);
            for(var i:number=1; i<n; ++i) {
                var prev:number = i == 0 ? (n - 1) : (i - 1);
                
                var p1 = <PolygonVertex>this.handlesLayer.getChildAt(prev);
                var p2 = <PolygonVertex>this.handlesLayer.getChildAt(i);
                
                if(p1.hasCwTangent || p2.hasCcwTangent) {
                    
                    var c1x = p1.position.x;
                    var c1y = p1.position.y;
                    var c2x = p2.position.x;
                    var c2y = p2.position.y;
                    
                    if(p1.hasCwTangent) {
                        c1x = p1.position.x + p1.cwOffset * Math.cos(p1.cwAngle);
                        c1y = p1.position.y + p1.cwOffset * Math.sin(p1.cwAngle);
                    }
                    
                    if(p2.hasCcwTangent) {
                        c2x = p2.position.x + p2.ccwOffset * Math.cos(p2.ccwAngle);
                        c2y = p2.position.y + p2.ccwOffset * Math.sin(p2.ccwAngle);
                    }
                    
                    this.graphics.bezierCurveTo(c1x, c1y, c2x, c2y, p2.position.x, p2.position.y);
                }
                else {
                    
                    //straight line...
                     this.graphics.lineTo(p2.position.x, p2.position.y);
                }
            }
        }
        
        repaint() {
            
            var fillColor:number = 0xff0000;// = this.isObstacle ? 0xff0000 : 0x44ff44;
            if(this.polygonType == 0)
                fillColor = 0xff0000;
            else if(this.polygonType == 1)
                fillColor = 0x44ff44;
            else 
                fillColor = 0xffaa55;
            
            // this.graphics.lin
            this.graphics.clear();
            this.graphics.lineStyle(0, 0xffffff);
            this.graphics.beginFill(fillColor, .3);
            this.renderPoints();
            
            this.graphics.endFill();

            this.graphics.lineStyle(3, 0xffffff);
            this.renderPoints();
        }
        
        triggerDelete() {
             Level.instance.deletePolygon(this);
        }
        
        triggerCopy() {
             Level.instance.copyPolygon(this);
        }
        
        tryCaptureMouse(allowHandleFocus:boolean) : boolean {
           
           var prevFocusNode:PolygonVertex = null;
           for(var i:number=0; i<this.handlesLayer.children.length; ++i) {
               var node = <PolygonVertex>this.handlesLayer.getChildAt(i);
               if(node.hasInputFocus)
                    prevFocusNode = node;
           }
           
           
           if(this.hasInput && !this.movingPivot && this.inputIndex >= 0) {
               prevFocusNode = <PolygonVertex>this.handlesLayer.getChildAt(this.inputIndex);
           }
           
            this.focusCurrentNode();
            
            if(this.isMouseOver()) {
                
                SidePanelInterface.setNodeFocus(null);
                
                var n:number = this.handlesLayer.children.length;
                
                var mousePt = Level.getMousePosition();
                var localMousePt = new Phaser.Point(mousePt.x - this.position.x, mousePt.y - this.position.y);
               
                
                if(localMousePt.getMagnitude() < 20.0 && allowHandleFocus)
                {
                    this.inputPivot.x = localMousePt.x;
                    this.inputPivot.y = localMousePt.y;
                    this.movingPivot = true;
                    this.hasInput = true;
                    return true;
                }
                else
                    this.movingPivot = false;
                    
                if(this.game.input.mousePointer.rightButton.isDown && allowHandleFocus) {
                    
                    for(var i:number=0; i<n; ++i) {
                        var vertex = <PolygonVertex>this.handlesLayer.children[i];
                        if(vertex.position.distance(localMousePt) < POLYGON_NODE_RADIUS) {
                            
                            if(n > 2) {
                                this.handlesLayer.removeChildAt(i);
                                this.repaint();
                            }
                            
                            return true;
                            
                        }
                    }
                    
                    return false;
                }
                
                if(allowHandleFocus) {
                    //test if handle was hit:
                    for(var i:number=0; i<n; ++i) {
                        var vertex = <PolygonVertex>this.handlesLayer.children[i];
                        if(vertex.tryCaptureMouse(localMousePt, prevFocusNode == vertex)) {
                            this.hasInput = true;
                            this.inputIndex = i;
                            this.focusCurrentNode();
                            return true;
                        }
                    }
                    
                    //test if edge was hit:
                    for(var i:number=0; i<n; ++i) {
                        
                        if(this.hitTestEdge(i,localMousePt )) {
                            //cut polygon:
                            var vertex = new PolygonVertex(this.game, () => { this.vertexPropertiesChanged(); } );
                            vertex.position = new Phaser.Point(localMousePt.x, localMousePt.y);
                            vertex.captureMouse();
                            this.handlesLayer.addChildAt(vertex, i + 1);//.children  .splice(i + 1, 0, vertex);
                            this.hasInput = true;
                            this.inputIndex = i + 1;
                            this.focusCurrentNode();
                            this.repaint();
                            return true;
                        }
                    }
                }
                
                this.hasInput = this.polygonHitTestPoint(localMousePt);
                this.inputPivot.x = localMousePt.x;
                this.inputPivot.y = localMousePt.y;
                
                return this.hasInput;
            }
            
            return false;
        }
        
        focusCurrentNode() {
            
            for(var i:number=0; i<this.handlesLayer.children.length; ++i) {
                 var vertex = <PolygonVertex>this.handlesLayer.getChildAt(i);
                 vertex.setHandlesFocus(false);
            }
            
            if(this.hasInput && !this.movingPivot) {
                var vertex = <PolygonVertex>this.handlesLayer.getChildAt(this.inputIndex);
                SidePanelInterface.setNodeFocus(vertex);
                vertex.setHandlesFocus(true);
            }
            else {
                SidePanelInterface.setNodeFocus(null);
            }
        }
        
        onMove() {
            
            if(this.hasInput) {
                
                var mousePt = Level.getMousePosition();
                var localMousePt = new Phaser.Point(mousePt.x - this.position.x, mousePt.y - this.position.y);
                
                if(this.movingPivot) {
                    this.pivotBullet.x = localMousePt.x - this.inputPivot.x;
                    this.pivotBullet.y = localMousePt.y - this.inputPivot.y;
                }
                else {
                    //update...
                    if(this.inputIndex >= 0) {
                        
                        //update point location:
                        var c = <PolygonVertex>this.handlesLayer.getChildAt(this.inputIndex);
                        c.performMouseMove(localMousePt);
                        this.repaint();
                    }
                    else {
                        //moving polygon:
                        this.position.x += localMousePt.x - this.inputPivot.x;
                        this.position.y += localMousePt.y - this.inputPivot.y;
                    }
                }
            }
        }
        
        onUp() {
            
            if(this.hasInput && this.movingPivot) {
                this.finalizeTransform();
            }
            
            this.movingPivot = false;
            this.hasInput = false;
            this.inputIndex = -1;
        }
    }
}