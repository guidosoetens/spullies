precision lowp float;

//phaser variables:
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

//phaser base texture:
varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureIndex;
uniform sampler2D uSampler;

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

vec2 rotate2D(vec2 vec, float angle) {
    float cs = cos(angle);
    float sn = sin(angle);
    return vec2(cs * vec.x - sn * vec.y, sn * vec.x + cs * vec.y);
}

void main( void )
{
	float width = uResolution.x / 1500.0;
	vec2 uv = vTextureCoord * uScreenSize / uResolution;
	vec2 xy = uv - vec2(.5, .33333);
	xy.y *= 1.5; //stretch y to make top coordinate xy.y = 1 (compensate for centerpoint = .333)


	vec2 transUV;
	transUV.y = -(1. + 1. / (xy.y - 1.0)); //vertical asymptote at uv.y = 1
	transUV.x = xy.x / (1. - xy.y); //scale from 1 (at uv.y = 0, i.e. div one) to infinity (at uv.y = 1, i.e. div zero)
	transUV *= width;
	// transUV.y += 10. * uTimeParam;
	// transUV.x -= .5 * width;
	transUV = rotate2D(transUV, uPlayerAngle);
	// transUV.x += .5 * width;
	transUV += 10. * uPlayerPosition;
	// transUV *= uResolution.x / 1500.0;
	gl_FragColor = mix(texture2D(uTexture, fract(transUV)), vec4(.3, 1, .8, 1), pow(uv.y, 1.5));

	// vec2 coord = fract(transUV);
	// if(coord.x < .01 || coord.x > .99 || coord.y < .01 || coord.y > .99)
	// 	gl_FragColor = vec4(0,0,0,1);

	if(length(xy) < .01)
		gl_FragColor = vec4(0,0,0,1);
}

