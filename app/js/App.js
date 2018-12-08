// Libs
import "../utils/OrbitControls"
import "../utils/OBJLoader"
import * as dat from "../utils/DatGui"
import Constants from "../utils/constants"

// Classes
import Snow from "./Snow"
import Fire from "./Fire"
import Tornado from "./Tornado"
import SpritesAnimation from "./SpritesAnimation"
import { SSL_OP_TLS_ROLLBACK_BUG } from "constants"
import VolumetricFire from "./VolumetricFire"

export default class App {
    constructor() {
        // Scene
        this.scene = new THREE.Scene()

        // Original Camera
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            1,
            200
        )
        this.camera.position.set(-2, 4, 6)
        this.camera.lookAt(0, 2, 0)
        this.scene.add(this.camera)

        // Original camera helpers
        var helper = new THREE.CameraHelper(this.camera)
        this.scene.add(helper)

        // Camera test
        this.cameraTest = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            1,
            1000
        )
        this.cameraTest.position.set(0, 0, 20)
        this.scene.add(this.cameraTest)

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("canvas"),
            antialias: true
        })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        // this.renderer.sortObjects = false

        // Controls
        this.controls = new THREE.OrbitControls(
            this.cameraTest,
            document.querySelector("canvas")
        )
        this.controls.target = new THREE.Vector3(0, 2, 0)

        // Scene variables
        this.modelsArr = []
        this.texturesArr = []
        this.fireArr = []

        // Load all scene elements
        this.loadElements()
    }

    loadElements() {
        Promise.all([
            this.loadModel("/app/assets/models/model8.obj", "model"),
            this.loadTexture("/app/assets/textures/fire.png", "fireTexture"),
            this.loadTexture(
                "/app/assets/textures/fire-rgb.jpg",
                "fireSpritesheet"
            ),
            this.loadTexture(
                "/app/assets/textures/fire-alpha.jpg",
                "fireAlpha"
            ),
            this.loadTexture(
                "/app/assets/textures/flake-1.png",
                "flake1Texture"
            ),
            this.loadTexture(
                "/app/assets/textures/flake-2.png",
                "flake2Texture"
            ),
            this.loadTexture(
                "/app/assets/textures/flake-3.png",
                "flake3Texture"
            ),
            this.loadTexture(
                "/app/assets/textures/background.jpg",
                "background"
            ),
            this.loadTexture(
                "/app/assets/textures/snow-normals.jpg",
                "snowNormals"
            )
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
        // Adding scene background
        let sphereBackground = new THREE.Mesh(
            new THREE.SphereBufferGeometry(20, 32, 32),
            new THREE.MeshBasicMaterial({ map: this.texturesArr.background })
        )
        sphereBackground.geometry.scale(-1, 1, 1)
        sphereBackground.rotation.y = Math.PI / 2
        sphereBackground.position.y += 2
        this.scene.add(sphereBackground)

        // Helpers
        let axesHelper = new THREE.AxesHelper(10)
        this.scene.add(axesHelper)

        // Fog
        let fogColor = new THREE.Color(0x00003d)
        this.scene.fog = new THREE.Fog(fogColor, 0, 40)

        // Lights
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)

        let pointLight = new THREE.PointLight(0xffffff, 1, 50)
        pointLight.position.set(0, 20, 0)
        this.scene.add(pointLight)

        let pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
        this.scene.add(pointLightHelper)

        // Timer
        this.clock = new THREE.Clock()
        this.currentTime = 0
        this.lastTime = 0

        // this.deltaTime = 0
        // this.currentTime = 0
        // this.time = Date.now()
        // this.lastTime = Date.now()

        // Cube camera
        let cubeCamera = new THREE.CubeCamera(1, 1000, 256)
        cubeCamera.renderTarget.texture.minFilter =
            THREE.LinearMipMapLinearFilter

        // MESHES
        // Sphere
        let sphere = new THREE.Group()
        let sphereElements = this.modelsArr.model.children.slice(
            Math.max(this.modelsArr.model.children.length - 3, 1)
        )

        sphereElements.forEach(element => {
            sphere.add(element)
        })

        sphere.traverse(child => {
            if (child instanceof THREE.Mesh) {
                if (child.name === "Sphere") {
                    child.material = new THREE.MeshStandardMaterial({
                        transparent: true,
                        opacity: 0.4,
                        metalness: 0.4,
                        roughness: 0,
                        emissive: 0xffffff,
                        emissiveIntensity: 0.4,
                        envMap: cubeCamera.renderTarget.texture,
                        depthWrite: false
                    })

                    cubeCamera.update(this.renderer, this.scene)
                }
            }
        })

        sphere.position.y = 1
        this.scene.add(sphere)

        // Socle
        // this.modelsArr.model.traverse(child => {
        //     if (child instanceof THREE.Mesh) {
        //         if (child.name === "Socle") {
        //             child.geometry.verticesNeedUpdate = true
        //         }
        //     }
        // })

        this.scene.add(this.modelsArr.model)

        // Snow
        const snow = new Snow(this.texturesArr.snowNormals)
        snow.rotation.x = Math.PI / 2
        // this.scene.add(snow)

        // Flames
        for (
            let i = 0, rotation = Math.PI / 2;
            i < 4;
            i++, rotation += Math.PI / 2
        ) {
            let fire = new Fire(
                this.texturesArr.fireSpritesheet,
                this.texturesArr.fireAlpha
            )

            fire.scale.set(0.5, 0.5, 0.5)
            fire.position.y = 2.5
            fire.rotation.y = rotation
            fire.position.x = Math.cos(rotation) * 0.7
            fire.position.z = Math.sin(rotation) * 0.7

            this.fireArr.push(fire)
            sphere.add(fire)
        }

        // Volumetric fire
        this.volumetricFire = new VolumetricFire(this.texturesArr.fireTexture)
        this.volumetricFire.position.y = 2.65
        this.volumetricFire.scale.set(0.7, 0.7, 0.7)
        sphere.add(this.volumetricFire)

        // Tornado
        // this.tornado = new Tornado([
        //     this.texturesArr.flake1Texture,
        //     this.texturesArr.flake2Texture,
        //     this.texturesArr.flake3Texture
        // ])
        // this.scene.add(this.tornado)

        // GUI
        // const gui = new dat.GUI()

        // let guiFire = gui.addFolder("Fire")
        // guiFire.add(this.fire.position, "y", 2, 3)
        // guiFire.open()

        // let guiTornado = gui.addFolder("Tornado")
        // guiTornado.add(Constants.tornado, "size", 0, 20)
        // guiTornado.add(Constants.tornado, "angle", 0, 2 * Math.PI)
        // guiTornado.add(Constants.tornado, "rotationRadius", 0, 5)
        // guiTornado.add(Constants.tornado, "rotationSpeed", -10, 10)
        // guiTornado.open()

        // let guiFlakes = gui.addFolder("Flakes")
        // guiFlakes.add(Constants.flakes, "size", 0, 2)
        // guiFlakes.add(Constants.flakes, "rotationSpeed", -10, 10)
        // guiFlakes.add(Constants.flakes, "verticalSpeed", 0, 0.1)
        // guiFlakes.add(Constants.flakes, "creationSpeed", 0, 2)
        // guiFlakes.open()

        // Listeners
        window.addEventListener("resize", this.onWindowResize.bind(this), false)
        this.onWindowResize()

        // Update loop
        this.update()
    }

    update() {
        // Get current time
        let deltaTime = this.clock.getDelta()
        this.currentTime = this.clock.elapsedTime

        // Update all elements
        // this.tornado.update(this.currentTime)
        // this.fire.update(this.currentTime, deltaTime)
        this.volumetricFire.animate(this.currentTime)

        this.fireArr.forEach(fire => {
            fire.update(this.currentTime, deltaTime)
        })

        // Render scene
        this.renderer.render(this.scene, this.cameraTest)
        requestAnimationFrame(this.update.bind(this))
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
}
