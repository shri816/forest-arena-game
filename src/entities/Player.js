class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player-idle');

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Player properties
        this.scene = scene;
        this.speed = 250;
        this.jumpVelocity = -550;
        this.isJumping = false;
        this.isDead = false;

        // Health system
        this.maxHealth = 3;
        this.health = 3;
        this.isInvulnerable = false;
        this.invulnerabilityDuration = 1500; // 1.5 seconds

        // Physics properties
        this.setCollideWorldBounds(true);
        this.setGravityY(0);
        this.setScale(1.2); // Slightly larger for better visibility
        this.body.setSize(40, 70); // Adjust hitbox to be smaller than sprite
        this.body.setOffset(12, 10); // Center the hitbox

        // Input setup
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = {
            up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Start with idle animation
        this.play('idle');
    }

    update() {
        if (this.isDead) {
            return;
        }

        // Handle horizontal movement
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.setVelocityX(-this.speed);
            this.setFlipX(true);

            if (this.body.touching.down && this.anims.currentAnim.key !== 'run') {
                this.play('run');
            }
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.setVelocityX(this.speed);
            this.setFlipX(false);

            if (this.body.touching.down && this.anims.currentAnim.key !== 'run') {
                this.play('run');
            }
        } else {
            this.setVelocityX(0);

            if (this.body.touching.down && this.anims.currentAnim.key !== 'idle') {
                this.play('idle');
            }
        }

        // Handle jumping
        const jumpPressed = this.cursors.up.isDown || this.wasd.up.isDown || this.spaceKey.isDown;

        if (jumpPressed && this.body.touching.down) {
            this.setVelocityY(this.jumpVelocity);
            this.isJumping = true;
            if (this.anims.currentAnim.key !== 'jump') {
                this.play('jump');
            }
        }

        // Check if in the air
        if (!this.body.touching.down && this.anims.currentAnim.key !== 'jump') {
            this.play('jump');
        }

        // Reset jumping flag when landing
        if (this.body.touching.down && this.isJumping) {
            this.isJumping = false;
        }

        // Check if fallen off the map
        if (this.y > this.scene.cameras.main.height + 100) {
            this.die();
        }
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.setVelocity(0, -300);
        this.play('dead');
        this.body.enable = false;

        // Respawn after delay
        this.scene.time.delayedCall(2000, () => {
            this.respawn();
        });
    }

    respawn() {
        this.isDead = false;
        this.body.enable = true;
        this.setPosition(100, 100);
        this.setVelocity(0, 0);
        this.setAlpha(1);
        this.play('idle');

        // Decrease lives and reset health
        gameState.lives--;
        this.health = this.maxHealth;

        // Update HUD
        if (this.scene.hud) {
            this.scene.hud.updateLives(gameState.lives);
            this.scene.hud.updateHealth(this.health);
        }

        // Check for game over
        if (gameState.lives <= 0) {
            // Game over logic (will implement later)
            console.log('Game Over!');
            gameState.lives = 3;
            gameState.score = 0;
            this.scene.scene.restart();
        }

        // Brief invulnerability after respawn
        this.isInvulnerable = true;
        this.scene.time.delayedCall(2000, () => {
            this.isInvulnerable = false;
        });
    }

    stompEnemy() {
        // Small bounce when stomping enemy
        this.setVelocityY(-300);

        // Add score
        gameState.score += 100;
        if (this.scene.hud) {
            this.scene.hud.updateScore(gameState.score);
        }
    }

    takeDamage(amount = 1) {
        if (this.isInvulnerable || this.isDead) return;

        this.health -= amount;

        // Update HUD
        if (this.scene.hud) {
            this.scene.hud.updateHealth(this.health);
        }

        // Camera shake for impact
        this.scene.cameras.main.shake(200, 0.01);

        if (this.health <= 0) {
            this.die();
        } else {
            // Make invulnerable temporarily
            this.isInvulnerable = true;

            // Flash effect
            this.scene.tweens.add({
                targets: this,
                alpha: 0.3,
                duration: 100,
                yoyo: true,
                repeat: 7,
                onComplete: () => {
                    this.alpha = 1;
                    this.isInvulnerable = false;
                }
            });
        }
    }
}
