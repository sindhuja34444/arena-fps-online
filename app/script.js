// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ color: 0x444444 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -2;
scene.add(ground);

// Targets array
const targets = [];

// Create targets
function createTarget() {
  const geometry = new THREE.SphereGeometry(0.5, 16, 16);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const target = new THREE.Mesh(geometry, material);

  target.position.set(
    (Math.random() - 0.5) * 10,
    Math.random() * 3,
    -Math.random() * 20
  );

  scene.add(target);
  targets.push(target);
}

// Spawn targets
setInterval(createTarget, 1500);

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Score
let score = 0;
const scoreDisplay = document.getElementById("score");

// Shoot on click
window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(targets);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    scene.remove(hit);
    targets.splice(targets.indexOf(hit), 1);

    score++;
    scoreDisplay.innerText = "Score: " + score;
  }
});

// Animate targets
function animate() {
  requestAnimationFrame(animate);

  targets.forEach((target) => {
    target.position.x += Math.sin(Date.now() * 0.001) * 0.02;
  });

  renderer.render(scene, camera);
}

animate();

// Resize fix
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});