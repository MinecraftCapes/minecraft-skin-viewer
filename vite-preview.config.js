import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    resolve: {
        alias: [{ find: /^three$/, replacement: 'three/src/Three.js' }],
    },
    plugins: [vue()],
    build: {
        outDir: './example',
    },
})
