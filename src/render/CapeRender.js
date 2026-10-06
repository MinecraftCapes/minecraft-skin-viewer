import AnimatedRender from './AnimatedRender'
import { TextureLoader } from 'three/src/loaders/TextureLoader.js'
import { BoxGeometry } from 'three/src/geometries/BoxGeometry.js'
import { NearestFilter } from 'three/src/constants.js'
import { Mesh } from 'three/src/objects/Mesh.js'
import GlintImage from '../assets/Glint.png'

export default class CapeRender extends AnimatedRender {
    glintTexture

    constructor() {
        super()

        const loader = new TextureLoader()
        this.glintTexture = loader.load(GlintImage)
        this.glintTexture.minFilter = NearestFilter
        this.glintTexture.magFilter = NearestFilter
        this.glintTexture.generateMipmaps = false
    }

    generateMesh() {
        //Cape
        const capeGeometry = new BoxGeometry(10, 16, 1)
        this.createUVMap(capeGeometry, 0, 0, 10, 16, 1, 64, 32)
        capeGeometry.rotateX(-0.2)
        capeGeometry.translate(0, -8, 0.5)
        capeGeometry.rotateY(Math.PI)

        const capeMesh = new Mesh(capeGeometry, this.material)
        capeMesh.position.set(0, 6.25, -3)
        capeMesh.name = 'Cape'

        // Merge all cube geometries into one
        return capeMesh
    }

    toggleGlint(value) {
        if (value) {
            this.material.uniforms.glimmerTexture.value = this.glintTexture
        } else {
            this.material.uniforms.glimmerTexture.value = null
        }
    }
}
