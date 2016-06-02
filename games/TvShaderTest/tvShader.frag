precision mediump float;

//phaser variables:
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

//phaser base texture:
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform sampler2D uBackground;
uniform sampler2D uMenuTexture;
uniform sampler2D uTextTexture;

const float barrelPower = 10.5;

const float distortion = 0.4;
const float distortion2 = 0.8;
const float speed = 0.02;

const float nIntensity = 0.1;
const float sIntensity = 0.8;
const float sCount = 800.0; //4096

const float pi = 3.14159265359;

const int kernelSideWidth = 2;
const int kStart = -kernelSideWidth;
const int kEnd = kernelSideWidth + 1;
const int kMaxWeight = 1 + 2 * kernelSideWidth;

const vec3 TERM_ORANGE = vec3(1.0, 0.7, 0.4);    //ORANGE    (2.5)
const vec3 TERM_BLUE = vec3(0.3, 0.85, 1.0);   //BLUE
const vec3 TERM_GREEN = vec3(0.3, 1.0, 0.5);    //GREEN
const vec3 TERM_PINK = vec3(0.95, 0.8, 1.0);   //LIGHTPINK
const vec3 TERMINAL_COLOR = TERM_ORANGE;
		
// Start Ashima 2D Simplex Noise

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
    {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);

    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

/*
vec4 getTvColor(vec2 uv) {
    
    float ty = time*speed;
    float yt = uv.y - ty;
    //smooth distortion
    float offset = snoise(vec2(yt*3.0,0.0))*0.2;
    // boost distortion
    offset = offset*distortion * offset*distortion * offset;
    //add fine grain distortion
    offset += snoise(vec2(yt*50.0,0.0))*distortion2*0.001;
    //combine distortion on X with roll on Y
    return  texture2D(uBackground,  vec2(fract(uv.x + offset), uv.y));

}
*/

vec2 convertToJitterUv(vec2 uv) {
    
    float ty = time*speed;
    float yt = uv.y - ty;
    float offset = snoise(vec2(yt*3.0,0.0))*0.2;
    offset = offset*distortion * offset*distortion * offset;
    offset += snoise(vec2(yt*50.0,0.0))*distortion2*0.001;
    return vec2(fract(uv.x + offset), uv.y);
    
}

float sampleGuiBrightness(vec2 uv) {
    
    vec2 step = vec2(0.5 / resolution.x, 0.5 / resolution.y);
    
    float sumVal = 0.0;
    float sumWeight = 0.0;
    
    for(int i=kStart; i<kEnd; ++i) {
        
        for(int j=kStart; j<kEnd; ++j) {
            
            vec2 sUv = uv + vec2(j, i) * step;
            float b = max(texture2D(uMenuTexture,  sUv).x, texture2D(uTextTexture,  sUv).x);
            int weight = kMaxWeight;
            weight -= (i < 0) ? -i : i;
            weight -= (j < 0) ? -j : j;
            //weight = weight * weight * weight;
            
            if(i == 0 && j == 0)
                weight *= 10;
            
            
            sumVal += b * float(weight);
            sumWeight += float(weight);
        }
    }
    
    return sumVal / sumWeight;
}

vec4 scanlineEffect(vec2 vUv) {
    
    vec4 clr = texture2D(uBackground, vUv);
    
    
            // make some noise
			float x = vUv.x * vUv.y * time *  1000.0;
			x = mod( x, 13.0 ) * mod( x, 123.0 );
			float dx = mod( x, 0.01 );

			// add noise
			vec3 cResult = clr.rgb + clr.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );

			// get us a sine and cosine
			vec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );

			// add scanlines
			cResult += clr.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;

			// interpolate between source and result by intensity
			cResult = clr.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - clr.rgb );

            /*
            vec3 termColor = vec3(0.7, 0.95, 1.0);
            termColor = vec3(1.0, 0.7, 0.4);    //ORANGE    (2.5)
            //termColor = vec3(0.3, 0.85, 1.0);   //BLUE
            //termColor = vec3(0.3, 1.0, 0.5);    //GREEN
            //termColor = vec3(0.95, 0.8, 1.0);   //LIGHTPINK
            */
            
            float gray = cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11;
            gray = .3 + .6 * gray;
            cResult = .3 * gray * TERMINAL_COLOR + .15 * cResult;// vec3( cResult.r * 0.3 + cResult.g * 0.6 + cResult.b * 0.3 );
            
            vec2 hudUv = vUv;
            float timeFrac = fract(time / 10.0);
            if(timeFrac < 0.05) 
                hudUv += vec2(.5 - .5 * cos(pi * timeFrac / 0.05), 0.0);
            hudUv.x = fract(hudUv.x);
            
            float backB = sampleGuiBrightness(vec2(.5) + 1.075 * (hudUv - vec2(.5)));
            float b = .1 * backB + sampleGuiBrightness(hudUv);// max(texture2D(uMenuTexture,  hudUv).x, texture2D(uTextTexture,  hudUv).x);
            b = 2.0 * clamp(b * (.6 + .4 * sc.y * sc.x), 0.0, 1.0);
            cResult = b * TERMINAL_COLOR + (1.0-b) * cResult;

			return  vec4( cResult, clr.a );
}




// Given a vec2 in [-1,+1], generate a texture coord in [0,+1]
vec2 Distort(vec2 p)
{
    float theta  = atan(p.y, p.x);
    float radius = length(p);
    radius = pow(radius, barrelPower);
    p.x = radius * cos(theta);
    p.y = radius * sin(theta);
    return p;
}

void main( void )
{
    vec2 uv = vec2(vTextureCoord.x, 1.0 - vTextureCoord.y);
    vec2 xy = (2.0 * uv - 1.0);
    
    float zoom = 1.0;//mouse.y / 200.0;//resolution.x;
    
    float ratio = resolution.x / resolution.y;
    vec2 tex = xy;
    float k = zoom * 0.01;//distortion;
    float kcube = zoom * 0.25;//cubicDistortion;
    float r2 = ratio * ratio * (tex.x) * (tex.x) + (tex.y) * (tex.y);
    float f = 1.0 + r2 * (k + kcube * sqrt(r2));
    
    uv = f * (tex.xy * 0.5) + 0.5;
    
    xy = (2.0 * uv - 1.0);
    float distance = length(xy);
    float maxDist = distance / max(abs(xy.x), abs(xy.y));
    float offset = abs(maxDist - distance);
    
    if(uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) 
        gl_FragColor = vec4(0, 0, 0, 1);
    else {
        
        vec2 jUv = convertToJitterUv(uv);
        //vec4 tvClr = getTvColor(uv);
        gl_FragColor = scanlineEffect(jUv);
        
        if(offset < .02) {
            float b = 1.0 - offset / .02;
            gl_FragColor.xyz = b * vec3(0.0) + (1.0 - b) * gl_FragColor.xyz;
        }
    }
}