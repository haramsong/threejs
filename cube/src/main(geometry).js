import * as THREE from 'three';

window.addEventListener('load', function() {
  init();
});

function init() {
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

  // vs OrthographicCamera : 원근법이 제거된 카메라(예 : 스타크래프트)

  const geometry = new THREE.BoxGeometry(2,2,2);

  // MeshBasicMaterial은 조명을 추가해도 변화가 없음.
  // const material = new THREE.MeshBasicMaterial({ color: 0xcc99ff });

  const material = new THREE.MeshStandardMaterial({
    color: 0xcc99ff, 
    transparent: true,
    opacity: 0.5,
    // 안보이게
    // visible: false,
    // 테두리만
    // wireframe: true,
    // 안에 비치게
    // side: THREE.DoubleSide,
  });


  const cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  // camera와 mesh 가 z축으로 일직선으로 있기 때문에 2d 도형처럼 보임
  // camera.position.set(0, 0, 5);

  camera.position.set(3,4,5);

  camera.lookAt(cube.position);

  // 파라미터 : 색깔, 강도
  const directionalLight = new THREE.DirectionalLight(0xf0f0f0, 1);

  directionalLight.position.set(-1,2,3);

  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

  ambientLight.position.set(3,2,1);

  scene.add(ambientLight);

  // Three.js 시간
  const clock = new THREE.Clock();

  render();

  function render() {
    // 각도 라디안으로 사용해야 함.
    // cube.rotation.x = THREE.MathUtils.degToRad(45);

    // cube.rotation.x = Date.now() / 1000;
    // cube.rotation.x = clock.getElapsedTime();
    cube.rotation.x += clock.getDelta();

    // cube.position.y = Math.sin(cube.rotation.x);
    // cube.scale.x = Math.cos(cube.rotation.x);

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', handleResize);
}