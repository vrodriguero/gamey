let platforms;
let player;
let cursors;
let jumpCount = 0; // Initialize jump count

export default class IntroScene extends Phaser.Scene {
    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.add.image(540, 360, 'background')

        platforms = this.physics.add.staticGroup();

        platforms.create(540, 720, 'ground').setScale(2).refreshBody();

        platforms.create(1100, 600, 'ground');

        player = this.physics.add.sprite(100, 600, 'dude');

        player.setBounce(0.2);
        player.setGravityY(400)
        player.setCollideWorldBounds(true);

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
    }
}
