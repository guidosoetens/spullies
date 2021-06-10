precision highp float;

//PIXI base texture:
varying vec2 vPosition;

//custom variables:
uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec2 uCameraPosition;
uniform vec2 uRelativeLightPos;

void main( void )
{
    vec2 xy = vPosition - uCameraPosition;
    vec2 uv = mod(xy / uTextureSize, 1.0);
    //vec2 uv = vec2(1.59, 1.325) * vTextureCoord - uCameraPosition;
    //gl_FragColor = texture2D(uTexture, mod(uv * vec2(6., 4.), 1.0));

    // gl_FragColor.rgb *= .7;

    uv = mod(xy / uTextureSize, 1.0);

    gl_FragColor = texture2D(uTexture, uv);
    gl_FragColor.rgb *= .7;

    float dist = length((uRelativeLightPos- vPosition / uResolution) *  (uResolution.xy / uResolution.xx) );
    gl_FragColor.r *= clamp(1.0 - dist * 3.0, 0., 1.);

}

