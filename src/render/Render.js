import {
    MeshStandardMaterial,
    DoubleSide,
    BoxGeometry,
    NearestFilter,
} from 'three'

export default class Render {
    constructor() {
        this.material = new MeshStandardMaterial({
            side: DoubleSide,
            transparent: true,
            alphaTest: 1e-5,
        })
    }

    createCube(width, height, depth, position, value) {
        const cubeGeometry = new BoxGeometry(width, height, depth)
        cubeGeometry.translate(position.x, position.y, position.z)
        value.push(cubeGeometry)
    }

    createUVMap(
        geometry,
        startX,
        startY,
        width,
        height,
        depth,
        textureWidth,
        textureHeight
    ) {
        const uvAttribute = geometry.getAttribute('uv')
        const index = geometry.getIndex()

        //Top Left, Bottom Left, Top Right, Bottom Left, Bottom Right, Top Right

        //Left
        uvAttribute.setXY(
            index.getX(0),
            (startX + width + depth) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        )
        uvAttribute.setXY(
            index.getX(1),
            (startX + width + depth) / textureWidth,
            1.0 - (startY + depth + height) / textureHeight
        )
        uvAttribute.setXY(
            index.getX(2),
            (startX + width + depth * 2) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        )
        uvAttribute.setXY(
            index.getX(3),
            (startX + width + depth) / textureWidth,
            1.0 - (startY + depth + height) / textureHeight
        )
        uvAttribute.setXY(
            index.getX(4),
            (startX + width + depth * 2) / textureWidth,
            1.0 - (startY + depth + height) / textureHeight
        )
        uvAttribute.setXY(
            index.getX(5),
            (startX + width + depth * 2) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        )

        //Right
        uvAttribute.setXY(
            index.getX(6),
            startX / textureWidth,
            1.0 - (startY + depth) / textureHeight
        )
        uvAttribute.setXY(
            index.getX(7),
            startX / textureWidth,
            1.0 - (startY + depth + height) / textureHeight
        )
        uvAttribute.setXY(
            index.getX(8),
            (startX + depth) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        )
        uvAttribute.setXY(
            index.getX(9),
            startX / textureWidth,
            1.0 - (startY + depth + height) / textureHeight
        )
        uvAttribute.setXY(
            index.getX(10),
            (startX + depth) / textureWidth,
            1.0 - (startY + depth + height) / textureHeight
        )
        uvAttribute.setXY(
            index.getX(11),
            (startX + depth) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        )

        //Top
        uvAttribute.setXY(
            index.getX(12),
            (startX + depth) / textureWidth,
            1.0 - startY / textureHeight
        )
        uvAttribute.setXY(
            index.getX(13),
            (startX + depth) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        )
        uvAttribute.setXY(
            index.getX(14),
            (startX + width + depth) / textureWidth,
            1.0 - startY / textureHeight
        )
        uvAttribute.setXY(
            index.getX(15),
            (startX + depth) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        )
        uvAttribute.setXY(
            index.getX(16),
            (startX + width + depth) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        )
        uvAttribute.setXY(
            index.getX(17),
            (startX + width + depth) / textureWidth,
            1.0 - startY / textureHeight
        )

        //Bottom
        uvAttribute.setXY(
            index.getX(18),
            (startX + depth + width) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        )
        uvAttribute.setXY(
            index.getX(19),
            (startX + depth + width) / textureWidth,
            1.0 - startY / textureHeight
        )
        uvAttribute.setXY(
            index.getX(20),
            (startX + depth + width * 2) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        )
        uvAttribute.setXY(
            index.getX(21),
            (startX + depth + width) / textureWidth,
            1.0 - startY / textureHeight
        )
        uvAttribute.setXY(
            index.getX(22),
            (startX + depth + width * 2) / textureWidth,
            1.0 - startY / textureHeight
        )
        uvAttribute.setXY(
            index.getX(23),
            (startX + depth + width * 2) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        )

        //Front
        uvAttribute.setXY(
            index.getX(24),
            (startX + depth) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        ) //top left
        uvAttribute.setXY(
            index.getX(25),
            (startX + depth) / textureWidth,
            1.0 - (startY + height + depth) / textureHeight
        ) //bottom left
        uvAttribute.setXY(
            index.getX(26),
            (startX + width + depth) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        ) //top right
        uvAttribute.setXY(
            index.getX(27),
            (startX + depth) / textureWidth,
            1.0 - (startY + height + depth) / textureHeight
        ) //bottom left
        uvAttribute.setXY(
            index.getX(28),
            (startX + width + depth) / textureWidth,
            1.0 - (startY + height + depth) / textureHeight
        ) //bottom right
        uvAttribute.setXY(
            index.getX(29),
            (startX + width + depth) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        ) //top right

        //Back
        uvAttribute.setXY(
            index.getX(30),
            (startX + (depth * 2 + width)) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        ) //top left
        uvAttribute.setXY(
            index.getX(31),
            (startX + (depth * 2 + width)) / textureWidth,
            1.0 - (startY + height + depth) / textureHeight
        ) //bottom left
        uvAttribute.setXY(
            index.getX(32),
            (startX + (width * 2 + depth * 2)) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        ) //top right
        uvAttribute.setXY(
            index.getX(33),
            (startX + (depth * 2 + width)) / textureWidth,
            1.0 - (startY + height + depth) / textureHeight
        ) //bottom left
        uvAttribute.setXY(
            index.getX(34),
            (startX + (width * 2 + depth * 2)) / textureWidth,
            1.0 - (startY + height + depth) / textureHeight
        ) //bottom right
        uvAttribute.setXY(
            index.getX(35),
            (startX + (width * 2 + depth * 2)) / textureWidth,
            1.0 - (startY + depth) / textureHeight
        ) //top right
    }

    hasTexture() {
        return this.texture != null
    }

    updateTexture(texture, visible = true) {
        this.texture = texture
        if (this.texture != null) {
            this.texture.minFilter = NearestFilter
            this.texture.magFilter = NearestFilter
            this.texture.generateMipmaps = false
            this.mesh.visible = visible
        } else {
            this.mesh.visible = false
        }
        this.material.map = this.texture
    }

    getMesh() {
        if (this.mesh == null) {
            this.mesh = this.generateMesh()
        }
        return this.mesh
    }
}
