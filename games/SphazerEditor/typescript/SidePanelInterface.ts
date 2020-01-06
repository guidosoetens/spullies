///<reference path="../../libs/phaser/phaser.d.ts"/>
///<reference path="Definitions.ts"/>
///<reference path="Polygon.ts"/>
/*
///<reference path="../sidePanel.d.ts"/> 
//.js"/>
*/


module EditorModule
{    
    declare function focusOnPolygon(param1: Polygon): void;
    declare function focusOnNode(param1: PolygonVertex): void;

    export class SidePanelInterface {

        
        
        constructor() {
            //...
        }
        
        static setPolygonFocus(p:Polygon) {
            focusOnPolygon(p);
        }
        
        static setNodeFocus(v:PolygonVertex) {
            focusOnNode(v);
        }
    }
}