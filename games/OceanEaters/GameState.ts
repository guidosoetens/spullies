///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Bullet.ts"/>
///<reference path="CornerPiece.ts"/>

module OceanEaters
{
    export class GameState extends Phaser.State {

        // spaceKey:Phaser.Key;
        // bullet:Bullet;
        // elements:Phaser.Group;

        graphics:Phaser.Graphics;

        //input tracking:
        trackMouseDown:boolean;
        trackMouseTime:number;
        trackMousePos:Phaser.Point;

        moveVelocity:number;

        currentState:string;
        currentStateTimer:number;

        fooString:string;


        constructor() {
            super();
        }
        
        create() {
            this.graphics = this.game.add.graphics(0,0); 

            this.trackMouseDown = false;
            this.trackMouseTime = 0;
            this.trackMousePos = new Phaser.Point(0,0);

            this.currentState = "";
            this.currentStateTimer = -1;
            this.moveVelocity = 0;

            this.fooString = "";
        }


        update() {
            var dt:number = this.game.time.physicsElapsed;
            this.updateInput(dt);

            //update state:
            if(this.currentStateTimer > 0) {
                this.currentStateTimer -= dt;
            }
            else {
                this.currentState = "";
            }

            this.graphics.clear();
            this.graphics.beginFill(0xff0000, 1);
            this.graphics.drawRect(0, 0, this.game.width, this.game.height);

            var debugText:string = "" + dt;
            this.game.debug.text(debugText, 5, 15, "#ffffff");
            this.game.debug.text("STATE: " + this.currentState, 5, 30, "#ffffff");
            this.game.debug.text("MOVE VELOCITY: " + this.moveVelocity, 5, 45, "#ffffff");
            this.game.debug.text("ACTION: " + this.fooString, 5, 60, "#ffffff");

        }

        updateInput(dt:number) {

            // this.input.activePointer.isDown

            var mouseDown:boolean = this.input.activePointer.isDown;
            var mousePos:Phaser.Point = this.input.activePointer.position;

            if(mouseDown) {
                if(this.trackMouseDown) {
                    this.trackMouseTime += dt;
                }
                else {
                    //start tracking:
                    this.trackMouseDown = true;
                    this.trackMouseTime = 0;
                    this.trackMousePos.x = mousePos.x;
                    this.trackMousePos.y = mousePos.y;
                }
            }
            else {
                if(this.trackMouseDown) {
                    //mouse had been released...
                    var dy:number = mousePos.y - this.trackMousePos.y;
                    if(this.trackMouseTime < .5) {
                        if(dy > 3)
                            this.duck();
                        else if(dy < -3)
                            this.jump();
                    }

                    this.fooString = "Timez: " + this.trackMouseTime + ", Dy: " + dy;
                }

                //end tracking:
                this.trackMouseDown = false;
                this.trackMouseTime = 0;
                this.trackMousePos.x = 0;
                this.trackMousePos.y = 0;
            }

            var dx:number = 0;
            if(mouseDown) {
                dx = 2 * (mousePos.x / this.game.width - .5) * Math.pow(Math.min(1.0, this.trackMouseTime / .5), 2.0);
            }
            this.move(dx);
        }

        duck() {
            //update state:
            if(this.currentStateTimer <= 0) {
                this.currentState = "DUCK";
                this.currentStateTimer = 1.0;
            }
        }

        jump() {
            //update state:
            if(this.currentStateTimer <= 0) {
                this.currentState = "JUMP";
                this.currentStateTimer = 1.0;
            }
        }

        move(dir:number) {
            this.moveVelocity = dir;
        }

        tap() {

        }

        render() {

        }
    }

}