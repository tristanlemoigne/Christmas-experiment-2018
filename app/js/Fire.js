"use strict"
import "../utils/OrbitControls"

class FireMesh {
    constructor(size) {
        this.size = size
        this.color = 0xffffff
    }

    draw(alphaTexture) {
        let geometry = new THREE.PlaneGeometry(this.size, this.size, 32)
        let material = new THREE.MeshBasicMaterial({
            color: this.color,
            side: THREE.DoubleSide,
            transparent: true
            // alphaMap: alphaTexture
        })
        let plane = new THREE.Mesh(geometry, material)

        return plane
    }
}

export default class Fire {
    constructor() {
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("canvas"),
            antialias: true
        })

        // Scene
        this.scene = new THREE.Scene()

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )

        // Controls
        this.controls = new THREE.OrbitControls(this.camera)

        // Launch scene
        this.load()
    }

    load() {
        const textureLoader = new THREE.TextureLoader()
        this.alphaTexture = textureLoader.load(
            "/app/assets/textures/fire_alpha.gif"
        )
        this.noiseTexture = textureLoader.load(
            "/app/assets/textures/fire_grey.gif"
        )

        window.addEventListener("load", this.init.bind(this))
    }

    init() {
        console.log("Textures chargées !")
        // Settings
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.position.set(0, 0, 10)
        this.controls.update()

        // Lights
        let pointLight = new THREE.PointLight(0xffffff, 1, 200)
        pointLight.position.set(0, 50, 50)
        this.scene.add(pointLight)

        let ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)

        // Meshes
        this.fire = new FireMesh(1).draw(this.alphaTexture, this.noiseTexture)
        this.scene.add(this.fire)

        // Animations
        this.update()
    }

    update() {
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.update.bind(this))
    }
}
