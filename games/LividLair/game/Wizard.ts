///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="GameObject.ts"/>

module LividLair {

    export enum PlayerState {
        Idle,
        Walk,
        Jump,
        Ledge,
        Climbing
    };

    export class Wizard extends GameObject {

        state: PlayerState;
        faceRight: boolean;
        floatTimer: number;
        noClimbBuffer: number;
        shootTimer: number;

        shootCallback: Callback;

        jumpBuffer: number;
        grabObject: GameObject;
        justGrabbed: boolean;
        goalGrabLoc: AABB;

        wand: PIXI.Graphics;
        shootAnimParam: number;
        meleeVisual: PIXI.Graphics;

        constructor() {
            super(PLAYER_WIDTH, PLAYER_HEIGHT);

            // this.clear();
            // this.beginFill(0x00aaff, 1);
            // this.drawRoundedRect(-PLAYER_WIDTH / 2, -PLAYER_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT, .2 * GRID_UNIT_SIZE);
            // this.beginFill(0xff0000, 1);
            // this.drawCircle(0, 0, .05 * GRID_UNIT_SIZE);
            // this.endFill();

            this.state = PlayerState.Idle;
            this.faceRight = true;
            this.floatTimer = 0;
            this.noClimbBuffer = 0;
            this.shootTimer = 0;
            this.bounceVelocityFrac = 0;
            this.grabObject = null;
            this.justGrabbed = false;
            this.shootAnimParam = 1;

            this.wand = new PIXI.Graphics();
            this.wand.beginFill(0xff0000);
            this.wand.lineStyle(2, 0xaa0000);
            this.wand.moveTo(-2, 5);
            this.wand.lineTo(2, 5);
            this.wand.lineTo(4, -45);
            this.wand.arc(0, -55, 10, .3 * Math.PI, .1 * Math.PI, true);
            this.wand.arc(5, -60, 5, .2 * Math.PI, 1.3 * Math.PI, false);
            this.wand.arc(0, -55, 10, 1.6 * Math.PI, .7 * Math.PI, true);
            this.wand.lineTo(-4, -45);
            this.wand.closePath();
            this.wand.beginFill(0x55aaff);
            this.wand.lineStyle(0);
            this.wand.drawCircle(9, -62, 4);
            this.wand.beginFill(0xffffff, .5);
            this.wand.drawCircle(9 + 2, -62 - 2, 2);
            this.addChild(this.wand);

            this.meleeVisual = new PIXI.Graphics();
            this.meleeVisual.beginFill(0xffffff, 0.5);
            this.meleeVisual.moveTo(0, 0);
            this.meleeVisual.bezierCurveTo(40, 10, 80, 10, 50, -20);
            this.meleeVisual.bezierCurveTo(70, 0, 50, 5, 0, 0);
            this.meleeVisual.x = 20;
            this.meleeVisual.y = -25;
            this.meleeVisual.scale.y = -1;
            this.addChild(this.meleeVisual);

            let gr = new PIXI.Graphics();
            gr.clear();
            gr.beginFill(0x00aaff, 1);
            gr.drawRoundedRect(-PLAYER_WIDTH / 2, -PLAYER_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT, .2 * GRID_UNIT_SIZE);
            gr.beginFill(0xff0000, 1);
            gr.drawCircle(0, 0, .05 * GRID_UNIT_SIZE);
            gr.endFill();
            this.addChild(gr);
        }

        grab(go: GameObject) {
            this.grabObject = go;
            this.grabObject.ignorePlatform = true;
            this.goalGrabLoc = null;
        }

        throw(vertDir: number) {
            if (this.grabObject) {
                this.grabObject.ignorePlatform = false;
                let dir = this.faceRight ? 1 : -1;
                if (vertDir > 0) {
                    this.grabObject.velocity.x = dir * 2;
                    this.grabObject.velocity.y = 0;
                }
                else if (vertDir < 0) {
                    this.grabObject.velocity.x = this.velocity.x + dir * 5;
                    this.grabObject.velocity.y = -15;
                }
                else {
                    this.grabObject.velocity.x = this.velocity.x + dir * 20;
                    this.grabObject.velocity.y = -5;
                }
                this.grabObject = null;
            }
        }

        drop() {
            if (this.grabObject) {
                this.grabObject.ignorePlatform = false;
                this.grabObject.velocity.x = 0;
                this.grabObject.velocity.y = 0;
                this.grabObject = null;
            }
        }

        jump() {
            this.velocity.y = -4;
            this.jumpBuffer = 0;
        }

        maxJump = 6;
        continueJump() {
            if (this.jumpBuffer < this.maxJump && this.velocity.y < 0) {
                ++this.jumpBuffer;
                this.velocity.y = -4 - this.jumpBuffer;
            }
            else {
                this.jumpBuffer = this.maxJump;
            }
        }

        stopJump() {
            this.jumpBuffer = this.maxJump;
        }

        shoot() {
            this.shootAnimParam = 0;
        }

        update(dt: number) {
            super.update(dt);
            let prepShoot = this.shootAnimParam < .5;
            this.shootAnimParam = Math.min(1, this.shootAnimParam + dt / 0.5);
            if (prepShoot && this.shootAnimParam >= .5 && this.shootCallback)
                this.shootCallback.call(this);
            if (this.grabObject) {

                let w_box = this.getBoundingBox();
                let g_box = this.grabObject.getBoundingBox();

                this.grabObject.clampedPosition.x = this.clampedPosition.x;
                this.grabObject.clampedPosition.y = this.clampedPosition.y;
                this.grabObject.velocity.x = 0; //this.velocity.x;
                this.grabObject.velocity.y = 0; //this.velocity.y;
                this.grabObject.velocity.y -= w_box.halfHeight;// + g_box.halfHeight;

                /*

                let w_box = this.getBoundingBox();
                let g_box = this.grabObject.getBoundingBox();
                let goal_x = this.clampedPosition.x;
                let goal_y = this.clampedPosition.y - g_box.halfHeight - w_box.halfHeight;

                let drop = false;
                if (this.goalGrabLoc)
                    drop = !this.goalGrabLoc.contains(this.grabObject.clampedPosition);

                if (drop)
                    this.drop();
                else {
                    this.grabObject.velocity.x = goal_x - this.grabObject.clampedPosition.x;
                    this.grabObject.velocity.y = goal_y - this.grabObject.clampedPosition.y;
                    this.goalGrabLoc = new AABB(new Point(goal_x, goal_y), 30, 30);
                }
                */

                this.wand.visible = false;
            }
            else {
                this.updateWand();
            }
        }

        updateWand() {
            this.wand.visible = true;

            let angle = 0;

            // let t = .5 - .5 * Math.cos(this.shootAnimParam * Math.PI);
            // ang_param = t * 2 * Math.PI;
            // let scaleY = .7 + .3 * Math.cos(this.shootAnimParam * 2 * Math.PI);

            let back_frac = 0.4;
            let whip_frac = 0.3;
            let min_ang = -0.5 * Math.PI;
            let mid_ang = 0.6 * Math.PI; //-1.4 * Math.PI;
            let end_ang = 0;//-2 * Math.PI;
            let scaleY = 1;
            let opacity = 0;

            if (this.shootAnimParam < back_frac) {
                let t = this.shootAnimParam / back_frac;
                angle = Math.sin(t * .5 * Math.PI) * min_ang;
            }
            else if (this.shootAnimParam < back_frac + whip_frac) {
                let t = (this.shootAnimParam - back_frac) / whip_frac;
                t = .5 - .5 * Math.cos(t * Math.PI);
                angle = (1 - t) * min_ang + t * mid_ang;
                scaleY = .3 + .7 * (.5 + .5 * Math.cos(t * 2 * Math.PI));
                opacity = .5 - .5 * Math.cos(t * Math.PI * 2);
            }
            else {
                let t = (this.shootAnimParam - back_frac - whip_frac) / (1 - back_frac - whip_frac);
                t = .5 - .5 * Math.cos(t * Math.PI);
                // let curr_end_ang = end_ang - Math.sin(t * 10) * .5 * Math.PI * (1 - t);
                angle = (1 - t) * mid_ang + t * end_ang;
                // scaleY = .3 + .7 * (.5 + .5 * Math.cos(t * 2 * Math.PI));
            }


            this.wand.rotation = angle * (this.faceRight ? 1 : -1);
            this.wand.scale.y = scaleY;
            this.meleeVisual.alpha = opacity;
            if (this.faceRight) {
                this.wand.x = 30;
                this.wand.scale.x = 1;
                this.meleeVisual.x = 20;
                this.meleeVisual.scale.x = -1;
            }
            else {
                this.wand.x = -30;
                this.wand.scale.x = -1;
                this.meleeVisual.x = -20;
                this.meleeVisual.scale.x = 1;
            }
        }

        bounceOffFloor() {
            super.bounceOffFloor();
            if (this.state == PlayerState.Climbing)
                this.state = PlayerState.Idle;
        }
    }
}