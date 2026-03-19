import { CanvasTexture } from 'three'
import {
    setNoAlpha,
    fillRect,
    copyRect,
    doNotchTransparencyHack,
    isSlimModel,
} from './utils'

export function applySkin(playerObject, image) {
    if (image.width !== 64 || (image.height !== 32 && image.height !== 64)) {
        throw new Error(
            `Discarding incorrectly sized (${image.width}x${image.height}) skin texture`
        )
    }

    const isLegacy = image.height === 32

    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) throw new Error('Failed to create canvas context')

    // Draw source once
    ctx.drawImage(image, 0, 0)

    // Read once
    const imageData = ctx.getImageData(0, 0, 64, 64)

    // Copy legacy skin data from vanilla
    if (isLegacy) {
        fillRect(imageData, 0, 32, 64, 32, 0, 0, 0, 0)
        copyRect(imageData, 4, 16, 16, 32, 4, 4, true, false)
        copyRect(imageData, 8, 16, 16, 32, 4, 4, true, false)
        copyRect(imageData, 0, 20, 24, 32, 4, 12, true, false)
        copyRect(imageData, 4, 20, 16, 32, 4, 12, true, false)
        copyRect(imageData, 8, 20, 8, 32, 4, 12, true, false)
        copyRect(imageData, 12, 20, 16, 32, 4, 12, true, false)
        copyRect(imageData, 44, 16, -8, 32, 4, 4, true, false)
        copyRect(imageData, 48, 16, -8, 32, 4, 4, true, false)
        copyRect(imageData, 40, 20, 0, 32, 4, 12, true, false)
        copyRect(imageData, 44, 20, -8, 32, 4, 12, true, false)
        copyRect(imageData, 48, 20, -16, 32, 4, 12, true, false)
        copyRect(imageData, 52, 20, -8, 32, 4, 12, true, false)
    }

    // Set skin model
    // It important we check this prior to any alpha changes
    if (isSlimModel(imageData)) {
        playerObject.setSlim(true)
    }

    // Remove alpha
    setNoAlpha(imageData, 0, 0, 32, 16)

    // If legacy, return skin data
    if (isLegacy) {
        doNotchTransparencyHack(imageData, 32, 0, 64, 32)
    }

    // Remove alpha
    setNoAlpha(imageData, 0, 16, 64, 32)
    setNoAlpha(imageData, 16, 48, 48, 64)

    ctx.putImageData(imageData, 0, 0)

    const texture = new CanvasTexture(ctx.canvas)
    playerObject.skin.updateTexture(texture)
    playerObject.overlay.updateTexture(texture)
}

export function applyEars(playerObject, texture) {
    playerObject.ears.updateTexture(texture)
}

export function applyCape(playerObject, texture) {
    playerObject.cape.updateTexture(texture, !playerObject.elytra.mesh.visible)
    playerObject.elytra.updateTexture(texture, playerObject.elytra.mesh.visible)
}
