class ArenaEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        // Determine sprite key based on type
        let spriteKey = 'snail-walk';
        if (type === 'boar') spriteKey = 'boar-run';
        else if (type === 'bee') spriteKey = 'bee-fly';

        super(scene, x, y, spriteKey);

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Enemy properties
        this.scene = scene;
        this.type = type;
        this.isDead = false;

        // Type-specific properties
        this.setupTypeProperties();

        // Physics properties
        this.setCollideWorldBounds(true);
        this.body.setSize(this.hitboxSize.width, this.hitboxSize.height);
        this.body.setOffset(this.hitboxSize.offsetX, this.hitboxSize.offsetY);
        this.setDepth(5);

        // AI properties
        this.target = null;
        this.aggroRange = 800; // Can see player from this distance
        this.updateTimer = 0;
        this.updateInterval = 100; // Update AI every 100ms

        // Start animation
        this.playAnimation();
    }

    setupTypeProperties() {
        switch (this.type) {
            case 'snail':
                this.maxHealth = 1;
                this.health = 1;
                this.speed = 50;
                this.damage = 1;
                this.scoreValue = 10;
                this.scale = 1.8;
                this.hitboxSize = { width: 24, height: 24, offsetX: 4, offsetY: 8 };
                this.setTint(0xffcccc); // Slight red tint
                break;

            case 'boar':
                this.maxHealth = 2;
                this.health = 2;
                this.speed = 85;  // Reduced from 120
                this.damage = 1;
                this.scoreValue = 25;
                this.scale = 2.0;
                this.hitboxSize = { width: 40, height: 28, offsetX: 4, offsetY: 4 };
                this.chargeSpeed = 140; // Reduced from 200
                this.isCharging = false;
                this.setTint(0xffaaaa); // Red tint
                break;

            case 'bee':
                this.maxHealth = 1;
                this.health = 1;
                this.speed = 80;
                this.damage = 1;
                this.scoreValue = 30;
                this.scale = 1.6;
                this.hitboxSize = { width: 28, height: 56, offsetX: 2, offsetY: 4 };
                this.setTint(0xffffcc); // Yellow tint
                break;
        }

        this.setScale(this.scale);
    }

    playAnimation() {
        if (this.type === 'snail') {
            this.play('snail-walk');
        } else if (this.type === 'boar') {
            this.play('boar-run');
        } else if (this.type === 'bee') {
            this.play('bee-fly');
        }
    }

    update(time, delta) {
        if (this.isDead) {
            return;
        }

        // Update AI less frequently for performance
        this.updateTimer += delta;
        if (this.updateTimer < this.updateInterval) {
            return;
        }
        this.updateTimer = 0;

        // Find player
        if (!this.target && this.scene.player) {
            this.target = this.scene.player;
        }

        if (!this.target || this.target.isDead) {
            this.setVelocity(0, 0);
            return;
        }

        // Calculate distance to player
        const distance = Phaser.Math.Distance.Between(
            this.x, this.y,
            this.target.x, this.target.y
        );

        // Only chase if in range
        if (distance < this.aggroRange) {
            this.chasePlayer();
        } else {
            this.setVelocity(0, 0);
        }

        // Flip sprite based on movement
        if (this.body.velocity.x < 0) {
            this.setFlipX(true);
        } else if (this.body.velocity.x > 0) {
            this.setFlipX(false);
        }
    }

    chasePlayer() {
        if (!this.target) return;

        // Calculate direction to player
        const angle = Phaser.Math.Angle.Between(
            this.x, this.y,
            this.target.x, this.target.y
        );

        // Different behavior per type
        if (this.type === 'snail') {
            // Slow, direct approach
            this.setVelocity(
                Math.cos(angle) * this.speed,
                Math.sin(angle) * this.speed
            );
        } else if (this.type === 'boar') {
            // Fast charge in straight lines
            const currentSpeed = this.isCharging ? this.chargeSpeed : this.speed;
            this.setVelocity(
                Math.cos(angle) * currentSpeed,
                Math.sin(angle) * currentSpeed
            );

            // Start charging when close
            if (!this.isCharging) {
                const distance = Phaser.Math.Distance.Between(
                    this.x, this.y,
                    this.target.x, this.target.y
                );
                if (distance < 200) {
                    this.isCharging = true;
                    this.setTint(0xff0000); // Full red when charging
                }
            }
        } else if (this.type === 'bee') {
            // Flying, slightly erratic movement
            const wobble = Math.sin(Date.now() / 200) * 20;
            this.setVelocity(
                Math.cos(angle) * this.speed + wobble,
                Math.sin(angle) * this.speed
            );
        }
    }

    takeDamage(amount, attacker) {
        if (this.isDead) return;

        this.health -= amount;

        // Flash white
        this.setTint(0xffffff);
        this.scene.time.delayedCall(50, () => {
            this.setupTypeProperties(); // Reset tint
        });

        if (this.health <= 0) {
            this.die(attacker);
        }
    }

    die(killer) {
        if (this.isDead) return;

        this.isDead = true;
        this.setVelocity(0, 0);
        this.body.enable = false;

        // Play death animation based on type
        if (this.type === 'snail') {
            this.play('snail-dead');
        } else if (this.type === 'boar') {
            this.play('boar-hit');
        } else if (this.type === 'bee') {
            this.play('bee-hit');
        }

        // Update score and combo
        this.scene.addScore(this.scoreValue, this.type);
        this.scene.incrementCombo();

        // Chance to drop power-up (20%)
        if (Math.random() < 0.2) {
            this.scene.spawnPowerUp(this.x, this.y);
        }

        // Screen shake on kill
        this.scene.cameras.main.shake(80, 0.003);

        // Remove after animation or timeout
        this.scene.time.delayedCall(500, () => {
            this.destroy();
        });
    }
}
