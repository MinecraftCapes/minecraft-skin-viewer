import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class MinecraftSkinViewer {
    constructor(options) {
        this.canvas = options.canvas;
        this.width = options.width;
        this.height = options.height;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.canvas.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();

        //Setup the model
        this.setupModel()

        this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 90;

        // Controls
        this.controls = new OrbitControls( this.camera, this.renderer.domElement )

        // Bind the animate method to ensure the correct context
        this.animate = this.animate.bind(this);

        // Start the animation loop
        this.animate();
    }
    setupModel() {
        const bodyGeometry = [];
        const earGeometry = [];

        let createCube = (width, height, depth, position, value) => {
            let cubeGeometry = new THREE.BoxGeometry(width, height, depth);
            cubeGeometry.translate(position.x, position.y, position.z);
            value.push(cubeGeometry);
        }

        //Body
        createCube(8, 8, 8, new THREE.Vector3(0, 10, 0), bodyGeometry) //Heady
        createCube(8, 12, 4, new THREE.Vector3(0, 0, 0), bodyGeometry) //Body
        createCube(4, 12, 4, new THREE.Vector3(-6, 0, 0), bodyGeometry) //Right Arm
        createCube(4, 12, 4, new THREE.Vector3(6, 0, 0), bodyGeometry) //Left Arm
        createCube(4, 12, 4, new THREE.Vector3(-2, -12, 0), bodyGeometry) //Right Leg
        createCube(4, 12, 4, new THREE.Vector3(2, -12, 0), bodyGeometry) //Left Leg

        //Ears
        createCube(6, 6, 1, new THREE.Vector3(6, 15, 0), earGeometry) //Right Ear
        createCube(6, 6, 1, new THREE.Vector3(-6, 15, 0), earGeometry) //Right Ear

        //Cape
        let capeGeometry = new THREE.BoxGeometry(10, 16, 1);

        // Positive Z (front)
        // Negative Z (back)
        // Positive Y (top)
        // Negative Y (bottom)
        // Positive X (right)
        // Negative X (left)

        const uvAttribute  = capeGeometry.getAttribute( 'uv' );

        // uvs[0] = 8 / 64; uvs[1] = 16 / 64;  // Bottom-left
        // uvs[2] = 16 / 64; uvs[3] = 16 / 64;  // Bottom-right
        // uvs[4] = 8 / 64; uvs[5] = 8 / 64;   // Top-left
        // uvs[6] = 16 / 64; uvs[7] = 16 / 64;  // Bottom-right
        // uvs[8] = 16 / 64; uvs[9] = 8 / 64;   // Top-right
        // uvs[10] = 8 / 64; uvs[11] = 8 / 64;  // Top-left

        //FRONT
        //https://discourse.threejs.org/t/facevertexuvs-for-buffergeometry/23040/11
        const index = capeGeometry.getIndex();
        uvAttribute.setXY(index.getX(0), 1 / 64, 16 / 32 );
        uvAttribute.setXY(index.getX(1), 10 / 64, 16 / 32 );
        uvAttribute.setXY(index.getX(2), 1 / 64, 1 / 32 );
        uvAttribute.setXY(index.getX(3), 10 / 64, 16 / 32 );
        uvAttribute.setXY(index.getX(4), 10 / 64, 1 / 32 );
        uvAttribute.setXY(index.getX(5), 1 / 64, 1 / 32 );

        capeGeometry.translate(0, -3, -4);
        capeGeometry.rotateX(0.25)

        //Textures
        const loader = new THREE.TextureLoader();
        const skin = loader.load( 'skin.png' );
        const cape = loader.load( 'cape.png' );
        const ears = loader.load( 'ears.png' );

        // Merge all cube geometries into one
        this.bodyMesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(bodyGeometry), new THREE.MeshBasicMaterial({ map: skin,  }));
        this.earMesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(earGeometry), new THREE.MeshBasicMaterial({ map: ears }));
        this.capeMesh = new THREE.Mesh(capeGeometry, new THREE.MeshBasicMaterial({ map: cape }));

        /**
         * Add to scene
         */
        // this.scene.add(this.bodyMesh, this.earMesh, this.capeMesh);
        this.scene.add(this.capeMesh)
    }
    animate() {
        requestAnimationFrame(this.animate);

        this.controls.update();

        this.renderer.render(this.scene, this.camera);
    }
}

export default MinecraftSkinViewer