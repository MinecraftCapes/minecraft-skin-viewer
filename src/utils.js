export function setNoAlpha(imageData, x0, y0, x1, y1) {
    const d = imageData.data

    for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
            const i = pixelIndex(x, y)
            d[i + 3] = 255
        }
    }
}

export function doNotchTransparencyHack(imageData, x0, y0, x1, y1) {
    const d = imageData.data

    for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
            const i = pixelIndex(x, y)
            if (d[i + 3] < 128) {
                return
            }
        }
    }

    for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
            const i = pixelIndex(x, y)
            d[i + 3] = 0
        }
    }
}

function pixelIndex(x, y) {
    return (y * 64 + x) * 4
}

function setPixel(imageData, x, y, r, g, b, a) {
    const i = pixelIndex(x, y)
    const d = imageData.data
    d[i] = r
    d[i + 1] = g
    d[i + 2] = b
    d[i + 3] = a
}

export function fillRect(imageData, x, y, width, height, r, g, b, a) {
    for (let py = y; py < y + height; py++) {
        for (let px = x; px < x + width; px++) {
            setPixel(imageData, px, py, r, g, b, a)
        }
    }
}

export function copyRect(
    imageData,
    x,
    y,
    dx,
    dy,
    width,
    height,
    mirrorX,
    mirrorY
) {
    const temp = new Uint8ClampedArray(width * height * 4)

    // Read source first so overlapping copies are safe
    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            const srcX = x + i
            const srcY = y + j
            const srcIdx = pixelIndex(srcX, srcY)
            const dstIdx = (j * width + i) * 4
            const d = imageData.data

            temp[dstIdx] = d[srcIdx]
            temp[dstIdx + 1] = d[srcIdx + 1]
            temp[dstIdx + 2] = d[srcIdx + 2]
            temp[dstIdx + 3] = d[srcIdx + 3]
        }
    }

    // Write to destination, optionally mirrored
    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            const srcI = mirrorX ? width - 1 - i : i
            const srcJ = mirrorY ? height - 1 - j : j

            const readIdx = (srcJ * width + srcI) * 4
            const dstX = x + dx + i
            const dstY = y + dy + j
            const writeIdx = pixelIndex(dstX, dstY)
            const d = imageData.data

            d[writeIdx] = temp[readIdx]
            d[writeIdx + 1] = temp[readIdx + 1]
            d[writeIdx + 2] = temp[readIdx + 2]
            d[writeIdx + 3] = temp[readIdx + 3]
        }
    }
}

export function isSlimModel(imageData) {
    const hasTransparency = (x0, y0, x1, y1) => {
        const d = imageData.data
        for (let y = y0; y < y1; y++) {
            for (let x = x0; x < x1; x++) {
                const i = pixelIndex(x, y)
                if (d[i + 3] != 0) {
                    return false
                }
            }
        }
        return true
    }

    //Check if player is transparent
    if (
        hasTransparency(50, 16, 52, 20) &&
        hasTransparency(54, 20, 56, 32) &&
        hasTransparency(42, 48, 44, 52) &&
        hasTransparency(46, 52, 48, 54)
    ) {
        return true
    } else {
        return false
    }
}
