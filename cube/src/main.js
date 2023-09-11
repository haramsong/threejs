import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

window.addEventListener('load', function() {
  init();
});

function init() {
  const options = {
    color: 0x00ffff,
  }

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  // fov : vertical field of view,
  // aspect : aspect ratio
  // near : near plane
  // far : far plane
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500,
  );

  const controls = new OrbitControls(camera, renderer.domElement);

  controls.autoRotate = true;
  // controls.autoRotateSpeed = 30;
  // 관성 적용 여부
  controls.enableDamping = true;
  // 관성 적용 정도
  // controls.dampingFactor = 0.01;
  // 줌인 아웃 여부
  // controls.enableZoom = true;
  // 끌고 이동 가능 여부
  // controls.enablePan = true;

  // 줌 정도
  // controls.maxDistance = 50;
  // controls.minDistance = 10;
  // 수직 최대 각도 회전
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = Math.PI / 3;
  // 수평 최대 각도 회전
  controls.maxAzimuthAngle = Math.PI / 2;
  controls.maxAzimuthAngle = Math.PI / 3;


  // 축 나옴
  // const axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);

  const cubeGeometry = new THREE.IcosahedronGeometry(1);
  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff, 
    emissive: 0x111111,
  });

  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  const skeletonGeometry = new THREE.IcosahedronGeometry(2);
  const skeletonMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity: 0.2,
    color: 0xaaaaaa,

  })

  const skeleton = new THREE.Mesh(skeletonGeometry, skeletonMaterial);

  scene.add(cube, skeleton);

  camera.position.z = 5;

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

  scene.add(directionalLight);

  const clock = new THREE.Clock();

  render();

  function render() {
    const elapsedTime = clock.getElapsedTime();

    // cube.rotation.x = elapsedTime;
    // cube.rotation.y = elapsedTime;

    // skeleton.rotation.x = elapsedTime * 1.5;
    // skeleton.rotation.y = elapsedTime * 1.5;

    renderer.render(scene, camera);

    controls.update();

    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);

    controls.update();
  }

  window.addEventListener('resize', handleResize);

  const gui = new GUI();

  // gui.add(cube.position, 'y', -3, 3, 0.1);
  gui
    .add(cube.position, 'y')
    .min(-3)
    .max(3)
    .step(0.1);

  gui.add(cube, 'visible');

  // 색상 변경은 까다롭기 때문에 따로 메서드가 있음
  gui
    .addColor(options, 'color')
    .onChange((value) => {
      cube.material.color.set(value);
    })
    ;
}