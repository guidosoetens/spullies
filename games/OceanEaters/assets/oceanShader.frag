precision mediump float;

//phaser variables:
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

//phaser base texture:
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

//custom variables:
// uniform float uTimeParam;
// uniform sampler2D uTexture;


void main( void )
{
	gl_FragColor = vec4(0, 0, 1, 1);
}

