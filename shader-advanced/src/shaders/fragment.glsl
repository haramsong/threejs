// precision mediump float;

// 이 그림을 fragColor로 변환 시켜줘야 함 -> vUv 좌표 이용
uniform sampler2D uTexture;

// varying float vRandomPosition;
// varying vec2 vUv;

in float vRandomPosition;
in vec2 vUv;

out vec4 myFragColor;

// attribute : 정점 쉐이더에서만 사용 가능
// 따라서 vertexShader -> fragmentShader로 변수 넘길때는 varying을 써줘야 함!
// attribute float aRandomPosition;

void main() {
    vec4 tex = texture(uTexture, vUv);
    // gl_FragColor = vec4(vRandomPosition, vRandomPosition, 1.0, 1.0);
    // gl_FragColor = tex * vRandomPosition;
    myFragColor = tex * vRandomPosition;

}