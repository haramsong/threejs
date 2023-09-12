import * as THREE from 'three';

export default class Card{
    constructor({ width, height, radius, color }) {
        const x = width / 2 - radius;
        const y = height / 2 - radius;

        const shape = new THREE.Shape();


        // PAYCO 앞면 재미삼아 만듦
        // const textureLoader = new THREE.TextureLoader().setPath('./assets/textures/');

        // const texture =textureLoader.load('payco.jpg');
        // texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set( 0.085, 0.06 );


        // .absarc(x, y, radius, startAngle, endAngle, clockwise)
        shape
            .absarc(x, y, radius, Math.PI / 2, 0, true)
            .lineTo(x + radius, -y)
            .absarc(x, -y, radius, 0, - Math.PI / 2, true)
            .lineTo(-x, -(y + radius))
            .absarc(-x, -y, radius, - Math.PI / 2, - Math.PI, true)
            .lineTo(-(x + radius), y, radius, Math.PI, Math.PI / 2, true)
            .absarc(-x, y, radius, Math.PI, Math.PI / 2, true)


        // ShapeGeometry : 2차원 모델링만 가능
        // const geometry = new THREE.ShapeGeometry(shape);

        // ExtrudeGeometry : ShapeGeometry에 깊이감 추가 (3차원)
        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 0.01,
            bevelThickness: 0.1,
        });
        const material = new THREE.MeshStandardMaterial({ 
            color,
            side: THREE.DoubleSide,
            // map: texture,
            roughness: 0.5,
            metalness: 0.5,
        });

        const mesh = new THREE.Mesh(geometry, material);

        this.mesh = mesh;
    }   
}

