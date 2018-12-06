const Constants = {
    getRandom(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    },
    fire: {
        scaleX: 10,
        scaleY: 10,
        scaleZ: 10
    },
    tornado: {
        size: 10,
        angle: Math.PI / 6,
        rotationRadius: 3,
        rotationSpeed: -1.5
    },
    flakes: {
        size: 1,
        rotationSpeed: 0.03,
        verticalSpeed: 0.004,
        creationSpeed: 0.5
    }
}

export default Constants
