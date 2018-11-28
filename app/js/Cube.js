class Cube {
    constructor(size) {
        this.size = size
    }

    draw() {
        let geometry = new THREE.BoxGeometry(this.size, this.size, this.size)
        let material = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        })

        return new THREE.Mesh(geometry, material)
    }
}

class Sphere {
    constructor(radius, quality) {
        this.radius = radius
        this.quality = quality
    }

    draw() {
        let geometry = new THREE.SphereGeometry(
            this.radius,
            this.quality,
            this.quality
        )
        let material = new THREE.MeshNormalMaterial()

        return new THREE.Mesh(geometry, material)
    }
}

export { Cube, Sphere }
