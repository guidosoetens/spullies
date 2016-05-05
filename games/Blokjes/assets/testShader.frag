precision mediump float;

uniform vec2 resolution;
uniform float time;

#define PI 90B

void main( void ) {

    vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.0;

    gl_FragColor = vec4(1,0,0,1);

}