
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js'

/**
 * This class contains the application object
 */
class MyApp  {
    /**
     * the constructor
     */
    constructor() {
        this.scene = null
        this.stats = null

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 20

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.contents = null

        this.follow = false;
        this.is_obstacles_picker_active = false;
        this.choosing_obstacles_position = false;
        this.is_car_picker_active = false;
        this.is_initial_menu_active = true;
        this.game_over = false;

        // for game state
        this.gameKeys = { Space: false, Escape: false };

        // for shaders:
        this.clock = new THREE.Clock()
        this.clock.start()
    }
    /**
     * initializes the application
     */
    init() {
                
        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x101010 );

        this.stats = new Stats()
        this.stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        this.initCameras();
        this.setActiveCamera('PerspectiveDefault')

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.size = 4096;

        // Configure renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild( this.renderer.domElement );

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false );

        console.log("Active camera:", this.activeCamera)
        this.setActiveCamera('PerspectiveDefault')
        
    }

    /**
     * initializes all the cameras
     */
    initCameras() {

        
        const aspect = window.innerWidth / window.innerHeight;

        // Create a basic perspective camera
        const perspective1 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspective1.position.set(20,15,0)
        perspective1.name = "default";

        this.cameras['PerspectiveDefault'] = perspective1;


        // Create a basic perspective camera
        const perspective2 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspective2.position.set(-10, 10, -20);
        perspective2.lookAt(new THREE.Vector3(-10, 3, -25));
        perspective2.name = "obstaclesCam";

        this.cameras['obstaclesCam'] = perspective2;


        // defines the frustum size for the orthographic cameras
        /*const left = -this.frustumSize / 2 * aspect
        const right = this.frustumSize /2 * aspect 
        const top = this.frustumSize / 2 
        const bottom = -this.frustumSize / 2
        const near = -this.frustumSize /2
        const far =  this.frustumSize

        // create a left view orthographic camera
        const orthoLeft = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoLeft.up = new THREE.Vector3(0,1,0);
        orthoLeft.position.set(-this.frustumSize /4,0,0) 
        orthoLeft.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Left'] = orthoLeft

        // create a top view orthographic camera
        const orthoTop = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoTop.up = new THREE.Vector3(0,0,1);
        orthoTop.position.set(0, this.frustumSize /4, 0) 
        orthoTop.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Top'] = orthoTop

        // create a front view orthographic camera
        const orthoFront = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoFront.up = new THREE.Vector3(0,1,0);
        orthoFront.position.set(0,0, this.frustumSize /4) 
        orthoFront.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Front'] = orthoFront */
    }

    /**
     * sets the active camera by name
     * @param {String} cameraName 
     */
    setActiveCamera(cameraName) {   
        //console.log("Setting active camera", cameraName)
        this.activeCameraName = cameraName
        //console.log("1 - Active camera:", this.activeCamera)
        this.activeCamera = this.cameras[this.activeCameraName]
        //console.log("2 - Active camera:", this.activeCamera)
        //console.log("Active camera name:", this.activeCameraName)

        //this.activeCamera = camera;
    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {
        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName];
            document.getElementById("camera").innerHTML = this.activeCameraName;
    
            // call on resize to update the camera aspect ratio among other things
            this.onResize();
    
            // are the controls yet?
            if (this.controls === null) {
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);
                this.controls.enableZoom = true;
                this.controls.update();
            } else {
                this.controls.object = this.activeCamera;
            }

        }

        // Update the camera position based on the car's position FOLLOW
        if (this.is_initial_menu_active) {
            this.activeCamera = this.contents.menu_cam;
        }
        else if (this.is_car_picker_active) {
            this.activeCamera = this.contents.car_picker_cam;
        }
        else if (this.is_obstacles_picker_active) {
            this.activeCamera = this.contents.obstacles_picker_cam;
        }
        else if (this.choosing_obstacles_position) {
            this.activeCamera = this.contents.track_picker_cam;
        }
        else if (this.game_over) {
            this.activeCamera = this.contents.podium_cam;
        }
        else if (this.follow) {
            if (this.contents && this.contents.vehicle) {
                this.activeCamera = this.contents.vehicle.cam;
            }
        }
        else {
            this.setActiveCamera('PerspectiveDefault');
        }

       
    
        
    }
    

    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }
    /**
     * 
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * @param {MyGuiInterface} contents the gui interface object
     */
    setGui(gui) {   
        this.gui = gui
    }

    addCameras(cameras){
        cameras.forEach(camera => {
            if (!this.cameras.includes(camera)) {
                this.cameras[camera.name] = camera;
            }
        });

        

        this.setActiveCamera(Object.keys(this.cameras)[1])

        delete this.cameras['PerspectiveDefault'];


    }

    toggleWireframe(on)
    {
        this.contents.wireframemode = on;
        this.contents.changeMaterial();
    }

    toggleFollow(value) {
        console.log("Valuee: ",value);
        this.follow = value;
    }

    getActiveCamera() {
        return this.cameras[this.activeCameraName]
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
    */
    render () {


        this.stats.begin()
        this.updateCameraIfRequired()
        

        // update the animation if contents were provided
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.contents.update()
        } 

        

        // required if controls.enableDamping or controls.autoRotate are set to true
        this.controls.update();

        // render the scene

        this.renderer.clear();
        this.renderer.render(this.scene, this.activeCamera);
        

        // subsequent async calls to the render loop
        requestAnimationFrame( this.render.bind(this) );


        this.lastCameraName = this.activeCameraName
        this.stats.end()
        
    }
}


export { MyApp };