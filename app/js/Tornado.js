import Flake from "./Flake"
import { tornado, flakes } from "../utils/constants"

export default class Tornado extends THREE.Group {
    constructor(flakesTextures, positionAngle, flakeRotationSpeed) {
        super()

        this.flakesTextures = flakesTextures
        this._positionAngle = positionAngle
        this.flakeRotationSpeed = flakeRotationSpeed
        this._nextTime = flakes.creationSpeed
    }

    update(time) {
        // Create new flake every seconds
        if (time >= this._nextTime) {
            let flake = new Flake(
                time,
                this.flakesTextures,
                this.flakeRotationSpeed
            )
            this.add(flake)
            this._nextTime += flakes.creationSpeed
        }

        // Update each flakes
        this.children.forEach(flake => {
            if (flake.position.y > tornado.size) {
                this.remove(flake)
            } else {
                flake.update(this.position)
            }
        })

        // Update tornado position
        this.position.set(
            Math.cos(time * tornado.rotationSpeed + this._positionAngle) *
                tornado.rotationRadius,
            this.position.y,
            Math.sin(time * tornado.rotationSpeed + this._positionAngle) *
                tornado.rotationRadius
        )
    }
}
