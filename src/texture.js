import { CanvasTexture } from 'three'
import {
    setNoAlpha,
    fillRect,
    copyRect,
    doNotchTransparencyHack,
    isSlimModel,
} from './utils'
import ElytraTemplate from './assets/ElytraTemplate.png'

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
    } else {
        playerObject.setSlim(false)
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

export function applyCape(playerObject, image) {
    if (image == null) {
        playerObject.cape.updateTexture(null, !playerObject.elytra.mesh.visible)
        playerObject.elytra.updateTexture(
            null,
            playerObject.elytra.mesh.visible
        )
        return
    }

    let canvasWidth
    let canvasHeight
    let needsElytra = false

    if (image.width % 22 === 0 && image.height % 17 === 0) {
        // Mantle/LabyMod (Cape Only)
        canvasWidth = 64 * (image.width / 22)
        canvasHeight = 32 * (image.height / 17)
        needsElytra = true
    } else if (image.width == 92 && image.height == 44) {
        // OptiFine (Cape and Elytra)
        canvasWidth = 128
        canvasHeight = 64
    } else if (image.width === image.height * 2 && image.width % 64 === 0) {
        // Regular Static Capes (64x32 scaled up)
        canvasWidth = image.width
        canvasHeight = image.height
    } else if (
        image.width % 64 === 0 &&
        image.height % (image.width / 2) === 0
    ) {
        // Animated Cape
        canvasWidth = image.width
        canvasHeight = image.height
    } else {
        throw new Error(
            `Discarding incorrectly sized (${image.width}x${image.height}) cape texture`
        )
    }

    const canvas = document.createElement('canvas')
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) throw new Error('Failed to create canvas context')

    const applyTexture = () => {
        const texture = new CanvasTexture(ctx.canvas)
        playerObject.cape.updateTexture(
            texture,
            !playerObject.elytra.mesh.visible
        )
        playerObject.elytra.updateTexture(
            texture,
            playerObject.elytra.mesh.visible
        )
    }

    // Draw source once
    if (needsElytra) {
        const elytra = new Image()
        elytra.crossOrigin = 'anonymous'

        // Try load skin
        elytra.onload = () => {
            ctx.imageSmoothingEnabled = false
            ctx.drawImage(elytra, 0, 0, 64, 32, 0, 0, canvasWidth, canvasHeight)
            ctx.drawImage(image, 0, 0)
            applyTexture()
        }

        elytra.onerror = () => {
            ctx.drawImage(image, 0, 0)
            applyTexture()
        }

        elytra.src = ElytraTemplate
    } else {
        ctx.drawImage(image, 0, 0)
        applyTexture()
    }
}
