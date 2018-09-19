///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Ocean.ts"/>
///<reference path="Sky.ts"/>
///<reference path="BadBuoy.ts"/>
///<reference path="Player.ts"/>
///<reference path="Collectible.ts"/>
///<reference path="ScoreOverlay.ts"/>

module OceanEaters
{
    export class touchElement {
        id:number;
        currentX:number;
        currentY:number;
        originX:number;
        originY:number;
        timeAlive:number;
    }


    export class Game extends PIXI.Application {

        //input tracking:
        touchPoints:touchElement[];

        //movement:
        playerPos:PIXI.Point;
        playerAngle:number;
        playerDirection:PIXI.Point;
        angularSpeed:number;

        //debug:
        debugText:PIXI.Text;
        debugGraphics:PIXI.Graphics;

        //game components:
        scoreOverlay:ScoreOverlay;
        backgroundTexture:PIXI.Texture;
        backgroundImage:PIXI.Sprite;
        // touchContainerGraphics:PIXI.Graphics;
        componentMask:PIXI.Graphics;
        componentContainer:PIXI.Container;
        ocean:Ocean;
        sky:Sky;
        player:Player;
        buoysParent:PIXI.Container;
        buoys:BadBuoy[];
        collectibles:Collectible[];

        constructor(w:number, h:number) {
            super(w, h, { antialias: true, backgroundColor : 0x000000, transparent : false });

            this.backgroundTexture = PIXI.Texture.fromImage('assets/background.png');
            this.backgroundImage = new PIXI.Sprite(this.backgroundTexture);
            this.stage.addChild(this.backgroundImage);

            this.componentContainer = new PIXI.Container();
            this.stage.addChild(this.componentContainer);
            this.componentMask = new PIXI.Graphics();
            this.componentMask.beginFill(0xFFFFFF);
            this.componentMask.drawRoundedRect(0, 0, w, h, 20);
            this.componentMask.endFill();
            this.componentMask.isMask = true;
            this.componentContainer.mask = this.componentMask;
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

            this.ocean = new Ocean();
            this.ocean.resetLayout(0,300,800,300);
            this.componentContainer.addChild(this.ocean);

            this.sky = new Sky();
            this.sky.resetLayout(0, 0, 800, 300);
            this.componentContainer.addChild(this.sky);

            const reps:number = 5;
            this.buoysParent = new PIXI.Container();
            this.componentContainer.addChild(this.buoysParent);
            this.buoys = [];
            for(var x:number=0; x<reps; ++x) {
                for(var y:number=0; y<reps; ++y) {
                    var offsetX = (Math.random() - .5) * .7;
                    var offsetY = (Math.random() - .5) * .7;
                    var buoy:BadBuoy = new BadBuoy((x + 0.5 + offsetX) / reps, (y + 0.5 + offsetY) / reps, this.buoys.length);
                    this.buoys.push(buoy);
                    this.buoysParent.addChild(buoy);
                }
            }

            this.collectibles = [];
            while(this.collectibles.length < 5) {
                var c = new Collectible();
                this.collectibles.push(c);
                this.buoys.push(c);
                this.buoysParent.addChild(c);
            }

            this.player = new Player();
            this.componentContainer.addChild(this.player);
            this.playerPos = new PIXI.Point(0,0);
            this.playerAngle = 0;
            this.playerDirection = new PIXI.Point(1,0);
            this.angularSpeed = 0;

            this.touchPoints = [];

            this.debugText = new PIXI.Text('');
            this.debugText.x = 20;
            this.debugText.y = 10;
            this.componentContainer.addChild(this.debugText);

            this.debugGraphics = new PIXI.Graphics();
            this.componentContainer.addChild(this.debugGraphics);

            this.scoreOverlay = new ScoreOverlay();
            this.componentContainer.addChild(this.scoreOverlay);
        }

        pointerDown(event:PIXI.interaction.InteractionEvent) {
            for(var i:number=0; i<this.touchPoints.length; ++i) {
                if(this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }

            var pos = event.data.getLocalPosition(this.stage);

            var touch:touchElement = new touchElement();
            touch.id = event.data.identifier;
            touch.currentX = pos.x;
            touch.currentY = pos.y;
            touch.originX = pos.x;
            touch.originY = pos.y;
            touch.timeAlive = 0;

            this.touchPoints.push(touch);
        }

        pointerMove(event:PIXI.interaction.InteractionEvent) {
            var pos = event.data.getLocalPosition(this.stage);
            for(var i:number=0; i<this.touchPoints.length; ++i) {
                if(this.touchPoints[i].id == event.data.identifier) {
                    this.touchPoints[i].currentX = pos.x;
                    this.touchPoints[i].currentY = pos.y;
                }
            }
        }

        pointerUp(event:PIXI.interaction.InteractionEvent) {
            for(var i:number=0; i<this.touchPoints.length; ++i) {
                if(this.touchPoints[i].id == event.data.identifier) {

                    if(this.touchPoints[i].timeAlive < .3) {
                        var dy = event.data.getLocalPosition(this.stage).y - this.touchPoints[i].originY;
                        if(dy < -5) {
                            var double = this.touchPoints.length > 1;
                            this.player.jump(double);
                        }
                    }

                    this.touchPoints.splice(i, 1);
                    --i;
                }
            }
        }

        resize(w:number, h:number) {
            var bgScale = Math.max(w / 1920, h / 1080);
            this.backgroundImage.scale.x = bgScale;
            this.backgroundImage.scale.y = bgScale;
            var resWidth = bgScale * 1920;
            var resHeight = bgScale * 1080;
            this.backgroundImage.x = (w - resWidth) / 2;
            this.backgroundImage.y = (h - resHeight) / 2;

            this.componentContainer.x = (w - 800) / 2;
            this.componentContainer.y = (h - 600) / 2;

            this.componentMask.clear();
            this.componentMask.beginFill(0xffffff);
            this.componentMask.drawRoundedRect(this.componentContainer.x, this.componentContainer.y, 800, 600, 20);
            this.componentMask.endFill();

            this.renderer.resize(w, h);
        }

        update() {
            var dt = this.ticker.elapsedMS * .001;
            dt = Math.min(.1, dt);
            // this.debugText.text = "FPS: " + Math.round(1.0 / dt) + " " + this.screen.width;

            //update input:

            var sumDx = 0;
            var centerX = this.screen.width / 2.0;
            for(var i:number=0; i<this.touchPoints.length; ++i) {
                var factor = 0;
                var time = this.touchPoints[i].timeAlive;
                if(time > .05) {
                    factor = Math.min((time - .05) * 2., 1.0);
                }
                var dx = (this.touchPoints[i].currentX - centerX) / centerX;
                dx *= 2.0;
                if(Math.abs(dx) > 1.0)
                    dx = Math.sign(dx);
                sumDx += factor * dx;
                this.touchPoints[i].timeAlive += dt;
                // this.debugText.text += "\n" + this.touchPoints[i].currentY;
            }
            if(this.touchPoints.length > 0)
                sumDx /= this.touchPoints.length;

            var newSpeedFactor = Math.min(1, 10 * dt);
            this.angularSpeed = (1 - newSpeedFactor) * this.angularSpeed + newSpeedFactor * -sumDx;

            this.playerAngle += dt * 1. * this.angularSpeed;
            this.playerAngle %= 2 * Math.PI;
            // this.player.compassAngle = this.playerAngle;
            this.playerDirection.x = Math.cos(this.playerAngle);
            this.playerDirection.y = Math.sin(this.playerAngle); 

            var speedFactor = 2.0;

            var speed = dt * .05 * speedFactor;
            this.playerPos.x = (this.playerPos.x + speed * this.playerDirection.x) % 1.0;
            if(this.playerPos.x < 0.0)
                this.playerPos.x += 1.0;
            this.playerPos.y = (this.playerPos.y + speed * this.playerDirection.y) % 1.0;
            if(this.playerPos.y < 0.0)
                this.playerPos.y += 1.0;

            /*
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
            this.debugGraphics.drawCircle(dbX + dbWidth * this.playerPos.x + 10 * this.playerDirection.x, dbMargin + dbWidth * (1 - this.playerPos.y) + 10 * -this.playerDirection.y, 5);
            this.debugGraphics.beginFill(0xff0000, 1);
            for(var i:number=0; i<this.buoys.length; ++i) {
                var pos = this.buoys[i].relativePosition;
                this.debugGraphics.drawCircle(dbX + dbWidth * pos.x, dbMargin + dbWidth * (1 - pos.y), 5);
                //this.game.debug.text("" + this.buoys[i].index, dbX + dbWidth * pos.x, dbMargin + dbWidth * (1 - pos.y));
            }

            this.debugGraphics.endFill();
            */

            this.ocean.updateFrame(dt, this.playerPos, this.playerAngle);
            this.sky.updateFrame(dt, this.playerPos, this.playerAngle);
            this.player.updateFrame(dt, this.playerPos, this.playerAngle);

            for(var i:number=0; i<this.buoys.length; ++i) {

                var oceanUv = this.getRelativeOceanPosition(this.buoys[i].relativePosition);

                var transUv = new PIXI.Point(oceanUv.x, oceanUv.y);
                
                const plane_scale = 0.025;//0.05;

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
                    alpha = 1 + oceanUv.y / .01;
                else if(oceanUv.y > .5) {
                    alpha = 1 - (oceanUv.y - .5) / .1;
                }

                this.buoys[i].updateRender(x, y, scale, alpha);
                this.buoys[i].updateFrame(dt);
            }

            function sortBuoys(a:BadBuoy, b:BadBuoy):number {
                return a.position.y - b.position.y;
            }

            var sorted = this.buoys.sort(sortBuoys);
            for(var i:number=0; i<sorted.length; ++i) {
                this.buoysParent.setChildIndex(sorted[i], i);
            }

            for(var i:number=0; i<this.collectibles.length; ++i) {
                var collectible = this.collectibles[i];
                var to = new PIXI.Point(collectible.relativePosition.x - this.playerPos.x, collectible.relativePosition.y - this.playerPos.y);
                var distance = Math.sqrt(to.x * to.x + to.y * to.y);
                if(distance < .005) {

                    this.scoreOverlay.pushCollectible(collectible);

                    var angle = Math.random() * 2 * Math.PI;
                    var srcX = collectible.relativePosition.x + Math.cos(angle) * .5;
                    var srcY = collectible.relativePosition.y + Math.sin(angle) * .5;
                    collectible.reset(srcX, srcY);

                    //hide, will be properly reset next frame:
                    collectible.scale.x = 0;
                    collectible.scale.y = 0;
                }
            }

            this.player.compassAngle = this.playerAngle;

            this.scoreOverlay.updateFrame(dt);
        }

        getRelativeOceanPosition(p:PIXI.Point) : PIXI.Point {
            var toPosX = p.x - this.playerPos.x;
            var toPosY = p.y - this.playerPos.y;

            var closestDistance = 100;
            var v = 0;
            var u = 0;

            for(var i:number=0; i<3; ++i) {
                for(var j:number=0; j<3; ++j) {
                    var x = toPosX + i - 1;
                    var y = toPosY + j - 1;

                    var curr_v = this.playerDirection.x * x + this.playerDirection.y * y;
                    var curr_u = this.playerDirection.y * x - this.playerDirection.x * y;

                    if(curr_v > -.01) {
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