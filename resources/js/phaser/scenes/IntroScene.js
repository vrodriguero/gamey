let platforms;
let player;
let cursors;
let jumpCount = 0; // Initialize jump count

let npcs;

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

        platforms.create(20, 600, 'ground');

        player = this.physics.add.sprite(100, 300, 'dude');

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

        npcs = this.physics.add.group();

        for (let i = 0; i < 5; i++) {
            const npc = npcs.create(Phaser.Math.Between(100, 900), 0, 'dude');
            npc.setBounce(0.8);
            npc.setCollideWorldBounds(true);
            npc.setVelocityX(Phaser.Math.Between(-100, 100));
            npc.setGravityY(600);

            const dir = Phaser.Math.Between(0, 1) === 0 ? -1 : 1
            const speed = Phaser.Math.Between(50, 100) * dir
            npc.setVelocityX(speed)
            npc.anims.play(dir === -1 ? 'left' : 'right', true)
        }

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(npcs, platforms);

        function dies (player, npc)
        {
            player.disableBody(true, true);
            player.enableBody(true, 100, 300, true, true);
        }

        this.physics.add.overlap(player, npcs, dies, null, this);
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

        npcs.children.iterate((npc) => {
            // 1. Flip direction on wall collision
            if (npc.body.blocked.left) {
                npc.setVelocityX(Phaser.Math.Between(50, 100))
                npc.anims.play('right', true)
            } else if (npc.body.blocked.right) {
                npc.setVelocityX(Phaser.Math.Between(-100, -50))
                npc.anims.play('left', true)
            }

            // 2. Random Jumping
            const isOnGround = npc.body.blocked.down || npc.body.touching.down

            if (isOnGround && Phaser.Math.Between(0, 300) === 0) {
                npc.setVelocityY(-Phaser.Math.Between(250, 350))
                npc.anims.play('turn') // Use the standing frame during jump
            }

            // 3. Restore walking animation when back on ground
            if (isOnGround && npc.anims.currentAnim?.key === 'turn') {
                if (npc.body.velocity.x < 0) {
                    npc.anims.play('left', true)
                } else {
                    npc.anims.play('right', true)
                }
            }
        });
    }
}
