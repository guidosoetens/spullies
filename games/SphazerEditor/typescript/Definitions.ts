const TOOL_OPT_WIDTH:number = 50.0;
const DRAGGABLE_CMP_RADIUS:number = 25.0;
const POLYGON_NODE_RADIUS:number = 10.0;

const LEVEL_VERTICAL_MARGIN:number = 100.0;
const LEVEL_HORIZONTAL_MARGIN:number = LEVEL_VERTICAL_MARGIN;
const LEVEL_WIDTH:number = 800.0;
const LEVEL_HEIGHT:number = 600.0;
const TOOLBAR_HEIGHT:number = 80.0;
const STAGE_WIDTH:number = LEVEL_WIDTH + 2 * LEVEL_HORIZONTAL_MARGIN;
const STAGE_HEIGHT:number = LEVEL_HEIGHT + 2 * LEVEL_VERTICAL_MARGIN + TOOLBAR_HEIGHT;

const TUNNEL_COLORS:number[] = [0x0, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];

const SPECIAL_POLYGONS_IDX:number = 0x10000;
const SPECIAL_POLYGON_CIRCLE:number = SPECIAL_POLYGONS_IDX;
const SPECIAL_POLYGON_STAR:number   = SPECIAL_POLYGONS_IDX + 1;
const SPECIAL_POLYGON_HEART:number  = SPECIAL_POLYGONS_IDX + 2;

var debugTekstje:string = "";