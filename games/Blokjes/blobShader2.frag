precision mediump float;

//phaser variables:
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

//custom variables:
uniform float uWidth;
uniform vec2 uGlobalOrigin;
uniform vec3 uSourceColor;
uniform float uAlpha;
uniform int uCenterType;

const float pi = 3.1415926535;

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
	
	if(uCenterType < 0) {
		//block: do nothing?
	}
	else if(uCenterType == 0) {
		
		vec2 waveUV	= uv - .5;
		for(float i = 0.0; i < 2.0; i++) 
		{		
			waveUV.y += 0.8 * (0.15 * cos((waveUV.x * 5.0) + (i / 7.0) + (time * 1.5)));
			result += abs(1.0 / (100.0 * waveUV.y));
		}
	}
	else if(uCenterType == 1) {
		
		vec2 p = (uv - 0.5) * 6.;
		for (float i = 1.; i <= 11.; i++) {
			result += wave(p, time / i);
		}

		result = wrap(result);
	}
	
	return result;
}

void main( void )
{
	//get tex coordinate in blob:
    vec2 uv = (gl_FragCoord.xy - uGlobalOrigin) / uWidth;
    uv.y = -uv.y;
	
	vec2 to = 2.0 * uv - 1.0;
	float len = length(to);
	normalize(to);
	
	float bigFactor = sin(time);
	
	vec4 result = vec4(1);
	
	if(len < 1.0) {
		
		float offset = 0.15 + 0.05 * bigFactor;
		
		
		float rad = (1.0 + offset) * len;
		if(rad < 1.0) {
		
			float w = pow(rad,12.0 + bigFactor * 5.0) + getCenterValue(uv);
			vec3 color = (1.0 - w) * uSourceColor + w * vec3(1);
			result = vec4(color,1);
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

