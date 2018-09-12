var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
///<reference path="../../pixi/pixi.js.d.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var Ocean = /** @class */ (function (_super) {
        __extends(Ocean, _super);
        function Ocean(w, h) {
            var _this = _super.call(this) || this;
            // var texture = PIXI.Texture.fromImage('assets/ripples.png');
            // var uniforms:OceanUniforms;
            // uniforms.uPlayerPosition.type = 'v2';
            // uniforms.uPlayerPosition.value.x = 0;
            // uniforms.uPlayerPosition.value.y = 0;
            // // var uniforms = { 
            // //     uTimeParam : { type : 'f', value : 0 },
            // //     uPlayerAngle : { type : 'f', value : 0 },
            // //     uResolution : { type : 'v2', value : { x:0, y:0 } },
            // //     uScreenSize : { type : 'v2', value : { x:0, y:0 } },
            // //     uPlayerPosition : { type : 'v2', value : { x:0, y:0 } },
            // //     uPlayerDirection : { type : 'v2', value : { x:0, y:0 } },
            // //     uTexture : { type : 'sampler2D', value : texture }
            // // };
            // var shader = new PIXI.Filter<OceanUniforms>(null, PIXI.loader.resources.oceanShader.data, uniforms);
            // this.shader = shader;
            // // this.filters = [shader];
            _this.shaderTime = 0;
            _this.beginFill(0xff0000, 1);
            _this.drawRect(0, 0, w, h);
            _this.endFill();
            return _this;
        }
        Ocean.prototype.resetLayout = function (x, y, w, h) {
            w = 800;
            h = 600;
            y = h / 2;
            this.position.x = x;
            this.position.y = y;
            this.width = w;
            this.height = h;
            this.clear();
            this.beginFill(0x44aaff, 1);
            this.drawRect(0, 0, w, h);
            this.endFill();
        };
        Ocean.prototype.updateFrame = function (dt, pPos, pDir) {
            this.shaderTime = (this.shaderTime + dt / 10.0) % 1.0;
            // this.shader.uniforms.uTimeParam.value = this.shaderTime;
            // this.shader.uniforms.uResolution.value = { x:this.width, y:this.height };
            // this.shader.uniforms.uScreenSize.value = { x:this.width, y:this.height };
            // this.shader.uniforms.uPlayerPosition.value = { x:-pPos.y, y:pPos.x };
            // this.shader.uniforms.uPlayerDirection.value = { x:Math.cos(pDir), y:Math.sin(pDir) };
            // this.shader.uniforms.uPlayerAngle.value = pDir;
            // this.shader.update(); 
        };
        return Ocean;
    }(PIXI.Graphics));
    OceanEaters.Ocean = Ocean;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var Sky = /** @class */ (function (_super) {
        __extends(Sky, _super);
        function Sky() {
            var _this = _super.call(this) || this;
            // this.game = game;
            // var group = game.add.group();
            // this.sprite = game.make.sprite(0,0);
            // group.add(this.sprite);
            // var skySprite = game.make.sprite(0,0,'sky');
            // var mountainsSprite = game.make.sprite(0,0,'mountains');
            // //init shader:
            // this.shader = new Phaser.Filter(game, null, game.cache.getShader('skyShader'));
            // this.shader.uniforms.uTimeParam = { type: '1f', value: 0. };
            // this.shader.uniforms.uResolution = { type: '2f', value: { x:0, y:0 } };
            // this.shader.uniforms.uScreenSize = { type: '2f', value: { x:0, y:0 } };
            // this.shader.uniforms.uPlayerPosition = { type: '2f', value: { x:0, y:0 } };
            // this.shader.uniforms.uPlayerDirection = { type: '2f', value: { x:0, y:0 } };
            // this.shader.uniforms.uPlayerAngle = { type: '1f', value: 0. };
            // this.shader.uniforms.uTexture = { type: 'sampler2D', value: skySprite.texture, textureData: { repeat: true } };
            // this.shader.uniforms.uMountainsTexture = { type: 'sampler2D', value: mountainsSprite.texture, textureData: { repeat: true } };
            // // this.sprite.filters = [ this.shader ];
            _this.shaderTime = 0;
            return _this;
        }
        Sky.prototype.resetLayout = function (x, y, w, h) {
            w = 800;
            h = 600;
            y = 0;
            this.position.x = x;
            this.position.y = y;
            this.width = w;
            this.height = .5 * h;
            this.clear();
            this.beginFill(0x0066ff, 1);
            this.drawRect(0, 0, w, .5 * h);
            this.endFill();
        };
        Sky.prototype.updateFrame = function (dt, pPos, pDir) {
            this.shaderTime = (this.shaderTime + dt / 10.0) % 1.0;
            // this.shader.uniforms.uTimeParam.value = this.shaderTime;
            // this.shader.uniforms.uResolution.value = { x:this.sprite.width, y:this.sprite.height };
            // this.shader.uniforms.uScreenSize.value = { x:this.game.scale.width, y:this.game.scale.height };
            // this.shader.uniforms.uPlayerPosition.value = { x:-pPos.y, y:pPos.x };
            // this.shader.uniforms.uPlayerDirection.value = { x:Math.cos(pDir), y:Math.sin(pDir) };
            // this.shader.uniforms.uPlayerAngle.value = pDir;
            // this.shader.update(); 
        };
        return Sky;
    }(PIXI.Graphics));
    OceanEaters.Sky = Sky;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var BadBuoy = /** @class */ (function (_super) {
        __extends(BadBuoy, _super);
        function BadBuoy(x, y, index) {
            var _this = _super.call(this) || this;
            _this.index = index;
            var clr = (x < .2 && y < .2) ? 0xff0000 : 0x00ff00;
            var width = 80;
            var height = 120;
            var rad = Math.min(width, height) * .25;
            _this.beginFill(0x0, .2);
            _this.drawEllipse(0, 0, .6 * width, .1 * width);
            _this.beginFill(clr, 1);
            _this.lineStyle(.1 * width, 0x0, 1);
            _this.drawRoundedRect(-width / 2, -height, width, height, rad);
            _this.drawEllipse(0, 0, 5, 5);
            _this.endFill();
            _this.relativePosition = new PIXI.Point(x, y);
            var style = { font: (height * .4) + "px Arial", fill: "#ffffff", align: "center" };
            // var text = game.make.text(0, -height / 2, "" + this.index, style);
            // text.anchor.set(0.5);
            // this.graphics.addChild(text);
            _this.updateRender(x * 200, y * 200, 1, 1);
            return _this;
        }
        BadBuoy.prototype.updateRender = function (x, y, s, alpha) {
            this.position.x = x;
            this.position.y = y;
            this.alpha = alpha;
            this.scale.x = s;
            this.scale.y = s;
        };
        BadBuoy.prototype.updateFrame = function (dt) {
        };
        return BadBuoy;
    }(PIXI.Graphics));
    OceanEaters.BadBuoy = BadBuoy;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player() {
            var _this = _super.call(this) || this;
            _this.shadow = new PIXI.Graphics();
            _this.addChild(_this.shadow);
            _this.shadow.beginFill(0x000, .2);
            _this.shadow.drawEllipse(0, 0, 70, 50);
            _this.shadow.endFill();
            var tex = PIXI.Texture.fromImage('assets/surfboard.png');
            _this.surfboardSprite = new PIXI.Sprite(tex);
            _this.surfboardSprite.anchor.x = 0.5;
            _this.surfboardSprite.anchor.y = 0.5;
            _this.surfboardSprite.scale.x = .8;
            _this.surfboardSprite.scale.y = .15;
            _this.addChild(_this.surfboardSprite);
            tex = PIXI.Texture.fromImage('assets/turtle.png');
            _this.surferSprite = new PIXI.Sprite(tex);
            _this.surferSprite.anchor.x = .5;
            _this.surferSprite.anchor.y = 1.0;
            _this.surferSprite.scale.x = .25;
            _this.surferSprite.scale.y = .25;
            _this.addChild(_this.surferSprite);
            _this.animIt = 0;
            _this.resetLayout(400, (.5 + .5 * (2 / 3.0)) * 600, 800, 600);
            return _this;
        }
        Player.prototype.resetLayout = function (x, y, w, h) {
            this.position.x = x;
            this.position.y = y;
        };
        Player.prototype.updateFrame = function (dt, pPos, pDir) {
            this.animIt = (this.animIt + dt) % 1.0;
            this.surfboardSprite.position.y = Math.sin(this.animIt * 2 * Math.PI) * 5;
            this.surferSprite.position.y = Math.sin((this.animIt + .05) * 2 * Math.PI) * 5;
            var shadowScale = 1. + .05 * Math.sin(this.animIt * 2 * Math.PI);
            this.shadow.position.y = this.surfboardSprite.position.y + 10;
            this.shadow.scale.x = shadowScale;
            this.shadow.scale.y = shadowScale;
        };
        return Player;
    }(PIXI.Container));
    OceanEaters.Player = Player;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Ocean.ts"/>
///<reference path="Sky.ts"/>
///<reference path="BadBuoy.ts"/>
///<reference path="Player.ts"/>
var OceanEaters;
(function (OceanEaters) {
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(w, h) {
            return _super.call(this, w, h, { antialias: true, backgroundColor: 0x1099bb }) || this;
        }
        Game.prototype.setup = function () {
            this.ticker.add(this.update, this);
            this.stage.interactive = true;
            this.stage.on("pointerdown", this.pointerDown, this);
            this.ocean = new OceanEaters.Ocean(this.stage.width, .5 * this.stage.height);
            this.ocean.resetLayout(0, .5 * this.stage.height, this.stage.width, this.stage.height);
            this.stage.addChild(this.ocean);
            this.sky = new OceanEaters.Sky();
            this.sky.resetLayout(0, 0, this.stage.width, this.stage.height);
            this.stage.addChild(this.sky);
            var reps = 5;
            this.buoysParent = new PIXI.Container();
            this.stage.addChild(this.buoysParent);
            this.buoys = [];
            for (var x = 0; x < reps; ++x) {
                for (var y = 0; y < reps; ++y) {
                    var buoy = new OceanEaters.BadBuoy((x + 0.5) / reps, (y + 0.5) / reps, this.buoys.length);
                    this.buoys.push(buoy);
                    this.buoysParent.addChild(buoy);
                }
            }
            this.player = new OceanEaters.Player();
            this.stage.addChild(this.player);
            this.playerPos = new PIXI.Point(0, 0);
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
        };
        Game.prototype.pointerDown = function (e) {
            //alert("pointer down ");
        };
        Game.prototype.resize = function (w, h) {
            // this.game.scale.setGameSize(w, h);
        };
        Game.prototype.updateLayout = function () {
            // var width = this.stage.width;
            // var height = this.stage.height;
            // this.ocean.resetLayout(0, .5 * height, width, .5 * height);
            // this.sky.resetLayout(0, 0, width, .5 * height);
            // this.player.resetLayout(.5 * width, (1. - 1. / 6.) * height, width, height);
        };
        Game.prototype.update = function () {
            var dt = this.ticker.elapsedMS * .001;
            this.debugText.text = "FPS: " + Math.round(1.0 / dt); // + " " + dtMs + " " + dt;
            this.updateInput(dt);
            //update player location:
            if (this.trackMouseDown) {
                if (this.trackMousePos.x < .25 * this.stage.width) {
                    //move left:
                    this.playerDirection += dt * 1.;
                }
                else if (this.trackMousePos.x > .75 * this.stage.width) {
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
            var playerDirX = Math.cos(this.playerDirection);
            var playerDirY = Math.sin(this.playerDirection);
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
            if (this.playerPos.x < 0.0)
                this.playerPos.x += 1.0;
            this.playerPos.y = (this.playerPos.y + speed * playerDirY) % 1.0;
            if (this.playerPos.y < 0.0)
                this.playerPos.y += 1.0;
            //draw debug graphics:
            var dbMargin = 20;
            var dbWidth = 200;
            this.debugGraphics.clear();
            var dbX = 800 - dbWidth - dbMargin; // this.stage.width - dbWidth - dbMargin;
            this.debugGraphics.lineStyle(2, 0xffffff, 1);
            this.debugGraphics.drawRect(dbX, dbMargin, dbWidth, dbWidth);
            this.debugGraphics.lineStyle(0);
            this.debugGraphics.beginFill(0x00ff00, 1);
            this.debugGraphics.drawCircle(dbX + dbWidth * this.playerPos.x, dbMargin + dbWidth * (1 - this.playerPos.y), 10);
            this.debugGraphics.drawCircle(dbX + dbWidth * this.playerPos.x + 10 * playerDirX, dbMargin + dbWidth * (1 - this.playerPos.y) + 10 * -playerDirY, 5);
            this.debugGraphics.beginFill(0xff0000, 1);
            for (var i = 0; i < this.buoys.length; ++i) {
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
            for (var i = 0; i < this.buoys.length; ++i) {
                var oceanUv = this.getRelativeOceanPosition(this.buoys[i].relativePosition);
                var transUv = new PIXI.Point(oceanUv.x, oceanUv.y);
                var plane_scale = 0.05;
                //transUv.y /= 1.5; //in shader: xy.y *= 1.5
                transUv.x = transUv.x / plane_scale;
                transUv.y = transUv.y / plane_scale;
                //transUv.multiply(1.0 / plane_scale, 1.0 / plane_scale);
                transUv.y = transUv.y / (transUv.y + 1); //deform Y
                transUv.x = (1 - transUv.y) * transUv.x; //deform X
                var deformScaleX = (1 - transUv.y);
                transUv.y /= 1.5; //in shader: xy.y *= 1.5
                transUv.x *= 800; //this.ocean.width;
                transUv.y *= 300; //this.ocean.height; //in shader: xy.y *= 1.5
                var playerPosX = this.player.position.x;
                var playerPosY = this.player.position.y;
                var x = playerPosX + transUv.x; //5. * oceanUv.x * this.game.scale.width;
                var y = playerPosY - transUv.y; // * this.game.scale.height;
                var scale = deformScaleX; //Math.max(0, 1 - 10 * oceanUv.y);
                var alpha = 1; //Math.min(1, 1 - 10. * oceanUv.y);
                if (oceanUv.y < 0)
                    alpha = 1 + oceanUv.y / .05;
                this.buoys[i].updateRender(x, y, scale, alpha);
                this.buoys[i].updateFrame(dt);
                // this.game.debug.text("" + this.buoys[i].index, x, y);
            }
            function sortBuoys(a, b) {
                return a.position.y - b.position.y;
            }
            var sorted = this.buoys.sort(sortBuoys);
            for (var i = 0; i < sorted.length; ++i) {
                this.buoysParent.setChildIndex(sorted[i], i);
                // sorted[i].graphics.z = i;
            }
        };
        Game.prototype.getRelativeOceanPosition = function (p) {
            var toPosX = p.x - this.playerPos.x;
            var toPosY = p.y - this.playerPos.y;
            var playerDirX = Math.cos(this.playerDirection);
            var playerDirY = Math.sin(this.playerDirection);
            var closestDistance = 100;
            var v = 0;
            var u = 0;
            for (var i = 0; i < 3; ++i) {
                for (var j = 0; j < 3; ++j) {
                    var x = toPosX + i - 1;
                    var y = toPosY + j - 1;
                    var curr_v = playerDirX * x + playerDirY * y;
                    var curr_u = playerDirY * x - playerDirX * y;
                    if (curr_v > -.05) {
                        var distance = Math.sqrt(curr_u * curr_u + curr_v * curr_v);
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            v = curr_v;
                            u = curr_u;
                        }
                    }
                }
            }
            return new PIXI.Point(u, v);
        };
        Game.prototype.updateInput = function (dt) {
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
        };
        Game.prototype.duck = function () {
            // //update state:
            // if(this.currentStateTimer <= 0) {
            //     this.currentState = "DUCK";
            //     this.currentStateTimer = 1.0;
            // }
        };
        Game.prototype.jump = function () {
            // //update state:
            // if(this.currentStateTimer <= 0) {
            //     this.currentState = "JUMP";
            //     this.currentStateTimer = 1.0;
            // }
        };
        Game.prototype.move = function (dir) {
            // this.moveVelocity = dir;
        };
        Game.prototype.tap = function () {
        };
        return Game;
    }(PIXI.Application));
    OceanEaters.Game = Game;
})(OceanEaters || (OceanEaters = {}));
///<reference path="../../pixi/pixi.js.d.ts"/>
///<reference path="Game.ts"/>
window.onload = function () {
    var app = new OceanEaters.Game(800, 600);
    var contentDiv = document.getElementById("content");
    contentDiv.appendChild(app.view);
    PIXI.loader.add('oceanShader', 'assets/oceanShader.frag')
        .add('ripples', 'assets/ripples.png');
    PIXI.loader.load(function (loader, resources) {
        app.setup();
    });
};
