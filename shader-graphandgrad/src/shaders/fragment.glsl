precision mediump float;

varying vec2 vUv;

float smoothy(float edge0, float edge1, float x) {
    float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    
    float strength = t * t * (3.0 - 2.0 * t);
    
    return t;
}

void main()
{
    // 1. 그라데이션
    // float x = vUv.x;
    // float y = vUv.y;

    // float col = x;
    // // float col = 1.0 - y;
    
    // gl_FragColor = vec4(col, col, col, 1.0);


    // 2. 대각선 만들기
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(x);
    // vec3 green = vec3(0.0, 1.0, 0.0);

    // if (y <= x + 0.005 && y + 0.005 >= x) {
    //     col = green;
    // }
    
    // gl_FragColor = vec4(col, 1.0);


    // 3. 곡선 만들기
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(x);
    // vec3 green = vec3(0.0, 1.0, 0.0);

    // if (y <= x * x && y + 0.005 >= x * x) {
    //     col = green;
    // }
    
    // gl_FragColor = vec4(col, 1.0);


    // 4. 곡선 만들기 + 그라데이션
    // float x = vUv.x / 2.0;
    // float y = vUv.y;

    // vec3 col = vec3(x * x);
    // vec3 green = vec3(0.0, 1.0, 0.0);

    // if (y <= x * x && y + 0.005 >= x * x) {
    //     col = green;
    // }
    
    // gl_FragColor = vec4(col, 1.0);


    // 5. step
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 green = vec3(0.0, 1.0, 0.0);
    
    // float strength = step(0.5, x);
    // if (strength == 0.0) {
    //     discard;
    // }
    // vec3 col = vec3(strength);
    // // ==
    // // if (x <= 0.5) {
    // //     col = vec3(0.0);
    // // } else {
    // //     col = vec3(1.0);
    // // }

    // gl_FragColor = vec4(col, 1.0);


    // 6. min, max
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 green = vec3(0.0, 1.0, 0.0);
    
    // // float strength = min(0.5, x);
    // float strength = max(0.5, x);

    // vec3 col = vec3(strength);

    // gl_FragColor = vec4(col, 1.0);


    // 7. clamp
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 green = vec3(0.0, 1.0, 0.0);
    
    // float strength = clamp(x, 0.3, 0.7);

    // vec3 col = vec3(strength);

    // gl_FragColor = vec4(col, 1.0);


    // 8. smoothy
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 green = vec3(0.0, 1.0, 0.0);
    
    // float strength = smoothstep(0.3, 0.7, x);
    // // ==
    // // float strength = smoothy(0.3, 0.7, x);
    // // 이미 내장되어 있음!

    // vec3 col = vec3(strength);


    // gl_FragColor = vec4(col, 1.0);


    // 9. mix
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 green = vec3(0.0, 1.0, 0.0);
    // vec3 blue = vec3(0.0, 0.0, 1.0);

    // // 첫째 색깔, 둘쨰 색깔, 섞임 정도
    // vec3 col = mix(green, blue, x);

    // gl_FragColor = vec4(col, 1.0);


    // 10. pow
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(x);
    // vec3 green = vec3(0.0, 1.0, 0.0);

    // if (y <= sqrt(x) && y + 0.005 >= sqrt(x)) {
    // // if (y <= pow(x, 2.0) && y + 0.005 >= pow(x, 2.0)) {
    //     col = green;
    // }
    
    // gl_FragColor = vec4(col, 1.0);


    // 12. mod
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(mod(x * 7.0, 1.0));
    // col = step(0.5, col);

    // vec3 green = vec3(0.0, 1.0, 0.0);
    
    // gl_FragColor = vec4(col, 1.0);


    // 13. fract
    // == mod(x, 1.0)
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(fract((y - 0.11) * 7.0));
    // vec3 col2 = vec3(fract((x - 0.11) * 7.0));

    // col = 1.0 - step(0.5, col) * step(0.5, col2);

    // vec3 green = vec3(0.0, 1.0, 0.0);
    
    // gl_FragColor = vec4(col, 1.0);


    // 14. sin, cos
    // float x = vUv.x;
    // float y = vUv.y;

    // // vec3 col = vec3(sin(x * 20.0));
    // vec3 col = vec3(cos(x * 20.0));

    // vec3 green = vec3(0.0, 1.0, 0.0);

    // gl_FragColor = vec4(col, 1.0);


    // 15. abs
    // float x = vUv.x;
    // float y = vUv.y;

    // vec3 col = vec3(abs(cos(x * 20.0)));

    // vec3 green = vec3(0.0, 1.0, 0.0);

    // gl_FragColor = vec4(col, 1.0);


    // 16. distance
    // float x = vUv.x;
    // float y = vUv.y;

    // // float dist = distance(x, 0.5);
    // float dist = distance(vec2(x, y), vec2(0.5));
    // dist = step(0.3, dist);

    // vec3 col = vec3(dist);

    // vec3 green = vec3(0.0, 1.0, 0.0);

    // gl_FragColor = vec4(col, 1.0);


    // 17. length
    // == distance(x, 정점)
    float x = vUv.x;
    float y = vUv.y;

    // float dist = distance(x, 0.5);
    float dist = length(vec2(x, y) - 0.5);
    dist = step(0.3, dist);

    vec3 col = vec3(dist);

    vec3 green = vec3(0.0, 1.0, 0.0);

    gl_FragColor = vec4(col, 1.0);
}