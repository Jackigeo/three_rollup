/* // Import only what you need, to help your bundler optimize final code size using tree shaking
// see https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking)
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  AmbientLight,
  Clock
} from 'three';

// If you prefer to import the whole library, with the THREE prefix, use the following line instead:
// import * as THREE from 'three'

// NOTE: three/addons alias is supported by Rollup: you can use it interchangeably with three/examples/jsm/  

import {
  OrbitControls
} from 'three/addons/controls/OrbitControls.js';

import {
  GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

// Example of hard link to official repo for data, if needed
// const MODEL_PATH = 'https://raw.githubusercontent.com/mrdoob/js/r148/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb';


// INSERT CODE HERE

const scene = new Scene();
const aspect = window.innerWidth / window.innerHeight;
const camera = new PerspectiveCamera(75, aspect, 0.1, 1000);

const light = new AmbientLight(0xffffff, 1.0); // soft white light
scene.add(light);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window); // optional

const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshNormalMaterial();
const cube = new Mesh(geometry, material);

scene.add(cube);

function loadData() {
  new GLTFLoader()
    .setPath('assets/models/')
    .load('test.glb', gltfReader);
}


function gltfReader(gltf) {
  let testModel = null;

  testModel = gltf.scene;

  if (testModel != null) {
    console.log("Model loaded:  " + testModel);
    scene.add(gltf.scene);
  } else {
    console.log("Load FAILED.  ");
  }
}

loadData();


camera.position.z = 3;


const clock = new Clock();

// Main loop
const animation = () => {

  renderer.setAnimationLoop(animation); // requestAnimationFrame() replacement, compatible with XR 

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  // can be used in shaders: uniforms.u_time.value = elapsed;

  cube.rotation.x = elapsed / 2;
  cube.rotation.y = elapsed / 1;

  renderer.render(scene, camera);
};

animation();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}
 */

import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';

import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

import { OimoPhysics } from 'three/examples/jsm/physics/OimoPhysics.js';

import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';

let camera, scene, renderer;
let controller;
let physics, position;

let boxes, spheres, myBox;

let number;
const n1 = getRandomArbitrary(1, 300)
const n2 = getRandomArbitrary(1, 300)
let cnt = 0;

let guess = document.getElementById('guess');
let button = document.getElementById('submit');
button.addEventListener('click', checkScore)

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}


init();

function init() {

  const container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

  const hemiLight = new THREE.HemisphereLight();
  hemiLight.intensity = 0.35;
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight();
  dirLight.position.set(5, 5, 5);
  dirLight.castShadow = true;
  dirLight.shadow.camera.zoom = 2;
  scene.add(dirLight);


  //

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  //

  document.body.appendChild(ARButton.createButton(renderer));

  const geometry = new THREE.CylinderGeometry(0, 0.05, 0.2, 32).rotateX(Math.PI / 2);

  async function onSelect() {

    const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, - 0.3).applyMatrix4(controller.matrixWorld);
    mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
    scene.add(mesh);

    initGame();

  }

  controller = renderer.xr.getController(0);
  controller.addEventListener('select', onSelect);
  scene.add(controller);

  //

  window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

async function initGame() {

  /** @type {WebGLRenderingContext} */

  physics = await OimoPhysics();
  position = new THREE.Vector3();

  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(100, 5, getRandomArbitrary(1, 250)),
    new THREE.ShadowMaterial({ color: 0x111111 })
  );
  floor.position.y = -5;
  floor.receiveShadow = true;
  scene.add(floor);
  physics.addMesh(floor);


  myBox = new THREE.Object3D()

  const vaseMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0,
    metalness: 0,
    ior: 2.33,
    thickness: 2,
    transparent: true,
    opacity: 0.2
  })

  // right
  const geometrySide = new THREE.BoxGeometry(0.01, 1, 1.5);
  const Right = new THREE.Mesh(geometrySide, vaseMaterial);
  Right.position.y = 0.5;
  Right.position.x = 0.75;
  myBox.add(Right);
  physics.addMesh(Right);

  // bottom
  const Left = new THREE.Mesh(geometrySide, vaseMaterial);
  Left.position.y = 0.5;
  Left.position.x = -0.75;
  myBox.add(Left);
  physics.addMesh(Left);

  // behind
  const geometrySide2 = new THREE.BoxGeometry(1.5, 1, 0.01);
  const Behind = new THREE.Mesh(geometrySide2, vaseMaterial);
  Behind.position.y = 0.5;
  Behind.position.z = -0.75;
  myBox.add(Behind);
  physics.addMesh(Behind);

  // front
  const Front = new THREE.Mesh(geometrySide2, vaseMaterial);
  Front.position.y = 0.5;
  Front.position.z = 0.75;
  myBox.add(Front);
  physics.addMesh(Front);

  // bottom
  const geometryBottom = new THREE.BoxGeometry(1.5, 0.01, 1.5);
  const Bottom = new THREE.Mesh(geometryBottom, vaseMaterial);
  Bottom.position.y = 0;
  myBox.add(Bottom);
  physics.addMesh(Bottom);

  scene.add(myBox);

  //

  const material = new THREE.MeshLambertMaterial();

  const matrix = new THREE.Matrix4();
  const color = new THREE.Color();

  // Boxes
  const geometryBox = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  boxes = new THREE.InstancedMesh(geometryBox, material, n1);
  boxes.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
  boxes.castShadow = true;
  boxes.receiveShadow = true;
  scene.add(boxes)

  for (let i = 0; i < boxes.count; i++) {

    matrix.setPosition(Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5);
    boxes.setMatrixAt(i, matrix);
    boxes.setColorAt(i, color.setHex(0xffffff * Math.random()));

  }

  physics.addMesh(boxes, 1);

  // Spheres

  const geometrySphere = new THREE.IcosahedronGeometry(0.075, 1);
  const matSphere = new THREE.MeshPhysicalMaterial({
    reflectivity: 0,
    roughness: 0.2,
    metalness: 0,
    color: new THREE.Color(0xce19e0),
    thickness: 10.0,
    fog: false
  })

  spheres = new THREE.InstancedMesh(geometrySphere, matSphere, n2);
  spheres.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // will be updated every frame
  spheres.castShadow = true;
  spheres.receiveShadow = true;
  scene.add(spheres);

  for (let i = 0; i < spheres.count; i++) {

    matrix.setPosition(Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5);
    spheres.setMatrixAt(i, matrix);
    spheres.setColorAt(i, color.setHex(0xffffff * Math.random()));
  }

  physics.addMesh(spheres, 1);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);
  //

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.y = 0.5;
  controls.update();

  animate();
}

//

function animate() {

  renderer.setAnimationLoop(render);

  requestAnimationFrame(animate);

  //

  let index = Math.floor(Math.random() * boxes.count);
  //position.set(0, Math.random() + 1, 0);
  //position.update();
  //physics.setMeshPosition(boxes, position, index);

  //

  index = Math.floor(Math.random() * spheres.count);
  //position.set(0, Math.random() + 1, 0);

  //position.update();
  //physics.setMeshPosition(spheres, position, index);

  render();

  if (myBox) { myBox.rotation.x += 0.001 }

  position.set(0, myBox.rotation.x)
  physics.setMeshPosition(myBox, position, index)

}

function render() {

  renderer.render(scene, camera);

}

function checkScore() {
  cnt++;
  let number = parseInt(n1 + n2)
  console.log(number + " " + guess.value)

  if (number > guess.value) {
    alert("higher -- guess number " + cnt);
  } else if (number < guess.value) {
    alert("lower -- guess number " + cnt);
  } else if (number == guess.value) {
    alert("you win on guess number " + cnt);
  }

}




