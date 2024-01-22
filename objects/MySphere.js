import * as THREE from 'three';

/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */

class MySphere {

	constructor(app) {
		this.app = app

		this.geometry = new THREE.SphereGeometry(0.25, 20, 20);
		this.material = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide } ); 
		this.mesh = new THREE.Mesh( this.geometry, this.material )
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

export {MySphere}

