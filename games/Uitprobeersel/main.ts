///<reference path="../../phaser/phaser.d.ts"/>

module BlokjesGame
{
    const WIDTH:number = 800;
    const HEIGHT:number = 600;
    const SCALE:number = 0.5;
    const MOTION_WIDTH:number = WIDTH * SCALE;
    const MOTION_HEIGHT:number = HEIGHT * SCALE;
    const MOTION_RADIUS:number = 30;
    
    export class SimpleGame {
        
        game: Phaser.Game;
        shader: Phaser.Filter;
        bitmapData:Phaser.BitmapData;
        inputLoc:Phaser.Point;
        renderTexture:Phaser.RenderTexture;
        image:Phaser.Image;
        
        constructor() {
            this.game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
        }
        
        preload() {
            this.game.load.shader("velocityShader", 'velocityShader.frag');
        }
        
        create() {
            this.shader = new Phaser.Filter(this.game, null, this.game.cache.getShader('velocityShader'));
            
            this.inputLoc = new Phaser.Point(0, 0);
            
            //Create Stamp:
            this.bitmapData = this.game.make.bitmapData(MOTION_WIDTH, MOTION_HEIGHT);
            this.image = this.game.add.image(0, 0, this.bitmapData);
            this.image.scale.x = 1.0 / SCALE;
            this.image.scale.y = 1.0 / SCALE;
            this.image.filters = [ this.shader ];
            
            this.renderTexture = this.game.add.renderTexture(MOTION_WIDTH, MOTION_HEIGHT);
           
            //this.game.add.image(0,0,this.renderTexture);
        }
        
        update() {
            
            //update location buffer:
            var prevLoc = this.inputLoc;
            var currLoc = new Phaser.Point(this.inputLoc.x, this.inputLoc.y).multiply(.9, .9).add(.1 * SCALE * this.game.input.position.x, .1 * SCALE * this.game.input.position.y);
            this.inputLoc = currLoc;
            
            this.bitmapData.clear();
            this.bitmapData.update();
            
            var minX:number = Math.round(Math.min(prevLoc.x - MOTION_RADIUS, currLoc.x - MOTION_RADIUS));
            var maxX:number = Math.round(Math.max(prevLoc.x + MOTION_RADIUS, currLoc.x + MOTION_RADIUS));
            var minY:number = Math.round(Math.min(prevLoc.y - MOTION_RADIUS, currLoc.y - MOTION_RADIUS));
            var maxY:number = Math.round(Math.max(prevLoc.y + MOTION_RADIUS, currLoc.y + MOTION_RADIUS));
          
            var radSqrd = MOTION_RADIUS * MOTION_RADIUS;
            
            for(var x:number=Math.max(0, minX); x<MOTION_WIDTH && x < maxX; ++x) {
                for(var y:number=Math.max(0, minY); y<MOTION_HEIGHT && y < maxY; ++y) {
                    
                    var closeTo1 = new Phaser.Point(prevLoc.x - x, prevLoc.y - y).getMagnitudeSq() <= radSqrd;
                    var closeTo2 = new Phaser.Point(currLoc.x - x, currLoc.y - y).getMagnitudeSq() <= radSqrd;
                    if(closeTo1 && !closeTo2 || !closeTo1 && closeTo2)
                        this.bitmapData.setPixel(x, y, 255, 0, 0, false);
                }
            }
            this.bitmapData.setPixel(0,0,0,0,0);
            
            //this.renderTexture.clear();
            this.renderTexture.render(this.image);
        }
        
        render() {
            //this.game.debug.text("input loc: " + this.inputLoc, 0, 50);
        }
    }
}

window.onload = () => {
    var game = new BlokjesGame.SimpleGame();
};