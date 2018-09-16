///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Game.ts"/>


module OceanEaters
{
    export class InputOverlay extends PIXI.Application {

        overlayWidth:number;
        overlayHeight:number;
        gameWidth:number;
        gameHeight:number;

        game:Game;

        
        constructor(w:number, h:number, game:Game) {
            super(w, h, { antialias: true, backgroundColor : 0xff0000 });
            this.game = game;
        }

        setup() {
            this.stage.interactive = true;
            this.stage.on("pointerdown", this.pointerDown, this);
            this.stage.on("pointermove", this.pointerMove, this);
            this.stage.on("pointerupoutside", this.pointerUp, this);
            this.stage.on("pointercancel", this.pointerUp, this);
            this.stage.on("pointerup", this.pointerUp, this);
            this.stage.on("pointerout", this.pointerUp, this);
        }

        setLayout(overlayWidth:number, overlayHeight:number, gameWidth:number, gameHeight:number) {
            this.overlayWidth = overlayWidth;
            this.overlayHeight = overlayHeight;
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
        }

        calcInputElement(event:PIXI.interaction.InteractionEvent) : inputElement {
            var elem = new inputElement();
            var pt:PIXI.Point = event.data.getLocalPosition(this.stage);

            pt.x = this.overlayWidth * pt.x / this.screen.width;
            pt.y = this.overlayHeight * pt.y / this.screen.height;
            pt.x = pt.x - (this.overlayWidth - this.gameWidth) / 2.0;
            pt.y = pt.y - (this.overlayHeight - this.gameHeight) / 2.0;
            pt.x = this.game.screen.width * pt.x / this.gameWidth;
            pt.y = this.game.screen.width * pt.y / this.gameWidth;

            elem.x = pt.x;
            elem.y = pt.y;
            elem.id = event.data.identifier;

            return elem;
        }

        pointerDown(event:PIXI.interaction.InteractionEvent):void {
            this.game.inputDown(this.calcInputElement(event));
        }

        pointerMove(event:PIXI.interaction.InteractionEvent):void {
            this.game.inputMove(this.calcInputElement(event));
        }

        pointerUp(event:PIXI.interaction.InteractionEvent):void {
            this.game.inputUp(this.calcInputElement(event));
        }
    }
}