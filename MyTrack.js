import * as THREE from 'three';
import {MyContentBuilder} from './MyContentBuilder.js';
/**
 *  This class contains the contents of out application
 */
class MyTrack  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
      this.app = app
      this.builder = new MyContentBuilder(this.app);

      this.track1 = {
        segments: 100,
        width: 1.9,
        scale: [1,0.1,1], 
        textureRepeat: 1,
        showWireframe: false,
        showMesh: true,
        showLine: true,
        closedCurve: true,
        path: [
          new THREE.Vector3(-8, 0, 5),
          new THREE.Vector3(-8, 0, -6),
          new THREE.Vector3(-8, 0, -8),
          new THREE.Vector3(-6, 0, -10),
          new THREE.Vector3(2, 0, -10),
          new THREE.Vector3(4, 0, -8),
          new THREE.Vector3(4, 0, -6),
          new THREE.Vector3(2, 0, -4),
          new THREE.Vector3(0, 0, -2),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(2, 0, 2),
          new THREE.Vector3(4, 0, 2),
          new THREE.Vector3(6, 0, 4),
          new THREE.Vector3(6, 0, 8),
          new THREE.Vector3(4, 0, 10),
          new THREE.Vector3(2, 0, 12),
          new THREE.Vector3(-4, 0, 12),
          new THREE.Vector3(-8, 0, 10),
          new THREE.Vector3(-8, 0, 5),
        ]      
      };

      
    }

    /**
     * initializes the contents
     */
    init() {


    }

    buildTrack() {
        
      let track = this.track1;

      // Textured material
      const trackTex = new THREE.TextureLoader().load("./scenes/t01g03/textures/track.jpg");
      let trackMaterial = new THREE.MeshStandardMaterial({
          map: trackTex,
      });
      trackMaterial.map.repeat.set(6, 3);
      trackMaterial.map.wrapS = THREE.RepeatWrapping;
      trackMaterial.map.wrapT = THREE.RepeatWrapping;

      // Adjust the emissive color for additional visibility
      trackMaterial.emissive.setHex(0x111111);
          
      this.curve = this.buildCurve(track, trackMaterial);
      this.app.scene.add(this.curve); // show track in the scene

      const startTex = new THREE.TextureLoader().load("./scenes/t01g03/textures/start.jpg");
      let startMaterial = new THREE.MeshStandardMaterial({ map: startTex });
      // Adjust the emissive color for additional visibility
      startMaterial.emissive.setHex(0x111111);

      let plane = new THREE.PlaneGeometry(1, 3);
      let startMesh = new THREE.Mesh(plane, startMaterial)
      startMesh.rotation.set(-Math.PI/2,0,Math.PI/2);
      startMesh.position.set(8,0.1,3.5);
      startMesh.name = "track";

      this.app.scene.add(startMesh); // show start in the scene track
  
      return track;
    }

    buildCurve(track, material) {
      let materials = this.createCurveMaterialsTextures(material);
      return this.createCurveObjects(track, materials);
    }

    createCurveMaterialsTextures(material) {
  
      let wireframeMaterial = new THREE.MeshBasicMaterial({
          color: 0x0000ff,
          opacity: 0.3,
          wireframe: true,
          transparent: true,
      });

      let lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

      return { material: material, wireframeMaterial: wireframeMaterial, lineMaterial: lineMaterial};
    }

    createCurveObjects(track, materials) {

      let catmull = new THREE.CatmullRomCurve3(track.path);
      console.log(track.path)

      let geometry = new THREE.TubeGeometry(
        catmull,
        track.segments,
        track.width,
        3,
        track.closedCurve
      );

      let mesh = new THREE.Mesh(geometry, materials.material);
      let wireframe = new THREE.Mesh(geometry, materials.wireframeMaterial);
  
      let sampledPoints = catmull.getPoints(track.segments);
      let bGeometry = new THREE.BufferGeometry().setFromPoints(sampledPoints);
  
      // Create the final object to add to the scene
      let curve_line_obj = new THREE.Line(bGeometry, materials.lineMaterial);
  
      let curve = new THREE.Group();
  
      mesh.visible = track.showMesh;
      mesh.name = "track";

      wireframe.visible = track.showWireframe;
      curve_line_obj.visible = track.showLine;

  
      curve.add(mesh);
      curve.add(wireframe);
      curve.add(curve_line_obj);
  
      curve.scale.set(track.scale[0], track.scale[1], track.scale[2]);
      curve.rotateZ(Math.PI)

      return curve;
    }

}
export {MyTrack};
