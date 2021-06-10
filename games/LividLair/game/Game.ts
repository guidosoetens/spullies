///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Controller.ts"/>
///<reference path="GameObject.ts"/>
///<reference path="Wizard.ts"/>
///<reference path="Bullet.ts"/>
///<reference path="Rubee.ts"/>
///<reference path="Chest.ts"/>
///<reference path="Pot.ts"/>
///<reference path="Bomb.ts"/>
///<reference path="Potion.ts"/>
///<reference path="Particle.ts"/>
///<reference path="LevelMap.ts"/>
///<reference path="Platform.ts"/>
///<reference path="LairData.ts"/>
///<reference path="Trampoline.ts"/>
///<reference path="hud/Hud.ts"/>

module LividLair {


    export class Game extends PIXI.Container {

        controller: Controller;
        levelContainer: PIXI.Container;
        backElements: PIXI.Container;
        frontElements: PIXI.Container;
        debugLayer: PIXI.Container;
        screenSize: Point;
        rows: number;
        columns: number;

        //game objects:
        wizard: Wizard;
        blocks: GameObject[];
        brittleBlocks: GameObject[];
        platforms: GameObject[];
        ladders: GameObject[];
        pushBlocks: GameObject[];
        rubees: GameObject[];
        bullets: Bullet[];
        chests: Chest[];
        pots: Pot[];
        bombs: Bomb[];
        potions: Potion[];
        particles: Particle[];
        exits: GameObject[];
        trampolines: Trampoline[];

        bricksTexture: PIXI.Texture;
        cracksTexture: PIXI.Texture;

        map: LevelMap;
        wallUniforms: any;
        hud: Hud;

        constructor(w: number, h: number) {
            super();

            this.screenSize = new Point(w, h);

            this.controller = new Controller();

            // let background = new PIXI.Graphics();
            // background.beginFill(0x0, 0.5);
            // background.drawRect(0, 0, w, h);
            // this.addChild(background);

            this.bricksTexture = PIXI.Texture.fromImage('assets/bricks.png');
            this.cracksTexture = PIXI.Texture.fromImage('assets/cracks.png');

            this.levelContainer = new PIXI.Container();
            // this.levelContainer.addChild(wall);
            this.addChild(this.levelContainer);

            this.backElements = new PIXI.Container();
            this.levelContainer.addChild(this.backElements);

            this.wizard = new Wizard();
            this.wizard.x = w / 2;
            this.wizard.y = h / 2;
            this.wizard.clampedPosition = new Point(w / 2, h / 2);
            this.levelContainer.addChild(this.wizard);

            this.frontElements = new PIXI.Container();
            this.levelContainer.addChild(this.frontElements);

            this.debugLayer = new PIXI.Container();
            this.debugLayer.visible = false;
            this.levelContainer.addChild(this.debugLayer);

            this.wizard.floatTimer = 0;

            this.wizard.velocity = new Point(0, 0);

            this.map = new LevelMap();
            this.map.x = w - 80;
            this.map.y = 80;
            this.addChild(this.map);

            this.hud = new Hud();
            this.addChild(this.hud);
        }

        setup() {
            this.setupWall();
            this.resetLevel();
        }

        setupWall() {
            let tex = PIXI.Texture.fromImage('assets/backWall2.png');
            tex.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

            this.wallUniforms = {
                uTexture: { type: 'sampler2D', value: tex, textureData: { repeat: true } },
                uResolution: { type: 'vec2', value: { x: APP_WIDTH, y: APP_HEIGHT } },
                uTextureSize: { type: 'vec2', value: { x: 200, y: 200 } },
                uCameraPosition: { type: 'vec2', value: { x: 0, y: 0 } },
                uRelativeLightPos: { type: 'vec2', value: { x: 0, y: 0 } }
            };

            var shader = new PIXI.Filter(PIXI.loader.resources.vertexShader.data, PIXI.loader.resources.wallShader.data, this.wallUniforms);
            let wall = new PIXI.Graphics();
            wall.beginFill(0xffffff);
            wall.drawRect(0, 0, APP_WIDTH, APP_HEIGHT);
            wall.filters = [shader];
            this.addChildAt(wall, 0);
        }

        updateWall() {
            let center = this.wallUniforms.uCameraPosition.value;
            center.x = this.levelContainer.x;
            center.y = this.levelContainer.y;

            let light = this.wallUniforms.uRelativeLightPos.value;
            light.x = (this.wizard.x + this.levelContainer.x) / APP_WIDTH;
            light.y = (this.wizard.y + this.levelContainer.y) / APP_HEIGHT;
        }

        resetLevel() {

            this.map.reset();

            let startRooms = [];
            let endRooms = [];
            let treasureRooms = [];
            let regularRooms = [];
            for (let i: number = 0; i < LairData.instance.rooms.length; ++i) {
                let r = LairData.instance.rooms[i];
                if (r.tiles.filter((t) => { return t == TileType.Wizard }).length > 0)
                    startRooms.push(r);
                else if (r.tiles.filter((t) => { return t == TileType.Exit }).length > 0)
                    endRooms.push(r);
                else if (r.tiles.filter((t) => { return t == TileType.Chest }).length > 1)
                    treasureRooms.push(r);
                else
                    regularRooms.push(r);
            }

            startRooms = shuffle(startRooms);
            endRooms = shuffle(endRooms);
            treasureRooms = shuffle(treasureRooms);
            regularRooms = shuffle(regularRooms);

            if (regularRooms.length == 0)
                regularRooms.push(new RoomData(ROOM_TILE_ROWS, ROOM_TILE_COLUMNS));

            let hRoomCount = this.map.data.columns;
            let vRoomCount = this.map.data.rows;

            this.blocks = [];
            this.brittleBlocks = [];
            this.platforms = [];
            this.ladders = [];
            this.pushBlocks = [];
            this.rubees = [];
            this.bullets = [];
            this.chests = [];
            this.pots = [];
            this.bombs = [];
            this.potions = [];
            this.particles = [];
            this.exits = [];
            this.trampolines = [];
            this.backElements.removeChildren();
            this.frontElements.removeChildren();
            this.wizard.grabObject = null;


            let divisionWidth = (GRID_INCLUDE_DIVISION ? 1 : 0);

            this.rows = vRoomCount * (ROOM_TILE_ROWS + divisionWidth) + 2 * OUTER_BORDER_TILE_COUNT - divisionWidth;
            this.columns = hRoomCount * (ROOM_TILE_COLUMNS + divisionWidth) + 2 * OUTER_BORDER_TILE_COUNT - divisionWidth;

            let playerRow = Math.round(this.rows * .2);
            let playerColumn = Math.round(this.columns / 2);

            //create solid boundary:
            for (let side = 0; side < 2; ++side) {
                for (var i: number = 0; i < OUTER_BORDER_TILE_COUNT; ++i) {
                    let row = side == 0 ? i : (this.rows - 1 - i);
                    for (var j: number = 0; j < this.columns; ++j) {
                        this.pushSolidBlock(row, j, true);
                    }
                }
                for (var j: number = 0; j < OUTER_BORDER_TILE_COUNT; ++j) {
                    let col = side == 0 ? j : (this.columns - 1 - j);
                    for (var i: number = OUTER_BORDER_TILE_COUNT; i < this.rows - OUTER_BORDER_TILE_COUNT; ++i) {
                        this.pushSolidBlock(i, col, true);
                    }
                }
            }

            let getRoomFrom = (roomList) => {
                if (roomList.length == 0)
                    roomList = LairData.instance.rooms;//regularRooms;
                return roomList[randomIndex(roomList.length)];
            }

            this.debugLayer.removeChildren();

            //create rooms:
            for (var ri: number = 0; ri < vRoomCount; ++ri) {
                for (var rj: number = 0; rj < hRoomCount; ++rj) {
                    let room_idx = ri * hRoomCount + rj;
                    let room = this.map.data.rooms[room_idx];

                    let roomData: RoomData;
                    if (room.isStart)
                        roomData = getRoomFrom(startRooms);
                    else if (room.isFinish)
                        roomData = getRoomFrom(endRooms);
                    else if (room.isTreasureRoom)
                        roomData = getRoomFrom(treasureRooms);
                    else
                        roomData = regularRooms[room_idx % regularRooms.length];

                    // roomData = LairData.instance.rooms[0];

                    let flipX = Math.random() < .5;
                    if (room.isFinish)
                        flipX = room.connected[RoomDirection.Right];

                    for (var ti: number = 0; ti < ROOM_TILE_ROWS; ++ti) {
                        for (var tj: number = 0; tj < ROOM_TILE_COLUMNS; ++tj) {
                            let tjj = tj;
                            if (flipX)
                                tjj = ROOM_TILE_COLUMNS - tjj - 1;

                            let global_i = OUTER_BORDER_TILE_COUNT + ri * (ROOM_TILE_ROWS + divisionWidth) + ti;
                            let global_j = OUTER_BORDER_TILE_COUNT + rj * (ROOM_TILE_COLUMNS + divisionWidth) + tj; //note! don't flip global index

                            if (ti == 0 && tj == 0) {
                                let gr = new PIXI.Graphics();
                                gr.beginFill(0xffffff, .2);
                                gr.drawRoundedRect((global_j) * GRID_UNIT_SIZE + 5, (global_i) * GRID_UNIT_SIZE + 5, ROOM_TILE_COLUMNS * GRID_UNIT_SIZE - 10, ROOM_TILE_ROWS * GRID_UNIT_SIZE - 10, .3 * GRID_UNIT_SIZE);
                                this.debugLayer.addChild(gr);
                            }

                            let idx = ti * ROOM_TILE_COLUMNS + tjj;
                            let type = roomData.tiles[idx];

                            if (CLOSE_WALLS && (ti == 0 && !room.connected[RoomDirection.Up]
                                || ti == ROOM_TILE_ROWS - 1 && !room.connected[RoomDirection.Down]
                                || tj == 0 && !room.connected[RoomDirection.Left]
                                || tj == ROOM_TILE_COLUMNS - 1 && !room.connected[RoomDirection.Right])) {
                                type = TileType.Block;
                            }

                            switch (type) {
                                case TileType.Block:
                                    this.pushSolidBlock(global_i, global_j, false);
                                    break;
                                case TileType.Ladder:
                                    this.pushLadder(global_i, global_j);
                                    break;
                                case TileType.Platform:
                                    this.pushPlatform(global_i, global_j);
                                    break;
                                case TileType.CrossLadder:
                                    this.pushLadder(global_i, global_j);
                                    this.pushPlatform(global_i, global_j);
                                    break;
                                case TileType.PushBlock:
                                    this.pushPushBlock(global_i, global_j, 0xaaaaaa);
                                    break;
                                case TileType.Rubee:
                                    this.pushRubee(global_i, global_j);
                                    break;
                                case TileType.Chest:
                                    this.pushChest(global_i, global_j);
                                    break;
                                case TileType.Pot:
                                    this.pushPot(global_i, global_j);
                                    break;
                                case TileType.BrittleBlock:
                                    this.pushSolidBlock(global_i, global_j, false, true);
                                    break;
                                case TileType.Exit:
                                    this.pushExit(global_i, global_j);
                                    break;
                                case TileType.Wizard:
                                    playerRow = global_i;
                                    playerColumn = global_j;
                                    break;
                                case TileType.Trampoline:
                                    this.pushTrampoline(global_i, global_j);
                                    break;
                            }
                        }
                    }

                    if (GRID_INCLUDE_DIVISION) {
                        let skipTileH = (idx, mid) => { return Math.abs(idx - mid) < 2; };
                        let skipTileV = (idx, mid) => { return idx == mid || idx == mid - 1; };//idx == mid || idx == mid - 1; };

                        let bottomRow = ri < vRoomCount - 1;
                        if (bottomRow) {
                            let global_i = OUTER_BORDER_TILE_COUNT + (ri + 1) * (ROOM_TILE_ROWS + divisionWidth) - 1;
                            let global_base_j = OUTER_BORDER_TILE_COUNT + rj * (ROOM_TILE_COLUMNS + 1);
                            let center_j = Math.floor(ROOM_TILE_COLUMNS / 2);
                            for (let j = 0; j < ROOM_TILE_COLUMNS; ++j) {
                                let global_j = global_base_j + j;
                                if (skipTileH(j, center_j) && room.connected[RoomDirection.Down])
                                    continue;
                                else
                                    this.pushSolidBlock(global_i, global_j, true);
                            }
                        }

                        let rightColumn = rj < hRoomCount - 1;
                        if (rightColumn) {
                            let global_j = OUTER_BORDER_TILE_COUNT + (rj + 1) * (ROOM_TILE_COLUMNS + divisionWidth) - 1;
                            let global_base_i = OUTER_BORDER_TILE_COUNT + ri * (ROOM_TILE_ROWS + 1);
                            let center_i = Math.floor(ROOM_TILE_ROWS / 2);
                            for (let i = 0; i < ROOM_TILE_ROWS; ++i) {
                                if (skipTileV(i, center_i) && room.connected[RoomDirection.Right])
                                    continue;
                                let global_i = global_base_i + i;
                                this.pushSolidBlock(global_i, global_j, true);
                            }
                        }

                        if (bottomRow && rightColumn) {
                            let global_i = OUTER_BORDER_TILE_COUNT + (ri + 1) * (ROOM_TILE_ROWS + divisionWidth) - 1;
                            let global_j = OUTER_BORDER_TILE_COUNT + (rj + 1) * (ROOM_TILE_COLUMNS + divisionWidth) - 1;
                            this.pushSolidBlock(global_i, global_j, true);
                        }
                    }
                }
            }

            this.alignPositionToGrid(this.wizard, playerRow, playerColumn);
            this.wizard.clampedPosition.x = this.wizard.x;
            this.wizard.clampedPosition.y = this.wizard.y;

            this.fixCamera(false);

        }

        pushPlatform(row: number, col: number) {
            let gr = new Platform();
            this.alignPositionToGrid(gr, row, col);
            this.backElements.addChild(gr);
            this.platforms.push(gr);
        }

        pushExit(row: number, col: number) {
            let gr = new GameObject(GRID_UNIT_SIZE, GRID_UNIT_SIZE);
            gr.beginFill(0xaa0000, 1);
            gr.drawRect(-GRID_UNIT_SIZE * .4, -GRID_UNIT_SIZE / 2, GRID_UNIT_SIZE * .8, GRID_UNIT_SIZE);
            gr.beginFill(0x888888, 1);
            gr.drawRect(-GRID_UNIT_SIZE * .3, -GRID_UNIT_SIZE * .4, GRID_UNIT_SIZE * .6, GRID_UNIT_SIZE * .9);
            gr.endFill();
            this.alignPositionToGrid(gr, row, col);
            this.backElements.addChild(gr);

            this.exits.push(gr);
        }

        pushSolidBlock(row: number, col: number, darken: boolean, brittle: boolean = false) {
            let gr = new GameObject(GRID_UNIT_SIZE, GRID_UNIT_SIZE);
            gr.beginFill(0x0, 1);
            gr.drawRect(-GRID_UNIT_SIZE / 2, -GRID_UNIT_SIZE / 2, GRID_UNIT_SIZE, GRID_UNIT_SIZE);
            gr.endFill();
            this.alignPositionToGrid(gr, row, col);
            this.backElements.addChild(gr);

            // let data = PIXI.loader.resources['bricks'].data;
            let img = new PIXI.Sprite(this.bricksTexture);
            img.width = img.height = GRID_UNIT_SIZE;
            img.x = -GRID_UNIT_SIZE / 2;
            img.y = -GRID_UNIT_SIZE / 2;
            if (darken)
                img.alpha = 0.75;
            else if (brittle)
                img.alpha = 0.9;
            gr.addChild(img);

            if (brittle) {
                img = new PIXI.Sprite(this.cracksTexture);
                img.width = img.height = GRID_UNIT_SIZE;
                img.x = -GRID_UNIT_SIZE / 2;
                img.y = -GRID_UNIT_SIZE / 2;
                img.alpha = 0.65;
                gr.addChild(img);
                this.brittleBlocks.push(gr);
            }
            else
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
            gr.bounceVelocityFrac = 0;
            this.alignPositionToGrid(gr, row, col);
            this.backElements.addChild(gr);
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
            this.backElements.addChild(gr);
            this.ladders.push(gr);
        }

        pushRubee(row: number, col: number) {
            let gr = new Rubee();
            this.alignPositionToGrid(gr, row, col);
            this.backElements.addChild(gr);
            this.rubees.push(gr);
        }

        pushChest(row: number, col: number) {
            let c = new Chest();
            this.alignPositionToGrid(c, row, col);
            this.frontElements.addChild(c);
            this.chests.push(c);
        }

        pushPot(row: number, col: number) {
            let p = new Pot();
            p.destroyCallback = new Callback(this, this.breakPot);
            this.alignPositionToGrid(p, row, col);
            this.frontElements.addChild(p);
            this.pots.push(p);
        }

        pushTrampoline(row: number, col: number) {
            let p = new Trampoline();
            this.alignPositionToGrid(p, row, col);
            this.frontElements.addChild(p);
            this.trampolines.push(p);
        }

        tmpDir: number = 0;
        shoot(vertDir: number) {

            if (this.wizard.grabObject) {
                this.wizard.throw(vertDir);
                return;
            }
            else if (this.wizard.shootTimer > 0 || this.wizard.shootAnimParam < .9)
                return;

            this.tmpDir = vertDir;
            this.wizard.shootCallback = new Callback(this, this.actualShootage);
            this.wizard.shoot();

            // //otherwise shoot bullet:
            // let gr = new Bullet(this.wizard.clampedPosition.clone());
            // gr.velocity.x = this.wizard.velocity.x / 2 + (this.wizard.faceRight ? 1 : -1) * (vertDir == 0 ? 10 : 5);
            // if (vertDir < 0)
            //     gr.velocity.y = -15;
            // else if (vertDir > 0)
            //     gr.velocity.y = 5;
            // else
            //     gr.velocity.y = -5;
            // this.wizard.shoot();
            // this.frontElements.addChild(gr);
            // this.bullets.push(gr);
            // this.wizard.shootTimer = 0.5;
        }

        actualShootage() {
            //otherwise shoot bullet:
            let pos = this.wizard.clampedPosition.clone();
            pos.x += (this.wizard.faceRight ? 1 : -1) * 5;
            pos.y -= 0;
            let gr = new Bullet(pos);
            gr.velocity.x = this.wizard.velocity.x / 2 + (this.wizard.faceRight ? 1 : -1) * (this.tmpDir == 0 ? 10 : 5);
            if (this.tmpDir < 0)
                gr.velocity.y = -15;
            else if (this.tmpDir > 0)
                gr.velocity.y = 5;
            else
                gr.velocity.y = -5;
            // this.wizard.shoot();
            this.frontElements.addChild(gr);
            this.bullets.push(gr);
            this.wizard.shootTimer = 0.5;
        }

        alignPositionToGrid(p: GameObject, row: number, column: number) {
            p.clampedPosition.x = p.position.x = (column + 0.5) * GRID_UNIT_SIZE;
            p.clampedPosition.y = p.position.y = (row + 0.5) * GRID_UNIT_SIZE;
        }

        getAllElements() : GameObject[] {
            return this.blocks.concat(this.platforms).concat(this.ladders).concat(this.pushBlocks).concat(this.rubees);
        }

        fixCamera(smooth: boolean) {
            let takeFrac = smooth ? .05 : 1.0;

            let divisionWidth = (GRID_INCLUDE_DIVISION ? 1 : 0);

            let room_col = Math.floor((this.wizard.x / GRID_UNIT_SIZE - OUTER_BORDER_TILE_COUNT + divisionWidth * 0.5) / (ROOM_TILE_COLUMNS + divisionWidth));
            let room_row = Math.floor((this.wizard.y / GRID_UNIT_SIZE - OUTER_BORDER_TILE_COUNT + divisionWidth * 0.5) / (ROOM_TILE_ROWS + divisionWidth));

            this.map.setWizardRoom(room_row, room_col);

            let tile_col = this.wizard.x / GRID_UNIT_SIZE - room_col * (ROOM_TILE_COLUMNS + divisionWidth) - OUTER_BORDER_TILE_COUNT + .5 * divisionWidth;
            let tile_row = this.wizard.y / GRID_UNIT_SIZE - room_row * (ROOM_TILE_ROWS + divisionWidth) - OUTER_BORDER_TILE_COUNT + .5 * divisionWidth;

            let scroll_dist_x = 1.5;
            let scroll_dist_y = 2.0;

            let dx = 0;
            let dy = 0;
            let room_idx = room_row * this.map.data.columns + room_col;
            let room = this.map.data.rooms[Math.min(this.map.data.rooms.length - 1, room_idx)];
            if (tile_col < scroll_dist_x && room.connected[RoomDirection.Left])
                dx = -.5 * (scroll_dist_x - tile_col) / scroll_dist_x;
            else if (tile_col > ROOM_TILE_COLUMNS + divisionWidth - scroll_dist_x && room.connected[RoomDirection.Right])
                dx = .5 * (tile_col - (ROOM_TILE_COLUMNS + divisionWidth - scroll_dist_x)) / scroll_dist_x;
            if (tile_row < scroll_dist_y && room.connected[RoomDirection.Up])
                dy = -.5 * (scroll_dist_y - tile_row) / scroll_dist_y;
            else if (tile_row > ROOM_TILE_ROWS + divisionWidth - scroll_dist_y && room.connected[RoomDirection.Down])
                dy = .5 * (tile_row - (ROOM_TILE_ROWS + divisionWidth - scroll_dist_y)) / scroll_dist_y;

            let midOffset = Math.abs(tile_col - ROOM_TILE_COLUMNS / 2);
            if (midOffset > 3)
                dy = 0;
            else if (midOffset > 1)
                dy *= 1 - (midOffset - 1) / 2.0

            let goal_x = ((room_col + .5 + dx) * (ROOM_TILE_COLUMNS + divisionWidth) + OUTER_BORDER_TILE_COUNT - .5 * divisionWidth) * GRID_UNIT_SIZE;
            let goal_y = ((room_row + .5 + dy) * (ROOM_TILE_ROWS + divisionWidth) + OUTER_BORDER_TILE_COUNT - .5 * divisionWidth) * GRID_UNIT_SIZE;

            if (!SNAP_CAMERA) {
                goal_x = this.wizard.x;
                goal_y = this.wizard.y;
            }


            this.levelContainer.x = (1.0 - takeFrac) * this.levelContainer.x + takeFrac * (-goal_x + this.screenSize.x / 2);
            this.levelContainer.y = (1.0 - takeFrac) * this.levelContainer.y + takeFrac * (-goal_y + this.screenSize.y / 2);

            this.levelContainer.x = Math.min(0, Math.max(this.levelContainer.x, this.screenSize.x - (this.columns) * GRID_UNIT_SIZE));
            this.levelContainer.y = Math.min(0, Math.max(this.levelContainer.y, this.screenSize.y - (this.rows) * GRID_UNIT_SIZE));

            //getAllObjects
            let obs = this.getAllObjects();
            let cam_box = new AABB(new Point(-this.levelContainer.x + APP_WIDTH / 2, -this.levelContainer.y + APP_HEIGHT / 2), APP_WIDTH, APP_HEIGHT);
            for (let ob of obs)
                ob.visible = ob.getBoundingBox().intersects(cam_box);

<<<<<<< HEAD
            this.updateWall();
=======
            this.levelContainer.x = Math.min(0, Math.max(this.levelContainer.x, this.screenSize.x - (this.columns - 1) * GRID_UNIT_SIZE));
            this.levelContainer.y = Math.min(0, Math.max(this.levelContainer.y, this.screenSize.y - (this.rows - 1) * GRID_UNIT_SIZE));


            //hide everything outside of camera bounds:
            let center = new Point(this.levelContainer.x, this.levelContainer.y).multiply(-1).add(this.screenSize.clone().multiply(0.5));
            let cam_box = new AABB(center, this.screenSize.x, this.screenSize.y);
            for(let e of this.getAllElements()) {
                let aabb = e.getBoundingBox();
                e.visible = aabb.intersects(cam_box);
            }
>>>>>>> 8776af54b879c65c4a6b86968a704a2f8ebaef2e
        }

        sign(n: number): number {
            if (n < 0)
                return -1;
            else if (n > 0)
                return 1;
            return 0;
        }

        getElementUnderneath(item: GameObject, list: GameObject[]): GameObject {

            let aabb = item.getBoundingBox();

            let filtered = list.filter((val) => { return val != item; });
            let closestDx = 0;
            let result: GameObject = null;
            for (let b of filtered) {

                let b_box = b.getBoundingBox();
                let objCollDistX = aabb.halfWidth + b_box.halfWidth;
                let objCollDistY = aabb.halfHeight + b_box.halfHeight;

                let dx = item.clampedPosition.x - b.clampedPosition.x;
                let dy = item.clampedPosition.y - b.clampedPosition.y;
                if (Math.abs(dx) >= objCollDistX || Math.abs(dy) > objCollDistY)
                    continue;

                let distX = Math.abs(dx);
                if (distX <= objCollDistX && dy == -objCollDistY) {
                    if (!result || (distX < closestDx)) {
                        closestDx = distX;
                        result = b;
                    }
                }
            }

            return result;
        }

        hasElementUnderneath(item: GameObject, list: GameObject[]): boolean {
            return this.getElementUnderneath(item, list) != null;
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

        readyInventoryItem(obj: GameObject, list: GameObject[]) {
            if (!this.wizard.grabObject) {
                obj.clampedPosition.x = this.wizard.clampedPosition.x;
                obj.clampedPosition.y = this.wizard.clampedPosition.y;
                obj.x = this.wizard.x;
                obj.y = this.wizard.y;
                list.push(obj);
                this.frontElements.addChild(obj);
                this.wizard.grabObject = obj;
            }
        }

        getSolidObjects(): GameObject[] {
            return this.blocks.concat(this.brittleBlocks).concat(this.pushBlocks);
        }

        getPlatformObjects(): GameObject[] {
            return this.platforms.concat(this.chests).concat(this.trampolines);
        }

        getFloorObjects(): GameObject[] {
            return this.getSolidObjects().concat(this.getPlatformObjects());
        }

        getAllObjects(): GameObject[] {
            return this.getSolidObjects().concat(this.getPlatformObjects()).concat(this.getKinematicObjects());
        }

        getGrabbableObjects(): GameObject[] {
            return this.chests.concat(this.pots).concat(this.bombs).concat(this.potions);
        }

        getLightInteractiveKinematicObjects(): GameObject[] {
            return this.rubees.concat(this.chests).concat(this.pots).concat(this.bombs).concat(this.potions);
        }

        getLightKinematicObjects(): GameObject[] {
            return this.getLightInteractiveKinematicObjects().concat(this.bullets).concat(this.particles);
        }

        getKinematicObjects(): GameObject[] {
            return this.pushBlocks.concat(this.getLightKinematicObjects()).concat(this.trampolines);
        }

        getShatterableObjects(): GameObject[] {
            return this.pots.concat(this.potions);
        }

        update(dt: number) {

            this.controller.update();

            if (this.controller.justPressed[ControllerButton.BACK])
                this.resetLevel();

            for (let e of this.exits) {
                if (this.wizard.getBoundingBox().intersects(e.getBoundingBox())) {
                    this.resetLevel();
                    break;
                }
            }

            var jump: boolean = this.controller.justPressed[ControllerButton.A];
            var shoot: boolean = this.controller.justPressed[ControllerButton.X];
            let run: boolean = this.controller.pressed[ControllerButton.RT];
            let log: boolean = this.controller.pressed[ControllerButton.LT];

            if (this.controller.justPressed[ControllerButton.B]) {
                let b = new Bomb();
                b.destroyCallback = new Callback(this, this.explodeBomb);
                this.readyInventoryItem(b, this.bombs);
            }
            else if (this.controller.justPressed[ControllerButton.Y]) {
                let p = new Potion();
                p.destroyCallback = new Callback(this, this.breakPotion);
                this.readyInventoryItem(p, this.potions);
            }

            let dir = this.controller.getDirection();
            this.wizard.velocity.x = dir.x * (run ? 10.0 : 6.0);
            if (dir.x > 0)
                this.wizard.faceRight = true;
            if (dir.x < 0)
                this.wizard.faceRight = false;

            let vertDir = (Math.abs(dir.y) > .5) ? this.sign(dir.y) : 0;

            let playerCollDistX = PLAYER_WIDTH / 2 + GRID_UNIT_SIZE / 2;
            let playerCollDistY = PLAYER_HEIGHT / 2 + GRID_UNIT_SIZE / 2;

            this.wizard.ignorePlatform = this.wizard.state == PlayerState.Climbing;

            //find obstacles underneath player:
            let hitBlock = this.hasElementUnderneath(this.wizard, this.getSolidObjects());
            let hitPlatform = this.hasElementUnderneath(this.wizard, this.getPlatformObjects());

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

            if (shoot) {
                if (vertDir > 0 && (hitPlatform || hitBlock) && this.wizard.grabObject == null) {
                    //pick up mode
                    let t = this.getIntersectingObject(this.wizard.getBoundingBox(), this.getGrabbableObjects());
                    if (!t)
                        t = this.getElementUnderneath(this.wizard, this.chests);
                    if (t)
                        this.wizard.grab(t);
                }
                else {
                    this.shoot(vertDir);
                }
            }


            //perform jumps:
            if (jump && this.wizard.velocity.y >= 0) {
                if (hitBlock || (floating && !hitPlatform)) {
                    this.wizard.jump();
                }
                else if (hitPlatform) {
                    if (vertDir > 0)
                        this.wizard.ignorePlatform = true;
                    else
                        this.wizard.jump();
                }
                this.wizard.floatTimer = 0;
                floating = false;
            }

            //continue jump:
            let ignoreGravity = false;
            if (this.controller.pressed[ControllerButton.A]) {
                this.wizard.continueJump();
                ignoreGravity = this.wizard.jumpBuffer < this.wizard.maxJump;
            }
            else {
                this.wizard.stopJump();
            }

            //apply gravity:
            if ((!floating || this.wizard.velocity.y < 0) && !ignoreGravity)
                this.wizard.velocity.y = Math.min(30, this.wizard.velocity.y + dt * 40.0);

            //continue climb or cancel it:
            if (this.wizard.state == PlayerState.Climbing) {

                let ladder = this.getHitObject(this.wizard.clampedPosition, this.ladders);

                if (ladder) {

                    let maxSpeed = 5;
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
                        if (vertDir <= 0)
                            this.wizard.jump();
                        else
                            this.wizard.velocity.y = 0;
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

            //update trampolines:
            for (let t of this.trampolines)
                t.update(dt);
            let trampoline = this.getElementUnderneath(this.wizard, this.trampolines.filter((t) => { return t.wobbleParam > .05; })) as Trampoline;
            if (trampoline) {
                this.wizard.velocity.y = this.controller.pressed[ControllerButton.A] ? -18 : -10;
                trampoline.wobble();
            }

            //resolve ledge-grab
            if (this.wizard.state == PlayerState.Ledge) {
                this.wizard.velocity.x = 0;
                this.wizard.velocity.y = 0;
                if (jump) {
                    this.wizard.state = PlayerState.Idle;
                    if (vertDir <= 0)
                        this.wizard.jump();
                    else
                        this.wizard.velocity.y = 0;
                    this.wizard.noClimbBuffer = 0.2;
                }
            }
            else if (this.wizard.velocity.y > 0) {
                //find ledge to grab

                //TODO: make sure no block is above this one.. 

                //TODO: Also, make sure that resulting player AABB does not overlap anything else

                let solids = this.getSolidObjects();
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

                let onGround = this.hasElementUnderneath(b, this.getFloorObjects());

                let playerContainedDistY = GRID_UNIT_SIZE / 2 - PLAYER_HEIGHT / 2;

                let dx = this.wizard.clampedPosition.x - b.clampedPosition.x;
                let dy = this.wizard.clampedPosition.y - b.clampedPosition.y;
                if (pushMode && onGround && Math.abs(dx) == playerCollDistX && Math.abs(dy) <= playerContainedDistY)
                    b.velocity.x = dx < 0 ? 4 : -4;
                else
                    b.velocity.x = 0;
            }

            //update bullets:
            for (let i: number = 0; i < this.bullets.length; ++i) {
                let b = this.bullets[i];

                let destroy = false;

                let c = this.getHitObject(b.clampedPosition, this.getLightInteractiveKinematicObjects());
                if (c) {
                    destroy = true;
                    if (b.clampedPosition.x < c.clampedPosition.x)
                        c.velocity.x = Math.min(5, c.velocity.x + 2);
                    else
                        c.velocity.x = Math.max(-5, c.velocity.x - 2);
                    c.velocity.y = -5;
                }

                b.aliveTime += dt;
                if (b.aliveTime > 1.5) {
                    destroy = true;
                }

                if (destroy) {
                    this.bullets.splice(i, 1);
                    --i;
                    this.frontElements.removeChild(b);
                }
            }

            for (let i: number = 0; i < this.particles.length; ++i) {
                let p = this.particles[i];
                p.aliveTime += dt;
                if (p.aliveTime > 1.5) {
                    this.particles.splice(i, 1);
                    --i;
                    this.frontElements.removeChild(p);
                }
                else if (p.aliveTime > .5) {
                    let t = 1 - Math.pow((p.aliveTime - .5) / 1, .5);
                    p.alpha = t;
                    // p.scale.x = p.scale.y = t;
                }
            }

            let cpyBombs = [...this.bombs];
            for (let b of cpyBombs)
                b.update(dt);

            //update grabbed item physics:
            this.wizard.update(dt);

            //update push-block & collectible physics:
            let kinemElems = this.getKinematicObjects();
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
                    this.backElements.removeChild(c);
                    this.frontElements.removeChild(c);
                    --i;
                }
            }

            this.fixCamera(true);
        }

        burstParticles(pos: Point, n: number, clr: number, force: number) {
            for (var i: number = 0; i < n; ++i) {
                let w = 4 + 2 * Math.floor(Math.random() * 4);
                let p = new Particle(clr, w);
                p.clampedPosition = pos.clone();
                p.x = pos.x;
                p.y = pos.y;
                p.velocity.x = (Math.random() - .5) * force;
                p.velocity.y = (Math.random() - .5) * force;
                p.clampedPosition = p.clampedPosition.clone().add(p.velocity.multiply(1));
                this.frontElements.addChild(p);
                this.particles.push(p);
            }
        }

        prevPot: Pot;

        breakPot(pot: Pot) {
            let idx = this.pots.indexOf(pot);
            if (idx < 0)
                return;

            this.pots.splice(idx, 1);
            this.frontElements.removeChild(pot);
            this.burstParticles(pot.clampedPosition, 20, 0xaa5588, 10);

            if (Math.random() < .5) {
                let r = new Rubee();
                r.clampedPosition = pot.clampedPosition.clone();
                r.x = pot.x;
                r.y = pot.y;
                this.rubees.push(r);
                this.frontElements.addChild(r);
            }

            this.prevPot = pot;
        }

        breakPotion(potion: Potion) {
            let idx = this.potions.indexOf(potion);
            if (idx < 0)
                return;
            this.potions.splice(idx, 1);
            this.frontElements.removeChild(potion);
            this.burstParticles(potion.clampedPosition, 20, 0x00ffff, 10);
        }

        explodeBomb(bomb: Bomb) {
            let idx = this.bombs.indexOf(bomb);
            this.bombs.splice(idx, 1);
            this.frontElements.removeChild(bomb);
            this.burstParticles(bomb.clampedPosition, 20, 0xff0000, 10);
            this.burstParticles(bomb.clampedPosition, 20, 0xffaa00, 20);
            this.burstParticles(bomb.clampedPosition, 20, 0xffff00, 30);
            if (this.wizard.grabObject == bomb)
                this.wizard.grabObject = null;

            //destroy breakable blocks:
            for (let i: number = 0; i < this.brittleBlocks.length; ++i) {
                let b = this.brittleBlocks[i];
                let dx = b.x - bomb.x;
                let dy = b.y - bomb.y;
                let pt = new Point(dx, dy);
                if (pt.length() < GRID_UNIT_SIZE * 2) {
                    this.brittleBlocks.splice(i, 1);
                    --i;
                    this.backElements.removeChild(b);
                    this.burstParticles(b.clampedPosition, 10, 0xff8800, 20);
                    // this.burstParticles(b.clampedPosition, 20, 0xccaa88, 10);
                }
            }

            //detonate close-range bombs:
            for (let b of this.bombs) {
                let pt = new Point(b.x - bomb.x, b.y - bomb.y);
                if (pt.length() < GRID_UNIT_SIZE * 2)
                    b.aliveTime = 3;
            }

            //destroy other breakables:
            let bs = this.getShatterableObjects();
            for (let b of bs) {
                let pt = b.clampedPosition.clone().subtract(bomb.clampedPosition);
                if (pt.length() < GRID_UNIT_SIZE * 2) {
                    if (b.destroyCallback)
                        b.destroyCallback.call(b);
                }
            }

            //let other kinematic objects fly:
            let kos = this.getLightKinematicObjects();
            for (let k of kos) {
                let pt = k.clampedPosition.clone().subtract(bomb.clampedPosition);
                if (pt.length() < GRID_UNIT_SIZE * 2) {
                    pt.normalize(20);
                    k.velocity.x += Math.round(pt.x);
                    k.velocity.y += Math.round(pt.y);
                }
            }
        }

        resolveCollisions(gObj: GameObject) {

            let gAABB = gObj.getBoundingBox();

            let displacement = gObj.velocity.clone();

            //process x-displacement:
            let allBlockades: GameObject[] = this.getSolidObjects().filter((val) => { return val != gObj; });

            for (let b of allBlockades) {

                let b_box = b.getBoundingBox();
                let objCollDistX = gAABB.halfWidth + b_box.halfWidth;
                let objCollDistY = gAABB.halfHeight + b_box.halfHeight;

                //y-collision?
                if (Math.abs(gObj.clampedPosition.y - b.clampedPosition.y) < objCollDistY) {

                    //if moving towards block:
                    let toBlockCenterX = b.clampedPosition.x - gObj.clampedPosition.x;
                    if (this.sign(displacement.x) == this.sign(toBlockCenterX)) {
                        let distanceLeft = Math.max(0, Math.abs(toBlockCenterX) - objCollDistX);
                        if (distanceLeft < Math.abs(displacement.x)) {
                            displacement.x = this.sign(displacement.x) * distanceLeft;
                            gObj.bounceOffWall(this.sign(toBlockCenterX) < 0);
                        }
                    }
                }
            }

            gObj.clampedPosition.x += displacement.x;
            gObj.clampedPosition.x = Math.round(gObj.clampedPosition.x);
            gObj.clampedPosition.x = Math.max(OUTER_BORDER_TILE_COUNT * GRID_UNIT_SIZE + gAABB.halfWidth, Math.min((this.columns - OUTER_BORDER_TILE_COUNT) * GRID_UNIT_SIZE - gAABB.halfWidth, gObj.clampedPosition.x));

            //process y-displacement:
            for (let b of allBlockades) {

                let b_box = b.getBoundingBox();
                let objCollDistX = gAABB.halfWidth + b_box.halfWidth;
                let objCollDistY = gAABB.halfHeight + b_box.halfHeight;

                //x-collision?
                if (Math.abs(gObj.clampedPosition.x - b.clampedPosition.x) < objCollDistX) {

                    //if moving towards block:
                    let toBlockCenterY = b.clampedPosition.y - gObj.clampedPosition.y;
                    if (this.sign(displacement.y) == this.sign(toBlockCenterY)) {
                        let distanceLeft = Math.max(0, Math.abs(toBlockCenterY) - objCollDistY);
                        if (distanceLeft < Math.abs(displacement.y)) {
                            if (this.sign(displacement.y) > 0)
                                gObj.bounceOffFloor();
                            else
                                gObj.bounceOffCeiling();
                            displacement.y = this.sign(displacement.y) * distanceLeft;
                        }
                    }
                }
            }

            //process y-displacement (for platforms):
            for (let p of this.getPlatformObjects()) {

                if (gObj.ignorePlatform)
                    break;

                let p_box = p.getBoundingBox();
                let objCollDistX = gAABB.halfWidth + p_box.halfWidth;
                let objCollDistY = gAABB.halfHeight + p_box.halfHeight;

                //x-collision?
                if (Math.abs(gObj.clampedPosition.x - p.clampedPosition.x) < objCollDistX) {

                    //if moving towards platform:
                    let toPlatformCenterY = p.clampedPosition.y - gObj.clampedPosition.y;
                    if (toPlatformCenterY <= 0)
                        continue;

                    if (this.sign(displacement.y) == this.sign(toPlatformCenterY)) {
                        let distanceLeft = Math.abs(toPlatformCenterY) - objCollDistY;
                        if (distanceLeft < 0)
                            continue;
                        if (distanceLeft <= Math.abs(displacement.y)) {
                            displacement.y = this.sign(displacement.y) * distanceLeft;
                            gObj.bounceOffPlatform();
                        }
                    }
                }
            }

            //clamp to screen bounds:
            gObj.clampedPosition.y += displacement.y;
            gObj.clampedPosition.y = Math.round(gObj.clampedPosition.y);
            gObj.clampedPosition.y = Math.max(OUTER_BORDER_TILE_COUNT * GRID_UNIT_SIZE + gAABB.halfHeight, Math.min((this.rows - OUTER_BORDER_TILE_COUNT) * GRID_UNIT_SIZE - gAABB.halfHeight, gObj.clampedPosition.y));

            gObj.x = .5 * gObj.x + .5 * gObj.clampedPosition.x;
            gObj.y = .5 * gObj.y + .5 * gObj.clampedPosition.y;
        }
    }
}
