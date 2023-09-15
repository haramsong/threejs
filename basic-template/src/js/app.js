import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function () {
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
    });

    const container = document.querySelector('#container');

    container.appendChild(renderer.domElement);

    const canvasSize = {
        width: window.innerWidth,
        height: window.innerHeight,
    }

    renderer.setSize(canvasSize.width, canvasSize.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
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

    const createObject = () => {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);

        scene.add(mesh);
    }

    const resize = () => {
        canvasSize.width = window.innerWidth;
        canvasSize.height = window.innerHeight;

        camera.aspect = canvasSize.width / canvasSize.height;
        camera.updateProjectionMatrix();

        renderer.setSize(canvasSize.width, canvasSize.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    const addEvent = () => {
        window.addEventListener('resize', resize);
    }

    const draw = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(() => {
            draw();
        });
    }

    const initialize = () => {
        createObject();
        addEvent();
        resize();
        draw();
    }

    initialize();
}