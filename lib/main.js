import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass, ShaderPass, FXAAShader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { setupModel, applySkin, applyCape, applyEars, animateCape, updateGlint } from './model.js'

class MinecraftSkinViewer {
    constructor(options) {
        this.canvas = options.canvas;
        this.width = options.width;
        this.height = options.height;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.canvas.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0xffffff, Math.PI))

        this.camera = new THREE.PerspectiveCamera(30, this.width / this.height);
        this.camera.add(new THREE.PointLight(0xffffff, 0.6));
        this.camera.position.z = 90;
        this.scene.add(this.camera)

        this.composer = new EffectComposer(this.renderer);
		this.renderPass = new RenderPass(this.scene, this.camera);
		this.fxaaPass = new ShaderPass(FXAAShader);

        let pixelRatio = this.renderer.getPixelRatio();
        this.fxaaPass.material.uniforms["resolution"].value.x = 1 / (this.width * pixelRatio);
		this.fxaaPass.material.uniforms["resolution"].value.y = 1 / (this.height * pixelRatio);

		this.composer.addPass(this.renderPass);
		this.composer.addPass(this.fxaaPass);

        // Setup the model
        setupModel(this.scene);

        // Load Textures
        this.textureLoader = new THREE.TextureLoader();
        this.loadSkin(options.skin)
        this.loadCape(options.cape)
        this.loadEars(options.ears)

        // Premium Features
        this.setDinnerbone(options.dinnerbone)
        this.setGlint(options.glint)

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
        this.composer.render();

        animateCape()
    }
    setDinnerbone(value) {
        let rotation = THREE.MathUtils.degToRad(value ? 180 : 0)
        this.scene.rotation.x = rotation
        this.scene.rotation.y = rotation
    }
    setGlint(value) {
        //TODO
    }
    loadSkin(src) {
        src = src == null ? "http://textures.minecraft.net/texture/3fb7213b724c6bb9163e031791788dd4792436b4cd0ce7a2854f7ef231781a" : src;

        let image = new Image()
        image.crossOrigin = "anonymous";
        image.src = src
        image.onload = function() {
            let ctx = document.createElement('canvas').getContext('2d');
            ctx.canvas.width = image.width;
            ctx.canvas.height = image.height;

            if(image.height == 32 && type == "skin") {
                ctx.canvas.height = 64
                // (method) image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void (+2 overloads)
                ctx.drawImage(image, 0, 16, 16, 16, 16, 48, 16, 16)
                ctx.drawImage(image, 40, 16, 16, 16, 32, 48, 16, 16)
            }

            ctx.drawImage(image, 0, 0);

            applySkin(ctx)
        }
    }
    loadCape(src) {
        if(src == null)
            return applyCape(null);

        this.textureLoader.load(src, (texture) => {
            applyCape(texture)
        });
    }
    loadEars(src) {
        if(src == null)
            return applyEars(null);

        this.textureLoader.load(src, (texture) => {
            applyEars(texture)
        });
    }
}

export default MinecraftSkinViewer