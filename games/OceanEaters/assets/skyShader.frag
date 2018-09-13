precision lowp float;

varying vec2 vFilterCoord;
varying vec2 vTextureCoord;

// uniform sampler2D uSampler;

//custom variables:
uniform float uTimeParam;
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uScreenSize;

uniform vec2 uPlayerPosition;
uniform vec2 uPlayerDirection;
uniform float uPlayerAngle;

uniform sampler2D uMountainsTexture;

//consants:s
const float pi = 3.1415926535;

void main( void )
{
	// float width = uResolution.x / 1500.0;
	// vec2 uv = vTextureCoord * uScreenSize / uResolution;
    vec2 uv = vTextureCoord;// / uResolution;// / vec2(800.0 / 1024.0, 300.0  / 512.0);// mapCoord(vTextureCoord);// / dimensions.xy;// * uScreenSize / uResolution;
	uv.x *= 1.27;
	uv.y *= 1.66;
    vec2 transUv = vec2(uv.x, uv.y);// vec2(.5 * uv.x * uResolution.x / uResolution.y, uv.y);
    transUv.x -= 6. * uPlayerAngle / (2. * pi);
    gl_FragColor = texture2D(uTexture, fract(transUv));
    gl_FragColor = mix(gl_FragColor, vec4(.2,.6,1.,1), .3 + .7 *  uv.y);

    if(transUv.y > .9) {
        vec2 mountainUv = vec2(3. * transUv.x, (transUv.y - .9) / .1);
        vec4 clr = texture2D(uMountainsTexture, fract(mountainUv));
        float fx = clr.a * clr.r;
        gl_FragColor.rgb *= 1. - fx * .7;
    }

    if(transUv.y > 1.0) {
        gl_FragColor.rgb = vec3(0,transUv.x,1);
    }
}

