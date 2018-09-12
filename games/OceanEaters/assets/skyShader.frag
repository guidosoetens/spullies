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

uniform sampler2D uMountainsTexture;

//consants:
const float pi = 3.1415926535;

void main( void )
{
	float width = uResolution.x / 1500.0;
	vec2 uv = vTextureCoord * uScreenSize / uResolution;
    vec2 transUv = vec2(.5 * uv.x * uResolution.x / uResolution.y, 1. - uv.y);
    transUv.x -= 6. * uPlayerAngle / (2. * pi);
    gl_FragColor = texture2D(uTexture, fract(transUv));
    gl_FragColor = mix(gl_FragColor, vec4(.2,.6,1.,1), .3 + .7 * (1. - uv.y));

    if(transUv.y > .9) {
        vec2 mountainUv = vec2(3. * transUv.x, (transUv.y - .9) / .1);
        vec4 clr = texture2D(uMountainsTexture, fract(mountainUv));
        float fx = clr.a * clr.r;
        gl_FragColor.rgb *= 1. - fx * .7;
    }

    gl_FragColor = vec4(fract(transUv),0,1);
}

