// // ShaderMaterial을 사용할 때는 RawShaderMaterial과는 달리 uniform, attribute, precision이 내장되어 있음 이미
// // 3D 공간을 2D 공간으로 만들어 줌
// uniform mat4 projectionMatrix;
// // 카메라의 정보를 담음
// uniform mat4 viewMatrix;
// // mesh의 정보를 담음
// uniform mat4 modelMatrix;

uniform float uTime;

// uniform mat4 modelViewMatrix;

// WebGL 1 version
// geometry의 정점 정보
// attribute vec3 position;
// attribute vec2 uv;
// attribute float aRandomPosition;

// WebGL 2++ version
in float aRandomPosition;

// varying float vRandomPosition;
// varying vec2 vUv;

out float vRandomPosition;
out vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.x += aRandomPosition;
    // modelPosition.y += aRandomPosition;
    // modelPosition.z += aRandomPosition * uTime;

    // modelPosition.z += aRandomPosition / 20.0 * sin(uTime);
    // modelPosition.z += sin(uTime + modelPosition.x) / 2.0;

    vRandomPosition = (aRandomPosition + 1.0) / 2.0;
    vRandomPosition /= uTime * 0.3;

    vUv = uv;

    // 곱하는 순서가 달라지면 결과가 달라짐!
    gl_Position = projectionMatrix * viewMatrix * modelPosition;    

    // modelViewMatrix = viewMatrix * modelMatrix
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);    
}