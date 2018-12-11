// Libs
import "../utils/OrbitControls"
import "../utils/OBJLoader"

// Classes
import Snow from "./Snow"
import Fire from "./Fire"
import Tornado from "./Tornado"
import VolumetricFire from "./VolumetricFire"
import Sphere from "./Sphere"
import Socle from "./Socle"
import SnowWind from "./SnowWind"

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
        // ARRIVE
        this.camera.position.set(-6, 2, 30)
        this.cameraLookAt = new THREE.Vector3(0, 3, 0)
        this.camera.lookAt(this.cameraLookAt)
        this.camera.canTravelling = true
        this.scene.add(this.camera)

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
        this.renderer.sortObjects = false

        // Timer
        this.clock = new THREE.Clock()
        this.tornadosClock = new THREE.Clock()
        this.levitationClock = new THREE.Clock()
        this.currentTime = 0

        // Controls
        this.controls = new THREE.OrbitControls(
            this.camera,
            document.querySelector("canvas")
        )
        this.controls.target = this.cameraLookAt
        this.controls.enableDamping = true
        // Scroll limit
        this.controls.minDistance = 3
        this.controls.maxDistance = 10

        // Rotation limit
        this.controls.minPolarAngle = 0
        this.controls.maxPolarAngle = Math.PI / 2
        this.controls.enablePan = false

        // Scene variables
        this.modelsArr = []
        this.texturesArr = []
        // this.flamesArr = []
        this.tornadosArr = []
        this.musicsArr = []

        // Song
        this.volume = 0
        this.volumetricScale = 0.01
        this.flakeOpacity = 0
        this.removeTornado = true

        // Load all scene elements
        this.loadElements()
    }

    loadElements() {
        Promise.all([
            this.loadModel("./assets/models/model.obj", "model"),
            this.loadMusic("./assets/musics/song.mp3", "song"),
            this.loadTexture("./assets/textures/spirale.jpg", "spirale"),
            this.loadTexture("./assets/textures/fire.png", "fireTexture"),
            this.loadTexture("./assets/textures/bump.jpg", "bumpMap"),
            this.loadTexture(
                "./assets/textures/fire-rgb.jpg",
                "fireSpritesheet"
            ),
            this.loadTexture("./assets/textures/fire-alpha.jpg", "fireAlpha"),
            this.loadTexture("./assets/textures/flake-1.png", "flake1Texture"),
            this.loadTexture("./assets/textures/flake-2.png", "flake2Texture"),
            this.loadTexture("./assets/textures/flake-3.png", "flake3Texture"),
            this.loadTexture("./assets/textures/flake-4.png", "flake4Texture"),
            this.loadTexture("./assets/textures/flake-5.png", "flake5Texture"),
            this.loadTexture("./assets/textures/flake-6.png", "flake6Texture"),
            this.loadTexture("./assets/textures/flake-6.png", "flake6Texture"),
            this.loadTexture(
                "./assets/textures/snowParticle.png",
                "snowParticle"
            ),
            this.loadTexture(
                "./assets/textures/background-sky.jpg",
                "backgroundSky"
            ),
            this.loadTexture(
                "./assets/textures/background-stars.png",
                "backgroundStars"
            ),
            this.loadTexture(
                "./assets/textures/background-mountains.png",
                "backgroundMountains"
            ),
            this.loadTexture(
                "./assets/textures/snow-normals.jpg",
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
            let listener = new THREE.AudioListener()
            this.camera.add(listener)

            // create a global audio source
            this.sound = new THREE.Audio(listener)

            new THREE.AudioLoader().load(path, buffer => {
                this.sound.setBuffer(buffer)
                this.musicsArr[id] = this.sound
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

    generateSnow() {
        const snow = new Snow(this.texturesArr.snowNormals)
        snow.receiveShadow = true
        snow.rotation.x = Math.PI / 2
        this.scene.add(snow)
    }

    startTornados() {
        this.tornadosStartTime = this.tornadosClock.getElapsedTime()

        // this.generateTornados()
        this.removeTornado = false
        // this.tornadosArr.forEach(tornado => {
        //     this.sphere.add(tornado)
        // })
    }

    stopTornados() {
        this.removeTornado = true
        // this.tornadosArr.forEach(tornado => {
        //     this.sphere.remove(tornado)
        // })
        // this.tornadosArr = []
    }

    startFire() {
        // this.generateFlames()
        // this.flamesArr.forEach(flame => {
        //     this.sphere.add(flame)
        // })
        // this.volumetricFire = new VolumetricFire(this.texturesArr.fireTexture)
        // this.volumetricFire.position.y = 2.9
        // this.volumetricFire.scale.set(1.3, 1.3, 1.3)
        // this.removeVolumetricFire = false
        // this.sphere.add(this.volumetricFire)
        this.removeVolumetricFire = false
    }

    stopFire() {
        // this.flamesArr.forEach(flame => {
        //     this.sphere.remove(flame)
        // })
        // this.flamesArr = []
        this.removeVolumetricFire = true
        // this.sphere.remove(this.volumetricFire)
    }

    startLevitation() {
        this.levitationStartTime = this.levitationClock.getElapsedTime()
        this.canLevitate = true
    }

    stopLevitation() {
        this.canLevitate = false
    }

    launchScene() {
        const explications = document.querySelector(".explications")
        explications.style.display = "none"

        // Sky background
        this.backgroundSky = new THREE.Mesh(
            new THREE.SphereBufferGeometry(20, 32, 32),
            new THREE.MeshBasicMaterial({ map: this.texturesArr.backgroundSky })
        )
        this.backgroundSky.geometry.scale(-1, 1, 1)
        this.backgroundSky.rotation.y = Math.PI / 2
        this.scene.add(this.backgroundSky)

        // Mountains background
        this.backgroundMountains = new THREE.Mesh(
            new THREE.SphereBufferGeometry(18, 32, 32),
            new THREE.MeshBasicMaterial({
                map: this.texturesArr.backgroundMountains,
                transparent: true
            })
        )
        this.backgroundMountains.geometry.scale(-1, 1, 1)
        this.backgroundMountains.rotation.y = Math.PI / 2
        this.backgroundMountains.position.y += 2
        this.scene.add(this.backgroundMountains)

        // Stars background
        this.backgroundStars = new THREE.Mesh(
            new THREE.SphereBufferGeometry(19, 32, 32),
            new THREE.MeshBasicMaterial({
                map: this.texturesArr.backgroundStars,
                transparent: true
            })
        )
        this.backgroundStars.geometry.scale(-1, 1, 1)

        // Cube camera
        this.cubeCamera = new THREE.CubeCamera(1, 1000, 256)
        this.cubeCamera.renderTarget.texture.minFilter =
            THREE.LinearMipMapLinearFilter
        this.cubeCamera.update(this.renderer, this.scene)

        // Trick for envmap
        this.scene.remove(this.backgroundMountains)
        this.scene.add(this.backgroundStars)
        this.scene.add(this.backgroundMountains.clone())

        // Fog
        let fogColor = new THREE.Color(0x00003d)
        this.scene.fog = new THREE.Fog(fogColor, 0, 5)

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

        // Start song 
        this.musicsArr.song.setLoop(true)
        this.musicsArr.song.setVolume(this.volume)
        this.musicsArr.song.play()

        // Sphere
        const sphereChildren = this.modelsArr.model.children.slice(
            Math.max(this.modelsArr.model.children.length - 4, 1)
        )

        this.sphere = new Sphere(
            sphereChildren,
            this.texturesArr.spirale,
            this.cubeCamera.renderTarget.texture
        )
        this.scene.add(this.sphere)

        // Socle
        const socleChildren = this.modelsArr.model.children
        this.socle = new Socle(socleChildren, this.camera, this.startTornados)
        this.scene.add(this.socle)

        // Snow
        this.generateSnow()

        // Snow wind
        this.snowWind = new SnowWind(this.texturesArr.snowParticle)
        this.scene.add(this.snowWind)

        // Fire
        this.volumetricFire = new VolumetricFire(this.texturesArr.fireTexture)
        this.volumetricFire.position.y = 2.9
        this.volumetricFire.scale.set(this.volumetricScale, this.volumetricScale, this.volumetricScale)
        this.sphere.add(this.volumetricFire)

        // Tornados
        this.generateTornados()
        this.tornadosArr.forEach(tornado => {
            this.sphere.add(tornado)
        })

        // Listeners
        // window.addEventListener("mousemove", this.onMouseMove.bind(this), false)
        window.addEventListener("click", this.onMouseClick.bind(this), false)
        window.addEventListener("resize", this.onWindowResize.bind(this), false)
        this.onWindowResize()

        // Update loop
        this.update()
    }

    update() {
        // Orbit controls
        this.controls.update()

        // Get current time
        let deltaTime = this.clock.getDelta()
        this.currentTime = this.clock.elapsedTime

        // Camera traveling at start
        if (this.camera.position.z > 5.5 && this.camera.canTravelling) {
            this.camera.position.z -= 0.03
        } else {
            this.camera.canTravelling = false
        }

        // Smooth fog at start
        if (this.scene.fog.far < 40) {
            this.scene.fog.far += 0.2
        }

        // Update stars
        this.backgroundStars.rotation.y += 0.0007

        // Snow wind
        this.snowWind.children.forEach(particle => {
            particle.update(this.currentTime)
        })

        // Flames
        // if (this.flamesArr.length > 0) {
        if(this.volumetricFire){
            this.volumetricFire.animate(this.currentTime)
        }

            // this.flamesArr.forEach(flame => {
            //     flame.update(this.currentTime, deltaTime)
            // })
        // }

        // Fire 
        if(this.removeVolumetricFire === false){
            this.volumetricScale += (1 - this.volumetricFire.scale.y) * 0.02
            this.volumetricFire.scale.set(this.volumetricScale, this.volumetricScale, this.volumetricScale)
            this.volumetricFire.position.y = 2.3 + (1 - this.volumetricScale) * -.5
        } else {
            this.volumetricScale += (0.001- this.volumetricFire.scale.x) * 0.02
            this.volumetricFire.scale.set(this.volumetricScale, this.volumetricScale, this.volumetricScale)
        }

        this.volumetricFire.position.y = 2.3 + (0.001 - this.volumetricScale) * -.5



        // Tornados
        this.tornadosClock.getDelta()
        this.tornadosCurrentTime =
            this.tornadosClock.elapsedTime - this.tornadosStartTime

        if(this.removeTornado){
            this.tornadosArr.forEach(tornado => {
                tornado.children.forEach(flake => {
                    if( flake.material ) {
                        if(flake.material.opacity < 0.1){ 
                            tornado.visible = false 
                        } else {
                            flake.material.opacity += (- flake.material.opacity) * 0.05
                        }
                    }
                })
            }) 
        }else {
            this.tornadosArr.forEach(tornado => {
                tornado.update(this.tornadosCurrentTime)

                tornado.children.forEach(flake => {
                    if( flake.material ) {
                            tornado.visible = true
                            flake.material.opacity += (1 - flake.material.opacity) * 0.05
                    }
                })
            }) 
        }

        // Song
        if(this.canLevitate){
            this.volume += (1 - this.musicsArr.song.getVolume()) * 0.02
            this.musicsArr.song.setVolume(this.volume)
        } else {
            this.volume += (-this.musicsArr.song.getVolume()) * 0.02
            this.musicsArr.song.setVolume(this.volume)
        }

        // Sphere
        this.levitationClock.getDelta()
        this.levitationCurrentTime =
            this.levitationClock.elapsedTime - this.levitationStartTime

        this.sphere.update(this.canLevitate, this.levitationCurrentTime)

        // Socle
        this.socle.update()

        // Render scene
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.update.bind(this))
    }

    onMouseClick() {
        this.socle.pushers.forEach(pusher => {
            if (pusher.canClick) {
                if (pusher.position.z === 0) {
                    pusher.position.z -= 0.05
                    pusher.material.color.setHex(0x00ff00)

                    if (pusher.name === "Fire_pusher") {
                        this.startFire()
                    } else if (pusher.name === "Levitate_pusher") {
                        this.startLevitation()
                    } else if (pusher.name === "Flakes_pusher") {
                        this.startTornados()
                    }
                } else {
                    pusher.position.z += 0.05
                    pusher.material.color.setHex(0xff1212)

                    if (pusher.name === "Fire_pusher") {
                        this.stopFire()
                    } else if (pusher.name === "Levitate_pusher") {
                        this.stopLevitation()
                    } else if (pusher.name === "Flakes_pusher") {
                        this.stopTornados()
                    }
                }
            }
        })
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
}
