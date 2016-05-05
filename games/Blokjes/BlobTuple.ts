///<reference path="../../phaser/phaser.d.ts"/>
///<reference path="Defs.ts"/>
///<reference path="Blob.ts"/>

module BlokjesGame 
{
    export class BlobTuple {
        blob1:Blob;
        blob2:Blob;
        
        private _orientation:number = 0;
        private renderOrientation:Phaser.Point = new Phaser.Point(0,-1);
        
        row:number;
        column:number;
        
        get row2():number {
            return this.row + NEIGHBORDELTAINDICES[this.orientation][0];
        }
        
        get column2():number {
            return this.column + NEIGHBORDELTAINDICES[this.orientation][1];
        }
        
        get orientation():number {
            return this._orientation;
        }
        set orientation(value:number) {
            value = Math.round(value);
            if(value < 0)
                value += 4;
            value = value % 4;
            this._orientation = value;
        }
        
        constructor(blob1:Blob, blob2:Blob) {
            this.blob1 = blob1;
            this.blob2 = blob2;
            this.orientation = 3;
            this.row = TOPROWCOUNT;
            this.column = COLUMNCOUNT / 2 - 1;
        }
        
        render(graphics:Phaser.Graphics, x:number, y:number) {
            
            var to:Phaser.Point = new Phaser.Point( NEIGHBORDELTAINDICES[this.orientation][1], 
                                                    NEIGHBORDELTAINDICES[this.orientation][0]);
                                  
            var angle:number = Math.acos(this.renderOrientation.dot(to));
            var cross:number = to.cross(this.renderOrientation);
            var sign:number = cross < 0 ? 1 : -1;
            
            this.renderOrientation.rotate(0, 0, sign * .75 * angle);
            
            this.blob1.updatePosition(x, y, 1);
            this.blob2.updatePosition(x + this.renderOrientation.x * GRIDWIDTH, y + this.renderOrientation.y * GRIDWIDTH, 1);
            
            //this.blob1.render(graphics, x, y, 1);
            //this.blob2.render(graphics, x + this.renderOrientation.x * gridWidth, y + this.renderOrientation.y * gridWidth, 1);
        }
    }
}