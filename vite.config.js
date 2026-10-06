import { defineConfig } from 'vite'
import { resolve } from 'path'
import eslint from 'vite-plugin-eslint'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    resolve: {
        alias: [{ find: /^three$/, replacement: 'three/src/Three.js' }],
    },
    plugins: [vue(), eslint()],
    build: {
        rolldownOptions: {
            treeshake: true,
            output: {
                minify: { compress: true, mangle: true, codegen: true },
            },
        },
        copyPublicDir: false,
        lib: {
            entry: resolve(import.meta.dirname, 'src/main.js'),
            name: 'Minecraft-Skin-Viewer',
            fileName: 'minecraft-skin-viewer',
        },
        outDir: './dist',
    },
})
