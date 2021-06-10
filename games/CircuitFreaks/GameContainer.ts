///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="game/Game.ts"/>


module CircuitFreaks {
    export class touchElement {
        id: number;
        currentX: number;
        currentY: number;
        originX: number;
        originY: number;
        timeAlive: number;
    }

    export class GameContainer extends PIXI.Application {

        //input tracking:
        touchPoints: touchElement[];

        //movement:
        playerPos: PIXI.Point;
        playerAngle: number;
        playerDirection: PIXI.Point;
        angularSpeed: number;

        //debug:
        debugText: PIXI.Text;
        debugGraphics: PIXI.Graphics;

        //game components:
        backgroundTexture: PIXI.Texture;
        backgroundImage: PIXI.Sprite;

        // touchContainerGraphics:PIXI.Graphics;
        componentMask: PIXI.Graphics;
        game: Game;
        componentBoundary: PIXI.Graphics;

        hasFocusTouch: boolean;

        constructor(w: number, h: number) {
            super(w, h, { antialias: true, backgroundColor: 0x000000, transparent: false });

            this.backgroundTexture = PIXI.Texture.fromImage('assets/background.png');
            this.backgroundImage = new PIXI.Sprite(this.backgroundTexture);
            this.stage.addChild(this.backgroundImage);

            this.game = new Game(w, h);
            this.stage.addChild(this.game);
            this.componentMask = new PIXI.Graphics();
            this.componentMask.beginFill(0xFFFFFF);
            this.componentMask.drawRect(0, 0, w, h);
            this.componentMask.endFill();
            this.componentMask.isMask = true;
            this.game.mask = this.componentMask;

            this.hasFocusTouch = false;

            this.componentBoundary = new PIXI.Graphics();
            this.stage.addChild(this.componentBoundary);
        }

        setInnerAppSize(w: number, h: number) {
            this.componentBoundary.clear();
            // var thickness:number[] = [20, 15, 4];
            var thickness: number[] = [10, 8, 2];
            var offset: number[] = [3, 3, 1];
            var colors: number[] = [0xaaaaaa, 0xffffff, 0xbbbbbb];
            for (var i: number = 0; i < 2; ++i) {
                var t = offset[i];
                this.componentBoundary.lineStyle(thickness[i], colors[i]);
                this.componentBoundary.drawRoundedRect(-w / 2 - t, -h / 2 - t, w + 2 * t, h + 2 * t, 20 + t);
            }

            this.game.scale.x = w / 450;//800;
            this.game.scale.y = h / 800;//600;
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

            this.touchPoints = [];

            this.debugText = new PIXI.Text('');
            this.debugText.x = 20;
            this.debugText.y = 10;
            this.game.addChild(this.debugText);

            this.debugGraphics = new PIXI.Graphics();
            this.game.addChild(this.debugGraphics);
        }

        keyDown(key: number) {
            // console.log(key);
            switch (key) {
                case 127:
                    this.game.toggleEditor();
                    break;
                // case 37: //left
                //     this.game.left();
                //     break;
                // case 38: //up
                //     this.game.up();
                //     break;
                // case 39: //right
                //     this.game.right();
                //     break;
                // case 40: //down
                //     this.game.down();
                //     break;
                // case 32: //space
                //     this.game.rotate();
                //     break;
            }
        }

        pointerDown(event: PIXI.interaction.InteractionEvent) {
            for (var i: number = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }

            var pos = event.data.getLocalPosition(this.game);

            var touch: touchElement = new touchElement();
            touch.id = event.data.identifier;
            touch.currentX = pos.x;
            touch.currentY = pos.y;
            touch.originX = pos.x;
            touch.originY = pos.y;
            touch.timeAlive = 0;

            EditorPanel.eraseMode = event.data.button == 2;

            this.touchPoints.push(touch);

            if (this.touchPoints.length == 1) {
                this.hasFocusTouch = true;
                this.game.touchDown(pos);
            }
        }

        pointerMove(event: PIXI.interaction.InteractionEvent) {
            var pos = event.data.getLocalPosition(this.game);
            for (var i: number = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints[i].currentX = pos.x;
                    this.touchPoints[i].currentY = pos.y;
                }
            }

            if (this.hasFocusTouch && this.touchPoints[0].id == event.data.identifier)
                this.game.touchMove(pos);
        }

        pointerUp(event: PIXI.interaction.InteractionEvent) {

            if (this.hasFocusTouch && this.touchPoints[0].id == event.data.identifier) {
                this.hasFocusTouch = false;
                var pos = event.data.getLocalPosition(this.game);
                this.game.touchUp(pos);
            }

            for (var i: number = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {

                    if (this.touchPoints[i].timeAlive < .3) {
                        var dy = event.data.getLocalPosition(this.game).y - this.touchPoints[i].originY;
                        if (dy < -5) {
                            // var double = this.touchPoints.length > 1;
                            // this.player.jump(double);
                        }
                    }

                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }
        }

        resize(w: number, h: number, appWidth: number, appHeight: number) {
            var bgScale = Math.max(w / 1920, h / 1080);
            this.backgroundImage.scale.x = bgScale;
            this.backgroundImage.scale.y = bgScale;
            var resWidth = bgScale * 1920;
            var resHeight = bgScale * 1080;
            this.backgroundImage.x = (w - resWidth) / 2;
            this.backgroundImage.y = (h - resHeight) / 2;

            this.game.x = (w - appWidth) / 2;
            this.game.y = (h - appHeight) / 2;

            this.componentBoundary.x = w / 2;
            this.componentBoundary.y = h / 2;

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
            this.debugText.text = "FPS: 30";// + Math.round(1.0 / dt);

            this.game.update(dt);
        }
    }
}