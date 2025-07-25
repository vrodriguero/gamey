let platforms;
let player;
let cursors;
let jumpCount = 0; // Initialize jump count
let audioContext
let analyser
let dataArray

function setupMic() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        audioContext = new AudioContext()
        const source = audioContext.createMediaStreamSource(stream)

        analyser = audioContext.createAnalyser()
        analyser.fftSize = 256

        source.connect(analyser)

        const bufferLength = analyser.frequencyBinCount
        dataArray = new Uint8Array(bufferLength)
    }).catch((err) => {
        console.error('Microphone error:', err)
    })
}

function playerDeath() {
    player.disableBody(true, true) // disables and hides the player

    player.enableBody(true, 100, 300, true, true)
    player.setVelocity(0)
    player.anims.play('turn')
}

export default class IntroScene extends Phaser.Scene {
    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.add.image(540, 360, 'background')

        platforms = this.physics.add.group({
            allowGravity: false,
            immovable: true
        })

        for (let i = 0; i < 5; i++) {
            let platform = platforms.create(i * 300, 600, 'platform') // adjust spacing & y
            platform.setVelocityX(-100) // scroll speed
        }

        player = this.physics.add.sprite(100, 300, 'dude');

        player.setBounce(0.2);
        player.setGravityY(600)
        player.setCollideWorldBounds(true);
        player.body.onWorldBounds = true

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(player, platforms);

        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            if (body.gameObject === player && down) {
                playerDeath()
            }
        })

        setupMic()
    }

    update() {
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        // Jump logic
        if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
            if (player.body.touching.down || jumpCount < 1) {
                player.setVelocityY(-330)
                jumpCount++
            }
        }

        // Reset jump count when player lands
        if (player.body.touching.down) {
            jumpCount = 0
        }

        if (player.y > 600) {
            playerDeath()
        }

        if (analyser && dataArray) {
            analyser.getByteFrequencyData(dataArray)

            const volume = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length

            if (volume > 40) {
                // Maybe also move forward
                player.setVelocityX(500)
                player.setVelocityY(-100)
                player.anims.play('right', true)
            }
            else if (volume > 20) {
                // Maybe also move forward
                player.setVelocityX(160)
                player.anims.play('right', true)
            } else {
                player.setVelocityX(0)
                player.anims.play('turn')
            }

            platforms.children.iterate((platform) => {
                if (platform.x + platform.displayWidth < 0) {
                    // Off screen to the left, move to the right
                    platform.x = this.scale.width + platform.displayWidth
                }
            })
        }
    }
}
