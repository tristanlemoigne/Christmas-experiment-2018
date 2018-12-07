import SimplexNoise from "simplex-noise"
import {snow} from "../utils/constants"

export default class Snow extends THREE.Mesh{
    constructor(normalMap){
        const geometry = new THREE.PlaneGeometry(snow.width, snow.height, snow.segments, snow.segments)

        const material = new THREE.MeshStandardMaterial({
            color: snow.color, 
            side: THREE.DoubleSide, 
            normalMap: normalMap,
            metalness: snow.metalness,
            roughness: snow.roughness,
            emissive: snow.emissive,
            emissiveIntensity: snow.emissiveIntensity
        })

        const simplex = new SimplexNoise()

        // Deform plane vertices
        for (let i = 0; i < geometry.vertices.length; i++) {
            let vert = geometry.vertices[i]
            let noiseVal = simplex.noise3D(vert.x * 0.1, vert.y * 0.1, 1)
        
            vert.z -= Math.abs(noiseVal * snow.noiseAmplitude)
        }

        super(geometry, material)
    }
}