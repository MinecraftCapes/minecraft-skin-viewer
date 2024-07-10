import {
    CanvasTexture
} from 'three';

function hasTransparency(ctx, startX, startY, width, height) {
    let alphaData = 0;
    let imgData = ctx.getImageData(startX, startY, width, height).data
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            let offset = ((x + y * width) * 4) + 3
            alphaData += imgData[offset]
        }
    }
    return alphaData == 0;
}

export function applySkin(playerObject, ctx) {
    let texture = new CanvasTexture(ctx.canvas);

    //Check if player is transparent
    if(
        hasTransparency(ctx, 50, 16, 2, 4) &&
        hasTransparency(ctx, 54, 20, 2, 12) &&
        hasTransparency(ctx, 42, 48, 2, 4) &&
        hasTransparency(ctx, 46, 52, 2, 12)
    ) {
        playerObject.changeSkinModel(true);
    } else {
        playerObject.changeSkinModel(false);
    }

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