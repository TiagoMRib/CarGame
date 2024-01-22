import * as THREE from 'three';
import { MySimpleNurbsBuilder } from '../MySimpleNurbsBuilder.js';


/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */

class MyLake {

	constructor(app, points, u, v, pos) {
		this.app = app
		this.simpleNurbsBuilder = new MySimpleNurbsBuilder(this.app);
		
		this.geometry = this.simpleNurbsBuilder.build(points, u, v, 10, 10);
		this.material = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide } ); 
		this.mesh = new THREE.Mesh( this.geometry, this.material )
        this.mesh.position.set(pos[0], pos[1], pos[2]);
        this.mesh.rotateZ(Math.PI);
        this.mesh.rotateY(Math.PI/15);
        this.mesh.scale.set(2, 2, 2.5);
		this.setFillMode()
	}

	setFillMode() { 
		this.material.wireframe = false;
		this.material.needsUpdate = true;
	}

	setLineMode() { 
		this.material.wireframe = true;
		this.material.needsUpdate = true;
	}

	setWireframe(value) {
		if (value) {
			this.setLineMode()
		} else {
			this.setFillMode()
		}
	}

}

export {MyLake}

