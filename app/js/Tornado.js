import App from "./App"
import Flake from "./Flake"

export default class Tornado{
    constructor(){
        this.mesh = this.draw()
    }

    draw(){
        this.tornado = new THREE.Group()
        this.lastTime = 0 
        return this.tornado
    }

    update(time){
        // Create new flake every seconds
        if (time >= this.lastTime + App.options.flakeCreationSpeed) {
            let flake = new Flake(
                time,
                [App.texturesArr.flake1Texture, App.texturesArr.flake2Texture, App.texturesArr.flake3Texture]
            )

            this.tornado.add(flake)
            this.lastTime = time
        }

        // Update each flakes
        this.tornado.children.forEach(flake => {
            if (flake.position.y > App.options.tornadoHeight) {
                this.tornado.remove(flake)                
            } else {
                flake.update()
            }
        })

        // // Update tornado position
        // App.tornadoPosition = {
        //     x: Math.cos(this.currentTime * App.options.tornadoSpeed) * App.options.tornadoRadius,
        //     y: 0,
        //     z: Math.sin(this.currentTime * App.options.tornadoSpeed) * App.options.tornadoRadius
        // }
    }


}