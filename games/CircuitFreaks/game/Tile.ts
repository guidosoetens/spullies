///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>

module CircuitFreaks
{
    export enum TileState {
        Appearing = 0,
        Idle,
        Disappearing,
        Dropping,
        Degrading,
        Gone,
        Flipping
    }

    export enum CircuitState {
        None,
        Circuit,
        DeadLock
    }

    export class TilePath {
        //outward directions:
        dir1:Direction;
        dir2:Direction;
        circuitState:CircuitState;

        constructor(d1:Direction, d2:Direction) {
            this.dir1 = d1;
            this.dir2 = d2;
            this.circuitState = CircuitState.None;
        }

        dirToAngle(d:Direction) : number {
            let thirdAng = Math.PI / 3.0;
            switch(d) {
                case Direction.Down:
                    return thirdAng * 1.5;
                case Direction.DownLeft:
                    return thirdAng * 2.5;
                case Direction.DownRight:
                    return thirdAng * 0.5;
                case Direction.Up:
                    return thirdAng * -1.5;
                case Direction.UpLeft:
                    return thirdAng * -2.5;
                case Direction.UpRight:
                    return thirdAng * -0.5;
            }
            return 0;
        }

        dirToPos(d:Direction, offset:number) : PIXI.Point {
            let ang = this.dirToAngle(d);
            return new PIXI.Point(offset * Math.cos(ang), offset * Math.sin(ang));
        }

        draw(gr:PIXI.Graphics, offset:number) {

            let p1 = this.dirToPos(this.dir1, offset);
            let p2 = this.dirToPos(this.dir2, offset);

            let steps = cwRotationsTo(this.dir1, this.dir2);

            if(getOppositeDir(this.dir1) == this.dir2) {
                //straight line:
                gr.moveTo(p1.x, p1.y);
                gr.lineTo(p2.x, p2.y);
            }
            else {

                let radius = (cwRotationsTo(this.dir1, this.dir2) % 2 == 0) ? 1.5 * offset : .5 * offset;

                gr.moveTo(p1.x, p1.y);
                gr.arcTo(0, 0, p2.x, p2.y, radius);
                gr.lineTo(p2.x, p2.y);
            }



            // let c = new PIXI.Point((p1.x / 2 + p2.x / 2) * .5, (p1.y / 2 + p2.y / 2) * .5);
            // let dist = Math.sqrt(c.x * c.x + c.y * c.y);
            // c.x *= 1.0 / dist;
            // c.y *= 1.0 / dist;
            // gr.moveTo(p1.x, p1.y);
            // gr.arcTo(0, 0, p2.x, p2.y, .5 * offset);
        }
    }

    export class Tile extends PIXI.Container {
        
        graphics:PIXI.Graphics;
        shadowGraphics:PIXI.Graphics;
        type:TileType;

        // private circuitState:CircuitState;
        // private altCircuitState:CircuitState;
        circuitState:CircuitState;
        paths:TilePath[];
        dropDistance:number;

        state:TileState;
        stateParameter:number;
        tileWidth:number;
        sourceHitCount:number;
        visualUpdatePending:boolean;

        groupIndex:number;

        constructor(width:number, desc:TileDescriptor) {
            super();
            this.tileWidth = width;
            this.type = desc.type;
            this.groupIndex = desc.groupIndex;

            this.groupIndex = 0;

            this.paths = [];
            for(let pDesc of desc.paths) {
                this.paths.push(new TilePath(pDesc.dir1, pDesc.dir2));
            }

            this.graphics = new PIXI.Graphics();
            this.addChild(this.graphics);

            this.shadowGraphics = new PIXI.Graphics();
            this.addChild(this.shadowGraphics);
            this.shadowGraphics.beginFill(0x0, 0.5);
            this.shadowGraphics.drawRoundedRect(-width / 2,-width / 2, width, width, .1 * width);
            this.shadowGraphics.endFill();
            this.shadowGraphics.alpha = 0;

            this.dropDistance = 0;
            this.setState(TileState.Idle);

            this.clearCircuitState();

            this.redraw();
        }

        getTileDescriptor() : TileDescriptor {
            let desc = new TileDescriptor(this.type, this.groupIndex);
            for(let p of this.paths)
                desc.paths.push(new TilePathDescriptor(p.dir1, p.dir2));
            return desc;
        }

        setCircuitLineStyle(state:CircuitState, lineWidth:number) {
            switch(state) {
                case CircuitState.DeadLock:
                    this.graphics.lineStyle(lineWidth, 0xffffff, .5);
                    break;
                case CircuitState.Circuit:
                    this.graphics.lineStyle(lineWidth, 0x00ffff, 1);
                    break;
                case CircuitState.None:
                default:
                    this.graphics.lineStyle(lineWidth, 0xffffff, 1);
                    break;
            }
        }

        redraw() {

            this.visualUpdatePending = false;

            let width = this.tileWidth;
            let type = this.type;

            var baseColor:number = 0x00ff00;
            var borderColor:number = 0x00aa00;
            var subWidth = width * .9;
            if(type == TileType.Blockade) {
                baseColor = 0xcc0000;
                borderColor = 0x990000;
                subWidth *= .8;
            }
            else if(type == TileType.Trash) {
                baseColor = 0xccffff;
                borderColor = 0xaacccc;
                // subWidth *= .8;
            }
            else if(type == TileType.Source || type == TileType.DoubleSource || type == TileType.TripleSource) {
                switch(this.groupIndex) {
                    case 1:
                        baseColor = 0xff00aa;
                        borderColor = 0xaa0066;
                        break;
                    case 2:
                        baseColor = 0x00aaff;
                        borderColor = 0x0066aa;
                        break;
                    case 0:
                    default:
                        baseColor = 0xffaa00;
                        borderColor = 0xaa6600;
                        break;
                }
            }

            this.graphics.clear();

            this.graphics.beginFill(borderColor, 1.0);
            // this.graphics.drawRoundedRect(-width / 2,-width / 2, width, width, .1 * width);
            drawHex(this.graphics, new PIXI.Point(0,0), width);
            this.graphics.endFill();

            this.graphics.beginFill(baseColor, 1.0);
            // this.graphics.drawRoundedRect(-subWidth / 2,-subWidth / 2, subWidth, subWidth, .1 * subWidth);
            drawHex(this.graphics, new PIXI.Point(0,0), subWidth);
            this.graphics.endFill();

            let lineWidth = .1 * width;

            this.setCircuitLineStyle(CircuitState.None, 0.15 * width);
            var rad = width / 2.0;
;
            for(var i:number=0; i<this.paths.length; ++i) {
                this.paths[i].draw(this.graphics, .5 * width);
            }

            this.setCircuitLineStyle(CircuitState.None, lineWidth);

            let ang = .5 * Math.PI;
            switch(this.type) {
                /*
                case TileType.Curve_NE:
                    this.graphics.moveTo(rad, 0);
                    this.graphics.arc(rad, -rad, rad, ang, 2 * ang); // cx, cy, radius, startAngle, endAngle
                    break;
                case TileType.Curve_NW:
                    this.graphics.moveTo(0, -rad);
                    this.graphics.arc(-rad, -rad, rad, 0, ang);
                    break;
                case TileType.Curve_SE:
                    this.graphics.moveTo(0, rad);
                    this.graphics.arc(rad, rad, rad, 2 * ang, 3 * ang);
                    break;
                case TileType.Curve_SW:
                    this.graphics.moveTo(-rad, 0);
                    this.graphics.arc(-rad, rad, rad, -ang, 0);
                    break;
                case TileType.Straight_H:
                    this.graphics.moveTo(-rad, 0);
                    this.graphics.lineTo(rad, 0);
                    break;
                case TileType.Straight_V:
                    this.graphics.moveTo(0, -rad);
                    this.graphics.lineTo(0, rad);
                    break;
                case TileType.Double_NE:
                    this.graphics.moveTo(rad, 0);
                    this.graphics.arc(rad, -rad, rad, ang, 2 * ang);
                    this.setCircuitLineStyle(CircuitState.None, lineWidth);
                    this.graphics.moveTo(-rad, 0);
                    this.graphics.arc(-rad, rad, rad, -ang, 0);
                    break;
                case TileType.Double_NW:
                    this.graphics.moveTo(0, -rad);
                    this.graphics.arc(-rad, -rad, rad, 0, ang);
                    this.setCircuitLineStyle(CircuitState.None, lineWidth);
                    this.graphics.moveTo(0, rad);
                    this.graphics.arc(rad, rad, rad, 2 * ang, 3 * ang);
                    break;
                */
                case TileType.Source:
                    this.graphics.drawCircle(0,0,rad - lineWidth * .5);
                    break;
                case TileType.DoubleSource:
                    this.graphics.drawCircle(0,0,rad * .5);
                    this.graphics.drawCircle(0,0,rad - lineWidth * .5);
                    break;
                case TileType.TripleSource:
                    this.graphics.drawCircle(0,0,rad * .5);
                    this.graphics.drawCircle(0,0,rad - lineWidth * .5);
                    this.graphics.drawCircle(0,0,rad * .1);
                    break;
                case TileType.Blockade:
                    break;
                case TileType.Trash:
                    break; 
            }
        }

        partialDegrade(dir:Direction) {
            /*
            var goalType = this.type;

            let b1 = this.circuitState == CircuitState.DeadLock;
            let b2 = this.altCircuitState == CircuitState.DeadLock;

            var keepDeadlock = false;

            switch(this.type) {
                case TileType.Double_NE:
                    if(b1 && (dir == Direction.Down || dir == Direction.Left)) {
                        goalType = TileType.Curve_SW;
                        keepDeadlock = b2;
                    }
                    else if(b2 && (dir == Direction.Up || dir == Direction.Right)) {
                        goalType = TileType.Curve_NE;
                        keepDeadlock = b1;
                    }
                    break;
                case TileType.Double_NW:
                    if(b1 && (dir == Direction.Down || dir == Direction.Right)) {
                        goalType = TileType.Curve_SE;
                        keepDeadlock = b2;
                    }
                    else if(b2 && (dir == Direction.Up || dir == Direction.Left)) {
                        goalType = TileType.Curve_NW;
                        keepDeadlock = b1;
                    }
                    break;
                default:
                    break;
            }

            if(this.type == goalType) {
                this.degrade();
            }
            else {
                this.type = goalType;
                this.clearCircuitState();
                if(keepDeadlock)
                    this.circuitState = CircuitState.DeadLock;
                this.redraw();
                this.setState(TileState.Degrading);
            }
            */
        }

        degrade() {
            var goalType = this.type;

            // let b1 = this.circuitState == CircuitState.DeadLock;
            // let b2 = this.altCircuitState == CircuitState.DeadLock;


            switch(this.type) {
                case TileType.Path:
                    goalType = TileType.Trash;
                    break;
                default:
                    return;
            }  

            this.type = goalType;
            this.clearCircuitState();
            this.redraw();
            this.setState(TileState.Degrading);
        }

        setState(state:TileState) {
            this.state = state;
            this.stateParameter = 0;

            switch(this.state) {
                case TileState.Appearing:
                    break;
                case TileState.Idle:
                    this.graphics.position.y = 0;
                    this.graphics.scale.x = this.graphics.scale.y = 1;
                    this.graphics.rotation = 0;
                    this.shadowGraphics.alpha = 0;
                    if(this.visualUpdatePending)
                        this.redraw();
                    break;
                case TileState.Disappearing:
                    break;
                case TileState.Dropping:
                    break;
                case TileState.Degrading:
                    break;
                case TileState.Gone:
                    this.graphics.visible = false;
                    break;
                case TileState.Flipping:
                    this.visualUpdatePending = true;
                    break;
            }
        }

        updateCurrentState(dt:number, duration:number, nextState:TileState) {
            this.stateParameter += dt / duration;
            if(this.stateParameter > 1.0) {
                this.setState(nextState);
            }
        }

        clearCircuitState() {
            this.sourceHitCount = 0;
            for(let p of this.paths)
                p.circuitState = CircuitState.None;
            this.circuitState = CircuitState.None;
        }

        setStateFromDirection(dir:Direction, state:CircuitState) {
            let outDir:Direction = getOppositeDir(dir);
            for(let p of this.paths) {
                if(p.dir1 == outDir || p.dir2 == outDir) {
                    p.circuitState = state;
                    break;
                }
            }

            this.circuitState = state;
        }

        hasCircuit() {
            for(let p of this.paths) {
                if(p.circuitState == CircuitState.Circuit)
                    return true;
            }
            return this.circuitState == CircuitState.Circuit;
        }

        hasDeadlock() {
            for(let p of this.paths) {
                if(p.circuitState == CircuitState.DeadLock)
                    return true;
            }
            return this.circuitState == CircuitState.DeadLock;
        }

        circuitEliminatesTile() {
            if(!this.hasCircuit())
                return false;

            switch(this.type) {
                case TileType.DoubleSource:
                    return this.sourceHitCount >= 2;
                case TileType.TripleSource:
                    return this.sourceHitCount >= 3;
            }
            return true;
        }

        mirrorTile() {
            /*
            var mirrorType = this.type;
            switch(this.type) {
                case TileType.Curve_NE:
                    mirrorType = TileType.Curve_SE;
                    break;
                case TileType.Curve_NW:
                    mirrorType = TileType.Curve_SW;
                    break;
                case TileType.Curve_SE:
                    mirrorType = TileType.Curve_NE;
                    break;
                case TileType.Curve_SW:
                    mirrorType = TileType.Curve_NW;
                    break;
                case TileType.Double_NE:
                    mirrorType = TileType.Double_NW;
                    break;
                case TileType.Double_NW:
                    mirrorType = TileType.Double_NE;
                    break;
                default:
                    //do nothing...
                    break;
            }
            this.type = mirrorType;
            this.setState(TileState.Flipping);
            */
        }

        directionIntoState(dir:Direction, state:CircuitState) : boolean {
            let oppDir:Direction = getOppositeDir(dir);
            for(let p of this.paths) {
                if(p.dir1 == oppDir || p.dir2 == oppDir)
                    return p.circuitState == state;
            }
            return false;
        }

        filterCircuitFromTile() {
            var newType = this.type;

            switch(this.type) {
                case TileType.DoubleSource:
                    if(this.sourceHitCount == 1)
                        newType = TileType.Source;
                    break;
                case TileType.TripleSource:
                    if(this.sourceHitCount == 1)
                        newType = TileType.DoubleSource;
                    else if(this.sourceHitCount == 2)
                        newType = TileType.Source;
                    break;
                case TileType.Path:
                    {
                        for(var i:number=0; i<this.paths.length; ++i) {
                            if(this.paths[i].circuitState == CircuitState.Circuit) {
                                this.paths.splice(i, 1);
                            }
                        }
        
                        if(this.paths.length == 0)
                            newType = TileType.Trash;
                    }
                    break;  
            }

            this.type = newType;
            this.clearCircuitState();
            this.redraw();
            this.setState(TileState.Degrading);
        }

        updateState(dt:number) {
            switch(this.state) {
                case TileState.Appearing:
                    this.graphics.scale.x = this.graphics.scale.y = easeOutElastic(this.stateParameter);
                    this.updateCurrentState(dt, 0.5, TileState.Idle);
                    break;
                case TileState.Idle:
                    //do nothing...
                    break;
                case TileState.Disappearing:
                    {
                        this.graphics.alpha = 1 - this.stateParameter;
                        this.updateCurrentState(dt, 0.5, TileState.Gone);
                    }
                    break;
                case TileState.Dropping:
                    {
                        var t = this.stateParameter;//1 - easeBounceOut(this.stateParameter);
                        let dropFrac = 0.5;
                        if(t < dropFrac) {
                            let tt = t / dropFrac;
                            this.graphics.position.y = Math.cos(tt * .5 * Math.PI) * this.dropDistance;
                        }
                        else {
                            let tt = (t - dropFrac) / (1 - dropFrac);
                            this.graphics.position.y = 0;
                            this.graphics.scale.x = 1 + 0.1 * Math.sin(tt * 6) * (1 - tt);
                            this.graphics.scale.y = 2 - this.graphics.scale.x;
                        }
                        // this.graphics.position.y = t * this.dropDistance;
                        this.updateCurrentState(dt, 0.66, TileState.Idle);
                    }
                    break;
                case TileState.Degrading:
                    {
                        var t = .2 * Math.sin(this.stateParameter * 10) * (1 - this.stateParameter);
                        // this.graphics.rotation = t;
                        this.graphics.scale.x = this.graphics.scale.y = 1 + .1 * Math.sin(this.stateParameter * 15) * (1 - this.stateParameter);
                        this.updateCurrentState(dt, 0.5, TileState.Idle);
                    }
                    break;
                case TileState.Gone:
                    //do nothing...
                    break;
                case TileState.Flipping:
                    {
                        var t = .5 + .5 * Math.cos(this.stateParameter * 2 * Math.PI);
                        // var s = 1 - .3 * Math.sin(this.stateParameter * 15) * (1 - this.stateParameter);
                        // this.graphics.scale.x = s;
                        this.graphics.scale.y = t;
                        this.shadowGraphics.alpha = 1 - t;
                        // this.graphics.scale.y = t;

                        if(this.stateParameter >= .5 && this.visualUpdatePending)
                            this.redraw();
                        this.updateCurrentState(dt, 0.3, TileState.Idle);
                    }
                    break;
            }
        }

        update(dt:number) {
            this.updateState(dt);
        }

        drop(distance:number) {
            this.dropDistance = distance;
            this.setState(TileState.Dropping);
        }

        connects(dir:Direction): boolean {

            switch(this.type) {
                case TileType.Path:
                    {
                        let oppDir = getOppositeDir(dir);
                        for(let p of this.paths) {
                            if(p.dir1 == oppDir || p.dir2 == oppDir)
                                return true;
                        }
                        return false;
                    }
                case TileType.Source:
                case TileType.DoubleSource:
                case TileType.TripleSource:
                case TileType.Trash:
                    return true;
                case TileType.Blockade:
                    return false;
            }

            return false;
        }

        getNextDirection(dir:Direction): Direction {
            switch(this.type) {
                case TileType.Path:
                    {
                        let oppDir = getOppositeDir(dir);
                        for(let p of this.paths) {
                            if(p.dir1 == oppDir)
                                return p.dir2;
                            else if(p.dir2 == oppDir)
                                return p.dir1;
                        }
                    }
            }

            return dir;
        }

        getOutwardDirectionsWithState(dirs:Direction[], state:CircuitState) {
            switch(this.type) {
                case TileType.Path:
                    for(let p of this.paths) {
                        if(p.circuitState == state) {
                            dirs.push(p.dir1);
                            dirs.push(p.dir2);
                        }
                    }
                    break;
            }
        }

        getOutwardDirections(dirs:Direction[]) {
            switch(this.type) {
                case TileType.Path:
                    for(let p of this.paths) {
                        dirs.push(p.dir1);
                        dirs.push(p.dir2);
                    }
                    break;
            }
        }

        HSVtoRGB(h, s, v):number {
            var r, g, b, i, f, p, q, t;
            if (arguments.length === 1) {
                s = h.s, v = h.v, h = h.h;
            }
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }
            return Math.round(r * 255) * 256 * 256 + Math.round(g * 255) * 256 + Math.round(b * 255);
        }
    }
}