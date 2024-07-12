# Minecraft Skin Viewer

Built using THREE.js for the [MinecraftCapes](https://minecraftcapes.net) website.

Demo - https://minecraft-skin-viewer.pages.dev

## Example
### Creating an instance
```js
import MinecraftSkinViewer from '../src/main.js'

this.minecraftSkinViewer = new MinecraftSkinViewer({
    canvas: document.getElementById('skinviewer'), //The canvas
    skin: '', //Skin (Optional)
    cape: '', //Cape (Optional)
    ears: '' //Ears (Optional)
})
```

### Loading a skin, cape or ears
You can load a skin, cape or ears using a relative path, url or even base64.
```js
this.minecraftSkinViewer.loadSkin('/skins/skin.png')
this.minecraftSkinViewer.loadCape('https://api.minecraftcapes.net/profile/ba4161c03a42496c8ae07d13372f3371/cape')
this.minecraftSkinViewer.loadEars('iVBORw0KGgoAAAANSUhEUgAAAA4AAAAHCAYAAAA4R3wZAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAXklEQVQYlWP8//8/Q93Z7P8MDAwM7x5/YBCSFWCAAWQ+MrvJeCojY+2ZrP8MSABdMzqAybMgC+CyCRtgwifJwMCA1fZ3jz9ANOKSxGcYEy4FQrICeDWzwGzDZis+OQC7EjD/iYogOAAAAABJRU5ErkJggg==')
```

### Clearing a skin, cape, ears
You just set the value to null. However, skin can't be null so it randomly picks Steve or Adam to display
```js
this.minecraftSkinViewer.loadSkin(null) //Will load a random Steve or Alex skin
this.minecraftSkinViewer.loadCape(null) //Will remove the cape/elytra texture
this.minecraftSkinViewer.loadEars(null) //Will remove the ears
```

### Customisation
You can flip the user, enable the elytra or give their cape a glint with the below
```js
this.minecraftSkinViewer.setElytra(true)
this.minecraftSkinViewer.setDinnerbone(true)
this.minecraftSkinViewer.setGlint(true)
```