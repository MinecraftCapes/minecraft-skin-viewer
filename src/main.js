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
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { applySkin, applyCape, applyEars } from './texture.js'
import { PlayerObject } from './model.js';

const STEVE_SKIN = "https://textures.minecraft.net/texture/3fb7213b724c6bb9163e031791788dd4792436b4cd0ce7a2854f7ef231781a"
const ALEX_SKIN = "https://textures.minecraft.net/texture/83cee5ca6afcdb171285aa00e8049c297b2dbeba0efb8ff970a5677a1b644032"

class MinecraftSkinViewer {
    playerObject = new PlayerObject()

    constructor(options) {
        this.renderer = new WebGLRenderer({
            canvas: options.canvas,
            alpha: true
        });
        this.canvas = this.renderer.domElement;

        this.scene = new Scene();
        this.scene.add(new AmbientLight(0xffffff, 3))

        this.camera = new PerspectiveCamera(30, this.canvas.clientWidth / this.canvas.clientHeight);
        this.camera.add(new PointLight(0xffffff, 1));
        this.camera.position.z = 90;
        this.scene.add(this.camera)

        this.composer = new EffectComposer(this.renderer);
		this.renderPass = new RenderPass(this.scene, this.camera);
		this.fxaaPass = new ShaderPass(FXAAShader);

		this.composer.addPass(this.renderPass);
		this.composer.addPass(this.fxaaPass);

        // Add Player Object
        this.scene.add(this.playerObject.group)

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
    resizeRendererToDisplaySize() {
        const pixelRatio = window.devicePixelRatio;
        const width  = Math.floor( this.canvas.clientWidth * pixelRatio );
        const height = Math.floor( this.canvas.clientHeight * pixelRatio );
        const needResize = Math.abs(this.canvas.width - width) > 1 || Math.abs(this.canvas.height - height) > 1;
        if (needResize) {
            this.renderer.setSize(width, height, false);
            this.composer.setSize(width, height);

            this.fxaaPass.material.uniforms["resolution"].value.x = 1 / (this.canvas.clientWidth * pixelRatio);
		    this.fxaaPass.material.uniforms["resolution"].value.y = 1 / (this.canvas.clientHeight * pixelRatio);
        }
        return needResize;
    }
    animate() {
        if(this._dispose) return;

        requestAnimationFrame(this.animate);

        this.controls.update();
        this.composer.render();

        this.playerObject.cape.animate()
        this.playerObject.elytra.animate();

        if (this.resizeRendererToDisplaySize()) {
            this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }
    }
    dispose() {
        this._dispose = true;

        this.renderer.dispose();
        this.composer.dispose();
        this.fxaaPass.dispose();

        this.playerObject.skin.material.dispose();
        this.playerObject.overlay.material.dispose();
        this.playerObject.ears.material.dispose();
        this.playerObject.cape.material.dispose();
        this.playerObject.elytra.material.dispose();
    }
    setDinnerbone(value) {
        let rotation = MathUtils.degToRad(value ? 180 : 0)
        this.playerObject.group.rotation.x = rotation
        this.playerObject.group.rotation.y = rotation

    }
    setGlint(value) {
        this.playerObject.cape.toggleGlint(value)
    }
    setElytra(value) {
        //Don't toggle if both are not visible. This avoids a "removed cape" re-appearing
        if(this.playerObject.cape.mesh.visible || this.playerObject.elytra.mesh.visible) {
            this.playerObject.cape.mesh.visible = !value
            this.playerObject.elytra.mesh.visible = value
        }
    }
    loadSkin(src) {
        if(src == null) {
            src = (Math.random() >= 0.5)? STEVE_SKIN : ALEX_SKIN;
        }

        src = this.formatSrc(src)

        let image = new Image()
        image.crossOrigin = "anonymous";
        image.src = src
        image.onload = () => {
            let ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
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
            return applyCape(this.playerObject, null);

        src = this.formatSrc(src)

        this.textureLoader.load(src, (texture) => {
            applyCape(this.playerObject, texture)
        });
    }
    loadEars(src) {
        if(src == null) {
            return applyEars(this.playerObject, null);
        }

        src = this.formatSrc(src)

        this.textureLoader.load(src, (texture) => {
            applyEars(this.playerObject, texture)
        });
    }
    formatSrc(src) {
        if(
            !src.startsWith('http://') &&
            !src.startsWith('https://') &&
            !src.startsWith('data:image/png;base64') &&
            !src.startsWith('./') &&
            !src.startsWith('/')
        ) {
            src = `data:image/png;base64,${src}`
        }

        return src
    }
}

export default MinecraftSkinViewer
