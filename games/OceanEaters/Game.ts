///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Ocean.ts"/>
///<reference path="Sky.ts"/>
///<reference path="BadBuoy.ts"/>
///<reference path="Player.ts"/>

module OceanEaters
{
    export class Game extends PIXI.Application {

        //input tracking:
        touchData:PIXI.interaction.InteractionData;
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
            this.stage.on("pointermove", this.pointerMove, this);
            this.stage.on("pointerup", this.pointerUp, this);

            this.ocean = new Ocean(this.screen.width, .5 * this.screen.height);
            this.ocean.resetLayout(0, .5 * this.screen.height, this.screen.width, .5 * this.screen.height);
            this.stage.addChild(this.ocean);

            this.sky = new Sky();
            this.sky.resetLayout(0, 0, this.screen.width, .5 * this.screen.height);
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

        pointerDown(event:PIXI.interaction.InteractionEvent) {
            this.touchData = event.data;
            var pt:PIXI.Point = event.data.getLocalPosition(this.stage);
            this.trackMouseDown = true;
            this.trackMouseTime = 0;
            this.trackMousePos = pt;
        }

        pointerMove() {
            //do nothin'
        }

        pointerUp(event:PIXI.interaction.InteractionEvent) {
            var data = event.data;
            if(data.identifier == this.touchData.identifier) {
                this.trackMouseDown = false;
            }
        }

        resize(w:number, h:number) {
            // this.game.scale.setGameSize(w, h);
        }

        updateLayout() {
            // var width = this.screen.width;
            // var height = this.stage.height;
            // this.ocean.resetLayout(0, .5 * height, width, .5 * height);
            // this.sky.resetLayout(0, 0, width, .5 * height);
            // this.player.resetLayout(.5 * width, (1. - 1. / 6.) * height, width, height);
        }

        update() {
            var dt = this.ticker.elapsedMS * .001;
            this.debugText.text = "FPS: " + Math.round(1.0 / dt) + " " + this.screen.width;

            //update player location:
            if(this.trackMouseDown) {
                this.trackMouseTime += dt;
                if(this.trackMousePos.x < .25 * this.screen.width) {
                    //move left:
                    this.playerDirection += dt * 1.;
                }
                else if(this.trackMousePos.x > .75 * this.screen.width) {
                    //move right:
                    this.playerDirection -= dt * 1.;
                }
            }

            this.playerDirection %= 2 * Math.PI;

            var playerDirX:number = Math.cos(this.playerDirection);
            var playerDirY:number = Math.sin(this.playerDirection);

            var speedFactor = 5.0;

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
            var dbX = 800 - dbWidth - dbMargin;// this.screen.width - dbWidth - dbMargin;
            this.debugGraphics.lineStyle(2, 0xffffff, 1);
            this.debugGraphics.drawRect(dbX, dbMargin, dbWidth, dbWidth);
            this.debugGraphics.lineStyle(0);
            this.debugGraphics.beginFill(0x00ff00, 1);
            this.debugGraphics.drawCircle(dbX + dbWidth * this.playerPos.x, dbMargin + dbWidth * (1 - this.playerPos.y), 10);
            this.debugGraphics.drawCircle(dbX + dbWidth * this.playerPos.x + 10 * playerDirX, dbMargin + dbWidth * (1 - this.playerPos.y) + 10 * -playerDirY, 5);
            this.debugGraphics.beginFill(0xff0000, 1);
            for(var i:number=0; i<this.buoys.length; ++i) {
                var pos = this.buoys[i].relativePosition;
                this.debugGraphics.drawCircle(dbX + dbWidth * pos.x, dbMargin + dbWidth * (1 - pos.y), 5);
                //this.game.debug.text("" + this.buoys[i].index, dbX + dbWidth * pos.x, dbMargin + dbWidth * (1 - pos.y));
            }

            this.debugGraphics.endFill();

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
    }
}