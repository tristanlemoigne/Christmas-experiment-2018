"use strict"
import "../utils/FireShader"
import "../utils/FireLib"

export default class Fire{
    constructor(texture){
        this.texture = texture
    }

    draw(){
        let fire = new THREE.Fire(this.texture)
        return fire
    }

    update(time){
        this.fire.update(time)
    }
}