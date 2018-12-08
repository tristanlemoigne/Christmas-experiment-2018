// TO OPTIMISE : IF WE DON'T WANT LAST LINES OF TILES

export default class SpritesAnimation {
    constructor(texture, tilesX, tilesY, tilesNb, fps) {
        this._texture = texture
        this._tilesX = tilesX
        this._tilesY = tilesY
        this._tilesNb = tilesNb
        this._fps = fps

        this.displayTime = 0
        this.currentTile = 0

        return this.render()
    }

    render() {
        this._texture.wrapS = this._texture.wrapT = THREE.RepeatWrapping
        this._texture.repeat.set(1 / this._tilesX, 1 / this._tilesY)
    }

    update(deltaTime) {
        this.displayTime += deltaTime

        // Change tile every fps
        if (this.displayTime > 1 / this._fps) {
            if (this.currentTile >= this._tilesNb) {
                this.currentTile = 0
            }

            this.currentColumn = this.currentTile % this._tilesX
            this.currentRow = Math.floor(this.currentTile / this._tilesX)

            this._texture.offset.x = this.currentColumn / this._tilesX
            this._texture.offset.y = -(this.currentRow / this._tilesY)

            this.displayTime = 0
            this.currentTile++
        }
    }
}
