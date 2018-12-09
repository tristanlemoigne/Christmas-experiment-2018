export function getRandom(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const fire = {
    width: 0.8,
    height: 0.8,
    quality: 8,
    color: 0xffffff,
    noiseAmplitude: 0.2
}

export const snow = {
    width: 50,
    height: 50,
    segments: 64,
    color: 0xffffff,
    metalness: 0.2,
    roughness: 0.7,
    emissive: 0x0000f0,
    emissiveIntensity: 0.1,
    noiseAmplitude: 1.2
}

export const tornado = {
    size: 0.8,
    angle: Math.PI / 8,
    rotationRadius: 0.25,
    rotationSpeed: -0.9
}

export const flakes = {
    size: 0.07,
    rotationSpeed: -0.03,
    verticalSpeed: 0.0016,
    creationSpeed: 0.1
}

export default {
    getRandom,
    fire,
    snow,
    tornado,
    flakes
}
