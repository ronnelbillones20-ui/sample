import * as THREE from 'https://cdn.skypack.dev/three@0.150.0';

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// --- The Cat Model ---
const catGroup = new THREE.Group();
const mat = new THREE.MeshPhongMaterial({ color: 0x444444 }); // Dark Grey Cat

// Body
const body = new THREE.Mesh(new THREE.BoxGeometry(1, 0.6, 1.5), mat);
body.position.y = 0.6;
catGroup.add(body);

// Head
const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.6), mat);
head.position.set(0, 1.1, 0.8);
catGroup.add(head);

// Tail
const tailGroup = new THREE.Group();
const tail = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.8), mat);
tail.position.z = -0.4;
tailGroup.position.set(0, 0.7, -0.7);
tailGroup.add(tail);
catGroup.add(tailGroup);

// Legs (Simple cubes)
const legGeo = new THREE.BoxGeometry(0.2, 0.4, 0.2);
const legs = [];
const legPositions = [
    [-0.3, 0.2, 0.5], [0.3, 0.2, 0.5],   // Front
    [-0.3, 0.2, -0.5], [0.3, 0.2, -0.5]  // Back
];

legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo, mat);
    leg.position.set(...pos);
    catGroup.add(leg);
    legs.push(leg);
});

scene.add(catGroup);

// --- Animation Logic ---
let state = 'IDLE'; // States: 'IDLE' or 'WALK'
let clock = new THREE.Clock();

window.addEventListener('mousedown', () => {
    state = state === 'IDLE' ? 'WALK' : 'IDLE';
});

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (state === 'IDLE') {
        // Subtle Breathing
        body.scale.y = 1 + Math.sin(t * 2) * 0.02;
        // Tail Wag
        tailGroup.rotation.y = Math.sin(t * 3) * 0.3;
        tailGroup.rotation.x = 0;
        // Reset Legs
        legs.forEach(l => l.rotation.x = 0);
    } 
    
    if (state === 'WALK') {
        // Forward movement (looping)
        catGroup.position.z += 0.03;
        if (catGroup.position.z > 5) catGroup.position.z = -5;

        // Leg Swing
        legs[0].rotation.x = Math.sin(t * 10) * 0.5; // Front Left
        legs[1].rotation.x = Math.cos(t * 10) * 0.5; // Front Right
        legs[2].rotation.x = Math.cos(t * 10) * 0.5; // Back Left
        legs[3].rotation.x = Math.sin(t * 10) * 0.5; // Back Right
        
        // Tail bounce
        tailGroup.rotation.x = Math.sin(t * 10) * 0.2;
    }

    renderer.render(scene, camera);
}

// --- Responsiveness ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
