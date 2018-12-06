import Constants from "../utils/constants"

export default class Flake extends THREE.Points {
    constructor(creationTime, textures) {
        const geometry = new THREE.Geometry()
        geometry.vertices.push(new THREE.Vector3())

        const material = new THREE.PointsMaterial({
            transparent: true,
            size: Constants.flakes.size,
            map: textures[Constants.getRandom(0, textures.length - 1)]
        })

        super(geometry, material)
        this._creationTime = creationTime
    }

    update(tornadoPosition) {
        this._creationTime += Constants.flakes.rotationSpeed

        let posY = this.position.y + Constants.flakes.verticalSpeed
        let radius = posY * Constants.tornado.angle
        let posX = radius * Math.cos(this._creationTime)
        let posZ = radius * Math.sin(this._creationTime)

        this.position.set(
            posX + tornadoPosition.x,
            posY,
            posZ + tornadoPosition.z
        )
    }
}
