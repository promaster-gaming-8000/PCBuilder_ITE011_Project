import * as THREE from 'three';

let clock = new THREE.Clock();
let delta = 0;

const canvas = document.querySelector('.smoke_background');

if (!canvas) {
    console.error('Canvas with class ".smoke_background" was not found.');
}

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1500
);

camera.position.z = 1000;

const scene = new THREE.Scene();

scene.fog = new THREE.Fog(0xc0f0ff, 0.0015);

const light = new THREE.HemisphereLight(
    0xd6e6ff,
    0xa38c08,
    1
);

scene.add(light);

const smokeTexture = new THREE.TextureLoader().load(
    "threejs_images/smoke1.png"
);

smokeTexture.encoding = THREE.sRGBEncoding;

const smokeGeometry = new THREE.PlaneGeometry(300, 300);

const smokeMaterial = new THREE.MeshLambertMaterial({
    map: smokeTexture,
    emissive: 0x222222,
    opacity: 0.05,
    transparent: true,
    depthWrite: false
});

let smokeParticles = [];

for (let i = 0; i < 90; i++) {

    let smokeElement = new THREE.Mesh(
        smokeGeometry,
        smokeMaterial
    );

    smokeElement.scale.set(2, 2, 2);

    smokeElement.position.set(
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 500,
        Math.random() * 1000 - 100
    );

    smokeElement.rotation.z = Math.random() * Math.PI * 2;

    scene.add(smokeElement);
    smokeParticles.push(smokeElement);
}

onWindowResize();

window.addEventListener('resize', onWindowResize);

animate();

function animate() {

    requestAnimationFrame(animate);

    delta = clock.getDelta();

    for (let i = 0; i < smokeParticles.length; i++) {

        smokeParticles[i].rotation.z += delta * 0.3;

    }

    renderer.render(scene, camera);
}

function onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
}