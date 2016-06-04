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

void main() {
    vec2 xy = 2.0 * (vTextureCoord - .5);
    
    float t = fract(time / 5.0);
    
    float dist = length(xy);
    vec4 c = (1.0 + .3 * (1.0 - dist)) * BASE_COLOR;
    
    if(length(xy) < .2 * (1.0 + sin(t * 2.0 * pi)) / 4.0)
        gl_FragColor = vec4(1);
    else
        gl_FragColor = c;
}