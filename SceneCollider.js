import * as THREE from 'three';

class SceneObject {
    constructor(mesh) {
        this.mesh = mesh;
        this.collisionBox = new THREE.Box3().setFromObject(this.mesh);
    }



    
}


class SceneCollider {

    constructor() {

        this.colliderGroup = new THREE.Group();

        this.meshList = [];
        this.boxList = [];
        
    }

    checkAxis(obj) {
        
        let x = obj.x;
        let y = obj.y;
        let z = obj.z;

        if (x !== 0 && y === 0 && z === 0) {
          return 'x';
        } else if (x === 0 && y !== 0 && z === 0) {
          return 'y';
        } else if (x === 0 && y === 0 && z !== 0) {
          return 'z';
        } else {
          return 'n'; // Return null if the input does not match any of the specified conditions
        }
      }

    rotateToPosition(object, rotation) {

        let children = object.children;

        console.log("Object position: ", object.position);

        for (let i=0; i<children.length; i++)
        {
            let child = children[i];

            let distance = child.position.distanceTo(object.position);

            let axis = this.checkAxis(rotation);

            if (axis == 'x') {
                
                child.position.z = distance * Math.sin(rotation.x);
                child.position.y = distance * Math.cos(rotation.x);

            } else if (axis == 'y') {

                child.position.y = distance * Math.sin(rotation.y);
                child.position.x = distance * Math.cos(rotation.y);

            } else if (axis == 'z') {

                child.position.x = distance * Math.sin(rotation.z);
                child.position.y = distance * Math.cos(rotation.z);

            }

            child.rotation.x += rotation.x;
            child.rotation.y += rotation.y;
            child.rotation.z += rotation.z;

        }

    }


    traverseScene(scene){

        console.log("Scene Collider: Traversing scene: ", scene.name)

        let groupPosition = scene.position;
        let groupRotation = scene.rotation;
        let groupScale = scene.scale;


        console.log("Scene Collider: Group position: ", groupPosition);
        console.log("Scene Collider: Group rotation: ", groupRotation.x, groupRotation.y, groupRotation.z);
        console.log("Scene Collider: Group scale: ", groupScale);

        let ignored = ["floor", "inside_stand", "roof", "grass"];

        if (ignored.includes(scene.name)) {
            console.log("Scene Collider: Scene is in the ignore list");
            return null;
        }

        if (scene.name == "unitCube" || scene.name == "house")
        {
            console.log("Unit Cube: ", scene);

            const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
            const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
            const cube = new THREE.Mesh( geometry, material ); 

            cube.position.x = groupPosition.x;
            cube.position.y = groupPosition.y;
            cube.position.z = groupPosition.z; 

            cube.rotation.x = groupRotation.x;
            cube.rotation.y = groupRotation.y;
            cube.rotation.z = groupRotation.z;

            cube.scale.x = groupScale.x;
            cube.scale.y = groupScale.y;
            cube.scale.z = groupScale.z; 

            this.meshList.push(cube);
            return cube;
        }

        if (scene.name == "arc")
        {
            console.log("Arc: ", scene);

            const geometry = new THREE.CylinderGeometry( 1, 2, 1, 32 ); 
            const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
            const cylinder1 = new THREE.Mesh( geometry, material ); 
            const cylinder2 = new THREE.Mesh( geometry, material );

            cylinder1.position.z = 0;
            cylinder2.position.z = 3;

            cylinder1.position.x += groupPosition.x;
            cylinder1.position.y += groupPosition.y;
            cylinder1.position.z += groupPosition.z;

            cylinder2.position.x += groupPosition.x;
            cylinder2.position.y += groupPosition.y;
            cylinder2.position.z += groupPosition.z;

            cylinder1.rotation.x += groupRotation.x;
            cylinder1.rotation.y += groupRotation.y;
            cylinder1.rotation.z += groupRotation.z;

            cylinder2.rotation.x += groupRotation.x;
            cylinder2.rotation.y += groupRotation.y;
            cylinder2.rotation.z += groupRotation.z;

            cylinder1.scale.x *= groupScale.x;
            cylinder1.scale.y *= groupScale.y;
            cylinder1.scale.z *= groupScale.z;

            cylinder2.scale.x *= groupScale.x;
            cylinder2.scale.y *= groupScale.y;
            cylinder2.scale.z *= groupScale.z;

            //this.meshList.push(cylinder1);
            //this.meshList.push(cylinder2);

            let arcGroup = new THREE.Group();
            arcGroup.add(cylinder1);
            arcGroup.add(cylinder2);

            return arcGroup;
        }

        
        if (scene.name == "barrier")
        {
            console.log("Barrier: ", scene);

            const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
            const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
            const cube = new THREE.Mesh( geometry, material ); 


            cube.position.x = 0;
            cube.position.z = 0;

            cube.scale.x = 1;
            cube.scale.z = 1;

            cube.position.x += groupPosition.x;
            cube.position.y += groupPosition.y;
            cube.position.z += groupPosition.z;

            cube.rotation.x += groupRotation.x;
            cube.rotation.y += groupRotation.y;
            cube.rotation.z += groupRotation.z;

            cube.scale.x *= groupScale.x;
            cube.scale.y *= groupScale.y;
            cube.scale.z *= groupScale.z;

            //this.meshList.push(cube);
            return cube;
        } 


        if (scene.type == "Mesh") {
            console.log("Scene Collider: Scene is mesh");

            /*
            if (scene.geometry.type == "ParametricGeometry") {
                console.log("Scene Collider: Sparametric geometry", scene);
                return scene;
            } */

            console.log("Scene Collider: Computing bounding box for mesh: ", scene);


            this.meshList.push(scene);
            return scene;
        }

        //this.rotateToPosition(scene, scene.rotation)

        for (let i=0; i< scene.children.length; i++)
        {
            let child = scene.children[i];
            console.log("Child: ", child.name)

            child.position.x += groupPosition.x;
            child.position.y += groupPosition.y;
            child.position.z += groupPosition.z;


            
            
            child.rotation.x += groupRotation.x;
            child.rotation.y += groupRotation.y;
            child.rotation.z += groupRotation.z; 

 

            

            child.scale.x *= groupScale.x;
            child.scale.y *= groupScale.y;
            child.scale.z *= groupScale.z;



            let sceneChild = this.traverseScene(child);
            
        }




    }

    computeCollisionBoxes(){

        for (let i=0; i<this.meshList.length; i++)
        {
            this.boxList.push( new SceneObject(this.meshList[i]));
        }

    }

    
}

export { SceneCollider };