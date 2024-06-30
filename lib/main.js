import {
    WebGLRenderer,
    Scene,
    AmbientLight,
    PerspectiveCamera,
    PointLight,
    TextureLoader,
    MathUtils
} from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass, ShaderPass, FXAAShader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { applySkin, applyCape, applyEars, animateCape } from './texture.js'
import { PlayerObject } from './model.js';

class MinecraftSkinViewer {
    playerObject = new PlayerObject()

    constructor(options) {
        this.canvas = options.canvas;
        this.width = options.width;
        this.height = options.height;

        this.renderer = new WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.canvas.appendChild(this.renderer.domElement);

        this.scene = new Scene();
        this.scene.add(new AmbientLight(0xffffff, Math.PI))

        this.camera = new PerspectiveCamera(30, this.width / this.height);
        this.camera.add(new PointLight(0xffffff, 0.6));
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

        // Add Player Object
        this.scene.add(this.playerObject)

        // Load Textures
        this.textureLoader = new TextureLoader();
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
    setSlim(value) {
        this.playerObject.changeSkinModel(value)
    }
    setDinnerbone(value) {
        let rotation = MathUtils.degToRad(value ? 180 : 0)
        this.playerObject.rotation.x = rotation
        this.playerObject.rotation.y = rotation

    }
    setGlint(value) {
        //TODO
    }
    loadSkin(src) {
        src = src == null ? "http://textures.minecraft.net/texture/3fb7213b724c6bb9163e031791788dd4792436b4cd0ce7a2854f7ef231781a" : src;

        src = this.formatSrc(src)

        let image = new Image()
        image.crossOrigin = "anonymous";
        image.src = src
        image.onload = () => {
            let ctx = document.createElement('canvas').getContext('2d');
            ctx.canvas.width = image.width;
            ctx.canvas.height = image.height;

            if(image.height == 32) {
                ctx.canvas.height = 64

                //Help from SkinView3D for figuring out the translation values
                //https://github.com/bs-community/skinview-utils/blob/master/src/process.ts#L80
                ctx.save();
                ctx.scale(-1, 1);

                const copySkin = (sX, sY, w, h, dX, dY) =>
                    ctx.drawImage(image, sX, sY, w, h, -dX, dY, -w, h);

                copySkin(4, 16, 4, 4, 20, 48); // Top Leg
                copySkin(8, 16, 4, 4, 24, 48); // Bottom Leg
                copySkin(0, 20, 4, 12, 24, 52); // Outer Leg
                copySkin(4, 20, 4, 12, 20, 52); // Front Leg
                copySkin(8, 20, 4, 12, 16, 52); // Inner Leg
                copySkin(12, 20, 4, 12, 28, 52); // Back Leg
                copySkin(44, 16, 4, 4, 36, 48); // Top Arm
                copySkin(48, 16, 4, 4, 40, 48); // Bottom Arm
                copySkin(40, 20, 4, 12, 40, 52); // Outer Arm
                copySkin(44, 20, 4, 12, 36, 52); // Front Arm
                copySkin(48, 20, 4, 12, 32, 52); // Inner Arm
                copySkin(52, 20, 4, 12, 44, 52); // Back Arm

                ctx.restore();
            }

            ctx.drawImage(image, 0, 0);

            applySkin(this.playerObject, ctx)
        }
    }
    loadCape(src) {
        if(src == null)
            return applyCape(null);

        src = this.formatSrc(src)

        this.textureLoader.load(src, (texture) => {
            applyCape(this.playerObject, texture)
        });
    }
    loadEars(src) {
        if(src == null) {
            console.log("NULLED EARS")
            return applyEars(null);
        }

        src = this.formatSrc(src)

        this.textureLoader.load(src, (texture) => {
            applyEars(this.playerObject, texture)
        });
    }
    formatSrc(src) {
        if(!src.startsWith('http://') && !src.startsWith('https://') && !src.includes('.')) {
            src = `data:image/png;base64,${src}`
        }

        return src
    }
}

export default MinecraftSkinViewer