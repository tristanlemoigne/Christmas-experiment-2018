import Particle from "./Particle"

export default class SnowWind extends THREE.Group {
    constructor(particleTexture) {
        super()

        this.particleTexture = particleTexture
        this.particlesCount = 200
        this.render()
    }

    render() {
        for (var i = 0; i < this.particlesCount; i++) {
            let particle = new Particle(this.particleTexture)
            particle.position.set()
            particle.position.x = Math.random() * 20 - 10
            particle.position.y = Math.random() * 20 - 10
            particle.position.z = Math.random() * 20 - 10

            this.add(particle)
        }
    }
}
