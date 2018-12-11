export default class SnowWind extends THREE.Group {
    constructor(particleTexture) {
        super()

        this.particleTexture = particleTexture
        this.render()
    }

    render() {
        console.log(this.particleTexture)
    }

    update() {}
}
