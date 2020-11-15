///<reference path="../../../../pixi/pixi.js.d.ts"/>
///<reference path="../Level.ts"/>
///<reference path="EditorNode.ts"/>
///<reference path="ElementType.ts"/>
///<reference path="BorderTypeSelector.ts"/>

module Magneon
{

    export class PropertiesPanel extends PIXI.Container {
        
        static instance:PropertiesPanel;

        buttons:PIXI.Graphics[] = [];

        onDelete:Function;
        onPropertiesChanged:Function;

        txt:PIXI.Text;

        typeSelector:BorderTypeSelector;

        constructor() {
            super();
            PropertiesPanel.instance = this;

            // this.visible = false;

            var gr = new PIXI.Graphics();
            gr.beginFill(0x0, 0.5);
            gr.drawRoundedRect(0, 0, 100, 200, 5);
            gr.endFill();
            this.addChild(gr);

            gr = this.pushButton();
            gr.lineStyle(2, 0xffffff);
            // gr.beginFill(0xffffff);
            gr.moveTo(-5,10);
            gr.lineTo(5, 10);
            gr.lineTo(10, -5);
            gr.lineTo(-10, -5);
            gr.closePath();
            gr.moveTo(-10, -8);
            gr.lineTo(10, -8);
            gr.lineTo(8, -10);
            gr.lineTo(-8, -10);
            gr.closePath();

            this.typeSelector = new BorderTypeSelector();
            this.typeSelector.x = 10;
            this.typeSelector.y = 100;
            this.addChild(this.typeSelector);

            // gr = this.pushButton();
            // gr.lineStyle(2, 0xffffff);
            // gr.drawCircle(0, 0, 10);
            // gr.drawCircle(0, 0, 5);

            this.resetButtonPositions();

            this.txt = new PIXI.Text();
            this.txt.style.fontFamily = "courier";
            this.txt.x = 10;
            this.txt.y = 10;
            this.txt.style.fill = 0xffffff;
            this.txt.style.fontSize = 14;
            this.addChild(this.txt);
            
        }

        setEditor(type:ElementType, data:any) {
            if(type == ElementType.None) {
                this.visible = false;
                return;
            }
            else {
                this.visible = true;
                this.typeSelector.visible = false;
                switch(type) {
                    case ElementType.Anchor:
                        this.txt.text = 'anchor:'
                        break;
                    case ElementType.Border:
                        this.txt.text = 'border:'
                        this.typeSelector.bindBorder(data);
                        break;
                    case ElementType.Start:
                        this.txt.text = 'start:'
                        break;
                }
            }
        }

        pushButton() : PIXI.Graphics {
            let gr = new PIXI.Graphics();
            gr.beginFill(0x0, .5);
            gr.drawRoundedRect(-18,-18,40,40,5);
            // gr.lineStyle(2, 0x555555);
            gr.beginFill(0x555555, 1);
            gr.drawRoundedRect(-20,-20,40,40,5);
            gr.beginFill(0x888888, 1);
            gr.drawRoundedRect(-15,-15,30,30,5);
            gr.endFill();
            this.addChild(gr);
            this.buttons.push(gr);
            return gr;
        }

        resetButtonPositions() {
            let idx = 0;
            for(let b of this.buttons) {
                b.x = 30;
                b.y = 50 + idx * 50;
                ++idx;
            }
        }

        touchDown(p:Point) {
            if(!this.visible)
                return;

            if(this.typeSelector.tryTouchDown(p)) {
                this.onPropertiesChanged();
            }

            let pLoc = this.toLocal(p.toPixi(), GLOBAL_SCENE);
            for(let i=0; i<this.buttons.length; ++i) {
                let b = this.buttons[i];
                let dx = pLoc.x - b.x;
                let dy = pLoc.y - b.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if(dist < 20) {
                    this.onDelete(p);
                    break;
                }
            }
        }

        touchMove(p:Point) {
            
        }

        touchUp(p:Point) {
            
        }

    }
}