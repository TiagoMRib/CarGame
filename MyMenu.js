import * as THREE from 'three';

class MyMenu{

    constructor(){


        this.start = false;

        this.difficulty = 1;

        this.readyList = new Array(6).fill(false);

        this.targetRotation = 0;

        this.init();



        




    }

    init() {

        this.mesh = this.buildMenu();
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


    buildMenu(){


        let menu = new THREE.Group();

        let cylinderBase = new THREE.CylinderGeometry( 4.5, 4.5, 0.5, 32 );
        const material = new THREE.MeshBasicMaterial({ color: 0x8EAE7F });
        let baseMesh = new THREE.Mesh(cylinderBase, material);

        baseMesh.rotation.x = Math.PI/2;

        const geometry = new THREE.CircleGeometry( 4.5, 32 ); 
        const inittexture = new THREE.TextureLoader().load( 'scenes/t01g03/textures/normal_coin.jpg' );
        const material1 = new THREE.MeshBasicMaterial( { color: 0x8EAE7F, map: inittexture } ); 
        const initface = new THREE.Mesh( geometry, material1 ); 

        const settexture = new THREE.TextureLoader().load( 'scenes/t01g03/textures/coin.png' );
        const material2 = new THREE.MeshBasicMaterial( { color: 0x8EAE7F, map: settexture } );

        const setface = new THREE.Mesh( geometry, material2 );

        initface.position.z = -0.26;
        setface.position.z = 0.26;
        initface.rotation.y = Math.PI;

        menu.add(initface);
        menu.add(setface);
        menu.add(baseMesh);



        // FIRST SIDE

        this.initTitleCard = new THREE.Group();

        let initTitleCardColoredBackground = new THREE.Mesh(new THREE.BoxGeometry( 5.75, 1.8, 0.1 ), new THREE.MeshBasicMaterial({color: 0x4EC6DC})); // blue
        initTitleCardColoredBackground.position.set(0, -0.1, -0.3);
        this.initTitleCard.add(initTitleCardColoredBackground);

        let initTitleCardBackground = new THREE.Mesh(new THREE.BoxGeometry( 5.25, 1.3, 0.1 ), new THREE.MeshBasicMaterial({color: 0x000000}));
        initTitleCardBackground.position.set(0, -0.1, -0.4);
        this.initTitleCard.add(initTitleCardBackground);

        this.createTextMesh("Phantom Race", 0.4).then((initTitlecard) => { 
            initTitlecard.position.z = -0.51; 
            initTitlecard.rotation.y = Math.PI; 
            this.initTitleCard.add(initTitlecard); 
        })

        this.createTextMesh("SGI MEIC FEUP", 0.25).then((subject1) => { 
            subject1.position.y = -0.5; 
            subject1.position.z = -0.51; 
            subject1.rotation.y = Math.PI; 
            subject1.scale.x = 0.25; 

            this.initTitleCard.add(subject1); 
        })

        this.initTitleCard.position.set(0, 1.75, 0);

        menu.add(this.initTitleCard);



        // Game Developers

        this.developers = new THREE.Group();

        let developers = this.createTextMesh("developed by:", 0.18).then((subject2) => { subject2.position.y = 0.1; subject2.position.z = -0.26; subject2.rotation.y = Math.PI; this.developers.add(subject2); })

        let name1 = this.createTextMesh("Bárbara Rodrigues", 0.22).then((name1) => { name1.position.x = 2; name1.position.y = -0.5; name1.position.z = -0.26; name1.rotation.y = Math.PI; this.developers.add(name1); })
        let up1 = this.createTextMesh("up202007163", 0.24).then((up1) => { up1.position.x = 2; up1.position.y = -0.75; up1.position.z = -0.26; up1.rotation.y = Math.PI; this.developers.add(up1); })

        let name2 = this.createTextMesh("Tiago Ribeiro", 0.22).then((name2) => { name2.position.x = -2; name2.position.y = -0.5; name2.position.z = -0.26; name2.rotation.y = Math.PI; this.developers.add(name2); })
        let up2 = this.createTextMesh("up202007589", 0.24).then((up2) => { up2.position.x = -2; up2.position.y = -0.75; up2.position.z = -0.26; up2.rotation.y = Math.PI; this.developers.add(up2); })

        this.developers.position.set(0, 0, -0.1);

        menu.add(this.developers);


        // Play Button

        this.playButton = new THREE.Group();
        this.playButton.name = "playButton";

        let buttonColoredBackground = new THREE.Mesh(new THREE.BoxGeometry( 2.2, 1.2, 0.1 ), new THREE.MeshBasicMaterial({color: 0xE7E728}));
        buttonColoredBackground.position.set(0, 0, -0.38);
        this.playButton.add(buttonColoredBackground);

        let buttonBackground = new THREE.Mesh(new THREE.BoxGeometry( 2, 1, 0.1 ), new THREE.MeshBasicMaterial({color: 0x000000}));
        buttonBackground.position.set(0, 0, -0.4);
        this.playButton.add(buttonBackground);

        let playText = this.createTextMesh("PLAY", 0.6).then((playText) => { playText.position.z = -0.51; playText.scale.set(0.4, 0.4,1); playText.rotation.y = Math.PI; this.playButton.add(playText);})

        let fakePlayButton = new THREE.Mesh(new THREE.BoxGeometry( 2, 1, 0.1 ), new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0}));
        fakePlayButton.name = "playButton";
        fakePlayButton.position.set(0, 0, -0.52);
        this.playButton.add(fakePlayButton);

        this.playButton.position.set(0, -2, 0.1);

        menu.add(this.playButton);




        // SECOND SIDE


        // Settings Tittle

        this.titleCard = new THREE.Group();

        let titleCardBackground = new THREE.Mesh(new THREE.BoxGeometry( 4.5, 0.9, 0.1 ), new THREE.MeshBasicMaterial({color: 0xE7E728}));
        titleCardBackground.position.set(0, 0.05, 0);
        this.titleCard.add(titleCardBackground);

        this.createTextMesh("SETTINGS", 0.5).then((titleCard) => {
            titleCard.position.set(0, 0, 0.1) ;
            this.titleCard.add(titleCard); 
        })   

        this.titleCard.position.set(0, 2.5, 0.3);

        menu.add(this.titleCard);


        // Player Name Button

        this.nameButton = new THREE.Group();
        this.nameButton.name = "nameButton";

        let nameButtonBackground = new THREE.Mesh(new THREE.BoxGeometry( 7.3, 0.85, 0.1 ), new THREE.MeshBasicMaterial({color: 0x000000}));
        nameButtonBackground.position.set(0, 0.1, 0);
        this.nameButton.add(nameButtonBackground);

        this.createTextMesh("YOUR NAME: player", 0.6).then((nameText) => { 
            nameText.position.z = 0.51; 
            nameText.scale.set(0.3, 0.4, 1); 
            this.nameButton.add(nameText);
        })

        let fakeNameButton = new THREE.Mesh(new THREE.BoxGeometry( 7.3, 0.85, 0.1 ), new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0}));
        fakeNameButton.name = "nameButton";
        fakeNameButton.position.set(0, 0, 0.52);
        this.nameButton.add(fakeNameButton);

        this.nameButton.position.set(0, 1, 0.3);

        menu.add(this.nameButton);



        // Num Laps Button

        this.lapButton = new THREE.Group();
        this.lapButton.name = "lapButton";

        let lapButtonBackground = new THREE.Mesh(new THREE.BoxGeometry( 6.25, 0.85, 0.1 ), new THREE.MeshBasicMaterial({color: 0x000000}));
        this.lapButton.add(lapButtonBackground);

        this.createTextMesh("NUMBER OF LAPS: 3", 0.6).then((lapText) => { 
            lapText.position.z = 0.51;
            lapText.scale.set(0.3, 0.4, 1); 
            this.lapButton.add(lapText);
        })

        let fakeLapButton = new THREE.Mesh(new THREE.BoxGeometry(  6, 0.85, 0.1 ), new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0}));
        fakeLapButton.name = "lapButton";
        fakeLapButton.position.set(0, 0, 0.52);
        this.lapButton.add(fakeLapButton);

        this.lapButton.position.set(0, 0, 0.3);

        menu.add(this.lapButton);



        // Difficult Button

        this.difficultyButton = new THREE.Group();
        this.difficultyButton.name = "difficultyButton";

        let difficultButtonBackground = new THREE.Mesh(new THREE.BoxGeometry( 4.75, 0.85, 0.1 ), new THREE.MeshBasicMaterial({color: 0x000000}));
        difficultButtonBackground.position.set(0, -0.1, 0);
        this.difficultyButton.add(difficultButtonBackground);

        this.createTextMesh("DIFFICULTY: 1", 0.6).then((difficultyText) => { 
            difficultyText.position.z = 0.51; 
            difficultyText.scale.set(0.3, 0.4, 1); 
            this.difficultyButton.add(difficultyText);
        })

        let fakeDifficultyButton = new THREE.Mesh(new THREE.BoxGeometry(  4.75, 0.85, 0.1 ), new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0}));
        fakeDifficultyButton.name = "difficultyButton";
        fakeDifficultyButton.position.set(0, -0.1, 0.52);
        this.difficultyButton.add(fakeDifficultyButton);

        this.difficultyButton.position.set(0, -1, 0.3);

        menu.add(this.difficultyButton);



        // Start Button

        this.startButton = new THREE.Group();
        this.startButton.name = "startButton";

        let startButtonColoredBackground = new THREE.Mesh(new THREE.BoxGeometry( 2.7, 1.2, 0.1 ), new THREE.MeshBasicMaterial({color: 0x25B938}));
        startButtonColoredBackground.position.set(0, 0, 0.38);
        this.startButton.add(startButtonColoredBackground);

        let startButtonBackground = new THREE.Mesh(new THREE.BoxGeometry( 2.5, 1, 0.1 ), new THREE.MeshBasicMaterial({color: 0x000000}));
        startButtonBackground.position.set(0, 0, 0.4);
        this.startButton.add(startButtonBackground);

        this.createTextMesh("START", 0.6).then((startText) => { 
            startText.position.z = 0.51; 
            startText.scale.set(0.4, 0.4, 1); 
            this.startButton.add(startText);
        })

        let fakestartButton = new THREE.Mesh(new THREE.BoxGeometry(  2.5, 1, 0.1 ), new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0}));
        fakestartButton.name = "startButton";
        fakestartButton.position.set(0, 0, 0.52);
        this.startButton.add(fakestartButton);

        this.startButton.position.set(0, -2.7, 0);

        menu.add(this.startButton);
    


        return menu;

    }

    pressButton(buttonMesh){

        console.log("buttonMesh.name: ", buttonMesh.name)

        if(buttonMesh.name == "playButton"){
            buttonMesh.children[0].material.color.set(new THREE.Color(0x25B938)); //green
            this.playButton.scale.set(1.05, 1.05, 1); //press
            setTimeout(() => {
                this.playButton.scale.set(1, 1, 1);
                this.targetRotation = 7*Math.PI;
            }, 400);

        }
        if(buttonMesh.name == "startButton"){

            buttonMesh.children[0].material.color.set(new THREE.Color(0xEB4444)); //green
            this.startButton.scale.set(1.05, 1.05, 1); //press
            setTimeout(() => {
                this.startButton.scale.set(1, 1, 1);
                this.start=true;
            }, 750);
            
        }
        if(buttonMesh.name == "difficultyButton"){
            
            this.difficultyButton.scale.set(1.05, 1.05, 1);

            this.difficulty++;

            if(this.difficulty > 3)
                this.difficulty = 1;

            // Create a new difficulty text mesh
            this.createTextMesh(`DIFFICULTY: ${this.difficulty}`, 0.6).then((newDifficultyText) => {
                newDifficultyText.position.z = 0.51;
                newDifficultyText.scale.set(0.3, 0.4, 1);

                this.difficultyButton.remove(this.difficultyButton.children[2]); // Remove the old text mesh
                this.difficultyButton.add(newDifficultyText); // Add the new text mesh
            });

            setTimeout(() => {
                this.difficultyButton.scale.set(1, 1, 1);
            }, 75);
        }
        
        if (buttonMesh.name == "lapButton") {
            let lapsBoard = document.getElementById('lapsBoard');
            lapsBoard.style.display = "flex";
        }

        if (buttonMesh.name == "nameButton") {
            let playerNamePicker = document.getElementById('playerNameBoard');
            playerNamePicker.style.display = "flex";
        }

    }

    isTextReady(){

        return this.readyList.every((value) => value == true);

    }

    update()
    {
        this.mesh.rotation.y += Math.PI/10;
        this.targetRotation -= Math.PI/10;
    }

    reset(){

        this.startButton.children[0].material.color.set(new THREE.Color(0x25B938)); //green
        this.startButton.scale.set(0.95, 0.95, 1); //press
    }
}

export {MyMenu}