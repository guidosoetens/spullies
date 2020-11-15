///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Level.ts"/>
///<reference path="LevelLoader.ts"/>
///<reference path="menu/Menu.ts"/>
///<reference path="editor/EditorGrid.ts"/>
///<reference path="Defs.ts"/>

module Magneon
{
    export class Game extends PIXI.Container {

        level:Level = null;
        editor:EditorGrid;
        menu:Menu;

        btnGraphics:PIXI.Graphics;
        buttonText:PIXI.Text;

        size:PIXI.Point;

        constructor(w:number, h:number) {
            super();

            this.size = new PIXI.Point(w, h);

            this.btnGraphics = new PIXI.Graphics();
            this.btnGraphics.x = w - 30;
            this.btnGraphics.y = 30;
            this.btnGraphics.alpha = .8;
            this.addChild(this.btnGraphics);

            this.buttonText = new PIXI.Text(' ');
            this.buttonText.style.fontFamily = "courier";
            this.buttonText.style.fill = 0xffffff;
            this.buttonText.style.fontSize = 32;
            this.addChild(this.buttonText);

            this.menu = new Menu(w, h);
            this.menu.onOpenLevel = (data) => { this.loadLevel(data); };
            this.menu.onOpenEditor = () => { this.loadLevel(this.level.data); this.editor.open(this.level); this.buttonText.text = '▶'; };
            this.addChild(this.menu);

            this.updateButtonLayout();

            this.editor = new EditorGrid();
            this.addChild(this.editor);
            this.editor.close();

            GLOBAL_SCENE = this;
        }

        loadLevel(data:any) {
            if(this.level)
                this.removeChild(this.level);
            this.level = new Level(this.size.x, this.size.y, data);
            this.addChildAt(this.level, 0);
        }

        update(dt:number) {
            if(this.menu.visible)
                this.menu.update(dt);
            else if(this.editor.visible)
                this.editor.update(dt);
            else if(this.level)
                this.level.update(dt);
        }

        updateButtonLayout() {
            this.btnGraphics.clear();
            this.btnGraphics.lineStyle(4,0xaaaaaa,1);
            this.btnGraphics.beginFill(0x555555, 1);
            this.btnGraphics.drawCircle(0,0,20);
            this.btnGraphics.endFill();

            this.buttonText.text = '⚙';
            this.buttonText.x = this.btnGraphics.x - this.buttonText.width / 2;
            this.buttonText.y = this.btnGraphics.y - this.buttonText.height / 2;
        }

        touchDown(p:Point) {
            if(this.menu.visible) 
                this.menu.touchDown(p);
            else if(this.editor.visible)
                this.editor.touchDown(p);
            else if(this.level)
                this.level.touchDown(p);
        }

        touchMove(p:Point) {
            if(this.menu.visible) 
                this.menu.touchMove(p);
            else if(this.editor.visible)
                this.editor.touchMove(p);
            else if(this.level)
                this.level.touchMove(p);
        }

        touchUp(p:Point) {
            if(this.menu.visible) 
                this.menu.touchUp(p);
            else {

                if(this.editor.visible)
                    this.editor.touchUp(p);
                else if(this.level) 
                    this.level.touchUp(p);

                let btnLoc = new Point(this.btnGraphics.x, this.btnGraphics.y);
                if(btnLoc.subtract(p).length() < 20) {
                    if(this.editor.visible)
                        this.editor.close();
                    else
                        this.menu.open();
                    this.buttonText.text = this.editor.visible ? '▶' : '⚙';
                }
            } 
        }

        levelMade(obj:any) {
            //levelMade
        }

        left() {

        }

        right() {
            
        }

        up() {
            
        }

        down() {
            
        }

        rotate() {
            
        }
    }
}
