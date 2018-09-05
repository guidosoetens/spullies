///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Bullet.ts"/>
///<reference path="CornerPiece.ts"/>

module OceanEaters
{
    export class GameState extends Phaser.State {

        // spaceKey:Phaser.Key;
        // bullet:Bullet;
        // elements:Phaser.Group;

        constructor() {
            super();
        }
        
        create() {

            // this.elements = this.game.add.group();

            // this.game.physics.startSystem(Phaser.Physics.P2JS);
            // this.game.physics.p2.gravity.y = 500;

            // this.bullet = new Bullet(this.game);
            // this.elements.addChild(this.bullet);

            // var cornerPt = new Phaser.Point(1, 1);
            // for(var i:number=0; i<4; ++i) {
            //     var w = this.game.width / 2;
            //     var h = this.game.height / 2;
            //     var corner = new CornerPiece(
            //         this.game,
            //         new Phaser.Point(w + w * cornerPt.x, h + h * cornerPt.y),
            //         new Phaser.Point(w, h + h * cornerPt.y),
            //         new Phaser.Point(w + w * cornerPt.x, h)
            //     );
            //     this.elements.addChild(corner);
            //     cornerPt = new Phaser.Point(-cornerPt.y, cornerPt.x);
            // }
            
            // this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        }


        update() {
            var dt:number = this.game.time.physicsElapsed;
            var mouseDown:boolean = this.input.mousePointer.isDown;
            var mousePos:Phaser.Point = this.input.mousePointer.position;

            // this.bullet.proceed(dt, this.spaceKey.isDown);
        }

        tap() {

        }

        render() {
            
        }
    }

}