///<reference path="../../phaser/phaser.d.ts"/>

module BirdFlip 
{

     export class Player extends Phaser.Group {

        p2Body:p2.Body;

        faceLeft:boolean;
        beakOpen:boolean;

        beakGraphics:Phaser.Graphics;
        mainBody:Phaser.Graphics;

        debugGraphics:Phaser.Graphics;

        constructor(game:Phaser.Game) {
            super(game);

            this.mainBody = this.game.make.graphics();
            this.mainBody.position.x = 200;
            this.mainBody.position.y = this.game.height - 75;
            this.game.physics.p2.enable(this.mainBody);

            var baseWidth = 80;
            var baseHeight = 120;
            var baseOffsetY = 30;

            this.addChild(this.mainBody);
            this.mainBody.beginFill(0x00ff00, .5);
            this.mainBody.drawRect(-baseWidth / 2, -baseOffsetY, baseWidth, baseHeight);
            this.mainBody.beginFill(0xffffff, 1);
            this.mainBody.drawCircle(0,0,5);
            this.mainBody.endFill();

            this.mainBody.body.setRectangle(baseWidth, baseHeight, 0, .5 * baseHeight - baseOffsetY, 0);
            this.mainBody.body.kinematic = true;

            var beakWidth = 30;
            var beakLength = 200;

            this.beakGraphics = this.game.make.graphics();
            this.beakGraphics.position.x = this.mainBody.position.x;
            this.beakGraphics.position.y = this.mainBody.position.y;
            //this.beakGraphics.position = this.mainBody.position;
            this.addChild(this.beakGraphics);

            this.beakGraphics.beginFill(0xff0000, .5);
            this.beakGraphics.drawRect(-beakWidth/2, -beakWidth/2, beakLength, beakWidth);
            this.beakGraphics.beginFill(0xffff00, 1);
            this.beakGraphics.drawCircle(0, 0, 5);
            this.beakGraphics.endFill();
            
            this.game.physics.p2.enable(this.beakGraphics);
            this.beakGraphics.body.setRectangle(beakLength, beakWidth, (beakLength - beakWidth) / 2, 0, 0);
            this.beakGraphics.body.kinematic = true;

            this.faceLeft = false;
            this.beakOpen = false;

            this.debugGraphics = this.game.make.graphics();
            this.addChild(this.debugGraphics);
        }

        goLeft() {
            this.faceLeft = true;
        }

        goRight() {
            this.faceLeft = false;
        }

        setOpen(isOpen:boolean) {
            this.beakOpen = isOpen;
        } 

        updatePlayer(dt:Number) {

            //move:
            this.mainBody.body.setZeroVelocity();
            this.beakGraphics.body.setZeroVelocity();
            if(this.faceLeft) {
                if(this.mainBody.x > 30) {
                    this.beakGraphics.body.moveLeft(200);
                    this.mainBody.body.moveLeft(200);
                }
                else
                    this.faceLeft = false;
            }
            else {
                if(this.mainBody.x < this.game.width - 30) {
                    this.beakGraphics.body.moveRight(200);
                    this.mainBody.body.moveRight(200);
                }
                else
                    this.faceLeft = true;
            }

            //note: convert angle so that 'ang = 0' faces downwards
            var currAngle = this.beakGraphics.body.angle - 90;
            if(currAngle > 180)
                currAngle -= 360;
            if(currAngle < -180)
                currAngle += 360;

            var goalAngle = (this.beakOpen ? 120 : 60);
            if(!this.faceLeft)
                goalAngle = -goalAngle;

            var deltaAngle = goalAngle - currAngle;
            var angVel = deltaAngle * 5;
            if(Math.abs(angVel) > 300)
                angVel = angVel < 0 ? -300 : 300;
            this.beakGraphics.body.rotateRight(angVel);

            this.debugGraphics.clear();
            this.debugGraphics.lineStyle(3, 0xffffff, .5);
            this.debugGraphics.beginFill(0x0, 0);
            this.debugGraphics.drawCircle(this.mainBody.position.x, this.mainBody.position.y, 50);
        }
    }
}