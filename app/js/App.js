// example import asset
// import imgPath from './assets/img.jpg'

// Libs
const FBXLoader = require("three-fbx-loader")
const OrbitControls = require("three-orbit-controls")(THREE)

import { Cube, Sphere } from "./Cube"
import cubeModel from "../assets/models/cube2.fbx"
import nx from "../assets/textures/cube/nx.jpg"
import ny from "../assets/textures/cube/ny.jpg"
import nz from "../assets/textures/cube/nz.jpg"
import px from "../assets/textures/cube/px.jpg"
import py from "../assets/textures/cube/py.jpg"
import pz from "../assets/textures/cube/pz.jpg"

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
        this.controls = new OrbitControls(this.camera)

        // Listeners
        window.addEventListener("resize", this.onWindowResize.bind(this), false)
        this.onWindowResize()

        // Scene settings
        this.modelsArr = []

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

        let pointLight = new THREE.PointLight(0x00ffff, 1, 1000)
        pointLight.position.set(100, 100, 0)
        this.scene.add(pointLight)

        let pointLightHelper = new THREE.PointLightHelper(pointLight, 1)
        this.scene.add(pointLightHelper)
        //cubemap
        var urls = [px, nx, py, ny, pz, nz]

        var reflectionCube = new THREE.CubeTextureLoader().load(urls)
        reflectionCube.format = THREE.RGBFormat
        this.scene.background = reflectionCube
        // this.scene.background = new THREE.Color(0xff00ff)

        var cubeMaterial2 = new THREE.MeshLambertMaterial({
            // color: 0xff00ff,
            envMap: reflectionCube,
            transparent: true,
            // opacity: 0.5,
            refractionRatio: 0.1
        })

        let cube = new Cube(20).draw()
        cube.material = cubeMaterial2

        // this.scene.add(cube)

        let sphere = new Sphere(5, 32).draw()
        // this.scene.add(sphere)

        this.loadModel(cubeModel, "cube").then(() => {
            console.log("chargé ! :D")

            this.modelsArr.cube.traverse(child => {
                console.log(child)
                child.material = new THREE.MeshBasicMaterial({
                    color: "red"
                })

                child.material.side = THREE.DoubleSide
            })

            this.modelsArr.cube.scale.set(0.2, 0.2, 0.2)

            console.log(this.modelsArr.cube)
            this.scene.add(this.modelsArr.cube)
        })
    }

    loadModel(path, id) {
        return new Promise((resolve, reject) => {
            new FBXLoader().load(path, model => {
                this.modelsArr[id] = model
                resolve()
            })
        })
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
