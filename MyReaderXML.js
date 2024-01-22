import * as THREE from 'three';
import {MyContentBuilder} from './MyContentBuilder.js';
import { BVHNode, buildBVH, traverseBVH } from './BVHNode.js';
import { MyFileReader } from './parser/MyFileReader.js';


class MyReaderXML {
    constructor(app){
        this.app = app;
        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        this.builder = new MyContentBuilder(this.app);

        this.defaultMaterial = new THREE.MeshLambertMaterial({
            color: 0xdddbcc,
            emissive: "#000000" })

		this.lightIds = ["spotlight", "pointlight", "directionallight"]
        this.materials = null;
        this.textures = null;
        this.cameras = null;
        this.logs = null;        
        this.wireframemode = false;

        this.forbiddenZones = ["tree_group_1", "tree_group_2", "tree_group_3", "tree_group_4", "tree_group_5", "tree_group_6",
                                "barrier1", "barrier2", "barrier3", "barrier4", "barrier5", "stand_1", "stand_2",
                                "arc1", "arc2", "arc3", "arc4"]
        this.sceneBoundingBoxes = [];


        
        this.init();

    }

    init() {

        this.car_mesh = null;
        this.obj_name = null;
        this.low_saturation = false
        this.is_car = false;
        this.is_scene = false;

    }

    load_xml(path) {

        this.reader.open(path); 
        
    }

    load_xml_pickerObj(path, obj_name) {

        this.obj_name = obj_name; 
        this.reader.open(path);
        
    }

    output(obj, indent = 0) {
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);

        //this.app.scene.fog = new THREE.Fog(data.fog.color, data.fog.near, data.fog.far);
    }

    buildPrimitive(child, material)
    {
        console.log("subtype: ", child.subtype )
        if (child.subtype == "rectangle")
        {
            let xy1 = child.representations[0].xy1
            let xy2 = child.representations[0].xy2
            let parts_x = child.representations[0].parts_x
            let parts_y = child.representations[0].parts_y
            let rectTest = this.builder.buildRectangle(xy1, xy2, parts_x, parts_y, material);
            return rectTest;
        }
        if (child.subtype == "cylinder")
        {
            console.log("cylinder...");
            console.log(child);

            let base = child.representations[0].base;
            let top = child.representations[0].top;
            let height = child.representations[0].height;
            let slices = child.representations[0].slices;
            let stacks = child.representations[0].stacks;
            let thetastart = child.representations[0].thetastart;
            let thetalength = child.representations[0].thetalength;
            let capsclose = child.representations[0].capsclose;

            let cylTest = this.builder.buildCylinder(base, top, height, slices, stacks, thetastart, thetalength, capsclose, material);
            return cylTest;

        }
        if (child.subtype == "box")
        {
            let box_group = this.builder.buildBox(child, material);
            return box_group;

        }
        if (child.subtype == "sphere")
        {
            let radius = child.representations[0].radius;
            let slices = child.representations[0].slices;
            let stacks = child.representations[0].stacks;
            let thetaStart = child.representations[0].thetastart;
            let thetalength = child.representations[0].thetalength;
            let phiStart = child.representations[0].phistart;
            let philength = child.representations[0].philength;
            

            let sphereTest = this.builder.buildSphere(radius, slices, stacks, thetaStart,thetalength,phiStart,philength, material);
            return sphereTest;

        }

        if (child.subtype == "triangle")
        {

            let xy1 = child.representations[0].xyz1
            let xy2 = child.representations[0].xyz2
            let xy3 = child.representations[0].xyz3

            let triangle = this.builder.buildTriangle(xy1, xy2, xy3, material);
            return triangle;

        }
        if (child.subtype == "polygon")
        {
            let radius = child.representations[0].radius;
            let stacks = child.representations[0].stacks;
            let slices = child.representations[0].slices;
            let color_c = child.representations[0].color_c;
            let color_p = child.representations[0].color_p;

            let polygon = this.builder.buildPolygon(radius, stacks, slices, color_c, color_p, material);

            //console.log("polygon:", polygon)
            return polygon;
        }
    }

    buildNurbs(child, material){

        //console.log("Nurb " + Object.keys(child.representations[0]));
        //degree_u,degree_v,parts_u,parts_v,distance,type,controlpoints

        let controlpoints = child.representations[0].controlpoints;

        let degree_u = child.representations[0].degree_u;
        let degree_v = child.representations[0].degree_v;

        let parts_u = child.representations[0].parts_u;
        let parts_v = child.representations[0].parts_v;

        let distance = child.representations[0].distance;
        let type = child.representations[0].type;

        let nurbsTest = this.builder.buildNurbs(controlpoints, degree_u, degree_v, parts_u, parts_v, material, distance, type);

        return nurbsTest;

    }

    changeMaterial(){

        if (this.group != null) {
            this.group.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material.wireframe = this.wireframemode;
                }
            });
        }
    }

    getMaterial(materialId) {
        let object_material = null;
        let object_texture = null;
    
        const materialArray = Object.values(this.materials);
    
        for (const material of materialArray) {
            if (material.id == materialId) {
                object_material = material;
                break;
            }
        }
    
        if (object_material && object_material.textureref != null) {

            const textureArray = Object.values(this.textures);
    
            for (const texture of textureArray) {
                if (texture.id == object_material.textureref) {
                    object_texture = texture;
                    break;
                }
            }
        }

        if (object_material == null) {
            console.log("Material not found. Using default material.");
            object_material = this.defaultMaterial;
        }

        let alltexturesArray = Object.values(this.textures);
        
        let material = this.builder.buildMaterial(object_material, object_texture, alltexturesArray);

        material.wireframe = this.wireframemode;

        return material;
    }
    
    nodeExplorer(node, fatherMaterial = this.defaultMaterial)
    {
        
        let material;

        if (node.materialIds !== undefined && node.materialIds !== null && node.materialIds.length > 0) {
            // If node.material is defined, use it
            material = this.getMaterial(node.materialIds);
        } else {
            // If node.material is null or undefined, use fatherMaterial
            material = fatherMaterial;
        }


        // Exploration of node;
        //console.log("exploration of node -> " + node.id)

        //console.log("node: ", node.id)
        //console.log("node", node)
        //console.log("node cast: ", node.castShadows)
        //console.log("node receive: ", node.receiveShadows)


        let nodeGroup = new THREE.Group();

        let castShadows = node.castShadows;
        let receiveShadows = node.receiveShadows;


        for (let i=0; i< node.children.length; i++) {
            
            let child = node.children[i];

            
            if (child.type === "primitive") {
                //console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
                
                if (child.subtype === "nurbs") {
                    //console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    
                    let nurbMesh = this.buildNurbs(child, material);
                    //console.log("It's a nurb:")
                    //console.log(nurbMesh)
                    //console.log(material)

                    nurbMesh.castShadow = castShadows;
                    nurbMesh.receiveShadow = receiveShadows;

                    if (this.obj_name != null){
                        nurbMesh.name = this.obj_name;
                    }

                    nodeGroup.add(nurbMesh);
                }
                else {

                    let mesh = this.buildPrimitive(child, material);

                    mesh.castShadow = castShadows;
                    mesh.receiveShadow = receiveShadows;
                    
                    if (this.obj_name != null){
                        mesh.name = this.obj_name;
                    }                    
                    
                    nodeGroup.add(mesh);
                }

            }
            else if (child.type == "pointlight" || child.type == "spotlight" || child.type == "directionallight"){
                
                let light = this.builder.buildLight(child);

                nodeGroup.add(light);
            
            }
            else if (child.type == "lod"){

                for (var key in this.lods) {
                    
                    if (this.lods[key].id == child.id) {

                        let lodGroup = this.lodExplorer(this.lods[key], material, castShadows, receiveShadows);   
                        
                        lodGroup.castShadow = castShadows;
                        lodGroup.receiveShadow = receiveShadows;

                        nodeGroup.add(lodGroup);
                    }
                }                   

            }
            else {

                child.castShadows = castShadows;
                child.receiveShadows = receiveShadows;
                let childGroup = this.nodeExplorer(child, material);

                nodeGroup.add(childGroup);

            }

            
        }

        for (let i=0; i< node.transformations.length; i++) {

            if (node.transformations[i].type === 'T') {
                let [x, y, z] = node.transformations[i].translate;
                nodeGroup.position.x += x;
                nodeGroup.position.y += y;
                nodeGroup.position.z += z;

            }
            if (node.transformations[i].type === 'S') {
                let [x, y, z] = node.transformations[i].scale;

                nodeGroup.scale.x *= x;
                nodeGroup.scale.y *= y;
                nodeGroup.scale.z *= z;
            }
            if (node.transformations[i].type === 'R') {                        
                let [x, y, z] = node.transformations[i].rotation; 
                nodeGroup.rotation.x = x * (Math.PI / 180); // degreesToRadians
                nodeGroup.rotation.y = y * (Math.PI / 180);
                nodeGroup.rotation.z = z * (Math.PI / 180);
            }
        }
        

        if (node.hasOwnProperty("castshadows"))
        {
            //console.log("enters here")
            nodeGroup.castShadow = Boolean(node.castshadows)
        }
        if (node.receiveshadows)
        {
            nodeGroup.receiveShadow = Boolean(node.receiveshadows);
            //console.log("receiveShadow ", nodeGroup.receiveShadow);
        }


        console.log("nodeGroup???")

        console.log(nodeGroup)

        if (this.obj_name != null){
            nodeGroup.name = this.obj_name;
        }
        else{
            nodeGroup.name = node.id;
        }

        if (this.is_scene && this.forbiddenZones.includes(nodeGroup.name)){
               
            let forbidBoundingBox = new THREE.Box3();
            
            if (nodeGroup.name.includes("barrier")){

                let collisionCylinderGeometry = null;
                let collisionCylinder = null;
                const collisionCylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                
                switch (nodeGroup.name) {
                    case "barrier1":
                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 1);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x+0.8, nodeGroup.position.y, nodeGroup.position.z-0.9);
                        
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x+0.7, nodeGroup.position.y, nodeGroup.position.z-2);
                        
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);

                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x+0.3, nodeGroup.position.y, nodeGroup.position.z-2.8);
                        
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);

                        break;

                    case "barrier2":
                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x-0.4, nodeGroup.position.y, nodeGroup.position.z+1.65);

                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x-0.6, nodeGroup.position.y, nodeGroup.position.z+0.6);

                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.3);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x-0, nodeGroup.position.y, nodeGroup.position.z+2.5);

                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);
                        
                        break;

                    case "barrier3":
                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x, nodeGroup.position.y, nodeGroup.position.z+1.65);

                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x-0.3, nodeGroup.position.y, nodeGroup.position.z+0.6);

                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);

                        
                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.3);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x+0.7, nodeGroup.position.y, nodeGroup.position.z+2.5);

                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);
                        
                        break;
                    
                    case "barrier4":
                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(0, 0, Math.PI/2); 
                        collisionCylinder.position.set(nodeGroup.position.x-1.8, nodeGroup.position.y, nodeGroup.position.z-2.2);

                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x-1.2, nodeGroup.position.y, nodeGroup.position.z-2);

                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x-0.8, nodeGroup.position.y, nodeGroup.position.z-1.8);
                        
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x-0.3, nodeGroup.position.y, nodeGroup.position.z-1.4);
                        
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x+0.2, nodeGroup.position.y, nodeGroup.position.z-1);
                                                
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);

                        break;
                    
                    case "barrier5":
                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(0, 0, Math.PI/2); 
                        collisionCylinder.position.set(nodeGroup.position.x+0.9, nodeGroup.position.y, nodeGroup.position.z+0.45);

                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x+1.4, nodeGroup.position.y, nodeGroup.position.z+0.2);

                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x+1.8, nodeGroup.position.y, nodeGroup.position.z);
                        
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x+2.2, nodeGroup.position.y, nodeGroup.position.z-0.3);
                        
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 0.5);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.rotation.set(Math.PI/2, 0,0); 
                        collisionCylinder.position.set(nodeGroup.position.x+2.7, nodeGroup.position.y, nodeGroup.position.z-0.8);
                        
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);

                        break;
                
                    default:
                        break;
                }


            }
            else if (nodeGroup.name.includes("arc")){
                console.log("nodeGroup.name")
                console.log(nodeGroup.name)

                let collisionCylinderGeometry = null;
                let collisionCylinder = null;
                const collisionCylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                
                switch (nodeGroup.name) {
                    case "arc1":
                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 1);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.position.set(nodeGroup.position.x-0.3, nodeGroup.position.y+1.5, nodeGroup.position.z);
                        
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 1);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.position.set(nodeGroup.position.x-4.1, nodeGroup.position.y+1.5, nodeGroup.position.z);
                        
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);

                        break;

                    case "arc2":
                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 1);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.position.set(nodeGroup.position.x-0.3, nodeGroup.position.y+1.5, nodeGroup.position.z);
                        
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 1);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.position.set(nodeGroup.position.x-4.1, nodeGroup.position.y+1.5, nodeGroup.position.z);
                        
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);

                        break;

                    case "arc3":
                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 1);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.position.set(nodeGroup.position.x+0.2, nodeGroup.position.y+1.5, nodeGroup.position.z-0.2);
                        
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 1);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.position.set(nodeGroup.position.x+2.6, nodeGroup.position.y+1.5, nodeGroup.position.z-3.2);
                                                
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);

                        break;
                    case "arc4":
                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 1);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.position.set(nodeGroup.position.x+0.2, nodeGroup.position.y+1.5, nodeGroup.position.z-0.2);
                        
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);


                        collisionCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.25, 1);
                        collisionCylinder = new THREE.Mesh(collisionCylinderGeometry, collisionCylinderMaterial);
                        collisionCylinder.position.set(nodeGroup.position.x+2, nodeGroup.position.y+1.5, nodeGroup.position.z-3.55);
                                                
                        forbidBoundingBox = new THREE.Box3();
                        forbidBoundingBox.setFromObject(collisionCylinder);
                        this.sceneBoundingBoxes.push(forbidBoundingBox);

                        break;
                }
            }
            else {
                forbidBoundingBox.setFromObject(nodeGroup);
                this.sceneBoundingBoxes.push(forbidBoundingBox);
            }
            
        }

        return nodeGroup;

    }

    lodExplorer(lod, fatherMaterial=this.defaultMaterial, castShadows, receiveShadows) {

        let material;

        if (lod.materialIds !== undefined && lod.materialIds !== null && lod.materialIds.length > 0) {
            // If node.material is defined, use it
            material = this.getMaterial(lod.materialIds);
        } else {
            // If node.material is null or undefined, use fatherMaterial
            material = fatherMaterial;
        }

        const lodGroup = new THREE.LOD();

        for (let i=0; i< lod.children.length; i++) {
            
            let child = lod.children[i];

            child.node.castShadows = castShadows;
            child.node.receiveShadows = receiveShadows;

            let primitive = this.nodeExplorer(child.node, material);

            lodGroup.addLevel(primitive, child.mindist);

        }

        return lodGroup;

    }

    onAfterSceneLoadedAndBeforeRender(data) {

        //console.log("onAfterSceneLoadedAndBeforeRender")
       
        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item

        this.output(data.options)
        //console.log("textures:")
        //console.log(data.textures)
        for (var key in data.textures) {
            let texture = data.textures[key]
            // Texture keys: id,filepath,isVideo,magFilter,minFilter,mipmaps,anisotropy,type,custom
            //this.output(texture, 1)
        }

        this.textures = data.textures;        

        //console.log("lights:")
        for (var key in data.lights) {
            let light = data.lights[key]

            //console.log("LIGHT", light)
            this.output(light, 1)
        }
        //console.log(data.lights)

        //console.log("materials:")
        //console.log(data.materials)
        for (var key in data.materials) {
            let material = data.materials[key]
            //Material keys: id,color,specular,emissive,shininess,wireframe,shading,textureref,texlength_s,texlength_t,twosided,bump_ref,bump_scale,type,custom
            
            //this.output(material, 1)
        }

        this.materials = data.materials;

        
        //console.log("cameras:")

        var keys = Object.keys(data.cameras);
        keys.sort(); // Assuming keys are strings, this will sort them in lexicographical order

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            let camera = data.cameras[key]
            console.log("CAMERA KEY: " + key)

            //console.log("camera:", Object.keys(camera))
            //this.output(camera, 1)
            //console.log("camera:", camera.type)

            //let cameraObj = this.builder.buildCamera(camera);
            //console.log("cameraObj:", cameraObj)
            //this.cameras.push(cameraObj);
        }

        //console.log("Content cams:", this.cameras)

        //this.app.addCameras(this.cameras);




        let rootGroup = new THREE.Group();
        console.log("Data " + Object.keys(data))

        for (var key in data.textures) {
            let texture = data.textures[key]
            
        }


        //this.output(data.logs)
        //console.log("lods:")
        for (var key in data.lods) {
            let lod = data.lods[key]
            //console.log(lod)
        }

        this.lods = data.lods;
        //console.log(this.lods)

        for (var key in data.nodes) {

            let node = data.nodes[key];

            if (node.id == "vehicle"){
                this.is_car = true;
            }
            else if (node.id == "scene"){
                this.is_scene = true;
            }
            else if (node.id == "obstaclesPicker"){
                this.is_obstaclesPicker = true;
            }
            else if (node.id == "darkDriveObstacle"){
                this.is_darkDriveObstacle = true;
            }
            else if (node.id == "lowSpeedObstacle"){
                this.is_lowSpeedObstacle = true;
            }
            else if (node.id == "stagePicker"){
                this.is_stagePicker = true;
            }


            if (node.id == data.rootId) {
                this.group = this.nodeExplorer(node);
                rootGroup.add(this.group);
            }
            
        }

        if (this.obj_name != null){
            rootGroup.name = this.obj_name;
        }

        console.log("End of onAfterSceneLoadedAndBeforeRender")

        if (this.is_car){
            console.log("is_car")

            this.car_mesh = rootGroup;
            //console.log("Reader: Car mesh: ", this.car_mesh.children);
            //console.log("Reader: Front mesh: ", this.frontwheels);
            //console.log("Reader: Wheel mesh: ", this.wheelGroup);
        }
        else if (this.is_stagePicker){
            console.log("is_stagePicker")

            this.stagePicker_mesh = rootGroup;
            this.is_stagePicker = false;
        }
        else if (this.is_darkDriveObstacle){
            this.darkDriveObstacle_mesh = rootGroup;
            console.log("is_darkDriveObstacle")
            console.log(this.darkDriveObstacle_mesh)
            this.is_darkDriveObstacle = false;
        }
        else if (this.is_lowSpeedObstacle){
            console.log("is_lowSpeedObstacle")

            this.lowSpeedObstacle_mesh = rootGroup;
            this.is_lowSpeedObstacle = false;
        }
        else if (this.is_obstaclesPicker){
            console.log("is_obstaclesPicker")

            this.obstaclesPicker_mesh = rootGroup;
            this.is_obstaclesPicker = false;
        }
        else if (this.is_scene){
            console.log("is_scene")

            // comment skybox for now:
            let skybox_group = this.builder.buildSkyBox(data.skyboxes.default, this.scene_path);
            rootGroup.add(skybox_group);
            this.cenario = rootGroup;
        }
        
    }

} export {MyReaderXML}