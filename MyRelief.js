import * as THREE from 'three';


class MyRelief {
  constructor() {

    this.mesh = this.build();
  }

    build() {

        let planeGeometry = new THREE.PlaneGeometry(5, 5, 50, 50); 

        let rgbTexture = new THREE.TextureLoader().load('scenes/t01g03/textures/waterTex.jpg');
        let depthMapTexture = new THREE.TextureLoader().load('scenes/t01g03/textures/waterMap.jpg');

        let material = new THREE.ShaderMaterial({
            uniforms: {
                rgbTexture: { value: rgbTexture },
                depthMapTexture: { value: depthMapTexture },
                displacementScale: { value: 0.1 } 
            },
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent
        });

        let planeMesh = new THREE.Mesh(planeGeometry, material);
        

        return planeMesh;

    }

}

export { MyRelief}