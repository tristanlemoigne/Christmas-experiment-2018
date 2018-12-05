// Libs
import "../utils/OrbitControls"
import "../utils/OBJLoader"

// Classes
import Fire from "./Fire"

class Flake {
    constructor(creationTime, texture) {
        this.creationTime = creationTime
        this.texture = texture
        this.size = 1
        this.speed = 0.03
        this.tornadoAngle = Math.PI / 4
        Flake.tornadoSize = 10
        this.mesh = this.draw()
    }

    draw() {
        let geometry = new THREE.Geometry()
        geometry.vertices.push(new THREE.Vector3())
        let material = new THREE.PointsMaterial({
            transparent: true,
            size: this.size,
            map: this.texture
        })
        // material.needsUpdate = true

        let point = new THREE.Points(geometry, material)
        point.position.set(0, 0, 0)
        return point
    }

    update() {
        this.creationTime += this.speed
        let posY = this.mesh.position.y + 0.01
        let radius = posY * this.tornadoAngle
        let posX = radius * Math.cos(this.creationTime)
        let posZ = radius * Math.sin(this.creationTime)

        this.mesh.position.x = posX
        this.mesh.position.y = posY
        this.mesh.position.z = posZ
    }
}

class Tornado {
    constructor() {
        this.flakesCount = 10
        Tornado.angle = Math.PI / 4
    }

    draw(texture) {
        let tornado = new THREE.Group()

        for (let i = 0; i < this.flakesCount; i++) {
            let angle = App.getRandom(0, 2 * Math.PI)

            let position = {
                x: angle,
                y: 0,
                z: angle
            }

            let flake = new Flake(position, texture)
            App.flakesArr.push(flake)
            tornado.add(flake.mesh)
        }

        return tornado
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

        // Scene settings
        this.modelsArr = []
        this.texturesArr = []
        App.flakesArr = []

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

        // Flakes
        // this.tornado = new Tornado().draw(this.texturesArr.flake1Texture)
        // this.scene.add(this.tornado)

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
        if (this.currentTime >= this.lastTime + 1) {
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
            if (flake.mesh.position.y > Flake.tornadoSize) {
                this.scene.remove(flake.mesh)
                App.flakesArr.splice(flake.mesh, 1)
            } else {
                flake.update()
            }
        })

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
