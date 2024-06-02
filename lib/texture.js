import * as THREE from 'three';

//Animated Capes
let currentFrame = 1
let lastFrameTime = 0

let skinTexture, overlayTexture, earTexture, capeTexture

export function applySkin(playerObject, ctx) {
    let texture = new THREE.CanvasTexture(ctx.canvas);

    texture.magFilter = THREE.NearestFilter

    skinTexture = new THREE.MeshStandardMaterial({ map: texture })
    overlayTexture = new THREE.MeshStandardMaterial({ map: texture, transparent: true })

    playerObject.addBodyModel(skinTexture, overlayTexture)
}

export function applyEars(playerObject, texture) {
    if(texture == null) {
        earTexture = null
    } else {
        texture.magFilter = THREE.NearestFilter

        earTexture = new THREE.MeshStandardMaterial({ map: texture })

        playerObject.addEarsModel(earTexture)
    }
}

export function applyCape(playerObject, texture) {
    if(texture == null) {
        capeTexture = null
    } else {
        texture.magFilter = THREE.NearestFilter

        let frameWidth = texture.source.data.width
        let frameHeight = texture.source.data.height
        let totalFrames = frameHeight / (frameWidth / 2)
        texture.repeat.set(1, 1 / totalFrames);

        capeTexture = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, map: texture, transparent: true })
        playerObject.addCapeModel(capeTexture)
    }
}

export function animateCape() {
    if(capeTexture == null || capeTexture.map == null) return;

    let frameWidth = capeTexture.map.source.data.width
    let frameHeight = capeTexture.map.source.data.height
    let totalFrames = frameHeight / (frameWidth / 2)

    if(totalFrames > 1) {
        if(lastFrameTime < Date.now() - 100) {
            if(currentFrame > totalFrames) {
                currentFrame = 1
            }

            capeTexture.map.offset.y = 1 - ((1 / totalFrames) * currentFrame)

            currentFrame++
            lastFrameTime = Date.now()
        }
    }
}