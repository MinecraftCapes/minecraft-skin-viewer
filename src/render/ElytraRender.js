import AnimatedRender from './AnimatedRender'
import { BoxGeometry, Mesh } from 'three'
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js'

export default class ElytraRender extends AnimatedRender {
    constructor() {
        super()
    }

    generateMesh() {
        const leftWing = new BoxGeometry(12, 22, 4)
        leftWing.translate(2, -7, -4)
        leftWing.rotateX(0.2617994)
        leftWing.rotateZ(0.2617994)

        const rightWing = new BoxGeometry(12, 22, 4)
        rightWing.scale(-1, 1, 1)
        rightWing.translate(-2, -7, -4)
        rightWing.rotateX(0.2617994)
        rightWing.rotateZ(-0.2617994)

        this.createUVMap(leftWing, 22, 0, 10, 20, 2, 64, 32)
        this.createUVMap(rightWing, 22, 0, 10, 20, 2, 64, 32)

        const elytraMesh = new Mesh(
            BufferGeometryUtils.mergeGeometries([leftWing, rightWing]),
            this.material
        )
        elytraMesh.name = 'Elytra'
        elytraMesh.visible = false

        return elytraMesh
    }
}
