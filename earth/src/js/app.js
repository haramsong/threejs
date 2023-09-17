import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { convertLatLngToPos, getGradientCanvas } from './utils';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';
import { HalftonePass } from 'three/examples/jsm/postprocessing/HalftonePass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import dat from 'dat.gui';

export default function () {
    const canvasSize = {
        width: window.innerWidth,
        height: window.innerHeight,
    }

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
    });
    renderer.outputEncoding = THREE.sRGBEncoding;
    const renderTarget = new THREE.WebGLRenderTarget(
        canvasSize.width,
        canvasSize.height,
        {
            samples: 2
        }
    )

    const effectComposer = new EffectComposer(renderer, renderTarget);
    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader().setPath('assets/environments/');
    const environmentMap = cubeTextureLoader.load([
        'px.png',
        'nx.png',
        'py.png',
        'ny.png',
        'pz.png',
        'nz.png',
    ]);

    environmentMap.encoding = THREE.sRGBEncoding;

    const container = document.querySelector('#container');

    container.appendChild(renderer.domElement);

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.background = environmentMap;
    scene.environment = environmentMap;

    const camera = new THREE.PerspectiveCamera(
        75, //시야각
        canvasSize.width / canvasSize.height, // 종횡비
        0.1, // scene과 카메라와의 최소 거리. 이 거리보다 가까워지면 물체가 안보임
        100, // scene과 카메라와의 최대 거리. 이 거리보다 멀어지면 물체가 안보임
    );

    camera.position.set(0, 0, 3);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const gui = new dat.GUI();

    const addLight = () => {
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(2.65, 2.13, 1.02);

        scene.add(light);
    }

    const addPostEffects = (obj) => {
        const { earthGroup } = obj;

        const renderPass = new RenderPass(scene, camera);
        effectComposer.addPass(renderPass);

        // 옛날 영화 효과
        const filmPass = new FilmPass(
            1, true,
        );

        // deprecated? 속성이 강좌랑 다름
        // filmPass.uniforms.nIntensity.value = 1;
        // filmPass.uniforms.sIntensity.value = 0.7;
        // filmPass.uniforms.sCount.value = 1000;

        // 이건 됨
        // filmPass.uniforms.grayscale.value = true;

        // effectComposer.addPass(filmPass);

        const shaderPass = new ShaderPass(GammaCorrectionShader);

        const customShaderPass = new ShaderPass({
            uniforms: {
                uBrightness: { value : 1 },
                uPosition: { value: new THREE.Vector2(0, 0)},
                uColor: { value: new THREE.Vector3(0, 0, 0.3) },
                uAlpha: { value: 0.5 },
                tDiffuse: { value: null },
            },
            vertexShader: `
                varying vec2 vPosition;
                varying vec2 vUv;

                void main() {
                    // 3D 이미지를 어디까지나 2D이미지로 랜더링 하기때문에 z좌표값 0.0!
                    gl_Position = vec4(position.x, position.y, 0.0, 1.0);
                    vPosition = position.xy;
                    vUv = uv;
                }
            `,
            fragmentShader: `
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
            `,
        });
        gui.add(customShaderPass.uniforms.uColor.value, 'x', -1, 1, 0.01);
        gui.add(customShaderPass.uniforms.uColor.value, 'y', -1, 1, 0.01);
        gui.add(customShaderPass.uniforms.uColor.value, 'z', -1, 1, 0.01);

        gui.add(customShaderPass.uniforms.uPosition.value, 'x', -1, 1, 0.01);
        gui.add(customShaderPass.uniforms.uPosition.value, 'y', -1, 1, 0.01);
        gui
            .add(customShaderPass.uniforms.uBrightness, 'value', 0, 1, 0.01)
            .name('brightness');

        effectComposer.addPass(customShaderPass);

        // 글리치 효과
        const glitchPass = new GlitchPass();
        // effectComposer.addPass(glitchPass);

        // ㅋㅋㅋㅋㅋㅋㅋ
        // glitchPass.goWild = true;

        // 잔상 효과
        const afterimagePass = new AfterimagePass(0.96);
        // effectComposer.addPass(afterimagePass);

        // effectComposer.addPass(shaderPass);

        // 팝아트? 효과
        const halftonePass = new HalftonePass(
            canvasSize.width,
            canvasSize.height,
            {
                radius: 5,
                shape: 1,
                scatter: 0,
                blending: 1,
            }
        );
        // effectComposer.addPass(halftonePass);

        const unrealBloomPass = new UnrealBloomPass(
            new THREE.Vector2(canvasSize.width, canvasSize.height),
        );
        // unrealBloomPass.strength = 1.2;
        // unrealBloomPass.threshold = 0.2;
        // unrealBloomPass.radius = 1;
        // effectComposer.addPass(unrealBloomPass);

        effectComposer.addPass(shaderPass);
        
        // 테두리 효과(선택 효과 같은 것)
        const outlinePass = new OutlinePass(
            new THREE.Vector2(canvasSize.width, canvasSize.height),
            scene,
            camera
        );
        outlinePass.selectedObjects = [...earthGroup.children];
        outlinePass.edgeStrength = 5;
        outlinePass.edgeGlow = 5;
        outlinePass.pulsePeriod = 1;

        // effectComposer.addPass(outlinePass);

        const smaaPass = new SMAAPass();
        effectComposer.addPass(smaaPass);

    }

    const createEarth1 = () => {
        const geometry = new THREE.SphereGeometry(1.3, 30, 30);
        const material = new THREE.MeshStandardMaterial({
            map: textureLoader.load('assets/earth-night-map.jpg'),
            side: THREE.FrontSide,
            opacity: 0.6,
            transparent: true,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.y = -Math.PI / 2;

        scene.add(mesh);

        return mesh;
    }

    const createEarth2 = () => {
        const geometry = new THREE.SphereGeometry(1.5, 30, 30);
        const material = new THREE.MeshStandardMaterial({
            map: textureLoader.load('assets/earth-night-map.jpg'),
            opacity: 0.9,
            transparent: true,
            side: THREE.BackSide,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.y = -Math.PI / 2;

        scene.add(mesh);

        return mesh;
    }

    const createStar = (count = 500) => {
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i] = (Math.random() - 0.5) * 5;
            positions[i + 2] = (Math.random() - 0.5) * 5;
            positions[i + 1] = (Math.random() - 0.5) * 5;

        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3),
        );

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            transparent: true,
            depthWrite: false,
            map: textureLoader.load('assets/particle.png'),
            alphaMap: textureLoader.load('assets/particle.png'),
            color: 0xbcc6c6,
        });

        const star = new THREE.Points(particleGeometry, particleMaterial);

        return star;
    }

    const createPoint1 = () => {
        const point = {
            lat: 37.56668 * (Math.PI / 180),
            lng: 126.97841 * (Math.PI / 180),
        }
        

        const position = convertLatLngToPos(point, 1.3);

        const mesh = new THREE.Mesh(
            new THREE.TorusGeometry(0.02, 0.002, 20, 20),
            new THREE.MeshBasicMaterial({ color: 0x263d64 })
        );

        mesh.position.set(position.x, position.y, position.z);
        mesh.rotation.set(0.9, 2.46, 1);

        return mesh;
    }

    const createPoint2 = () => {
        const point = {
            lat: 5.55363 * (Math.PI / 180),
            lng: -0.196481 * (Math.PI / 180),
        }
        

        const position = convertLatLngToPos(point, 1.3);

        const mesh = new THREE.Mesh(
            new THREE.TorusGeometry(0.02, 0.002, 20, 20),
            new THREE.MeshBasicMaterial({ color: 0x263d64 })
        );

        mesh.position.set(position.x, position.y, position.z);

        return mesh;
    }

    const createCurve = (pos1, pos2) => {
        const points = [];

        for (let i = 0; i <= 1000; i++) {
            const pos = new THREE.Vector3().lerpVectors(pos1, pos2, i / 1000);
            pos.normalize();

            const wave = Math.sin((Math.PI * i) / 1000);

            pos.multiplyScalar(1.3 + 0.4 * wave);

            points.push(pos);
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(
            curve,
            20,
            0.003,
        )
        const gradientCanvas = getGradientCanvas('#757F94', '#263D74');
        const texture = new THREE.CanvasTexture(gradientCanvas);
        const material = new THREE.MeshBasicMaterial({ map: texture });

        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }

    const create = () => {
        const earthGroup = new THREE.Group();

        const earth1 = createEarth1();
        const earth2 = createEarth2();
        const star = createStar();
        const point1 = createPoint1();
        const point2 = createPoint2();
        const curve = createCurve(point1.position, point2.position);

        earthGroup.add(earth1, earth2, point1, point2, curve)

        scene.add(earthGroup, star);

        return {
            earthGroup,
            star
        }
    }

    const resize = () => {
        canvasSize.width = window.innerWidth;
        canvasSize.height = window.innerHeight;

        camera.aspect = canvasSize.width / canvasSize.height;
        camera.updateProjectionMatrix();

        renderer.setSize(canvasSize.width, canvasSize.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        effectComposer.setSize(canvasSize.width, canvasSize.height);
    }

    const addEvent = () => {
        window.addEventListener('resize', resize);
    }

    const draw = (obj) => {
        const { earthGroup, star } = obj;
        earthGroup.rotation.x += 0.0005;
        earthGroup.rotation.y += 0.0005;

        star.rotation.x += 0.001;
        star.rotation.y += 0.001;

        controls.update();
        effectComposer.render();
        // renderer.render(scene, camera);
        requestAnimationFrame(() => {
            draw(obj);
        });
    }

    const initialize = () => {
        const obj = create();

        addLight();
        addPostEffects(obj);
        addEvent();
        resize();
        draw(obj);
    }

    initialize();
}