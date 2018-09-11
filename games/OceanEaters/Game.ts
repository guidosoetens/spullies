///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Ocean.ts"/>


module OceanEaters
{
    export class Game extends PIXI.Application {

        debugText:PIXI.Text;

        playerPos:PIXI.Point;
        playerDir:number;
        ocean:Ocean;
        
        constructor(w:number, h:number) {
            super(w, h, { antialias: true, backgroundColor : 0x1099bb });

            /*
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
            */
        }

        setup() {
            this.ticker.add(this.update, this);

            this.debugText = new PIXI.Text('Basic text in pixi');
            this.debugText.x = 20;
            this.debugText.y = 10;
            this.stage.addChild(this.debugText);

            this.ocean = new Ocean(this.stage.width, .5 * this.stage.height);
            this.ocean.resetLayout(0, .5 * this.stage.height, this.stage.width, this.stage.height);
            this.stage.addChild(this.ocean);

            this.playerPos = new PIXI.Point(0,0);
            this.playerDir = 0;
        }

        resize(w:number, h:number) {
            // this.game.scale.setGameSize(w, h);
        }

        update(dtMs:number) {
            var dt = 1000 * dt;
            this.debugText.text = "FPS: " + Math.round(1.0 / this.ticker.elapsedMS);

            this.ocean.updateFrame(dt, this.playerPos, this.playerDir);
        }
    }
}