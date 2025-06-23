precision mediump float;
varying vec2 vPosition;
void main() {
    mediump vec2 color = vPosition * 0.5 + 0.5;
    gl_FragColor = vec4(color, 0.0, 1.0);
}