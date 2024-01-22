import * as THREE from 'three';

/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */

class MyBox {

	constructor(app, pos) {
		this.app = app

		console.log(pos)

		this.geometry = new THREE.BoxGeometry(4, 4, 4);
		this.material = new THREE.MeshPhongMaterial( { side: THREE.DoubleSide } ); 
		this.mesh = new THREE.Mesh( this.geometry, this.material )
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

export {MyBox}

