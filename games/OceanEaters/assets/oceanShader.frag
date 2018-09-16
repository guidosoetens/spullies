precision highp float;

//phaser variables:
// uniform float time;
// uniform vec2 resolution;
// uniform vec2 mouse;


//phaser base texture:
varying vec2 vFilterCoord;
varying vec2 vTextureCoord;

//custom variables:
uniform float uTimeParam;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uScreenSize;

uniform vec2 uPlayerPosition;
uniform vec2 uPlayerDirection;
uniform float uPlayerAngle;

//consants:
const float pi = 3.1415926535;

const float plane_scale = 0.025;
const float tex_reps = 15.0;

vec2 rotate2D(vec2 vec, float angle) {
    float cs = cos(angle);
    float sn = sin(angle);
    return vec2(cs * vec.x - sn * vec.y, sn * vec.x + cs * vec.y);
}

void main( void )
{
	// float width = uResolution.x / 1500.0;
	vec2 uv = vTextureCoord;// / uResolution;// / vec2(800.0 / 1024.0, 300.0  / 512.0);// mapCoord(vTextureCoord);// / dimensions.xy;// * uScreenSize / uResolution;
	uv.x *= 1.27;
	uv.y *= 1.685;
	uv.y = 1. - uv.y;

	vec2 xy = uv - vec2(.5, .33333);
	xy.y *= 1.5; //stretch y to make top coordinate xy.y = 1 (compensate for centerpoint = .333)

	vec2 transUV = xy;
	transUV.y = -(1. + 1. / (xy.y - 1.0)); //vertical asymptote at uv.y = 1
	transUV.x = xy.x / (1. - xy.y); //scale from 1 (at uv.y = 0, i.e. div one) to infinity (at uv.y = 1, i.e. div zero)
	transUV *= plane_scale;

	transUV = rotate2D(transUV, uPlayerAngle);
	transUV += uPlayerPosition;
	transUV = tex_reps * vec2(transUV.y, transUV.x);
	gl_FragColor = mix(texture2D(uTexture, fract(transUV)), vec4(.3, 1, .8, 1), pow(uv.y, 1.5));
}

