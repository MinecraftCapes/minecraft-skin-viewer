import Render from './Render'
import { BoxGeometry } from 'three/src/geometries/BoxGeometry.js'
import { Mesh } from 'three/src/objects/Mesh.js'
import { Group } from 'three/src/objects/Group.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'

export default class PlayerRender extends Render {
    constructor() {
        super()
    }

    getMesh(slim) {
        if (this.mesh == null) {
            this.mesh = this.generateMesh(slim)
        }
        return this.mesh
    }

    resetMesh() {
        this.mesh.dispose()
        this.mesh = null
    }

    generateMesh(slim) {
        const createGeometry = (
            size,
            overlayGrowth,
            baseUV,
            overlayUV,
            position
        ) => {
            const base = new BoxGeometry(...size)
            const overlay = new BoxGeometry(
                size[0] + overlayGrowth,
                size[1] + overlayGrowth,
                size[2] + overlayGrowth
            )

            this.createUVMap(base, ...baseUV, ...size, 64, 64)
            this.createUVMap(overlay, ...overlayUV, ...size, 64, 64)

            // Move the geometry so it can rotate correctly
            base.translate(0, -size[1] / 2, 0)
            overlay.translate(0, -size[1] / 2, 0)

            const geometry = BufferGeometryUtils.mergeGeometries([
                base,
                overlay,
            ])
            const mesh = new Mesh(geometry, this.material)

            // Set the position to under the geometry shift
            mesh.position.set(
                position[0],
                position[1] + size[1] / 2,
                position[2]
            )

            return mesh
        }

        // Head
        const headMesh = createGeometry(
            [8, 8, 8],
            0.5,
            [0, 0],
            [32, 0],
            [0, 10, 0]
        )

        //Body
        const bodyMesh = createGeometry(
            [8, 12, 4],
            0.5,
            [16, 16],
            [16, 32],
            [0, 0, 0]
        )

        const rightArmMesh = createGeometry(
            [slim ? 3 : 4, 12, 4],
            0.5,
            [40, 16],
            [40, 32],
            [slim ? -5.5 : -6, 0, 0]
        )

        const leftArmMesh = createGeometry(
            [slim ? 3 : 4, 12, 4],
            0.5,
            [32, 48],
            [48, 48],
            [slim ? 5.5 : 6, 0, 0]
        )

        const rightLegMesh = createGeometry(
            [4, 12, 4],
            0.5,
            [0, 16],
            [0, 32],
            [-2, -12, 0]
        )

        const leftLegMesh = createGeometry(
            [4, 12, 4],
            0.5,
            [16, 48],
            [0, 48],
            [2, -12, 0]
        )

        const skinGroup = new Group()
        skinGroup.add(
            headMesh,
            bodyMesh,
            rightArmMesh,
            leftArmMesh,
            rightLegMesh,
            leftLegMesh
        )

        skinGroup.name = 'Skin'

        return skinGroup
    }
}
