precision mediump float;

/*
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
*/

//phaser variables:
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

//custom variables:
uniform float uWidth;
uniform vec2 uGlobalOrigin;
uniform vec3 uSourceColor;
uniform float uAlpha;

const float pi = 3.1415926535;

void main( void ) {
    
    //get tex coordinate in blob:
    vec2 uv = (gl_FragCoord.xy - uGlobalOrigin) / uWidth;
    uv.y = -uv.y;
    
    vec2 to = 2.0 * (uv - vec2(0.5, 0.5));
    float distance = dot(to, to);
    float alpha = 0.0;
    
    if(distance > 1.0)
        discard;
        
        
    float threshold = .9;
    if(distance > threshold) {
        alpha = 1.0 - (distance - threshold) / (1.0 - threshold);
    }
    else {
        float threshold = .8 + .2 * sin(fract(time / 3.0) * 2.0 * pi); 
        alpha = threshold + (1.0 - threshold) * distance / threshold;
    }
    
    
    vec3 normal = vec3(to.x, to.y, 1.0 - length(to));
    //float brightFactor = pow(.5 + .5 * dot(normal, normalize(vec3(1,-1,2))), 2.0);
   //vec3 color = (1.0 - brightFactor) * uSourceColor + brightFactor * vec3(1.0);
    
    
    float calcAlpha = uAlpha * alpha;
    //gl_FragColor = vec4(calcAlpha * color, calcAlpha);
    
    
    vec3 viewPos = vec3(0,0,10);
    vec3 lightDir = normalize(vec3(1,-1,2));
    float specularStrength = 0.5;
    vec3 pos3D = normal;
    vec3 lightColor = vec3(1,1,1);
    
    vec3 viewDir = normalize(viewPos - pos3D);
    vec3 reflectDir = reflect(-lightDir, normal);  
    
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = specularStrength * spec * lightColor; 
    
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;
    
    float ambientStrength = 0.5;
    vec3 ambient = ambientStrength * lightColor;
    
    vec3 result = (ambient + diffuse + specular) * uSourceColor;
    gl_FragColor = vec4(calcAlpha * clamp(result, 0.0, 1.0), calcAlpha);
        
        
        
        
        
    //gl_FragColor.b = uAlpha;
    
    
    
    /*
    float cols = 5.0;
    float size = cols / 2.0;
    bool xCheck = fract(uv.x * size) < .5;
    bool isCheck = xCheck ? fract(uv.y * size) < .5  : fract(uv.y * size) > .5;
    
    if(isCheck || uv.y < 0.0)
        gl_FragColor = vec4(1,1,1,1);
    else
        gl_FragColor = vec4(uSourceColor,1);
        */
        
        
        
    //gl_FragColor = vec4(uv.y,0,1,1);
    
    
    
    /*
    if(gl_FragCoord.y < 0.0)
        gl_FragColor = vec4(1,0,0,1);
    else
        gl_FragColor = vec4(uv,0,1);
    */
}