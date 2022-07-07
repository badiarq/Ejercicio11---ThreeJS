import * as THREE from 'three'
//Import stats module
import Stats from 'three/examples/jsm/libs/stats.module'
//Import Dat.GUI Panel to be able to manipulate a 3D object directly in the page
import { GUI } from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    MeshPhongMaterial,
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
    Clock,
    DirectionalLight,
    Color,
    AmbientLight,
    EdgesGeometry,
    LineBasicMaterial,
    LineSegments
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
  
// 1 The scene
  const scene = new Scene();
    // Give a color to the scene
  scene.background = new THREE.Color(0xdedeee)
    //Load Axes for the scene
    const axes = new THREE.AxesHelper(5);
    axes.renderOrder = 2;
    scene.add(axes);
  
// 2 The Object

  // 2.1 Create a first Box
        //Define a BOX Geometry
        const geometry = new THREE.BoxGeometry()
        //Define the box materials
        const material = new THREE.MeshBasicMaterial({
            color: 0xcccccc,
            wireframe: true,
        })

        //Create a BOX from the defined elements
        const cube = new THREE.Mesh(geometry, material)

        //Create a box surface geometry
        const surfacegeometry = new THREE.BoxGeometry()
        //Create a material for the surface box
        const surfacematerial = new THREE.MeshNormalMaterial({
            transparent: true,
            opacity: 0.5,
        })
        //Create the surface Cube componed from the geometry+material
        const surfaceCube = new THREE.Mesh(surfacegeometry, surfacematerial);
        //Add the surfaceCube as a child of the first Cube created on top
        cube.add(surfaceCube);

        //Add the BOX to the scene to be able to see it
        scene.add(cube);

    // 2.2 Create a second box
        //Define a Phong Material
        const PhongMaterial = new THREE.MeshPhongMaterial({
            color: 0xff00ff,
            specular: 0xffffff,
            shininess: 100,
            flatShading: true,
        })
        //Create a Phong Cube
        const PhongCube = new THREE.Mesh(geometry, PhongMaterial)
        //Move the Phong Cube
        PhongCube.position.x = 2;
        //Add the Phong Cube to the scene to be able to see it
        scene.add(PhongCube);

    // 2.3 Create a third box
        const boxGeometry = new BoxGeometry(1, 1, 1);
        const edgesGeometry = new EdgesGeometry(boxGeometry);
        const edgesMaterial = new LineBasicMaterial({color : 0x000000});
        const wireframeBox = new LineSegments(edgesGeometry, edgesMaterial);
        wireframeBox.position.x = -2;
        scene.add(wireframeBox);
  
// 3 The Camera
    const camera = new PerspectiveCamera(
        75,
        canvas.clientWidth / canvas.clientHeight
    );

    camera.position.z = 10; // Z let's you move backwards and forwards. X is sideways, Y is upward and do
    camera.position.y = 5;
    camera.position.x = 0;

    // // Create a vector
    // const vectorA = new THREE.Vector3( 25, 0, 0 );
    // const vectorB = new THREE.Vector3( 20, 5, 0 );
    // const vectorC = new THREE.Vector3();
    // vectorC.addVectors( vectorA, vectorB );

    // LookAt the Vector
    // camera.lookAt(vectorC);
    camera.lookAt(axes.position);

    // Add the camera to the scene
    scene.add(camera);
  
// 4 The Renderer

    const renderer = new WebGLRenderer({
        canvas: canvas,
    });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
  
// 5 Lights
  
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const light1 = new DirectionalLight();
    light1.position.set(2,1,3).normalize();
    scene.add(light1);

    const light2 = new DirectionalLight();
    light2.position.set(-3,2,-1).normalize();
    scene.add(light2);

// 6 Responsivity

    window.addEventListener("resize", () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    });

// 7 Controls
    CameraControls.install( { THREE: subsetOfTHREE } ); 
    const clock = new Clock();
    const cameraControls = new CameraControls(camera, canvas);

// 8 Animate
  
    function animate() {
        const delta = clock.getDelta();
        cameraControls.update( delta );
        renderer.render( scene, camera );
        requestAnimationFrame(animate);
    }
    animate();

// 9 Grid

    const grid = new THREE.GridHelper();
    grid.material.depthTest = false;
    // grid.renderOrder = 1;
    scene.add(grid);

// 10 Load the Dat.GUI Panel
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

// 11 Add GLTF file to the scene

    // 11.1 (optional) Add GUI controls for the GLTF File
        const guiHouse = new GUI()
        //Add a folder for manipulating options
        const HouseFolder = guiHouse.addFolder('House')
        //Load cubeFolder section
        HouseFolder.open()
        //Add a folder conatining 3 rotation panels [x, y, z]
        const HousePositionFolder = HouseFolder.addFolder('Position')

    // 11.2 Load the GLTF File
        const loader = new GLTFLoader();
        loader.load( '/Items/house/scene.gltf',

        (gltf) => {
            // Modify the position of the Geometry
                gltf.scene.position.x = -55;
                gltf.scene.position.y = -13;
                gltf.scene.position.z = -37;
            // Add position controls to the GUI
                HousePositionFolder.add(gltf.scene.position, 'x', -100, 100, 5)
                HousePositionFolder.add(gltf.scene.position, 'y', -100, 100, 5)
                HousePositionFolder.add(gltf.scene.position, 'z', -100, 100, 5)
            // Add the Geometry to the scene
                scene.add(gltf.scene);
        },
        (progress) => {
            console.log(progress);
        },
        (error) => {
            console.log(error);
        })