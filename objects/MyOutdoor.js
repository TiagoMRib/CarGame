import * as THREE from 'three';

class SceneObject {
    constructor(mesh) {
        this.mesh = mesh;
        this.collisionBox = new THREE.Box3(); // Create an empty box initially
        this.updateCollisionBox();
    }

    updateCollisionBox() {
        // Update the box based on the current state of the mesh
        this.collisionBox.setFromObject(this.mesh);
    }

    updatePosition(x, y, z) {

        /*
        this.mesh.position.x += x;
        this.mesh.position.y += y;
        this.mesh.position.z += z; */

        this.collisionBox.max.x += x;
        this.collisionBox.max.y += y;
        this.collisionBox.max.z += z;

        this.collisionBox.min.x += x;
        this.collisionBox.min.y += y;
        this.collisionBox.min.z += z;
    }



    
}

class MyOutdoor{

    constructor(info, width=6, height=3) {

        this.infoList = info;
        this.mesh = this.build(width);

        this.rightPilar = this.addPilar(width/2, height);
        this.leftPilar = this.addPilar(-width/2, height);

        
        this.mesh.add(this.rightPilar.mesh);
        this.mesh.add(this.leftPilar.mesh);
        

        




    }

    build(width) {

        
        let infoLength = Object.keys(this.infoList).length;

        let group = new THREE.Group();
        let box = new THREE.BoxGeometry(width, infoLength, 0.5);
        let material = new THREE.MeshBasicMaterial({color: 0x000000});
        let mesh = new THREE.Mesh(box, material);



        group.add(mesh);
        this.textGroup = new THREE.Group();
        group.add(this.textGroup);

        

        return group;

    }

    addPilar(position, height) {

        let box = new THREE.BoxGeometry(0.25, height, 0.25);
        let material = new THREE.MeshBasicMaterial({color: 0xffffff});
        let mesh = new THREE.Mesh(box, material);
        mesh.position.y = (- height / 2) - (Object.keys(this.infoList).length / 2) ;
        mesh.position.x = position - (Math.sign(position) * 0.125);

        let pillar = new SceneObject(mesh);

        return pillar;
    }

    

    setPosition(x, y, z){

        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
        
    


        //this.rightPilar.updatePosition(x,y, z);
        //this.leftPilar.updatePosition(x, y, z);

        //console.log("Right pilar: ", this.rightPilar.mesh.position)
        //console.log("Right pilar: ", this.rightPilar.collisionBox)
    }

    loadSpriteText(text) {
        const loader = new THREE.TextureLoader();
    
        return new Promise((resolve) => {
            loader.load('scenes/t01g03/textures/spritesheet.png', (texture) => {
                const spriteSize = 32; // Assuming each sprite has a size of 32x32 pixels (adjust as needed)
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
    
                // Calculate the size of the canvas based on the length of the text and sprite size
                const canvasWidth = text.length * spriteSize;
                const canvasHeight = spriteSize; // Assuming one line of sprites
    
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
    
                for (let i = 0; i < text.length; i++) {
                    const char = text.charAt(i);
                    const hexCharCode = char.charCodeAt(0).toString(16);
                    const firstHexDigit = hexCharCode.charAt(0); // Use the first digit for the line
                    const spriteX = parseInt(hexCharCode.charAt(hexCharCode.length - 1), 16) * spriteSize;
    
                    // Calculate the sprite's y-coordinate based on the first digit of the hex value
                    const spriteY = parseInt(firstHexDigit, 16) * spriteSize;
    
                    /*
                    console.log("Character:", char);
                    console.log("ASCII Code:", char.charCodeAt(0));
                    console.log("Hexadecimal Code:", hexCharCode);
                    console.log("First Hex Digit:", firstHexDigit);
                    console.log("Sprite X:", spriteX);
                    console.log("Sprite Y:", spriteY);*/
    
                    // Use texture.image as the source
                    context.drawImage(texture.image, spriteX, spriteY, spriteSize, spriteSize, i * spriteSize, 0, spriteSize, spriteSize);
                }
    
                const mat_texture = new THREE.CanvasTexture(canvas);
                mat_texture.needsUpdate = true;
    
                const material = new THREE.MeshBasicMaterial({
                    map: mat_texture,
                    side: THREE.DoubleSide,
                    transparent: true,
                });
    
                const mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvasWidth / spriteSize, canvasHeight / spriteSize), material);
                mesh.name = "text";
    
                
                resolve(mesh);
            });
        });
    }
    
    createTextMesh(text, infoLength, counter) {
        this.loadSpriteText(text).then((textMesh) => {
            textMesh.position.z = 0.26;
            textMesh.scale.set(0.2, 0.2, 0.2);

            // Calculate the position to center the text in the box
            let boxCenterY = this.mesh.position.y;
            //console.log("Line: box centre y", boxCenterY)
            let lineHeight = 0.5; // Adjust this value as needed
            let totalHeight = lineHeight * infoLength;
            let yOffset = totalHeight / 2 - (counter * lineHeight );
            //console.log("Line: y offset", yOffset)
            textMesh.position.y = 0.25 - yOffset;
            //console.log("Line: text mesh y", textMesh.position.y)



            this.textGroup.add(textMesh);
        });
    }
    
    
    update(newInfo) {
        const isInfoListChanged = !isEqual(this.infoList, newInfo);

        if (isInfoListChanged) {
            this.infoList = newInfo;
            this.textGroup.clear();

            let infoLength = Object.keys(this.infoList).length;
            let counter = 0;

            for (const key in this.infoList) {
                if (this.infoList.hasOwnProperty(key)) {
                    let resultString = `${key}: ${this.infoList[key]}`;
                    this.createTextMesh(resultString, infoLength, counter);
                    counter++;
                }
            }

            //this.textGroup.position.y = 0;
        }
    }

}
export {MyOutdoor};
    



function isEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

