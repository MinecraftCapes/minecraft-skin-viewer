import { defineConfig } from 'vite'
import { resolve } from 'path'
import eslint from 'vite-plugin-eslint'

export default defineConfig({
    plugins: [eslint()],
    build: {
        rollupOptions: {
            treeshake: 'smallest',
        },
        copyPublicDir: false,
        lib: {
            // eslint-disable-next-line no-undef
            entry: resolve(__dirname, 'src/main.js'),
            name: 'Minecraft-Skin-Viewer',
            fileName: 'minecraft-skin-viewer',
        },
        outDir: './dist',
    },
})
