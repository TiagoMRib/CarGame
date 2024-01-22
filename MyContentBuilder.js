import * as THREE from 'three';
import * as materialsBuilderTHREE from 'three';
//import { MyMaterials } from './MyMaterials.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';



class MyContentBuilder {

    constructor(app) {

        this.app = app;
        this.nurbBuilder = new MyNurbsBuilder(app);


    }

    buildCamera(camera) {

        //console.log("Camera builder:", camera.type)

        if (camera.type == "perspective"){

            //'id', 'angle', 'near', 'far', 'location', 'target', 'type', 'custom'

            let fov = 2 * Math.atan(Math.tan(camera.angle / 2 * (Math.PI / 180))) * (180 / Math.PI);
            //let aspect = 16 / 9; // not sure
            let aspect = window.innerWidth / window.innerHeight;

            let perspective = new THREE.PerspectiveCamera(fov, aspect, camera.near, camera.far);

            //console.log("Perpective keys", Object.keys(perspective))

            perspective.name = camera.id;
            perspective.position.set(camera.location[0], camera.location[1], camera.location[2]);

            perspective.lookAt(camera.target[0], camera.target[1], camera.target[2]);

            return perspective;
        }
        if (camera.type == "orthogonal"){


            //console.log("Ortho camera builder")
            // 'id', 'near', 'far', 'location', 'target', 'left', 'right', 'bottom', 'top', 'type', 'custom'

            //console.log("cam near: ", camera.near)
            //console.log("cam far: ", camera.far)

            let orthographic = new THREE.OrthographicCamera(camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far);

            //console.log("window cam", camera)
            //console.log("window width: ", window.innerWidth)
            //console.log("window height: ", window.innerHeight)
            //let orthographic = new THREE.OrthographicCamera(window.innerWidth / camera.left, window.innerWidth / camera.right, window.innerHeight / camera.top, window.innerHeight / camera.bottom, camera.near, camera.far);

            //console.log("camera loc: ", camera.location)
            orthographic.position.set(camera.location[0], camera.location[1], camera.location[2]);
            //console.log("ortho keys: ", Object.keys(orthographic))

            orthographic.name = camera.id;
            
            //console.log("camera taregt: ", camera.target)

            orthographic.lookAt(camera.target[0], camera.target[1], camera.target[2]);


            return orthographic;
        }
    }


    calculateRectangleProperties(xy1, xy2) {
        // Parse the input strings to extract the coordinates
        const [x1, y1] = xy1;
        const [x2, y2] = xy2;
    
        // Calculate the width and height of the rectangle
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
    
        // Calculate the position of the rectangle
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
    
        // Create an object to store the results
        const rectangleProperties = {
            width,
            height,
            position: { x: centerX, y: centerY },
        };
    
        return rectangleProperties;
    }

    calculateBoxProperties(xyz1, xyz2) {
        
        const [x1, y1, z1] = xyz1;
        const [x2, y2, z2] = xyz2;
    
        // Calculate the width, height, and depth of the box
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        const depth = Math.abs(z2 - z1);
    
        // Calculate the position (center) of the box
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        const centerZ = (z1 + z2) / 2;
    
        // Create an object to store the results
        const boxProperties = {
            width,
            height,
            depth,
            position: { x: centerX, y: centerY, z: centerZ },
        };
    
        return boxProperties;
    }

    /*

        buildRectangle(xy1, xy2, parts_x, parts_y, material){

        let rect = this.calculateRectangleProperties(xy1, xy2);

        let rectangle = new THREE.PlaneGeometry(rect.width, rect.height, parts_x, parts_y);

        let rectangleMesh = new THREE.Mesh(rectangle, material);

        rectangleMesh.position.set(rect.position.x, rect.position.y, 0);

        return rectangleMesh;
    }
    
    */

    buildPolygon(radius, stacks, slices, color_c, color_p, material) {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        const normals = [];
    
        function calculateVertexPosition(stack, slice, totalStacks, totalSlices) {
            const theta = (slice / totalSlices) * Math.PI * 2;
            const phi = (stack / totalStacks) * Math.PI;
    
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = 0;
            const z = radius * Math.sin(phi) * Math.sin(theta);
    
            return new THREE.Vector3(x, y, z);
        }
    
        for (let stack = 0; stack < stacks; stack++) {
            for (let slice = 0; slice < slices; slice++) {
                const vertex1 = calculateVertexPosition(stack, slice, stacks, slices);
                const vertex2 = calculateVertexPosition(stack + 1, slice, stacks, slices);
                const vertex3 = calculateVertexPosition(stack, (slice + 1) % slices, stacks, slices);
    
                vertices.push(vertex1.x, vertex1.y, vertex1.z);
                vertices.push(vertex3.x, vertex3.y, vertex3.z);
                vertices.push(vertex2.x, vertex2.y, vertex2.z);
    
                const colorCenter = new THREE.Color(color_c);
                const colorPeriphery = new THREE.Color(color_p);
                const colorIntermediate = new THREE.Color();
                
                colorIntermediate.lerpColors(colorCenter, colorPeriphery, 0.5);
    
                colors.push(colorCenter.r, colorCenter.g, colorCenter.b);
                colors.push(colorCenter.r, colorCenter.g, colorCenter.b);
                colors.push(colorIntermediate.r, colorIntermediate.g, colorIntermediate.b);
    
                /*
                colors.push(colorCenter.r, colorCenter.g, colorCenter.b);
                colors.push(colorIntermediate.r, colorIntermediate.g, colorIntermediate.b);
                colors.push(colorIntermediate.r, colorIntermediate.g, colorIntermediate.b); */
    
                // Calculate normals
                const normal = new THREE.Vector3().crossVectors(
                    new THREE.Vector3().subVectors(vertex2, vertex1),
                    new THREE.Vector3().subVectors(vertex3, vertex1)
                ).normalize();
    
                normals.push(normal.x, normal.y, normal.z);
                normals.push(normal.x, normal.y, normal.z);
                normals.push(normal.x, normal.y, normal.z);
            }
        }
    
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    
        const colormaterial = new THREE.MeshStandardMaterial( {
            color: 0xffffff, vertexColors: true, transparent: false
        } );
    
        const mesh = new THREE.Mesh(geometry, colormaterial);
    
        return mesh;
    }
    
    
    
    
    


    getRectangleGeometry(x_size, y_size, parts_x, parts_y) {
        const halfX = x_size / 2;
        const halfY = y_size / 2;
    
        const vertices = [];
        const uvs = [];
        const indices = [];
        const normals = [];
    
        for (let i = 0; i <= parts_y; i++) {
            const v = i / parts_y; 
            const y = -halfY + v * y_size;
    
            for (let j = 0; j <= parts_x; j++) {
                const u = j / parts_x; 
                const x = -halfX + u * x_size;
    
                vertices.push(x, y, 0); 
                uvs.push(u, v);
    
                // Compute normals
                const normal = new THREE.Vector3(0, 0, 1); 
                normals.push(normal.x, normal.y, normal.z);
    
                if (i < parts_y && j < parts_x) {
                    const vertexIndex = i * (parts_x + 1) + j;
                    indices.push(vertexIndex, vertexIndex + parts_x + 1, vertexIndex + 1);
                    indices.push(vertexIndex + 1, vertexIndex + parts_x + 1, vertexIndex + parts_x + 2);
                }
            }
        }
    
        const geometry = new THREE.BufferGeometry();
    
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
        geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3)); // Add normals
        geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
    
        geometry.computeVertexNormals(); 
    
        return geometry;
    }
    

    

    buildRectangle(xy1, xy2, parts_x, parts_y, material) {
        const [x1, y1] = xy1;
        const [x2, y2] = xy2;
    
        const vertices = new Float32Array([
            x1, y1, 0,
            x2, y1, 0,
            x1, y2, 0,
            x2, y2, 0,
        ]);
    
        const uvs = new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 1,
        ]);
    
        const indices = new Uint32Array([0, 1, 2, 1, 3, 2]);
    
        const normals = new Float32Array([
            0, 0, 1, 
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ]);
    
        const geometry = new THREE.BufferGeometry();
    
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2)); // texture
        geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3)); // Add normals
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    
        // Optional: compute vertex normals
        geometry.computeVertexNormals();
    
        let rectangleMesh = new THREE.Mesh(geometry, material);
    
        return rectangleMesh;
    }
    

    /*  SEE IF TIME

    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }

    buildRectangle(xy1, xy2, parts_x, parts_y, material) {
    const [x1, y1] = xy1;
    const [x2, y2] = xy2;

    const vertices = [];
    const uvs = [];
    const indices = [];

    for (let i = 0; i <= parts_y; i++) {
        for (let j = 0; j <= parts_x; j++) {
            const u = j / parts_x;
            const v = i / parts_y;

            const xPos = this.lerp(x1, x2, u);
            const yPos = this.lerp(y1, y2, v);

            vertices.push(xPos, yPos, 0);
            uvs.push(u, v);

            if (j < parts_x && i < parts_y) {
                const vertexIndex = i * (parts_x + 1) + j;
                indices.push(vertexIndex, vertexIndex + parts_x + 1, vertexIndex + 1);
                indices.push(vertexIndex + 1, vertexIndex + parts_x + 1, vertexIndex + parts_x + 2);
            }
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
    geometry.computeVertexNormals();

    let rectangleMesh = new THREE.Mesh(geometry, material);

    return rectangleMesh;
}

    */

    buildTriangle(xyz1, xyz2, xyz3, material){

        let vertices = new Float32Array([
            xyz1[0], xyz1[1], xyz1[2],    // vertex 1
            xyz2[0], xyz2[1], xyz2[2],     // vertex 2
            xyz3[0], xyz3[1], xyz3[2],      // vertex 3
        ]);

        const uvs = new Float32Array([0, 0, 1, 0, 0.5, 1]);

        const indices = new Uint32Array([0, 1, 2]);
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2)); // texture
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      
 
        const triangleMesh = new THREE.Mesh(geometry, material);
      
        return triangleMesh;
    }

    /*buildBox(box_elem, material){

        let xyz1 = box_elem.representations[0].xyz1
        let xyz2 = box_elem.representations[0].xyz2

        const [x1, y1, z1] = xyz1;
        const [x2, y2, z2] = xyz2;

        let lenght = x2 - x1;
        let width = z2 - z1;
        let height = y2 - y1;




        let parts_x = box_elem.representations[0].parts_x
        let parts_y = box_elem.representations[0].parts_y
        let parts_z = box_elem.representations[0].parts_z


        let rect_group = new THREE.Group();

        let back_rect = new THREE.PlaneGeometry(lenght, height, parts_x, parts_y);
        let back_rect_mesh = new THREE.Mesh(back_rect, material);
        back_rect_mesh.position.set(x1+(x2-x1)/2,y1+(y2-y1)/2,z1);
        back_rect_mesh.rotation.set(0,Math.PI,0);
        rect_group.add(back_rect_mesh);
        
        let front_rect = new THREE.PlaneGeometry(lenght, height, parts_x, parts_y);
        let front_rect_mesh = new THREE.Mesh(front_rect, material);
        front_rect_mesh.position.set(x1+(x2-x1)/2,y1+(y2-y1)/2,z2);
        rect_group.add(front_rect_mesh);
        

        let bottom_rect = new THREE.PlaneGeometry(lenght, width, parts_x, parts_z);
        let bottom_rect_mesh = new THREE.Mesh(bottom_rect, material);
        bottom_rect_mesh.position.set(x1+(x2-x1)/2,y1,0);
        bottom_rect_mesh.rotation.set(Math.PI/2,0,0);
        rect_group.add(bottom_rect_mesh);
        
        let top_rect = new THREE.PlaneGeometry(lenght, width, parts_x, parts_z);
        let top_rect_mesh = new THREE.Mesh(top_rect, material);
        top_rect_mesh.position.set(x1+(x2-x1)/2,y2,0);
        top_rect_mesh.rotation.set(-Math.PI/2,0,0);
        rect_group.add(top_rect_mesh);
        

        let left_rect = new THREE.PlaneGeometry(width, height, parts_z, parts_y);
        let left_rect_mesh = new THREE.Mesh(left_rect, material);
        left_rect_mesh.position.set(x1,y1+(y2-y1)/2,0);
        left_rect_mesh.rotation.set(0,-Math.PI/2,0);
        rect_group.add(left_rect_mesh);
        
        let right_rect = new THREE.PlaneGeometry(width, height, parts_z, parts_y);
        let right_rect_mesh = new THREE.Mesh(right_rect, material);
        right_rect_mesh.position.set(x2,y1+(y2-y1)/2,0);
        right_rect_mesh.rotation.set(0,Math.PI/2,0);
        rect_group.add(right_rect_mesh);

        return rect_group;
    } */

    buildBox(box_elem, material) {
        let xyz1 = box_elem.representations[0].xyz1;
        let xyz2 = box_elem.representations[0].xyz2;
    
        const [x1, y1, z1] = xyz1;
        const [x2, y2, z2] = xyz2;

        //console.log("BOX XYZ1: ", xyz1)
        //console.log("BOX XYZ2: ", xyz2)
    
        let length = x2 - x1;
        let width = z2 - z1;
        let height = y2 - y1;
    
        let parts_x = box_elem.representations[0].parts_x;
        let parts_y = box_elem.representations[0].parts_y;
        let parts_z = box_elem.representations[0].parts_z;
    
        let rect_group = new THREE.Group();
    
        // Function to create a single side of the box
        function createBoxSide(geometry, position, rotation) {
            let boxMesh = new THREE.Mesh(geometry, material);
            boxMesh.position.copy(position);
            boxMesh.rotation.set(rotation[0], rotation[1], rotation[2]);
            rect_group.add(boxMesh);
        }

        const sideGeometryX = this.getRectangleGeometry(length, height, parts_x, parts_y);
        createBoxSide(sideGeometryX, new THREE.Vector3(x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2, z1), [0, Math.PI, 0]);
    
        const sideGeometryY = this.getRectangleGeometry(length, height, parts_x, parts_y);
        createBoxSide(sideGeometryY, new THREE.Vector3(x1 + (x2 - x1) / 2, y1 + (y2 - y1) / 2, z2), [0, 0, 0]);
    
        const sideGeometryBottom = this.getRectangleGeometry(length, width, parts_x, parts_z);
        createBoxSide(sideGeometryBottom, new THREE.Vector3(x1 + (x2 - x1) / 2, y1, 0), [Math.PI / 2, 0, 0]);
    
        const sideGeometryTop = this.getRectangleGeometry(length, width, parts_x, parts_z);
        createBoxSide(sideGeometryTop, new THREE.Vector3(x1 + (x2 - x1) / 2, y2, 0), [-Math.PI / 2, 0, 0]);
    
        const sideGeometryLeft = this.getRectangleGeometry(width, height, parts_z, parts_y);
        createBoxSide(sideGeometryLeft, new THREE.Vector3(x1, y1 + (y2 - y1) / 2, 0), [0, -Math.PI / 2, 0]);
    
        const sideGeometryRight = this.getRectangleGeometry(width, height, parts_z, parts_y);
        createBoxSide(sideGeometryRight, new THREE.Vector3(x2, y1 + (y2 - y1) / 2, 0), [0, Math.PI / 2, 0]);
    
        return rect_group;
    }
    

    build_skybox_materials(skybox, scene_path){

        let sides = [skybox.back, skybox.front, skybox.down, skybox.up, skybox.left, skybox.right];

        let rgb_color = new THREE.Color(skybox.emissive.r, skybox.emissive.g, skybox.emissive.b); 

        let skybox_materials = [];
        let texture_path = scene_path + "./../";
        
        sides.forEach(side => {
            let texture = new THREE.TextureLoader().load(texture_path + side);
            let material = new THREE.MeshPhongMaterial({
                color: rgb_color,
                specular: rgb_color,
                emissive: 0x000000, 
                shininess: 1,
                map: texture
            })

            skybox_materials.push(material);

            
        });

        return skybox_materials;
    }

    buildSkyBox(skybox, scene_path){

        const [lenght, width, height] = skybox.size;
        const [x_pos, y_pos, z_pos] = skybox.center;

        let materials_list = this.build_skybox_materials(skybox, scene_path);


        let rect_group = new THREE.Group();

        let back_rect = new THREE.PlaneGeometry(lenght, height);
        let back_rect_mesh = new THREE.Mesh(back_rect, materials_list[0]);
        back_rect_mesh.position.set(0,0,-width/2);
        rect_group.add(back_rect_mesh);
     
        let front_rect = new THREE.PlaneGeometry(lenght, height);
        let front_rect_mesh = new THREE.Mesh(front_rect, materials_list[1]);
        front_rect_mesh.position.set(0,0,width/2);
        front_rect_mesh.rotation.set(0,Math.PI,0);
        rect_group.add(front_rect_mesh);
        

        let bottom_rect = new THREE.PlaneGeometry(lenght, width);
        let bottom_rect_mesh = new THREE.Mesh(bottom_rect, materials_list[2]);
        bottom_rect_mesh.position.set(0,-height/2,0);
        bottom_rect_mesh.rotation.set(-Math.PI/2,0,0);
        rect_group.add(bottom_rect_mesh);
        
        let top_rect = new THREE.PlaneGeometry(lenght, width);
        let top_rect_mesh = new THREE.Mesh(top_rect, materials_list[3]);
        top_rect_mesh.position.set(0,height/2,0);
        top_rect_mesh.rotation.set(Math.PI/2,0,0);
        rect_group.add(top_rect_mesh);
        

        let left_rect = new THREE.PlaneGeometry(width, height);
        let left_rect_mesh = new THREE.Mesh(left_rect, materials_list[4]);
        left_rect_mesh.position.set(-lenght/2,0,0);
        left_rect_mesh.rotation.set(0,Math.PI/2,0);
        rect_group.add(left_rect_mesh);
        
        
        let right_rect = new THREE.PlaneGeometry(width, height);
        let right_rect_mesh = new THREE.Mesh(right_rect, materials_list[5]);
        right_rect_mesh.position.set(lenght/2,0,0);
        right_rect_mesh.rotation.set(0,-Math.PI/2,0);
        rect_group.add(right_rect_mesh);
        

        rect_group.position.set(x_pos, y_pos, z_pos);

        return rect_group;

    }

    buildCylinder(base, top, height, slices, stacks, thetastart, thetalength, capsclose, material){

        let openended = !capsclose;

        let cylinder = new THREE.CylinderGeometry(top, base, height, slices, stacks, openended, thetastart, thetalength);

        let cylinderMesh = new THREE.Mesh(cylinder, material);

        return cylinderMesh;
    }

    buildSphere(radius,slices,stacks,thetaStart,thetalength,phiStart,philength, material){
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const indices = [];
    
    
        for (let phiIndex = 0; phiIndex <= stacks; phiIndex++) {
        const phi = phiStart + (phiIndex / stacks) * philength;
    
        for (let thetaIndex = 0; thetaIndex <= slices; thetaIndex++) {
            const theta = thetaStart + (thetaIndex / slices) * thetalength;
    
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
    
            vertices.push(x, y, z);
        }
        }
    
        for (let phiIndex = 0; phiIndex < stacks; phiIndex++) {
        for (let thetaIndex = 0; thetaIndex < slices; thetaIndex++) {
            const first = phiIndex * (slices + 1) + thetaIndex;
            const second = first + slices + 1;
    
            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        }
        }
    
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
    

        const sphereMesh = new THREE.Mesh(geometry, material);
    
    
        return sphereMesh;
  }

    buildNurbs(controlpoints, degree_u, degree_v, parts_u, parts_v, material, distance, type){

        console.log("??controlpoints")

        console.log(controlpoints)

        let surface = this.nurbBuilder.build(controlpoints, degree_u, degree_v, parts_u, parts_v)  

        let nurbsMesh = new THREE.Mesh( surface, material);

        return nurbsMesh;

    }


    // LIGHT SECTION

    /* light properties:
        child.type, 
        child.color, 
        child.intensity, 
        child.distance, 
        child.decay, 
        child.castshadow, 
        child.position,
        child.enabled,
        child.shadowfar,
        child.shadowmapsize
    */
    buildLight(child){
        const color = new THREE.Color(child.color.r, child.color.g, child.color.b);

        if (child.type == "spotlight"){
            let spotlight = new THREE.SpotLight(color, child.intensity, child.distance, child.angle, child.penumbra, child.decay)
            spotlight.position.set(child.position[0], child.position[1], child.position[2]);
            spotlight.castShadow = Boolean(child.castshadow);
            //console.log("Spotlight: ", spotlight.castShadow);

            spotlight.shadow.mapSize.width = child.shadowmapsize;
            spotlight.shadow.mapSize.height = child.shadowmapsize;

            spotlight.shadow.camera.far = child.shadowfar;

            const targetObject = new THREE.Object3D();
            targetObject.position.set(child.target[0], child.target[1], child.target[2])
            spotlight.target = targetObject;

            const spotLightHelper = new THREE.SpotLightHelper( spotlight, 0x0000ff); // se eu comentar isto, o spotlight roda mas o valor nunca é lido. Evidencia do Paranormal
            //this.app.scene.add( spotLightHelper );


            return spotlight;               
        }
        else if (child.type == "pointlight"){
            let pointLight = new THREE.PointLight(color, child.intensity, child.distance, child.decay)
            pointLight.position.set(child.position[0], child.position[1], child.position[2]);

            pointLight.castShadow = Boolean(child.castshadow);

            // add a point light helper for the previous point light
            const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
            this.app.scene.add(pointLightHelper);

            return pointLight;
        }
        else if (child.type == "directionallight"){
            let directionallight = new THREE.DirectionalLight(color, child.intensity)
            directionallight.position.set(child.position[0], child.position[1], child.position[2]);
            directionallight.castShadow = Boolean(child.castshadow);
        

            //const directionallightHelper = new THREE.DirectionalLightHelper( directionallight, 0xffffff);
            //this.app.scene.add( directionallightHelper );
    
            return directionallight;
        }
    }




    // MATERIAL SECTION

    getTextureFilterConstant(filterString) {
        switch (filterString) {
            case 'NearestFilter':
                return THREE.NearestFilter;
            case 'LinearFilter':
                return THREE.LinearFilter;
            case 'NearestMipmapNearestFilter':
                return THREE.NearestMipmapNearestFilter;
            case 'LinearMipmapNearestFilter':
                return THREE.LinearMipmapNearestFilter;
            case 'NearestMipmapLinearFilter':
                return THREE.NearestMipmapLinearFilter;
            case 'LinearMipmapLinearFilter':
                return THREE.LinearMipmapLinearFilter;
            default:
                console.warn('Unrecognized texture filter:', filterString);
                return THREE.LinearFilter; // Default to a valid filter
        }
    }

    logMaterialDetails(material, texture) { // debug helper
        console.log('Material Information for:');
        console.log('Material id:', material.id);
        console.log('Color:', material.color);
        console.log('Shininess:', material.shininess);
        console.log('Specular:', material.specular);
        console.log('Emissive:', material.emissive);
        console.log('texlength_s:', material.texlength_s);
        console.log('texlength_t:', material.texlength_t);
        console.log('Custom:', material.custom);
    
        if (texture) {
            console.log('Texture Information:');
            console.log('Texture id:', texture.id);
            console.log('Texture filepath:', texture.filepath);
            console.log('Texture isVideo:', texture.isVideo);
            console.log('Texture magFilter:', texture.magFilter);
            console.log('Texture minFilter:', texture.minFilter);
            console.log('Texture mipmaps:', texture.mipmaps);
            console.log('Texture anisotropy:', texture.anisotropy);
            console.log('Texture type:', texture.type);
            console.log('Custom:', texture.custom);
        }
    }

    loadMipmap(parentTexture, level, path)
    {
        // load texture. On loaded call the function to create the mipmap for the specified level 
        new THREE.TextureLoader().load(path, 
            function(mipmapTexture)  // onLoad callback
            { 
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.scale(1, 1);
                
                // const fontSize = 48
                const img = mipmapTexture.image         
                canvas.width = img.width;
                canvas.height = img.height

                // first draw the image
                ctx.drawImage(img, 0, 0 )
                             
                // set the mipmap image in the parent texture in the appropriate level
                parentTexture.mipmaps[level] = canvas
            },
            undefined, // onProgress callback currently not supported
            function(err) {
                console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
            }
        )
    }

    buildMaterial(material, texture, allTextures){

        //Material: id,color,specular,emissive,shininess,wireframe,shading,textureref,texlength_s,texlength_t,twosided,bump_ref,bump_scale,type,custom
        //Texture: id,filepath,isVideo,magFilter,minFilter,mipmaps,anisotropy,type,custom

        if (!material || !material.color) {
            console.error("Invalid or missing material properties.");
            return null;
        }

        if (material.color === undefined || material.color === null) {
            material.color = 0xffffff;
        }
        else {
            material.color = new THREE.Color(material.color.r, material.color.g, material.color.b); 
        }

        if (material.emissive === undefined) {
            material.emissive = 0x000000;
        }
        else {
            material.emissive = new THREE.Color(material.emissive.r, material.emissive.g, material.emissive.b); 
        }

        if (material.specular === undefined) {
            material.specular = 0xffffff;
        }
        else {
            material.specular = new THREE.Color(material.specular.r, material.specular.g, material.specular.b);
        }

        if (material.shininess === undefined) {
            material.shininess = 0;
        }

        if (material.texlength_s === undefined) {
            material.texlength_s = 1;
        }
        if (material.texlength_t === undefined) {
            material.texlength_t = 1;
        }
    
        
        const customProperties = material.custom || {};
    

        const materialParams = {
            color: material.color,
            shininess: material.shininess,
            specular: material.specular,
            emissive: material.emissive,
        };  
        
        console.log(">> texture:");
        console.log(texture);
    
        if (texture) {

            this.textureTHREE = null;

            if (texture.isVideo == true) {
                const video = document.createElement('video');
                video.crossOrigin = 'anonymous';
                video.src = texture.filepath;
                video.preload = "auto";
                video.muted = true; 
                video.autoplay = true;

                this.textureTHREE = new THREE.VideoTexture(video);
                this.textureTHREE.colorSpace = THREE.SRGBColorSpace;
                // Now you can use this.textureTHREE in your Three.js scene
                
            }
            else {
                this.textureTHREE = new THREE.TextureLoader().load(texture.filepath);
            }

            // dealing with mipmaps:
            /**
             * Se indicam "mipmaps" a falso mas não passam nenhum mipmap, podem apresentar erro na consola 
             * e fazer generateMipmaps=true. Ao contrário, ignoram os mipmaps fornecidos, e fica generateMipmaps=true.
             */
            if (texture.mipmaps == false){

                if (texture.mipmap0 != null && texture.mipmap1 != null && texture.mipmap2 != null &&
                    texture.mipmap3 != null && texture.mipmap4 != null && texture.mipmap5 != null &&
                    texture.mipmap6 != null && texture.mipmap7 != null){
                    
                        // mipmaps will be manually defined

                        this.textureTHREE.generateMipmaps = false; 

                        this.loadMipmap(this.textureTHREE, 0, texture.mipmap0);
                        this.loadMipmap(this.textureTHREE, 1, texture.mipmap1);
                        this.loadMipmap(this.textureTHREE, 2, texture.mipmap2);
                        this.loadMipmap(this.textureTHREE, 3, texture.mipmap3);
                        this.loadMipmap(this.textureTHREE, 4, texture.mipmap4);
                        this.loadMipmap(this.textureTHREE, 5, texture.mipmap5);
                        this.loadMipmap(this.textureTHREE, 6, texture.mipmap6);
                        this.loadMipmap(this.textureTHREE, 7, texture.mipmap7);

                    }
                else {
                    this.textureTHREE.generateMipmaps = true; 
                    // Additional texture-related properties
                    this.textureTHREE.anisotropy = texture.anisotropy || 1;
                    this.textureTHREE.magFilter = this.getTextureFilterConstant(texture.magFilter) || THREE.LinearFilter;
                    this.textureTHREE.minFilter = this.getTextureFilterConstant(texture.minFilter) || THREE.LinearMipmapLinearFilter;
                }
    
            }
            else {
                this.textureTHREE.generateMipmaps = true; 
                // Additional texture-related properties
                this.textureTHREE.anisotropy = texture.anisotropy || 1;
                this.textureTHREE.magFilter = this.getTextureFilterConstant(texture.magFilter) || THREE.LinearFilter;
                this.textureTHREE.minFilter = this.getTextureFilterConstant(texture.minFilter) || THREE.LinearMipmapLinearFilter;
                const customTexture = texture.custom || {};
                Object.assign(this.textureTHREE, customTexture);
            }
        
            materialParams.map = this.textureTHREE;
        }
    
        if (material.twosided !== undefined) {
            materialParams.side = material.twosided ? THREE.DoubleSide : THREE.FrontSide;
        }   
        
        if (material.wireframe != undefined){

            console.log("Material wireframe", material.wireframe)
            materialParams.wireframe = material.wireframe;
        }
    
        // BUMP TEXTURES
        if (material.bumpref !== null && material.bumpref !== undefined) {

    
            let object_texture = null;
            for (const texture of allTextures) {
                if (texture.id == material.bumpref) {
                    object_texture = texture;
                    break;
                }
            }

            const bumpMapTHREE = new THREE.TextureLoader().load(object_texture.filepath);        
        
            materialParams.bumpMap = bumpMapTHREE;
            materialParams.bumpScale = material.bumpscale || 1;
        }
    
        
        Object.assign(materialParams, customProperties);


        let builded_material = new THREE.MeshPhongMaterial(materialParams);

        // Deal with texLenght

        if (material.map != null) {
            // Update the texture matrix with new scaling factors
            let elems = [material.texlength_s, 0, 0, 0, material.texlength_t, 0, 0, 0, 1];
            builded_material.map.matrix.set(elems);

            // Ensure the texture matrix is updated
            builded_material.matrixWorldNeedsUpdate = true;
        }  
        if (material.bumpref != null) {
            // Update the texture matrix with new scaling factors
            let elems = [material.texlength_s, 0, 0, 0, material.texlength_t, 0, 0, 0, 1];
            builded_material.bumpMap.matrix.set(elems);

            // Ensure the texture matrix is updated
            builded_material.matrixWorldNeedsUpdate = true;
        }       

        return builded_material;
    }


    //////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////// NEW STUFF FOR TP3 ////////////////////////////////////////

    

    


}

export {MyContentBuilder};