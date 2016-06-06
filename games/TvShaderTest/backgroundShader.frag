precision mediump float;

//phaser variables:
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

//phaser base texture:
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

const float pi = 3.14159265359;
const vec4 BASE_COLOR_PINK = vec4(1.0, 0.6235, 0.6235, 1.0);
const vec4 BASE_COLOR = BASE_COLOR_PINK;

bool isCheck(vec2 uv) {
    float checks = 20.0;
    bool checkX = fract(uv.x * checks) < .5;
    bool checkY = fract(uv.y * checks) < .5;
    return checkX ? checkY : !checkY;
}

bool xyIsCheck(vec2 xy) {
    float checkWidth = 1024.0 / 5.5;// 307.2;//192.0;// 50.0;
    bool checkX = fract(abs(xy.x) / checkWidth - 0.25) < .5;
    bool checkY = fract(abs(xy.y) / checkWidth - 0.25) < .5;
    return checkX ? checkY : !checkY;
}
    
vec4 randomColor(vec2 root) {
    
    return vec4(.5 + .5 * sin(100.0 * root.x), .5 + .5 * sin(root.x) * cos(210.0 * root.y), .5 + .5 * cos(pow(root.x, 5.0)), 1.0);
    
}

void main() {
    
    float numHexHeight = 3.0;
    
    vec2 uv = vTextureCoord;
    vec2 xy = (uv - .5) * vec2(1024, 768); //(0,0) is center screen. Each step corresponds to 1 pixel
    
    float hexHeight = 768.0 / numHexHeight; //i.e: 5 stacked on top of each other -> fills screen
    float hexRad = .5 * hexHeight / cos(pi / 6.0);
    float hexWidth = 2.0 * hexRad;
    
    float fragWidth = 3.0 * hexRad;
    float fragHeight = hexHeight;
    
    vec2 hexLoc = vec2(0,0);
    float fragX = xy.x / fragWidth;
    hexLoc.x = fragX - fract(fragX);
    fragX = fract(fragX);
    
    float fragY = xy.y / fragHeight;
    hexLoc.y = fragY - fract(fragY);
    fragY = fract(fragY);
    
    //offset hexLoc:
    float div6 = 1.0 / 6.0;
    if(fragX < div6) {
        if(fragY > .5)
            hexLoc.y += 1.0;
    }
    else if(fragX < 2.0 * div6) {
        if(fragY < .5) {
            if(fragX > div6 * (2.0 - 2.0 * fragY)) {
                hexLoc.x += 0.5;
                hexLoc.y += 0.5;
            }
        }
        else {
            if(fragX > div6 * (2.0 * fragY)) {
                hexLoc.x += 0.5;
                hexLoc.y += 0.5;
            }
            else {
                hexLoc.y += 1.0;
            }
        }
    }
    else if(fragX < 4.0 * div6) {
        hexLoc.x += 0.5;
        hexLoc.y += 0.5;
    }
    else if(fragX < 5.0 * div6) {
        if(fragY < .5) {
            if(fragX > div6 * (4.0 + 2.0 * fragY)) {
                hexLoc.x += 1.0;
            }
            else {
                hexLoc.x += 0.5;
                hexLoc.y += 0.5;
            }
        }
        else {
            if(fragX < div6 * (6.0 - 2.0 * fragY)) {
                hexLoc.x += 0.5;
                hexLoc.y += 0.5;
            }
            else {
                hexLoc.x += 1.0;
                hexLoc.y += 1.0;
            }
        }
    }
    else {
        hexLoc.x += 1.0;
        if(fragY > .5)
            hexLoc.y += 1.0;
    }
    
    //get hex location in screen space:
    hexLoc *= vec2(3.0 * hexRad, hexHeight);
    
    vec2 to = xy - hexLoc;
    float angle = atan(to.y, to.x);
    
    float angFactor = fract(3.0 * angle / pi);
    
    
    
    
    
    /*
    float maxFactor =  (.5 + .5 * cos(6.0 * angle));
    
    float h = .5 * hexHeight;
    float maxDist = (1.0 - maxFactor) * h + maxFactor * hexRad;
    
    float d = length(to) / maxDist;
    
    if(d > 0.8)
        gl_FragColor = vec4(0,.2,0,1);
    else
        gl_FragColor = vec4(fract(5.0 * d),0,0,1);
        */
    
    
    //gl_FragColor = randomColor(hexLoc);
    
    /*
    if(fract(fragX * 6.0) < .04 || fract(fragY * 2.0) < .02)
        gl_FragColor = vec4(0,0,0,1); 
        */
    
    
    /*
    float stepX = 1.5 * hexRad;
    float stepY = hexHeight;
    
    
    float hexX = xy.x / stepX;
    hexX = (hexX - fract(hexX)) * stepX;
    
    float hexY = (xy.y) / stepY;
    hexY = (hexY - fract(hexY)) * stepY;
    
    
    gl_FragColor = randomColor(vec2(hexX, hexY));
    */
    
    /*
    if(xyIsCheck(xy))
        gl_FragColor = vec4(0,0.5,0.5,1);
    else 
        gl_FragColor = vec4(1,0,0,1);
        */
    
    
    
    /*
    
    float stepY = 0.86602540378;
    
    vec2 xy = vTextureCoord;
    
    //based on XY
    float baseDistance = 4.0;
    float xBase = xy.x * baseDistance;
    float xFract = fract(xBase);
    float xFloor = xBase - xFract;
    float xCenter = (xFloor + .5) / baseDistance;
    
    
    float swapOffset = (mod(xFloor, 2.0) < 1.0) ? 0.0 : 0.5 * stepY;
    
    float yBase = xy.y * baseDistance;
    float yFract = fract(yBase);
    float offY = 0.0;
    if(xFract < .3)
        offY = yFract < xFract ? 1.0 : -1.0;
    else if(xFract > .7)
        offY = yFract < xFract ? -1.0 : 1.0;
    float yCenter = (yBase - yFract + .5 + offY + swapOffset) / baseDistance;
    
    vec2 base = vec2(xCenter, yCenter);
    gl_FragColor = randomColor(base);
    */
    
    /*
    //3 pixel center:
    if(abs(xy.x) < 1.5 || abs(xy.y) < 1.5)
        gl_FragColor = vec4(0,0,0,1);
        */
        
    
    /*
    vec2 toBase = xy - vec2(xBase, yBase);
    float angle = atan(toBase.y, toBase.x);
    float maxDist = (0.5 - 0.20710678118) + 0.20710678118 * abs(cos(2.0 * angle));
   // maxDist *= 0.5;
    
    //1.41421356237
    
    
    float d = length(toBase) / (1.0 / baseDistance);
    gl_FragColor = vec4(d / maxDist,0,0,1);
    */
}