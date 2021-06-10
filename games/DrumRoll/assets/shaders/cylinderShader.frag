precision highp float;

//PIXI base texture:
varying vec2 vPosition;

varying vec2 vTextureCoord;
varying vec2 vFilterCoord;

uniform sampler2D uTexture;
uniform mat3 uRotation;
uniform vec2 uDepth;
uniform vec2 uCenter;

const float pi = 3.14159327;

void curveNormal(float param, float thickness, inout vec3 normal, inout float darken, vec3 outVec) {
    if(param < thickness) {
        float t = cos(param / thickness * .5 * pi);
        normal = normalize(mix(normal, -outVec, .5 * t));
        darken = max(darken, t);
    }
}

void main( void )
{
    vec2 uv = vTextureCoord * 2.53 - 1.0;
    float d = length(uv);
    if(d > 1.0)
        discard;

    // if(length(uv - uCenter) < .01) {
    //     gl_FragColor = vec4(1);
    //     return;
    // }

    // vec2 v = uv - uCenter;
    // float v_curr = length(v);
    // v = v / v_curr;
    // vec2 perp_v = normalize(vec2(-v.y, v.x));
    // float base_offset = dot(uCenter, perp_v);
    // vec2 q = perp_v * base_offset;
    // float circle_offset = sqrt(1.0 - min(base_offset * base_offset, 1.0));
    // vec2 proj_pt = q + circle_offset * v;
    // float v_total = length(proj_pt - uCenter);
    // d = v_curr / v_total;
    // uv = v * d;

    vec2 rot_uv = (uRotation * vec3(uv, 0)).xy;

    vec3 normal = normalize(vec3(normalize(-uv), 0.2));
    float angFrac = fract(.5 * atan(rot_uv.y, rot_uv.x) / pi);
    vec2 tileCoord = vec2(angFrac * 6.0, (pow(d, .1) - uDepth.x) * 20.0);
    vec2 tile_uv = fract(tileCoord);
    tileCoord = tileCoord - tile_uv;

    bool checkX = fract(tileCoord.x / 2.0) < .5;
    bool checkY = fract(tileCoord.y / 2.0) < .5;
    bool check = checkX ? checkY : !checkY;

    //distort normal:
    vec3 perp = cross(normal, vec3(0,0,1));
    float darken = 0.0;
    curveNormal(tile_uv.x, .02, normal, darken, perp);
    curveNormal(1.0 - tile_uv.x, .02, normal, darken, -perp);

    vec3 forward = cross(normal, perp);
    curveNormal(tile_uv.y, .01, normal, darken, forward);
    curveNormal(1.0 - tile_uv.y, .1, normal, darken, -forward);

    //base color:
    vec3 clr = check ? vec3(1,.3,.8) : vec3(.5,.3,1);
    clr *= (1.0 - .3 * darken);

    vec2 wood_uv = fract((tileCoord + tile_uv) / 4.0);
    if(check)
        wood_uv = vec2(wood_uv.y, wood_uv.x);

    float w = texture2D(uTexture, wood_uv).b;
    clr.rgb *= .5 + .5 * w;

    //apply lighting:
    vec3 lightVec = normalize(vec3(1,-1,.3));
    float b = .5 + .5 * dot(normal, lightVec);
    clr *= .5 + .5 * b;
    if(b > .9)
        clr = mix(clr, vec3(1), .5 * pow((b - .9) / .1, 5.0));

    clr *= pow(d, .7);


    clr = mix(clr, vec3(0), .5 * smoothstep(0.9, 1.0, d));
    gl_FragColor = vec4(clr, smoothstep(1.0, 0.98, d));
}

