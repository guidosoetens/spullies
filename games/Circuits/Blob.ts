///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Defs.ts"/>

module BlokjesGame
{
    export class Blob {
        
        //private dxs:number[] = [GRIDWIDTH / 3,0,-GRIDWIDTH / 3,0];
        //private dys:number[] = [0,GRIDWIDTH / 3,0,-GRIDWIDTH / 3];
        
        isBlocking:boolean;
        typeIndex:number;
        removing:boolean;
        testSource:Blob;
        chainedToNeighbor:boolean[];
        dropping:boolean;
        dropFromRow:number;
        
        constructor(game:Phaser.Game) {
            
            this.isBlocking = false;
            this.typeIndex = 0;
            this.removing = false;
            this.testSource = null;
            this.chainedToNeighbor = [false, false, false, false];
            this.dropping = false;
            this.dropFromRow = 0;
        }
    }
}