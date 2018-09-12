///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Ocean.ts"/>
///<reference path="Sky.ts"/>
///<reference path="BadBuoy.ts"/>
///<reference path="Player.ts"/>

module OceanEaters
{
    export class Game extends PIXI.Application {

        //input tracking:
        trackMouseDown:boolean;
        trackMouseTime:number;
        trackMousePos:PIXI.Point;

        //movement:
        playerPos:PIXI.Point;
        playerDirection:number;

        //debug:
        debugText:PIXI.Text;
        debugGraphics:PIXI.Graphics;

        //game components:
        ocean:Ocean;
        sky:Sky;
        player:Player;
        buoysParent:PIXI.Container;
        buoys:BadBuoy[];
        
        constructor(w:number, h:number) {
            super(w, h, { antialias: true, backgroundColor : 0x1099bb });
        }

        setup() {
            this.ticker.add(this.update, this);
            this.stage.interactive = true;
            this.stage.on("pointerdown", this.pointerDown, this);

            this.ocean = new Ocean(this.stage.width, .5 * this.stage.height);
            this.ocean.resetLayout(0, .5 * this.stage.height, this.stage.width, this.stage.height);
            this.stage.addChild(this.ocean);

            this.sky = new Sky();
            this.sky.resetLayout(0, 0, this.stage.width, this.stage.height);
            this.stage.addChild(this.sky);

            const reps:number = 5;
            this.buoysParent = new PIXI.Container();
            this.stage.addChild(this.buoysParent);
            this.buoys = [];
            for(var x:number=0; x<reps; ++x) {
                for(var y:number=0; y<reps; ++y) {
                    var buoy:BadBuoy = new BadBuoy((x + 0.5) / reps, (y + 0.5) / reps, this.buoys.length);
                    this.buoys.push(buoy);
                    this.buoysParent.addChild(buoy);
                }
            }

            this.player = new Player();
            this.stage.addChild(this.player);
            this.playerPos = new PIXI.Point(0,0);
            this.playerDirection = 0;

            this.trackMouseDown = false;
            this.trackMouseTime = 0;
            this.trackMousePos = new PIXI.Point;

            this.debugText = new PIXI.Text('txt');
            this.debugText.x = 20;
            this.debugText.y = 10;
            this.stage.addChild(this.debugText);

            this.debugGraphics = new PIXI.Graphics();
            this.stage.addChild(this.debugGraphics);
        }

        pointerDown(e) {
            //alert("pointer down ");
        }

        resize(w:number, h:number) {
            // this.game.scale.setGameSize(w, h);
        }

        updateLayout() {
            // var width = this.stage.width;
            // var height = this.stage.height;
            // this.ocean.resetLayout(0, .5 * height, width, .5 * height);
            // this.sky.resetLayout(0, 0, width, .5 * height);
            // this.player.resetLayout(.5 * width, (1. - 1. / 6.) * height, width, height);
        }

        update() {
            var dt = this.ticker.elapsedMS * .001;
            this.debugText.text = "FPS: " + Math.round(1.0 / dt);// + " " + dtMs + " " + dt;
            this.updateInput(dt);

            //update player location:
            if(this.trackMouseDown) {
                if(this.trackMousePos.x < .25 * this.stage.width) {
                    //move left:
                    this.playerDirection += dt * 1.;
                }
                else if(this.trackMousePos.x > .75 * this.stage.width) {
                    //move right:
                    this.playerDirection -= dt * 1.;
                }
            }

            // if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
            //     this.playerDirection += dt * 2.;
            // else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
            //     this.playerDirection -= dt * 2.;

            this.playerDirection += dt * 0.25;
            this.playerDirection %= 2 * Math.PI;


            var playerDirX:number = Math.cos(this.playerDirection);
            var playerDirY:number = Math.sin(this.playerDirection);

            var speedFactor = 1;
            // if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
            //     speedFactor = 2;
            // else if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
            //     speedFactor = -1;

            speedFactor *= 2.0;
            // if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
            //     speedFactor *= 2.0;

            var speed = dt * .05 * speedFactor;
            this.playerPos.x = (this.playerPos.x + speed * playerDirX) % 1.0;
            if(this.playerPos.x < 0.0)
                this.playerPos.x += 1.0;
            this.playerPos.y = (this.playerPos.y + speed * playerDirY) % 1.0;
            if(this.playerPos.y < 0.0)
                this.playerPos.y += 1.0;

            //draw debug graphics:
            const dbMargin:number = 20;
            const dbWidth:number = 200;
            this.debugGraphics.clear();
            var dbX = 800 - dbWidth - dbMargin;// this.stage.width - dbWidth - dbMargin;
            this.debugGraphics.lineStyle(2, 0xffffff, 1);
            this.debugGraphics.drawRect(dbX, dbMargin, dbWidth, dbWidth);
            this.debugGraphics.lineStyle(0);
            this.debugGraphics.beginFill(0x00ff00, 1);
            this.debugGraphics.drawCircle(dbX + dbWidth * this.playerPos.x, dbMargin + dbWidth * (1 - this.playerPos.y), 10);
            this.debugGraphics.drawCircle(dbX + dbWidth * this.playerPos.x + 10 * playerDirX, dbMargin + dbWidth * (1 - this.playerPos.y) + 10 * -playerDirY, 5);
            this.debugGraphics.beginFill(0xff0000, 1);
            for(var i:number=0; i<this.buoys.length; ++i) {
                var pos = this.buoys[i].relativePosition;
                this.debugGraphics.drawCircle(dbX + dbWidth * pos.x, dbMargin + dbWidth * (1 - pos.y), 10);
                //this.game.debug.text("" + this.buoys[i].index, dbX + dbWidth * pos.x, dbMargin + dbWidth * (1 - pos.y));
            }

            this.debugGraphics.endFill();

            // //update state:
            // if(this.currentStateTimer > 0) {
            //     this.currentStateTimer -= dt;
            // }
            // else {
            //     this.currentState = "";
            // }

            // this.graphics.clear();
            // this.graphics.beginFill(0xff0000, 1);
            // this.graphics.drawRect(0, 0, this.game.width, this.game.height);

            // var debugText:string = "" + dt;
            // this.game.debug.text(debugText, 5, 15, "#ffffff");
            // this.game.debug.text("STATE: " + this.currentState, 5, 30, "#ffffff");
            // this.game.debug.text("MOVE VELOCITY: " + this.moveVelocity, 5, 45, "#ffffff");
            // this.game.debug.text("ACTION: " + this.fooString, 5, 60, "#ffffff");

            // this.game.debug.text("LOC_X: " + this.playerPos.x, 500, 15);
            // this.game.debug.text("LOC_Y: " + this.playerPos.y, 500, 30);

            this.ocean.updateFrame(dt, this.playerPos, this.playerDirection);
            this.sky.updateFrame(dt, this.playerPos, this.playerDirection);
            this.player.updateFrame(dt, this.playerPos, this.playerDirection);

            for(var i:number=0; i<this.buoys.length; ++i) {

                var oceanUv = this.getRelativeOceanPosition(this.buoys[i].relativePosition);

                var transUv = new PIXI.Point(oceanUv.x, oceanUv.y);
                
                const plane_scale = 0.05;

                //transUv.y /= 1.5; //in shader: xy.y *= 1.5
                transUv.x = transUv.x / plane_scale;
                transUv.y = transUv.y / plane_scale;
                //transUv.multiply(1.0 / plane_scale, 1.0 / plane_scale);
                transUv.y = transUv.y / (transUv.y + 1); //deform Y
                transUv.x =  (1 - transUv.y) * transUv.x; //deform X
                var deformScaleX = (1 - transUv.y);
                transUv.y /= 1.5; //in shader: xy.y *= 1.5

                transUv.x *= 800;//this.ocean.width;
                transUv.y *= 300;//this.ocean.height; //in shader: xy.y *= 1.5
                
                var playerPosX:number = this.player.position.x;
                var playerPosY:number = this.player.position.y;
                var x = playerPosX + transUv.x;//5. * oceanUv.x * this.game.scale.width;
                var y = playerPosY - transUv.y;// * this.game.scale.height;
                var scale = deformScaleX;//Math.max(0, 1 - 10 * oceanUv.y);
                var alpha = 1;//Math.min(1, 1 - 10. * oceanUv.y);
                if(oceanUv.y < 0)
                    alpha = 1 + oceanUv.y / .05;

                this.buoys[i].updateRender(x, y, scale, alpha);
                this.buoys[i].updateFrame(dt);


                // this.game.debug.text("" + this.buoys[i].index, x, y);
            }

            function sortBuoys(a:BadBuoy, b:BadBuoy):number {
                return a.position.y - b.position.y;
            }

            var sorted = this.buoys.sort(sortBuoys);
            for(var i:number=0; i<sorted.length; ++i) {
                this.buoysParent.setChildIndex(sorted[i], i);
                // sorted[i].graphics.z = i;
            }
        }

        getRelativeOceanPosition(p:PIXI.Point) : PIXI.Point {
            var toPosX = p.x - this.playerPos.x;
            var toPosY = p.y - this.playerPos.y;

            var playerDirX = Math.cos(this.playerDirection);
            var playerDirY = Math.sin(this.playerDirection);

            var closestDistance = 100;
            var v = 0;
            var u = 0;

            for(var i:number=0; i<3; ++i) {
                for(var j:number=0; j<3; ++j) {
                    var x = toPosX + i - 1;
                    var y = toPosY + j - 1;

                    var curr_v = playerDirX * x + playerDirY * y;
                    var curr_u = playerDirY * x - playerDirX * y;

                    if(curr_v > -.05) {
                        var distance = Math.sqrt(curr_u * curr_u + curr_v * curr_v);
                        if(distance < closestDistance) {
                            closestDistance = distance;
                            v = curr_v;
                            u = curr_u;
                        }
                    }
                }
            }

            return new PIXI.Point(u, v);
        }

        updateInput(dt:number) {

            // // this.input.activePointer.isDown

            // var mouseDown:boolean = this.input.activePointer.isDown;
            // var mousePos:Phaser.Point = this.input.activePointer.position;

            // if(mouseDown) {
            //     if(this.trackMouseDown) {
            //         this.trackMouseTime += dt;
            //     }
            //     else {
            //         //start tracking:
            //         this.trackMouseDown = true;
            //         this.trackMouseTime = 0;
            //         this.trackMousePos.x = mousePos.x;
            //         this.trackMousePos.y = mousePos.y;
            //     }
            // }
            // else {
            //     if(this.trackMouseDown) {
            //         //mouse had been released...
            //         var dy:number = mousePos.y - this.trackMousePos.y;
            //         if(this.trackMouseTime < .5) {
            //             if(dy > 3)
            //                 this.duck();
            //             else if(dy < -3)
            //                 this.jump();
            //         }

            //         this.fooString = "Timez: " + this.trackMouseTime + ", Dy: " + dy;
            //     }

            //     //end tracking:
            //     this.trackMouseDown = false;
            //     this.trackMouseTime = 0;
            //     this.trackMousePos.x = 0;
            //     this.trackMousePos.y = 0;
            // }

            // var dx:number = 0;
            // if(mouseDown) {
            //     dx = 2 * (mousePos.x / this.game.width - .5) * Math.pow(Math.min(1.0, this.trackMouseTime / .5), 2.0);
            // }
            // this.move(dx);
        }

        duck() {
            // //update state:
            // if(this.currentStateTimer <= 0) {
            //     this.currentState = "DUCK";
            //     this.currentStateTimer = 1.0;
            // }
        }

        jump() {
            // //update state:
            // if(this.currentStateTimer <= 0) {
            //     this.currentState = "JUMP";
            //     this.currentStateTimer = 1.0;
            // }
        }

        move(dir:number) {
            // this.moveVelocity = dir;
        }

        tap() {

        }

        // render() {

        // }
    }
}