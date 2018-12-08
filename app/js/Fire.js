import SpritesAnimation from "./SpritesAnimation"

export default class Fire extends THREE.Mesh {
    constructor(map, alphaMap) {
        const geometry = new THREE.PlaneGeometry(5, 5, 32)

        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            // transparent: true,
            // map: map,
            // alphaMap: alphaMap,
            wireframe: true
        })

        super(geometry, material)

        // this.mapTile = new SpritesAnimation(map, 16, 4, 64, 60)
        // this.alphaTile = new SpritesAnimation(alphaMap, 16, 4, 64, 60)
    }

    update(deltaTime) {
        // this.mapTile.update(deltaTime)
        // this.alphaTile.update(deltaTime)
    }
}
