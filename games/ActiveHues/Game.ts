///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="controls/HueCircle.ts"/>
///<reference path="controls/RemoteControl.ts"/>
///<reference path="controls/Logo.ts"/>

module ActiveHues
{
    export class Game extends PIXI.Container {

        hueCircle:HueCircle;
        remoteControl:RemoteControl;
        activeControl:UserControl;
        hueMode:boolean;

        ignoreInput:boolean;

        logo:Logo;

        transitionParam:number;

        leftArrow:PIXI.Text;
        rightArrow:PIXI.Text;

        constructor(w:number, h:number) {
            super();

            this.width = w;
            this.height = h;

            var bgGraphics = new PIXI.Graphics();
            bgGraphics.beginFill(0xffffff, 1);
            bgGraphics.drawRect(0,0,w,h);
            bgGraphics.endFill();
            this.addChild(bgGraphics);
            
            this.hueCircle = new HueCircle(w, h);
            this.addChild(this.hueCircle);

            this.activeControl = this.hueCircle;

            this.remoteControl = new RemoteControl(w, h);
            this.remoteControl.alpha = 0;
            // this.remoteControl.visible = false;
            this.addChild(this.remoteControl);

            this.hueMode = true;
            this.ignoreInput = false;

            this.logo = new Logo();
            this.addChild(this.logo);

            this.transitionParam = 1.0;


            this.leftArrow = new PIXI.Text("◄");
            this.leftArrow.style.fontSize = 40 + 'px';
            this.leftArrow.style.fill = 0xaaaaaa;
            // this.leftArrow.style.fontWeight = '100';
            this.leftArrow.anchor.set(0.5, 0.5);
            this.leftArrow.x = 20;
            this.leftArrow.y = h / 2.0;
            this.addChild(this.leftArrow);

            this.rightArrow = new PIXI.Text("►");
            this.rightArrow.style.fontSize = 40 + 'px';;
            this.rightArrow.style.fill = 0xaaaaaa;
            // this.rightArrow.style.fontWeight = '100';
            this.rightArrow.anchor.set(0.5, 0.5);
            this.rightArrow.x = w - 20;
            this.rightArrow.y = h / 2.0;
            this.addChild(this.rightArrow);
        }

        update(dt:number) {

            this.transitionParam = Math.min(this.transitionParam + dt / .5, 1.0); 


            var appearParam = 1.0;
            var disappearParam = 1.0;

            var otherControl = this.hueMode ? this.remoteControl : this.hueCircle;


            if(this.transitionParam < .5) {
                appearParam = 0.0;
                disappearParam = 1 - Math.cos(this.transitionParam * Math.PI);
            }
            else {
                appearParam = Math.sin((this.transitionParam - .5) * Math.PI);
                disappearParam = 1;
            }

            this.leftArrow.alpha = .1;
            this.rightArrow.alpha = .1;
            if(this.transitionParam > .8) {
                if(this.hueMode)
                    this.rightArrow.alpha = 1;
                else
                    this.leftArrow.alpha = 1;
            }

            const offset = 60 * (this.hueMode ? -1 : 1);
            this.activeControl.alpha = Math.pow(appearParam, 2.0);
            this.activeControl.x = (1 - appearParam) * offset;
            otherControl.alpha = Math.pow(1.0 - disappearParam, 2.0);
            otherControl.x = disappearParam * -offset;
        }

        touchDown(p:PIXI.Point) {

            if(this.transitionParam < 1.0)
                return;

            if(p.x < 100) {
                if(!this.hueMode) {
                    this.ignoreInput = true;
                    this.hueMode = true;
                    this.activeControl = this.hueCircle;
                    this.transitionParam = 0;
                }
            }
            else if(p.x > this.width - 100) {
                if(this.hueMode) {
                    this.ignoreInput = true;
                    this.hueMode = false;
                    this.activeControl = this.remoteControl;
                    this.transitionParam = 0;
                }
            }
            else {
                this.ignoreInput = false;
                this.activeControl.touchDown(p);
            }
        }

        touchMove(p:PIXI.Point) {
            if(!this.ignoreInput)
                this.activeControl.touchMove(p);
        }

        touchUp(p:PIXI.Point) {
            if(!this.ignoreInput)
                this.activeControl.touchUp(p);
        }
    }
}
