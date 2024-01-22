import * as THREE from 'three';
import {MyContentBuilder} from '../MyContentBuilder.js';


/**
 *  This class contains the contents of out application
 */
class MyObstacle  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app;

        this.init();
    }

    /**
     * initializes the contents
     */
    init() {
        
        this.obstacles = {
            //width: 0.35,
            numberOfLowSpeedObstacles: 2, 
            numberOfDarkDriveObstacles: 1, 
            //color: 0xff0000,
            obstaclesPoints: null
        }

    }
    
    generateObstacles(trackPoints) {
        let obstaclesPoints = [];
        const numberOfLowSpeedObstacles = this.obstacles.numberOfLowSpeedObstacles;
        const numberOfDarkDriveObstacles = this.obstacles.numberOfDarkDriveObstacles;

        const startLine = new THREE.Vector3(8, 0.5, 5);

        const trackWidth = 2;
    
        for (let i = 0; i < trackPoints.length; i++) {

            const random_width_x = (Math.random() * trackWidth) - (trackWidth / 2);
            const random_width_z = (Math.random() * trackWidth) - (trackWidth / 2);

            const obstaclePosition = new THREE.Vector3(-trackPoints[i].x + random_width_x, trackPoints[i].y + 0.3, trackPoints[i].z + random_width_z);

            // Create an object with a 'position' property
            const obstacle = {
                position: obstaclePosition,
            };

            if (!obstacle.position || !(obstacle.position instanceof THREE.Vector3)) {
                console.error(`ALERT: Invalid obstacle at index ${i}:`, obstacle);
                continue;
            }

            obstaclesPoints.push(obstacle);
            
        }
    
        // Randomly select 'numberOfObstacles' obstacle points
        const selectedObstacles = [];
        const minDistance = 1;

        for (let i = 0; i < numberOfLowSpeedObstacles; i++) {
            
            let isValidPosition = false;
            let newPosition;

            // Keep generating a new position until a valid one is found
            while (!isValidPosition) {
                const randomIndex = Math.floor(Math.random() * obstaclesPoints.length);
                newPosition = obstaclesPoints[randomIndex].position;

                // Check the distance from the new position to existing power-ups
                isValidPosition = selectedObstacles.every(existingObstacle => {
                    const distance = newPosition.distanceTo(existingObstacle.position);
                    const startLineDistance = newPosition.distanceTo(startLine);
                    return distance >= minDistance && startLineDistance >= 3;
                });
            }

            const lowSpeedObstacle = {
                position: newPosition,
                type: "lowSpeed",
                material: new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0xff0000),          // Set the base color to blue
                    metalness: 0.5,               // Set to 1 for a fully metallic appearance
                    roughness: 0.2,             // Adjust the roughness for shininess
                    emissive: new THREE.Color(0x330000),         // No emissive color (black)
                    side: THREE.DoubleSide,     // Render both sides of the geometry
                }),
                geometry: new THREE.BoxGeometry(0.9, 0.35, 0.30)
            }
            selectedObstacles.push(lowSpeedObstacle);

        }

        

        for (let i = 0; i < numberOfDarkDriveObstacles; i++) {
            
            let isValidPosition = false;
            let newPosition;

            // Keep generating a new position until a valid one is found
            while (!isValidPosition) {
                const randomIndex = Math.floor(Math.random() * obstaclesPoints.length);
                newPosition = obstaclesPoints[randomIndex].position;

                // Check the distance from the new position to existing power-ups
                isValidPosition = selectedObstacles.every(existingObstacle => {
                    const distance = newPosition.distanceTo(existingObstacle.position);
                    const startLineDistance = newPosition.distanceTo(startLine);
                    return distance >= minDistance && startLineDistance >= 3;
                });
            }

            const darkDriveObstacle = {
                position: newPosition,
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
                width: 0.35,
                geometry: new THREE.BoxGeometry(0.35, 0.35, 0.35)
            }
            selectedObstacles.push(darkDriveObstacle);
        }

        this.obstacles.obstaclesPoints = selectedObstacles;

        
    
        return this.obstacles;
    }

}

class MyObstacleObject {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
       constructor(app) {
        this.app = app;
        this.mesh = null;
        this.collisionBox = null;

    }


    buildObstacle(element){

        let position = element.position;
        this.type = element.type;

        let obstacleGeometry = null;
        if(element.type == "darkDrive")
            obstacleGeometry = new THREE.BoxGeometry(element.width, element.width, element.width);
        else
            obstacleGeometry = new THREE.BoxGeometry(element.geometry.parameters.width, element.geometry.parameters.height, element.geometry.parameters.depth);

        const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        const obstacleMesh = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        obstacleMesh.position.set(position.x, position.y, position.z);

        this.mesh = obstacleMesh;
        this.collisionBox = new THREE.Box3().setFromObject(obstacleMesh);

        return this.mesh;
    }
}
export { MyObstacle, MyObstacleObject };
