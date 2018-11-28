export default class Cube {
    constructor(size) {
        this.size = size
    }

    draw() {
        let geometry = new THREE.BoxGeometry(this.size, this.size, this.size)
        let material = new THREE.MeshNormalMaterial()

        return new THREE.Mesh(geometry, material)
    }
}
