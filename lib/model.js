import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

let textureLoader;
let bodyMesh
let overlayMesh
let capeMesh
let earMesh

function setupModel(scene) {
    const bodyGeometry = [];
    const overlayGeometry = [];
    const earGeometry = [];

    let createCube = (width, height, depth, position, value) => {
        let cubeGeometry = new THREE.BoxGeometry(width, height, depth);
        cubeGeometry.translate(position.x, position.y, position.z);
        value.push(cubeGeometry);
    }

    //Body
    createCube(8, 8, 8, new THREE.Vector3(0, 10, 0), bodyGeometry) //Head
    createUVMap(bodyGeometry[0], 0, 0, 8, 8, 8, 64, 64)

    createCube(8, 12, 4, new THREE.Vector3(0, 0, 0), bodyGeometry) //Body
    createUVMap(bodyGeometry[1], 16, 16, 8, 12, 4, 64, 64)

    createCube(4, 12, 4, new THREE.Vector3(-6, 0, 0), bodyGeometry) //Right Arm
    createUVMap(bodyGeometry[2], 40, 16, 4, 12, 4, 64, 64)

    createCube(4, 12, 4, new THREE.Vector3(6, 0, 0), bodyGeometry) //Left Arm
    createUVMap(bodyGeometry[3], 32, 48, 4, 12, 4, 64, 64)

    createCube(4, 12, 4, new THREE.Vector3(-2, -12, 0), bodyGeometry) //Right Leg
    createUVMap(bodyGeometry[4], 0, 16, 4, 12, 4, 64, 64)

    createCube(4, 12, 4, new THREE.Vector3(2, -12, 0), bodyGeometry) //Left Leg
    createUVMap(bodyGeometry[5], 16, 48, 4, 12, 4, 64, 64)

    //Overlay
    createCube(8.5, 8.5, 8.5, new THREE.Vector3(0, 10, 0), overlayGeometry) //Head
    createUVMap(overlayGeometry[0], 32, 0, 8, 8, 8, 64, 64)

    createCube(8.5, 12.5, 4.5, new THREE.Vector3(0, 0, 0), overlayGeometry) //Body
    createUVMap(overlayGeometry[1], 16, 32, 8, 12, 4, 64, 64)

    createCube(4.5, 12.5, 4.5, new THREE.Vector3(-6, 0, 0), overlayGeometry) //Right Arm
    createUVMap(overlayGeometry[2], 40, 32, 4, 12, 4, 64, 64)

    createCube(4.5, 12.5, 4.5, new THREE.Vector3(6, 0, 0), overlayGeometry) //Left Arm
    createUVMap(overlayGeometry[3], 48, 48, 4, 12, 4, 64, 64)

    createCube(4.5, 12.5, 4.5, new THREE.Vector3(-2, -12, 0), overlayGeometry) //Right Leg
    createUVMap(overlayGeometry[4], 0, 32, 4, 12, 4, 64, 64)

    createCube(4.5, 12.5, 4.5, new THREE.Vector3(2, -12, 0), overlayGeometry) //Left Leg
    createUVMap(overlayGeometry[5], 0, 48, 4, 12, 4, 64, 64)

    //Ears
    createCube(8, 8, 1, new THREE.Vector3(6, 15, 0), earGeometry) //Right Ear
    createCube(8, 8, 1, new THREE.Vector3(-6, 15, 0), earGeometry) //Right Ear
    createUVMap(earGeometry[0], 0, 0, 6, 6, 1, 14, 7)
    createUVMap(earGeometry[1], 0, 0, 6, 6, 1, 14, 7)

    //Cape
    let capeGeometry = new THREE.BoxGeometry(10, 16, 1);
    capeGeometry.translate(0, -3, 4);
    createUVMap(capeGeometry, 0, 0, 10, 16, 1, 64, 32)
    capeGeometry.rotateX(-0.25)
    capeGeometry.rotateY(THREE.MathUtils.degToRad(180))

    //Elytra
    let elytraGemetry = new THREE.BoxGeometry(10, 20, 2)

    // Merge all cube geometries into one
    bodyMesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(bodyGeometry));
    overlayMesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(overlayGeometry))
    earMesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(earGeometry));
    capeMesh = new THREE.Mesh(capeGeometry);

    /**
     * Add to scene
     */
    scene.add(bodyMesh, overlayMesh, earMesh, capeMesh);
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
    uvAttribute.setXY(index.getX(18), (startX + depth + width) / textureWidth, 1.0 - startY / textureHeight );
    uvAttribute.setXY(index.getX(19), (startX + depth + width) / textureWidth, 1.0 - (startY + depth) / textureHeight );
    uvAttribute.setXY(index.getX(20), (startX + depth + (width * 2)) / textureWidth, 1.0 - startY / textureHeight );
    uvAttribute.setXY(index.getX(21), (startX + depth + width) / textureWidth, 1.0 - (startY + depth) / textureHeight );
    uvAttribute.setXY(index.getX(22), (startX + depth + (width * 2)) / textureWidth, 1.0 - (startY + depth) / textureHeight );
    uvAttribute.setXY(index.getX(23), (startX + depth + (width * 2)) / textureWidth, 1.0 - startY / textureHeight );

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

function applySkin(skin) {
    skin.magFilter = THREE.NearestFilter
    skin.colorSpace = THREE.SRGBColorSpace

    bodyMesh.material = new THREE.MeshStandardMaterial({ map: skin })
    overlayMesh.material = new THREE.MeshStandardMaterial({ map: skin, transparent: true })
}

function applyCape(cape) {
    cape.magFilter = THREE.NearestFilter
    cape.colorSpace = THREE.SRGBColorSpace

    capeMesh.material = new THREE.MeshStandardMaterial({ map: cape })
}

function applyEars(ears) {
    ears.magFilter = THREE.NearestFilter
    ears.colorSpace = THREE.SRGBColorSpace

    earMesh.material = new THREE.MeshStandardMaterial({ map: ears })
}

export {
    setupModel,
    applySkin,
    applyCape,
    applyEars
}