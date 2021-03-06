import * as THREE from 'three'
//Import stats module
import Stats from 'three/examples/jsm/libs/stats.module'
//Import Dat.GUI Panel to be able to manipulate a 3D object directly in the page
import { GUI } from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import CameraControls from 'camera-controls';
import { index } from 'hold-event/dist/hold-event.min.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import {
    CSS2DRenderer,
    CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer'
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
    LineSegments,
    BufferGeometryLoader,
    SpotLight
  } from "three";
import { Line } from 'three';
  
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
  const labelCanvas = document.getElementById("canvas-label");
  
// 1 The scene

    // 1.0 Create a Scene
    const scene = new Scene();
    // 1.1 Give a color to the scene
    scene.background = new THREE.Color(0xdedeee)

    // 1.2 Load Axes for the scene
    const axes = new THREE.AxesHelper(5);
    axes.renderOrder = 2;
    scene.add(axes);

    // 1.3 Grid
    const grid = new THREE.GridHelper();
    grid.material.depthTest = false;
    // grid.renderOrder = 1;
    scene.add(grid);
  
// 2 The Object

    const boxGeometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial({transparent: true});
    const cube = new THREE.Mesh(boxGeometry, material);
    cube.position.z = 3;
    scene.add(cube);
    cube.castShadow = true;


// 3 The Camera

    // 3.1 Create the camera
    const camera = new PerspectiveCamera(
        50,
        canvas.clientWidth / canvas.clientHeight
    );

    // 3.2 Camera Controls
    CameraControls.install( { THREE: subsetOfTHREE } ); 
    const clock = new Clock();
    const cameraControls = new CameraControls(camera, canvas);

        // Min and Max DOLLY ("Zoom")
        cameraControls.minDistance = 3;
        cameraControls.maxDistance = 30;
        // Mouse controls
        cameraControls.mouseButtons.middle = CameraControls.ACTION.TRUCK;
        cameraControls.mouseButtons.right = CameraControls.ACTION.DOLLY;
        cameraControls.mouseButtons.wheel = CameraControls.ACTION.DOLLY;
        // Polar Angle
        cameraControls.minPolarAngle = Math.PI / 4;
        cameraControls.maxPolarAngle = 0.55 * Math.PI;

        // Keyboards keys to navigate
        const KEYCODE = {
            W: 87,
            A: 65,
            S: 83,
            D: 68,
            ARROW_LEFT : 37,
            ARROW_UP   : 38,
            ARROW_RIGHT: 39,
            ARROW_DOWN : 40,
        };

        const wKey = new holdEvent.KeyboardKeyHold( KEYCODE.W, 16.666 );
        const aKey = new holdEvent.KeyboardKeyHold( KEYCODE.A, 16.666 );
        const sKey = new holdEvent.KeyboardKeyHold( KEYCODE.S, 16.666 );
        const dKey = new holdEvent.KeyboardKeyHold( KEYCODE.D, 16.666 );
        aKey.addEventListener( 'holding', function( event ) { cameraControls.truck( - 0.01 * event.deltaTime, 0, false ) } );
        dKey.addEventListener( 'holding', function( event ) { cameraControls.truck(   0.01 * event.deltaTime, 0, false ) } );
        wKey.addEventListener( 'holding', function( event ) { cameraControls.forward(   0.01 * event.deltaTime, false ) } );
        sKey.addEventListener( 'holding', function( event ) { cameraControls.forward( - 0.01 * event.deltaTime, false ) } );
        
        const leftKey  = new holdEvent.KeyboardKeyHold( KEYCODE.ARROW_LEFT,  100 );
        const rightKey = new holdEvent.KeyboardKeyHold( KEYCODE.ARROW_RIGHT, 100 );
        const upKey    = new holdEvent.KeyboardKeyHold( KEYCODE.ARROW_UP,    100 );
        const downKey  = new holdEvent.KeyboardKeyHold( KEYCODE.ARROW_DOWN,  100 );
        leftKey.addEventListener ( 'holding', function( event ) { cameraControls.rotate( - 0.1 * THREE.MathUtils.DEG2RAD * event.deltaTime, 0, true ) } );
        rightKey.addEventListener( 'holding', function( event ) { cameraControls.rotate(   0.1 * THREE.MathUtils.DEG2RAD * event.deltaTime, 0, true ) } );
        upKey.addEventListener   ( 'holding', function( event ) { cameraControls.rotate( 0, - 0.05 * THREE.MathUtils.DEG2RAD * event.deltaTime, true ) } );
        downKey.addEventListener ( 'holding', function( event ) { cameraControls.rotate( 0,   0.05 * THREE.MathUtils.DEG2RAD * event.deltaTime, true ) } );

    // 3.3 Set camera position (x, y , z) + camera target (x, y, z)
    cameraControls.setLookAt(-2, 2, 8, 0, 1, 0)
    // 3.4 Set the camera distance
    cameraControls.distance = 12;

    // 3.5 Add the camera to the scene
    scene.add(camera);

// 4 The Renderer
    // WebGL Renderer
    const renderer = new WebGLRenderer({
        canvas: canvas,
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Label Renderer
    const labelRenderer = new CSS2DRenderer({
        canvas: canvas,
    });
    labelRenderer.setSize(canvas.clientWidth, canvas.clientHeight)
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.pointerEvents = 'none'
    labelCanvas.appendChild(labelRenderer.domElement)
  
// 5 Lights
  
    // Create an AmbientLight
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Create a SpotLight
    const light1 = new SpotLight(0xffffff, 1.5);
    light1.position.set( 25, 20, 25 );
    light1.angle = 0.5;
    light1.penumbra = 0.25;
    // Light target
    light1.target.position.set(0,0,0);
    scene.add(light1.target);

    // Activate Shadows for the light
    light1.castShadow = true;
    light1.shadow.mapSize.width = 512;
    light1.shadow.mapSize.height = 512;
    light1.shadow.camera.near = 0.5;
    light1.shadow.camera.far = 200;
    // light1.shadow.bias = 0.02;

    const data = {
        color: light1.color.getHex(0x000000),
        mapsEnabled: true,
        shadowMapSizeWidth: 512,
        shadowMapSizeHeight: 512,
    }

    function updateShadowMapSize() {
    light1.shadow.mapSize.width = data.shadowMapSizeWidth;
    light1.shadow.mapSize.height = data.shadowMapSizeHeight;
    light1.shadow.map = null;
    }

    // Add the light & the target to the scene
    scene.add(light1);

// 6 Responsivity

    window.addEventListener("resize", () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        labelRenderer.setSize(canvas.clientWidth, canvas.clientHeight)
    });

// 7 Stats 
    const stats0 = Stats(0)
    const stats1 = Stats(1)
    const stats2 = Stats(2)

    const statsBar0 = stats0.dom;
    const statsBar1 = stats1.dom;
    const statsBar2 = stats2.dom;
    statsBar0.children.item(0).style.display = "flex";
    statsBar1.children.item(1).style.display = "flex";
    statsBar2.children.item(2).style.display = "flex";

    const statsContainer= document.querySelector('.stats-container');
    const firstStatBar = statsBar0.children.item(0);
    const secondStatBar = statsBar1.children.item(1);
    const ThirdStatBar = statsBar2.children.item(2);
    statsContainer.append(firstStatBar, secondStatBar, ThirdStatBar);

// 8 Animate
  
function animate() {
    // update the time for camera-controls
    const delta = clock.getDelta();
    // update camera-controls
    cameraControls.update( delta );
    
    requestAnimationFrame(animate);
    //render Scene and camera
    renderer.render( scene, camera );
    //render label renderer
    labelRenderer.render(scene, camera);
    
    // update shadow Size
    updateShadowMapSize()

    //reload stats panels
    stats0.update()
    stats1.update()
    stats2.update()
}
animate();

// Picking

const raycaster = new Raycaster();
const mouse = new Vector2();

// Previous Selection
const previousSelection = {
    mesh : null,
    material: null
}

// Create a material to highlight the selected object
    const highlightMat = new MeshBasicMaterial({
        color: 'red',
        transparent: true,
        opacity: 0.5,
    });

// Get Mouse position
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / renderer.domElement.clientWidth * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

// Picking
    // raycaster.setFromCamera(mouse, camera);
    let canvasBounds = canvas.getBoundingClientRect()
    raycaster.setFromCamera(
        {
            x: ((event.clientX - canvasBounds.left) / renderer.domElement.clientWidth) * 2 - 1,
            y: -((event.clientY - canvasBounds.top) / renderer.domElement.clientHeight) * 2 + 1,
        },
        camera
    )
    const intersections = raycaster.intersectObjects(pickableObjects);
    
    // intersection between mouse and material
    const hasCollided = intersections.length !== 0 ;

    // if there is an intersection than highlight the material
    if(!hasCollided) {
        restorePreviousSelection();
        return;
    }

    const firstIntersection = intersections[0];

    const isPreviousSelection = previousSelection.mesh === firstIntersection.object;
    if(isPreviousSelection) return; 

    restorePreviousSelection();

    savePreviousSelction(firstIntersection);

    firstIntersection.object.material = highlightMat;
})

function savePreviousSelction(item) {
    previousSelection.mesh = item.object;
    previousSelection.material = item.object.material;
}

function restorePreviousSelection() {
    if(previousSelection.mesh) {
        previousSelection.mesh.material = previousSelection.material;
        previousSelection.mesh = null;
        previousSelection.material = null;
    }
}


// 9 Load the Dat.GUI Panel

    // //Create a transparency section
    // const TransparencyFolder = cubeFolder.addFolder('Transparent')
    // //Add a transparent option as a panel
    // TransparencyFolder.add(surfacematerial, 'transparent')
    // //Add an opacity panel
    // TransparencyFolder.add(surfacematerial, 'opacity', 0, 1, 0.01)
    // // Load cubeFolder section
    // TransparencyFolder.open()
    // //Declare the different options we want to have for the Side Panel
    // //A BackSide option will allows us to see the interior of the box from the outside
    // const options = {
    //     side: {
    //         "FrontSide": THREE.FrontSide,
    //         "BackSide": THREE.BackSide,
    //         "DoubleSide": THREE.DoubleSide,
    //     }
    // }
    // //Add the options to the panel
    // TransparencyFolder.add(surfacematerial, 'side', options.side).onChange(() => updateMaterial())
    // //Run a fonction so the side option can work correctly
    // function updateMaterial(){
    //     //convert the side option into a number (it won't work if it's a string)
    //     surfacematerial.side = Number(surfacematerial.side)
    //     //update when charging WebGL
    //     material.needsUpdate = true
    // }

    // Camera GUI
    const cameraGui = new GUI()
    //Add a camera distance panel
    const cameraDistanceFolder = cameraGui.addFolder('Distance')
    // cameraFolder.add(camera.position, 'z', 0, 10)
    cameraDistanceFolder.add(cameraControls, 'distance', 1, 50, 1)
    //To open the tabs by default:
    cameraDistanceFolder.open()

// 10 Add GLTF file to the scene

    // 10.1 (optional) Add GUI controls for the GLTF File
        const guiHouse = new GUI()
        //Add a folder for manipulating options
        const HouseFolder = guiHouse.addFolder('House')
        //Load cubeFolder section
        HouseFolder.open()
        //Add a folder conatining 3 rotation panels [x, y, z]
        const HousePositionFolder = HouseFolder.addFolder('Position')

    // 10.2 Load the GLTF File
    
        const loader = new GLTFLoader();
        
        // Get the loader symbol from html
        const loadingScreen = document.getElementById('loader-container');
        // Get the loader text from html
        const progressText = document.getElementById('progress-text');

        const pickableObjects = [];

        // Load the file
        loader.load( '/Items/house/scene.gltf',

            (gltf) => {

                // Add the Geometry to the scene
                    scene.add(gltf.scene);

                // Modify the position of the Geometry
                const displacementVector = new THREE.Vector3(-72, -13, -37);
                gltf.scene.position.copy(displacementVector);

                // Add position controls to the GUI
                HousePositionFolder.add(gltf.scene.position, 'x', -100, 100, 1)
                HousePositionFolder.add(gltf.scene.position, 'y', -100, 100, 1)
                HousePositionFolder.add(gltf.scene.position, 'z', -100, 100, 1)

                // Receive lights and display a shadow for the gltf objects
                gltf.scene.traverse( function(child) {
                    if (child.isMesh){
                        child.castShadow = true; 
                        child.receiveShadow = true;
                    }
                });

                // Add the loader symbol
                loadingScreen.classList.add('hidden');

                // Tools Bar
                    // Get the model3D by name
                    function getbytagname(children_tag_name){
                        let x = [] ;
                        for(var i =0; i < scene.children.length; i++)
                        {
                        if(scene.children[i].name === children_tag_name){
                        x.push(scene.children[i]);
                        }
                        };
                        return x;
                    }
                    const model3D = getbytagname("Sketchfab_Scene");

                    // Fit Camera to the model bounding Box
                    const fitViewButton = document.getElementById("fit-view");
                    fitViewButton.onclick = () => {
                        cameraControls.fitToBox(model3D[0], true, {paddingTop:20, paddingLeft: 0, paddingBottom:0, paddingRight:0});
                        cameraControls.setTarget(0, 0, 0);
                    }

                    // Left View
                    const leftViewButton = document.getElementById("left-view");
                    leftViewButton.onclick = () => {
                        cameraControls.setLookAt(-50, 2.7, 0, 0, 0, 0);
                        cameraControls.fitToBox(model3D[0], true, {paddingTop:2.7, paddingLeft: 0, paddingBottom:0, paddingRight:0});
                    }

                    // Front View
                    const frontViewButton = document.getElementById("front-view");
                    frontViewButton.onclick = () => {
                        cameraControls.setLookAt(0, 2.7, 20, 0, 0, 0);
                        cameraControls.fitToBox(model3D[0], true, {paddingTop:2.7, paddingLeft: 0, paddingBottom:0, paddingRight:0});
                    }
                    
                    // Right View
                    const rightViewButton = document.getElementById("right-view");
                    rightViewButton.onclick = () => {
                        cameraControls.setLookAt(50, 2.7, 0, 0, 0, 0);
                        cameraControls.fitToBox(model3D[0], true, {paddingTop:2.7, paddingLeft: 0, paddingBottom:0, paddingRight:0});
                    }

                    // Back View
                    const backViewButton = document.getElementById("back-view");
                    backViewButton.onclick = () => {
                        cameraControls.setLookAt(0, 2.7, -20, 0, 0, 0);
                        cameraControls.fitToBox(model3D[0], true, {paddingTop:2.7, paddingLeft: 0, paddingBottom:0, paddingRight:0});
                    }

                    // Wireframe View
                    const wireframeViewButton = document.getElementById("wireframe-view");
                    const wireframeMaterial = new THREE.MeshBasicMaterial({
                        color: 0x222222,
                        wireframe: true,
                    })
                    let originalMaterials = {}
                    wireframeViewButton.onclick = () => {
                        if (Object.keys(originalMaterials).length === 0) {
                            scene.traverse( function(child) {
                                if (child.isMesh){
                                    originalMaterials[child.name] = child.material;
                                    child.material = wireframeMaterial;
                                }
                                if (child.isPlane){
                                    originalMaterials[child.name] = child.material;                                
                                    child.material = wireframeMaterial;
                                }
                            });
                        }
                    }

                    // Colored View
                    const coloredViewButton = document.getElementById("colored-view");
                    coloredViewButton.onclick = () => {
                        if (Object.keys(originalMaterials).length !== 0) {
                            scene.traverse( function(child) {
                                if (child.isMesh){
                                    child.material = originalMaterials[child.name];
                                }
                                if (child.isPlane){
                                    child.material = originalMaterials[child.name];                               
                                }
                            });
                            originalMaterials = {} ;
                        }
                    }

                    // Remove measurements
                    const deleteMeasurementsButton = document.getElementById("deleteMeasurements");
                    deleteMeasurementsButton.onclick = () => {
                        let e = document.querySelectorAll(".measurementLabel");
                        e.forEach(tag => {
                            tag.innerHTML = "";
                        });
                        scene.traverse( function(child) {
                            if (child.isLineSegments) {
                                if (child.name == 'measurementLine') {
                                    scene.remove(child)
                                }
                            }
                        });
                    }

                // Objects we want to pick
                gltf.scene.traverse( function(node) {
                    if (node.isMesh){
                        pickableObjects.push(node);
                    }
                });

            },
            (progress) => {
                const progressPercent = progress.loaded / progress.total * 100;
                const formatted = Math.trunc(progressPercent); // Remove the decimals
                progressText.textContent = `Loading: ${formatted} %`;
            },
            (error) => {
                console.log(error);
            })

// Drag Controls
    const controls = new DragControls([cube], camera, renderer.domElement)
    controls.addEventListener('dragstart', function (event) {
        event.object.material.opacity = 0.5;
        cameraControls.enabled = false;
    })
    controls.addEventListener('dragend', function (event) {
        event.object.material.opacity = 1
        cameraControls.enabled = true;
    })

// Measurement Tool
    let ctrlDown = false
    let lineId = 0
    let line = Line
    let drawingLine = false
    const measurementLabels = {}

    window.addEventListener('keydown', function (event) {
        if (event.key === 'Control') {
            ctrlDown = true
            cameraControls.enabled = false
            renderer.domElement.style.cursor = 'crosshair'
        }
    })

    window.addEventListener('keyup', function (event) {
        if (event.key === 'Control') {
            ctrlDown = false
            cameraControls.enabled = true
            renderer.domElement.style.cursor = 'pointer'
            if (drawingLine) {
                //delete the last line because it wasn't committed
                scene.remove(line)
                scene.remove(measurementLabels[lineId])
                drawingLine = false
            }
        }
    })

    renderer.domElement.addEventListener('pointerdown', onClick, false)
    function onClick() {
        if (ctrlDown) {
            let canvasBounds = canvas.getBoundingClientRect()
            raycaster.setFromCamera(
                {
                    x: ((event.clientX - canvasBounds.left) / renderer.domElement.clientWidth) * 2 - 1,
                    y: -((event.clientY - canvasBounds.top) / renderer.domElement.clientHeight) * 2 + 1,
                },
                camera
            )
            intersects = raycaster.intersectObjects(pickableObjects, false)
            if (intersects.length > 0) {
                if (!drawingLine) {
                    //start the line
                    const points = []
                    points.push(intersects[0].point)
                    points.push(intersects[0].point.clone())
                    const geometry = new THREE.BufferGeometry().setFromPoints(
                        points
                    )
                    line = new THREE.LineSegments(
                        geometry,
                        new THREE.LineBasicMaterial({
                            color: 0xffffff,
                            transparent: true,
                            opacity: 0.75,
                        })
                    )
                    line.name = 'measurementLine'
                    line.frustumCulled = false
                    scene.add(line)

                    const measurementDiv = document.createElement(
                        'div'
                    )
                    measurementDiv.className = 'measurementLabel'
                    measurementDiv.innerText = '0.0m'
                    const measurementLabel = new CSS2DObject(measurementDiv)
                    measurementLabel.position.copy(intersects[0].point)
                    measurementLabels[lineId] = measurementLabel
                    scene.add(measurementLabels[lineId])
                    drawingLine = true
                } else {
                    //finish the line
                    const positions = line.geometry.attributes.position.array
                    positions[3] = intersects[0].point.x
                    positions[4] = intersects[0].point.y
                    positions[5] = intersects[0].point.z
                    line.geometry.attributes.position.needsUpdate = true
                    lineId++
                    drawingLine = false
                }
            }
        }
    }

    document.addEventListener('mousemove', onDocumentMouseMove, false)
    function onDocumentMouseMove(event) {
        event.preventDefault()


        mouse.x = event.clientX / renderer.domElement.clientWidth * 2 - 1;
        mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        if (drawingLine) {
            let canvasBounds = canvas.getBoundingClientRect()
            raycaster.setFromCamera(
                {
                    x: ((event.clientX - canvasBounds.left) / renderer.domElement.clientWidth) * 2 - 1,
                    y: -((event.clientY - canvasBounds.top) / renderer.domElement.clientHeight) * 2 + 1,
                },
                camera
            )
            intersects = raycaster.intersectObjects(pickableObjects, false)
            if (intersects.length > 0) {
                const positions = line.geometry.attributes.position.array
                const v0 = new THREE.Vector3(
                    positions[0],
                    positions[1],
                    positions[2]
                )
                const v1 = new THREE.Vector3(
                    intersects[0].point.x,
                    intersects[0].point.y,
                    intersects[0].point.z
                )
                positions[3] = intersects[0].point.x
                positions[4] = intersects[0].point.y
                positions[5] = intersects[0].point.z
                line.geometry.attributes.position.needsUpdate = true
                const distance = v0.distanceTo(v1)
                measurementLabels[lineId].element.innerText = distance.toFixed(2) + 'm';
                measurementLabels[lineId].position.lerpVectors(v0, v1, 0.5);
            }
        }
    }