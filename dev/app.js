// Vue
import { createApp } from 'vue'

// Create the app
import MinecraftSkinViewer from './MinecraftSkinViewer.vue'
const app = createApp(MinecraftSkinViewer)

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

// Mount the app
app.mount('#app')
