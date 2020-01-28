///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Board.ts"/>
///<reference path="Tile.ts"/>
///<reference path="TilePanel.ts"/>
///<reference path="Button.ts"/>
///<reference path="LevelSelector.ts"/>
///<reference path="LevelLoader.ts"/>
///<reference path="TileHoverLayer.ts"/>

module CircuitFreaks
{
    export class Game extends PIXI.Container {

        board:Board;
        tilePanel:TilePanel;
        buttons:Button[];
        levelSelector:LevelSelector;
        levelLoader:LevelLoader;

        text:PIXI.Text;

        //input:
        currentInputListener:InputListener;
        inputPoint:InputPoint;
        tileHoverLayer:TileHoverLayer;

        constructor(w:number, h:number) {
            super();

            var background = new PIXI.Graphics();
            background.beginFill(0x00ff00, 0.5);
            background.drawRect(0, 0, w, h);
            background.endFill();
            this.addChild(background);

            this.tilePanel = new TilePanel(this.startDragTileSet, this);
            this.tilePanel.x = w / 2.0;
            this.tilePanel.y = h * .9;
            this.addChild(this.tilePanel);

            this.board = new Board(w * 0.95, h * 0.7);
            this.board.x = w * 0.025;
            this.board.y = h * 0.1;
            this.addChild(this.board);

            this.buttons = [];
            let txts:string[] = ['♚', '♞', '↺'];
            let callbacks:Function[] = [ this.openLevelSelect, this.loadDefault, this.undo ];
            for(var i:number=0; i<txts.length; ++i) {
                var btn = new Button(txts[i], callbacks[i], this, i);
                btn.x = w * (i + 1) / 4.0;
                btn.y = h * .05;
                this.addChild(btn);
                this.buttons.push(btn);
            }

            this.levelLoader = new LevelLoader(this.loadLevel, this);
            this.levelSelector = new LevelSelector(w, h, LevelLoader.instance.loadLevel, LevelLoader.instance);
            this.addChild(this.levelSelector);

            this.tileHoverLayer = new TileHoverLayer();
            this.addChild(this.tileHoverLayer);
            this.inputPoint = new InputPoint();
        }

        loadLevel(data:LevelData) {
            this.board.loadBoard(data);
        }

        openLevelSelect() {
            this.levelSelector.show();
        }

        resetGame() {
            this.board.clearBoard();
            this.tilePanel.resetPanel();
            this.board.createSnapshot(false);
        }

        loadDefault() {
            this.board.resetBoard();
            this.tilePanel.resetPanel();
            this.board.createSnapshot(false);
        }

        undo() {
            if(this.board.tileWasPushedTMP)
                this.tilePanel.undo();
            this.board.undo();
        }

        update(dt:number) {
            this.board.update(dt);
            this.tilePanel.update(dt);

            if(this.currentInputListener != null)
                this.inputPoint.aliveTime += dt;
        }

        getInputListenerAt(p:PIXI.Point) : InputListener {
            if(this.levelSelector.isEnabled())
                return this.levelSelector.getInputListener(p);

            for(let btn of this.buttons) {
                if(btn.hitTestPoint(p))
                    return btn;
            }

            return this.tilePanel.getInputListener(p);

            // var locPos = new PIXI.Point(p.x - this.tilePanel.position.x, p.y - this.tilePanel.position.y);
            // if(this.tilePanel.select(locPos))
            //     return;

            // //push random tile to board:
            // locPos = new PIXI.Point(p.x - this.board.position.x, p.y - this.board.position.y);
            // if(this.board.pushTile(locPos, this.tilePanel.getCurrentTileSet())) {
            //     this.tilePanel.changeCurrentTile();
            // }
        }

        touchDown(p:PIXI.Point) {
            this.currentInputListener = this.getInputListenerAt(p);
            this.inputPoint.reset(p.x, p.y);
            if(this.currentInputListener != null) {
                this.inputPoint.reset(p.x, p.y);
                this.currentInputListener.touchDown(this.inputPoint);
            }

            if(this.inputPoint.cancelInput)
                this.currentInputListener = null;
        }

        touchMove(p:PIXI.Point) {
            if(this.currentInputListener != null) {
                this.inputPoint.position.x = p.x;
                this.inputPoint.position.y = p.y;
                this.currentInputListener.touchMove(this.inputPoint);
                if(this.inputPoint.cancelInput)
                    this.currentInputListener = null;
            }
            // let locPos = new PIXI.Point(p.x - this.board.position.x, p.y - this.board.position.y);
            // this.board.dragTo(locPos);
        }

        touchUp(p:PIXI.Point) {
            if(this.currentInputListener != null) {
                this.inputPoint.position.x = p.x;
                this.inputPoint.position.y = p.y;
                this.currentInputListener.touchUp(this.inputPoint);
                this.currentInputListener = null;
            }
            // let locPos = new PIXI.Point(p.x - this.board.position.x, p.y - this.board.position.y);
            // this.board.dragEnd(locPos);
        }

        startDragTileSet(set:TileSet) {
            this.tileHoverLayer.startDragging(set, this.board, this.tilePanel);
            this.currentInputListener = this.tileHoverLayer;
        }

        left() {

        }

        right() {
            
        }

        up() {
            this.resetGame();
        }

        down() {
            
        }

        rotate() {
            this.loadDefault();
        }
    }
}
