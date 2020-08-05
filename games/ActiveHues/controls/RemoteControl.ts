///<reference path="UserControl.ts"/>
///<reference path="RemoteButton.ts"/>

module ActiveHues
{
    export class RemoteControl extends UserControl {


        buttons:RemoteButton[];

        activeButton:RemoteButton;

        constructor(w:number, h:number) {
            super(w, h);

            this.buttons = [];

            var btnRad = Math.min(w, h) * .1;
            var btnUnitOffset = 2 * btnRad;

            const locs = [ new PIXI.Point(0, 0), new PIXI.Point(1, 0), new PIXI.Point(0,1), new PIXI.Point(-1,0), new PIXI.Point(0, -1),
            new PIXI.Point(-1.5, 1.5), new PIXI.Point(1.5, 1.5) ];
            // const txts = [ 'OK', '\u0001', '\uf107', '\uf104', '\uf106', '\uf3e5', '\uf015' ];
            const txts = [ 'OK', '˃', '˅', '˂', '˄', '◄', '✕'];
            const vals = [ 'o', 'r', 'd', 'l', 'u', 'b', 'h' ];

            for(var i:number=0; i<7; ++i) {
                var btn = new RemoteButton((i > 4 ? .7 : 1) * btnRad, txts[i], vals[i]);
                var loc = locs[i];
                btn.position = new PIXI.Point(w / 2 + loc.x * btnUnitOffset, h / 2 + (loc.y - .3) * btnUnitOffset);
                this.buttons.push(btn);
                this.addChild(btn);

                if(i > 0 && i < 5)
                    btn.setCurveButton((i - 1) * .5 * Math.PI, btnUnitOffset);
            }

            this.activeButton = null;
        }

        
        touchDown(p:PIXI.Point) {
            for(var b of this.buttons) {
                if(b.hitTestPoint(p)) {
                    this.activeButton = b;
                    b.background.alpha = .5;
                    broadcastKeyMessage(b.value);
                    break;
                }
            }
        }

        touchMove(p:PIXI.Point) {
            
        }

        touchUp(p:PIXI.Point) {
            if(this.activeButton != null) {
                this.activeButton.background.alpha = 1;
                this.activeButton = null;
            }
        }
    }
}