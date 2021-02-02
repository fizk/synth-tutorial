import { OBJLoader } from '../node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from '../node_modules/three/examples/jsm/loaders/MTLLoader.js';
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    PointLight,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh
} from '../node_modules/three/build/three.module.js';


let ourObj;
const OBJ_PATH = '/obj';
const OBJ_FILE = '/Appartment.obj';
const MTL_FILE = '/Appartment.mtl';

const scene = new Scene();

var light = new PointLight(0xFFFFFF, 1.4, 1000)
light.position.set(0, 15, 15);
scene.add(light);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 50;
camera.position.y = 30;


// const geometry = new BoxGeometry();
// const material = new MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new Mesh(geometry, material);
// scene.add(cube);


const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor("#DDDDDD");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
});

const mtlLoader = new MTLLoader();
mtlLoader.load(`${OBJ_PATH}/${MTL_FILE}`, function (materials) {

    materials.preload();

    // Load the object
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load(`${OBJ_PATH}/${OBJ_FILE}`, function (object) {
        ourObj = object;
        // object.position.z -= 30;
        // object.position.y = -15;
        // object.rotation.x = 250;
        scene.add(object);

    });
});

var render = function () {
    requestAnimationFrame(render);

    ourObj && (ourObj.rotation.y -= .01);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}
render();