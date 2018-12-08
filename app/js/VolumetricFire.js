import "../utils/FireShader"
import "../utils/FireLib"

export default class VolumetricFire extends THREE.Fire {
    constructor(texture) {
        super(texture)
        this.update = this.update.bind(this)
    }

    animate(time) {
        this.update(time)
    }
}
