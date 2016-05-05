///<reference path="../../phaser/phaser.d.ts"/>

const TOPROWCOUNT:number = 3;
const VISIBLEROWCOUNT:number = 4;//12;
const ROWCOUNT:number = VISIBLEROWCOUNT + TOPROWCOUNT; //12 at the bottom
const COLUMNCOUNT:number = 4; //6;
const COLORCODES:number[] = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];//, 0x00ffff];
const TICKCOUNT:number = 1;
const GRIDWIDTH:number = 100;// 45;
const NEIGHBORDELTAINDICES:number[][] = [[0,1], [1,0], [0,-1], [-1,0]]; //(right, bottom, left, top) [row][column] - format

var debugText:string;
var noiseSprite:Phaser.Sprite;