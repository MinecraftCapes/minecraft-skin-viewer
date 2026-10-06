import Render from './Render'
import { Vector3 } from 'three/src/math/Vector3.js'
import { Mesh } from 'three/src/objects/Mesh.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'

export default class EarRender extends Render {
    constructor() {
        super()
    }

    generateMesh() {
        const earGeometry = []

        //Ears
        this.createCube(8, 8, 1, new Vector3(6, 15, 0), earGeometry) //Right Ear
        this.createCube(8, 8, 1, new Vector3(-6, 15, 0), earGeometry) //Right Ear
        this.createUVMap(earGeometry[0], 0, 0, 6, 6, 1, 14, 7)
        this.createUVMap(earGeometry[1], 0, 0, 6, 6, 1, 14, 7)

        const earMesh = new Mesh(
            BufferGeometryUtils.mergeGeometries(earGeometry),
            this.material
        )
        earMesh.name = 'Ears'

        return earMesh
    }
}
