import * as THREE from 'three';
import {MyContentBuilder} from '../MyContentBuilder.js';


/**
 *  This class contains the contents of out application
 */
class MyPowerUp {

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

        this.powerUps = {
            numberOfSpeedPowerUps: 2, 
            numberOfGhostPowerUps: 1,
            powerUpsPoints: null
        }

    }
    
    generatePowerUps(trackPoints, shader, obstaclesPositions) {
        let allElements = obstaclesPositions;
        let powerUpPoints = [];
        const numberOfSpeedPowerUps = this.powerUps.numberOfSpeedPowerUps;
        const numberOfGhostPowerUps = this.powerUps.numberOfGhostPowerUps;

        const startLine = new THREE.Vector3(8, 0.5, 5);

        const trackWidth = 2;
    
        for (let i = 0; i < trackPoints.length; i++) {

            const random_width_x = (Math.random() * trackWidth) - (trackWidth / 2);
            const random_width_z = (Math.random() * trackWidth) - (trackWidth / 2);

            const powerUpPosition = new THREE.Vector3(-trackPoints[i].x + random_width_x, trackPoints[i].y + 0.3, trackPoints[i].z + random_width_z);

            console.log("Track point 0", trackPoints[0])
            // Create an object with a 'position' property
            const powerUp = {
                position: powerUpPosition,
            };

            if (!powerUp.position || !(powerUp.position instanceof THREE.Vector3)) {
                console.error(`ALERT: Invalid powerUp at index ${i}:`, powerUp);
                continue;
            }

            powerUpPoints.push(powerUp);
        }
    
       // Randomly select 'numberOfSpeedPowerUps' obstacle points
        const selectedPowerUps = [];
        const minDistance = 1;

        for (let i = 0; i < numberOfSpeedPowerUps; i++) {
            let isValidPosition = false;
            let newPosition;

            // Keep generating a new position until a valid one is found
            while (!isValidPosition) {
                const randomIndex = Math.floor(Math.random() * powerUpPoints.length);
                newPosition = powerUpPoints[randomIndex].position;

                // Check the distance from the new position to existing power-ups
                isValidPosition = allElements.every(existingElement => {
                    const distance = newPosition.distanceTo(existingElement.position);
                    const startLineDistance = newPosition.distanceTo(startLine);
                    return distance >= minDistance && startLineDistance >= 3;
                });
            }

            const speedPowerUp = {
                position: newPosition,
                type: "superSpeed",
                material: new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0x0000ff),
                    metalness: 0.5,
                    roughness: 0.2,
                    emissive: 0x000000,
                    side: THREE.DoubleSide,
                }),
                width: 0.25,
                geometry: new THREE.SphereGeometry(0.25, 20),
            };

            selectedPowerUps.push(speedPowerUp);
            allElements.push(speedPowerUp);
        }

        for (let i = 0; i < numberOfGhostPowerUps; i++) {
            let isValidPosition = false;
            let newPosition;

            // Keep generating a new position until a valid one is found
            while (!isValidPosition) {
                const randomIndex = Math.floor(Math.random() * powerUpPoints.length);
                newPosition = powerUpPoints[randomIndex].position;
                newPosition.y += 0.15;

                // Check the distance from the new position to existing power-ups
                isValidPosition = allElements.every(existingElement => {
                    const distance = newPosition.distanceTo(existingElement.position);
                    const startLineDistance = newPosition.distanceTo(startLine);
                    return distance >= minDistance && startLineDistance >= 3;
                });
            }
            
            const ghostPowerUp = {
                position: newPosition,
                type: "ghostPower",
                material: shader.material,
                width: 0.25,
                geometry: shader.geometry
            };

            selectedPowerUps.push(ghostPowerUp);
            allElements.push(ghostPowerUp);

        }
        

        this.powerUps.powerUpsPoints = selectedPowerUps;
    
        return this.powerUps;
    }
    
}

class MyPowerUpObject {

    /**
   constructs the object
   @param {MyApp} app The application object
*/ 
   constructor(app) {
    this.app = app;
    this.mesh = null;
    this.collisionBox = null;
    this.type = null

    }


    buildPowerUp(element){

        let position = element.position;
        this.type = element.type;

        const powerupGeometry = new THREE.SphereGeometry(element.width, 20);
        const powerupMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        const powerupMesh = new THREE.Mesh(powerupGeometry, powerupMaterial);
        powerupMesh.position.set(position.x, position.y, position.z);

        this.mesh = powerupMesh;
        this.collisionBox = new THREE.Box3().setFromObject(powerupMesh);
        
        return this.mesh;
    }
}

export { MyPowerUp, MyPowerUpObject };
