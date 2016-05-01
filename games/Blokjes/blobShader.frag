precision mediump float;

//uniform vec4 color;

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;
uniform float yoloSwaggeriez;

void main( void ) {
    
    //hier staat peop
    
    float r = fract(time);
    

    gl_FragColor = vec4(mouse.y,mouse.x,yoloSwaggeriez,1);
    //vec2 uv = gl_TexCoord.xy;
    
    //gl_FragColor = vec4(uv.x,uv.y,1,1);// color;
}