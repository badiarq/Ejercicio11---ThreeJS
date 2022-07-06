import * as THREE from 'three'
//Import stats module
import Stats from 'three/examples/jsm/libs/stats.module'
//Import Dat.GUI Panel to be able to manipulate a 3D object directly in the page
import { GUI } from 'dat.gui'
import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils,
    MOUSE,
    Clock
  } from "three";
  
  import CameraControls from 'camera-controls';
  
  const subsetOfTHREE = {
    MOUSE,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils: {
      DEG2RAD: MathUtils.DEG2RAD,
      clamp: MathUtils.clamp
    }
  };
  
  const canvas = document.getElementById("three-canvas");
  
  //1 The scene
  const scene = new Scene();
    // Give a color to the scene
  scene.background = new THREE.Color(0xdedeee)
    //Load Axes for the scene
  scene.add(new THREE.AxesHelper(5))
  
  //2 The Object

//   const geometry = new BoxGeometry(0.5, 0.5, 0.5);
//   const material = new MeshBasicMaterial({ color: "orange" });
//   const cubeMesh = new Mesh(geometry, material);
//   scene.add(cubeMesh);

//Define a BOX Geometry
const geometry = new THREE.BoxGeometry()
//Define the box materials
const material = new THREE.MeshBasicMaterial({
    color: 0xcccccc,
    wireframe: true,
})

//Create a BOX from the defined elements
const cube = new THREE.Mesh(geometry, material)
//Add the BOX to the scene to be able to see it

//Create a box surface geometry
const surfacegeometry = new THREE.BoxGeometry()
//Create a material for the surface box
const surfacematerial = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 0.5,
})
//Create the surface Cube componed from the geometry+material
const surfaceCube = new THREE.Mesh(surfacegeometry, surfacematerial)
//Add the surfaceCube as a child of the first Cube created on top
cube.add(surfaceCube)

scene.add(cube)
  
  //3 The Camera
  const camera = new PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight
  );
  camera.position.z = 3; // Z let's you move backwards and forwards. X is sideways, Y is upward and do
  scene.add(camera);
  
  //4 The Renderer
  const renderer = new WebGLRenderer({
    canvas: canvas,
  });
  
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  
  window.addEventListener("resize", () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  });
  
  // 5 Controls
  CameraControls.install( { THREE: subsetOfTHREE } ); 
  const clock = new Clock();
  const cameraControls = new CameraControls(camera, canvas);
  
  function animate() {
    const delta = clock.getDelta();
      cameraControls.update( delta );
      renderer.render( scene, camera );
    requestAnimationFrame(animate);
  }
  
  animate();


  // 8 Load the Dat.GUI Panel
const gui = new GUI()
//Add a folder for manipulating options
const cubeFolder = gui.addFolder('Cube')
//Load cubeFolder section
cubeFolder.open()
//Add a folder conatining 3 rotation panels [x, y, z]
const cubeRotationFolder = cubeFolder.addFolder('Rotation')
cubeRotationFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
cubeRotationFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
cubeRotationFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
//Load cubeRotation panels
cubeRotationFolder.open()
//Add a folder conatining 3 positions panels [x, y, z] (axe, min, max, step)
const cubePositionFolder = cubeFolder.addFolder('Position')
cubePositionFolder.add(cube.position, 'x', -10, 10, 0.1)
cubePositionFolder.add(cube.position, 'y', -10, 10, 0.1)
cubePositionFolder.add(cube.position, 'z', -10, 10, 0.1)
//Load cubePosition panels
cubePositionFolder.open()
//Add a folder conatining 3 positions panels [x, y, z] (axe, min, max)
const cubeScaleFolder = cubeFolder.addFolder('Scale')
cubeScaleFolder.add(cube.scale, 'x', -5, 5)
cubeScaleFolder.add(cube.scale, 'y', -5, 5)
cubeScaleFolder.add(cube.scale, 'z', -5, 5)
//Add a boolean option to show/hide the cube geometry
cubeFolder.add(cube, 'visible')
//Load cubeScale panels
cubeScaleFolder.open()
//Create a transparency section
const TransparencyFolder = cubeFolder.addFolder('Transparent')
//Add a transparent option as a panel
TransparencyFolder.add(surfacematerial, 'transparent')
//Add an opacity panel
TransparencyFolder.add(surfacematerial, 'opacity', 0, 1, 0.01)
// Load cubeFolder section
TransparencyFolder.open()
//Declare the different options we want to have for the Side Panel
//A BackSide option will allows us to see the interior of the box from the outside
const options = {
    side: {
        "FrontSide": THREE.FrontSide,
        "BackSide": THREE.BackSide,
        "DoubleSide": THREE.DoubleSide,
    }
}
//Add the options to the panel
TransparencyFolder.add(surfacematerial, 'side', options.side).onChange(() => updateMaterial())
//Run a fonction so the side option can work correctly
function updateMaterial(){
    //convert the side option into a number (it won't work if it's a string)
    surfacematerial.side = Number(surfacematerial.side)
    //update when charging WebGL
    material.needsUpdate = true
}

//Add a camera distance panel
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10)
//To open the tabs by default:
cameraFolder.open()