import App from "./App"

export default class Flake extends THREE.Points {
    
    constructor(creationTime, textures) {
        const geometry = new THREE.Geometry()
        geometry.vertices.push(new THREE.Vector3())

        const material = new THREE.PointsMaterial({
            transparent: true,
            size: App.options.flakeSize,
            map: textures[App.getRandom(0, textures.length - 1)]
        })

        super(geometry, material)
        this.creationTime = creationTime
    }

    update() {
        this.creationTime += App.options.flakeRotationSpeed

        let posY = this.position.y + App.options.flakeVerticalSpeed
        let radius = posY * App.options.tornadoAngle
        let posX = radius * Math.cos(this.creationTime) 
        let posZ = radius * Math.sin(this.creationTime)

        this.position.set(
            posX + App.tornadoPosition.x,
            posY,
            posZ + App.tornadoPosition.z
        )
    }
}
