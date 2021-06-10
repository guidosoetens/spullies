///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="game/Game.ts"/>
///<reference path="game/Defs.ts"/>
///<reference path="game/Controller.ts"/>
///<reference path="editor/Editor.ts"/>

module LividLair {
    export class touchElement {
        id: number;
        currentX: number;
        currentY: number;
        originX: number;
        originY: number;
        timeAlive: number;
    }

    export class GameContainer extends PIXI.Application {

        //debug:
        debugText: PIXI.Text;
        debugGraphics: PIXI.Graphics;

        game: Game;
        editor: Editor;

        hasFocusTouch: boolean;
        touchPoints: touchElement[];

        constructor() {
            super(APP_WIDTH, APP_HEIGHT, { antialias: true, backgroundColor: 0x000000, transparent: false });

            this.game = new Game(APP_WIDTH, APP_HEIGHT);
            this.stage.addChild(this.game);

            this.editor = new Editor();
            this.stage.addChild(this.editor);
        }

        setup() {
            this.ticker.add(this.update, this);

            this.debugText = new PIXI.Text('');
            this.debugText.x = 20;
            this.debugText.y = 10;
            this.debugText.style.fill = 0xffffff;
            this.debugText.style.fontSize = 12;
            this.game.addChild(this.debugText);

            this.debugGraphics = new PIXI.Graphics();
            this.game.addChild(this.debugGraphics);
            this.game.setup();

            this.editor.setup();

            this.stage.interactive = true;
            this.stage.on("pointerdown", this.pointerDown, this);
            this.stage.on("pointermove", this.pointerMove, this);
            this.stage.on("pointerupoutside", this.pointerUp, this);
            this.stage.on("pointercancel", this.pointerUp, this);
            this.stage.on("pointerup", this.pointerUp, this);
            this.stage.on("pointerout", this.pointerUp, this);

            this.hasFocusTouch = false;
            this.touchPoints = [];
        }

        keyUp(key: number) {
            if (key == 127)
                this.editor.visible = !this.editor.visible;
            Controller.keyUp(key);
        }


        keyDown(key: number) {
            Controller.keyDown(key);
        }

        update() {
            var dt = this.ticker.elapsedMS * .001;
            this.debugText.text = "FPS: " + Math.round(1.0 / dt);

            dt = 1.0 / 60.0;
            this.game.update(dt);
        }

        pointerDown(event: PIXI.interaction.InteractionEvent) {
            for (var i: number = 0; i < this.touchPoints.length; ++i) {
                if (this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }

            this.editor.rightClick = event.data.button == 2;

            var pos = event.data.getLocalPosition(this.game);

            var touch: touchElement = new touchElement();
            touch.id = event.data.identifier;
            touch.currentX = pos.x;
            touch.currentY = pos.y;
            touch.originX = pos.x;
            touch.originY = pos.y;
            touch.timeAlive = 0;

            this.touchPoints.push(touch);

            if (this.touchPoints.length == 1) {
                this.hasFocusTouch = true;
                this.editor.touchDown(new Point(pos.x, pos.y));
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
                this.editor.touchMove(new Point(pos.x, pos.y));
        }

        pointerUp(event: PIXI.interaction.InteractionEvent) {

            if (this.hasFocusTouch && this.touchPoints[0].id == event.data.identifier) {
                this.hasFocusTouch = false;
                var pos = event.data.getLocalPosition(this.game);
                this.editor.touchUp(new Point(pos.x, pos.y));
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
    }
}