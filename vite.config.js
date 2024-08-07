import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        copyPublicDir: false,
        lib: {
            entry: resolve(__dirname, 'src/main.js'),
            name: 'Minecraft-Skin-Viewer',
            fileName: 'minecraft-skin-viewer',
        },
        outDir: './dist'
    }
})