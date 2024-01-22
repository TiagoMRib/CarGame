
import * as THREE from 'three';
import { Particle } from '../Particle.js';
import { MyOutdoor } from './MyOutdoor.js';
import { MyCloud } from './MyCloud.js';

class MyPodium {
    constructor() {

        this.explosions = [];

        this.init();
        


    }

    init() {
        this.mesh = this.build();
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

    createTextMesh(text, textSize=0.2) {
        return new Promise((resolve) => {
            this.loadSpriteText(text).then((textMesh) => {
                textMesh.position.z = 0.26;
                textMesh.scale.set(textSize, textSize, textSize);
    
                console.log("Menu: text mesh", textMesh);
    
                //this.readyList[id] = true;
    
                resolve(textMesh);
            });
        });
    }

    build(){

        let podium = new THREE.Group();

        let cylinderBase = new THREE.CylinderGeometry( 7, 7, 0.5, 32 );
        const material = new THREE.MeshBasicMaterial({ color: 0x8EAE7F });
        let baseMesh = new THREE.Mesh(cylinderBase, material);

        //podium.add(baseMesh);

        let cylinderBase2 = new THREE.CylinderGeometry( 3, 3, 1, 32 );
        const material2 = new THREE.MeshBasicMaterial({ color: 0x9932CC });
        let step = new THREE.Mesh(cylinderBase2, material2);

        step.position.y = 0.5;
        step.position.x = 3;
        step.position.z = -2;

        podium.add(step);

        let info = {
            'Winner': 'none',
            "Time": "0",
        }

        this.outdoor = new MyOutdoor(info, 6);

        this.outdoor.mesh.position.y = 4;
        this.outdoor.mesh.position.x = -4;
        this.outdoor.mesh.rotation.y = Math.PI/2;


        podium.add(this.outdoor.mesh);

        this.startButton = new THREE.Group();
        this.startButton.name = "startButton";

        let startButtonColoredBackground = new THREE.Mesh(new THREE.BoxGeometry( 3.5, 1, 0.5 ), new THREE.MeshBasicMaterial({color: 0x25B938}));
        startButtonColoredBackground.name = "startButton";
        this.startButton.add(startButtonColoredBackground);

        let startButtonBackground = new THREE.Mesh(new THREE.BoxGeometry( 3.2, 0.7, 0.1 ), new THREE.MeshBasicMaterial({color: 0x000000}));
        startButtonBackground.name = "startButton";
        startButtonBackground.position.set(0,0,-0.21)
        this.startButton.add(startButtonBackground);

        this.createTextMesh("PLAY AGAIN", 0.6).then((startText) => { 
            startText.position.z = -0.51; 
            startText.position.y = 0.1; 
            startText.rotation.y = Math.PI;
            startText.scale.set(0.3, 0.3, 1); 
            this.startButton.add(startText);
        })

        let fakestartButton = new THREE.Mesh(new THREE.BoxGeometry(  3.5, 1, 0.5 ), new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0}));
        fakestartButton.name = "startButton";
        fakestartButton.position.set(0, 0, -0.26);
        this.startButton.add(fakestartButton);

        this.startButton.position.set(7, 1, 0);
        this.startButton.rotation.y = -Math.PI/2;

        this.startButton.scale.set(0.5, 0.5, 0.5);

        podium.add(this.startButton);


        return podium;


    }

    createFirework(app, scene) {
        let firework1 = new Particle(app, scene, -45, 10, -4, 0x00ff00)
        this.explosions.push(firework1)
        let firework2 = new Particle(app, scene, -45, 10, -2, 0x00ff00)
        this.explosions.push(firework2)
    }


    update(winner, time, playerMesh, computerMesh) {

        let newInfo = { ...this.outdoor.infoList };
        newInfo['Winner'] = winner;
        newInfo['Time'] = time;
        this.outdoor.update(newInfo);

        console.log("WINNER", winner)

        if (winner == "PLAYER") {


            console.log("WIN player", playerMesh)

            playerMesh.position.y = 1.5;
            playerMesh.position.x = 5;
            playerMesh.position.z = -2;

            playerMesh.rotation.y = Math.PI/2;

            this.mesh.add(playerMesh);

            computerMesh.position.y = 0.5;
            computerMesh.position.x = 4;
            computerMesh.position.z = 3;

            this.mesh.add(computerMesh);

            computerMesh.rotation.y = Math.PI/2;

        }
        else if (winner == "COMPUTER") {

            console.log("WIN computer", computerMesh)

            computerMesh.position.y = 1.5;
            computerMesh.position.x = 5;
            computerMesh.position.z = -2;

            computerMesh.rotation.y = Math.PI/2;

            this.mesh.add(computerMesh);

            playerMesh.position.y = 0.5;
            playerMesh.position.x = 4;
            playerMesh.position.z = 3;

            this.mesh.add(playerMesh);

            playerMesh.rotation.y = Math.PI/2;
        }

        
    }

    updateFire()
    {
        for( let i = 0; i < this.explosions.length; i++ ) {
            if (this.explosions[i].done) {
                // remove 
                this.explosions.splice(i,1) 
                continue 
            }
            // otherwise upsdate  firework
            this.explosions[i].update()
        }

    }

    pressButton() {
        this.startButton.children[0].material.color.setHex(0xFF0000);
        this.startButton.children[0].scale.set(1, 1, 0.5)
    }

    reset(){

        for( let i = 0; i < this.explosions.length; i++ ) {
                // remove 
                this.explosions.splice(i,1) 
                continue 
        }

        this.outdoor.clear();
        this.startButton.clear();
        this.mesh.clear();
        this.mesh = this.build();

    }


}

export { MyPodium };


