import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyReader } from './MyReader.js';
import { BVHNode, buildBVH, traverseBVH } from './BVHNode.js';
import { MyPowerUpObject } from './objects/MyPowerUp.js';
import { MyObstacleObject } from './objects/MyObstacle.js';
import { MyReaderXML } from './MyReaderXML.js';
import { Particle } from './Particle.js';
import { MyShader } from './MyShader.js';
import { MyCloud } from './objects/MyCloud.js';
import { MyBox } from './objects/MyBox.js';
import { MyLake } from './objects/MyLake.js';
import { MyVehicle } from './MyVehicle.js';
import { SceneCollider } from './SceneCollider.js';
import { MyOutdoor } from './objects/MyOutdoor.js';
import {MySphere} from './objects/MySphere.js';
import {MyMenu} from './MyMenu.js';
import {MyPodium} from './objects/MyPodium.js';
import {GhostBillboard} from './objects/GhostBillboard.js';
import { MyRelief } from './MyRelief.js';





/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null
        this.gameReader = new MyReader(this.app);
        this.xml_reader = new MyReaderXML(this.app);
        this.scene_collider = new SceneCollider();
        this.bvhRoot = null;
        this.sceneBVH = null;


        // initialize vars
        this.bvsRootPowerUps = null;
        this.explosions = []
        this.cameras = [];
        this.group = null;   
        this.show_picker = false;
        this.animationPaused = true; // start with animation paused
        this.activePowerUp = null;
        this.activeObstacle = null;
        this.can_start = false;
        this.collisionCooldown = 0;
        this.lightIntensity = 3;
        this.validSpeedInput = false;
        this.total_time = null;
        this.isAnyPowerUpActive = false;
        this.isAnyObstacleActive = false;
        this.vehicle_id = 0;
        this.choose_obst_point = false;
        this.can_count_lap = false;
        this.lapsNumberDefined = true; //default value = 3
        this.player_vehicle_selected = false;
        this.vehicle1 = new MyVehicle(this.app);
        this.vehicle2 = new MyVehicle(this.app);
        this.vehicle3 = new MyVehicle(this.app);
        this.vehicle4 = new MyVehicle(this.app);
        this.vehicles = [this.vehicle1, this.vehicle2, this.vehicle3, this.vehicle4];
        this.notPickableVehicle = new MyVehicle(this.app);
        this.menu = new MyMenu();
        this.playerNameDefined = true;
        this.player_name = "player1"; //default value
        //LAPS
        this.player_laps = 0;
        this.auto_laps = -1;
        this.total_laps = 3;

    

        this.cenarios = [
            "Clear Sky",
            "Clouded Sky",
            "Fog"
        ]

        this.cars = [
            { id: 1, name: 'Ocean Car', image: './scenes/t01g03/textures/car1.jpg' },
            { id: 2, name: 'Military Jeep', image: './scenes/t01g03/textures/car2.jpg' },
            { id: 3, name: 'Black Rose', image: './scenes/t01g03/textures/car3.jpg' },
            { id: 4, name: 'Test', image: './scenes/t01g03/textures/default.png'}
            // Add more cars as needed
        ];

        this.obstacles4choice = [
            { id: 1, name: 'Low Speed', image: './scenes/t01g03/textures/default.png' },
            { id: 2, name: 'Dark Drive', image: './scenes/t01g03/textures/default.png' },
        ];

        this.gameOverOptions = [
            { id: 1, name: 'Play Again', image: './scenes/t01g03/textures/default.png' },
            { id: 2, name: '[something]', image: './scenes/t01g03/textures/default.png' },
        ];


        this.timeDisplayElement = document.getElementById('timeDisplay');
        this.lapDisplayElement = document.getElementById('lapDisplay');
        this.userInputTextArea = document.getElementById('timeInput');
        this.goBTN = document.getElementById('goBTN');
        this.goBTN.addEventListener('click', () => this.pressButton());
        this.superSpeedPicker = document.getElementById('superSpeedPicker');
        this.ghostPowerAlert = document.getElementById('ghostPowerAlert');
        this.lowSpeedAlert = document.getElementById('lowSpeedAlert');
        this.darkDriveAlert = document.getElementById('darkDriveAlert');
        
        // Car Picking
        this.carPickerTitle = document.getElementById('carPickerTitle');
        this.autoCarPickerTitle = document.getElementById('autoCarPickerTitle');


        this.countdownContainer = document.getElementById('countdown_container');
        this.countdown = document.getElementById('countdown');
        this.chooseObstTitle = document.getElementById('chooseObstTitle');
        this.afterChooseObstTitle = document.getElementById('afterChooseObstTitle');
        this.obstaclePicker = document.getElementById('obstaclePicker');
        this.obstaclePickerTitle = document.getElementById('obstaclePickerTitle');
        this.obstacleOptionsContainer = document.getElementById('obstacleOptionsContainer');

        // Game Over Board
        this.gameOverBoard = document.getElementById('gameOverBoard');
        this.gameOverBoardTitle = document.getElementById('gameOverBoardTitle');
        this.gameOverOptionsContainer = document.getElementById('gameOverOptionsContainer');

        // Laps Board
        this.lapsPicker = document.getElementById('lapsBoard');
        this.lapsInputTextArea = document.getElementById('lapsInput');
        this.nextBTN = document.getElementById('nextBTN');
        this.nextBTN.addEventListener('click', () => this.pressNextButton());

        // Player Name Board
        this.playerNamePicker = document.getElementById('playerNameBoard');
        this.playerNameInputTextArea = document.getElementById('playerNameInput');
        this.playerNameBTN = document.getElementById('playerNameBTN');
        this.playerNameBTN.addEventListener('click', () => this.pressPlayerNameButton());
        


        // CAMERAS

        // Default Camera
        this.default_cam = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        let default_cam_pos = new THREE.Vector3(20, 10, 0); 
        this.default_cam.position.copy(default_cam_pos);
        let default_cam_look = new THREE.Vector3(0, 0, 0);
        this.default_cam.lookAt(default_cam_look);

        // Menu cam
        this.menu_cam = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        let menu_cam_pos = new THREE.Vector3(38.5, 10, 0);
        this.menu_cam.position.copy(menu_cam_pos);
        let menu_cam_look = new THREE.Vector3(40, 10, 0);
        this.menu_cam.lookAt(menu_cam_look);

        // Podium cam
        this.podium_cam = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        let podium_cam_pos = new THREE.Vector3(-35.5, 2, 0);
        this.podium_cam.position.copy(podium_cam_pos);
        let podium_cam_look = new THREE.Vector3(-40, 0.6, 0);
        this.podium_cam.lookAt(podium_cam_look);


        // Car Picker Camera
        this.car_picker_cam = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        let car_picker_cam_pos = new THREE.Vector3(0, 2.5, 38.5); 
        this.car_picker_cam.position.copy(car_picker_cam_pos);
        let car_picker_cam_look = new THREE.Vector3(0, 2.25, 40);
        this.car_picker_cam.lookAt(car_picker_cam_look);


        // Obstacles Picker Camera
        this.obstacles_picker_cam = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        let obstacles_picker_cam_pos = new THREE.Vector3(0, 2, -38); 
        this.obstacles_picker_cam.position.copy(obstacles_picker_cam_pos);
        let obstacles_picker_cam_look = new THREE.Vector3(0, 1.5, -40);
        this.obstacles_picker_cam.lookAt(obstacles_picker_cam_look);

        // Track Camera
        this.track_picker_cam = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        let track_picker_cam_pos = new THREE.Vector3(0.5, 20, 0);
        this.track_picker_cam.position.copy(track_picker_cam_pos);
        let track_picker_cam_look = new THREE.Vector3(0, 0, 0);
        this.track_picker_cam.lookAt(track_picker_cam_look);


        // Picking

        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 1
        this.raycaster.far = 30

        this.pointer = new THREE.Vector2()
        this.intersectedObj = null
        this.pickingColor = "0x00ff00"


        // structure of layers: each layer will contain its objects
        // this can be used to select objects that are pickeable     
        this.availableLayers = ['none', 1, 2, 3]
        this.selectedLayer = this.availableLayers[0]    // change this in interface

        // define the objects ids that are not to be pickeable
        // NOTICE: not a ThreeJS facility
        this.pickableObjIds = [];
      
        //register events
        document.addEventListener(
            //"pointermove",
            // "mousemove",
            "pointerdown",
            this.onPointerMove.bind(this)
        );

        document.addEventListener("mouseover", this.onPointerEnter.bind(this));

        // Start
        this.startAll();

    }

    /**
     * initializes the contents
     */
    init() {

        this.lastFrameTime = Date.now();
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            //this.app.scene.add(this.axis)
        }


        // LIGHT

        // Ambient light for base visibility
        const ambientLight = new THREE.AmbientLight(0x404040);
        //this.app.scene.add(ambientLight);

        // Directional light for additional lighting
        this.directionalLight1 = new THREE.DirectionalLight(0xffffff, this.lightIntensity);
        this.directionalLight1.position.set(1, 1, 1).normalize();
        this.app.scene.add(this.directionalLight1);

        this.directionalLight2 = new THREE.DirectionalLight(0xffffff, this.lightIntensity);
        this.directionalLight2.position.set(-1, 1, -1).normalize();
        this.app.scene.add(this.directionalLight2);

        // outdoors
        this.createOutdoors();

        /*
        let test_relief = new MyRelief();

        test_relief.mesh.position.set(0, 10, 0);

        this.app.scene.add(test_relief.mesh);
        */

        //sprites
        this.createSprites();

        

        //this.debugKeyFrames();

        // SCENE MODE
        this.xml_reader.load_xml("scenes/t01g03/haunted_scene.xml");
        
        this.current_cenario = this.xml_reader.cenario;
        let cenarioCopy = this.current_cenario.clone();
        this.scene_collider.traverseScene(cenarioCopy);
        this.scene_collider.computeCollisionBoxes();
        //this.debugSceneColliders();
        this.app.scene.add(this.current_cenario);


        // SHADERS

        // Materials and textures initialization
        const texture1 = new THREE.TextureLoader().load('./scenes/t01g03/textures/white_cloud.jpg' )
        texture1.wrapS = THREE.RepeatWrapping;
        texture1.wrapT = THREE.RepeatWrapping;
        
        // load second texture
        const texture2 = new THREE.TextureLoader().load('./scenes/t01g03/textures/waterMap.jpg' )

        // load third texture
        const texture3 = new THREE.TextureLoader().load('./scenes/t01g03/textures/waterTex.jpg' )
        texture3.wrapS = THREE.RepeatWrapping;
        texture3.wrapT = THREE.RepeatWrapping;

        // shaders initialization
        this.shader = [ 
            new MyShader(this.app, 'Blend textures animated', "load two texture and blend them. Displace them by time   ", "shaders/texture1.vert", "shaders/texture3anim.frag", {
                uSampler1: {type: 'sampler2D', value: texture1 },
                uSampler2: {type: 'sampler2D', value: texture2 },
                normScale: {type: 'f', value: 0.1 },
                displacement: {type: 'f', value: 0.0 },
                normalizationFactor: {type: 'f', value: 1 },
                blendScale: {type: 'f', value: 0.5 },
                timeFactor: {type: 'f', value: 0.0 },
            }),
            new MyShader(this.app, "Normal color shading", "uses vertex normal vector as fragment color", 
                "shaders/rainbow.vert", "shaders/rainbow.frag", {            
            }),
            new MyShader(this.app, 'Blend textures animated', "load two texture and blend them. Displace them by time   ", "shaders/texture1.vert", "shaders/texture3anim.frag", {
                uSampler1: {type: 'sampler2D', value: texture3 },
                uSampler2: {type: 'sampler2D', value: texture2 },
                normScale: {type: 'f', value: 0.1 },
                displacement: {type: 'f', value: 0.0 },
                normalizationFactor: {type: 'f', value: 1 },
                blendScale: {type: 'f', value: 0.5 },
                timeFactor: {type: 'f', value: 0.0 },
            }),
            new MyShader(this.app, 'Blend textures animated', "load two texture and blend them. Displace them by time   ", "shaders/powerUp.vert", "shaders/powerUp.frag", {
                uSampler1: {type: 'sampler2D', value: texture3 },
                uSampler2: {type: 'sampler2D', value: texture2 },
                normScale: {type: 'f', value: 0.1 },
                displacement: {type: 'f', value: 0.0 },
                normalizationFactor: {type: 'f', value: 1 },
                blendScale: {type: 'f', value: 0.5 },
                timeFactor: {type: 'f', value: 0.0 },
            }),
        ];
        
        this.waitForShaders();

        // Create clouds
        this.shader_clouds = [ 
            new MyCloud(this.app, 5, [0.5, 0.25, 1], [-10, 10, 5]),
            new MyCloud(this.app, 5, [0.3, 0.2, 0.75], [-8, 9, 9]),
            new MyCloud(this.app, 5, [0.4, 0.2, 0.75], [-15, 12, 18]),
            new MyCloud(this.app, 5, [0.4, 0.2, 0.75], [15, 11, -12]),
            new MyCloud(this.app, 5, [0.3, 0.15, 0.65], [12, 9, -9]),
        ]
        this.clouds_velocities = [
            -0.01,
            -0.015,
            0.01,
            0.015,
            0.005
        ]

        this.shader_box = new MyBox(this.app, [-12, 2, 10]);


        let lakePoints = [
            [ // u = 0
                [0, 0, 0],
                [0, 0, 1],
                [0, 0, 2],
                [-1, 0, 3],
                [0, 0, 4],
            ],
            [ // u = 1
                [1, 0, -1],
                [1, 0, 1],
                [1, 0, 2],
                [1, 0, 3],
                [1, 0, 5],
            ],	
            [ // u = 2
                [1.5, 0, 0.5],
                [1.5, 0, 1],
                [0.5, 0, 2],
                [2, 0, 3],
                [1.5, 0, 4],
            ],			
        ]

        this.shader_lake = new MyLake(this.app, lakePoints, 2, 4, [6, -0.34, -1.5]);

        this.shader_sphere = new MySphere(this.app);



        //////////////////////////////// DEBUG OBJECTS ///////////////////////

        this.gameReader.init();

        this.vehicle = this.gameReader.vehicle;
        this.auto_vehicle = this.gameReader.auto_vehicle;
        this.track = this.gameReader.track;
        this.routePoints = this.gameReader.routePoints;

        //////////////////// DEBUG COLLISIONS /////////////////////

        this.collisionCooldown = 0; // start untouchable so it doesnt crash right in the beginning
        this.lapCooldown = 0; // cant finish a lap right after finish the previous one
        this.auto_lapCooldown = 0; // cant finish a lap right after finish the previous one


        // Fill Pickers

        this.xml_reader.load_xml_pickerObj("scenes/t01g03/lowSpeedObstacle.xml", "lowSpeedObstacle"); 
        let lowSpeedObstacle = this.xml_reader.lowSpeedObstacle_mesh;
        this.app.scene.add(lowSpeedObstacle);

        this.xml_reader.load_xml_pickerObj("scenes/t01g03/darkDriveObstacle.xml", "darkDriveObstacle"); 
        let darkDriveObstacle = this.xml_reader.darkDriveObstacle_mesh;
        this.app.scene.add(darkDriveObstacle);


        this.xml_reader.load_xml_pickerObj("scenes/t01g03/stage_picker.xml", "stagePicker"); 

        let stagePicker = this.xml_reader.stagePicker_mesh;
        let obstacleStagePicker = stagePicker.clone();
        obstacleStagePicker.position.z = -45;
        let carStagePicker = stagePicker.clone();
        carStagePicker.position.z = 45;
        let winnerStagePicker = stagePicker.clone();
        winnerStagePicker.position.x = -45;

        this.app.scene.add(carStagePicker);
        this.app.scene.add(obstacleStagePicker);
        this.app.scene.add(winnerStagePicker);



        this.vehicle1.loadPickingCar("scenes/t01g03/car1.xml", "car1");
        this.vehicle2.loadPickingCar("scenes/t01g03/car2.xml", "car2");
        this.vehicle3.loadPickingCar("scenes/t01g03/car3.xml", "car3");
        this.vehicle4.loadPickingCar("scenes/t01g03/car4.xml", "car4");

        let decrement = 0;
        this.vehicles.forEach(vehicle => {
            vehicle.mesh.position.set(4.5 - decrement, 0.35, 45);
            vehicle.mesh.rotation.set(0, Math.PI, 0);
            vehicle.mesh.scale.set(2, 2, 2);
            this.app.scene.add(vehicle.mesh);
            decrement += 3;       
        });


        this.menu.mesh.position.set(45, 10, 0);
        this.menu.mesh.rotation.set(0, -3*Math.PI/2, 0);
        this.app.scene.add(this.menu.mesh);

        // podium island

        this.podium = new MyPodium();
        this.podium.mesh.position.set(-45, 0, 0);
        this.app.scene.add(this.podium.mesh);
        
        this.createCollisionBoxes();

    }

    createCollisionBoxes() {

        // loaded from xml
        this.sceneBoundingBoxes = this.xml_reader.sceneBoundingBoxes;


        // added by hand
        // lake 1
        const forbidBoundingBox_geometry1 = new THREE.BoxGeometry(3, 1, 10.5);
        let forbidBoundingBox_mesh = new THREE.Mesh(forbidBoundingBox_geometry1);
        forbidBoundingBox_mesh.position.set(4, 0.5, 2.75)
        forbidBoundingBox_mesh.rotation.set(0, -Math.PI/40, 0)
        
        let forbidBoundingBox = new THREE.Box3();
        forbidBoundingBox.setFromObject(forbidBoundingBox_mesh);      
        this.sceneBoundingBoxes.push(forbidBoundingBox)

        // lake 2
        const forbidBoundingBox_geometry2 = new THREE.BoxGeometry(3, 1, 6);
        forbidBoundingBox_mesh = new THREE.Mesh(forbidBoundingBox_geometry2);
        forbidBoundingBox_mesh.position.set(2.5, 0.5, 6)
        
        forbidBoundingBox = new THREE.Box3();
        forbidBoundingBox.setFromObject(forbidBoundingBox_mesh);      
        this.sceneBoundingBoxes.push(forbidBoundingBox)


        // house
        const forbidBoundingBox_geometry3 = new THREE.BoxGeometry(4, 1, 4);
        forbidBoundingBox_mesh = new THREE.Mesh(forbidBoundingBox_geometry3);
        forbidBoundingBox_mesh.position.set(-12, 0.5, 10)
        
        forbidBoundingBox = new THREE.Box3();
        forbidBoundingBox.setFromObject(forbidBoundingBox_mesh);      
        this.sceneBoundingBoxes.push(forbidBoundingBox)

        // start outdoor
        const forbidBoundingBox_geometry4 = new THREE.BoxGeometry(0.5, 1, 0.5);
        forbidBoundingBox_mesh = new THREE.Mesh(forbidBoundingBox_geometry4);
        forbidBoundingBox_mesh.position.set(9.85, 0.5, 3)
        
        forbidBoundingBox = new THREE.Box3();
        forbidBoundingBox.setFromObject(forbidBoundingBox_mesh);      
        this.sceneBoundingBoxes.push(forbidBoundingBox)

        forbidBoundingBox_mesh = new THREE.Mesh(forbidBoundingBox_geometry4);
        forbidBoundingBox_mesh.position.set(6.1, 0.5, 3)
        
        forbidBoundingBox = new THREE.Box3();
        forbidBoundingBox.setFromObject(forbidBoundingBox_mesh);      
        this.sceneBoundingBoxes.push(forbidBoundingBox)

        // second outdoor
        forbidBoundingBox_mesh = new THREE.Mesh(forbidBoundingBox_geometry4);
        forbidBoundingBox_mesh.position.set(-2.85, 0.5, 0)
        
        forbidBoundingBox = new THREE.Box3();
        forbidBoundingBox.setFromObject(forbidBoundingBox_mesh);      
        this.sceneBoundingBoxes.push(forbidBoundingBox)


        // show box helpers
        this.wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        this.sceneBoundingBoxes.forEach(box => {
            const meshBoundingBoxHelper = new THREE.Box3Helper(box, this.wireframeMaterial);
            //this.app.scene.add(meshBoundingBoxHelper);
        });

    }


    checkKeyEvents(){

        // Add event listeners for keydown  events
        document.addEventListener('keydown', onDocumentKeyDown, false);

        // Define variables to store the state of each key
        let keys = this.app.gameKeys;

        // Function to handle keydown events
        function onDocumentKeyDown(event) {
            const keyCode = event.code;
            console.log("KEY PRESSED: ", keyCode)
            if (keys.hasOwnProperty(keyCode)) {
                console.log("here2")

                keys[keyCode] = !keys[keyCode];
            }
        }

        // Update function for manual control
        const updateGameState = () => {

            // Check which keys are pressed and update the vehicle's position accordingly
            this.animationPaused = keys.Space;
            if (this.animationPaused) {
                //console.log("--- GAME PAUSED ---");           
            }

        };

        
        const update = () => {            

            updateGameState();

            // Request the next animation frame
            requestAnimationFrame(update);

        };

        // Start the update loop
        update();

    }


    chooseLapsNumber() {

        // Get user input from the text area
        let userLapsInput = this.lapsInputTextArea.value;
        console.log("userLapsInput: ", userLapsInput)
        
        if (userLapsInput > 0 && userLapsInput <= 10){
            this.validLapsInput = true;
            this.total_laps = userLapsInput;
        }
        else {
            this.validLapsInput = false;
        }

    }

    choosePlayerName() {

        // Get user input from the text area
        let playerNameInput = this.playerNameInputTextArea.value;
        console.log("playerNameInput: ", playerNameInput)
        
        if (playerNameInput.length <= 8 && playerNameInput.length >= 4){
            this.validPlayerNameInput = true;
            this.playerName = playerNameInput;
        }
        else {
            this.validPlayerNameInput = false;
        }

    }

    pressPlayerNameButton() {

        if (this.validPlayerNameInput) {
            this.playerNameDefined = true;
            this.playerNamePicker.style.display = 'none';

            // Create a new laps text mesh
            this.menu.createTextMesh(`PLAYER NAME: ${this.playerName}`, 0.6).then((newNameText) => {
                newNameText.position.z = 0.51;
                newNameText.scale.set(0.3, 0.4, 1);

                this.menu.nameButton.remove(this.menu.nameButton.children[2]); // Remove the old text mesh
                this.menu.nameButton.add(newNameText); // Add the new text mesh
            });
        }
    }

    changeCenario(value){
        console.log("current cenario: ", value)

        if (value == "Clear Sky"){
            // remove fog
            this.app.scene.fog = null;

            // remove clouds
            for (let i = 0; i < this.shader_clouds.length; i++){
                this.app.scene.remove(this.shader_clouds[i].mesh)
            }
        }
        else if (value == "Clouded Sky") {
            // remove fog
            this.app.scene.fog = null;

            // add clouds
            for (let i = 0; i < this.shader_clouds.length; i++){
                this.app.scene.add(this.shader_clouds[i].mesh)
            }
        }
        else if (value == "Fog") {

            // remove clouds
            for (let i = 0; i < this.shader_clouds.length; i++){
                this.app.scene.remove(this.shader_clouds[i].mesh)
            }

            // Add fog:
            //const fogColor = new THREE.Color(0xffffff);
            const fogColor = new THREE.Color(0xc6ff94);
            const near = 1;
            const far = 35;
            const linearFog = new THREE.Fog(fogColor, near, far);
            this.app.scene.fog = linearFog;
        }

        
    }

    createOutdoors() {

        let info1 = {
            'Time': '0',
            'Power up active': 'none',
            'Game State': 'Running',
        };

        this.outdoor1 = new MyOutdoor(info1, 6);

        this.outdoor1.setPosition(0, 4, 0);
        this.outdoor1.mesh.rotation.y = Math.PI

        this.app.scene.add(this.outdoor1.mesh);

        let info2 = {

            'Lap': `0/${this.total_laps}`,
        }

        this.outdoor2 = new MyOutdoor(info2, 4);

        this.outdoor2.setPosition(8, 3, 3);

        this.app.scene.add(this.outdoor2.mesh);

        // for the car picker

        let info3 = {
            'Your car': 'none',
            'Enemy car': 'none',
        }

        this.outdoor3 = new MyOutdoor(info3, 4);
        this.outdoor3.mesh.rotation.y = Math.PI

        this.outdoor3.mesh.children[0].scale.set(1.5, 2.5, 1);
        this.outdoor3.mesh.children[1].scale.set(1, 1, 1);

        console.log("this.outdoor3.mesh", this.outdoor3.mesh)
        this.outdoor3.setPosition(0, 3, 48);

        this.app.scene.add(this.outdoor3.mesh);

        // for the obstacle picker

        let info4 = {
            'Obstacle': 'none',
        }

        this.outdoor4 = new MyOutdoor(info4, 4);

        this.outdoor4.setPosition(0, 3, -48);

        this.app.scene.add(this.outdoor4.mesh);


        

    }

    createSprites() {
        
        let numberOfGhosts = 5; 
    
        // Define the area limits
        let minX = -18;
        let maxX = -22;
        let minY = 2;
        let maxY = 5;
        let minZ = -12;
        let maxZ = 0;
    
        // Loop to create and position ghosts
        for (let i = 0; i < numberOfGhosts; i++) {
            const ghost = new GhostBillboard();
            this.app.scene.add(ghost.sprite);
    
            // Randomly position ghosts within the specified area
            const posX = THREE.MathUtils.randFloat(minX, maxX);
            const posY = THREE.MathUtils.randFloat(minY, maxY);
            const posZ = THREE.MathUtils.randFloat(minZ, maxZ);
    
            ghost.sprite.position.set(posX, posY, posZ);
        }

        numberOfGhosts = 3; 
    
        // Define the area limits
        minX = 4;
        maxX = 9;
        minY = 2;
        maxY = 5;
        minZ = 18;
        maxZ = 22;

        // Loop to create and position ghosts
        for (let i = 0; i < numberOfGhosts; i++) {
            const ghost = new GhostBillboard();
            this.app.scene.add(ghost.sprite);
    
            // Randomly position ghosts within the specified area
            const posX = THREE.MathUtils.randFloat(minX, maxX);
            const posY = THREE.MathUtils.randFloat(minY, maxY);
            const posZ = THREE.MathUtils.randFloat(minZ, maxZ);
    
            ghost.sprite.position.set(posX, posY, posZ);
        }

        const house_ghost = new GhostBillboard();
        this.app.scene.add(house_ghost.sprite);
        house_ghost.sprite.position.set(-8, 1, 10);
        //house_ghost.sprite.position.set(8, 1, 5); // -> use to signal positions in debugging



    }
    

    /*
    *
    * Only object from selected layer will be eligible for selection
    * when 'none' is selected no layer is active, so all objects can be selected
    */
    updateSelectedLayer() {
        this.raycaster.layers.enableAll()
        if (this.selectedLayer !== 'none') {
            const selectedIndex = this.availableLayers[parseInt(this.selectedLayer)]
            this.raycaster.layers.set(selectedIndex)
        }
    }

    /*
    * Update the color of selected object
    *
    */
    updatePickingColor(value) {
        this.pickingColor = value.replace('#', '0x');
    }

    /*
    * Change the color of the first intersected object
    *
    */
    changeColorOfFirstPickedObj(obj) {
        if (this.lastPickedObj != obj) {
            if (this.lastPickedObj)
                this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
            this.lastPickedObj = obj;
            this.lastPickedObj.currentHex = this.lastPickedObj.material.color.getHex();
            this.lastPickedObj.material.color.setHex(this.pickingColor);
        }
    }

    /*
     * Restore the original color of the intersected object
     *
     */
    restoreColorOfFirstPickedObj() {
        if (this.lastPickedObj)
            this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
        this.lastPickedObj = null;
    }

    /*
    * Helper to visualize the intersected object
    *
    */
    pickingHelper(intersects) {


        if (intersects.length > 0) {
            const obj = intersects[0].object

            console.log("-- obj -- (+name)")
            console.log(obj)
            console.log(obj.name)

            console.log("-- this.pickableObjIds --")
            console.log(this.pickableObjIds)


  
            if (this.pickableObjIds.includes(obj.name)) {
                this.changeColorOfFirstPickedObj(obj)
            }
            else{
                this.restoreColorOfFirstPickedObj()
                console.log("Object cannot be picked !")
            }
        } else {
            this.restoreColorOfFirstPickedObj()
        }
    }

    transverseRaycastInitialMenu(intersects) {

        const obj = intersects[0].object;

        console.log("Menu object: ", obj)
        console.log("this.pickableObjIds: ", this.pickableObjIds)


        if (this.pickableObjIds.includes(obj.name)) {

            //console.log("Menu object: ", obj.name)

            if (obj.name == "playButton"){

                console.log("menu playButton pressed")

                this.menu.pressButton(obj.parent);
            }
            if (obj.name == "difficultyButton")
            {
                if (this.playerNameDefined && this.lapsNumberDefined){
                    this.menu.pressButton(obj.parent);
                }
            }
            if (obj.name == "nameButton")
            {
                if (this.lapsNumberDefined){
                    this.playerNameDefined = false;
                    this.playerNamePicker.style.display = 'flex';
                }
            }
            if (obj.name == "lapButton")
            {
                if (this.playerNameDefined){
                    this.lapsNumberDefined = false;
                    this.lapsPicker.style.display = 'flex';
                }
            }
            if (obj.name == "startButton"){ 
                if (this.playerNameDefined && this.lapsNumberDefined){
                    this.menu.pressButton(obj.parent);
                    setTimeout(() => {
                        this.app.is_initial_menu_active = false;
                        this.focusCameraOnCarToPick();
                    }, 750);
                }
            }

        }
    }

    transverseRaycastPodium(intersects) {

        const obj = intersects[0].object;

        console.log("Podium Menu object: ", obj)
        console.log("Podium this.pickableObjIds: ", this.pickableObjIds)


        if (this.pickableObjIds.includes(obj.name)) {

            console.log("Menu object: ", obj.name)

            if (obj.name == "startButton"){ 
                console.log("menu startButton pressed")
                this.podium.pressButton(obj.parent);
                this.menu.reset();
                setTimeout(() => {
                    this.app.game_over = false;
                    //this.resetState();
                    //this.focusCameraOnInitialMenu();
                    window.location.reload();
                
                }, 1000);

            }

        }
    }

    transverseRaycastAutoCarProperties(intersects) {

        const obj = intersects[0].object;

        if (this.pickableObjIds.includes(obj.name)) {

            if (obj.name == "car1"){ 
                this.auto_vehicle.loadCar("scenes/t01g03/car1.xml");
                this.auto_vehicle.name = "Blue";
            }
            else if (obj.name == "car2"){ 
                this.auto_vehicle.loadCar("scenes/t01g03/car2.xml");
                this.auto_vehicle.name = "Military Jeep";
            }
            else if (obj.name == "car3"){ 
                this.auto_vehicle.loadCar("scenes/t01g03/car3.xml");
                this.auto_vehicle.name = "Black Rose";
            }
            else if (obj.name == "car4"){ 
                this.auto_vehicle.loadCar("scenes/t01g03/car4.xml");
                this.auto_vehicle.name = "Ghosty";
            }

            
            this.app.scene.add(this.player_vehicle); // voltar a adicionar o vehicle do player

            setTimeout(() => {
                this.app.is_car_picker_active = false;
                this.autoCarPickerTitle.style.display = "none";
                this.startCountdown();
            }, 750);

        }
    }

    justUpdateAutoCarName(intersects) {
        const obj = intersects[0].object;

        if (this.pickableObjIds.includes(obj.name)) {

            if (obj.name == "car1"){ 
                this.auto_name = "Blue";
            }
            else if (obj.name == "car2"){ 
                this.auto_name = "Military Jeep";

            }
            else if (obj.name == "car3"){ 
                this.auto_name = "Black Rose";
            }
            else if (obj.name == "car4"){ 
                this.auto_name = "Ghosty";
            }
        }
    }


    transverseRaycastCarsProperties(intersects){

        const obj = intersects[0].object;

        this.player_vehicle_selected = false;
        if (this.pickableObjIds.includes(obj.name)) {

            if (obj.name == "car1"){ 
                this.vehicle.loadCar("scenes/t01g03/car1.xml");
                this.app.scene.remove(this.vehicle1.mesh);   
                this.player_vehicle = this.vehicle1.mesh;
                this.vehicle.name = "Blue";
            }
            else if (obj.name == "car2"){ 
                this.vehicle.loadCar("scenes/t01g03/car2.xml");
                this.app.scene.remove(this.vehicle2.mesh);   
                this.player_vehicle = this.vehicle2.mesh;
                this.vehicle.name = "Military Jeep";
            }
            else if (obj.name == "car3"){ 
                this.vehicle.loadCar("scenes/t01g03/car3.xml");
                this.app.scene.remove(this.vehicle3.mesh);   
                this.player_vehicle = this.vehicle3.mesh;
                this.vehicle.name = "Black Rose";
            }
            else if (obj.name == "car4"){ 
                this.vehicle.loadCar("scenes/t01g03/car4.xml");
                this.app.scene.remove(this.vehicle4.mesh);  
                this.player_vehicle = this.vehicle4.mesh;
                this.vehicle.name = "Ghosty";
            }

            this.player_vehicle_selected = true;
            this.carPickerTitle.style.display = "none";
            this.autoCarPickerTitle.style.display = "block";


        }
    }

    justUpdatePlayerCarName(intersects) {
        const obj = intersects[0].object;

        if (this.pickableObjIds.includes(obj.name)) {

            console.log("entered something")

            if (obj.name == "car1"){ 
                this.car_name = "Blue";
            }
            else if (obj.name == "car2"){ 
                this.auto_vehicle.loadCar("scenes/t01g03/car2.xml");
                this.car_name = "Military Jeep";

            }
            else if (obj.name == "car3"){ 
                this.auto_vehicle.loadCar("scenes/t01g03/car3.xml");
                this.car_name = "Black Rose";
            }
            else if (obj.name == "car4"){ 
                this.auto_vehicle.loadCar("scenes/t01g03/car4.xml");
                this.car_name = "Ghosty";
            }
        }
    }


    transverseRaycastObstacleProperties(intersects) {

        const obj = intersects[0].object;

        if (this.pickableObjIds.includes(obj.name)) {

            if (obj.name == "lowSpeedObstacle"){ 
                this.obstacle_id = 1;
            }
            else if (obj.name == "darkDriveObstacle") {
                this.obstacle_id = 2;
            }

            this.choose_obst_point = true;
            this.focusCameraOnTrack();

        }
    }

    /**
     * Print to console information about the intersected objects
     */
    transverseRaycastPlaceObstacleProperties(intersects) { 

        const obj = intersects[0].object;

        if (this.pickableObjIds.includes(obj.name)) {

            //console.log(intersects[0]);
            let pos_x = intersects[0].point.x;
            let pos_y = intersects[0].point.y;
            let pos_z = intersects[0].point.z;

            console.log(this.obstacle_id)
    
            let obstaclePosition = new THREE.Vector3(pos_x, pos_y + 0.3, pos_z);
    
            switch (this.obstacle_id) {
                case 1:
                    const lowSpeedObstacle = {
                        position: obstaclePosition,
                        type: "lowSpeed",
                        material: new THREE.MeshStandardMaterial({
                            color: new THREE.Color(0xff0000),          // Set the base color to blue
                            metalness: 0.5,               // Set to 1 for a fully metallic appearance
                            roughness: 0.2,             // Adjust the roughness for shininess
                            emissive: new THREE.Color(0x330000),         // No emissive color (black)
                            side: THREE.DoubleSide,     // Render both sides of the geometry
                        }),
                        width: 0.25,
                        geometry: new THREE.BoxGeometry(0.9, 0.35, 0.30)
                    }
            
                    this.obstacle_elements.obstaclesPoints.push(lowSpeedObstacle)
                    this.obstacle_elements.numberOfLowSpeedObstacles += 1
                    break;
                case 2:
                    const darkDriveObstacle = {
                        position: obstaclePosition,
                        type: "darkDrive",
                        material: new THREE.MeshStandardMaterial({
                            color: new THREE.Color(0x000000),          // Set the base color to blue
                            metalness: 1,               // Set to 1 for a fully metallic appearance
                            roughness: 0.2,             // Adjust the roughness for shininess
                            emissive: new THREE.Color(0x000000),          // No emissive color (black)
                            side: THREE.DoubleSide,     // Render both sides of the geometry
                            opacity: 0.4, // Adjust the opacity value (0.0 to 1.0)
                            transparent: true, // Enable transparency
                        }),
                        width: 0.25,
                        geometry: new THREE.BoxGeometry(0.35, 0.35, 0.35)
                    }

                    this.obstacle_elements.obstaclesPoints.push(darkDriveObstacle)
                    this.obstacle_elements.numberOfDarkDriveObstacles += 1
                    break;
            
                default:
                    break;
            }
            
            
    
            this.allObjectsArray = [
                ...this.obstacle_elements.obstaclesPoints.map(element => {
                    let obstacle = new MyObstacleObject(this.app);
                    obstacle.buildObstacle(element);
                    return obstacle;
                }),
                ...this.powerUps_elements.powerUpsPoints.map(element => {
                    let powerUp = new MyPowerUpObject(this.app);
                    powerUp.buildPowerUp(element);
                    return powerUp;
                })
            ];
    
    
            this.bvhRoot = buildBVH(this.allObjectsArray, 60);
            let boxMaterial = new THREE.MeshPhongMaterial({ color: 0x5C85BB });
                
            this.bvhRoot.powerUps.forEach(element => {
                let boxHelper = new THREE.Box3Helper(element.collisionBox, boxMaterial);
                boxHelper.position.copy(element.mesh.position);
                boxHelper.visible = true; // Set to true if you want the debug box to be visible by default
                //this.app.scene.add(boxHelper)                    
            });
    
            this.gameReader.showObstacles(this.obstacle_elements.obstaclesPoints);



            this.chooseObstTitle.style.display = 'none';
            this.afterChooseObstTitle.style.display = 'block';

            this.choose_obst_point = false;


            setTimeout(() => {
                this.resetCameraFocus();
                
                this.afterChooseObstTitle.style.display = 'none';

                if (this.activePowerUp == "ghostPower"){
                    this.ghostPowerAlert.style.display = 'block';
                    this.total_time = 10; // pre defined 10 seconds for now
                    this.app.gameKeys['Space'] = false; //this.animationPaused = false;
        
                    // Hide the element after 2 seconds
                    setTimeout(() => {
                        this.ghostPowerAlert.style.display = 'none';
                    }, 3000); // 2000 milliseconds = 2 seconds
                    this.show_picker = false;
                }
                if (this.activePowerUp == "superSpeed"){
                    this.show_superSpeedInput = true;
                }

            }, 2000); // 2000 milliseconds = 2 seconds  

        }
        else{
            console.log("Object cannot be picked !")
        }

        /*
        An intersection has the following properties :
            - object : intersected object (THREE.Mesh)
            - distance : distance from camera to intersection (number)
            - face : intersected face (THREE.Face3)
            - faceIndex : intersected face index (number)
            - point : intersection point (THREE.Vector3)
            - uv : intersection point in the object's UV coordinates (THREE.Vector2)
        */
    }


    onPointerMove(event) {

        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;


        if (this.choose_obst_point){
            this.raycaster.setFromCamera(this.pointer, this.track_picker_cam);
            var intersects = this.raycaster.intersectObjects(this.app.scene.children);
            this.transverseRaycastPlaceObstacleProperties(intersects);
        }
        else if (this.app.is_obstacles_picker_active) {
            this.raycaster.setFromCamera(this.pointer, this.obstacles_picker_cam);
            var intersects = this.raycaster.intersectObjects(this.app.scene.children);
            //this.pickingHelper(intersects);
            this.transverseRaycastObstacleProperties(intersects);
        }
        else if (this.app.is_car_picker_active && !this.player_vehicle_selected){
            this.raycaster.setFromCamera(this.pointer, this.car_picker_cam);
            var intersects = this.raycaster.intersectObjects(this.app.scene.children);
            //this.pickingHelper(intersects);
            this.transverseRaycastCarsProperties(intersects);
        }
        else if (this.app.is_car_picker_active && this.player_vehicle_selected){
            this.raycaster.setFromCamera(this.pointer, this.car_picker_cam);
            var intersects = this.raycaster.intersectObjects(this.app.scene.children);
            //this.pickingHelper(intersects);
            this.transverseRaycastAutoCarProperties(intersects);
        }
        else if (this.app.is_initial_menu_active)
        {
            this.raycaster.setFromCamera(this.pointer, this.menu_cam);
            var intersects = this.raycaster.intersectObjects(this.app.scene.children);
            //this.pickingHelper(intersects);
            console.log("Menu intersecsts: ", intersects)
            this.transverseRaycastInitialMenu(intersects);
        }
        else if (this.app.game_over)
        {
            this.raycaster.setFromCamera(this.pointer, this.podium_cam);
            var intersects = this.raycaster.intersectObjects(this.app.scene.children);
            //this.pickingHelper(intersects);
            console.log("Menu intersecsts: ", intersects)
            this.transverseRaycastPodium(intersects);
        }
       
    }

    onPointerEnter(event) {
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

/*
        if (this.app.is_obstacles_picker_active) {
            this.raycaster.setFromCamera(this.pointer, this.obstacles_picker_catransverseRaycastAutoCarPropertiesm);
            var intersects = this.raycaster.intersectObjects(this.app.scene.children);
            //this.pickingHelper(intersects);
            this.transverseRaycastObstacleProperties(intersects);
        }*/
        if (this.app.is_car_picker_active && !this.player_vehicle_selected){
            this.raycaster.setFromCamera(this.pointer, this.car_picker_cam);
            var intersects = this.raycaster.intersectObjects(this.app.scene.children);
            //this.pickingHelper(intersects);
            this.justUpdatePlayerCarName(intersects);
        }
        else if (this.app.is_car_picker_active && this.player_vehicle_selected){
            this.raycaster.setFromCamera(this.pointer, this.car_picker_cam);
            var intersects = this.raycaster.intersectObjects(this.app.scene.children);
            //this.pickingHelper(intersects);
            
            this.justUpdateAutoCarName(intersects);
        }
    }

    showWinner() {

        this.podium.update(this.winner, this.finish_time, this.vehicle.mesh.clone(), this.auto_vehicle.mesh.clone());
        
    }


    updateCountdown(count) {
        const countdownElement = document.getElementById('countdown');

        if (count == 0) {
            countdownElement.textContent = 'GO!';
        }
        else{
            // Display the countdown
            countdownElement.textContent = count;
        }

    }

    startCountdown() {
        this.countdownContainer.style.display = 'block';
        this.countdown.style.display = 'block';

        let count = 3; // Set the initial countdown value
        this.updateCountdown(count);
    
        const countdownInterval = setInterval(() => {
            count--;
    
            if (count >= 0) {
                this.updateCountdown(count);
            } else {
                clearInterval(countdownInterval);
                // initiate the run when the countdown reaches 0
                this.countdownContainer.style.display = 'none';
                this.countdown.style.display = 'block';


                // INIT ELEMENTS & START GAME
                this.powerUps_elements = this.gameReader.powerUps_elements;
                console.log("powerUPs: ", this.powerUps_elements)

                this.obstacle_elements = this.gameReader.obstacle_elements;
                console.log("obstacles: ", this.obstacle_elements)

                let true_obstacles_points = []
                this.obstacle_elements.obstaclesPoints.forEach(element => {
                    if (element.type == "ghostPower" || element.type == "superSpeed"){
                        // these are not obstacles -> delete them
                    }
                    else{
                        true_obstacles_points.push(element)
                    }
                });
                this.obstacle_elements.obstaclesPoints = true_obstacles_points;
                console.log("cleaned obstacles: ", this.obstacle_elements)

                
                // Combine obstacle and power-up arrays
                this.allObjectsArray = [
                    ...this.obstacle_elements.obstaclesPoints.map(element => {
                        let obstacle = new MyObstacleObject(this.app);
                        obstacle.buildObstacle(element);
                        return obstacle;
                    }),
                    ...this.powerUps_elements.powerUpsPoints.map(element => {
                        let powerUp = new MyPowerUpObject(this.app);
                        powerUp.buildPowerUp(element);
                        return powerUp;
                    })
                ];

                console.log("+++allObjectsArray: ", this.allObjectsArray)


                this.bvhRoot = buildBVH(this.allObjectsArray, 60);
                let boxMaterial = new THREE.MeshPhongMaterial({ color: 0x5C85BB });
                
                this.bvhRoot.powerUps.forEach(element => {
                    let boxHelper = new THREE.Box3Helper(element.collisionBox, boxMaterial);
                    boxHelper.position.copy(element.mesh.position);
                    boxHelper.visible = true; // Set to true if you want the debug box to be visible by default
                    //this.app.scene.add(boxHelper)                    
                });


                this.scene_colliders = [];
                this.scene_colliders.push(this.outdoor1.rightPilar);
                this.scene_colliders.push(this.outdoor1.leftPilar);
                this.scene_colliders.push(this.outdoor2.rightPilar);
                this.scene_colliders.push(this.outdoor2.leftPilar);

                console.log("OUTDOOR COL: ", this.scene_colliders)
    
    
                this.scenebvh = buildBVH(this.scene_colliders, 60);

                this.lapDisplayElement.style.display = 'block';
                this.can_start = true;
                //this.app.gameKeys['Space'] = false; //this.animationPaused = false; // nao era preciso fazer que já é o default

                this.checkKeyEvents();
                this.animatePath();
                //this.setInitialPosition();
                this.animatePlayer();
                this.animateAutoPath();
            }
        }, 1000); // Update every 1000 milliseconds (1 second)
    }
    
    pressNextButton() {

        if (this.validLapsInput) {
            this.lapsNumberDefined = true;
            this.lapsPicker.style.display = 'none';

            // Create a new laps text mesh
            this.menu.createTextMesh(`NUMBER OF LAPS: ${this.total_laps}`, 0.6).then((newLapsText) => {
                newLapsText.position.z = 0.51;
                newLapsText.scale.set(0.3, 0.4, 1);

                this.menu.lapButton.remove(this.menu.lapButton.children[2]); // Remove the old text mesh
                this.menu.lapButton.add(newLapsText); // Add the new text mesh
            });
        }
    }

    startAll(){
        this.focusCameraOnInitialMenu();
    }

    resetState() {

        this.animationPaused = true;
        this.activePowerUp = null;
        this.activeObstacle = null;
        this.can_start = false;
        this.collisionCooldown = 0;
        this.validSpeedInput = false;
        this.total_time = null;
        this.isAnyPowerUpActive = false;
        this.isAnyObstacleActive = false;
        this.vehicle_id = 0;
        this.choose_obst_point = false;
        this.lapsNumberDefined = true; //default value = 3
        this.player_vehicle_selected = false;

        this.player_laps = 0;
        this.auto_laps = 0;
        this.total_laps = 3;

        this.pickableObjIds = [];

        this.podium.reset();

        this.startAll();

        this.collisionCooldown = 0; // start untouchable so it doesnt crash right in the beginning
        this.lapCooldown = 0; // cant finish a lap right after finish the previous one
        this.auto_lapCooldown = 0; // cant finish a lap right after finish the previous one

        let decrement = 0;
        this.vehicles.forEach(vehicle => {
            vehicle.mesh.position.set(4.5 - decrement, 0.35, 45);
            vehicle.mesh.rotation.set(0, Math.PI, 0);
            vehicle.mesh.scale.set(2, 2, 2);
            this.app.scene.add(vehicle.mesh);
            decrement += 3;       
        });


        
    }

    pressButton() {

        if (this.validSpeedInput) {
            this.lapDisplayElement.style.display = 'block';
            this.superSpeedPicker.style.display = 'none';
            this.show_superSpeedInput = false;
            this.app.gameKeys['Space'] = false; //this.animationPaused = false;
            this.show_picker = false;
            this.userInputTextArea.value = "";
        }
    }

    handleSpeedInput() {

        if (!this.choose_obst_point && this.show_superSpeedInput){
            this.resetCameraFocus();
            this.lapDisplayElement.style.display = 'none';
            this.superSpeedPicker.style.display = 'block';

            // Get user input from the text area
            let userInput = this.userInputTextArea.value;
            console.log("userInput: ", userInput)
            
            if (userInput > 0 && userInput <= 30){
                this.validSpeedInput = true;
                this.total_time = userInput;
            }
            else {
                this.validSpeedInput = false;
                this.total_time = null;
            }
        }

    }

    build_obstacleChoice_picker() {

        this.obstaclePicker.style.display = 'block';
        this.obstacleOptionsContainer.style.display = 'flex';

        // Clear existing child elements
        this.obstacleOptionsContainer.innerHTML = '';
        
        this.obstacles4choice.forEach((obstacle, index) => {
            const obstacleOption = document.createElement('div');
            obstacleOption.className = 'obstacleOption';
            obstacleOption.innerHTML = `
                <img src="${obstacle.image}" alt="${obstacle.name}" width="100">
                <p>${obstacle.name}</p>`;
            
            // Add a click event listener to handle obstacle selection
            obstacleOption.addEventListener('click', () => this.selectObstacle(index));
    
            this.obstacleOptionsContainer.appendChild(obstacleOption);
        });
    }

    selectObstacle(index) {
        const selectedObstacle = this.obstacles4choice[index];
        console.log(`You selected ${selectedObstacle.id}!`);

        this.obstacle_id = selectedObstacle.id;
        this.choose_obst_point = true;


        // Hide the obstacle picker after an obstacle is selected
        this.obstaclePicker.style.display = 'none';
        this.obstacleOptionsContainer.style.display = 'none';

        this.chooseObstTitle.style.display = 'block';

        this.focusCameraOnTrack();

    }

    build_powerUps_obstacles_pickers() {
    
        if (this.show_picker && !this.app.game_over) { 
            if (this.activePowerUp == "superSpeed"){
                console.log("SHOWING")        
                // Stop the animation
                this.app.gameKeys['Space'] = true; //this.animationPaused = true;
                this.handleSpeedInput();
            }
            else if (this.activePowerUp == "ghostPower"){
                this.lowSpeedAlert.style.display = 'none';
                this.darkDriveAlert.style.display = 'none';
                
            }
            else if (this.activeObstacle == "lowSpeed"){
                this.lowSpeedAlert.style.display = 'block';
                this.total_time = 5; // pre defined 5 seconds for now

                // Hide the element after 2 seconds
                setTimeout(() => {
                    this.lowSpeedAlert.style.display = 'none';
                }, 3000); // 2000 milliseconds = 2 seconds
                this.show_picker = false;

            }
            else if (this.activeObstacle == "darkDrive"){
                this.darkDriveAlert.style.display = 'block';
                this.total_time = 5; // pre defined 5 seconds for now

                // Update the directional light intensity
                this.directionalLight1.intensity = 0.01; 
                this.directionalLight2.intensity = 0.01;   
                //this.pointingCarLight.intensity = 5;
                this.app.scene.remove(this.shader_lake.mesh);             

                // Hide the element after 2 seconds
                setTimeout(() => {
                    this.darkDriveAlert.style.display = 'none';
                }, 2000); // 2000 milliseconds = 2 seconds
                this.show_picker = false;
                
            }
        }
        else {

            //console.log("NOT SHOWING")
            this.superSpeedPicker.style.display = 'none';
        }
        
    }
    
        

    animatePath() {

        /////////////////////////// ANIMATION DRAFT ////////////////////////////

        this.clock = new THREE.Clock();

        this.mixerTime = 0
        this.mixerPause = false;

        this.enableAnimationPosition = true;
        this.animationMaxDuration = 24; //seconds -> vai depender da rota do carro autonomo escolhido

        const calculateAngle = (currentPoint, nextPoint) => {
            //console.log("currentPoint", currentPoint)
            //console.log("nextPoint", nextPoint)
            const direction = new THREE.Vector3().subVectors(nextPoint, currentPoint).normalize();
            const angle = Math.atan2(direction.x, direction.z); // Assuming the y-axis is the vertical axis
            return angle;
        };

        //visual debuging the path and the controls points
        //this.debugKeyFrames();


        
        const numPoints = this.routePoints.length;

        //console.log("this track path", this.routePoints);
        
        // Check if there are enough points for calculation
        if (numPoints < 2) {
            console.error("Not enough points for calculation");
        } else {
            // Create position keyframe track
            const positionKF = new THREE.VectorKeyframeTrack('.position', Array.from({ length: numPoints }, (_, index) => index),
                this.routePoints.flatMap(point => [point.x, point.y, point.z]),
                THREE.InterpolateSmooth
            );
        
            // Create quaternion keyframe track
            const yAxis = new THREE.Vector3(0, 1, 0);
            const quaternionKeyframes = this.routePoints.slice(0).map((currentPoint, index, array) => {

                let nextPoint = array[index + 1];
                if (index === numPoints - 1) 
                    nextPoint = array[1];
                const angle = calculateAngle(currentPoint, nextPoint);
                return new THREE.Quaternion().setFromAxisAngle(yAxis, angle).toArray();
            }).flat();

            //console.log("GOT QUATERNION KEYFRAMES", quaternionKeyframes)
        
        
            // Assign quaternion keyframes to values property
            const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', Array.from({ length: numPoints }, (_, index) => index), quaternionKeyframes);
            const positionClip = new THREE.AnimationClip('positionAnimation', this.animationMaxDuration, [positionKF]);
            const rotationClip = new THREE.AnimationClip('rotationAnimation', this.animationMaxDuration, [quaternionKF]);
            // Create an AnimationMixer
            this.mixer = new THREE.AnimationMixer(this.vehicle.mesh);
        
            // Create AnimationActions for each clip
            const positionAction = this.mixer.clipAction(positionClip);
            const rotationAction = this.mixer.clipAction(rotationClip);

            positionAction.loop = THREE.LoopRepeat; // or THREE.LoopPingPong for a back-and-forth motion
            rotationAction.loop = THREE.LoopRepeat; // or THREE.LoopPingPong for a back-and-forth rotation

        
            // Play both animations
            positionAction.play();
            rotationAction.play();

            const update = () => {
                this.delta  = this.clock.getDelta();
            
                // Update the mixer with the time delta
                if (!this.animationPaused) {

                    

                    // Update the mixer and check for collisions with obstacles
                    this.mixer.update(this.delta);
                }
            
                // Check if the animation has completed a full loop
                if (this.mixer.time >= this.animationMaxDuration) {
                    // Reset the clock to continue the animation
                    this.clock.start();
                }
            
                // Request the next animation frame
                requestAnimationFrame(update);
            };


            update();
        }

    }

    animateAutoPath() {

        /////////////////////////// ANIMATION DRAFT ////////////////////////////

        this.clock = new THREE.Clock();

        this.mixerTime = 0
        this.mixerPause = false;

        this.enableAnimationPosition = true;

        let speedMultiplier = 1;
        let finalspeedMultiplier = 0;

        if (this.menu.difficulty == 1)
            speedMultiplier = 15;
        else if (this.menu.difficulty == 2)
            speedMultiplier = 100;
        else if (this.menu.difficulty == 3)
            speedMultiplier = 300; 

        const accelerationDuration = 0.02; 

        // Time elapsed during acceleration
        let accelerationTime = 0;


        const calculateAngle = (currentPoint, nextPoint) => {
            //console.log("currentPoint", currentPoint)
            //console.log("nextPoint", nextPoint)
            const direction = new THREE.Vector3().subVectors(nextPoint, currentPoint).normalize();
            const angle = Math.atan2(direction.x, direction.z); // Assuming the y-axis is the vertical axis
            return angle;
        };

        //visual debuging the path and the controls points
        //this.debugKeyFrames();

        const numPoints = this.routePoints.length;

        //console.log("this track path", this.routePoints);
        
        // Check if there are enough points for calculation
        if (numPoints < 2) {
            console.error("Not enough points for calculation");
        } else {
            // Create position keyframe track
            const positionKF = new THREE.VectorKeyframeTrack('.position', Array.from({ length: numPoints }, (_, index) => index),
                this.routePoints.flatMap(point => [point.x, point.y, point.z]),
                THREE.InterpolateSmooth
            );
            console.log("positionKF")
            console.log(positionKF)
        
            // Create quaternion keyframe track
            const yAxis = new THREE.Vector3(0, 1, 0);
            const quaternionKeyframes = this.routePoints.slice(0).map((currentPoint, index, array) => {

                let nextPoint = array[index + 1];
                if (index === numPoints - 1) 
                    nextPoint = array[1];
                const angle = calculateAngle(currentPoint, nextPoint);
                return new THREE.Quaternion().setFromAxisAngle(yAxis, angle).toArray();
            }).flat();

            //console.log("GOT QUATERNION KEYFRAMES", quaternionKeyframes)
        
        
            // Assign quaternion keyframes to values property
            const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', Array.from({ length: numPoints }, (_, index) => index), quaternionKeyframes);
            const positionClip = new THREE.AnimationClip('positionAnimation', this.animationMaxDuration, [positionKF]);
            const rotationClip = new THREE.AnimationClip('rotationAnimation', this.animationMaxDuration, [quaternionKF]);
            // Create an AnimationMixer
            //console.log("O Car", this.car)
            console.log("O vehic", this.auto_vehicle.mesh)
            this.auto_mixer = new THREE.AnimationMixer(this.auto_vehicle.mesh);
        
            // Create AnimationActions for each clip
            const positionAction = this.auto_mixer.clipAction(positionClip);
            const rotationAction = this.auto_mixer.clipAction(rotationClip);

            positionAction.loop = THREE.LoopRepeat; // or THREE.LoopPingPong for a back-and-forth motion
            rotationAction.loop = THREE.LoopRepeat; // or THREE.LoopPingPong for a back-and-forth rotation

        
            // Play both animations
            positionAction.play();
            rotationAction.play();

            const update = () => {
                this.delta  = this.clock.getDelta();
            
                // Update the mixer with the time delta
                if (!this.animationPaused) {

                    // Update the collision box based on the updated position
                    const frontCollisionBox = new THREE.Box3().setFromObject(this.auto_vehicle.mesh.children[1]);
                    this.auto_vehicle.frontCollisionBox.max.copy(frontCollisionBox.max);
                    this.auto_vehicle.frontCollisionBox.min.copy(frontCollisionBox.min);

                    const middleCollisionBox = new THREE.Box3().setFromObject(this.auto_vehicle.mesh.children[2]);
                    this.auto_vehicle.middleCollisionBox.max.copy(middleCollisionBox.max);
                    this.auto_vehicle.middleCollisionBox.min.copy(middleCollisionBox.min);
        
                    const backCollisionBox = new THREE.Box3().setFromObject(this.auto_vehicle.mesh.children[3]);
                    this.auto_vehicle.backCollisionBox.max.copy(backCollisionBox.max);
                    this.auto_vehicle.backCollisionBox.min.copy(backCollisionBox.min);

                    if (accelerationTime < accelerationDuration) {
                        // If still in the acceleration phase, gradually increase speedMultiplier
                        finalspeedMultiplier = ((accelerationTime / accelerationDuration)) * speedMultiplier;
                        accelerationTime += this.delta;
                    } else {
                        // If acceleration is complete, maintain the speedMultiplier
                        finalspeedMultiplier = speedMultiplier;
                    }

                    this.auto_vehicle.vel = finalspeedMultiplier * 5;
                    this.auto_vehicle.rotateWheels(this.delta);
                    // Update the mixer and check for collisions with obstacles
                    //this.auto_mixer.update(this.delta);
                    console.log("finalspeedMultiplier: ", finalspeedMultiplier, "speedMultiplier: ", speedMultiplier, "accelerationTime: ", accelerationTime)
                    this.auto_mixer.update(this.delta * finalspeedMultiplier);
                }
            
                // Check if the animation has completed a full loop
                if (this.auto_mixer.time >= this.animationMaxDuration) {
                    // Reset the clock to continue the animation
                    this.clock.start();
                }
            
                // Request the next animation frame
                requestAnimationFrame(update);
            };


            update();
        }

    }

    checkDistance() {
        const vehiclePosition = this.vehicle.pivotPoint.clone();

        //console.log("CheckDistance: vehiclePosition: ", vehiclePosition)
        //console.log("CheckDistance: this.routePoints: ", this.routePoints)
      
        // Initialize the smallestDistance to a large value
        let smallestDistance = Number.POSITIVE_INFINITY;
        let routepointPos = null;
      
        this.routePoints.forEach((routepoint) => {

            
            const distance = vehiclePosition.distanceTo(routepoint);
            
            // Update smallestDistance if the current distance is smaller
            if (distance < smallestDistance)
            {
                routepointPos = routepoint;
            }
            
            smallestDistance = Math.min(smallestDistance, distance);
        });



        //console.log("CheckDistance: Car at: ", vehiclePosition, " and closest routepoint at: ", routepointPos, " with distance: ", smallestDistance, " to it")
    
        // Adjust this threshold as needed
        const threshold = 2.5;
    
        // Check if the smallest distance is greater than the threshold
        if (smallestDistance > threshold) {
            console.log('Vehicle is out of road');
            console.log(this.vehicle.vel);
            this.out_of_road = true;

            //this.vehicle.modulateSpeed(2);
            if(this.vehicle.vel > 400 && this.activePowerUp != "ghostPower") {
                this.vehicle.accelarate(-20);
            }
        }
        else {
            this.out_of_road = false;
        }

        if (smallestDistance > 20) {

            this.vehicle.sendToPosition(routepointPos); //mesh.position.set(routepointPos.x, routepointPos.y, routepointPos.z);
        }
    }

    animatePlayer(){

        this.clock = new THREE.Clock();

        this.mixerTime = 0
        this.mixerPause = false;

        this.enableAnimationPosition = true;

        const calculateAngle = (currentPoint, nextPoint) => {
            //console.log("currentPoint", currentPoint)
            //console.log("nextPoint", nextPoint)
            const direction = new THREE.Vector3().subVectors(nextPoint, currentPoint).normalize();
            const angle = Math.atan2(direction.x, direction.z); // Assuming the y-axis is the vertical axis
            return angle;
        };


        this.mixer = new THREE.AnimationMixer(this.vehicle.mesh);

        // Add event listeners for keydown and keyup events
        document.addEventListener('keydown', onDocumentKeyDown, false);
        document.addEventListener('keyup', onDocumentKeyUp, false);

        // Define variables to store the state of each key
        const keys = { KeyW: false, KeyA: false, KeyS: false, KeyD: false};

        // Function to handle keydown events
        function onDocumentKeyDown(event) {
            const keyCode = event.code;
            //console.log("KEY DOWN: ", keyCode) // THIS IS NOT PRINTED
            if (keys.hasOwnProperty(keyCode)) {
                //console.log("KEY DOWN: ", keyCode) // THIS IS NOT PRINTED
                keys[keyCode] = true;
            }
        }

        // Function to handle keyup events
        function onDocumentKeyUp(event) {
            const keyCode = event.code;
            if (keys.hasOwnProperty(keyCode)) {
                keys[keyCode] = false;
            }
        }

        // Update function for manual control
        const updateManualControl = () => {

            // Check which keys are pressed and update the vehicle's position accordingly
            if (keys.KeyW) {
                console.log("velo: ", this.vehicle.vel)
                this.vehicle.accelarate(5);

                if (this.activeObstacle == "lowSpeed" && this.isAnyObstacleActive){
                    if(this.vehicle.vel > 400)
                        this.vehicle.accelarate(-25);
                }
                else if (this.activePowerUp == "superSpeed" && this.isAnyPowerUpActive){
                    if(this.vehicle.vel > 2000)
                        this.vehicle.accelarate(-25);
                    else if (this.vehicle.vel <= 2000 && !this.out_of_road)
                        this.vehicle.accelarate(25);
                    else if (this.out_of_road && this.vehicle.vel > 600)
                        this.vehicle.accelarate(-50);
                }
                else{ // limitar a velocidade maxima
                    if(this.vehicle.vel > 1000)
                        this.vehicle.accelarate(-25);
                }
            }
            if (keys.KeyA) {
                this.vehicle.turn(-1/12)
            }
            if (keys.KeyS) {

                this.vehicle.accelarate(-5);

                if (this.activeObstacle == "lowSpeed" && this.isAnyObstacleActive){
                    if(this.vehicle.vel < -400)
                        this.vehicle.accelarate(25);
                }
                else if (this.activePowerUp == "superSpeed" && this.isAnyPowerUpActive){
                    if(this.vehicle.vel < -2000)
                        this.vehicle.accelarate(25);
                    else if (this.vehicle.vel >= -2000 && !this.out_of_road)
                        this.vehicle.accelarate(-25);
                    else if (this.out_of_road && this.vehicle.vel < -600)
                        this.vehicle.accelarate(50);
                }
                else{ // limitar velocidade minima
                    if(this.vehicle.vel < -1000)
                        this.vehicle.accelarate(25);
                }
            }
            if (keys.KeyD) {
                this.vehicle.turn(1/12)
            }
            if (!keys.KeyA && !keys.KeyD) {
                // se nao estiver a virar, as rodas apontam para a frente (direção assistida)
                this.vehicle.resetWeelsDierection();
            }

            // Update the collision box based on the updated position
            const frontCollisionBox = new THREE.Box3().setFromObject(this.vehicle.mesh.children[1]);
            this.vehicle.frontCollisionBox.max.copy(frontCollisionBox.max);
            this.vehicle.frontCollisionBox.min.copy(frontCollisionBox.min);

            const middleCollisionBox = new THREE.Box3().setFromObject(this.vehicle.mesh.children[2]);
            this.vehicle.middleCollisionBox.max.copy(middleCollisionBox.max);
            this.vehicle.middleCollisionBox.min.copy(middleCollisionBox.min);
  
            const backCollisionBox = new THREE.Box3().setFromObject(this.vehicle.mesh.children[3]);
            this.vehicle.backCollisionBox.max.copy(backCollisionBox.max);
            this.vehicle.backCollisionBox.min.copy(backCollisionBox.min);

        };

        
        const update = () => {
            this.delta = this.clock.getDelta();

            

            // Update the mixer and check for collisions with obstacles
            if (!this.animationPaused) {
                // Update manual control
                updateManualControl();
                this.mixer.update(this.delta);
            }



            // Request the next animation frame
            requestAnimationFrame(update);
        };

        // Start the update loop
        update();

    }

    /**
     * Build control points and a visual path for debug
     */
    debugKeyFrames() {

        let spline = new THREE.CatmullRomCurve3([...this.routePoints])

        // Setup visual control points

        for (let i = 0; i < this.routePoints.length; i++) {
            const geometry = new THREE.SphereGeometry(1, 32, 32)
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
            const sphere = new THREE.Mesh(geometry, material)
            sphere.scale.set(0.1, 0.1, 0.1)
            sphere.position.set(... this.routePoints[i])

            this.app.scene.add(sphere)
        }

        const tubeGeometry = new THREE.TubeGeometry(spline, 100, 0.05, 10, false)
        const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial)

        //this.app.scene.add(tubeMesh)

    }

    getCameras() {
        return this.cameras;
    }


    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);

        const backgroundColor = new THREE.Color(data.options.backgroundColor);

        //console.log("SCENE KEYS ", data.fog)

        //this.app.scene.fog = new THREE.Fog(data.fog.color, data.fog.near, data.fog.far);
        //this.app.scene.background = backgroundColor;

    }

    

    getCurrentCarPosition() {
        return this.vehicle.mesh.position.clone();
    }


    lapCompleted(vehiclePosition, minX, maxX, minZ, maxZ, player_vehicle) {

        // velocidade > 0 e virado para a direita
        // velocidade < 0 e virado para a esquerda ==> esta a andar de costas mas a passar bem na meta
    
        
        const carDirectionX = Math.cos(this.vehicle.angle);
        console.log("player_lap carDirectionX", carDirectionX)
        const carVelocity = this.vehicle.vel;

        if (carDirectionX >= 0){
            //console.log('..right.');
            console.log("player_lap carDirectionX >= 0", carVelocity < 0)
            if (carVelocity < 0) return false;
        }
        else {
            //console.log('..left.');
            console.log("player_lap carDirectionX < 0", carVelocity > 0)
            if (carVelocity > 0) return false;
        }
        

        return (
            vehiclePosition.x >= minX &&
            vehiclePosition.x <= maxX &&
            vehiclePosition.z >= minZ &&
            vehiclePosition.z <= maxZ
        );
    }


    // For shaders:

    waitForShaders() {
        if (this.shader[0].ready === false || this.shader[1].ready === false) {
            setTimeout(this.waitForShaders.bind(this), 100)
            return;
        }

        this.setCurrentShader(this.shader)
    }

    waitForText(){
        if (this.menu.isTextReady() === false) {
            setTimeout(this.waitForText.bind(this), 100)
            return;
        }

    }

    setCurrentShader(shader) {
        if (shader === null || shader === undefined) {
            return
        }

        // clouds
        for (let i = 0; i < this.shader_clouds.length; i++){
            this.shader_clouds[i].mesh.material = shader[0].material
            this.shader_clouds[i].mesh.material.needsUpdate = true
        }
        for (let i = 0; i < this.shader_clouds.length; i++){
            //this.app.scene.add(this.shader_clouds[i].mesh)
        }

        // house box
        this.shader_box.mesh.material = shader[1].material;
        this.shader_box.mesh.material.needsUpdate = true;
        this.app.scene.add(this.shader_box.mesh);


        // lake nurb curve
        this.shader_lake.mesh.material = shader[2].material;
        this.shader_lake.mesh.material.needsUpdate = true;
        this.app.scene.add(this.shader_lake.mesh);

        // sphere powerUp
        this.shader_sphere.mesh.material = shader[3].material;
        this.shader_sphere.mesh.material.needsUpdate = true;
        this.gameReader.initElements(this.shader_sphere.mesh);


     }

    focusCameraOnInitialMenu(){

        console.log("focusCameraOnInitialMenu")

        this.pickableObjIds = ["playButton", "startButton", "difficultyButton", "nameButton", "lapButton"];

        console.log("focus this.pickableObjIds: ", this.pickableObjIds)
        this.app.is_initial_menu_active = true;
    }

    focusCameraOnCarToPick() {

        this.pickableObjIds = ["car1", "car2", "car3", "car4"];
        this.app.is_car_picker_active = true;
        this.carPickerTitle.style.display = "block";

    }

    focusCameraOnObstaclesToPick() {

        this.lapDisplayElement.style.display = 'none';
        this.obstaclePickerTitle.style.display = 'block';
        this.pickableObjIds = ["lowSpeedObstacle", "darkDriveObstacle"];
        this.app.is_obstacles_picker_active = true;

    }

    focusCameraOnTrack() {

        this.obstaclePickerTitle.style.display = 'none';
        this.chooseObstTitle.style.display = 'block';
        this.pickableObjIds = ["track"];
        this.app.is_obstacles_picker_active = false;
        this.app.choosing_obstacles_position = true;       
    
    }

    resetCameraFocus(){

        this.chooseObstTitle.style.display = 'none';
        this.app.choosing_obstacles_position = false;
        if (this.lapDisplayElement.style.display == 'none')
            this.lapDisplayElement.style.display = 'block';


        // Set the camera position
        //this.app.getActiveCamera().position.copy(this.lastCameraPosition);

    }
    

    debugSceneColliders(){

        let boxMaterial = new THREE.MeshPhongMaterial({ color: 0x5C85BB, transparent: true, opacity: 0.5 });
        let outMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });

        /*
        for (let i = 0; i < this.scene_collider.boxList.length; i++){

            const boxHelper = new THREE.Box3Helper(this.scene_collider.boxList[i].frontCollisionBox, boxMaterial);

            console.log("Scene Collider contents:", this.scene_collider.boxList[i])
            boxHelper.position.copy(this.scene_collider.boxList[i].mesh.position);
            boxHelper.visible = true; // Set to true if you want the debug box this.menuplayto be visible by default

            this.app.scene.add(boxHelper)
        } */

        console.log("OUTDOOR 1: ", this.outdoor1.rightPilar.collisionBox)
        const outHelper = new THREE.Box3Helper(this.outdoor1.rightPilar.collisionBox, outMaterial);

        outHelper.position.copy(this.outdoor1.rightPilar.mesh.position);
        outHelper.visible = true; // Set to true if you want the debug box to be visible by default

        this.app.scene.add(outHelper)

        
    }

    update() {

        if (this.app.gameKeys['Escape']){
            window.location.reload();
        }
        

        if (this.menu)
        {
            if (this.menu.targetRotation > 0)
            {
                this.menu.update();
            }
        }


        if (!this.lapsNumberDefined){
            this.chooseLapsNumber();
        }
        if (!this.playerNameDefined){
            this.choosePlayerName();
        }

        /* CLOUDS */
        // update cloud movement if needed
        for (let i = 0; i < this.shader_clouds.length; i++){
            if (this.shader_clouds[i].mesh.position.z > 22 || this.shader_clouds[i].mesh.position.z < -22) {
                this.clouds_velocities[i] = -this.clouds_velocities[i];
            }
        }
        // move clouds in scene
        for (let i = 0; i < this.shader_clouds.length; i++){
            this.shader_clouds[i].mesh.position.z += this.clouds_velocities[i];
        }
        let t = this.app.clock.getElapsedTime()
        if (this.shader[0] !== undefined && this.shader_clouds !== null) {
            if (this.shader[0].hasUniform("timeFactor")) {
                this.shader[0].updateUniformsValue("timeFactor", t/7 );
            }
        }
        if (this.shader[2] !== undefined && this.shader_lake !== null) {
            if (this.shader[2].hasUniform("timeFactor")) {
                this.shader[2].updateUniformsValue("timeFactor", t/12 );
            }
        }
        if (this.shader[3] !== undefined && this.shader_sphere !== null) {
            if (this.shader[3].hasUniform("timeFactor")) {
                this.shader[3].updateUniformsValue("timeFactor", t );
            }
        }


        if (this.vehicle.mesh != null && this.auto_vehicle.mesh != null && this.can_start){
            // Update the directional light position to follow the car
            //this.pointingCarLight.position.copy(this.vehicle.mesh.position);

        
            // check if the player cheated
            if (this.vehicle.mesh.position.x < 1.5 && this.vehicle.mesh.position.z < 1 && this.vehicle.mesh.position.z > -1) {
                console.log("PASS THE LIMIT!!!")
                this.can_count_lap = true;
            }


            this.delta = this.clock.getDelta();
            if ((this.collisionCooldown > 0)){ // && !this.activePowerUp) { //RESOLVI COM ISTO &&.. MAS NAO SEI SE ESTRAGA ALGO
                this.collisionCooldown -= this.delta;

                //console.log("collisionCooldown: ", this.collisionCooldown)
                // If cooldown is still active, skip collision checking
                //return;
            }
            if ((this.lapCooldown > 0)){ 

                this.lapCooldown -= this.delta;
            
            }
            if ((this.auto_lapCooldown > 0)){ 

                this.auto_lapCooldown -= this.delta;
            
            }
        }
        

        if (!this.animationPaused) {
            // Update the mixer and check for collisions with obstacles
            this.mixer.update(this.delta);
            this.auto_mixer.update(this.delta);
        }


        // Get the time passed since the last frame
        const now = Date.now();
        const deltaTimeInSeconds = (now - this.lastFrameTime) / 1000; // Convert to seconds


        this.lastFrameTime = now;

        
        if ((this.isAnyPowerUpActive || this.isAnyObstacleActive) && !this.show_picker) {
            //console.log("Power Up active")
            if (this.total_time > 0){
                // Update the speed time
                this.total_time -= deltaTimeInSeconds;
                // Display the remaining time
                this.timeDisplayElement.textContent = `Time left: ${Math.max(0, Math.ceil(this.total_time))} seconds`;
            }
            else {
                console.log("OVER")
                if (this.isAnyPowerUpActive){
                    this.isAnyPowerUpActive = false;
                    this.activePowerUp = null;
                }
                else {
                    this.isAnyObstacleActive = false;
                    this.activeObstacle = null;
                    this.directionalLight1.intensity = this.lightIntensity;
                    this.directionalLight2.intensity = this.lightIntensity;
                    //this.pointingCarLight.intensity = 0;  
                    this.app.scene.add(this.shader_lake.mesh);
                }
                
                this.timeDisplayElement.textContent = "";
            }
        }
    

        if (this.vehicle.mesh != null && this.auto_vehicle.mesh != null && this.can_start){
            let collision = this.vehicle.checkCollision(this.bvhRoot)

            if ((collision && this.collisionCooldown <= 0) || collision == "ghostPower") {

                //this.timeDisplayElement.textContent = `There was collision ${collision}`;

                if ((collision == "lowSpeed" || collision == "darkDrive") && !this.isAnyPowerUpActive && !this.isAnyObstacleActive) { // is an obstacle             
                    this.collisionCooldown = 0.05; // change this value to adjust the cooldown time
                    //console.log("CRAAAAAAAAAAAAAASH");
                    
                    this.isAnyObstacleActive = true;
                    this.activeObstacle = collision;
                    this.show_picker = true; 
                    //this.timeDisplayElement.textContent = "Crash";

                    //let new_car = this.vehicle.mesh.clone();
                    //this.app.scene.add(new_car);

                }
                // é um powerUp
                else if ((collision == "superSpeed" && !this.isAnyPowerUpActive && !this.isAnyObstacleActive) ||
                        (collision == "ghostPower" && !this.isAnyPowerUpActive)){ //ghost power overcomes any obstacle penalty

                    this.isAnyObstacleActive = false;

                    this.collisionCooldown = 0.05; // change this value to adjust the cooldown time
        
                    //let new_car = this.vehicle.mesh.clone();
                    //this.app.scene.add(new_car);
        
                    this.isAnyPowerUpActive = true;
                    this.activePowerUp = collision;
                    this.show_picker = true;      
                    
                    if (collision == "ghostPower") {
                        this.activeObstacle = null;
                        this.directionalLight1.intensity = this.lightIntensity;
                        this.directionalLight2.intensity = this.lightIntensity;
                        //this.pointingCarLight.intensity = 0;  
                        this.app.scene.add(this.shader_lake.mesh);
                    }
                    this.app.gameKeys['Space'] = true; //this.animationPaused = true;
                    //this.build_obstacleChoice_picker();
                    this.focusCameraOnObstaclesToPick();
                }

                this.build_powerUps_obstacles_pickers(); 

            }


        }
        
        
        this.lapDisplayElement.textContent = `Lap: ${this.player_laps +1}/ ${this.total_laps}`;
        if (!this.animationPaused)
        {

            this.vehicle.update(deltaTimeInSeconds);
            this.checkDistance();
            if (this.can_count_lap && this.lapCompleted(this.vehicle.mesh.position, 6.5, 9.5, 3, 4, true)) {
                let firework1 = new Particle(this.app, this, 6.5, 0, 3.5, 0xff0000)
                this.explosions.push(firework1)
                let firework2 = new Particle(this.app, this, 9.5, 0, 3.5, 0xff0000)
                this.explosions.push(firework2)

                if (this.lapCooldown <= 0){
                    this.lapCooldown = 2;
                    this.player_laps += 1;
                    console.log("LAP COMPLETED");
                    this.can_count_lap = false;
                }
            }

            if (this.lapCompleted(this.auto_vehicle.mesh.position, 6.5, 9.5, 3, 4, false)) {
                let firework1 = new Particle(this.app, this, 6.5, 0, 3.5, 0x00ff00)
                this.explosions.push(firework1)
                let firework2 = new Particle(this.app, this, 9.5, 0, 3.5, 0x00ff00)
                this.explosions.push(firework2)

                if (this.auto_lapCooldown <= 0){
                    this.auto_lapCooldown = 2;
                    this.auto_laps += 1;
                    console.log("LAP COMPLETED")
                }
                console.log("LAP COMPLETED")
            }

            console.log("player_laps: ", this.player_laps, "auto_laps: ", this.auto_laps, "total_laps: ", this.total_laps);
            // THE GAME IS OVER
            if (this.player_laps == this.total_laps || this.auto_laps == this.total_laps){

                this.app.game_over = true;
                if (!this.finish_time)
                    this.finish_time = Math.floor(this.app.clock.getElapsedTime());
                this.pickableObjIds = ["startButton"];
                // stop the animation
                this.animationPaused = true;
                this.app.gameKeys['Space'] = true; //this.animationPaused = true;

                this.lapDisplayElement.style.display = 'none';
                this.timeDisplayElement.style.display = "none";

                
                if (this.player_laps == this.total_laps) {
                    // Player is the winner
                    this.winner = "PLAYER";
                }
                else if(this.auto_laps == this.total_laps){
                    //computer is the winner
                    this.winner = "COMPUTER";
                }

                this.showWinner()
            }
            


            let carCrash = this.vehicle.checkAutoCarCollision(this.auto_vehicle.frontCollisionBox, this.auto_vehicle.middleCollisionBox, this.auto_vehicle.backCollisionBox);

            this.sceneBoundingBoxes.forEach(scene_element_box => {
                let carInforbiddenZone = this.vehicle.checkSceneElementCollision(scene_element_box);
                if (carInforbiddenZone){
                    //console.log("CAR CRASH");
                    this.vehicle.vel = 0;
                }
                
            });
            

            if (carCrash && this.activePowerUp != "ghostPower"){
                //console.log("CAR CRASH");
                this.vehicle.vel = 0;
            }
            
        }

        for( let i = 0; i < this.explosions.length; i++ ) {
            if (this.explosions[i].done) {
                // remove 
                this.explosions.splice(i,1) 
                continue 
            }
            // otherwise upsdate  firework
            this.explosions[i].update()
        }

        ////////////// OUTDOORS

        // For outdoor 1

        let newInfo = { ...this.outdoor1.infoList };
        newInfo['Time'] = Math.floor(this.app.clock.getElapsedTime());
        newInfo['Power up active'] = this.activePowerUp !== null ? this.activePowerUp : "None";


        this.outdoor1.update(newInfo);

        //console.log("outdoor1 infoList: ", this.outdoor1.infoList)

        // For outdoor 2

        let newInfo2 = { ...this.outdoor2.infoList };
        newInfo2["Lap"] = `${this.player_laps + 1}/ ${this.total_laps}`;

        this.outdoor2.update(newInfo2);

        //For outdoor 3

        let newInfo3 = { ...this.outdoor3.infoList };

        if (this.vehicle.name)
        {
            newInfo3["Your car"] = this.vehicle.name;
        }
        else if (this.car_name)
        {
            newInfo3["Your car"] = this.car_name;
        }

        if (this.auto_vehicle.name)
        {
            newInfo3["Enemy car"] = this.auto_vehicle.name;
        }
        else if (this.auto_car_name)
        {
            newInfo3["Enemy car"] = this.auto_car_name;
        }

        this.outdoor3.update(newInfo3);

        //For outdoor 4

        let newInfo4 = { ...this.outdoor4.infoList };
        if (this.obstacle_id)
            console.log("obstacle id: ", this.obstacle_id)

        
        if (this.obstacle_id == "lowSpeedObstacle")
            newInfo4["Obstacle"] = "Low Speed";
        else if (this.obstacle_id == "darkDriveObstacle")
            newInfo4["Obstacle"] = "Dark Drive";
        else
            newInfo4["Obstacle"] = "None";
        


        this.outdoor4.update(newInfo4);


        // SPRITES

        //this.ghost1.updateRotation(this.app.activeCamera);


        // GAME OVER

        if (this.app.game_over)
        {
            console.log("OVER")
            this.podium.createFirework(this.app, this);
            this.podium.updateFire();
        }

        

            
    
    }

    
}
export { MyContents };
