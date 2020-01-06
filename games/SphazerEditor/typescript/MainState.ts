///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="ToolbarOption.ts"/>
///<reference path="Definitions.ts"/>
///<reference path="Level.ts"/>

module EditorModule
{
    export class MainState extends Phaser.State {
        
        private _isAnimating:boolean;
        private toolbarOptions:Phaser.Group;
        private level:Level;
        private noTouchVisual:Phaser.Group;
        private noTouchShowParameter:number;
        
        private animationTime:number;
        
        public get isAnimating() {
            return this._isAnimating;
        }
        
        public set isAnimating(val:boolean) {
            this._isAnimating = val;
            this.onAnimationStateChanged();
        }
        
        constructor() {
            super();
            
            this._isAnimating = false;
        }
        
        serializePoint(pt:Phaser.Point) : any {
            return { "x" : pt.x, "y" : pt.y };
        }
        
        deserializePoint(data:any) : Phaser.Point {
            return new Phaser.Point(data.x, data.y);
        }
        
        serializeLevel() : any {
            return this.level.serialize();
        }
        
        loadLevel(data:any) {
            this.level.deserialize(data);
        }
        
        clearLevel() {
            this.level.clearLevel();
        }
        
        private onAnimationStateChanged() {
            this.noTouchShowParameter = 0.0;
            
            if(this.isAnimating) {
                this.animationTime = 0.0;
            }
            
            this.level.setAnimationTime(0.0);
        }
       
        preload() {
            
        }
        
        create() {
            
            var bgGraphics = this.game.add.graphics(0,0);
            bgGraphics.beginFill(0xffffff);
            bgGraphics.drawRect(0,0,STAGE_WIDTH,STAGE_HEIGHT);
            
            //create level:
            this.level = new Level(this.game);
            this.level.position = new Phaser.Point(LEVEL_HORIZONTAL_MARGIN, LEVEL_VERTICAL_MARGIN);
            //this.stage.addChild(this.level);
            
            var grToolsBounds = new Phaser.Rectangle(2, 5, STAGE_WIDTH - 4, (STAGE_HEIGHT - LEVEL_HEIGHT - 2 * LEVEL_VERTICAL_MARGIN) - 7);
            
            var grTools = this.game.add.graphics(0, LEVEL_HEIGHT + 2 * LEVEL_VERTICAL_MARGIN);
            grTools.lineStyle(2, 0x888888);
            grTools.beginFill(0xaaaaaa, .5);
            grTools.drawRoundedRect(grToolsBounds.x, grToolsBounds.y, grToolsBounds.width, grToolsBounds.height, 10);
            grTools.endFill();
            
            var callbacks = [
                (opt) => { this.level.addPolygon(opt.position, 3) },
                (opt) => { this.level.addPolygon(opt.position, 4) },
                (opt) => { this.level.addPolygon(opt.position, 5) },
                (opt) => { this.level.addPolygon(opt.position, 6) },
                (opt) => { this.level.addPolygon(opt.position, SPECIAL_POLYGON_CIRCLE) },
                (opt) => { this.level.addPolygon(opt.position, SPECIAL_POLYGON_HEART) },
                (opt) => { this.level.addPolygon(opt.position, SPECIAL_POLYGON_STAR) },
                (opt) => { this.level.addTunnel(opt.position) }
            ];
            
            var symbols = ["▲", "◼", "⬟", "⬢", "🌑", "♥", "★", "🍙"];
            
            //create tool options:
            this.toolbarOptions = this.game.add.group();
            for(var i:number=0; i<8; ++i) {
                var opt:ToolbarOption = new ToolbarOption(this.game, new Phaser.Point(20 + (i * 1.25 + .5) * TOOL_OPT_WIDTH, LEVEL_HEIGHT + 2 * LEVEL_VERTICAL_MARGIN + grToolsBounds.centerY), callbacks[i], symbols[i]);
                this.toolbarOptions.addChild(opt);
            }
            
            this.game.input.onDown.add(this.onInputDown, this);
            
            this.noTouchVisual = this.game.add.group();
            this.noTouchVisual.position.x = STAGE_WIDTH / 2;
            this.noTouchVisual.position.y = 60;
            this.noTouchShowParameter = 0.0;
            var gr = this.game.make.graphics(0,0);
            this.noTouchVisual.addChild(gr);
            gr.beginFill(0x0, .5);
            gr.lineStyle(2, 0xffffff, .5);
            gr.drawRoundedRect(-180, -20, 360, 40, 5);
            gr.endFill();
            var style = { font: "18px Arial", fill: "#ffffff", align: "center" };
            var tb = this.game.make.text(0, 0, 'cannot manipulate field during animation', style);
            tb.position.x -= .5 * tb.width;
            tb.position.y -= .45 * tb.height;
            this.noTouchVisual.addChild(tb);
            
            SidePanelInterface.setPolygonFocus(null);
            SidePanelInterface.setNodeFocus(null);
            
        }
        
        onInputDown() {
            
            if(this.isAnimating) {
                this.noTouchShowParameter = 1.0;
                this.level.trySelectPolygon();
                return;
            }
            
            //try capture toolbar option:
            for (var item of this.toolbarOptions.children) {
                var opt = <ToolbarOption>item;
                if(opt.tryCaptureMouse())
                    return;
            }
            
            if(this.level.tryCaptureMouse())
                return;
        }
        
        update() {
            this.noTouchShowParameter *= .965;
            this.noTouchVisual.alpha = Math.min(1.0, 8 * this.noTouchShowParameter);
            this.noTouchVisual.scale.x = 1.0 + Math.pow(this.noTouchShowParameter, 3.0) * .1 * Math.cos(this.noTouchShowParameter * 20);
            this.noTouchVisual.scale.y = 2.0 - this.noTouchVisual.scale.x;
            
            
            if(this.isAnimating) {
                this.animationTime += this.game.time.physicsElapsed;
                this.level.setAnimationTime(this.animationTime);
                
                if(this.animationTime > 100.0)
                    this.animationTime = 0.0;
            }
        }
        
        render() {
            this.game.debug.text(debugTekstje, 20, 20, "#ffffff");
        }
    }
}