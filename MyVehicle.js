import * as THREE from 'three';
import { BVHNode, buildBVH, traverseBVH } from './BVHNode.js';
import { MyReaderXML } from './MyReaderXML.js';


/**
 *  This class contains the contents of out application
 */
class MyVehicle  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.mesh = null;

        this.frontCollisionBox = null;
        this.backCollisionBox = null;

        this.angle = 0;
        this.vel = 0;
        this.speedFactor = 0.1;

        this.frontGroup = null;
        this.wheelGroup = null;

        this.pivotPoint = null;
        this.xml_reader = new MyReaderXML(this.app);

        this.cam = null;

        this.cam_pos = null;
        this.cam_look = null;

        this.name = null;

        this.init();
    }

    /**
     * initializes the contents
     */
    init() {

        this.cam = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        // Set the initial position of the camera behind and above the car
        this.cam_pos = new THREE.Vector3(0, 3, -5); // Adjust these values as needed
        this.cam.position.copy(this.cam_pos);

        // Set the initial lookAt position in front of the car
        this.cam_look = new THREE.Vector3(0, 0, 1); // Adjust these values as needed
        this.cam.lookAt(this.cam_look);

    }

    loadPickingCar(path, name){
        this.xml_reader.load_xml_pickerObj(path, name);
        this.mesh = this.xml_reader.car_mesh;
    }
    
    loadCar(path){


        this.xml_reader.load_xml(path);
        this.mesh = this.xml_reader.car_mesh;
        
        //console.log("Car group: ", this.mesh);
        //console.log("Car group body: ", this.mesh.children[0].children[0].children[0])

        let box_geometry = new THREE.BoxGeometry(1, 1, 0.3);
        let boxMaterial = new THREE.MeshPhongMaterial({ color: 0x5C85BB });
        let material = new THREE.MeshBasicMaterial( {transparent: true, opacity: 0.0})
        let front_collider = new THREE.Mesh(box_geometry, material);
        let middle_collider = new THREE.Mesh(box_geometry, material);
        let back_collider = new THREE.Mesh(box_geometry, material);


        switch (path) {
            case "scenes/t01g03/car1.xml":
                front_collider.scale.set(0.73, 0.5, 0.3);
                front_collider.position.set(0, 0, 0.55);
                middle_collider.scale.set(0.6, 0.5, 0.3);
                middle_collider.position.set(0, 0, 0);
                back_collider.scale.set(0.73, 0.5, 0.3);
                back_collider.position.set(0, 0, -0.55);
                break;
            case "scenes/t01g03/car2.xml":
                front_collider.scale.set(0.73, 0.5, 0.3);
                front_collider.position.set(0, 0, 0.55);
                middle_collider.scale.set(0.6, 0.5, 0.3);
                middle_collider.position.set(0, 0, 0);
                back_collider.scale.set(0.73, 0.5, 0.3);
                back_collider.position.set(0, 0, -0.55);
                break;
            case "scenes/t01g03/car3.xml":
                front_collider.scale.set(0.73, 0.5, 0.3);
                front_collider.position.set(0, 0, 0.55);
                middle_collider.scale.set(0.6, 0.5, 0.3);
                middle_collider.position.set(0, 0, 0);
                back_collider.scale.set(0.73, 0.5, 0.3);
                back_collider.position.set(0, 0, -0.55);
                break;
            case "scenes/t01g03/car4.xml":
                front_collider.scale.set(0.75, 0.5, 0.6);
                front_collider.position.set(0, 0, 0.9);
                middle_collider.scale.set(0.6, 0.5, 0.6);
                middle_collider.position.set(0, 0, 0.2);
                back_collider.scale.set(0.75, 0.5, 0.6);
                back_collider.position.set(0, 0, -0.5);
                break;
        
            default:
                break;
        }

        this.mesh.add(front_collider);

        this.frontCollisionBox = new THREE.Box3().setFromObject(front_collider); 
        let boxHelper = new THREE.Box3Helper(this.frontCollisionBox, boxMaterial);
        boxHelper.position.copy(front_collider.position);
        boxHelper.visible = true; // Set to true if you want the debug box to be visible by default
        //this.app.scene.add(boxHelper);


        this.mesh.add(middle_collider);

        this.middleCollisionBox = new THREE.Box3().setFromObject(middle_collider); 
        boxHelper = new THREE.Box3Helper(this.middleCollisionBox, boxMaterial);
        boxHelper.position.copy(middle_collider.position);
        boxHelper.visible = true; // Set to true if you want the debug box to be visible by default
        //this.app.scene.add(boxHelper)


        this.mesh.add(back_collider);

        this.backCollisionBox = new THREE.Box3().setFromObject(back_collider); 
        boxHelper = new THREE.Box3Helper(this.backCollisionBox, boxMaterial);
        boxHelper.position.copy(back_collider.position);
        boxHelper.visible = true; // Set to true if you want the debug box to be visible by default
        //this.app.scene.add(boxHelper)


        //console.log("This mesh children: ", this.mesh.children)
        //console.log("Children of vehicle:", this.mesh.children[0].children[0].children[1])

        this.wheelGroup = this.mesh.children[0].children[0].children[2];
        this.frontGroup = this.mesh.children[0].children[0].children[2].children[0];

        this.pivotPoint = this.mesh.position;

        //console.log("Wheel group: ", this.wheelGroup);
        //console.log("Front group: ", this.frontGroup);


        this.mesh.position.set(0, -1, 0);

        this.app.scene.add(this.mesh)

    }

    buildCar1() {
        
        let carGroup = new THREE.Group();
        
        // Car body
        let bodyGeometry = new THREE.BoxGeometry(2, 0.7, 4);
        let bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x5C85BB });
        let bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);

        bodyMesh.geometry.computeBoundingBox();
        this.frontCollisionBox = new THREE.Box3();
        this.frontCollisionBox.copy( bodyMesh.geometry.boundingBox ).applyMatrix4( bodyMesh.matrixWorld );

        
        carGroup.add(bodyMesh);
        
        // Car roof
        var roofGeometry = new THREE.BoxGeometry(1.5, 0.5, 2);
        var roofMaterial = new THREE.MeshPhongMaterial({
            color: 0x3377aa,
            specular: 0x3366aa,
            emissive: 0x000000});
        var roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
        roofMesh.position.set(0, 0.6, -0.5);
        carGroup.add(roofMesh);
        
        // Car wheels
        var wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
        var wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        var rightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        var leftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        
        rightWheel.position.set(-1, -0.5, 0.5);
        rightWheel.rotation.z = Math.PI / 2;
        leftWheel.position.set(1, -0.5, 0.5);
        leftWheel.rotation.z = Math.PI / 2;

        this.pivotPoint = new THREE.Vector3(0.5, -0.5, 0.5);

        this.frontGroup = new THREE.Group();
        this.frontGroup.add(rightWheel);
        this.frontGroup.add(leftWheel);
        this.frontGroup.position.set(0, 0, 0.75);


        let backGroup = frontGroup.clone();
        backGroup.position.set(0, 0, -2);
        
        carGroup.add(frontGroup);
        carGroup.add(backGroup);

        carGroup.scale.set(0.35, 0.35, 0.35);

        this.wheelGroup = new THREE.Group();
        this.wheelGroup.add(this.frontGroup);
        this.wheelGroup.add(backGroup);

        
        this.mesh = carGroup;

        this.mesh.position.set(8, 0.4, 5);

        this.app.scene.add(carGroup);

        
        return this.mesh;
    }

    buildCar2() {
    
    let carGroup = new THREE.Group();
    
    // Car body
    let bodyGeometry = new THREE.BoxGeometry(2, 1.3, 4);
    let bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x003F22 });
    let bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);

    bodyMesh.geometry.computeBoundingBox();
    this.frontCollisionBox = new THREE.Box3();
    this.frontCollisionBox.copy( bodyMesh.geometry.boundingBox ).applyMatrix4( bodyMesh.matrixWorld );

    
    carGroup.add(bodyMesh);
    
    // Car roof
    var roofGeometry = new THREE.BoxGeometry(2, 0.8, 2.5);
    var roofMaterial = new THREE.MeshPhongMaterial({
        color: 0x003F22,
        specular: 0x003F22,
        emissive: 0x000000});
    var roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
    roofMesh.position.set(0, 1, -0.8);
    carGroup.add(roofMesh);
    
    // Car wheels
    var wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
    var wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    var rightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    var leftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    
    rightWheel.position.set(-1, -0.5, 0.5);
    rightWheel.rotation.z = Math.PI / 2;
    leftWheel.position.set(1, -0.5, 0.5);
    leftWheel.rotation.z = Math.PI / 2;

    

    this.frontGroup = new THREE.Group();
    this.frontGroup.add(rightWheel);
    this.frontGroup.add(leftWheel);
    this.frontGroup.position.set(0, 0, 0.75);


    let backGroup = frontGroup.clone();
    backGroup.position.set(0, 0, -1.7);
    
    carGroup.add(frontGroup);
    carGroup.add(backGroup);

    carGroup.scale.set(0.35, 0.35, 0.35);

    this.wheelGroup = new THREE.Group();
    this.wheelGroup.add(this.frontGroup);
    this.wheelGroup.add(backGroup);

    
    this.mesh = carGroup;

    this.app.scene.add(carGroup);

    

    return this.mesh;
    }



    checkCollision(bvh) {

        let frontCollision = traverseBVH(bvh, this.frontCollisionBox);
        //console.log("--collision", frontCollision)


        if (frontCollision != false)
            return frontCollision;
        else return traverseBVH(bvh, this.backCollisionBox);
    }

    checkSceneElementCollision(element)
    {
        return this.frontCollisionBox.intersectsBox(element);
    }

    checkAutoCarCollision(front_autoCarbox, middle_autoCarbox, back_autoCarbox)
    {
        if (this.frontCollisionBox.intersectsBox(front_autoCarbox) || this.frontCollisionBox.intersectsBox(middle_autoCarbox) || this.frontCollisionBox.intersectsBox(back_autoCarbox) ||
            this.backCollisionBox.intersectsBox(front_autoCarbox) || this.backCollisionBox.intersectsBox(middle_autoCarbox) || this.backCollisionBox.intersectsBox(back_autoCarbox))
            return true;
        else return false;
    }

    sendToPosition(position){

        this.mesh.position.set(position.x, position.y, position.z);
        this.pivotPoint.set(position.x, position.y, position.z);

        this.vel = 0;
        //this.angle = 90;
    }

    setCarRotation(firstPoint, secondPoint) {
        // angle in radians
        const angleRad = Math.atan2(secondPoint.y - firstPoint.y, secondPoint.x - firstPoint.x);
    
        // Convert to degrees
        const angleDeg = (angleRad * 180) / Math.PI;
    
        // Set the car rotation
        this.angle = angleDeg;
    }

    rotateWheels(deltaTime){

        // rotate front
        let front = this.wheelGroup.children[0];

        let wheel1 = front.children[0];
        let wheel2 = front.children[1];


        //rotate back
        let back = this.wheelGroup.children[1];

        let wheel3 = back.children[0];
        let wheel4 = back.children[1];

        // Rotate wheels 
        let wheelRotationSpeed = Math.abs(this.vel) * 0.1;

        wheel1.rotation.x += wheelRotationSpeed * deltaTime;
        wheel2.rotation.x += wheelRotationSpeed * deltaTime;
        wheel3.rotation.x += wheelRotationSpeed * deltaTime;
        wheel4.rotation.x += wheelRotationSpeed * deltaTime;
    }


    modulateSpeed(speedDecay=0.8) {
        //const speedDecay = 0.8;

        /*if (Math.abs(this.vel) < 0.1) {
            this.vel = 0; // Set to exactly zero if very close to zero
        } else {

            if (Math.sign(this.vel) == 1 && (speedDecay * Math.sign(this.vel) < this.vel ))
                    this.vel -= speedDecay * Math.sign(this.vel);
            else if (Math.sign(this.vel) == -1 && (speedDecay * Math.sign(this.vel) > this.vel ))
                    this.vel -= speedDecay * Math.sign(this.vel);
            else
                this.vel = 0;
        }*/

        if (Math.sign(this.vel) == 1)
                {if (speedDecay * Math.sign(this.vel) < this.vel )
                    this.vel -= speedDecay * Math.sign(this.vel);
                else
                    this.vel = 0;}
        else if (Math.sign(this.vel) == -1)
            {if (speedDecay * Math.sign(this.vel) > this.vel )
                    this.vel -= speedDecay * Math.sign(this.vel);
            else
                this.vel = 0;}

    }




    update(deltaTime) {
        let xMove = this.vel * deltaTime * 0.01 * Math.sin(-this.angle) * (this.speedFactor + 0.1);
        let zMove = this.vel * deltaTime * 0.01 * Math.cos(-this.angle) * (this.speedFactor + 0.1);

        if (isNaN(xMove) || isNaN(zMove)) {
            console.error("NaN detected in calculations. Check values:", this.vel, deltaTime, this.angle, this.speedFactor);
        } else {
            // Update the position based on the car's orientation
            this.mesh.position.x -= xMove;
            this.pivotPoint.x -= xMove;
            this.mesh.position.z -= zMove;
            this.pivotPoint.z -= zMove;

            //console.log("Position updated: ", xMove, zMove);
        }

        //if (this.vel > 0) this.vel -= 0.4;

        this.rotateWheels(deltaTime);

        this.modulateSpeed();

        // Update camera position based on car's position and orientation
        const offsetX = 0; // Adjust these values as needed
        const offsetY = 3; // Adjust these values as needed
        const offsetZ = 3; // Adjust these values as needed

        const rotationMatrix = new THREE.Matrix4().makeRotationY(-this.angle);
        const offsetVector = new THREE.Vector3(offsetX, offsetY, offsetZ).applyMatrix4(rotationMatrix);

        this.cam_pos.copy(this.mesh.position).add(offsetVector);
        this.cam.position.copy(this.cam_pos);

        // Update camera lookAt based on car's position and orientation
        const lookAtOffset = new THREE.Vector3(0, 0, -1).applyMatrix4(rotationMatrix);
        this.cam_look.copy(this.pivotPoint).add(lookAtOffset);
        this.cam.lookAt(this.cam_look);
    }

    turn(v){
        if (this.vel != 0) {
            const maxFrontWheelRotation = Math.PI / 6; 

            this.angle += v * Math.PI * (this.speedFactor + 0.1);
    
            // Limit the rotation of the front wheels
            if (Math.abs(this.frontGroup.rotation.y - v * Math.PI * (this.speedFactor + 0.1)) <= maxFrontWheelRotation) {
                this.frontGroup.rotation.y -= v * Math.PI * (this.speedFactor + 0.1);
            }
    
            this.mesh.rotation.y = this.angle;
        }
    }

    resetWeelsDierection() {
        this.frontGroup.rotation.y = 0;
    }
        
    accelarate(v){
        this.vel += v;
    }

    



}
export {MyVehicle};