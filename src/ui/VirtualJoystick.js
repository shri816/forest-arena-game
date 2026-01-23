class VirtualJoystick {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.radius = 60;
        this.thumbRadius = 30;

        this.isActive = false;
        this.direction = { x: 0, y: 0 };
        this.pointer = null;

        // Create graphics
        this.create();

        // Setup input
        this.setupInput();
    }

    create() {
        // Glow effect (outer ring)
        this.glow = this.scene.add.circle(this.x, this.y, this.radius + 8, 0x00ffff, 0.3);
        this.glow.setScrollFactor(0);
        this.glow.setDepth(999);

        // Pulse animation for glow
        this.scene.tweens.add({
            targets: this.glow,
            alpha: 0.5,
            scale: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Base circle (outer)
        this.base = this.scene.add.circle(this.x, this.y, this.radius, 0x000000, 0.5);
        this.base.setStrokeStyle(3, 0x00ffff, 0.8);
        this.base.setScrollFactor(0);
        this.base.setDepth(1000);

        // Directional arrows
        const arrowOffset = this.radius - 15;
        const arrowStyle = {
            font: 'bold 18px Arial',
            fill: '#00ffff'
        };

        // Up arrow
        this.arrowUp = this.scene.add.text(this.x, this.y - arrowOffset, '▲', arrowStyle);
        this.arrowUp.setOrigin(0.5);
        this.arrowUp.setScrollFactor(0);
        this.arrowUp.setDepth(1000);
        this.arrowUp.setAlpha(0.8);

        // Down arrow
        this.arrowDown = this.scene.add.text(this.x, this.y + arrowOffset, '▼', arrowStyle);
        this.arrowDown.setOrigin(0.5);
        this.arrowDown.setScrollFactor(0);
        this.arrowDown.setDepth(1000);
        this.arrowDown.setAlpha(0.8);

        // Left arrow
        this.arrowLeft = this.scene.add.text(this.x - arrowOffset, this.y, '◀', arrowStyle);
        this.arrowLeft.setOrigin(0.5);
        this.arrowLeft.setScrollFactor(0);
        this.arrowLeft.setDepth(1000);
        this.arrowLeft.setAlpha(0.8);

        // Right arrow
        this.arrowRight = this.scene.add.text(this.x + arrowOffset, this.y, '▶', arrowStyle);
        this.arrowRight.setOrigin(0.5);
        this.arrowRight.setScrollFactor(0);
        this.arrowRight.setDepth(1000);
        this.arrowRight.setAlpha(0.8);

        // Thumb circle (inner)
        this.thumb = this.scene.add.circle(this.x, this.y, this.thumbRadius, 0xffffff, 0.8);
        this.thumb.setStrokeStyle(2, 0x00ffff, 1);
        this.thumb.setScrollFactor(0);
        this.thumb.setDepth(1001);

        // Always show on mobile, hide on desktop
        if (this.scene.sys.game.device.input.touch) {
            this.show();
        } else {
            this.hide();
        }
    }

    setupInput() {
        this.scene.input.on('pointerdown', (pointer) => {
            // Get world position from pointer
            const worldX = pointer.worldX;
            const worldY = pointer.worldY;

            // Check if pointer is near the joystick
            const distance = Phaser.Math.Distance.Between(
                worldX, worldY,
                this.x, this.y
            );

            if (distance < this.radius * 1.5) {
                this.isActive = true;
                this.pointer = pointer;
                this.show();
            }
        });

        this.scene.input.on('pointermove', (pointer) => {
            if (this.isActive && this.pointer === pointer) {
                this.updateThumb(pointer);
            }
        });

        this.scene.input.on('pointerup', (pointer) => {
            if (this.pointer === pointer) {
                this.reset();
            }
        });
    }

    updateThumb(pointer) {
        // Get world position from pointer
        const worldX = pointer.worldX;
        const worldY = pointer.worldY;

        // Calculate direction
        const deltaX = worldX - this.x;
        const deltaY = worldY - this.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > 0) {
            // Normalize direction
            let normalizedX = deltaX / distance;
            let normalizedY = deltaY / distance;

            // Limit thumb to base radius
            const clampedDistance = Math.min(distance, this.radius - this.thumbRadius);

            // Update thumb position
            this.thumb.x = this.x + normalizedX * clampedDistance;
            this.thumb.y = this.y + normalizedY * clampedDistance;

            // Update direction (for player movement)
            this.direction.x = normalizedX;
            this.direction.y = normalizedY;

            // Highlight active direction arrows
            this.highlightArrows(normalizedX, normalizedY);
        }
    }

    highlightArrows(dirX, dirY) {
        // Reset all arrows
        this.arrowUp.setAlpha(0.4);
        this.arrowDown.setAlpha(0.4);
        this.arrowLeft.setAlpha(0.4);
        this.arrowRight.setAlpha(0.4);

        // Highlight based on direction
        if (dirY < -0.3) this.arrowUp.setAlpha(1);
        if (dirY > 0.3) this.arrowDown.setAlpha(1);
        if (dirX < -0.3) this.arrowLeft.setAlpha(1);
        if (dirX > 0.3) this.arrowRight.setAlpha(1);
    }

    reset() {
        this.isActive = false;
        this.pointer = null;
        this.direction = { x: 0, y: 0 };

        // Return thumb to center
        this.thumb.x = this.x;
        this.thumb.y = this.y;

        // Reset arrow highlights
        this.arrowUp.setAlpha(0.8);
        this.arrowDown.setAlpha(0.8);
        this.arrowLeft.setAlpha(0.8);
        this.arrowRight.setAlpha(0.8);

        // Hide on desktop after use
        if (!this.scene.sys.game.device.input.touch) {
            this.hide();
        }
    }

    show() {
        this.glow.setVisible(true);
        this.base.setAlpha(0.5);
        this.thumb.setAlpha(0.8);
        this.arrowUp.setVisible(true);
        this.arrowDown.setVisible(true);
        this.arrowLeft.setVisible(true);
        this.arrowRight.setVisible(true);
    }

    hide() {
        this.glow.setVisible(false);
        this.base.setAlpha(0);
        this.thumb.setAlpha(0);
        this.arrowUp.setVisible(false);
        this.arrowDown.setVisible(false);
        this.arrowLeft.setVisible(false);
        this.arrowRight.setVisible(false);
    }

    destroy() {
        this.glow.destroy();
        this.base.destroy();
        this.thumb.destroy();
        this.arrowUp.destroy();
        this.arrowDown.destroy();
        this.arrowLeft.destroy();
        this.arrowRight.destroy();
    }
}
