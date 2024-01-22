import * as THREE from 'three';



class BVHNode {
    constructor(boundingBox, powerUps = []) {
      this.boundingBox = boundingBox;
      this.powerUps = powerUps;
      this.left = null;
      this.right = null;
    }
  }


  function calculateBoundingBox(powerUps) {
    if (powerUps.length === 0) {
      // Return an empty bounding box if there are no power-ups.
      return new THREE.Box3();
    }
  
    // Initialize the bounding box with the first power-up's position.
    const initialPosition = powerUps[0].mesh.position.clone();
    let boundingBox = new THREE.Box3().setFromCenterAndSize(initialPosition, new THREE.Vector3());
  
    // Expand the bounding box to include the positions of all power-ups.
    for (let i = 1; i < powerUps.length; i++) {
       
      let position = powerUps[i].mesh.position;
      boundingBox.expandByPoint(position);
    }
  
    return boundingBox;
  }
  
  
  function buildBVH(powerUps, depth = 0) {
  
    const splitAxis = depth % 3; // Alternating between x, y, and z.
    powerUps.sort((a, b) => a.mesh.position.getComponent(splitAxis) - b.mesh.position.getComponent(splitAxis));

    console.log("Power ups all sorted up: ", powerUps)
  
    const medianIndex = Math.floor(powerUps.length / 2);
    const leftPowerUps = powerUps.slice(0, medianIndex);
    const rightPowerUps = powerUps.slice(medianIndex);
  
    const boundingBox = calculateBoundingBox(leftPowerUps.concat(rightPowerUps)); 
    const node = new BVHNode(boundingBox, powerUps);
  
    if (leftPowerUps.length > 1) {
      console.log("Left power ups: ", leftPowerUps)
      node.left = buildBVH(leftPowerUps, depth + 1);
    }
  
    if (rightPowerUps.length > 1) {
      console.log("Right power ups: ", rightPowerUps)
      node.right = buildBVH(rightPowerUps, depth + 1);
    }
  
    return node;
  }
  
  function traverseBVH(node, carBox) {
    
    // Check if the car's bounding box intersects with the node's bounding box.
    if (carBox.intersectsBox(node.boundingBox)) {
      //console.log("Inside bounding box")
      // Check for collisions with power-ups in this node.
      for (const powerUp of node.powerUps) {
        
        if (carBox.intersectsBox(powerUp.collisionBox)) {
          //console.log("Power up: ", powerUp.collisionBox)
          //console.log("carBox: ", carBox)
          // Collision detected
          //console.log('COLLISION DETECTED')

          //console.log("Power up--: ", powerUp)
          if (powerUp.type){
            //console.log("Power up type: ", powerUp.type)
            return powerUp.type;
          }

          return true;
          
        }
      }

      
  
      // Recursively traverse child nodes.
      if (node.left) {
        traverseBVH(node.left, carBox);
      }
  
      if (node.right) {
        traverseBVH(node.right, carBox);
      }
    }

    return false;
  }

  export { BVHNode, buildBVH, traverseBVH };
  
  // USE LIKE THIS
  /*
  const bvhRoot = buildBVH(powerUps);
  
  // During collision detection:
  const carBox = new THREE.Box3(); // Assuming you have the car's bounding box.
  traverseBVH(bvhRoot, carBox);
  */
  