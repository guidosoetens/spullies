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

    export class Tile extends PIXI.Container {
        
        graphics:PIXI.Graphics;
        shadowGraphics:PIXI.Graphics;
        type:TileType;
        private circuitState:CircuitState;
        private altCircuitState:CircuitState;
        dropDistance:number;

        state:TileState;
        stateParameter:number;
        tileWidth:number;
        sourceHitCount:number;
        visualUpdatePending:boolean;

        groupIndex:number;

        constructor(width:number, type:TileType) {
            super();
            this.tileWidth = width;
            this.type = type;

            this.groupIndex = 0;

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
            else if(type == TileType.Source || type == TileType.DoubleSource) {
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
            this.graphics.drawRoundedRect(-width / 2,-width / 2, width, width, .1 * width);
            this.graphics.endFill();

            this.graphics.beginFill(baseColor, 1.0);
            this.graphics.drawRoundedRect(-subWidth / 2,-subWidth / 2, subWidth, subWidth, .1 * subWidth);
            this.graphics.endFill();

            let lineWidth = .1 * width;

            this.setCircuitLineStyle(this.circuitState, lineWidth);
            var rad = width / 2.0;

            let ang = .5 * Math.PI;
            switch(this.type) {
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
                    this.setCircuitLineStyle(this.altCircuitState, lineWidth);
                    this.graphics.moveTo(-rad, 0);
                    this.graphics.arc(-rad, rad, rad, -ang, 0);
                    break;
                case TileType.Double_NW:
                    this.graphics.moveTo(0, -rad);
                    this.graphics.arc(-rad, -rad, rad, 0, ang);
                    this.setCircuitLineStyle(this.altCircuitState, lineWidth);
                    this.graphics.moveTo(0, rad);
                    this.graphics.arc(rad, rad, rad, 2 * ang, 3 * ang);
                    break;
                case TileType.Source:
                    this.graphics.drawCircle(0,0,rad - lineWidth * .5);
                    break;
                case TileType.DoubleSource:
                    this.graphics.drawCircle(0,0,rad * .5);
                    this.graphics.drawCircle(0,0,rad - lineWidth * .5);
                    break;
                case TileType.Blockade:
                    break;
                case TileType.Trash:
                    break; 
            }
        }

        partialDegrade(dir:Direction) {

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
        }

        degrade() {
            var goalType = this.type;

            let b1 = this.circuitState == CircuitState.DeadLock;
            let b2 = this.altCircuitState == CircuitState.DeadLock;


            switch(this.type) {
                case TileType.Curve_NE:
                case TileType.Curve_NW:
                case TileType.Curve_SE:
                case TileType.Curve_SW:
                case TileType.Straight_H:
                case TileType.Straight_V:
                    goalType = TileType.Trash;
                    break;
                case TileType.Double_NE:
                    if(b1 && b2)
                        goalType = TileType.Trash;
                    else if(b1)
                        goalType = TileType.Curve_SW;
                    else if(b2)
                        goalType = TileType.Curve_NE;
                    break;
                case TileType.Double_NW:
                    if(b1 && b2)
                        goalType = TileType.Trash;
                    else if(b1)
                        goalType = TileType.Curve_SE;
                    else if(b2)
                        goalType = TileType.Curve_NW;
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
            this.circuitState = CircuitState.None;
            this.altCircuitState = CircuitState.None;
        }

        setStateFromDirection(dir:Direction, state:CircuitState) {
            switch(this.type) {
                case TileType.Double_NE:
                    if(dir == Direction.Down || dir == Direction.Left)
                    this.circuitState = state;
                    else 
                        this.altCircuitState = state;
                    break;
                case TileType.Double_NW:
                    if(dir == Direction.Down || dir == Direction.Right)
                        this.circuitState = state;
                    else 
                        this.altCircuitState = state;
                    break;
                default:
                    this.circuitState = state;
                    this.altCircuitState = state;
                    break;
            }
        }

        hasCircuit() {
            return this.circuitState == CircuitState.Circuit || this.altCircuitState == CircuitState.Circuit;
        }

        hasDeadlock() {
            return this.circuitState == CircuitState.DeadLock || this.altCircuitState == CircuitState.DeadLock;
        }

        circuitEliminatesTile() {
            if(!this.hasCircuit())
                return false;

            let bothCircuit = this.circuitState == CircuitState.Circuit && this.altCircuitState == CircuitState.Circuit;
            switch(this.type) {
                case TileType.DoubleSource:
                    return this.sourceHitCount >= 2;
                case TileType.Double_NE:
                case TileType.Double_NW:
                    return bothCircuit;    
            }
            return true;
        }

        mirrorTile() {
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
        }

        directionIntoState(dir:Direction, state:CircuitState) {
            switch(this.type) {
                case TileType.Double_NE:
                    if(dir == Direction.Down || dir == Direction.Left)
                        return this.circuitState == state;
                    else 
                        return this.altCircuitState == state;
                case TileType.Double_NW:
                    if(dir == Direction.Down || dir == Direction.Right)
                        return this.circuitState == state;
                    else 
                        return this.altCircuitState == state;
                default:
                    return this.circuitState == state;
            }
        }

        filterCircuitFromTile() {
            var newType = this.type;
            switch(this.type) {
                case TileType.DoubleSource:
                    if(this.sourceHitCount == 1)
                        newType = TileType.Source;
                    break;
                case TileType.Double_NE:
                    newType = this.circuitState == CircuitState.Circuit ? TileType.Curve_SW : TileType.Curve_NE;
                    break;
                case TileType.Double_NW:
                    newType = this.circuitState == CircuitState.Circuit ? TileType.Curve_SE : TileType.Curve_NW;
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
                        let dropFrac = 0.66;
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

            var n = dir == Direction.Down;
            var e = dir == Direction.Left;
            var s = dir == Direction.Up;
            var w = dir == Direction.Right;

            switch(this.type) {
                case TileType.Curve_NE:
                    return n || e;
                case TileType.Curve_NW:
                    return n || w;
                case TileType.Curve_SE:
                    return s || e;
                case TileType.Curve_SW:
                    return s || w;
                case TileType.Straight_H:
                    return w || e;
                case TileType.Straight_V:
                    return n || s;
                case TileType.Double_NE:
                case TileType.Double_NW:
                    return true;
                case TileType.Source:
                case TileType.DoubleSource:
                case TileType.Trash:
                    return true;
                case TileType.Blockade:
                    return false;
            }

            return false;
        }

        getNextDirection(dir:Direction): Direction {

            var n = dir == Direction.Down;
            var e = dir == Direction.Left;
            var s = dir == Direction.Up;
            var w = dir == Direction.Right;

            switch(this.type) {
                case TileType.Curve_NE:
                    return n ? Direction.Right : Direction.Up;
                case TileType.Curve_NW:
                    return n ? Direction.Left : Direction.Up;
                case TileType.Curve_SE:
                    return s ? Direction.Right : Direction.Down;
                case TileType.Curve_SW:
                    return s ? Direction.Left : Direction.Down;
                case TileType.Straight_H:
                    return dir;
                case TileType.Straight_V:
                    return dir;
                case TileType.Double_NE:
                    if(n || e)
                        return n ? Direction.Right : Direction.Up;
                    else
                        return s ? Direction.Left : Direction.Down;
                case TileType.Double_NW:
                    if(n || w)
                        return n ? Direction.Left : Direction.Up;
                    else
                        return s ? Direction.Right : Direction.Down;
            }

            return dir;
        }

        hasNorthPath() : boolean {
            switch(this.type) {
                case TileType.Curve_NE:
                case TileType.Curve_NW:
                case TileType.Straight_V:
                case TileType.Double_NE:
                case TileType.Double_NW:
                    return true;
            }   
            return false;
        }

        getOutwardDirectionsWithState(dirs:Direction[], state:CircuitState) {
            switch(this.type) {
                case TileType.Double_NE:
                    if(this.circuitState == state) {
                        dirs.push(Direction.Up);
                        dirs.push(Direction.Right);
                    }
                    if(this.altCircuitState == state) {
                        dirs.push(Direction.Down);
                        dirs.push(Direction.Left);
                    }
                    break;
                case TileType.Double_NW:
                    if(this.circuitState == state) {
                        dirs.push(Direction.Up);
                        dirs.push(Direction.Left);
                    }
                    if(this.altCircuitState == state) {
                        dirs.push(Direction.Down);
                        dirs.push(Direction.Right);
                    }
                    break;
                default:
                    if(this.circuitState == state)
                        this.getOutwardDirections(dirs); 
                    break;
            }
        }

        getOutwardDirections(dirs:Direction[]) {
            switch(this.type) {
                case TileType.Curve_NE:
                    dirs.push(Direction.Up);
                    dirs.push(Direction.Right);
                    break;
                case TileType.Curve_NW:
                    dirs.push(Direction.Up);
                    dirs.push(Direction.Left);
                    break;
                case TileType.Curve_SE:
                    dirs.push(Direction.Down);
                    dirs.push(Direction.Right);
                    break;
                case TileType.Curve_SW:
                    dirs.push(Direction.Down);
                    dirs.push(Direction.Left);
                    break;
                case TileType.Straight_H:
                    dirs.push(Direction.Left);
                    dirs.push(Direction.Right);
                    break;
                case TileType.Straight_V:
                    dirs.push(Direction.Up);
                    dirs.push(Direction.Down);
                    break;
                case TileType.Double_NE:
                    dirs.push(Direction.Up);
                    dirs.push(Direction.Right);
                    dirs.push(Direction.Down);
                    dirs.push(Direction.Left);
                    break;
                case TileType.Double_NW:
                    dirs.push(Direction.Up);
                    dirs.push(Direction.Left);
                    dirs.push(Direction.Down);
                    dirs.push(Direction.Right);
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