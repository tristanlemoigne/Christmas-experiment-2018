export default class Socle extends THREE.Group {
    constructor(children, camera, pusherFunctions) {
        super()

        this.children = children
        this.camera = camera
        this.pusherFunctions = pusherFunctions
        this.pushers = []

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.intersects
        this.INTERSECTED
        this.render()
    }

    render() {
        const socleMaterial = new THREE.MeshStandardMaterial({
            color: 0x5b5855,
            roughness: 0.6,
            metalness: 0.3
        })

        const goldMaterial = new THREE.MeshPhongMaterial({
            color: 0xb38e41,
            reflectivity: 0,
            specular: 0xeee8aa,
            shininess: 40,
            emissive: 0xffffff,
            emissiveIntensity: 0.06
        })

        // Adding each element to the sphere
        this.children.forEach(child => {
            if (child.name === "Socle") {
                child.material = socleMaterial
                child.receiveShadow = true
            } else if (
                child.name === "Fire" ||
                child.name === "Levitate" ||
                child.name === "Flakes"
            ) {
                child.material = goldMaterial
            } else if (
                child.name === "Fire_pusher" ||
                child.name === "Levitate_pusher" ||
                child.name === "Flakes_pusher"
            ) {
                // Create new material in order to change emissive of each elements
                child.material = new THREE.MeshPhongMaterial({
                    color: 0xff1212,
                    transparent: true,
                    opacity: 0.9,
                    emissive: 0xffffff,
                    emissiveIntensity: 0
                })

                child.canClick = false
                this.pushers.push(child)
            }
        })

        window.addEventListener("mousemove", this.onMouseMove.bind(this), false)
    }

    update() {
        // Buttons interactions
        this.raycaster.setFromCamera(this.mouse, this.camera)
        this.intersects = this.raycaster.intersectObjects(this.pushers)

        if (this.intersects.length > 0) {
            if (this.intersects[0].object != this.INTERSECTED) {
                document.body.style.cursor = "pointer"

                if (this.INTERSECTED) {
                    this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex()
                    this.INTERSECTED.material.color.setHex(
                        this.INTERSECTED.currentHex
                    )
                }

                this.INTERSECTED = this.intersects[0].object
                this.INTERSECTED.canClick = true
                this.INTERSECTED.material.emissiveIntensity = 0.2
            }
        } else {
            if (this.INTERSECTED) {
                document.body.style.cursor = "auto"
                this.INTERSECTED.canClick = false
                this.INTERSECTED.material.color.set(this.INTERSECTED.currentHex)
                this.INTERSECTED.material.emissiveIntensity = 0
            }

            this.INTERSECTED = null
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
}
