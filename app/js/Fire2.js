"use strict"
import "../utils/OrbitControls"
import "../utils/FireShader"
import "../utils/FireLib"

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
        this.init()
    }

    init() {
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

        // Time
        this.clock = new THREE.Clock()

        // Meshes
        let fireTex = new THREE.TextureLoader().load(
            "/app/assets/textures/fire2.png"
        )
        this.fire = new THREE.Fire(fireTex)

        this.scene.add(this.fire)

        // Animations
        this.update()
    }

    update() {
        let deltaTime = this.clock.getDelta()
        let time = this.clock.elapsedTime

        this.fire.update(time)

        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.update.bind(this))
    }
}
