// Libs
import "../utils/OrbitControls"
import "../utils/OBJLoader"
import * as dat from '../utils/DatGui'

// Classes
import Fire from "./Fire"

class Flake {
    constructor(creationTime, texture) {
        this.creationTime = creationTime
        this.texture = texture
        this.mesh = this.draw()
    }

    draw() {
        let geometry = new THREE.Geometry()
        geometry.vertices.push(new THREE.Vector3())
        let material = new THREE.PointsMaterial({
            transparent: true,
            size: App.options.flakeSize,
            map: this.texture
        })
        // material.needsUpdate = true

        let point = new THREE.Points(geometry, material)
        return point
    }

    update() {
        this.creationTime += App.options.flakeRotationSpeed
        let posY = this.mesh.position.y + App.options.flakeVerticalSpeed
        let radius = posY * App.options.tornadoAngle
        let posX = radius * Math.cos(this.creationTime) 
        let posZ = radius * Math.sin(this.creationTime)

        this.mesh.position.x = posX + App.tornadoPosition.x
        this.mesh.position.y = posY
        this.mesh.position.z = posZ + App.tornadoPosition.z

    }
}

export default class App {
    static getRandom(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

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
        this.camera.position.set(0, 0, 10)

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("canvas"),
            antialias: true
        })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        // Controls
        this.controls = new THREE.OrbitControls(this.camera)

        // Scene variables
        this.modelsArr = []
        this.texturesArr = []
        App.flakesArr = []
        App.tornadoPosition = {
            x: 0,
            y: 0,
            z: 0
        }

        // Scene constantes
        App.options = {
            flakeSize : 1,
            flakeRotationSpeed : 0.03,
            flakeVerticalSpeed: 0.004,
            flakeCreationSpeed : .5,
            tornadoAngle: Math.PI/6,
            tornadoHeight: 10,
            tornadoRadius: 0,
            tornadoSpeed: 1
        }

        // GUI
        this.gui = new dat.GUI({
            height : App.options.length * 32 - 1
        })

        this.gui.add(App.options, "flakeSize").min(0.1).max(1)
        this.gui.add(App.options, "flakeRotationSpeed").min(0.001).max(0.3)
        this.gui.add(App.options, "flakeVerticalSpeed").min(0.001).max(0.1)
        this.gui.add(App.options, "flakeCreationSpeed").min(0.1).max(2)
        this.gui.add(App.options, "tornadoAngle").min(0).max(2*Math.PI)
        this.gui.add(App.options, "tornadoHeight").min(0).max(20)
        this.gui.add(App.options, "tornadoRadius").min(0).max(10)
        this.gui.add(App.options, "tornadoSpeed").min(1).max(10)


        // Load all scene elements
        this.loadElements()
    }

    loadElements() {
        Promise.all([
            // this.loadModel("/app/assets/models/model.obj", "model"),
            // this.loadTexture("/app/assets/textures/fire2.png", "fireTexture")
            this.loadTexture(
                "/app/assets/textures/flake1.png",
                "flake1Texture"
            ),
            this.loadTexture(
                "/app/assets/textures/flake2.png",
                "flake2Texture"
            ),
            this.loadTexture("/app/assets/textures/flake3.png", "flake3Texture")
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
        // this.fire = new Fire(this.texturesArr.fireTexture).draw()
        // this.scene.add(this.fire)

        // Listeners
        window.addEventListener("resize", this.onWindowResize.bind(this), false)
        this.onWindowResize()

        // Update loop
        this.update()
    }

    update() {
        this.clock.getDelta()
        this.currentTime = this.clock.elapsedTime

        // Create new flake every seconds
        if (this.currentTime >= this.lastTime + App.options.flakeCreationSpeed) {
            let flake = new Flake(
                this.currentTime,
                this.texturesArr.flake1Texture
            )

            App.flakesArr.push(flake)
            this.scene.add(flake.mesh)

            this.lastTime = this.currentTime
        }

        // Update each flakes
        App.flakesArr.forEach(flake => {
            if (flake.mesh.position.y > App.options.tornadoHeight) {
                this.scene.remove(flake.mesh)
                App.flakesArr.splice(flake.mesh, 1)
            } else {
                flake.update()
            }
        })

        // Update tornado position
        App.tornadoPosition = {
            x: Math.cos(this.currentTime * App.options.tornadoSpeed) * App.options.tornadoRadius,
            y: 0,
            z: Math.sin(this.currentTime * App.options.tornadoSpeed) * App.options.tornadoRadius
        }


        // this.fire.update(this.time)
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.update.bind(this))
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
}
