///<reference path="../../../pixi/pixi.js.d.ts"/>

module ActiveHues
{
    export class RemoteButton extends PIXI.Container {

        radius:number;
        value:string;
        text:PIXI.Text;

        background:PIXI.Graphics;
        topVisual:PIXI.Graphics;

        constructor(radius:number, text:string, value:string) {
            super();

            this.value = value;
            this.radius = radius;
            this.width = 2 * radius;
            this.height = 2 * radius;

            this.background = new PIXI.Graphics();
            this.background.beginFill(0xaaaaaa, 1);
            this.background.drawCircle(0, 0, this.radius);
            this.background.endFill();
            this.addChild(this.background);

            this.topVisual = new PIXI.Graphics();
            this.addChild(this.topVisual);

            this.text = new PIXI.Text(text);
            // this.text.style.fontFamily = "groboldregular";
            this.text.style.fontSize = 40;
            this.text.style.stroke = 0xffffff;
            this.text.style.fill = 0xffffff;
            this.text.style.fontWeight = '900';
            this.text.anchor.set(0.5, 0.5);
            this.text.style.dropShadow = true;
            this.text.style.dropShadowAlpha = .5;
            this.text.x = 0;
            this.text.y = 0;
            this.addChild(this.text);
        }

        hitTestPoint(p:PIXI.Point) {
            var toX = p.x - this.position.x;
            var toY = p.y - this.position.y;
            var dist = Math.sqrt(toX * toX + toY * toY);
            return dist <= this.radius;
        }

        setCurveButton(angle:number, baseOffset:number) {

            var pivX = -baseOffset;

            const ang = .25 * Math.PI;
            const n1 = new PIXI.Point(Math.cos(ang), Math.sin(ang));

            const p1 = new PIXI.Point(pivX + n1.x * (baseOffset - this.radius), n1.y * (baseOffset - this.radius));
            const p2 = new PIXI.Point(pivX + n1.x * (baseOffset + this.radius), n1.y * (baseOffset + this.radius));
            const p3 = new PIXI.Point(p2.x, -p2.y);
            const p4 = new PIXI.Point(p1.x, -p1.y);

            this.background.clear();
            this.background.rotation = angle;
            this.background.beginFill(0xaaaaaa, 1);
            this.background.moveTo(p1.x, p1.y);
            this.background.lineTo(p2.x, p2.y);
            this.background.arcTo(pivX + 2 * (p2.x - pivX), 0, p3.x, p3.y, baseOffset + this.radius);
            this.background.lineTo(p4.x, p4.y);
            this.background.arcTo(pivX + 2 * (p1.x - pivX), 0, p1.x, p1.y, baseOffset - this.radius);
            this.background.endFill();

            this.topVisual.clear();
            this.topVisual.rotation = angle;
            this.topVisual.lineStyle(.2 * this.radius, 0xffffff);
            this.topVisual.moveTo(p1.x, p1.y);
            this.topVisual.lineTo(p2.x, p2.y);
            this.topVisual.arcTo(pivX + 2 * (p2.x - pivX), 0, p3.x, p3.y, baseOffset + this.radius);
            this.topVisual.lineTo(p4.x, p4.y);
            this.topVisual.arcTo(pivX + 2 * (p1.x - pivX), 0, p1.x, p1.y, baseOffset - this.radius);
        }
    }
}