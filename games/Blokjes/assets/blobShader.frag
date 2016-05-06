precision mediump float;

//phaser variables:
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

//phaser base texture:
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform sampler2D uNoiseTexture;
uniform sampler2D uDataTexture;

#define pi 3.1415926535;
#define time2 (time*0.15)
#define tau 6.2831853
#define texStep 0.001953125
//tex equals 0.5 / 256.0

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
    for(float i = 0.0; i < 2.0; i++) 
    {		
        waveUV.y += 0.8 * (0.15 * cos((waveUV.x * 5.0) + (i / 7.0) + (time * 1.5)));
        result += abs(1.0 / (15.0 * waveUV.y));
    }
        
	return result;
}

void main( void )
{
    vec4 texColor = texture2D(uSampler, vTextureCoord);
    vec2 uv = texColor.xy;
    
	float foo = texColor.z * 255.0;
	foo = foo - fract(foo);
	
	float yData = texColor.z;
    float alpha = texture2D(uDataTexture, vec2(texStep, yData)).x;
	vec3 srcColor =  .2 + .8 * texture2D(uDataTexture, vec2(3.0 * texStep, yData)).xyz;
	
	vec2 to = 2.0 * uv - 1.0;
	float len = length(to);
	normalize(to);
	
	float bigFactor = sin(time);
	
	vec4 result = vec4(1);
	float outAlpha = 1.0;
	
	if(len < 1.0) {
		
		float offset = 0.05 + 0.02 * bigFactor;
		float rad = (1.0 + offset) * len;
		if(rad > 1.0) {
			result.a = 1.0 - (rad - 1.0) / offset;
		}
		
		vec2 p = uv - .5;
		
		//noise:
		float rz = dualfbm((0.7 + 0.5 * sin(.1 * time)) * p);
		
		//circle:
		float brimStrength = 50.0;// 500.0;// 10.0 + 3.0 * sin(time);
		rz *= pow((1.0 - 2.0 * length(p)) * brimStrength, 0.8);

		//final color
		vec3 col = srcColor / rz * (1.0 + getCenterValue(uv));
		result.xyz = col;// pow(abs(col),vec3(.5));
	}
	else
		discard;
	
	result = clamp(result, 0.0, 1.0);
	float calcAlpha = result.a * alpha;// * texColor.a;
		
	gl_FragColor = vec4(calcAlpha * result.rgb, calcAlpha);
}

