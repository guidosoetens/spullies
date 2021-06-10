///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Defs.ts"/>

module CircuitFreaks {
    export class Button extends PIXI.Container {

        graphics: PIXI.Graphics;
        text: PIXI.Text;
        func: Function;
        listener: any;
        argument: number;

        visWidth: number;
        visHeight: number;

        constructor(text: string, func: Function, listener: any, argument: number = 0, radius: number = 20, base_width: number = 50, base_height: number = 1) {
            super();

            base_width = Math.max(base_width, 1);
            base_height = Math.max(base_height, 1);

            this.func = func;
            this.listener = listener;
            this.argument = argument;

            var hw = base_width / 2.0;

            this.graphics = new PIXI.Graphics();
            this.graphics.beginFill(0x22ff22);
            this.graphics.lineStyle(5, 0xffffff, 1);
            this.visWidth = base_width + 2 * radius;
            this.visHeight = base_height + 2 * radius;
            this.graphics.drawRoundedRect(-this.visWidth / 2, -this.visHeight / 2, this.visWidth, this.visHeight, radius);

            this.graphics.beginFill(0xffffff, 0.5);
            this.graphics.lineStyle(0);
            this.graphics.drawCircle(.5 * base_width, -.25 * radius, .5 * radius);
            this.graphics.endFill();

            this.addChild(this.graphics);

            this.text = new PIXI.Text(text);
            this.text.style.fontFamily = "groboldregular";
            this.text.style.fontSize = 40;
            this.text.style.stroke = 0xffffff;
            this.text.style.fill = 0xffffff;
            this.text.anchor.set(0.5, 0.5);
            this.text.style.dropShadow = true;
            this.text.style.dropShadowAlpha = .5;
            this.text.x = 0;
            this.text.y = 0;
            this.addChild(this.text);
        }

        hitTestPoint(p: PIXI.Point): boolean {
            var toBtn = new PIXI.Point(p.x - this.position.x, p.y - this.position.y);
            return Math.abs(toBtn.x) < this.visWidth / 2 * this.scale.x && Math.abs(toBtn.y) < this.visHeight / 2 * this.scale.y;
        }

        touchDown(p: InputPoint) {
            //OK
        }

        touchMove(p: InputPoint) {
            let toPos = new PIXI.Point(p.position.x - p.sourcePosition.x, p.position.y - p.sourcePosition.y);
            if (toPos.x * toPos.x + toPos.y * toPos.y > 10)
                p.cancelInput = true;
        }

        touchUp(p: InputPoint) {
            this.func.call(this.listener, this.argument);
        }
    }
}