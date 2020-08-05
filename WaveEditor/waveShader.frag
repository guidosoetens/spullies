precision highp float;

uniform vec3 uBackground;
uniform vec3 uForeground;

uniform vec2 uResolution;
uniform vec2 uBaseVector;
uniform vec2 uNormalVector;
uniform float uMaxLineDistance;
uniform float uMaxLineWidth;
uniform float uWaveScale;
uniform float uAmplitude;
uniform float uAnimParam;
uniform float uBaseShift;
uniform float uThicknessA;
uniform float uThicknessB;
uniform float uTaperFrac;
uniform float uRevealParameter;
uniform float uAlpha;

uniform int uFlipWaves;
uniform int uNumLines;
uniform int uAdditionalCornerCurves;
uniform int uPhaseShift;
uniform int uMirrorX;
uniform int uMirrorY;
uniform int uDuplicate;

varying vec2 vTexCoord;

#define MAX_THICKNESS max(uThicknessA, uThicknessB)

const float pi = 3.1415926535;


float getRevealOffset(float fracPos) {

    if(uRevealParameter == 0.0)
        return 0.0;

    fracPos = (fracPos + 1.0) / 2.0;

    float t = uRevealParameter;
    if(t < 0.0)
        t += 1.0;

    const float point_width = 0.2;
    float leftBound = t * (1.0 + point_width) - point_width;
    float rightBound = leftBound + point_width;

    float reduceFrac = clamp((fracPos - leftBound) / point_width, 0.0, 1.0);
    if(uRevealParameter > 0.0)
        reduceFrac = 1.0 - reduceFrac;
    return reduceFrac * MAX_THICKNESS;
}

float getWaveOffset(bool mirrorX, bool mirrorY, bool flipWaves, bool phaseShift) {
    vec2 uv = vTexCoord;
    if(mirrorX)
        uv.x = 1.0 - uv.x;
    if(mirrorY)
        uv.y = 1.0 - uv.y;
    uv *= uResolution;

    float waveOffset = 100.0;
    int totalLines = uNumLines + uAdditionalCornerCurves;
    float cornerFrac = float(uAdditionalCornerCurves) / float(totalLines);
    for(int i=0; i<150; ++i) {

        if(i >= totalLines)
            break;

        float t_total = float(i + 1) / float(totalLines);
        float tt = (t_total - cornerFrac) / (1.0 - cornerFrac);
        vec2 center = uBaseVector * tt * uMaxLineDistance;

        float t = float(i - uAdditionalCornerCurves + 1) / float(uNumLines);

        vec2 toPix = uv - center;
        float pix_x = uNormalVector.y * toPix.x - uNormalVector.x * toPix.y;
        float pix_y = uNormalVector.x * toPix.x + uNormalVector.y * toPix.y;

        if(flipWaves)
            pix_x = -pix_x;

        float baseShift = uBaseShift;
        if(t > 0.0)
            baseShift *= pow(1.0 - t, 1.5);

        float fracPos = pix_x / uMaxLineWidth;
        float loc_y = sin((-uAnimParam + uWaveScale * (baseShift + fracPos)) * 2.0 * pi) * uAmplitude;
        if(phaseShift)
            loc_y = -loc_y;

        float taperFrac = mix(1.0, uTaperFrac, 0.5 * (fracPos + 1.0));

        float half_thickness = .5 * mix(uThicknessA, uThicknessB, t) * taperFrac;

        float offset = getRevealOffset(fracPos) + abs(loc_y - pix_y) - half_thickness;

        waveOffset = min(waveOffset, offset);
    }

    return waveOffset;
}

void main() {
    bool mirrorX = uMirrorX > 0;
    bool mirrorY = uMirrorY > 0;
    bool phaseShift = uPhaseShift > 0;
    bool flipWaves = uFlipWaves > 0;

    float waveOffset = getWaveOffset(mirrorX, mirrorY, flipWaves, phaseShift);
    if(uDuplicate > 0)
        waveOffset = min(waveOffset, getWaveOffset(!mirrorX, !mirrorY, !flipWaves, !phaseShift));

    gl_FragColor = vec4(uBackground, uAlpha);
    if(waveOffset < 1.0)
        gl_FragColor = mix(vec4(uForeground,1), gl_FragColor, smoothstep(-1.0, 1.0, waveOffset));
}
