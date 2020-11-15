///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Defs.ts"/>

module Magneon
{
    export class Game extends PIXI.Container {

        ball:PIXI.Graphics;
        size:Point;

        constructor(w:number, h:number) {
            super();

            this.size = new Point(w, h);

            this.ball = new PIXI.Graphics();
            this.ball.clear();
            this.ball.beginFill(0x00aaff, 1);
            this.ball.drawCircle(0, 0, BALL_RADIUS);
            this.ball.endFill();
            this.addChild(this.ball);
        }


        update(dt:number) {
            var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            for (var i = 0; i < gamepads.length; i++) {
                var gp = gamepads[i];
                if (gp) {


                    var dir = new Point(gp.axes[0], gp.axes[1]);
                    if(dir.length() < .3)
                        dir = new Point(0,0);

                    this.ball.x += dir.x * 10.0;
                    this.ball.y += dir.y * 10.0;

                    this.ball.x = this.ball.x % this.size.x;
                    if(this.ball.x < 0)
                        this.ball.x += this.size.x;

                    this.ball.y = this.ball.y % this.size.y;
                    if(this.ball.y < 0)
                        this.ball.y += this.size.y;

                    // gp.

                    // gamepadInfo.innerHTML = "Gamepad connected at index " + gp.index + ": " + gp.id +
                    //   ". It has " + gp.buttons.length + " buttons and " + gp.axes.length + " axes.";
                    // gameLoop();
                    // clearInterval(interval);
                }
            }
        }

        touchDown(p:Point) {
            
        }

        touchMove(p:Point) {
            
        }

        touchUp(p:Point) {
            
        }

        left() {

        }

        right() {
            
        }

        up() {
            
        }

        down() {
            
        }

        rotate() {
            
        }
    }
}
