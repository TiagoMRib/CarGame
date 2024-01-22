import * as THREE from 'three';

class GhostBillboard {

    constructor(){

        this.sprite = this.build();


    }

    build(){

        const map = new THREE.TextureLoader().load( 'scenes/t01g03/textures/bill_ghost.png' );
        const material = new THREE.SpriteMaterial( { map: map } );

        const sprite = new THREE.Sprite( material );

        return sprite;
    }

    updateRotation(camera) {
        // Calculate the vector from the sprite to the camera
        const direction = new THREE.Vector3();
        camera.getWorldPosition(direction);
        direction.sub(this.sprite.position);
    
        // Set the sprite's rotation only on the horizontal plane
        this.sprite.rotation.y = Math.atan2(direction.x, direction.z);
    
        // Optionally, you can adjust the rotation to make it face the camera properly based on your scene
        // this.sprite.rotation.y += Math.PI; // For example, you might need to rotate it 180 degrees
    
        // Update the sprite's matrix world
        this.sprite.updateMatrixWorld();
    }

}

export {GhostBillboard}