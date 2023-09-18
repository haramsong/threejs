uniform float uBrightness;
uniform vec2 uPosition;
uniform vec3 uColor;
uniform float uAlpha;
uniform sampler2D tDiffuse;

varying vec2 vPosition;
varying vec2 vUv;

void main() {
    // vec2 newUV = vec2(vUv.x, vUv.y);

    // 왼쪽으로 이동하는것 처럼 보이고 그 초과한 부분은 왜곡 현상 일어남 -> 디스토션 현상
    vec2 newUV = vec2(vUv.x + uPosition.x, vUv.y + uPosition.y);

    // 파동 형태 효과(사인 함수 사용)
    // vec2 newUV = vec2(vUv.x, vUv.y + sin(vUv.x * 20.0) * 0.1 + uPosition.y);
    // vec2 newUV = vec2(vUv.x, vUv.y + sin(vUv.x * 20.0) * 0.1 + uPosition.y);

    vec4 tex = texture2D(tDiffuse, newUV);
    // 값이 커질수록 붉게?되고 작아질수록 푸르게 변함
    // tex.r -= 0.1;

    // tex.rg += vUv;
    tex.rgb += uColor;

    float brightness = sin(uBrightness + vUv.x);

    gl_FragColor = tex / brightness;
}