import { fire } from "../utils/constants"
import SimplexNoise from "simplex-noise"
import SpritesAnimation from "./SpritesAnimation"

export default class Fire extends THREE.Mesh {
    constructor(map, alphaMap) {
        const geometry = new THREE.PlaneGeometry(
            fire.width,
            fire.height,
            fire.quality,
            fire.quality
        )

        const material = new THREE.MeshBasicMaterial({
            color: fire.color,
            side: THREE.DoubleSide,
            transparent: true,
            map: map,
            alphaMap: alphaMap
        })

        super(geometry, material)
        this.simplex = new SimplexNoise()

        this.mapTile = new SpritesAnimation(map, 16, 4, 64, 60)
        this.alphaTile = new SpritesAnimation(alphaMap, 16, 4, 64, 60)
    }

    update(currentTime, deltaTime) {
        this.geometry.verticesNeedUpdate = true

        for (let i = 0; i < this.geometry.vertices.length; i++) {
            let vert = this.geometry.vertices[i]
            let noiseZ = this.simplex.noise3D(
                vert.x * 0.9,
                vert.y * 0.9,
                currentTime / 2
            )
            vert.z = noiseZ * fire.noiseAmplitude
        }

        this.mapTile.update(deltaTime)
        this.alphaTile.update(deltaTime)
    }
}
