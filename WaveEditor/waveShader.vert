precision highp float;

attribute vec2 a_position;

varying vec2 vTexCoord;

void main() {
    gl_Position = vec4(a_position, 0, 1);
    vTexCoord = (a_position + 1.0) / 2.0;
    vTexCoord.y = 1.0 - vTexCoord.y;
}