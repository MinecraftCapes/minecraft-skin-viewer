import {
    WebGLRenderer,
    Scene,
    AmbientLight,
    PerspectiveCamera,
    PointLight,
    TextureLoader,
    MathUtils,
    Timer,
} from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { applySkin, applyCape, applyEars } from './texture.js'
import { PlayerObject } from './model.js'

const STEVE_SKIN =
    'https://textures.minecraft.net/texture/3fb7213b724c6bb9163e031791788dd4792436b4cd0ce7a2854f7ef231781a'
const ALEX_SKIN =
    'https://textures.minecraft.net/texture/83cee5ca6afcdb171285aa00e8049c297b2dbeba0efb8ff970a5677a1b644032'

class MinecraftSkinViewer {
    playerObject = new PlayerObject()

    timer = new Timer()

    constructor(options) {
        this.renderer = new WebGLRenderer({
            canvas: options.canvas,
            alpha: true,
        })
        this.canvas = this.renderer.domElement

        this.scene = new Scene()
        this.scene.add(new AmbientLight(0xffffff, 3))

        this.camera = new PerspectiveCamera(
            30,
            this.canvas.clientWidth / this.canvas.clientHeight
        )
        this.camera.add(new PointLight(0xffffff, 1))
        this.camera.position.z = 90
        this.scene.add(this.camera)

        this.composer = new EffectComposer(this.renderer)
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.fxaaPass = new ShaderPass(FXAAShader)

        this.composer.addPass(this.renderPass)
        this.composer.addPass(this.fxaaPass)

        // Add Player Object
        this.scene.add(this.playerObject.group)

        // Load Textures
        this.textureLoader = new TextureLoader()
        this.loadSkin(options.skin, options.model)
        this.loadCape(options.cape)
        this.loadEars(options.ears)

        // Premium Features
        this.setDinnerbone(options.dinnerbone)
        this.setGlint(options.glint)

        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        // Bind the animate method to ensure the correct context
        this.animate = this.animate.bind(this)

        // Start the animation loop
        this.animate()
    }
    resizeRendererToDisplaySize() {
        const pixelRatio = window.devicePixelRatio
        const width = Math.floor(this.canvas.clientWidth * pixelRatio)
        const height = Math.floor(this.canvas.clientHeight * pixelRatio)
        const needResize =
            Math.abs(this.canvas.width - width) > 1 ||
            Math.abs(this.canvas.height - height) > 1
        if (needResize) {
            this.renderer.setSize(width, height, false)
            this.composer.setSize(width, height)

            this.fxaaPass.material.uniforms['resolution'].value.x =
                1 / (this.canvas.clientWidth * pixelRatio)
            this.fxaaPass.material.uniforms['resolution'].value.y =
                1 / (this.canvas.clientHeight * pixelRatio)
        }
        return needResize
    }
    animate() {
        if (this._dispose) return

        this.timer.update()

        requestAnimationFrame(this.animate)

        const delta = this.timer.getDelta()

        this.controls.update()
        this.composer.render()

        this.playerObject.cape.animate(delta)
        this.playerObject.elytra.animate()

        if (this.resizeRendererToDisplaySize()) {
            this.camera.aspect =
                this.canvas.clientWidth / this.canvas.clientHeight
            this.camera.updateProjectionMatrix()
        }
    }
    dispose() {
        this._dispose = true

        this.renderer.dispose()
        this.composer.dispose()
        this.fxaaPass.dispose()

        this.playerObject.skin.material.dispose()
        this.playerObject.overlay.material.dispose()
        this.playerObject.ears.material.dispose()
        this.playerObject.cape.material.dispose()
        this.playerObject.elytra.material.dispose()
    }
    setDinnerbone(value) {
        const rotation = MathUtils.degToRad(value ? 180 : 0)
        this.playerObject.group.rotation.x = rotation
        this.playerObject.group.rotation.y = rotation
    }
    setGlint(value) {
        this.playerObject.cape.toggleGlint(value)
    }
    setElytra(value) {
        //Don't toggle if both are not visible. This avoids a "removed cape" re-appearing
        if (
            this.playerObject.cape.mesh.visible ||
            this.playerObject.elytra.mesh.visible
        ) {
            this.playerObject.cape.mesh.visible = !value
            this.playerObject.elytra.mesh.visible = value
        }
    }
    loadSkin(src, model, dontFailOver = false) {
        if (src == null) {
            const random = Math.random() >= 0.5
            src = random ? STEVE_SKIN : ALEX_SKIN
            model = random ? 'classic' : 'slim'
        }

        src = this.formatSrc(src)

        const image = new Image()
        image.crossOrigin = 'anonymous'

        // Try load skin
        image.onload = () => {
            applySkin(this.playerObject, image, model)
        }

        //Reset Skin
        image.onerror = () => {
            console.error(`Image failed to load: ${src}`)
            if (!dontFailOver) {
                this.loadSkin(null, model, true)
            }
        }

        image.src = src
    }
    loadCape(src) {
        if (src == null) {
            return applyCape(this.playerObject, null)
        }

        src = this.formatSrc(src)

        const image = new Image()
        image.crossOrigin = 'anonymous'

        // Try load skin
        image.onload = () => {
            applyCape(this.playerObject, image)
        }

        //Reset Skin
        image.onerror = () => {
            console.error(`Image failed to load: ${src}`)
        }

        image.src = src
    }
    loadEars(src) {
        if (src == null) return applyEars(this.playerObject, null)

        src = this.formatSrc(src)

        this.textureLoader.load(src, (texture) => {
            applyEars(this.playerObject, texture)
        })
    }
    formatSrc(src) {
        if (
            !src.startsWith('blob:') &&
            !src.startsWith('http://') &&
            !src.startsWith('https://') &&
            !src.startsWith('data:image/') &&
            !src.startsWith('./') &&
            !src.startsWith('/')
        ) {
            src = `data:image/png;base64,${src}`
        }

        return src
    }
}

export default MinecraftSkinViewer
