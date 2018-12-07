export function getRandom(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
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
    size: 10,
    angle: Math.PI / 6,
    rotationRadius: 3,
    rotationSpeed: -1.5
}

export const flakes = {
    size: 1,
    rotationSpeed: 0.03,
    verticalSpeed: 0.004,
    creationSpeed: 0.5
}