import * as THREE from 'three';
import {MyTrack} from './MyTrack.js';
import {MyRoute} from './MyRoute.js';
import {MyObstacle} from './objects/MyObstacle.js';
import {MyVehicle} from './MyVehicle.js';
import {MyPowerUp} from './objects/MyPowerUp.js';
import {MyShader} from './MyShader.js';


/**
 *  This class contains the contents of out application
 */
class MyReader  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app;

        this.trackBuilder = new MyTrack(this.app);
        this.routePointsBuilder = new MyRoute(this.app);
        this.obstaclesBuilder = new MyObstacle(this.app);
        this.powerUpsBuilder = new MyPowerUp(this.app);

    }

    /**
     * initializes the contents
     */
    init() {

        this.vehicle = new MyVehicle(this.app);
        this.auto_vehicle = new MyVehicle(this.app);

        this.track = this.trackBuilder.buildTrack();
        
        this.routePoints = this.routePointsBuilder.generateRoutePoints(this.track, 20, 4);       

    }

    initElements(mesh) {

        this.obstacle_elements = this.obstaclesBuilder.generateObstacles(this.track.path );
        this.showObstacles(this.obstacle_elements.obstaclesPoints);  

        this.powerUps_elements = this.powerUpsBuilder.generatePowerUps(this.track.path, mesh, this.obstacle_elements.obstaclesPoints);
        this.showPowerUps(this.powerUps_elements.powerUpsPoints);  

        
    }

    showObstacles(points){
        
        // The following code is only to show those points on the scene
        for (let i = 0; i < points.length; i++) {
            this.pointMesh = new THREE.Mesh(points[i].geometry, points[i].material);
            this.pointMesh.position.set(points[i].position.x, points[i].position.y, points[i].position.z)
            this.pointMesh.rotateX(-Math.PI/2)
            this.app.scene.add(this.pointMesh)
        }
    }

    showPowerUps(points){
        
        // The following code is only to show those points on the scene
        for (let i = 0; i < points.length; i++) {
            this.pointMesh = new THREE.Mesh(points[i].geometry, points[i].material);
            this.pointMesh.position.set(points[i].position.x, points[i].position.y, points[i].position.z)
            this.pointMesh.rotateX(-Math.PI/2)
            this.app.scene.add(this.pointMesh)
        }
    }


}
export {MyReader};