import { ShaderMaterial } from 'three';
import {
    Vector2,
    MeshStandardMaterial,
    DoubleSide,
    NearestFilter,
    Vector3,
    Mesh,
    Group,
    MathUtils,
    BoxGeometry
} from 'three'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import EnchantmentShader from './enchantment';
import { TextureLoader } from 'three';
import GlintImage from './glint'

let createCube = (width, height, depth, position, value) => {
    let cubeGeometry = new BoxGeometry(width, height, depth);
    cubeGeometry.translate(position.x, position.y, position.z);
    value.push(cubeGeometry);
}

function createUVMap(geometry, startX, startY, width, height, depth, textureWidth, textureHeight) {
    const uvAttribute  = geometry.getAttribute( 'uv' );
    const index = geometry.getIndex();

    //Top Left, Bottom Left, Top Right, Bottom Left, Bottom Right, Top Right

    //Left
    uvAttribute.setXY(index.getX(0), (startX + width + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight );
    uvAttribute.setXY(index.getX(1), (startX + width + depth) / textureWidth, 1.0 - (startY + depth + height) / textureHeight );
    uvAttribute.setXY(index.getX(2), (startX + width + (depth * 2)) / textureWidth, 1.0 - (startY + depth) / textureHeight );
    uvAttribute.setXY(index.getX(3), (startX + width + depth) / textureWidth, 1.0 - (startY + depth + height) / textureHeight );
    uvAttribute.setXY(index.getX(4), (startX + width + (depth * 2)) / textureWidth, 1.0 - (startY + depth + height) / textureHeight );
    uvAttribute.setXY(index.getX(5), (startX + width + (depth * 2)) / textureWidth, 1.0 - (startY + depth) / textureHeight );

    //Right
    uvAttribute.setXY(index.getX(6), startX / textureWidth, 1.0 - (startY + depth) / textureHeight );
    uvAttribute.setXY(index.getX(7), startX / textureWidth, 1.0 - (startY + depth + height) / textureHeight );
    uvAttribute.setXY(index.getX(8), (startX + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight );
    uvAttribute.setXY(index.getX(9), startX / textureWidth, 1.0 - (startY + depth + height) / textureHeight );
    uvAttribute.setXY(index.getX(10), (startX + depth) / textureWidth, 1.0 - (startY + depth + height) / textureHeight );
    uvAttribute.setXY(index.getX(11), (startX + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight );

    //Top
    uvAttribute.setXY(index.getX(12), (startX + depth) / textureWidth, 1.0 - startY / textureHeight );
    uvAttribute.setXY(index.getX(13), (startX + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight );
    uvAttribute.setXY(index.getX(14), (startX + width + depth) / textureWidth, 1.0 - startY / textureHeight );
    uvAttribute.setXY(index.getX(15), (startX + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight );
    uvAttribute.setXY(index.getX(16), (startX + width + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight );
    uvAttribute.setXY(index.getX(17), (startX + width + depth) / textureWidth, 1.0 - startY / textureHeight );

    //Bottom
    uvAttribute.setXY(index.getX(18), (startX + depth + width) / textureWidth, 1.0 - (startY + depth) / textureHeight );
    uvAttribute.setXY(index.getX(19), (startX + depth + width) / textureWidth, 1.0 - startY / textureHeight );
    uvAttribute.setXY(index.getX(20), (startX + depth + (width * 2)) / textureWidth, 1.0 - (startY + depth) / textureHeight );
    uvAttribute.setXY(index.getX(21), (startX + depth + width) / textureWidth, 1.0 - startY / textureHeight );
    uvAttribute.setXY(index.getX(22), (startX + depth + (width * 2)) / textureWidth, 1.0 - startY / textureHeight );
    uvAttribute.setXY(index.getX(23), (startX + depth + (width * 2)) / textureWidth, 1.0 - (startY + depth) / textureHeight );

    //Front
    uvAttribute.setXY(index.getX(24), (startX + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight ); //top left
    uvAttribute.setXY(index.getX(25), (startX + depth) / textureWidth, 1.0 - (startY + height + depth) / textureHeight ); //bottom left
    uvAttribute.setXY(index.getX(26), (startX + width + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight ); //top right
    uvAttribute.setXY(index.getX(27), (startX + depth) / textureWidth, 1.0 - (startY + height + depth) / textureHeight ); //bottom left
    uvAttribute.setXY(index.getX(28), (startX + width + depth) / textureWidth, 1.0 - (startY + height + depth) / textureHeight ); //bottom right
    uvAttribute.setXY(index.getX(29), (startX + width + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight ); //top right

    //Back
    uvAttribute.setXY(index.getX(30), (startX + (depth * 2 + width)) / textureWidth, 1.0 - (startY + depth) / textureHeight ); //top left
    uvAttribute.setXY(index.getX(31), (startX + (depth * 2 + width)) / textureWidth, 1.0 - (startY + height + depth) / textureHeight ); //bottom left
    uvAttribute.setXY(index.getX(32), (startX + (width * 2 + depth * 2)) / textureWidth, 1.0 - (startY + depth) / textureHeight ); //top right
    uvAttribute.setXY(index.getX(33), (startX + (depth * 2 + width)) / textureWidth, 1.0 - (startY + height + depth) / textureHeight ); //bottom left
    uvAttribute.setXY(index.getX(34), (startX + (width * 2 + depth * 2)) / textureWidth, 1.0 - (startY + height + depth) / textureHeight ); //bottom right
    uvAttribute.setXY(index.getX(35), (startX + (width * 2 + depth * 2)) / textureWidth, 1.0 - (startY + depth) / textureHeight ); //top right
}

export class PlayerObject {
    constructor() {
        this.skin = new SkinObject()
        this.overlay = new OverlayObject()
        this.ears = new EarObject()
        this.cape = new CapeObject()
        this.elytra = new ElytraObject()

        this.group = new Group()

        this.group.add(
            this.skin.getMesh(),
            this.overlay.getMesh(),
            this.ears.getMesh(),
            this.cape.getMesh(),
            this.elytra.getMesh()
        )
    }

    changeSkinModel(slim) {
        this.group.remove(this.group.getObjectByName("Skin"), this.group.getObjectByName("Overlay"))

        //Add new slim model
        this.group.add(this.skin.getMesh(slim), this.overlay.getMesh(slim))
    }
}

class PlayerPart {
    constructor() {
        this.material = new MeshStandardMaterial({ side: DoubleSide, transparent: true, alphaTest: 1e-5 })
    }

    hasTexture() {
        return this.texture != null;
    }

    updateTexture(texture, visible = true) {
        this.texture = texture;
        if(this.texture != null) {
            this.texture.magFilter = NearestFilter
            this.mesh.visible = visible
        } else {
            this.mesh.visible = false;
        }
        this.material.map = this.texture
    }

    getMesh() {
        if(this.mesh == null) {
            this.mesh = this.generateMesh()
        }
        return this.mesh;
    }
}

class AnimatedPart extends PlayerPart {
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
                    textureOffset: { type: 'v', value : new Vector2(0, 0) },
                    textureRepeat: { type: 'v', value: new Vector2(1, 1) },
                    glintOffset: { type: 'v', value : new Vector2(0, 0) },
                    glintRepeat: { type: 'v', value: new Vector2(0.25, 0.25) },
                    glimmerOpacity: { type: 'f', value: 0.75 }
                }
            })
        }

        updateTexture(texture, visible = true) {
            this.texture = texture;
            if(this.texture != null) {
                this.texture.magFilter = NearestFilter

                //Set the texture uniform
                this.material.uniforms.baseTexture.value = texture

                //Set the cape repition (for animation)
                let frameWidth = texture.source.data.width
                let frameHeight = texture.source.data.height
                let totalFrames = frameHeight / (frameWidth / 2)
                this.material.uniforms.textureRepeat.value = new Vector2(1, 1 / totalFrames)

                this.mesh.visible = visible
            } else {
                this.mesh.visible = false;
            }
        }

        animate() {
            let texture = this.material.uniforms.baseTexture.value
            if(texture != null) {
                let frameWidth = texture.source.data.width
                let frameHeight = texture.source.data.height
                let totalFrames = frameHeight / (frameWidth / 2)

                if(this.lastFrameTime < Date.now() - 100) {
                    if(totalFrames > 1) {
                        if(this.currentFrame > totalFrames) {
                            this.currentFrame = 1
                        }

                        this.material.uniforms.textureOffset.value = new Vector2(0, this.currentFrame)
                        this.currentFrame++
                    }

                    let glintVec = this.material.uniforms.glintOffset.value

                    glintVec.x += 0.05
                    glintVec.z += 0.05

                    this.lastFrameTime = Date.now()
                }
            }
        }
}

class SkinObject extends PlayerPart {
    constructor() {
        super()
    }

    getMesh(slim) {
        this.mesh = this.generateMesh(slim);
        return this.mesh
    }

    generateMesh(slim) {
        const skinGeometry = [];

        //Body
        createCube(8, 8, 8, new Vector3(0, 10, 0), skinGeometry) //Head
        createUVMap(skinGeometry[0], 0, 0, 8, 8, 8, 64, 64)

        createCube(8, 12, 4, new Vector3(0, 0, 0), skinGeometry) //Body
        createUVMap(skinGeometry[1], 16, 16, 8, 12, 4, 64, 64)

        createCube(slim ? 3 : 4, 12, 4, new Vector3(slim ? -5.5 : -6, 0, 0), skinGeometry) //Right Arm
        createUVMap(skinGeometry[2], 40, 16, slim ? 3 : 4, 12, 4, 64, 64)

        createCube(slim ? 3 : 4, 12, 4, new Vector3(slim ? 5.5 : 6, 0, 0), skinGeometry) //Left Arm
        createUVMap(skinGeometry[3], 32, 48, slim ? 3 : 4, 12, 4, 64, 64)

        createCube(4, 12, 4, new Vector3(-2, -12, 0), skinGeometry) //Right Leg
        createUVMap(skinGeometry[4], 0, 16, 4, 12, 4, 64, 64)

        createCube(4, 12, 4, new Vector3(2, -12, 0), skinGeometry) //Left Leg
        createUVMap(skinGeometry[5], 16, 48, 4, 12, 4, 64, 64)

        let skinMesh = new Mesh(BufferGeometryUtils.mergeGeometries(skinGeometry), this.material);
        skinMesh.name = "Skin"

        return skinMesh
    }
}

class OverlayObject extends PlayerPart {
    constructor() {
        super()
    }

    getMesh(slim) {
        this.mesh = this.generateMesh(slim);
        return this.mesh
    }

    generateMesh(slim) {
        const overlayGeometry = [];

        //Overlay
        createCube(8.5, 8.5, 8.5, new Vector3(0, 10, 0), overlayGeometry) //Head
        createUVMap(overlayGeometry[0], 32, 0, 8, 8, 8, 64, 64)

        createCube(8.5, 12.5, 4.5, new Vector3(0, 0, 0), overlayGeometry) //Body
        createUVMap(overlayGeometry[1], 16, 32, 8, 12, 4, 64, 64)

        createCube(slim ? 3.5 : 4.5, 12.5, 4.5, new Vector3(slim ? -5.5 : -6, 0, 0), overlayGeometry) //Right Arm
        createUVMap(overlayGeometry[2], 40, 32, slim ? 3 : 4, 12, 4, 64, 64)

        createCube(slim ? 3.5 : 4.5, 12.5, 4.5, new Vector3(slim ? 5.5 : 6, 0, 0), overlayGeometry) //Left Arm
        createUVMap(overlayGeometry[3], 48, 48, slim ? 3 : 4, 12, 4, 64, 64)

        createCube(4.5, 12.5, 4.5, new Vector3(-2, -12, 0), overlayGeometry) //Right Leg
        createUVMap(overlayGeometry[4], 0, 32, 4, 12, 4, 64, 64)

        createCube(4.5, 12.5, 4.5, new Vector3(2, -12, 0), overlayGeometry) //Left Leg
        createUVMap(overlayGeometry[5], 0, 48, 4, 12, 4, 64, 64)

        let overlayMesh = new Mesh(BufferGeometryUtils.mergeGeometries(overlayGeometry), this.material)
        overlayMesh.name = "Overlay"

        return overlayMesh
    }
}

class EarObject extends PlayerPart {
    constructor() {
        super();
    }

    generateMesh() {
        const earGeometry = [];

        //Ears
        createCube(8, 8, 1, new Vector3(6, 15, 0), earGeometry) //Right Ear
        createCube(8, 8, 1, new Vector3(-6, 15, 0), earGeometry) //Right Ear
        createUVMap(earGeometry[0], 0, 0, 6, 6, 1, 14, 7)
        createUVMap(earGeometry[1], 0, 0, 6, 6, 1, 14, 7)

        let earMesh = new Mesh(BufferGeometryUtils.mergeGeometries(earGeometry), this.material);
        earMesh.name = "Ears"

        return earMesh
    }
}

class CapeObject extends AnimatedPart {
    glintTexture;

    constructor() {
        super()

        let loader = new TextureLoader();
        this.glintTexture = loader.load(GlintImage)
        this.glintTexture.magFilter = NearestFilter
    }

    generateMesh() {
        //Cape
        let capeGeometry = new BoxGeometry(10, 16, 1);
        capeGeometry.translate(0, -3, 4);
        createUVMap(capeGeometry, 0, 0, 10, 16, 1, 64, 32)
        capeGeometry.rotateX(-0.25)
        capeGeometry.rotateY(MathUtils.degToRad(180))

        let capeMesh = new Mesh(capeGeometry, this.material)
        capeMesh.name = "Cape"

        // Merge all cube geometries into one
        return capeMesh;
    }

    toggleGlint(value) {
        if(value) {
            this.material.uniforms.glimmerTexture.value = this.glintTexture
        } else {
            this.material.uniforms.glimmerTexture.value = null;
        }
    }
}

class ElytraObject extends AnimatedPart {
    generateMesh() {
        let leftWing = new BoxGeometry(12, 22, 4)
        leftWing.translate(2, -7, -4)
        leftWing.rotateX(0.2617994)
        leftWing.rotateZ(0.2617994)

        let rightWing = new BoxGeometry(12, 22, 4)
        rightWing.scale(-1, 1, 1)
        rightWing.translate(-2, -7, -4)
        rightWing.rotateX(0.2617994)
        rightWing.rotateZ(-0.2617994)

        createUVMap(leftWing, 22, 0, 10, 20, 2, 64, 32)
        createUVMap(rightWing, 22, 0, 10, 20, 2, 64, 32)

        let elytraMesh = new Mesh(BufferGeometryUtils.mergeGeometries([leftWing, rightWing]), this.material);
        elytraMesh.name = "Elytra"
        elytraMesh.visible = false;

        return elytraMesh;
    }
}