import * as THREE from 'three';
/**
 *  This class contains the contents of out application
 */
class MyRoute  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
    }

    /**
     * initializes the contents
     */
    init() {   

    }

    /**
     * 
     * @param {*} track 
     * @param {*} numberOfPoints if smaller the car will go faster
     * @param {*} distanceThreshold max allowed distance of two curve points
     * @returns the route points of the track
     */
    generateRoutePoints(track, numberOfPoints, distanceThreshold){
        let catmull = new THREE.CatmullRomCurve3(track.path);

        let routePoints = [];
        let pointBefore = null;

        for (let i = 0; i < numberOfPoints; i++) {
            
            const t = i / (numberOfPoints - 1);
            let currentPoint = catmull.getPoint(t);
            currentPoint.x = -currentPoint.x;
            currentPoint.y = currentPoint.y + 0.4;

            if (pointBefore != null) {
                // Calculate the distance between current and before points along the Ox and Oz axes
                const distanceX = Math.abs(currentPoint.x - pointBefore.x);
                const distanceZ = Math.abs(currentPoint.z - pointBefore.z);

                // Check if additional points are needed based on the distance threshold
                if (distanceX > distanceThreshold || distanceZ > distanceThreshold) {

                    // Calculate the number of additional points to insert
                    const numberOfAdditionalPoints = Math.floor(
                        Math.max(distanceX, distanceZ) / distanceThreshold
                    );
                    console.log(numberOfAdditionalPoints);

                    console.log("> interpolatedPoints:");

                    // Interpolate and add additional points
                    for (let j = 1; j <= numberOfAdditionalPoints; j++) {
                        const t = j / (numberOfAdditionalPoints + 1);
                        const interpolatedPoint = new THREE.Vector3(
                            THREE.MathUtils.lerp(pointBefore.x, currentPoint.x, t),
                            pointBefore.y,
                            THREE.MathUtils.lerp(pointBefore.z, currentPoint.z, t)
                        );
                        routePoints.push(interpolatedPoint);
                        
                        console.log(interpolatedPoint);
                    }
                }
            }
            
            console.log(currentPoint)
            routePoints.push(currentPoint);

            pointBefore = currentPoint;

            
        }

        //console.log("-> routePoints")
        //console.log(routePoints)

        return routePoints;
    }

}
export {MyRoute};