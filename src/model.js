import { Group } from 'three'
import PlayerRender from './render/PlayerRender.js'
import EarRender from './render/EarRender.js'
import CapeRender from './render/CapeRender.js'
import ElytraRender from './render/ElytraRender.js'

export class PlayerObject {
    constructor() {
        this.skin = new PlayerRender()
        this.ears = new EarRender()
        this.cape = new CapeRender()
        this.elytra = new ElytraRender()

        this.group = new Group()

        this.group.add(
            this.skin.getMesh(),
            this.ears.getMesh(),
            this.cape.getMesh(),
            this.elytra.getMesh()
        )
    }

    setSlim(slim) {
        this.group.remove(this.skin.getMesh())

        // Reset Mesh
        this.skin.resetMesh()

        //Add new slim model
        this.group.add(this.skin.getMesh(slim))
    }
}
