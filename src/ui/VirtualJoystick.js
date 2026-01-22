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
        // Base circle (outer)
        this.base = this.scene.add.circle(this.x, this.y, this.radius, 0x000000, 0.3);
        this.base.setStrokeStyle(3, 0xffffff, 0.5);
        this.base.setScrollFactor(0);
        this.base.setDepth(1000);

        // Thumb circle (inner)
        this.thumb = this.scene.add.circle(this.x, this.y, this.thumbRadius, 0xffffff, 0.6);
        this.thumb.setStrokeStyle(2, 0xffffff, 0.8);
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
        }
    }

    reset() {
        this.isActive = false;
        this.pointer = null;
        this.direction = { x: 0, y: 0 };

        // Return thumb to center
        this.thumb.x = this.x;
        this.thumb.y = this.y;

        // Hide on desktop after use
        if (!this.scene.sys.game.device.input.touch) {
            this.hide();
        }
    }

    show() {
        this.base.setAlpha(0.3);
        this.thumb.setAlpha(0.6);
    }

    hide() {
        this.base.setAlpha(0);
        this.thumb.setAlpha(0);
    }

    destroy() {
        this.base.destroy();
        this.thumb.destroy();
    }
}
