// Libs
import "../utils/OrbitControls"
import "../utils/OBJLoader"
import * as dat from "../utils/DatGui"

// Classes
import Fire from "./Fire"
import Tornado from "./Tornado"
import Constants from "../utils/constants"

export default class App {
    constructor() {
        // Scene
        this.scene = new THREE.Scene()

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        )
        this.camera.position.set(0, 0, 30)

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("canvas"),
            antialias: true
        })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        // Controls
        new THREE.OrbitControls(this.camera, document.querySelector("canvas"))

        // Scene variables
        this.modelsArr = []
        this.texturesArr = []

        // Load all scene elements
        this.loadElements()
    }

    loadElements() {
        Promise.all([
            this.loadModel("/app/assets/models/model.obj", "model"),
            this.loadTexture("/app/assets/textures/fire.png", "fireTexture"),
            this.loadTexture("/app/assets/textures/flake-1.png","flake1Texture"),
            this.loadTexture("/app/assets/textures/flake-2.png","flake2Texture"),
            this.loadTexture("/app/assets/textures/flake-3.png","flake3Texture")
        ]).then(() => {
            this.launchScene()
        })
    }

    loadModel(path, id) {
        return new Promise((resolve, reject) => {
            new THREE.OBJLoader().load(path, model => {
                this.modelsArr[id] = model
                resolve()
            })
        })
    }

    loadTexture(path, id) {
        return new Promise((resolve, reject) => {
            new THREE.TextureLoader().load(path, texture => {
                this.texturesArr[id] = texture
                resolve()
            })
        })
    }

    launchScene() {
        console.log("Assets chargées")

        // Helpers
        let axesHelper = new THREE.AxesHelper(10)
        this.scene.add(axesHelper)

        // Lights
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)

        let pointLight = new THREE.PointLight(0x00ffff, 1, 20)
        pointLight.position.set(0, 10, 0)
        this.scene.add(pointLight)

        let pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
        this.scene.add(pointLightHelper)

        // Timer
        this.clock = new THREE.Clock()
        this.currentTime = 0
        this.lastTime = 0

        // MESHES
        // Model
        // this.scene.add(this.modelsArr.model)

        // Fire
        this.fire = new Fire(this.texturesArr.fireTexture)
        this.scene.add(this.fire)

        // Tornado
        this.tornado = new Tornado([
            this.texturesArr.flake1Texture,
            this.texturesArr.flake2Texture,
            this.texturesArr.flake3Texture
        ])
        this.scene.add(this.tornado)

        // GUI
        const gui = new dat.GUI()

        let guiFire = gui.addFolder("Fire")
        guiFire.add(this.fire.scale, "x", 0, 20)
        guiFire.add(this.fire.scale, "y", 0, 20)
        guiFire.add(this.fire.scale, "z", 0, 20)
        guiFire.open()

        let guiTornado = gui.addFolder("Tornado")
        guiTornado.add(Constants.tornado, "size", 0, 20)
        guiTornado.add(Constants.tornado, "angle", 0, 2 * Math.PI)
        guiTornado.add(Constants.tornado, "rotationRadius", 0, 5)
        guiTornado.add(Constants.tornado, "rotationSpeed", -10, 10)
        guiTornado.open()

        let guiFlakes = gui.addFolder("Flakes")
        guiFlakes.add(Constants.flakes, "size", 0, 2)
        guiFlakes.add(Constants.flakes, "rotationSpeed", -10, 10)
        guiFlakes.add(Constants.flakes, "verticalSpeed", 0, 0.1)
        guiFlakes.add(Constants.flakes, "creationSpeed", 0, 2)
        guiFlakes.open()

        // Listeners
        window.addEventListener("resize", this.onWindowResize.bind(this), false)
        this.onWindowResize()

        // Update loop
        this.update()
    }

    update() {
        // Get current time
        this.clock.getDelta()
        this.currentTime = this.clock.elapsedTime

        // Update all elements
        this.tornado.update(this.currentTime)
        this.fire.animate(this.currentTime)

        // Render scene
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.update.bind(this))
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
}
