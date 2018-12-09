// Libs
import "../utils/OrbitControls"
import "../utils/OBJLoader"
import * as Constants from "../utils/constants"
import * as dat from "../utils/DatGui"

// Classes
import Snow from "./Snow"
import Fire from "./Fire"
import Tornado from "./Tornado"
import VolumetricFire from "./VolumetricFire"

let INTERSECTED

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
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFShadowMap

        // Controls
        this.controls = new THREE.OrbitControls(
            this.cameraTest,
            document.querySelector("canvas")
        )
        this.controls.target = new THREE.Vector3(0, 2, 0)

        // Raycaster
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.canClick = false

        // Scene variables
        this.modelsArr = []
        this.texturesArr = []
        this.flamesArr = []
        this.tornadosArr = []
        this.musicsArr = []

        // Load all scene elements
        this.loadElements()
    }

    loadElements() {
        Promise.all([
            this.loadModel("/app/assets/models/model2.obj", "model"),
            this.loadMusic("/app/assets/musics/song.mp3", "song"),
            this.loadTexture("/app/assets/textures/spirale.jpg", "spirale"),
            this.loadTexture("/app/assets/textures/fire.png", "fireTexture"),
            this.loadTexture("/app/assets/textures/bump.jpg", "bumpMap"),
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
                "/app/assets/textures/flake-4.png",
                "flake4Texture"
            ),
            this.loadTexture(
                "/app/assets/textures/flake-5.png",
                "flake5Texture"
            ),
            this.loadTexture(
                "/app/assets/textures/flake-6.png",
                "flake6Texture"
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
            // console.log("Assets chargées")
            const loader = document.querySelector(".loader")
            loader.style.display = "none"

            const startButton = document.querySelector(".startButton")
            startButton.addEventListener("click", this.launchScene.bind(this))
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

    loadMusic(path, id) {
        return new Promise((resolve, reject) => {
            var listener = new THREE.AudioListener()
            this.camera.add(listener)

            // create a global audio source
            var sound = new THREE.Audio(listener)

            new THREE.AudioLoader().load(path, buffer => {
                sound.setBuffer(buffer)
                sound.setLoop(true)
                this.musicsArr[id] = sound
                resolve()
            })
        })
    }

    generateTornados() {
        for (
            let i = 0, positionAngle = 0;
            i < 2;
            i++, positionAngle += Math.PI
        ) {
            let texturesArr
            let flakeRotationSpeed

            if (i === 0) {
                texturesArr = [
                    this.texturesArr.flake1Texture,
                    this.texturesArr.flake2Texture,
                    this.texturesArr.flake3Texture
                ]
                flakeRotationSpeed = 1
            } else {
                texturesArr = [
                    this.texturesArr.flake4Texture,
                    this.texturesArr.flake5Texture,
                    this.texturesArr.flake6Texture
                ]
                flakeRotationSpeed = 2.5
            }

            let tornado = new Tornado(
                texturesArr,
                positionAngle,
                flakeRotationSpeed
            )

            tornado.position.y = 1.45
            this.tornadosArr.push(tornado)
        }
    }

    generateFlames() {
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

            this.flamesArr.push(fire)
        }
    }

    startTornados() {
        this.tornadosStartTime = this.tornadosClock.getElapsedTime()

        this.generateTornados()
        this.tornadosArr.forEach(tornado => {
            this.sphere.add(tornado)
        })
    }

    stopTornados() {
        this.tornadosArr.forEach(tornado => {
            this.sphere.remove(tornado)
        })
        this.tornadosArr = []
    }

    startFire() {
        this.generateFlames()
        this.flamesArr.forEach(flame => {
            this.sphere.add(flame)
        })

        this.volumetricFire = new VolumetricFire(this.texturesArr.fireTexture)
        this.volumetricFire.position.y = 2.65
        this.volumetricFire.scale.set(0.7, 0.7, 0.7)
        this.sphere.add(this.volumetricFire)
    }

    stopFire() {
        this.flamesArr.forEach(flame => {
            this.sphere.remove(flame)
        })
        this.flamesArr = []
        this.sphere.remove(this.volumetricFire)
    }

    startLevitation() {
        this.levitationStartTime = this.levitationClock.getElapsedTime()

        this.levitation = true
        this.sphere.maxPosition = 0.8
        this.canLevitate = false
        this.musicsArr.song.play()
    }

    stopLevitation() {
        this.levitation = false
        this.sphere.minPosition = 0
        this.musicsArr.song.stop()
    }

    launchScene() {
        const explications = document.querySelector(".explications")
        explications.style.display = "none"

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

        let pointLight = new THREE.PointLight(0xffffff, 1, 90)
        pointLight.position.set(15, 30, 30)
        pointLight.castShadow = true
        pointLight.shadow.mapSize.width = 2048
        pointLight.shadow.mapSize.height = 2048
        pointLight.shadow.radius = 3
        this.scene.add(pointLight)

        let pointLight2 = new THREE.PointLight(0xffffff, 1, 25)
        pointLight2.position.set(0, 20, 0)
        this.scene.add(pointLight2)

        let pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
        this.scene.add(pointLightHelper)

        // Timer
        this.clock = new THREE.Clock()
        this.tornadosClock = new THREE.Clock()
        this.levitationClock = new THREE.Clock()
        this.currentTime = 0

        // Cube camera
        let cubeCamera = new THREE.CubeCamera(1, 1000, 256)
        cubeCamera.renderTarget.texture.minFilter =
            THREE.LinearMipMapLinearFilter
        cubeCamera.update(this.renderer, this.scene)

        // MESHES
        // Sphere
        this.sphere = new THREE.Group()
        let sphereElements = this.modelsArr.model.children.slice(
            Math.max(this.modelsArr.model.children.length - 4, 1)
        )

        sphereElements.forEach(element => {
            this.sphere.add(element)
        })

        this.sphere.traverse(child => {
            if (child instanceof THREE.Mesh) {
                if (child.name === "Sphere") {
                    child.material = new THREE.MeshStandardMaterial({
                        transparent: true,
                        opacity: 0.4,
                        metalness: 0.8,
                        roughness: 0,
                        emissive: 0xffffff,
                        emissiveIntensity: 0.3,
                        envMap: cubeCamera.renderTarget.texture,
                        depthWrite: false
                    })

                    child.castShadow = true
                }

                if (child.name === "Palissade") {
                    child.material.map = this.texturesArr.spirale
                }

                if (child.name === "Armature" || child.name === "Capuchon") {
                    child.material = new THREE.MeshPhongMaterial({
                        color: 0xb38e41,
                        envMap: cubeCamera.renderTarget.texture,
                        combine: THREE.MixOperation,
                        reflectivity: 0,
                        specular: 0xeee8aa,
                        shininess: 40,
                        emissive: 0xffffff,
                        emissiveIntensity: 0.06
                    })
                }
            }
        })
        this.scene.add(this.sphere)

        // Socle
        this.socle = this.modelsArr.model
        this.socle.traverse(child => {
            if (child instanceof THREE.Mesh) {
                if (child.name === "Socle") {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x5b5855,
                        roughness: 0.6,
                        metalness: 0.3
                    })
                    child.receiveShadow = true
                }
            }
        })

        // Param pusher buttons
        this.pushers = [
            this.socle.children[3],
            this.socle.children[6],
            this.socle.children[9]
        ]

        this.pushers[0].onStart = this.startTornados.bind(this)
        this.pushers[0].onStop = this.stopTornados.bind(this)
        this.pushers[1].onStart = this.startFire.bind(this)
        this.pushers[1].onStop = this.stopFire.bind(this)
        this.pushers[2].onStart = this.startLevitation.bind(this)
        this.pushers[2].onStop = this.stopLevitation.bind(this)

        this.pushers.forEach(pusher => {
            pusher.material = new THREE.MeshPhongMaterial({
                color: 0xff1212,
                transparent: true,
                opacity: 0.9,
                emissive: 0xffffff,
                emissiveIntensity: 0
            })
            pusher.canClick = false
        })

        this.scene.add(this.socle)

        // Snow
        const snow = new Snow(this.texturesArr.snowNormals)

        snow.receiveShadow = true
        snow.rotation.x = Math.PI / 2
        this.scene.add(snow)

        // Flames
        // this.startFire()
        // this.startTornados()
        // this.startLevitation()

        // GUI
        // const gui = new dat.GUI()

        // let guiTornado = gui.addFolder("Tornado")
        // guiTornado.add(Constants.tornado, "size", 0, 2)
        // guiTornado.add(Constants.tornado, "angle", 0, 2 * Math.PI)
        // guiTornado.add(Constants.tornado, "rotationRadius", 0, 0.8)
        // guiTornado.add(Constants.tornado, "rotationSpeed", -10, 10)
        // guiTornado.open()

        // let guiFlakes = gui.addFolder("Flakes")
        // guiFlakes.add(Constants.flakes, "size", 0, 0.3)
        // guiFlakes.add(Constants.flakes, "rotationSpeed", -1, 1)
        // guiFlakes.add(Constants.flakes, "verticalSpeed", 0, 0.003)
        // guiFlakes.add(Constants.flakes, "creationSpeed", 0, 0.5)
        // guiFlakes.open()

        // Listeners
        window.addEventListener("mousemove", this.onMouseMove.bind(this), false)
        window.addEventListener("click", this.onMouseClick.bind(this), false)
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
        if (this.flamesArr.length > 0) {
            this.volumetricFire.animate(this.currentTime)

            this.flamesArr.forEach(flame => {
                flame.update(this.currentTime, deltaTime)
            })
        }

        if (this.tornadosArr.length > 0) {
            this.tornadosClock.getDelta()
            this.tornadosCurrentTime =
                this.tornadosClock.elapsedTime - this.tornadosStartTime

            this.tornadosArr.forEach(tornado => {
                tornado.update(this.tornadosCurrentTime)
            })
        }

        // Sphere levitation
        if (this.levitation) {
            this.levitationClock.getDelta()
            this.levitationCurrentTime =
                this.levitationClock.elapsedTime - this.levitationStartTime
            this.sphere.rotation.y += 0.005

            if (
                this.sphere.position.y < this.sphere.maxPosition &&
                !this.canLevitate
            ) {
                this.sphere.position.y += 0.005
            } else {
                this.canLevitate = true
                this.sphere.position.y +=
                    Math.sin(this.levitationCurrentTime) * 0.005
            }
        } else {
            if (this.sphere.position.y > this.sphere.minPosition) {
                this.sphere.position.y -= 0.005
            }
        }

        // Socle interactions
        this.raycaster.setFromCamera(this.mouse, this.cameraTest)
        let intersects = this.raycaster.intersectObjects(this.pushers)

        // for (var i = 0; i < intersects.length; i++) {
        if (intersects.length > 0) {
            if (intersects[0].object != INTERSECTED) {
                this.renderer.domElement.style.cursor = "pointer"
                // restore previous intersection object (if it exists) to its original color
                if (INTERSECTED) {
                    INTERSECTED.currentHex = INTERSECTED.material.color.getHex()
                    INTERSECTED.material.color.setHex(INTERSECTED.currentHex)
                }

                // store reference to closest object as current intersection object
                // store color of closest object (for later restoration)
                // set a new color for closest object
                INTERSECTED = intersects[0].object
                INTERSECTED.canClick = true
                INTERSECTED.material.emissiveIntensity = 0.2
            }
        } else {
            // restore previous intersection object (if it exists) to its original color
            if (INTERSECTED) {
                INTERSECTED.canClick = false
                INTERSECTED.material.color.set(INTERSECTED.currentHex)
                INTERSECTED.material.emissiveIntensity = 0
                this.renderer.domElement.style.cursor = "auto"
            }

            // remove previous intersection object reference by setting current intersection object to "nothing"
            INTERSECTED = null
        }

        // Render scene
        this.renderer.render(this.scene, this.cameraTest)
        requestAnimationFrame(this.update.bind(this))
    }

    onMouseClick() {
        this.pushers.forEach(pusher => {
            if (pusher.canClick) {
                if (pusher.position.z === 0) {
                    pusher.position.z -= 0.05
                    pusher.material.color.setHex(0x00ff00)
                    pusher.onStart()
                } else {
                    pusher.position.z += 0.05
                    pusher.material.color.setHex(0xff1212)
                    pusher.onStop()
                }
            }
        })
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
}
