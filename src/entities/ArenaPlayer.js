class ArenaPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player-idle');

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Player properties
        this.scene = scene;
        this.speed = 200;
        this.isDead = false;

        // Health system
        this.maxHealth = 5;
        this.health = 5;
        this.isInvulnerable = false;
        this.invulnerabilityDuration = 1000; // 1 second

        // Attack system
        this.canAttack = true;
        this.attackCooldown = 400; // 0.4 seconds
        this.attackRange = 90;  // Increased from 70 for easier hits
        this.attackDamage = 1;
        this.isAttacking = false;

        // Dash system
        this.canDash = true;
        this.dashCooldown = 2000; // 2 seconds
        this.dashSpeed = 500;
        this.dashDuration = 300; // 0.3 seconds
        this.isDashing = false;

        // Movement input
        this.moveDirection = { x: 0, y: 0 };
        this.lastFacingDirection = { x: 1, y: 0 }; // Right by default

        // Physics properties
        this.setCollideWorldBounds(true);
        this.setScale(1.5);
        this.body.setSize(40, 60);
        this.body.setOffset(12, 10);
        this.setDepth(10); // Above other sprites

        // Input setup (keyboard)
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = {
            up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // Start with idle animation
        this.play('idle');
    }

    update() {
        if (this.isDead || this.isDashing) {
            return;
        }

        // Get keyboard input for movement
        let moveX = 0;
        let moveY = 0;

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            moveX = -1;
        }
        else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            moveX = 1;
        }

        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            moveY = -1;
        }
        else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            moveY = 1;
        }

        // Override with joystick input if available
        if (this.scene.virtualJoystick && this.scene.virtualJoystick.isActive) {
            moveX = this.scene.virtualJoystick.direction.x;
            moveY = this.scene.virtualJoystick.direction.y;
        }

        // Normalize diagonal movement
        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707; // 1/sqrt(2)
            moveY *= 0.707;
        }

        // Store movement direction
        this.moveDirection = { x: moveX, y: moveY };

        // Update last facing direction if moving
        if (moveX !== 0 || moveY !== 0) {
            this.lastFacingDirection = { x: moveX, y: moveY };
        }

        // Apply movement (can move while attacking)
        this.setVelocity(moveX * this.speed, moveY * this.speed);

        // Update animation (only if not attacking)
        if (!this.isAttacking) {
            if (moveX !== 0 || moveY !== 0) {
                if (this.anims.currentAnim.key !== 'run') {
                    this.play('run');
                }
            } else {
                if (this.anims.currentAnim.key !== 'idle') {
                    this.play('idle');
                }
            }
        }

        // Flip sprite based on horizontal movement
        if (moveX < 0) {
            this.setFlipX(true);
        } else if (moveX > 0) {
            this.setFlipX(false);
        }

        // Handle attack input
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.canAttack && !this.isAttacking) {
            this.attack();
        }

        // Handle dash input
        if (Phaser.Input.Keyboard.JustDown(this.shiftKey) && this.canDash && !this.isDashing) {
            this.dash();
        }
    }

    attack() {
        if (!this.canAttack || this.isAttacking) return;

        this.isAttacking = true;
        this.canAttack = false;

        // Play attack animation
        this.play('attack');

        // Camera shake for impact
        this.scene.cameras.main.shake(100, 0.005);

        // Create attack hitbox after a short delay (animation windup)
        this.scene.time.delayedCall(150, () => {
            this.createAttackHitbox();
        });

        // Reset attack flag when animation completes
        this.once('animationcomplete', () => {
            this.isAttacking = false;
        });

        // Start cooldown
        this.scene.time.delayedCall(this.attackCooldown, () => {
            this.canAttack = true;
        });
    }

    createAttackHitbox() {
        // Calculate attack position based on facing direction
        const attackX = this.x + this.lastFacingDirection.x * this.attackRange;
        const attackY = this.y + this.lastFacingDirection.y * this.attackRange;

        // Check for enemies in range
        if (this.scene.enemies) {
            this.scene.enemies.children.entries.forEach(enemy => {
                if (!enemy.isDead) {
                    const distance = Phaser.Math.Distance.Between(
                        attackX,
                        attackY,
                        enemy.x,
                        enemy.y
                    );

                    if (distance < this.attackRange) {
                        enemy.takeDamage(this.attackDamage, this);
                    }
                }
            });
        }
    }

    dash() {
        if (!this.canDash || this.isDashing) return;

        this.isDashing = true;
        this.canDash = false;
        this.isInvulnerable = true;

        // Use movement direction or last facing direction
        let dashX = this.moveDirection.x || this.lastFacingDirection.x;
        let dashY = this.moveDirection.y || this.lastFacingDirection.y;

        // Normalize
        const magnitude = Math.sqrt(dashX * dashX + dashY * dashY);
        if (magnitude > 0) {
            dashX /= magnitude;
            dashY /= magnitude;
        }

        // Apply dash velocity
        this.setVelocity(dashX * this.dashSpeed, dashY * this.dashSpeed);

        // Visual effect - blue trail
        this.setTint(0x00ffff);

        // End dash after duration
        this.scene.time.delayedCall(this.dashDuration, () => {
            this.isDashing = false;
            this.isInvulnerable = false;
            this.clearTint();
        });

        // Start cooldown
        this.scene.time.delayedCall(this.dashCooldown, () => {
            this.canDash = true;
            // Notify HUD that dash is ready
            if (this.scene.hud) {
                this.scene.hud.updateDashCooldown(true);
            }
        });

        // Update HUD
        if (this.scene.hud) {
            this.scene.hud.updateDashCooldown(false);
        }
    }

    takeDamage(amount = 1) {
        if (this.isInvulnerable || this.isDead || this.isDashing) return;

        this.health -= amount;

        // Update HUD
        if (this.scene.hud) {
            this.scene.hud.updateHealth(this.health);
        }

        // Camera shake for impact
        this.scene.cameras.main.shake(200, 0.01);

        // Screen flash
        this.scene.cameras.main.flash(100, 255, 0, 0, false);

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
                repeat: 5,
                onComplete: () => {
                    this.alpha = 1;
                    this.isInvulnerable = false;
                }
            });
        }
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.setVelocity(0, 0);
        this.play('dead');

        // Game over after animation
        this.once('animationcomplete', () => {
            this.scene.gameOver();
        });
    }

    heal(amount) {
        this.health = Math.min(this.health + amount, this.maxHealth);
        if (this.scene.hud) {
            this.scene.hud.updateHealth(this.health);
        }
    }
}
