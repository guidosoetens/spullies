precision mediump float;

//phaser variables:
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

//custom variables:
uniform float uWidth;
//uniform vec2 uGlobalOrigin;
uniform vec3 uSourceColor;
uniform float uAlpha;
uniform int uCenterType;

uniform sampler2D uSourceTexture;
uniform sampler2D uNoiseTexture;

#define pi 3.1415926535;
#define time2 (time*0.15)
#define tau 6.2831853

mat2 makem2(in float theta){float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);}
float noise( in vec2 x ){return texture2D(uNoiseTexture, x*.01).x;}

float fbm(in vec2 p)
{	
	float z=2.;
	float rz = 0.;
	vec2 bp = p;
	for (float i= 1.;i < 6.;i++)
	{
		rz+= abs((noise(p)-0.5)*2.)/z;
		z = z*2.;
		p = p*2.;
	}
	return rz;
}

float dualfbm(in vec2 p)
{
    //get two rotated fbm calls and displace the domain
	vec2 p2 = p*.7;
	vec2 basis = vec2(fbm(p2-time2*1.6),fbm(p2+time2*1.7));
	basis = (basis-.5)*.2;
	p += basis;
	
	//coloring
	return fbm(p*makem2(time2*0.2));
}

float circ(vec2 p) 
{
	float r = length(p);
	r = log(sqrt(r));
	return abs(mod(r*4.,tau)-3.14)*3.+.2;

}

//...

//////////////////////////////////////////////////////////////
// Main
//////////////////////////////////////////////////////////////

float wave(vec2 p, float angle) {
  vec2 direction = vec2(cos(angle), sin(angle));
  return cos(dot(p, direction));
}

float wrap(float x) {
  return abs(mod(x, 2.)-1.);
}

float getCenterValue(vec2 uv) {
	
	float result = 0.0;
	
    vec2 waveUV	= uv - .5;
    //float its = float(uCenterType);
    for(float i = 0.0; i < 2.0; i++) 
    {		
        waveUV.y += 0.8 * (0.15 * cos((waveUV.x * 5.0) + (i / 7.0) + (time * 1.5)));
        result += abs(1.0 / (15.0 * waveUV.y));
    }
        
	return result;
}

void main( void )
{
	//get tex coordinate in blob:
    
    /*
    vec2 uv = (gl_FragCoord.xy - uGlobalOrigin) / uWidth;
    uv.y = -uv.y;
    */
    
    vec4 srcSample = texture2D(uNoiseTexture, gl_FragCoord.xy);
    vec2 uv = srcSample.xy;
    
    if(uv.x < .01 && uv.y < .01)
        discard;
	
	vec2 to = 2.0 * uv - 1.0;
	float len = length(to);
	normalize(to);
	
	float bigFactor = sin(time);
	
	vec4 result = vec4(1);
	
	if(len < 1.0) {
		
		float offset = 0.15 + 0.05 * bigFactor;
		
		
		float rad = (1.0 + offset) * len;
		if(rad < 1.0) {
            
            vec2 p = uv - .5;
            
            vec3 srcColor = uSourceColor * .5 + .1;
            
            //noise:
            float rz = dualfbm((0.7 + 0.5 * sin(.1 * time)) * p);
            
            //circle:
            float brimStrength = 20.0;
            rz *= pow((1.0 - 2.0 * length(p)) * brimStrength, .9);

            //final color
            vec3 col = srcColor / rz * (1.0 + getCenterValue(uv));
            col=pow(abs(col),vec3(.99));
            
			result = vec4(col,1.);// getCenterValue(uv - .5);
		}
		else {
			float factor = 1.0 - (rad - 1.0) / offset;
			vec3 clr = (1.0 - factor) * uSourceColor + factor * vec3(1.0);
			result = vec4(clr,factor);
		}
	}
	else
		discard;
	
	result = clamp(result, 0.0, 1.0);
	float calcAlpha = result.a * uAlpha;
		
	gl_FragColor = vec4(calcAlpha * result.rgb, calcAlpha);
}

