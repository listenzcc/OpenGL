precision mediump float;
attribute vec2 aPosition;
varying vec2 vPosition;
void main() {
    vPosition = aPosition;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}