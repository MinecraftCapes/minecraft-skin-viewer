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
        this.scene.add(new THREE.AmbientLight(0xffffff, 3))

        //Setup the model
        this.setupModel()

        this.camera = new THREE.PerspectiveCamera(30, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 90;
        // this.camera.add(new THREE.PointLight(0xffffff, 200));
    

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
        this.createUVMap(bodyGeometry[0], 0, 0, 8, 8, 8, 64, 64)

        createCube(8, 12, 4, new THREE.Vector3(0, 0, 0), bodyGeometry) //Body
        this.createUVMap(bodyGeometry[1], 16, 16, 8, 12, 4, 64, 64)
        
        createCube(4, 12, 4, new THREE.Vector3(-6, 0, 0), bodyGeometry) //Right Arm
        this.createUVMap(bodyGeometry[2], 40, 16, 4, 12, 4, 64, 64)
        
        createCube(4, 12, 4, new THREE.Vector3(6, 0, 0), bodyGeometry) //Left Arm
        this.createUVMap(bodyGeometry[3], 32, 48, 4, 12, 4, 64, 64)
        
        createCube(4, 12, 4, new THREE.Vector3(-2, -12, 0), bodyGeometry) //Right Leg
        this.createUVMap(bodyGeometry[4], 0, 16, 4, 12, 4, 64, 64)
        
        createCube(4, 12, 4, new THREE.Vector3(2, -12, 0), bodyGeometry) //Left Leg
        this.createUVMap(bodyGeometry[5], 16, 48, 4, 12, 4, 64, 64)
    

        //Ears
        createCube(8, 8, 1, new THREE.Vector3(6, 15, 0), earGeometry) //Right Ear
        createCube(8, 8, 1, new THREE.Vector3(-6, 15, 0), earGeometry) //Right Ear
        this.createUVMap(earGeometry[0], 0, 0, 6, 6, 1, 14, 7)
        this.createUVMap(earGeometry[1], 0, 0, 6, 6, 1, 14, 7)

        //Cape
        let capeGeometry = new THREE.BoxGeometry(10, 16, 1);
        capeGeometry.translate(0, -3, 4);
        this.createUVMap(capeGeometry, 0, 0, 10, 16, 1, 64, 32)
        capeGeometry.rotateX(-0.25)
        capeGeometry.rotateY(THREE.MathUtils.degToRad(180))

        //Textures
        const loader = new THREE.TextureLoader();
        const skin = loader.load( 'steve.png' );
        const cape = loader.load( 'cape-map.png' );
        const ears = loader.load( 'ears.png' );

        skin.magFilter = THREE.NearestFilter
        cape.magFilter = THREE.NearestFilter
        ears.magFilter = THREE.NearestFilter
        skin.colorSpace = THREE.SRGBColorSpace
        cape.colorSpace = THREE.SRGBColorSpace
        ears.colorSpace = THREE.SRGBColorSpace

        // Merge all cube geometries into one
        this.bodyMesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(bodyGeometry), new THREE.MeshStandardMaterial({ map: skin,  }));
        this.earMesh = new THREE.Mesh(BufferGeometryUtils.mergeGeometries(earGeometry), new THREE.MeshStandardMaterial({ map: ears }));
        this.capeMesh = new THREE.Mesh(capeGeometry, new THREE.MeshStandardMaterial({ map: cape }));

        /**
         * Add to scene
         */
        this.scene.add(this.bodyMesh, this.earMesh, this.capeMesh);
    }
    createUVMap(geometry, startX, startY, width, height, depth, textureWidth, textureHeight) {
        const uvAttribute  = geometry.getAttribute( 'uv' );
        const index = geometry.getIndex();

        //Top Left, Bottom Left, Top Right, Bottom Left, Bottom Right, Top Right

        //Left
        uvAttribute.setXY(index.getX(0), (startX + width + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight );
        uvAttribute.setXY(index.getX(1), (startX + width + depth) / textureWidth, 1.0 - (startY + depth + height) / textureHeight );
        uvAttribute.setXY(index.getX(2), (startX + width + (depth * 2)) / textureWidth, 1.0 - (startY + depth) / textureHeight );
        uvAttribute.setXY(index.getX(3), (startX + width + depth) / textureWidth, 1.0 - (startY + depth + height) / textureHeight );
        uvAttribute.setXY(index.getX(4), (startX + width + (depth * 2)) / textureWidth, 1.0 - (startY + depth + height) / textureHeight );
        uvAttribute.setXY(index.getX(5), (startX + width + (depth * 2)) / textureWidth, 1.0 - (startY + depth) / textureHeight );

        //Right
        uvAttribute.setXY(index.getX(6), startX / textureWidth, 1.0 - (startY + depth) / textureHeight );
        uvAttribute.setXY(index.getX(7), startX / textureWidth, 1.0 - (startY + depth + height) / textureHeight );
        uvAttribute.setXY(index.getX(8), (startX + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight );
        uvAttribute.setXY(index.getX(9), startX / textureWidth, 1.0 - (startY + depth + height) / textureHeight );
        uvAttribute.setXY(index.getX(10), (startX + depth) / textureWidth, 1.0 - (startY + depth + height) / textureHeight );
        uvAttribute.setXY(index.getX(11), (startX + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight );

        //Top
        uvAttribute.setXY(index.getX(12), (startX + depth) / textureWidth, 1.0 - startY / textureHeight );
        uvAttribute.setXY(index.getX(13), (startX + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight );
        uvAttribute.setXY(index.getX(14), (startX + width + depth) / textureWidth, 1.0 - startY / textureHeight );
        uvAttribute.setXY(index.getX(15), (startX + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight );
        uvAttribute.setXY(index.getX(16), (startX + width + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight );
        uvAttribute.setXY(index.getX(17), (startX + width + depth) / textureWidth, 1.0 - startY / textureHeight );

        //Bottom
        uvAttribute.setXY(index.getX(18), (startX + depth + width) / textureWidth, 1.0 - startY / textureHeight );
        uvAttribute.setXY(index.getX(19), (startX + depth + width) / textureWidth, 1.0 - (startY + depth) / textureHeight );
        uvAttribute.setXY(index.getX(20), (startX + depth + (width * 2)) / textureWidth, 1.0 - startY / textureHeight );
        uvAttribute.setXY(index.getX(21), (startX + depth + width) / textureWidth, 1.0 - (startY + depth) / textureHeight );
        uvAttribute.setXY(index.getX(22), (startX + depth + (width * 2)) / textureWidth, 1.0 - (startY + depth) / textureHeight );
        uvAttribute.setXY(index.getX(23), (startX + depth + (width * 2)) / textureWidth, 1.0 - startY / textureHeight );

        //Front
        uvAttribute.setXY(index.getX(24), (startX + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight ); //top left
        uvAttribute.setXY(index.getX(25), (startX + depth) / textureWidth, 1.0 - (startY + height + depth) / textureHeight ); //bottom left
        uvAttribute.setXY(index.getX(26), (startX + width + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight ); //top right
        uvAttribute.setXY(index.getX(27), (startX + depth) / textureWidth, 1.0 - (startY + height + depth) / textureHeight ); //bottom left
        uvAttribute.setXY(index.getX(28), (startX + width + depth) / textureWidth, 1.0 - (startY + height + depth) / textureHeight ); //bottom right
        uvAttribute.setXY(index.getX(29), (startX + width + depth) / textureWidth, 1.0 - (startY + depth) / textureHeight ); //top right

        //Back
        uvAttribute.setXY(index.getX(30), (startX + (depth * 2 + width)) / textureWidth, 1.0 - (startY + depth) / textureHeight ); //top left
        uvAttribute.setXY(index.getX(31), (startX + (depth * 2 + width)) / textureWidth, 1.0 - (startY + height + depth) / textureHeight ); //bottom left
        uvAttribute.setXY(index.getX(32), (startX + (width * 2 + depth * 2)) / textureWidth, 1.0 - (startY + depth) / textureHeight ); //top right
        uvAttribute.setXY(index.getX(33), (startX + (depth * 2 + width)) / textureWidth, 1.0 - (startY + height + depth) / textureHeight ); //bottom left
        uvAttribute.setXY(index.getX(34), (startX + (width * 2 + depth * 2)) / textureWidth, 1.0 - (startY + height + depth) / textureHeight ); //bottom right
        uvAttribute.setXY(index.getX(35), (startX + (width * 2 + depth * 2)) / textureWidth, 1.0 - (startY + depth) / textureHeight ); //top right
    }
    animate() {
        requestAnimationFrame(this.animate);

        this.controls.update();

        this.renderer.render(this.scene, this.camera);
    }
}

export default MinecraftSkinViewer