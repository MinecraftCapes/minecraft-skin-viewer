import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    root: './example',
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/main.js'),
            name: 'Minecraft-Skin-Viewer',
            fileName: 'minecraft-skin-viewer'
        }
    }
})