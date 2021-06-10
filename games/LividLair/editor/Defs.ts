///<reference path="../../../pixi/pixi.js.d.ts"/>
///<reference path="../game/Defs.ts"/>


module LividLair {

    export function drawGameObject(context: PIXI.Graphics, type: TileType, pos: Point, width: number = GRID_UNIT_SIZE) {

        let drawBlock = (clr: number, w: number = width) => {
            context.beginFill(clr);
            context.drawRoundedRect(pos.x - w / 2, pos.y - w / 2, w, w, .05 * w);
        };

        let drawRect = (clr: number, x: number, y: number, w: number, h: number) => {
            context.beginFill(clr);
            context.drawRect(pos.x + x - w / 2, pos.y + y - h / 2, w, h);
        };

        let drawLadder = () => {
            let clr = 0xA0522D;
            drawRect(clr, -width * .4, 0, .1 * width, width);
            drawRect(clr, width * .4, 0, .1 * width, width);
            for (let i: number = 0; i < 3; ++i)
                drawRect(clr, 0, ((i + .5) / 3 - .5) * width, .8 * width, .1 * width);
        };

        let drawPlatform = () => {
            drawRect(0x00aaff, 0, - width * .4, width, width * .2);
        };

        let drawCircle = (clr: number) => {
            context.beginFill(clr);
            context.drawCircle(pos.x, pos.y, width * .4);
        }

        switch (type) {
            case TileType.Block:
                drawBlock(0xffaa88);
                break;
            case TileType.BrittleBlock:
                drawBlock(0xaa8833);
                break;
            case TileType.Platform:
                drawPlatform();
                break;
            case TileType.Ladder:
                drawLadder();
                break;
            case TileType.CrossLadder:
                drawLadder();
                drawPlatform();
                break;
            case TileType.PushBlock:
                drawBlock(0xaaaaff);
                drawBlock(0x8888aa, .7 * width);
                break;
            case TileType.Wizard:
                drawCircle(0x55aaff);
                break;
            case TileType.Chest:
                drawCircle(0xff0000);
                drawRect(0xff0000, 0, width * .25, width * .8, width * .5);
                break;
            case TileType.Pot:
                drawCircle(0x70380f);
                break;
            case TileType.Rubee:
                drawRect(0x88ff88, 0, 0, .2 * width, .6 * width);
                break;
            case TileType.Exit:
                drawRect(0x8888aa, 0, 0, .7 * width, width);
                drawRect(0x444466, 0, .1 * width, .5 * width, width * .9);
                break;
            case TileType.Trampoline:
                context.beginFill(0xffffff);
                context.drawCircle(pos.x, pos.y, width * .25);
                drawRect(0xaa0000, 0, -.2 * width, .4 * width, width * .2);
                break;
        }
    }
}
