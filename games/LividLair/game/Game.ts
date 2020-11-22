///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Controller.ts"/>
///<reference path="GameObject.ts"/>
///<reference path="Wizard.ts"/>
///<reference path="Bullet.ts"/>
///<reference path="Rubee.ts"/>

module LividLair {


    export class Game extends PIXI.Container {

        controller: Controller;
        levelContainer: PIXI.Container;
        levelElements: PIXI.Container;
        screenSize: Point;
        rows: number;
        columns: number;

        //game objects:
        wizard: Wizard;
        blocks: GameObject[];
        platforms: GameObject[];
        ladders: GameObject[];
        pushBlocks: GameObject[];
        rubees: GameObject[];
        bullets: Bullet[];

        bricksTexture: PIXI.Texture;

        constructor(w: number, h: number) {
            super();

            this.screenSize = new Point(w, h);

            this.controller = new Controller();

            let background = new PIXI.Graphics();
            background.beginFill(0x0, 0.5);
            background.drawRect(0, 0, w, h);
            this.addChild(background);

            this.bricksTexture = PIXI.Texture.fromImage('assets/bricks.png');

            this.levelContainer = new PIXI.Container();
            this.addChild(this.levelContainer);

            this.levelElements = new PIXI.Container();
            this.levelContainer.addChild(this.levelElements);

            this.wizard = new Wizard();
            this.wizard.x = w / 2;
            this.wizard.y = h / 2;
            this.wizard.clampedPosition = new Point(w / 2, h / 2);
            this.levelContainer.addChild(this.wizard);

            this.wizard.floatTimer = 0;

            this.wizard.velocity = new Point(0, 0);
        }

        setup() {
            this.resetLevel();
        }

        shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                // Generate random number 
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }

        resetLevel() {

            let rooms: string[][] = [];
            if (ROOM_DEBUG)
                rooms.push(PIXI.loader.resources['roomDebug'].data.split("\n"));
            else {
                for (let i: number = 0; i < ROOM_COUNT; ++i)
                    rooms.push(PIXI.loader.resources['room' + i].data.split("\n"));
            }

            let hRoomCount = 3;
            let vRoomCount = 3;
            let roomCount = hRoomCount * vRoomCount;

            let roomDataList: any[] = [];
            for (var i: number = 0; i < roomCount; ++i)
                roomDataList.push({ room: rooms[i % rooms.length], flip_x: Math.random() < .5 });
            this.shuffleArray(roomDataList);

            this.blocks = [];
            this.platforms = [];
            this.ladders = [];
            this.pushBlocks = [];
            this.rubees = [];
            this.bullets = [];
            this.levelElements.removeChildren();

            let roomRows = 8;
            let roomCols = 10;

            this.rows = vRoomCount * roomRows + 4;
            this.columns = hRoomCount * roomCols + 4;

            let playerRow = Math.round(this.rows * .2);
            let playerColumn = Math.round(this.columns / 2);
            this.alignPositionToGrid(this.wizard, playerRow, playerColumn);
            this.wizard.clampedPosition.x = this.wizard.x;
            this.wizard.clampedPosition.y = this.wizard.y;

            for (var i: number = 0; i < this.rows; ++i) {
                for (var j: number = 0; j < this.columns; ++j) {
                    if (i < 2 || i > this.rows - 3 || j < 2 || j > this.columns - 3)
                        this.pushBlock(i, j, true); //BORDER
                    else if (!(playerRow == i && playerColumn == j)) {

                        let room_i = Math.floor((i - 2) / roomRows);
                        let room_j = Math.floor((j - 2) / roomCols);
                        let roomData = roomDataList[room_i * hRoomCount + room_j];

                        let ii = (i - 2) % roomRows;
                        let jj = (j - 2) % roomCols;
                        if (roomData.flip_x)
                            jj = roomCols - jj - 1;
                        let c = roomData.room[ii][jj];
                        if (c == "#")
                            this.pushBlock(i, j, false);
                        else if (c == "|")
                            this.pushLadder(i, j);
                        else if (c == "-")
                            this.pushPlatform(i, j, 0x00aaff);
                        else if (c == "+") {
                            this.pushLadder(i, j);
                            this.pushPlatform(i, j, 0x00aaff);
                        }
                        else if (c == "O") {
                            this.pushPushBlock(i, j, 0xaaaaaa);
                        }
                        else if (c == "?") {
                            this.pushRubee(i, j);
                        }
                    }
                }
            }

            this.fixCamera(false);

        }

        pushPlatform(row: number, col: number, color: number) {
            let hw = GRID_UNIT_SIZE / 2;
            let gr = new GameObject(GRID_UNIT_SIZE, GRID_UNIT_SIZE);
            gr.beginFill(color, 1);
            // gr.lineStyle(2, color, 0.5);
            gr.drawRect(-hw, -hw, GRID_UNIT_SIZE, GRID_UNIT_SIZE * .1);
            // gr.endFill();
            gr.beginFill(color, 0.5);
            gr.moveTo(-hw, -hw);
            gr.bezierCurveTo(-hw, 0, hw, 0, hw, -hw);
            gr.endFill();
            this.alignPositionToGrid(gr, row, col);
            this.levelElements.addChild(gr);
            this.platforms.push(gr);
        }

        pushBlock(row: number, col: number, darken: boolean) {
            let gr = new GameObject(GRID_UNIT_SIZE, GRID_UNIT_SIZE);
            gr.beginFill(0x0, 1);
            gr.drawRect(-GRID_UNIT_SIZE / 2, -GRID_UNIT_SIZE / 2, GRID_UNIT_SIZE, GRID_UNIT_SIZE);
            gr.endFill();
            this.alignPositionToGrid(gr, row, col);
            this.levelElements.addChild(gr);

            // let data = PIXI.loader.resources['bricks'].data;
            let img = new PIXI.Sprite(this.bricksTexture);
            img.width = img.height = GRID_UNIT_SIZE;
            img.x = -GRID_UNIT_SIZE / 2;
            img.y = -GRID_UNIT_SIZE / 2;
            if (darken) {
                img.alpha = 0.75;
            }
            gr.addChild(img);

            this.blocks.push(gr);
        }

        pushPushBlock(row: number, col: number, color: number) {
            let gr = new GameObject(GRID_UNIT_SIZE, GRID_UNIT_SIZE);
            gr.beginFill(color, 1);
            gr.drawRoundedRect(-GRID_UNIT_SIZE / 2, -GRID_UNIT_SIZE / 2, GRID_UNIT_SIZE, GRID_UNIT_SIZE, .2 * GRID_UNIT_SIZE);
            gr.beginFill(0x555555, 1);
            gr.drawRoundedRect(-GRID_UNIT_SIZE * .45, -GRID_UNIT_SIZE * .45, GRID_UNIT_SIZE * .9, GRID_UNIT_SIZE * .9, .15 * GRID_UNIT_SIZE);
            gr.beginFill(color, 1);
            gr.drawRoundedRect(-GRID_UNIT_SIZE * .4, -GRID_UNIT_SIZE * .4, GRID_UNIT_SIZE * .8, GRID_UNIT_SIZE * .8, .1 * GRID_UNIT_SIZE);
            gr.endFill();
            this.alignPositionToGrid(gr, row, col);
            this.levelElements.addChild(gr);
            this.pushBlocks.push(gr);
        }

        pushLadder(row: number, col: number) {

            let color = 0xA0522D;
            let gr = new GameObject(LADDER_WIDTH, GRID_UNIT_SIZE);
            let th = .1 * GRID_UNIT_SIZE;
            let left = -LADDER_WIDTH / 2 + th / 2;
            let right = -left;
            gr.lineStyle(th, color);
            gr.moveTo(left, -GRID_UNIT_SIZE * .5);
            gr.lineTo(left, GRID_UNIT_SIZE * .5);
            gr.moveTo(right, -GRID_UNIT_SIZE * .5);
            gr.lineTo(right, GRID_UNIT_SIZE * .5);

            gr.lineStyle(1.2 * th, color);
            let reps = 4;
            for (var i: number = 0; i < reps; ++i) {
                let y = GRID_UNIT_SIZE * ((i + 0.5) / reps - .5);
                gr.moveTo(left, y);
                gr.lineTo(right, y);
            }
            this.alignPositionToGrid(gr, row, col);
            this.levelElements.addChild(gr);
            this.ladders.push(gr);
        }

        pushRubee(row: number, col: number) {
            let gr = new Rubee();
            this.alignPositionToGrid(gr, row, col);
            this.levelElements.addChild(gr);
            this.rubees.push(gr);
        }

        shoot() {
            if (this.wizard.shootTimer > 0)
                return;

            let gr = new Bullet(this.wizard.clampedPosition.clone());
            gr.velocity.x = this.wizard.faceRight ? 10 : -10;
            gr.velocity.y = -15;
            this.levelElements.addChild(gr);
            this.bullets.push(gr);
            this.wizard.shootTimer = 0.5;
        }

        alignPositionToGrid(p: GameObject, row: number, column: number) {
            p.clampedPosition.x = p.position.x = column * GRID_UNIT_SIZE;
            p.clampedPosition.y = p.position.y = row * GRID_UNIT_SIZE;
        }

        fixCamera(smooth: boolean) {
            let takeFrac = smooth ? .2 : 1.0;
            this.levelContainer.x = (1.0 - takeFrac) * this.levelContainer.x + takeFrac * (-this.wizard.x + this.screenSize.x / 2);
            this.levelContainer.y = (1.0 - takeFrac) * this.levelContainer.y + takeFrac * (-this.wizard.y + this.screenSize.y / 2);

            this.levelContainer.x = Math.min(0, Math.max(this.levelContainer.x, this.screenSize.x - (this.columns - 1) * GRID_UNIT_SIZE));
            this.levelContainer.y = Math.min(0, Math.max(this.levelContainer.y, this.screenSize.y - (this.rows - 1) * GRID_UNIT_SIZE));
        }

        sign(n: number): number {
            if (n < 0)
                return -1;
            else if (n > 0)
                return 1;
            return 0;
        }

        hasElementUnderneath(item: GameObject, list: GameObject[]) {

            let aabb = item.getBoundingBox();
            let objCollDistX = aabb.halfWidth + GRID_UNIT_SIZE / 2;
            let objCollDistY = aabb.halfHeight + GRID_UNIT_SIZE / 2;

            let filtered = list.filter((val) => { return val != item; });
            for (let b of filtered) {
                let dx = item.clampedPosition.x - b.clampedPosition.x;
                let dy = item.clampedPosition.y - b.clampedPosition.y;
                if (Math.abs(dx) >= objCollDistX || Math.abs(dy) > objCollDistY)
                    continue;

                if (Math.abs(dx) <= objCollDistX && dy == -objCollDistY)
                    return true;
            }

            return false;
        }

        getHitObject(pos: Point, list: GameObject[]): GameObject {
            for (let b of list) {
                if (b.getBoundingBox().contains(pos))
                    return b;
            }
            return null;
        }

        getIntersectingObject(aabb: AABB, list: GameObject[]): GameObject {
            for (let b of list) {
                if (b.getBoundingBox().intersects(aabb))
                    return b;
            }
            return null;
        }

        update(dt: number) {

            this.controller.update();

            if (this.controller.justPressed[ControllerButton.BACK])
                this.resetLevel();

            var jump: boolean = this.controller.justPressed[ControllerButton.A];
            var shoot: boolean = this.controller.justPressed[ControllerButton.X];
            let run: boolean = this.controller.pressed[ControllerButton.RT];
            let log: boolean = this.controller.pressed[ControllerButton.LT];


            if (shoot)
                this.shoot();

            let dir = this.controller.getDirection();
            this.wizard.velocity.x = dir.x * (run ? 12.0 : 8.0);
            if (dir.x > 0)
                this.wizard.faceRight = true;
            if (dir.x < 0)
                this.wizard.faceRight = false;

            let vertDir = (Math.abs(dir.y) > .5) ? this.sign(dir.y) : 0;

            let playerCollDistX = PLAYER_WIDTH / 2 + GRID_UNIT_SIZE / 2;
            let playerCollDistY = PLAYER_HEIGHT / 2 + GRID_UNIT_SIZE / 2;

            this.wizard.ignorePlatform = this.wizard.state == PlayerState.Climbing;

            //find obstacles underneath player:
            let hitBlock = this.hasElementUnderneath(this.wizard, this.blocks.concat(this.pushBlocks));
            let hitPlatform = this.hasElementUnderneath(this.wizard, this.platforms);

            //update floating timer that is set after walking off of ledge
            if ((hitBlock || hitPlatform) && run)
                this.wizard.floatTimer = 0.075;
            else if (!run)
                this.wizard.floatTimer = 0;
            else if (this.wizard.floatTimer > 0)
                this.wizard.floatTimer -= dt;
            let floating = this.wizard.floatTimer > 0;
            if (this.wizard.noClimbBuffer > 0)
                this.wizard.noClimbBuffer -= dt;
            if (this.wizard.shootTimer > 0)
                this.wizard.shootTimer -= dt;

            //perform jumps:
            if (jump && this.wizard.velocity.y >= 0) {
                if (hitBlock || (floating && !hitPlatform)) {
                    this.wizard.velocity.y = -15;
                }
                else if (hitPlatform) {
                    if (vertDir > 0)
                        this.wizard.ignorePlatform = true;
                    else
                        this.wizard.velocity.y = -15;
                }
                this.wizard.floatTimer = 0;
                floating = false;
            }

            //apply gravity:
            if (!floating || this.wizard.velocity.y < 0)
                this.wizard.velocity.y = Math.min(30, this.wizard.velocity.y + dt * 40.0);

            //continue climb or cancel it:
            if (this.wizard.state == PlayerState.Climbing) {

                let ladder = this.getHitObject(this.wizard.clampedPosition, this.ladders);

                if (ladder) {

                    let maxSpeed = 10;
                    if (vertDir < 0) {
                        //test of there is a ladder on top
                        let shiftPos = ladder.clampedPosition.clone();
                        shiftPos.y -= GRID_UNIT_SIZE / 2 + 1;
                        let topLadder = this.getHitObject(shiftPos, this.ladders);
                        if (!topLadder) {
                            //there is no ladder on top of this one, so clamp the speed
                            let offset = GRID_UNIT_SIZE / 2 + (this.wizard.clampedPosition.y - ladder.clampedPosition.y); //- PLAYER_HEIGHT / 2);
                            maxSpeed = Math.max(0, Math.min(maxSpeed, offset));
                        }
                    }

                    this.wizard.velocity.y = vertDir * maxSpeed;
                    this.wizard.velocity.x = ladder.clampedPosition.x - this.wizard.x;

                    if (jump) {
                        this.wizard.state = PlayerState.Idle;
                        this.wizard.velocity.y = vertDir <= 0 ? -15 : 0;
                        this.wizard.noClimbBuffer = 0.2;
                    }
                }
                else {
                    this.wizard.state = PlayerState.Idle;
                    this.wizard.velocity.y = 0;
                }
            }
            else if (this.wizard.noClimbBuffer <= 0 && ((vertDir < 0 && (this.wizard.velocity.y > 0 || floating)) || (vertDir > 0 && hitPlatform && !hitBlock))) {
                //try to claim ladder and enter climb state:
                for (let l of this.ladders) {
                    let dx = this.wizard.clampedPosition.x - l.x;
                    let dy = this.wizard.clampedPosition.y - l.y;
                    if (Math.abs(dx) <= LADDER_WIDTH / 2 && Math.abs(dy) <= GRID_UNIT_SIZE / 2) {
                        this.wizard.velocity.x = 0;
                        this.wizard.velocity.y = 0;
                        this.wizard.state = PlayerState.Climbing;
                        break;
                    }
                }
            }

            //resolve ledge-grab
            if (this.wizard.state == PlayerState.Ledge) {
                this.wizard.velocity.x = 0;
                this.wizard.velocity.y = 0;
                if (jump) {
                    this.wizard.state = PlayerState.Idle;
                    this.wizard.velocity.y = vertDir <= 0 ? -15 : 0;
                    this.wizard.noClimbBuffer = 0.2;
                }
            }
            else if (this.wizard.velocity.y > 0) {
                //find ledge to grab

                //TODO: make sure no block is above this one.. 

                //TODO: Also, make sure that resulting player AABB does not overlap anything else

                let solids = this.blocks.concat(this.pushBlocks);
                let p_box = this.wizard.getBoundingBox();
                let fall_y = Math.round(this.wizard.clampedPosition.y + this.wizard.velocity.y);
                for (let s of solids) {
                    let dx = this.wizard.clampedPosition.x - s.clampedPosition.x;
                    let dy = this.wizard.clampedPosition.y - s.clampedPosition.y;
                    let s_box = s.getBoundingBox();
                    if (Math.abs(dx) < s_box.halfWidth + p_box.halfWidth + 1) {

                        let test_x = s_box.center.x + this.sign(dx) * (Math.abs(dx) - p_box.halfWidth);
                        let test_y = s_box.center.y - s_box.halfHeight - 1;
                        if (this.getHitObject(new Point(test_x, test_y), solids))
                            continue;

                        //make sure there is no box above 's':
                        // let top_box = s_box.
                        //     for(let ss of solids) {

                        //     }

                        let goal_y = s.clampedPosition.y - s_box.halfHeight + p_box.halfHeight;
                        if (this.wizard.clampedPosition.y < goal_y && fall_y >= goal_y) {
                            this.wizard.state = PlayerState.Ledge;
                            this.wizard.clampedPosition.y = goal_y;
                            this.wizard.velocity.x = 0;
                            this.wizard.velocity.y = 0;
                            break;
                        }
                    }
                }
            }

            //push blocks:
            let pushMode = (hitBlock || hitPlatform) && this.sign(dir.x) != 0;
            for (let b of this.pushBlocks) {

                let onGround = this.hasElementUnderneath(b, this.blocks.concat(this.pushBlocks).concat(this.platforms));

                let playerContainedDistY = GRID_UNIT_SIZE / 2 - PLAYER_HEIGHT / 2;

                let dx = this.wizard.clampedPosition.x - b.clampedPosition.x;
                let dy = this.wizard.clampedPosition.y - b.clampedPosition.y;
                if (pushMode && onGround && Math.abs(dx) == playerCollDistX && Math.abs(dy) <= playerContainedDistY)
                    b.velocity.x = dx < 0 ? 5 : -5;
                else
                    b.velocity.x = 0;
            }

            //update bullets:
            for (let i: number = 0; i < this.bullets.length; ++i) {
                let b = this.bullets[i];
                b.aliveTime += dt;
                if (b.aliveTime > 1.0) {
                    this.bullets.splice(i, 1);
                    --i;
                    this.levelElements.removeChild(b);
                }
            }

            //update push-block & collectible physics:
            let kinemElems = this.pushBlocks.concat(this.rubees).concat(this.bullets);
            for (let b of kinemElems) {
                b.velocity.y = Math.min(30, b.velocity.y + dt * 40.0);
                this.resolveCollisions(b);
            }

            this.resolveCollisions(this.wizard);

            //get rubees:
            for (let i: number = 0; i < this.rubees.length; ++i) {
                let c = this.rubees[i];
                c.update(dt);
                if (c.getBoundingBox().intersects(this.wizard.getBoundingBox())) {
                    //destroy collectible
                    this.rubees.splice(i, 1);
                    this.levelElements.removeChild(c);
                    --i;
                }
            }

            this.fixCamera(true);
        }

        resolveCollisions(gObj: GameObject) {

            let gAABB = gObj.getBoundingBox();
            let objCollDistX = gAABB.halfWidth + GRID_UNIT_SIZE / 2;
            let objCollDistY = gAABB.halfHeight + GRID_UNIT_SIZE / 2;

            let displacement = gObj.velocity.clone();

            //process x-displacement:
            let allBlockades: GameObject[] = this.blocks.concat(this.pushBlocks).filter((val) => { return val != gObj; });

            for (let b of allBlockades) {

                //y-collision?
                if (Math.abs(gObj.clampedPosition.y - b.clampedPosition.y) < objCollDistY) {

                    //if moving towards block:
                    let toBlockCenterX = b.clampedPosition.x - gObj.clampedPosition.x;
                    if (this.sign(displacement.x) == this.sign(toBlockCenterX)) {
                        let distanceLeft = Math.max(0, Math.abs(toBlockCenterX) - objCollDistX);
                        if (distanceLeft < Math.abs(displacement.x)) {
                            displacement.x = this.sign(displacement.x) * distanceLeft;
                            gObj.velocity.x = 0;
                        }
                    }
                }
            }

            // let locsPerUnit = 50.0;
            let spaceWidth = 1;//GRID_UNIT_SIZE / locsPerUnit;

            // if (Math.abs(displacement.x) > 0 && this.pushBlocks.indexOf(gObj) >= 0) {
            //     console.log(displacement.x);
            // }

            gObj.clampedPosition.x += displacement.x;
            gObj.clampedPosition.x = Math.round(gObj.clampedPosition.x);// / spaceWidth) * spaceWidth;
            gObj.clampedPosition.x = Math.max(1.5 * GRID_UNIT_SIZE + .5 * gAABB.halfWidth, Math.min((this.columns - 2.5) * GRID_UNIT_SIZE - .5 * gAABB.halfWidth, gObj.clampedPosition.x));

            spaceWidth = 1.0;

            //process y-displacement:
            for (let b of allBlockades) {

                //x-collision?
                if (Math.abs(gObj.clampedPosition.x - b.clampedPosition.x) < objCollDistX) {

                    //if moving towards block:
                    let toBlockCenterY = b.clampedPosition.y - gObj.clampedPosition.y;
                    if (this.sign(displacement.y) == this.sign(toBlockCenterY)) {
                        let distanceLeft = Math.max(0, Math.abs(toBlockCenterY) - objCollDistY);
                        if (distanceLeft < Math.abs(displacement.y)) {
                            if (this.sign(displacement.y) > 0)
                                gObj.bounceOffFloor();
                            gObj.velocity.y = 0;
                            displacement.y = this.sign(displacement.y) * distanceLeft;
                        }
                    }
                }
            }

            //process y-displacement (for platforms):
            for (let p of this.platforms) {

                if (gObj.ignorePlatform)
                    break;

                //x-collision?
                if (Math.abs(gObj.clampedPosition.x - p.x) < objCollDistX) {

                    //if moving towards platform:
                    let toPlatformCenterY = p.y - gObj.clampedPosition.y;
                    if (toPlatformCenterY <= 0)
                        continue;

                    if (this.sign(displacement.y) == this.sign(toPlatformCenterY)) {
                        let distanceLeft = Math.abs(toPlatformCenterY) - objCollDistY;
                        if (distanceLeft < 0)
                            continue;
                        if (distanceLeft <= Math.abs(displacement.y)) {
                            displacement.y = this.sign(displacement.y) * distanceLeft;
                            gObj.velocity.y = 0;
                        }
                    }
                }
            }

            //clamp to screen bounds:
            gObj.clampedPosition.y += displacement.y;
            gObj.clampedPosition.y = Math.round(gObj.clampedPosition.y);// / spaceWidth) * spaceWidth;
            gObj.clampedPosition.y = Math.max(1.5 * GRID_UNIT_SIZE + .5 * gAABB.halfHeight, Math.min((this.rows - 2.5) * GRID_UNIT_SIZE - .5 * gAABB.halfHeight, gObj.clampedPosition.y));

            gObj.x = .5 * gObj.x + .5 * gObj.clampedPosition.x;
            gObj.y = .5 * gObj.y + .5 * gObj.clampedPosition.y;

            // gObj.x = gObj.clampedPosition.x;
            // gObj.y = gObj.clampedPosition.y;
        }
    }
}
