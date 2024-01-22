import * as THREE from 'three';

/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */

class MyCloud {

	constructor(app, radius, scale, pos) {
		this.app = app

		this.geometry = new THREE.SphereGeometry(radius, 32, 32);
		this.material = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide } ); 
		this.mesh = new THREE.Mesh( this.geometry, this.material )
		this.mesh.scale.set(scale[0], scale[1], scale[2]);
        this.mesh.position.set(pos[0], pos[1], pos[2]);
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

export {MyCloud}

