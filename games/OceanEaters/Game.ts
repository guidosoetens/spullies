///<reference path="../../pixi/pixi.js.d.ts"/>

module OceanEaters
{
    export class Game extends PIXI.Application {

        debugText:PIXI.Text;
        
        constructor(w:number, h:number) {
            super(w, h, { antialias: true, backgroundColor : 0x1099bb });

            this.debugText = new PIXI.Text('Basic text in pixi');
            this.debugText.x = 20;
            this.debugText.y = 10;
            this.stage.addChild(this.debugText);

            var graphics = new PIXI.Graphics();

            // set a fill and line style
            graphics.beginFill(0xFF3300);
            graphics.lineStyle(10, 0xffd900, 1);
            graphics.position.y = 100;

            var sr = Math.random() * 50.0;
        
            // draw a shape
            graphics.moveTo(sr,sr);
            graphics.lineTo(250, 50);
            graphics.lineTo(100, 100);
            graphics.lineTo(250, 220);
            graphics.lineTo(50, 220);
            graphics.lineTo(sr, sr);
            graphics.endFill();
        
            this.stage.addChild(graphics);

            // alert('A');
            this.ticker.add(this.update, this);
            // alert('B');
        }

        resize(w:number, h:number) {
            // this.game.scale.setGameSize(w, h);
        }

        update(dt:number) {
            this.debugText.text = "FPS: " + Math.round(1000.0 / this.ticker.elapsedMS);
        }
    }
}