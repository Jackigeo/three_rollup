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

let camera, scene, renderer;
let controller;


init();
animate();

function init() {

  const container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  //

  document.body.appendChild(ARButton.createButton(renderer));

  //

  const geometry = new THREE.CylinderGeometry(0, 0.05, 0.2, 32).rotateX(Math.PI / 2);

  function onSelect() {

    const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, - 0.3).applyMatrix4(controller.matrixWorld);
    mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
    scene.add(mesh);

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

//

function animate() {

  renderer.setAnimationLoop(render);

}

function render() {

  renderer.render(scene, camera);

}



