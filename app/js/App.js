// example import asset
// import imgPath from './assets/img.jpg'
import "../libs/OrbitControls"
import { Cube, Sphere } from "./Cube"
// import Cube from "./Cube"

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
        this.camera.position.set(0, 0, 50)

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("canvas"),
            antialias: true
        })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        // Controls
        this.controls = new THREE.OrbitControls(this.camera)

        // Listeners
        window.addEventListener("resize", this.onWindowResize.bind(this), false)
        this.onWindowResize()

        // Start scene
        this.launchScene()

        // Update loop
        this.update()
    }

    launchScene() {
        // Helpers
        let axesHelper = new THREE.AxesHelper(10)
        this.scene.add(axesHelper)

        // Lights
        let ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(ambientLight)

        // let pointLight = new THREE.PointLight(0x00ffff, 1, 100)
        // pointLight.position.set(10, 10, 0)
        // this.scene.add(pointLight)

        // let pointLightHelper = new THREE.PointLightHelper(
        //     pointLight,
        //     1
        // )
        // this.scene.add(pointLightHelper)

        let cube = new Cube(20).draw()
        this.scene.add(cube)

        let sphere = new Sphere(5, 32).draw()
        this.scene.add(sphere)
    }

    update() {
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.update.bind(this))
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
}
