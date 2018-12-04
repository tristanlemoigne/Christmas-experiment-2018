// Libs
import "../utils/OrbitControls"
import "../utils/OBJLoader"

// Classes
import Fire from "./Fire"

class Flake {
    constructor(size, texture) {
        this.size = size
        this.texture = texture
    }

    draw() {
        let geometry = new THREE.Geometry()
        geometry.vertices.push(new THREE.Vector3())
        let material = new THREE.PointsMaterial({
            transparent: true,
            size: this.size,
            // map: this.texture
        })
        // material.needsUpdate = true

        let point = new THREE.Points(geometry, material)
        return point
    }
}

class Tornado{
    constructor(circlesCount){
        this.circlesCount = circlesCount
    }

    draw(size, texture){
        let tornado = new THREE.Group()
        let radius = 0
        let flakesCount = 4

        // Draw one circle
        for(let circle = 0; circle < this.circlesCount; circle++){
            for(let angle = 0; angle < 2 * Math.PI; angle += 2 * Math.PI / flakesCount){
                let position = {
                    x: Math.cos(angle) * radius,
                    y: radius,
                    z: Math.sin(angle) * radius,
                }

                let flake = new Flake(size, texture).draw()
                flake.position.copy(position)
                console.log(App.flakesArr)
                // App.flakesArr.push(flake)
                tornado.add(flake)
            }

            radius+=2
            flakesCount *= 2
        }


        return tornado
    }
}

export default class App {
    static getRandom(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min +1)) + min;
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
        App.flakesArr = "flakesarr"

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

        // MESHES
        // Model
        // this.scene.add(this.modelsArr.model)

        // Fire
        // this.fire = new Fire(this.texturesArr.fireTexture).draw()
        // this.scene.add(this.fire)

        // Flakes
        this.tornado = new Tornado(4).draw(.5, this.texturesArr.flake1Texture)
        this.scene.add(this.tornado)

        // Listeners
        window.addEventListener("resize", this.onWindowResize.bind(this), false)
        this.onWindowResize()

        // Update loop
        this.update()
    }

    update() {
        this.clock.getDelta()
        this.time = this.clock.elapsedTime

        // this.flakesArr.forEach(flake => {
        //     console.log(flake)
        // })
        // this.fire.update(this.time)
        // this.flake.rotation.y += 1


        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.update.bind(this))
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
}

// SPIRALE
// for (i=0; i< 720; i++) {
//     angle = 0.1 * i;
//     x=(1+angle)*Math.cos(angle);
//     y=(1+angle)*Math.sin(angle);
//     context.lineTo(x, y);
//   }
