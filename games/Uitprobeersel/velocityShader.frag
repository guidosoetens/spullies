precision mediump float;

/*
//phaser variables:
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
*/

//phaser base texture:
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main( void )
{
    vec4 texColor = texture2D(uSampler, vTextureCoord);
    gl_FragColor = vec4(texColor.x, vTextureCoord.x, vTextureCoord.y, 1.0);
}