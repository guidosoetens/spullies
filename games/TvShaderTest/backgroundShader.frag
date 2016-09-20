precision mediump float;

//phaser variables:
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

//phaser base texture:
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform sampler2D uHexTex;

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

vec4 sampleHexValue(vec2 xy) {
        
    float numHexHeight = 8.0;// 10.0 * mouse.y / 768.0;
    
    //vec2 xy = (uv - .5) * vec2(1024, 768); //(0,0) is center screen. Each step corresponds to 1 pixel
    
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
    
    hexLoc = vec2(0,0);
    
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
    
    vec2 uv = .5 + .5 * (hexLoc - vec2(fragX, fragY)) * vec2(3.0, 2.0);
    return texture2D(uHexTex, uv);
    
    /*
    
    //get hex location in screen space:
    hexLoc *= vec2(3.0 * hexRad, hexHeight);
    
    vec2 to = xy - hexLoc;
    float angleFactor = mod(abs(atan(to.y, to.x)) / pi, 1.0 / 3.0) * 3.0;
    float t = 2.0 * abs(angleFactor - .5);
    t = pow(t, mouse.x);
    //t = 1.0 - cos(t * .5 * pi);
    //t = pow(t, 5.0);
    
    //angle: from 0 to 1.
    
    
    
    
    float f = length(to) / (100.0 + (1.0 - t) * 10.0);// ((0.6 + 0.3 * (.5 + .5 * cos(6.0 * atan(to.y, to.x)))) * hexRad);
    /*
    float restAngle = 2.0 / 3.0 * pi - angle;
    
    //sin rule:
    float maxLength = .5 * hexWidth * sin(pi / 3.0) / sin(restAngle);
    float f = length(to) / maxLength;
    * /
    
    f = clamp(f, 0.0, 1.0);
    return .5 + .5 * cos(f * pi);
    */
    
}

void main() {
    vec2 uv = vTextureCoord;
    vec2 xy = (uv - .5) * vec2(1024, 768);
    gl_FragColor = sampleHexValue(xy);
    
    /*
    float maxHeight = 50.0;
    float h1 = maxHeight * sampleHexHeight(xy);
    float h2 = maxHeight * sampleHexHeight(xy + vec2(1,0));
    float h3 = maxHeight * sampleHexHeight(xy + vec2(0,1));
    
    vec3 v1 = vec3(1, 0, h2 - h1);
    vec3 v2 = vec3(0, 1, h3 - h1);
    vec3 normal = normalize(cross(v1, v2));
    
    gl_FragColor = vec4(.5 + .5 * normal.x, .5 + .5 * normal.y, normal.z, 1);
    */
    
    /*
    float h = h1 / maxHeight;
    gl_FragColor = vec4(h,0,0,1);
    if(h > .49 && h < .51)
        gl_FragColor = vec4(1);
    */
    
}