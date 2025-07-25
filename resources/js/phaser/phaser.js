import Phaser from 'phaser'
import IntroScene from './scenes/IntroScene'

const config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    backgroundColor: '#1d1d1d',
    parent: 'phaser-container', // this will be the div ID in your component
    scene: [IntroScene],
}

let game = null

export function launchPhaser() {
    if (!game) {
        game = new Phaser.Game(config)
    }
}
