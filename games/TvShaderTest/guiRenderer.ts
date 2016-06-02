///<reference path="../../phaser/phaser.d.ts"/>

module BlokjesGame
{
    const WIDTH:number = 1024;
    const HEIGHT:number = 768;
    
    export class GuiRenderer {
        
        game:Phaser.Game;
        
        constructor(game:Phaser.Game) {
            this.game = game;
        }
        
        renderHex(gr:Phaser.Graphics, lineColor:number, x:number, y:number, width:number) {
            
            var dAng:number = 2 * Math.PI / 6;
            var rad:number = .8 * .5 * width / Math.cos(.5 * dAng);
            
            gr.beginFill(0x222222, 1);
            gr.lineStyle(8, lineColor, 255);
            gr.moveTo(x, y + rad);
            
            for(var it:number=0; it<6; ++it) {
                var angle:number = .5 * Math.PI + (it + 1) * dAng;
                gr.lineTo(x + rad * Math.cos(angle), y + rad * Math.sin(angle));
            }
            
            gr.endFill();
            
        }
        
        renderPause(menuGraphics:Phaser.Graphics, group:Phaser.Group) {
            menuGraphics.clear();
            group.removeAll(true);
            
            //text container:
            var style = { font: "65px Courier New", fill: "#ffffff", align: "center" };
            var scoreStyle = { font: "32px Courier New", fill: "#ffffff", align: "center" };
            var numStyle = { font: "46px Courier New", fill: "#ffffff", align: "center" };
            var starStyle = { font: "32px Roboto", fill: "#ffffff", align: "center" };
            var arrowStyle = { font: "54px Roboto", fill: "#ffffff", align: "center" };
            var txt = this.game.make.text(this.game.width / 2, 160, "PAUSE", style);
            txt.x -= .5 * txt.width;
            txt.y -= .5 * txt.height;
            txt.fontWeight = 'bold';
            var groupBg = this.game.make.graphics(0,0);
            groupBg.beginFill(0);
            groupBg.drawRect(0,0,WIDTH,HEIGHT);
            group.addChild(groupBg);
            group.addChild(txt);
            
            //create levels grid:
            menuGraphics.beginFill(0);
            menuGraphics.drawRect(0,0,WIDTH,HEIGHT);
            menuGraphics.endFill();
            
            //menuGraphics.lineStyle(4, 0x555555, 255);
            //menuGraphics.drawRect(20, 100, WIDTH - 40, 70);
            menuGraphics.lineStyle(4, 0xffffff, 255);
            menuGraphics.drawRect(20, 20, WIDTH - 40,HEIGHT - 40);
            menuGraphics.lineStyle(6, 0xffffff, 255);
            menuGraphics.drawRect(30, 30, WIDTH - 60,HEIGHT - 60);
        }
        
        renderLevelSelect(menuGraphics:Phaser.Graphics, group:Phaser.Group) {
            
            menuGraphics.clear();
            group.removeAll(true);
            
            //text container:
            var style = { font: "65px Courier New", fill: "#ffffff", align: "center" };
            var scoreStyle = { font: "32px Courier New", fill: "#ffffff", align: "center" };
            var numStyle = { font: "46px Courier New", fill: "#ffffff", align: "center" };
            var starStyle = { font: "32px Roboto", fill: "#ffffff", align: "center" };
            var arrowStyle = { font: "54px Roboto", fill: "#ffffff", align: "center" };
            var txt = this.game.make.text(this.game.width / 2, 160, "WORLD 1", style);
            txt.x -= .5 * txt.width;
            txt.y -= .5 * txt.height;
            txt.fontWeight = 'bold';
            var groupBg = this.game.make.graphics(0,0);
            groupBg.beginFill(0);
            groupBg.drawRect(0,0,WIDTH,HEIGHT);
            group.addChild(groupBg);
            group.addChild(txt);
            
            //create levels grid:
            menuGraphics.beginFill(0);
            menuGraphics.drawRect(0,0,WIDTH,HEIGHT);
            menuGraphics.endFill();
            
            //menuGraphics.lineStyle(4, 0x555555, 255);
            //menuGraphics.drawRect(20, 100, WIDTH - 40, 70);
            menuGraphics.lineStyle(4, 0xffffff, 255);
            menuGraphics.drawRect(20, 20, WIDTH - 40,HEIGHT - 40);
            menuGraphics.lineStyle(6, 0xffffff, 255);
            menuGraphics.drawRect(30, 30, WIDTH - 60,HEIGHT - 60);
            
            //render level buttons:
            var width:number = 130;
            
            var idx:number = 1;
            for(var i:number=0; i<3; ++i) {
                var cols = (i % 2 == 0) ? 5 : 6;
                for(var j:number=0; j<cols; ++j) {
                    
                    var x:number = 180 + (.5 * (1 - i % 2) + j) * width;
                    var y:number = 280 + .85 * i * width; 
                    
                    var lineColor = idx < 10 ? 0xffffff : 0x555555;
                    
                    this.renderHex(menuGraphics, lineColor, x, y, width);
                    
                    txt = this.game.make.text(x, y, "" + idx, numStyle);
                    txt.addColor('#' + lineColor.toString(16), 0);
                    txt.fontWeight = 'bold';
                    txt.y -= .5 * txt.height + 15;
                    txt.x -= .5 * txt.width;
                    group.addChild(txt);
                    ++idx;
                    
                    var starString:string = "";
                    var starCount = idx < 10 ? this.game.rnd.integerInRange(0, 3) : 0;
                    var sIdx:number = 0;
                    while(sIdx++ < starCount)
                        starString += "★";
                    while(starString.length < 3)
                        starString += "☆";
                    txt = this.game.make.text(x, y, starString, starStyle);
                    txt.addColor('#' + lineColor.toString(16), 0);
                    //txt.addColor('#888888', starCount);
                    txt.y -= .5 * txt.height - 15;
                    txt.x -= .5 * txt.width;
                    group.addChild(txt);
                }
            }
            
            this.renderHex(menuGraphics, 0xffffff, 160, 160, 120);
            txt = this.game.make.text(160, 160, "▶", arrowStyle);
            txt.scale.x = -1;
            txt.y -= .5 * txt.height;
            txt.x -= .4 * txt.width;
            group.addChild(txt);
                    
            this.renderHex(menuGraphics, 0xffffff, this.game.width - 160, 160, 120);
            txt = this.game.make.text(this.game.width - 160, 160, "▶", arrowStyle);
            txt.y -= .5 * txt.height;
            txt.x -= .4 * txt.width;
            group.addChild(txt);
            
            this.renderHex(menuGraphics, 0xffffff, 310, this.game.height - 130, 140);
            txt = this.game.make.text(310, this.game.height - 130, "⏰", style);
            txt.y -= .5 * txt.height;
            txt.x -= .5 * txt.width;
            group.addChild(txt);
            
            //render score:
            txt = this.game.make.text(this.game.width / 2 - 100, this.game.height - 130, "HIGHSCORE: 00302456", scoreStyle);
            txt.y -= .5 * txt.height;
            //txt.x -= .5 * txt.width;
            group.addChild(txt);
        }
    }
}