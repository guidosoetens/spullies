precision highp float;

//PIXI base texture:
varying vec2 vPosition;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

//custom variables:
uniform sampler2D uTexture;
// uniform vec2 uResolution;
uniform vec2 uTextureSize;
// uniform vec2 uCameraPosition;
// uniform vec2 uRelativeLightPos;



uniform mat3 uRotation;
uniform vec2 uOffset;

const float pi = 3.14159327;


void main( void )
{
    vec2 uv = 2.38 * vTextureCoord - 1.0;
    float d = length(uv);
    // gl_FragColor = vec4(fract(uv), 1, 1);
    // return;
    if(d > 1.0)
        discard;
    
    vec3 normal = vec3(uv, sqrt(1.0 - d * d));
    vec3 lightVec = normalize(vec3(1,-1,3));
    float b = .5 + .5 * dot(lightVec, normal);
    vec3 rot_normal = uRotation * normal;

    float tex_x = fract(.5 * atan(rot_normal.x, rot_normal.z) / pi);
    float tex_y = .5 - asin(rot_normal.y) / pi;
    vec2 tex_uv = vec2(tex_x, tex_y);

    gl_FragColor = texture2D(uTexture, tex_uv);
    gl_FragColor.rgb *= b * b;
    if(b > .9) {
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1), .5 * pow((b - .9) / .1, 2.0));
    }

    gl_FragColor.a *= smoothstep(0.0, 0.3, normal.z);
}

