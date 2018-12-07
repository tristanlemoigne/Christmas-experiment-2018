import {tornado, flakes, getRandom} from "../utils/constants"

export default class Flake extends THREE.Points {
    constructor(creationTime, textures) {
        const geometry = new THREE.Geometry()
        geometry.vertices.push(new THREE.Vector3())

        const material = new THREE.PointsMaterial({
            transparent: true,
            size: flakes.size,
            map: textures[getRandom(0, textures.length - 1)]
        })

        super(geometry, material)
        this._creationTime = creationTime
    }

    update(tornadoPosition) {
        this._creationTime += flakes.rotationSpeed

        let posY = this.position.y + flakes.verticalSpeed
        let radius = posY * tornado.angle
        let posX = radius * Math.cos(this._creationTime)
        let posZ = radius * Math.sin(this._creationTime)

        this.position.set(
            posX + tornadoPosition.x,
            posY,
            posZ + tornadoPosition.z
        )
    }
}
