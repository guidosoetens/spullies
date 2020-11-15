///<reference path="../../../../pixi/pixi.js.d.ts"/>
///<reference path="../Level.ts"/>
///<reference path="EditorNode.ts"/>

module Magneon
{

    export class ElementsPanel extends PIXI.Container {
        
        static instance:ElementsPanel;

        buttons:PIXI.Graphics[] = [];

        onAddBorder:Function;
        onAddAnchor:Function;

        dragIndex:number = -1;

        constructor() {
            super();
            ElementsPanel.instance = this;

            // this.visible = false;

            var gr = new PIXI.Graphics();
            gr.beginFill(0x0, 0.5);
            gr.drawRoundedRect(0, 0, 60, 200, 5);
            gr.endFill();
            this.addChild(gr);

            gr = this.pushButton();
            gr.lineStyle(2, 0xffffff);
            gr.moveTo(-10,-10);
            gr.lineTo(10,10);

            gr = this.pushButton();
            gr.lineStyle(2, 0xffffff);
            gr.drawCircle(0, 0, 10);
            gr.drawCircle(0, 0, 5);

            this.resetButtonPositions();
            
        }

        pushButton() : PIXI.Graphics {
            let gr = new PIXI.Graphics();
            gr.lineStyle(2, 0x005500);
            gr.beginFill(0x00aa00, 1);
            gr.drawRoundedRect(-20,-20,40,40,5);
            gr.endFill();
            this.addChild(gr);
            this.buttons.push(gr);
            return gr;
        }

        resetButtonPositions() {
            let idx = 0;
            for(let b of this.buttons) {
                b.x = 30;
                b.y = 30 + idx * 50;
                ++idx;
            }
        }

        touchDown(p:Point) {
            if(!this.visible)
                return;
            
            this.dragIndex = -1;

            let pLoc = this.toLocal(p.toPixi(), GLOBAL_SCENE);
            for(let i=0; i<this.buttons.length; ++i) {
                let b = this.buttons[i];
                let dx = pLoc.x - b.x;
                let dy = pLoc.y - b.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if(dist < 20) {
                    this.dragIndex = i;
                }
            }
        }

        touchMove(p:Point) {
            if(this.dragIndex < 0)
                return;

            let pLoc = this.toLocal(p.toPixi(), GLOBAL_SCENE);
            this.buttons[this.dragIndex].position = pLoc;
        }

        touchUp(p:Point) {
            if(this.dragIndex < 0)
                return;
                
            this.resetButtonPositions();

            switch(this.dragIndex) {
                case 0:
                    this.onAddBorder(p);
                    break;
                case 1:
                    this.onAddAnchor(p);
                    break;
            }

            this.dragIndex = -1;
        }

    }
}