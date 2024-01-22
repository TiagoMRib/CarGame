import * as THREE from 'three';

import { MyAxis } from './MyAxis.js';

import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';

import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';



/**

 *  This class contains the contents of out application

 */

class MyNurbsBuilder  {


    /**

       constructs the object

       @param {MyApp} app The application object

    */

    constructor(app) {

        this.app = app

    }


    build(controlPoints, degree1, degree2, samples1, samples2) {


        const knots1 = []

        const knots2 = []


        // build knots1 = [ 0, 0, 0, 1, 1, 1 ];

        for (var i = 0; i <= degree1; i++) {

            knots1.push(0)

        }

        for (var i = 0; i <= degree1; i++) {

            knots1.push(1)

        }


        // build knots2 = [ 0, 0, 0, 0, 1, 1, 1, 1 ];

        for (var i = 0; i <= degree2; i++) {

            knots2.push(0)

        }

        for (var i = 0; i <= degree2; i++) {

            knots2.push(1)

        }


        let stackedPoints = []

        //console.log("Control Points: ", controlPoints)

        for (var i = 0; i <= degree1; i++) {

            let newRow = []

            for (var j = 0; j <= degree2; j++) {

                let row = controlPoints[i*(degree2+1)+j]
                console.log("row: ", row)

                let x = row.xx;
                let y = row.yy;
                let z = row.zz;

                newRow.push(new THREE.Vector4(x, y, z, 1));

            }

            stackedPoints[i] = newRow;

        }

        //console.log("Stacked: ", stackedPoints)
        
        const nurbsSurface = new NURBSSurface( degree1, degree2,

                                     knots1, knots2, stackedPoints );

        const geometry = new ParametricGeometry( getSurfacePoint,

                                                 samples1, samples2 );

        return geometry;


       

        function getSurfacePoint( u, v, target ) {

            return nurbsSurface.getPoint( u, v, target );

        }

    }

}


export { MyNurbsBuilder };