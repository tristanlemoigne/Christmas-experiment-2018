import Flake from "./Flake"
import Constants from "../utils/constants"

export default class Tornado extends THREE.Group {
    constructor(flakesTextures) {
        super()

        this._nextTime = Constants.flakes.creationSpeed
        this.flakesTextures = flakesTextures
    }

    update(time) {
        // Create new flake every seconds
        if (time >= this._nextTime) {
            let flake = new Flake(time, this.flakesTextures)

            this.add(flake)
            this._nextTime += Constants.flakes.creationSpeed
        }

        // Update each flakes
        this.children.forEach(flake => {
            if (flake.position.y > Constants.tornado.size) {
                this.remove(flake)
            } else {
                flake.update(this.position)
            }
        })

        // Update tornado position
        this.position.set(
            Math.cos(time * Constants.tornado.rotationSpeed) *
                Constants.tornado.rotationRadius,
            0,
            Math.sin(time * Constants.tornado.rotationSpeed) *
                Constants.tornado.rotationRadius
        )
    }
}
