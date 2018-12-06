import "../utils/FireShader"
import "../utils/FireLib"
import Constants from "../utils/constants"

export default class Fire extends THREE.Fire {
    constructor(texture) {
        super(texture)

        this.scale.set(
            Constants.fire.scaleX,
            Constants.fire.scaleY,
            Constants.fire.scaleZ
        )
        this.update = this.update.bind(this)
    }

    animate(time) {
        this.update(time)
    }
}
