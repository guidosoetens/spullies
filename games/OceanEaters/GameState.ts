///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Ocean.ts"/>
///<reference path="Sky.ts"/>
///<reference path="Player.ts"/>
///<reference path="BadBuoy.ts"/>


module OceanEaters
{
    export class GameState extends Phaser.State {

        graphics:Phaser.Graphics;
        elements:Phaser.Group;

        //input tracking:
        trackMouseDown:boolean;
        trackMouseTime:number;
        trackMousePos:Phaser.Point;

        moveVelocity:number;

        currentState:string;
        currentStateTimer:number;

        fooString:string;

        //game components:
        ocean:Ocean;
        sky:Sky;
        player:Player;
        debugGraphics:Phaser.Graphics;
        buoys:BadBuoy[];


        //movement:
        playerPos:Phaser.Point;
        playerDirection:number;

        constructor() {
            super();
        }

        preload() {
            //shaders:
            this.game.load.shader("oceanShader", 'assets/oceanShader.frag');
            this.game.load.shader("skyShader", 'assets/skyShader.frag');

            //images:
            this.game.load.image('ripples', "assets/ripples.png");
            this.game.load.image('sky', "assets/sky.jpg");
            this.game.load.image('mountains', "assets/mountains.png");
            this.game.load.image('surfer', "assets/turtle.png");
            this.game.load.image('surfboard', "assets/surfboard.png");
       }
        
        create() {

            this.game.input.touch.preventDefault = true;

            this.graphics = this.game.add.graphics(0,0); 
            this.elements = this.game.add.group();

            this.trackMouseDown = false;
            this.trackMouseTime = 0;
            this.trackMousePos = new Phaser.Point(0,0);

            this.currentState = "";
            this.currentStateTimer = -1;
            this.moveVelocity = 0;

            this.fooString = "";

            this.sky = new Sky(this.game);
            this.ocean = new Ocean(this.game);
            this.player = new Player(this.game);
            this.buoys = [];

            const reps:number = 5;
            for(var x:number=0; x<reps; ++x) {
                for(var y:number=0; y<reps; ++y) {
                    var buoy:BadBuoy = new BadBuoy(this.game, (x + 0.5) / reps, (y + 0.5) / reps);
                    buoy.index = this.buoys.length;
                    this.buoys.push(buoy);
                }
            }

            this.playerPos = new Phaser.Point(0,0);
            this.playerDirection = .5 * Math.PI;

            this.debugGraphics = this.game.add.graphics(0,0);

            this.game.scale.onSizeChange.add(this.updateLayout, this);
            this.updateLayout();
        }

        updateLayout() {
            var width = this.game.scale.width;
            var height = this.game.scale.height;
            this.ocean.resetLayout(0, .5 * height, width, .5 * height);
            this.sky.resetLayout(0, 0, width, .5 * height);
            this.player.resetLayout(.5 * width, (1. - 1. / 6.) * height, width, height);
        }

        update() {
            var dt:number = this.game.time.physicsElapsed;
            this.updateInput(dt);

            //update player location:
            if(this.trackMouseDown) {
                if(this.trackMousePos.x < .25 * this.game.scale.width) {
                    //move left:
                    this.playerDirection += dt * 1.;
                }
                else if(this.trackMousePos.x > .75 * this.game.scale.width) {
                    //move right:
                    this.playerDirection -= dt * 1.;
                }
            }

            if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
                this.playerDirection += dt * 2.;
            else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
                this.playerDirection -= dt * 2.;

            this.playerDirection %= 2 * Math.PI;


            var playerDirX:number = Math.cos(this.playerDirection);
            var playerDirY:number = Math.sin(this.playerDirection);

            var speedFactor = 0;
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
                speedFactor = 1;
            else if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
                speedFactor = -1;

            if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
                speedFactor *= 5.0;

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
            var dbX = this.game.scale.width - dbWidth - dbMargin;
            this.debugGraphics.lineStyle(2, 0xffffff, 1);
            this.debugGraphics.drawRect(dbX, dbMargin, dbWidth, dbWidth);
            this.debugGraphics.lineStyle(0);
            this.debugGraphics.beginFill(0x00ff00, 1);
            this.debugGraphics.drawCircle(dbX + dbWidth * this.playerPos.x, dbMargin + dbWidth * (1 - this.playerPos.y), 10);
            this.debugGraphics.drawCircle(dbX + dbWidth * this.playerPos.x + 10 * playerDirX, dbMargin + dbWidth * (1 - this.playerPos.y) + 10 * -playerDirY, 5);
            this.debugGraphics.beginFill(0xff0000, 1);
            for(var i:number=0; i<this.buoys.length; ++i) {
                var pos = this.buoys[i].position;
                this.debugGraphics.drawCircle(dbX + dbWidth * pos.x, dbMargin + dbWidth * (1 - pos.y), 10);
                this.game.debug.text("" + this.buoys[i].index, dbX + dbWidth * pos.x, dbMargin + dbWidth * (1 - pos.y));
            }

            this.debugGraphics.endFill();

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

            this.game.debug.text("LOC_X: " + this.playerPos.x, 500, 15);
            this.game.debug.text("LOC_Y: " + this.playerPos.y, 500, 30);

            this.ocean.updateFrame(dt, this.playerPos, this.playerDirection);
            this.sky.updateFrame(dt, this.playerPos, this.playerDirection);
            this.player.updateFrame(dt, this.playerPos, this.playerDirection);

            for(var i:number=0; i<this.buoys.length; ++i) {

                var oceanUv = this.getRelativeOceanPosition(this.buoys[i].position);

                var transUv = new Phaser.Point(oceanUv.x, oceanUv.y);

                const plane_scale = 0.05;

                //transUv.y /= 1.5; //in shader: xy.y *= 1.5
                transUv = transUv.multiply(1.0 / plane_scale, 1.0 / plane_scale);
                transUv.y = transUv.y / (transUv.y + 1); //deform Y
                transUv.x = (1 - transUv.y) * transUv.x; //deform X
                transUv.y /= 1.5; //in shader: xy.y *= 1.5

                transUv.x *= this.ocean.sprite.width;
                transUv.y *= this.ocean.sprite.height; //in shader: xy.y *= 1.5
                
                // transUv.x *= (1. - oceanUv.y);


                /*
                	float width = uResolution.x / 1500.0;
                    vec2 uv = vTextureCoord * uScreenSize / uResolution;
                    vec2 xy = uv - vec2(.5, .33333);
                    xy.y *= 1.5; //stretch y to make top coordinate xy.y = 1 (compensate for centerpoint = .333)


                    vec2 transUV;
                    transUV.y = -(1. + 1. / (xy.y - 1.0)); //vertical asymptote at uv.y = 1
                    transUV.x = xy.x / (1. - xy.y); //scale from 1 (at uv.y = 0, i.e. div one) to infinity (at uv.y = 1, i.e. div zero)
                    transUV *= 0.5;
                    transUV = rotate2D(transUV, uPlayerAngle);
                    transUV += uPlayerPosition;
                    transUV = vec2(transUV.y, transUV.x);
                    gl_FragColor = mix(texture2D(uTexture, fract(transUV)), vec4(.3, 1, .8, 1), pow(uv.y, 1.5));
                    if(length(xy) < .01)
                        gl_FragColor = vec4(0,0,0,1);
                */











                var playerPosX:number = this.player.group.position.x;
                var playerPosY:number = this.player.group.position.y;
                var x = playerPosX + transUv.x;//5. * oceanUv.x * this.game.scale.width;
                var y = playerPosY - transUv.y;// * this.game.scale.height;
                var scale = 1;//Math.max(0, 1 - 10 * oceanUv.y);
                var alpha = 1;//Math.min(1, 1 - 10. * oceanUv.y);

                this.buoys[i].updateRender(x, y, scale, alpha);
                this.buoys[i].updateFrame(dt);


                this.game.debug.text("" + this.buoys[i].index, x, y);
            }

        }

        getRelativeOceanPosition(p:Phaser.Point) : Phaser.Point {
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

                    if(curr_v > 0) {
                        var distance = Math.sqrt(curr_u * curr_u + curr_v * curr_v);
                        if(distance < closestDistance) {
                            closestDistance = distance;
                            v = curr_v;
                            u = curr_u;
                        }
                    }
                }
            }

            return new Phaser.Point(u, v);
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