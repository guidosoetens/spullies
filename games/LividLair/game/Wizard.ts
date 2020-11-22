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

        constructor() {
            super(PLAYER_WIDTH, PLAYER_HEIGHT);

            this.clear();
            this.beginFill(0x00aaff, 1);
            this.drawRoundedRect(-PLAYER_WIDTH / 2, -PLAYER_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT, .2 * GRID_UNIT_SIZE);
            this.beginFill(0xff0000, 1);
            this.drawCircle(0, 0, .05 * GRID_UNIT_SIZE);
            this.endFill();

            this.state = PlayerState.Idle;
            this.faceRight = true;
            this.floatTimer = 0;
            this.noClimbBuffer = 0;
            this.shootTimer = 0;
        }

        update(dt: number) {
            super.update(dt);
        }

        bounceOffFloor() {
            super.bounceOffFloor();
            if (this.state == PlayerState.Climbing)
                this.state = PlayerState.Idle;
        }
    }
}