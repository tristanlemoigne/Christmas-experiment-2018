import { getRandom } from "../utils/constants"

export default class Particle extends THREE.Points {
    constructor(texture) {
        const geometry = new THREE.Geometry()
        geometry.vertices.push(new THREE.Vector3())

        const material = new THREE.PointsMaterial({
            transparent: true,
            size: 0.2,
            map: texture
        })

        super(geometry, material)

        this.velocity = new THREE.Vector3(0, 0, 0)
        this.gravity = new THREE.Vector3(0, -0.0001, 0)
        this.acc = new THREE.Vector3(0, 0, 0)
    }

    update() {
        this.position.y -= 0.01

        if (this.position.y < 0) {
            this.position.y = getRandom(10, 20)
        }
    }
}
