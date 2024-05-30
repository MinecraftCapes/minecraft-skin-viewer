import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { setupModel, applySkin, applyCape, applyEars } from './model.js'

class MinecraftSkinViewer {
    constructor(options) {
        this.canvas = options.canvas;
        this.width = options.width;
        this.height = options.height;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.canvas.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0xffffff, 3))

        // Setup the model
        setupModel(this.scene);

        // Load Textures
        this.loadSkin('/skin.png')
        this.loadCape('/cape.png')
        this.loadEars('/ears.png')

        // Premium Features
        this.setDinnerbone(options.dinnerbone)
        this.setGlint(options.glint)

        this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 90;

        // Controls
        this.controls = new OrbitControls( this.camera, this.renderer.domElement )

        // Bind the animate method to ensure the correct context
        this.animate = this.animate.bind(this);

        // Start the animation loop
        this.animate();
    }
    animate() {
        requestAnimationFrame(this.animate);

        this.controls.update();

        this.renderer.render(this.scene, this.camera);
    }
    setDinnerbone(value) {
        this.scene.rotation.x = THREE.MathUtils.degToRad(value ? 180 : 0)
    }
    setGlint(value) {
        //TODO
    }
    loadSkin(src) {
        this.imageToCanvas("skin", src, applySkin)
    }
    loadCape(src) {
        this.imageToCanvas("cape", src, applyCape)
    }
    loadEars(src) {
        this.imageToCanvas("ears", src, applyEars)
    }
    imageToCanvas(type, src, callback) {
        let image = new Image()
        image.crossOrigin = "anonymous";
        image.src = src
        image.onload = function() {
            let ctx = document.createElement('canvas').getContext('2d');
            ctx.canvas.width = image.width;
            ctx.canvas.height = image.height;
            if(image.height == 32 && type == "skin") {
                ctx.canvas.height = 64
                ctx.drawImage(image, 0, 16, 16, 16, 16, 48, 16, 16)
                ctx.drawImage(image, 40, 16, 16, 16, 32, 48, 16, 16)
            }
            ctx.drawImage(image, 0, 0);
            console.log(ctx.canvas.toDataURL())
            let texture = new THREE.CanvasTexture(ctx.canvas);

            return callback(texture)
        }
    }
}

export default MinecraftSkinViewer