import Render from './Render'
import { ShaderMaterial, DoubleSide, NearestFilter, Vector2 } from 'three'
import EnchantmentShader from '../enchantment'

export default class AnimatedRender extends Render {
    //Animated Texture
    currentFrame = 1
    lastFrameTime = 0

    constructor() {
        super()

        this.material = new ShaderMaterial({
            vertexShader: EnchantmentShader.vertex,
            fragmentShader: EnchantmentShader.fragment,
            transparent: true,
            side: DoubleSide,
            uniforms: {
                baseTexture: { type: 't', value: null },
                glimmerTexture: { type: 't', value: null },
                textureOffset: { type: 'v', value: new Vector2(0, 0) },
                textureRepeat: { type: 'v', value: new Vector2(1, 1) },
                glintOffset: { type: 'v', value: new Vector2(0, 0) },
            },
        })
    }

    updateTexture(texture, visible = true) {
        this.texture = texture
        if (this.texture != null) {
            this.texture.minFilter = NearestFilter
            this.texture.magFilter = NearestFilter
            this.texture.generateMipmaps = false

            //Set the texture uniform
            this.material.uniforms.baseTexture.value = texture

            //Set the cape repition (for animation)
            const frameWidth = texture.source.data.width
            const frameHeight = texture.source.data.height
            const totalFrames = frameHeight / (frameWidth / 2)
            this.material.uniforms.textureRepeat.value = new Vector2(
                1,
                1 / totalFrames
            )

            this.mesh.visible = visible
        } else {
            this.mesh.visible = false
        }
    }

    animate(delta) {
        const texture = this.material.uniforms.baseTexture.value
        if (texture != null) {
            const frameWidth = texture.source.data.width
            const frameHeight = texture.source.data.height
            const totalFrames = frameHeight / (frameWidth / 2)

            if (this.lastFrameTime < Date.now() - 100) {
                if (totalFrames > 1) {
                    if (this.currentFrame > totalFrames) {
                        this.currentFrame = 1
                    }

                    this.material.uniforms.textureOffset.value = new Vector2(
                        0,
                        -this.currentFrame
                    )
                    this.currentFrame++
                }
                this.lastFrameTime = Date.now()
            }

            const glintVec = this.material.uniforms.glintOffset.value
            glintVec.x -= 0.2 * delta
            glintVec.y -= 0.5 * delta
        }
    }
}
