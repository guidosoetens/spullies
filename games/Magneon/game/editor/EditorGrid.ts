///<reference path="../../../../pixi/pixi.js.d.ts"/>
///<reference path="../Level.ts"/>
///<reference path="EditorNode.ts"/>
///<reference path="ElementType.ts"/>

module Magneon
{

    export class EditorGrid extends PIXI.Container {

        static rightClick:boolean = false;
        level:Level = null;
        data:any = null;
        nodeIdx:number = -1;
        nodes:EditorNode[] = [];
        currElementData:any = null;
        currType:ElementType = ElementType.None;

        constructor() {
            super();

            let gridOverlay = new PIXI.Graphics();
            this.addChild(gridOverlay);
            let rows = APP_HEIGHT / GRID_UNIT_SIZE;
            let cols = APP_WIDTH / GRID_UNIT_SIZE;

            gridOverlay.beginFill(0xffffff,0.1);
            gridOverlay.drawRect(0,0,APP_WIDTH,APP_HEIGHT);
            gridOverlay.endFill();

            gridOverlay.beginFill(0xffff00, .5);
            for(let i=0; i<rows; ++i) {
                for(let j=0; j<cols; ++j) {
                    gridOverlay.drawCircle(j * GRID_UNIT_SIZE, i * GRID_UNIT_SIZE, 2);
                }
            }
            gridOverlay.endFill();

            ElementsPanel.instance.visible = false;
            ElementsPanel.instance.onAddBorder = (p:Point) => {
                if(!this.isPointOnGrid(p))
                    return;
                let c = this.getClampedCoord(p);
                let cols = APP_WIDTH / GRID_UNIT_SIZE;
                c.x = Math.min(cols - 3, c.x);
                if(this.data) {
                    let elem = { "type" : "normal", "src" : { "x" : c.x, "y" : c.y }, "anim" : null, "segs" : [ { "x" : c.x + 3, "y" : c.y, "or" : 0 } ] };
                    this.data["borders"].push(elem);
                    this.updateLevelLayout();
                }
            }
            ElementsPanel.instance.onAddAnchor = (p:Point) => {
                if(!this.isPointOnGrid(p))
                    return;
                let c = this.getClampedCoord(p);
                if(this.data) {
                    this.data["anchors"].push( { "x" : c.x, "y" : c.y } );
                    this.updateLevelLayout();
                }
            }

            PropertiesPanel.instance.onDelete = () => {

                console.log('delete!');

                var array = null;
                if(this.currType == ElementType.Border) 
                    array = this.data["borders"];
                else if(this.currType == ElementType.Anchor)
                    array = this.data["anchors"];
                
                if(array)
                {
                    let idx = array.indexOf(this.currElementData);
                    console.log(array, idx);
                    if(idx > -1) {
                        array.splice(idx, 1);
                        this.updateLevelLayout();
                    }
                }
            }

            PropertiesPanel.instance.onPropertiesChanged = () => {
                this.updateLevelLayout();
            }

            PropertiesPanel.instance.visible = false;
        }

        open(level:Level) {
            ElementsPanel.instance.visible = true;
            this.level = level;
            this.data = JSON.parse(JSON.stringify(level.data));
            this.visible = true;
            this.clearNodes();
        }

        close() {
            this.visible = false;
            ElementsPanel.instance.visible = false;
        }

        clearNodes() {
            this.nodeIdx = 0;
            for(let n of this.nodes)
                this.removeChild(n);
            this.nodes = [];
        }

        update(dt:number) {

        }

        isCoordOnGrid(p:Point) : boolean {
            let rows = APP_HEIGHT / GRID_UNIT_SIZE;
            let cols = APP_WIDTH / GRID_UNIT_SIZE;
            return p.x >= 0 && p.x <= cols && p.y > 0 && p.y < rows;
        }

        isPointOnGrid(p:Point) : boolean {
            let x = Math.round(p.x / GRID_UNIT_SIZE);
            let y = Math.round(p.y / GRID_UNIT_SIZE);
            return this.isCoordOnGrid(new Point(x, y));
        }

        coordToScreen(p:Point) : Point {
            return new Point(p.x * GRID_UNIT_SIZE, p.y * GRID_UNIT_SIZE);   
        }

        getClampedCoord(p:Point) : Point {
            let x = Math.round(p.x / GRID_UNIT_SIZE);
            let y = Math.round(p.y / GRID_UNIT_SIZE);
            let rows = APP_HEIGHT / GRID_UNIT_SIZE;
            let cols = APP_WIDTH / GRID_UNIT_SIZE;
            x = Math.max(0, Math.min(cols, x));
            y = Math.max(0, Math.min(rows, y));
            return new Point(x, y);   
        }

        touchDown(p:Point) {

            ElementsPanel.instance.touchDown(p);
            PropertiesPanel.instance.touchDown(p);

            this.currType = ElementType.None;

            this.nodeIdx = -1;

            if(this.nodes.length > 0) {

                //edit element:
                for(let n of this.nodes) {
                    if(p.clone().subtract(new Point(n.x, n.y)).length() < 15) {
                        this.nodeIdx = this.nodes.indexOf(n);
                        this.currType = ElementType.Border;
                        break;
                    }
                }

                //deselect editing:
                if(this.nodeIdx < 0) {
                    let gridPos = this.getClampedCoord(p);

                    //add new node?
                    let stuffChanged = false;
                    for(let i=1; i<this.nodes.length; ++i) {
                        let p1 = this.nodes[i - 1].getGridPos();
                        let obj = {};
                        obj["src"] = { "x" : p1.x, "y" : p1.y };
                        obj["segs"] = [ this.currElementData["segs"][i - 1] ];
                        let b = Border.fromData(obj);
                        if(b.projectPointToBorder(p).subtract(p).length() < 5) {

                            if(EditorGrid.rightClick) {
                                //change curve orientation:
                                let seg = this.currElementData["segs"][i - 1];
                                let or = seg["or"] + 1;
                                if(or > 1)
                                    or = -1;
                                seg["or"] = or;
                            }
                            else {
                                //add node to curve:
                                let n = new EditorNode(gridPos.x, gridPos.y);
                                this.nodes.splice(i, 0, n);
                                this.currElementData["segs"].splice(i - 1, 0, { "x" : gridPos.x, "y" : gridPos.y, "or" : 0 });
                                this.addChild(n);
                            }

                            //make new point:
                            this.updateLevelLayout();
                            stuffChanged = true;
                            break;
                        }
                    }

                    if(!stuffChanged)
                        this.clearNodes();
                }
                else if(EditorGrid.rightClick) {
                    //delete node:

                    if(this.nodes.length > 2) {
                        let node = this.nodes[this.nodeIdx];
                        this.removeChild(node);
                        this.nodes.splice(this.nodeIdx, 1);
                        if(this.nodeIdx == 0) {
                            //replace source:
                            let p = this.currElementData["segs"][0];
                            this.currElementData["src"] = { "x" : p.x, "y" : p.y };
                            this.currElementData["segs"].splice(0, 1);
                        }
                        else {
                            this.currElementData["segs"].splice(this.nodeIdx - 1, 1);
                        }

                        this.nodeIdx = -1;
                        this.updateLevelLayout();
                    }

                }
            }
            else {

                //find closest border:
                var closestDistance = 0;
                var closestBorder = undefined;

                for(let b of this.data["borders"]) {
                    let border = Border.fromData(b);
                    let proj = border.projectPointToBorder(p);
                    let dist = proj.subtract(p).length();
                    if(dist < closestDistance || !closestBorder) {
                        closestDistance = dist;
                        closestBorder = border;
                        this.currElementData = b;
                    }
                }

                if(closestDistance < 10) {
                    //select border:
                    this.currType = ElementType.Border;

                    let start = this.currElementData["src"];
                    this.nodes.push(new EditorNode(start["x"], start["y"]));

                    for(let s of this.currElementData["segs"]) {
                        this.nodes.push(new EditorNode(s["x"], s["y"]));
                    }

                    for(let n of this.nodes)
                        this.addChild(n);
                }
                else if(Point.parseFromData(this.data["start"]).subtract(p).length() < BALL_RADIUS) {
                    this.currElementData = this.data["start"];
                    this.currType = ElementType.Start;
                }
                else {
                    //try to find anchor point:
                    for(let a of this.data["anchors"]) {
                        let q = Point.parseFromData(a);
                        if(q.subtract(p).length() < 10) {
                            this.currElementData = a;
                            this.currType = ElementType.Anchor;
                            break;
                        }
                    }
                }
            }

            PropertiesPanel.instance.setEditor(this.currType, this.currElementData);
        }

        updateLevelLayout() {

            if(this.nodes.length > 1) {
                let p1 = this.nodes[0].getGridPos();
                console.log("src", this.currElementData["src"]);
                this.currElementData["src"]["x"] = p1.x;
                this.currElementData["src"]["y"] = p1.y;

                for(let i=1; i<this.nodes.length; ++i) {
                    console.log("seg i", this.currElementData["src"]);
                    let pi = this.nodes[i].getGridPos();
                    this.currElementData["segs"][i - 1]["x"] = pi.x;
                    this.currElementData["segs"][i - 1]["y"] = pi.y;
                }
            }

            this.level.loadLevel(this.data);
        }

        touchMove(p:Point) {

            ElementsPanel.instance.touchMove(p);
            PropertiesPanel.instance.touchMove(p);

            let gp = this.getClampedCoord(p);
            if(this.currType == ElementType.Start || this.currType == ElementType.Anchor) 
            {
                this.currElementData["x"] = gp.x;
                this.currElementData["y"] = gp.y;
                this.updateLevelLayout();
            }
            else if(this.nodeIdx >= 0) {
                let n = this.nodes[this.nodeIdx];
                let currPos = n.getGridPos();
                if(!gp.equals(currPos)) {

                    //movement!
                    if(CTRL_PRESSED) {
                        let delta = gp.clone().subtract(currPos);
                        console.log(delta);
                        let moveAllowed = true;

                        let minPos = currPos.clone();
                        let maxPos = currPos.clone();
                        for(let n of this.nodes) {
                            let p = n.getGridPos();
                            minPos.x = Math.min(p.x, minPos.x);
                            minPos.y = Math.min(p.y, minPos.y);
                            maxPos.x = Math.max(p.x, maxPos.x);
                            maxPos.y = Math.max(p.y, maxPos.y);
                        }

                        let rows = APP_HEIGHT / GRID_UNIT_SIZE;
                        let cols = APP_WIDTH / GRID_UNIT_SIZE;
                        delta.x = Math.max(-minPos.x, Math.min(cols - maxPos.x, delta.x));
                        delta.y = Math.max(-minPos.y, Math.min(rows - maxPos.y, delta.y));

                        if(delta.length() > .5) {
                            for(let n of this.nodes) {
                                let p = n.getGridPos();
                                n.setPosition(p.x + delta.x, p.y + delta.y);
                            }
                            this.updateLevelLayout();
                        }
                    }
                    else {
                        n.setPosition(gp.x, gp.y);
                        this.updateLevelLayout();
                    }
                }
            }
        }

        touchUp(p:Point) {
            ElementsPanel.instance.touchUp(p);
            PropertiesPanel.instance.touchUp(p);
        }
    }
}