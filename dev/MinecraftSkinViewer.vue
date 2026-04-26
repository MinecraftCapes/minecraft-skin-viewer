<template>
    <div class="p-5">
        <h1>Minecraft Skin Viewer</h1>
        <hr />
        <div class="row">
            <div class="col-md-4 mb-3">
                <canvas
                    id="minecraft-skin-viewer"
                    class="border rounded shadow-lg"
                ></canvas>
                <hr />
                <div class="form-check form-switch">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="checkDinnerbone"
                        @change="setAutoRotate"
                    />
                    <label class="form-check-label" for="checkDinnerbone"
                        >Auto Rotate</label
                    >
                </div>
            </div>
            <div class="col ml-1">
                <div>
                    <h4>Change User</h4>
                    <div class="row">
                        <div class="col-md-8 mb-1">
                            <input
                                type="text"
                                class="form-control"
                                v-model="username"
                            />
                        </div>
                        <div class="col-md-4">
                            <button
                                class="btn btn-primary w-100 me-1"
                                @click="changeUser"
                            >
                                Change User
                            </button>
                        </div>
                        <strong v-if="error" class="text-danger px-3 py-1">{{
                            error
                        }}</strong>
                    </div>
                </div>
                <hr />
                <div>
                    <h4>Skin</h4>
                    <div>
                        <input
                            ref="skinFile"
                            type="file"
                            class="d-none"
                            @change="uploadSkin"
                            accept=".png"
                        />
                        <button
                            class="btn btn-warning me-1 mb-xs-1"
                            @click="$refs.skinFile.click()"
                        >
                            Choose Skin
                        </button>
                        <button
                            class="btn btn-primary me-1 mb-xs-1"
                            @click="changeSkin"
                        >
                            Change Skin
                        </button>
                        <button class="btn btn-danger me-1" @click="removeSkin">
                            Remove Skin
                        </button>
                    </div>
                    <br />
                    <h4>Cape</h4>
                    <div>
                        <input
                            ref="capeFile"
                            type="file"
                            class="d-none"
                            @change="uploadCape"
                            accept=".png"
                        />
                        <button
                            class="btn btn-warning me-1 mb-xs-1"
                            @click="$refs.capeFile.click()"
                        >
                            Choose Cape
                        </button>
                        <button
                            class="btn btn-primary me-1 mb-xs-1"
                            @click="changeStaticCape"
                        >
                            Static Cape
                        </button>
                        <button
                            class="btn btn-primary me-1 mb-xs-1"
                            @click="changeAnimatedCape"
                        >
                            Animated Cape
                        </button>
                        <button class="btn btn-danger me-1" @click="removeCape">
                            Remove Cape
                        </button>
                    </div>
                    <br />
                    <h4>Ears</h4>
                    <div>
                        <input
                            ref="earFile"
                            type="file"
                            class="d-none"
                            @change="uploadEars"
                            accept=".png"
                        />
                        <button
                            class="btn btn-warning me-1 mb-xs-1"
                            @click="$refs.earFile.click()"
                        >
                            Choose Ears
                        </button>
                        <button
                            class="btn btn-primary me-1 mb-xs-1"
                            @click="changeEars"
                        >
                            Change Ears
                        </button>
                        <button class="btn btn-danger" @click="removeEars">
                            Remove Ears
                        </button>
                    </div>
                    <br />
                    <h4>Elytra</h4>
                    <div class="form-check form-switch">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id="checkElytra"
                            @change="setElytra"
                            v-model="elytraValue"
                        />
                        <label class="form-check-label" for="checkElytra"
                            >Elytra</label
                        >
                    </div>
                </div>
                <hr />
                <div>
                    <h4>Premium</h4>
                    <div class="form-check form-switch">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id="checkGlint"
                            @change="setGlint"
                            v-model="glintValue"
                        />
                        <label class="form-check-label" for="checkGlint"
                            >Glint</label
                        >
                    </div>
                    <div class="form-check form-switch">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id="checkDinnerbone"
                            @change="setDinnerbone"
                            v-model="dinnerboneValue"
                        />
                        <label class="form-check-label" for="checkDinnerbone"
                            >Dinnerbone</label
                        >
                    </div>
                </div>
            </div>
        </div>
        <hr />
        <div class="text-center">
            Created by
            <a target="_blank" href="https://github.com/james090500"
                >James Harrison</a
            >
            for
            <a target="_blank" href="https://minecraftcapes.net"
                >MinecraftCapes</a
            >
            <br />
            <a
                target="_blank"
                href="https://github.com/minecraftcapes/minecraft-skin-viewer"
                >View us on GitHub</a
            >
        </div>
    </div>
</template>

<style>
canvas {
    width: 100%;
    height: 60vh;
    display: block;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEUgIDAcHCq70aXDAAAAE0lEQVQI12P4/5+BgZoEA3VNBADtvT/BrQ+bEwAAAABJRU5ErkJggg==');
    background-repeat: repeat;
}
</style>

<script>
import axios from 'axios'
import MinecraftSkinViewer from '../src/main.js'

export default {
    data() {
        return {
            error: null,
            username: 'MiniPixie',
            minecraftSkinViewer: null,
            elytraValue: false,
            glintValue: false,
            dinnerboneValue: false,
        }
    },
    mounted() {
        this.minecraftSkinViewer = new MinecraftSkinViewer({
            canvas: document.getElementById('minecraft-skin-viewer'),
        })
    },
    unmounted() {
        this.minecraftSkinViewer.destroy()
    },
    methods: {
        async changeUser() {
            try {
                const mcapi = await axios.get(
                    `https://api.minecraftapi.net/v3/profile/${this.username}`
                )
                this.error = null
                this.minecraftSkinViewer.loadSkin(mcapi.data.skin.url)
                axios
                    .get(
                        `https://api.minecraftcapes.net/profile/${mcapi.data.uuid}`
                    )
                    .then((response) => {
                        this.glintValue = response.data.capeGlint
                        this.dinnerboneValue = response.data.upsideDown

                        this.minecraftSkinViewer.loadCape(
                            response.data.textures.cape
                        )
                        this.minecraftSkinViewer.loadEars(
                            response.data.textures.ears
                        )
                        this.minecraftSkinViewer.setGlint(this.glintValue)
                        this.minecraftSkinViewer.setDinnerbone(
                            this.dinnerboneValue
                        )
                    })
            } catch {
                this.error = 'User was not found'
            }
        },
        uploadSkin() {
            const file = this.$refs.skinFile.files[0]
            const url = URL.createObjectURL(file)
            this.minecraftSkinViewer.loadSkin(url)
            this.$refs.skinFile.value = null
        },
        changeSkin() {
            this.minecraftSkinViewer.loadSkin('/skins/skin.png')
        },
        removeSkin() {
            this.minecraftSkinViewer.loadSkin(null)
        },
        uploadCape() {
            const file = this.$refs.capeFile.files[0]
            const url = URL.createObjectURL(file)
            this.minecraftSkinViewer.loadCape(url)
            this.$refs.capeFile.value = null
        },
        changeStaticCape() {
            this.minecraftSkinViewer.loadCape('/capes/cape.png')
        },
        changeAnimatedCape() {
            this.minecraftSkinViewer.loadCape('/capes/cape-animated.png')
        },
        removeCape() {
            this.minecraftSkinViewer.loadCape(null)
        },
        uploadEars() {
            const file = this.$refs.earFile.files[0]
            const url = URL.createObjectURL(file)
            this.minecraftSkinViewer.loadEars(url)
            this.$refs.earFile.value = null
        },
        changeEars() {
            this.minecraftSkinViewer.loadEars('/ears/ears.png')
        },
        removeEars() {
            this.minecraftSkinViewer.loadEars(null)
        },
        setAutoRotate() {
            this.minecraftSkinViewer.controls.autoRotate =
                !this.minecraftSkinViewer.controls.autoRotate
            this.minecraftSkinViewer.controls.autoRotateSpeed = 10
        },
        setElytra(value) {
            this.minecraftSkinViewer.setElytra(value.target.checked)
        },
        setDinnerbone(value) {
            this.minecraftSkinViewer.setDinnerbone(value.target.checked)
        },
        setGlint(value) {
            this.minecraftSkinViewer.setGlint(value.target.checked)
        },
    },
}
</script>
