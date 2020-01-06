///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="Definitions.ts"/>
///<reference path="DraggableComponent.ts"/>
///<reference path="Polygon.ts"/>
///<reference path="RotateableComponent.ts"/>
///<reference path="SidePanelInterface.ts"/>

module EditorModule
{
    export class Level extends Phaser.Group {
        
        static instance:Level;
        
        private focusedPolygon:Polygon;
        private polygons:Phaser.Group;
        private tunnels:Phaser.Group;
        private ballElement:DraggableComponent;
        private goalElement:DraggableComponent;
        private transformationTool:TransformationTool;
        
        
        private dataTexture:Phaser.BitmapData;
        
        private fooColor:number;
        
        
        
        constructor(game:Phaser.Game) {
            super(game);
            
            /*
            this.dataTexture = game.make.bitmapData(this.game.width, this.game.height);
            this.dataTexture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
            this.game.add.image(-this.game.width, 0, this.dataTexture);//.alpha = .2;
            */
            
            this.fooColor = -1;
            
            Level.instance = this;
            
            this.focusedPolygon = null;

            var bgGr = this.game.make.graphics(0,0);
            bgGr.beginFill(0x0, .4);
            bgGr.drawRoundedRect(-LEVEL_HORIZONTAL_MARGIN, -LEVEL_VERTICAL_MARGIN, LEVEL_WIDTH + 2 * LEVEL_HORIZONTAL_MARGIN, LEVEL_HEIGHT + 2 * LEVEL_VERTICAL_MARGIN, 10);
            bgGr.endFill();

            bgGr.lineStyle(0, 0x0);
            bgGr.beginFill(0x008800);
            bgGr.drawRoundedRect(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT, 10);
            bgGr.endFill();

            this.addChild(bgGr);
            
            /*
            var gr = this.game.make.graphics(0,0);
            gr.lineStyle(0, 0x0);
            gr.beginFill(0x004400);
            gr.drawRect(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);
            gr.endFill();
            this.addChild(gr);
            */
            
            this.polygons = this.game.make.group();
            this.addChild(this.polygons);
            
            this.tunnels = this.game.make.group();
            this.addChild(this.tunnels);
            
            this.ballElement = new DraggableComponent(this.game, this, 0xff8800, "●");
            this.goalElement = new DraggableComponent(this.game, this, 0x0088ff, "⚑");
            
            this.transformationTool = new TransformationTool(this.game, (p, r, sx, sy) => { this.transformationChanged(p, r, sx, sy); }, () => { this.transformationFinished(); } );
            this.addChild(this.transformationTool);
            
            this.clearLevel();
            
            /*
            var mask:Phaser.Graphics = this.game.make.graphics(0,0);
            mask.beginFill(0x0);
            mask.drawRoundedRect(LEVEL_MARGIN, LEVEL_MARGIN, LEVEL_WIDTH, LEVEL_HEIGHT, 10);
            mask.endFill();
            this.mask = mask;
            */
            
            this.dataTexture = this.game.add.bitmapData(this.game.width, this.game.height);
            //this.dataTexture.fill(255,255,255,.8);
            var container = this.dataTexture.addToWorld();//-this.game.width);
            container.scale.x = .2;
            container.scale.y = .2;
            container.visible = false;
            //this.dataTexture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
            //var img = this.game.add.image(0, 0, this.dataTexture);//.alpha = .2;
            //img.alpha = .5;
        }

        static getMousePosition() : Phaser.Point {
            var mousePt = Level.instance.game.input.mousePointer.position;
            var result = new Phaser.Point(mousePt.x - LEVEL_HORIZONTAL_MARGIN, mousePt.y - LEVEL_VERTICAL_MARGIN);
            return result;
        }
        
        hitTestPoint(obj:any, pt:Phaser.Point) : boolean {
            
            //this.dataTexture.drawGroup(gr);
            this.dataTexture.clear();
            this.dataTexture.fill(255,255,255,.1);
            this.dataTexture.drawFull(obj);
            this.dataTexture.update();
            this.dataTexture.setPixel(0,0,0,0,0,true);
            
            var x = Math.round(pt.x + LEVEL_HORIZONTAL_MARGIN);
            var y = Math.round(pt.y + LEVEL_VERTICAL_MARGIN);
            
            var color:any = this.dataTexture.getPixelRGB(x, y);
            //alert(color.r);
            //debugTekstje = "pt:" + x + ", " + y + ": [" + color.a + "]";
            /*
            var tex = gr.generateTexture();
            //var sprite:Phaser.Sprite = this.game.make.sprite(0, 0, tex);
            this.dataTexture.draw(new PIXI.Sprite(tex));*/
            
            return color.a > 100;
        }
        
        deletePolygon(p:Polygon) {
            this.polygons.remove(p);
            this.focusPolygon(null);
        }
        
        copyPolygon(p:Polygon) {
            var data = p.serialize();
            var copy = new Polygon(this.game);
            copy.deserialize(data);
            copy.position.x += 10;
            copy.position.y -= 10;
            this.polygons.addChild(copy);
            this.focusPolygon(copy);
        }
        
        serializePoint(pt:Phaser.Point) : any {
            return { "x" : pt.x, "y" : pt.y };
        }
        
        deserializePoint(data:any) : Phaser.Point {
            return new Phaser.Point(data.x, data.y);
        }
        
        serialize() : any {
            
            var polygonsData = [];
            for(var i:number=0; i < this.polygons.children.length; ++i) {
                var p:Polygon = <Polygon>this.polygons.getChildAt(i);
                polygonsData[polygonsData.length] = p.serialize();
            }
            
            var tunnelsData = [];
            for(var i:number=0; i < this.tunnels.children.length; ++i) {
                var rot:RotateableComponent = <RotateableComponent>this.tunnels.getChildAt(i);
                tunnelsData[tunnelsData.length] = rot.serialize();
            }
            
            return {  
                "levelWidth"    :   LEVEL_WIDTH,
                "levelHeight"   :   LEVEL_HEIGHT,
                "ballPosition"  :   this.serializePoint(this.ballElement.position),
                "goalPosition"  :   this.serializePoint(this.goalElement.position),
                "polygons"      :   polygonsData,
                "tunnels"       :   tunnelsData
            };
        }
        
        deserialize(data:any) {
            
            this.clearLevel();
            
            this.ballElement.position = this.deserializePoint(data.ballPosition);
            this.goalElement.position = this.deserializePoint(data.goalPosition);
            
            var tunnelsData = data.tunnels;
            for(var i:number=0; i<tunnelsData.length - 1; i += 2) {
                this.addTunnel(new Phaser.Point(0,0));
                for(var j:number=0; j<2; ++j) {
                    var rObj = <RotateableComponent>this.tunnels.children[this.tunnels.children.length - 2 + j];
                    rObj.deserialize(tunnelsData[i + j]);
                }
            }
            
            var polygonsData = data.polygons;
            for(var i:number=0; i<polygonsData.length; ++i) {
                var p:Polygon = new Polygon(this.game);
                p.deserialize(polygonsData[i]);
                this.polygons.addChild(p);
            }
        }
        
        num:number;
        
        render() {
            
            this.num = ((this.num + 1) % 10);
            
            this.game.debug.text("TESt" + this.num, 0, 100);
        }
        
        setAnimationTime(time:number) {
            for(var c of this.polygons.children) {
                var polygon = <Polygon>c;
                polygon.setAnimationTime(time);
            }
        }
        
        tunnelColorChanged(tunnel:RotateableComponent, colorIdx:number) {
            
            for(var i:number=0; i<this.tunnels.length; ++i) {
                
                if(this.tunnels.children[i] == tunnel) {
                    var j:number = (i % 2 == 0) ? (i + 1) : (i - 1);
                    var rotElem:RotateableComponent = <RotateableComponent>this.tunnels.children[j];
                    rotElem.setColorIndex(colorIdx);
                    break;
                }
            }
        }
        
        transformationFinished() {
             if(this.focusedPolygon != null) {
                 this.focusedPolygon.finalizeTransform();
             }
        }
        
        transformationChanged(pivot:Phaser.Point, angle:number, scaleX:number, scaleY:number) {
            
            if(this.focusedPolygon != null) {
                
                //redefine pivot:
                pivot.x = pivot.x - this.focusedPolygon.position.x;
                pivot.y = pivot.y - this.focusedPolygon.position.y;
                
                var matrix:Phaser.Matrix = new Phaser.Matrix();
                matrix = matrix.identity()
                .translate(-pivot.x, -pivot.y)
                .scale(scaleX, scaleY)
                .rotate(angle)
                .translate(pivot.x, pivot.y);
                
                this.focusedPolygon.transform(matrix);
            }
        }
        
        resetTunnelLayouts() {
            //var clrs:Array<number> = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0x00ffff];
            
            for(var i:number=0; i<this.tunnels.length; ++i) {
                
                var idx:number = Math.floor(i / 2);
                //var clr:number = clrs[idx % clrs.length];
                var rotElem:RotateableComponent = <RotateableComponent>this.tunnels.children[i];
                rotElem.setText("" + (idx + 1));
            }
        }
        
        clearLevel() {
            this.polygons.removeChildren();
            this.tunnels.removeChildren();
            this.ballElement.position = new Phaser.Point(.3 * LEVEL_WIDTH, .5 * LEVEL_HEIGHT);
            this.goalElement.position = new Phaser.Point(.7 * LEVEL_WIDTH, .5 * LEVEL_HEIGHT);
            this.focusPolygon(null);
        }
        
        addPolygon(pt:Phaser.Point, argument:number) {
            var p:Polygon = new Polygon(this.game);
            this.polygons.addChild(p);
            p.position.x = pt.x  - LEVEL_HORIZONTAL_MARGIN;
            p.position.y = pt.y  - LEVEL_VERTICAL_MARGIN;
            
            var vertices:any = [];
            
            var radius = 100;
            
            switch (argument) {
                case SPECIAL_POLYGON_STAR:
                    var starSamples = 10;
                    for(var i:number=0; i<starSamples; ++i) {
                        var angle = (i / starSamples - .25) * 2 * Math.PI;
                        var locRad = ((i % 2 == 0) ? 1 : .5) * radius;
                        vertices[i] = PolygonVertex.serializePolygonVertex(locRad * Math.cos(angle), locRad * Math.sin(angle));
                    }
                    
                    break;
                case SPECIAL_POLYGON_CIRCLE:
                
                    var tangOffset = 0.55 * radius;
                   
                    for(var i:number=0; i<4; ++i) {
                        var angle = (i / 4.0) * 2 * Math.PI;
                        var nx = Math.cos(angle);
                        var ny = Math.sin(angle);
                        vertices[i] = PolygonVertex.serializePolygonVertexWithControls(
                            radius * nx,
                            radius * ny,
                            angle + .5 * Math.PI,
                            tangOffset,
                            angle -.5 * Math.PI,
                            tangOffset
                        );
                    }
                    
                    break;
                case SPECIAL_POLYGON_HEART:
                
                    var slantedLength = .7 * Math.sqrt(2 * radius * radius);
                    vertices[0] = PolygonVertex.serializePolygonVertex(0, radius);
                    vertices[1] = PolygonVertex.serializePolygonVertexWithControls(-radius, 0, -.75 * Math.PI, slantedLength, 0, 0);
                    vertices[2] = PolygonVertex.serializePolygonVertexWithControls(0, -radius, -.25 * Math.PI, slantedLength, -.75 * Math.PI, slantedLength );
                    vertices[3] = PolygonVertex.serializePolygonVertexWithControls(radius, 0, 0, 0, -.25 * Math.PI, slantedLength);
                    break;
            
                default:
                    var samples = Math.max(3, Math.min(10, argument));
                    for(var i:number=0; i<samples; ++i) {
                        var angle = (i / samples + 2 / samples - .25) * 2 * Math.PI;
                        vertices[i] = PolygonVertex.serializePolygonVertex(100 * Math.cos(angle), 100 * Math.sin(angle));
                    }
                    break;
            }
            p.deserializeVertices(vertices);
            this.focusPolygon(p);
        }
        
        addTunnel(pt:Phaser.Point) {
            
            var rc = new RotateableComponent(this.game, this.tunnels, "", (tunnel, idx) => { this.tunnelColorChanged(tunnel, idx); });
            rc.position.x = pt.x - LEVEL_HORIZONTAL_MARGIN;
            rc.position.y = pt.y - LEVEL_VERTICAL_MARGIN;
            
            rc = new RotateableComponent(this.game, this.tunnels, "", (tunnel, idx) => { this.tunnelColorChanged(tunnel, idx); });
            rc.position.x = Math.min(pt.x + 3 * DRAGGABLE_CMP_RADIUS, LEVEL_WIDTH - DRAGGABLE_CMP_RADIUS) - LEVEL_HORIZONTAL_MARGIN;
            rc.position.y = pt.y - LEVEL_VERTICAL_MARGIN;
            
            this.resetTunnelLayouts();
        }
        
        focusPolygon(p:Polygon) {
            
            var keepFocus = p == this.focusedPolygon;
            this.focusedPolygon = p;
            
            //by default unfocus all polygons:
            for (var item of this.polygons.children) {
                var polygon = <Polygon>item;
                polygon.setFocus(p == null, false);
            }
            
            this.transformationTool.visible = p != null;
            if(!keepFocus)
                this.transformationTool.reset();
            
            if(p != null) {
                p.setSidePanels();
                this.polygons.bringToTop(p);
                p.setFocus(true, true);
            }
            else
                SidePanelInterface.setPolygonFocus(null);
        }
        
        trySelectPolygon() {
            for (var item of this.polygons.children.slice().reverse()) {
                var polygon = <Polygon>item;
                if(polygon.transformedHitTestPoint()) {
                    this.focusPolygon(polygon);
                    return;
                }
            }
        }
        
        tryCaptureMouse() : boolean {
            
            //try capture ball / goal (lazy evaluation)
            if(this.ballElement.tryCaptureMouse() || this.goalElement.tryCaptureMouse()) {
                this.focusPolygon(null);
                return true;
            }
                
            if(this.transformationTool.tryCaptureMouse()) {
                //do not adjust current polygon focus:
                if(this.focusedPolygon != null) 
                    this.focusedPolygon.prepareForTransform();
                    
                return true;
            }
            
            for (var item of this.tunnels.children.slice().reverse()) {
                var tunnelElem = <RotateableComponent>item;
                if(tunnelElem.tryCaptureMouse()) {
                    if(this.game.input.mousePointer.rightButton.isDown) {
                        //delete tunnel:
                        var idx = this.tunnels.children.indexOf(tunnelElem);
                        if(idx % 2 == 1)
                            idx--;
                        this.tunnels.removeChildAt(idx);
                        this.tunnels.removeChildAt(idx);
                        this.resetTunnelLayouts();
                        this.focusPolygon(null);
                        return false;
                    }
                    else {
                        this.focusPolygon(null);
                        return true;
                    }
                }
            }
               
                
            //try capture polygon:
            for (var item of this.polygons.children.slice().reverse()) {
                var polygon = <Polygon>item;
                if(polygon.tryCaptureMouse(this.focusedPolygon == polygon)) {
                    this.focusPolygon(polygon);
                    return true;
                }
            }
            
            this.focusPolygon(null);
            return false;
        }
    }
}