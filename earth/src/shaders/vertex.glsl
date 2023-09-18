varying vec2 vPosition;
varying vec2 vUv;

void main() {
    // 3D 이미지를 어디까지나 2D이미지로 랜더링 하기때문에 z좌표값 0.0!
    gl_Position = vec4(position.x, position.y, 0.0, 1.0);
    vPosition = position.xy;
    vUv = uv;
}