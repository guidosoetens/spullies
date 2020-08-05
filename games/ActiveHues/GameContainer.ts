///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Game.ts"/>


module ActiveHues
{
    const APP_WIDTH = 800;
    const APP_HEIGHT = 600;

    export class touchElement {
        id:number;
        currentX:number;
        currentY:number;
        originX:number;
        originY:number;
        timeAlive:number;
    }

    export class GameContainer extends PIXI.Application {

        //input tracking:
        touchPoints:touchElement[];

        //movement:
        playerPos:PIXI.Point;
        playerAngle:number;
        playerDirection:PIXI.Point;
        angularSpeed:number;

        //debug:
        // debugText:PIXI.Text;
        debugGraphics:PIXI.Graphics;

        //game components:
        backgroundTexture:PIXI.Texture;
        backgroundImage:PIXI.Sprite;

        // touchContainerGraphics:PIXI.Graphics;
        componentMask:PIXI.Graphics;
        game:Game;

        hasFocusTouch:boolean;

        constructor(w:number, h:number) {
            super(w, h, { antialias: true, backgroundColor : 0xffffff, transparent : false });

            // this.backgroundTexture = PIXI.Texture.fromImage('assets/background.png');
            // this.backgroundImage = new PIXI.Sprite(this.backgroundTexture);
            // this.stage.addChild(this.backgroundImage);

            this.game = new Game(w, h);
            this.stage.addChild(this.game);
            this.componentMask = new PIXI.Graphics();
            this.componentMask.beginFill(0xFFFFFF);
            this.componentMask.drawRect(0, 0, w, h);
            this.componentMask.endFill();
            this.componentMask.isMask = true;
            this.game.mask = this.componentMask;

            this.hasFocusTouch = false;
        }

        setInnerAppSize(w:number, h:number) {
            this.game.scale.x = w / APP_WIDTH;
            this.game.scale.y = h / APP_HEIGHT;
        }

        setup() {
            this.ticker.add(this.update, this);
            
            this.stage.interactive = true;
            this.stage.on("pointerdown", this.pointerDown, this);
            this.stage.on("pointermove", this.pointerMove, this);
            this.stage.on("pointerupoutside", this.pointerUp, this);
            this.stage.on("pointercancel", this.pointerUp, this);
            this.stage.on("pointerup", this.pointerUp, this);
            this.stage.on("pointerout", this.pointerUp, this);
            console.log("input events are hooked");

            this.touchPoints = [];

            // this.debugText = new PIXI.Text('');
            // this.debugText.x = 20;
            // this.debugText.y = 10;
            // this.game.addChild(this.debugText);

            this.debugGraphics = new PIXI.Graphics();
            this.game.addChild(this.debugGraphics);
        }

        keyDown(key:number) {
            // switch(key) {
            //     case 37: //left
            //         this.game.left();
            //         break;
            //     case 38: //up
            //         this.game.up();
            //         break;
            //     case 39: //right
            //         this.game.right();
            //         break;
            //     case 40: //down
            //         this.game.down();
            //         break;
            //     case 32: //space
            //         this.game.rotate();
            //         break;
            // }
        }

        pointerDown(event:PIXI.interaction.InteractionEvent) {
            for(var i:number=0; i<this.touchPoints.length; ++i) {
                if(this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }

            var pos = event.data.getLocalPosition(this.game);

            var touch:touchElement = new touchElement();
            touch.id = event.data.identifier;
            touch.currentX = pos.x;
            touch.currentY = pos.y;
            touch.originX = pos.x;
            touch.originY = pos.y;
            touch.timeAlive = 0;

            this.touchPoints.push(touch);

            if(this.touchPoints.length == 1) {
                this.hasFocusTouch = true;
                this.game.touchDown(pos);
            }
        }

        pointerMove(event:PIXI.interaction.InteractionEvent) {
            var pos = event.data.getLocalPosition(this.game);
            for(var i:number=0; i<this.touchPoints.length; ++i) {
                if(this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints[i].currentX = pos.x;
                    this.touchPoints[i].currentY = pos.y;
                }
            }

            if(this.hasFocusTouch && this.touchPoints[0].id == event.data.identifier)
                this.game.touchMove(pos);
        }

        pointerUp(event:PIXI.interaction.InteractionEvent) {

            if(this.hasFocusTouch && this.touchPoints[0].id == event.data.identifier) {
                this.hasFocusTouch = false;
                var pos = event.data.getLocalPosition(this.game);
                this.game.touchUp(pos);
            }

            for(var i:number=0; i<this.touchPoints.length; ++i) {
                if(this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }
        }

        resize(w:number, h:number, appWidth:number, appHeight:number) {
            // var bgScale = Math.max(w / 1920, h / 1080);
            // this.backgroundImage.scale.x = bgScale;
            // this.backgroundImage.scale.y = bgScale;
            // var resWidth = bgScale * 1920;
            // var resHeight = bgScale * 1080;
            // this.backgroundImage.x = (w - resWidth) / 2;
            // this.backgroundImage.y = (h - resHeight) / 2;

            this.game.x = (w - appWidth) / 2;
            this.game.y = (h - appHeight) / 2;

            this.componentMask.clear();
            this.componentMask.beginFill(0xffffff);
            this.componentMask.drawRect(this.game.x, this.game.y, appWidth, appHeight);
            this.componentMask.endFill();

            this.renderer.resize(w, h);
            this.setInnerAppSize(appWidth, appHeight);
        }

        update() {
            var dt = this.ticker.elapsedMS * .001;
            dt = Math.min(.1, dt);
            // this.debugText.text = "FPS: 30";
            this.game.update(dt);
        }
    }
}