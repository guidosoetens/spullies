precision mediump float;

//phaser variables:
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

//phaser base texture:
varying vec2 vTextureCoord;
uniform sampler2D uSampler; //the motion image is stored in uSampler...

uniform vec2 uResolution;
uniform sampler2D uPreviousFrame;

#define KERNEL_FROM -3
#define KERNEL_TO 4

void renderCircle(vec2 uv){
    vec2 to = 2.0 * (uv - vec2(.5));
    float len = length(to);
    if(len < 1.0 && len > 0.8) {
        gl_FragColor = vec4(1.0, .5 * to.x + 0.5, 0.5 * to.y + 0.5, 1);
    }
}

void main( void )
{
    float motionPt = texture2D(uSampler, vTextureCoord).r;
    vec3 prevValue = texture2D(uPreviousFrame, vTextureCoord).xyz;
    
    //float val = max(motionPt, prevValue.x *.95);
    
    float val = texture2D(uSampler, vTextureCoord + vec2(1.0 / uResolution.x, 0)).r;
    float dx = texture2D(uSampler, vTextureCoord + vec2(1.0 / uResolution.x, 0)).r;
    float dy = texture2D(uSampler, vTextureCoord + vec2(0, 1.0 / uResolution.x)).r;
    
    
    
    
    gl_FragColor = vec4(val, 0, 0, 1);
    
    float circleHeight = .15 * uResolution.x / uResolution.y;
    if(vTextureCoord.x > .05 && vTextureCoord.x < .2 && vTextureCoord.y < .95 && vTextureCoord.y > .95 - circleHeight)
        renderCircle((vTextureCoord - vec2(.05, .95 - circleHeight)) * vec2(1.0 / 0.15, 1.0 / circleHeight));
    
    
    /*
    float prev = texture2D(uPreviousFrame, vTextureCoord).r;
    
    //apply kernel:
    vec2 sumTo = 
    for(int i=KERNEL_FROM; i<KERNEL_TO; ++i) {
        for(int j=KERNEL_FROM; j<KERNEL_TO; ++j) {
            
            vec2 uv = vTextureCoord + vec2(j / resolution.x, i / resolution.y);
            vec3 clr = texture2D(uPreviousFrame, uv).xyz;
            
            
            
            
            
            vec2 n = vec2(2.0 * clr.x - 1.0, 2.0 * clr.y - 1.0);
            sumNormal += n;
        }
    }
    
    
    
    float curr = texture2D(uSampler, vTextureCoord).r;
    float v = max(curr, prev);
    
    vec2 normal = vec2(.5, .5);
    
    gl_FragColor = vec4(.5 + .5 * normal.x, .5 + .5 * normal.y, curr, 1);
    */
}