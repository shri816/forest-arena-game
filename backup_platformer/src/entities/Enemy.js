class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        // Determine sprite key based on type
        const spriteKey = type === 'snail' ? 'snail-walk' : 'snail-walk';
        super(scene, x, y, spriteKey);

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Enemy properties
        this.scene = scene;
        this.type = type;
        this.isDead = false;
        this.speed = 50;
        this.direction = -1; // -1 = left, 1 = right
        this.patrolDistance = 200;
        this.startX = x;

        // Physics properties
        this.setCollideWorldBounds(true);
        this.setGravityY(0);
        this.setScale(1.5); // Make enemies larger and more visible
        this.body.setSize(24, 24);
        this.body.setOffset(4, 8);

        // Make enemies look dangerous with a subtle red tint
        this.setTint(0xffcccc);

        // Start animation
        if (type === 'snail') {
            this.play('snail-walk');
        }

        // Set initial velocity
        this.setVelocityX(this.speed * this.direction);
    }

    update() {
        if (this.isDead) {
            return;
        }

        // Patrol behavior - turn around at patrol distance or when hitting a wall
        const distanceFromStart = Math.abs(this.x - this.startX);

        if (distanceFromStart > this.patrolDistance || this.body.blocked.left || this.body.blocked.right) {
            this.turn();
        }

        // Keep moving in current direction
        this.setVelocityX(this.speed * this.direction);

        // Flip sprite based on direction
        this.setFlipX(this.direction === 1);
    }

    turn() {
        this.direction *= -1;
        this.setVelocityX(this.speed * this.direction);
    }

    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.setVelocity(0, 0);
        this.body.enable = false;

        // Play death animation
        if (this.type === 'snail') {
            this.play('snail-dead');
        }

        // Remove after animation
        this.once('animationcomplete', () => {
            this.destroy();
        });
    }
}
