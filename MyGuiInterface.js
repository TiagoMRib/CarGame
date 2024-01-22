import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {

        /*const cameraFolder = this.datgui.addFolder('Camera')

        console.log("THIS APP CAMERAS BEFORE FOR", this.app.cameras) // has elements
        
        let cameraOptions = this.app.cameras

        console.log(this.app.cameras["cam1"])
        let cameraKeys = Object.keys(this.app.cameras);

        console.log(cameraKeys);

        console.log("CAMERAS OPTIONS", cameraOptions) // has elements

        console.log(this.app) // HERE IT EXISTS


        var cameraDropdown = cameraFolder.add({ activeCamera: cameraKeys[0] }, 'activeCamera', cameraKeys);
        
        cameraDropdown.onChange((value) => {
            // Set the active camera based on the selected option
            console.log("Setting active cam on gui", value, cameraOptions[value])
            console.log(this.app) // HERE IS UNDEFINED
            this.app.setActiveCamera(value);
        });

        cameraFolder.open()*/




        const cenariosFolder = this.datgui.addFolder( 'Cenarios' );

        let cenarioKeys = this.contents.cenarios;

        var cenariosDropdown = cenariosFolder.add({"Current Cenario": cenarioKeys[0]}, 'Current Cenario', cenarioKeys);

        cenariosDropdown.onChange((value) => {
            this.contents.changeCenario(value);
        });

        cenariosFolder.open();




        /*const wireframeFolder = this.datgui.addFolder('Wireframe');

        const wireframeToggle = { wireframe: false };

        wireframeFolder.add(wireframeToggle, 'wireframe').name('Toggle Wireframe').onChange((value) => {
            this.app.toggleWireframe(value);
        });

        wireframeFolder.open();*/



        const followFolder = this.datgui.addFolder('Follow');

        const followToggle = { follow: false };
        let isFollowing = this.app.follow; // Track the current state

        const followController = followFolder.add(followToggle, 'follow').name('Toggle Follow').onChange(() => {
            isFollowing = !isFollowing; // Toggle the boolean value
            this.app.toggleFollow(isFollowing); // Pass the updated value to your app function
        });


    }


}

export { MyGuiInterface };