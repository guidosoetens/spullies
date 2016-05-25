///<reference path="../../phaser/phaser.d.ts"/>

module KernelTest
{
    const KERNEL_CENTER : Phaser.Point = new Phaser.Point(300,200);
    const KERNEL_SLOT_WIDTH : number = 50;
    
    export class SimpleGame {
        
        game: Phaser.Game;
        graphics : Phaser.Graphics;
        values : number[][];
        angle : number;
        
        constructor() {
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
        }
        
        preload() {
            
        }
        
        create() {
            this.graphics = this.game.add.graphics(0,0);
            
            this.angle = 0;
            
            this.values = [];
            for(var i:number=0; i<3; ++i) {
                this.values[i] = [];
                for(var j:number=0; j<3; ++j) {
                    this.values[i][j] = 0.5;
                }
            }
        }
        
        update() {
            
            var pt = this.game.input.position;
            var toPt = new Phaser.Point(pt.x - KERNEL_CENTER.x, pt.y - KERNEL_CENTER.y);
            toPt = toPt.normalize();
            
            var sumNumber:number = 0;
            
            for(var i:number=0; i<3; ++i) {
                for(var j:number=0; j<3; ++j) {
                    
                    if(i == 1 && j == 1)
                        continue;
                        
                    var to = new Phaser.Point(j - 1, i - 1);
                    to = to.normalize();
                    
                    var dot = toPt.dot(to);
                    var weight:number = 0;
                    if(dot > 0) {
                        
                        weight = Math.max(0, 1.0 - Math.acos(dot) / (.25 * Math.PI));
                    }
                    
                    this.values[i][j] = weight;
                    sumNumber += weight;
                }
            }
            
            this.game.debug.text("getalletje" + sumNumber, 20, 20);
        }
        
        renderBlock() {
            
        }
        
        render() {
            this.graphics.clear();
            
            //draw background:
            this.graphics.beginFill(0xffee66);
            this.graphics.drawRect(0,0,800,600);
            this.graphics.endFill();
            
            for(var i:number=0; i<3; ++i) {
                for(var j:number=0; j<3; ++j) {
                    
                    var x:number = KERNEL_CENTER.x + (j - 1.5) * KERNEL_SLOT_WIDTH;
                    var y:number = KERNEL_CENTER.y + (i - 1.5) * KERNEL_SLOT_WIDTH;
                    
                    //draw slot:
                    this.graphics.lineStyle(3,0x333333);
                    this.graphics.beginFill(0x555555);
                    this.graphics.drawRoundedRect(x, y, KERNEL_SLOT_WIDTH, KERNEL_SLOT_WIDTH, .2 * KERNEL_SLOT_WIDTH);
                    this.graphics.endFill();
                    
                    if(i == 1 && j == 1)
                        continue;
                    
                    //draw filler:
                    var m:number = .2 * KERNEL_SLOT_WIDTH;
                    var w:number = KERNEL_SLOT_WIDTH - 2 * m;
                    this.graphics.lineStyle(0);
                    this.graphics.beginFill(0xaaaaaa);
                    this.graphics.drawRect(x + m, y + m, w * this.values[i][j], w);
                    this.graphics.endFill();
                }
            }
            
        }
    }
}

window.onload = () => {
    var game = new KernelTest.SimpleGame();
};