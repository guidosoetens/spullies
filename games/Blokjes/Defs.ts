///<reference path="../../phaser/phaser.d.ts"/>

const TOPROWCOUNT:number = 3;
const VISIBLEROWCOUNT:number = 12;
const ROWCOUNT:number = VISIBLEROWCOUNT + TOPROWCOUNT; //12 at the bottom
const COLUMNCOUNT:number = 6;
const COLORCODES:number[] = [0xff4444, 0x44ff44, 0x4444ff, 0xffff44, 0xff44ff, 0x00ffff];
const TICKCOUNT:number = 1;
const GRIDWIDTH:number = 45;
const NEIGHBORDELTAINDICES:number[][] = [[0,1], [1,0], [0,-1], [-1,0]]; //(right, bottom, left, top) [row][column] - format

var debugText:string;
var noiseSprite:Phaser.Sprite;