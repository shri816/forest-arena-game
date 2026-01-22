class TouchButton {
    constructor(scene, x, y, radius, label, color, callback) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.label = label;
        this.color = color;
        this.callback = callback;
        this.isPressed = false;
        this.enabled = true;

        // Create button
        this.create();

        // Setup input
        this.setupInput();
    }

    create() {
        // Button circle
        this.button = this.scene.add.circle(this.x, this.y, this.radius, this.color, 0.4);
        this.button.setStrokeStyle(3, this.color, 0.8);
        this.button.setScrollFactor(0);
        this.button.setDepth(1000);
        this.button.setInteractive();

        // Button label
        this.text = this.scene.add.text(this.x, this.y, this.label, {
            font: 'bold 20px Arial',
            fill: '#ffffff'
        });
        this.text.setOrigin(0.5);
        this.text.setScrollFactor(0);
        this.text.setDepth(1001);

        // Cooldown overlay (for dash button)
        this.cooldownOverlay = this.scene.add.circle(this.x, this.y, this.radius, 0x000000, 0.6);
        this.cooldownOverlay.setScrollFactor(0);
        this.cooldownOverlay.setDepth(1002);
        this.cooldownOverlay.setVisible(false);

        // Always show on mobile, hide on desktop
        if (this.scene.sys.game.device.input.touch) {
            this.show();
        } else {
            this.hide();
        }
    }

    setupInput() {
        this.button.on('pointerdown', () => {
            if (this.enabled && !this.isPressed) {
                this.onPress();
            }
        });

        this.button.on('pointerup', () => {
            this.onRelease();
        });

        this.button.on('pointerout', () => {
            this.onRelease();
        });
    }

    onPress() {
        this.isPressed = true;

        // Visual feedback
        this.button.setAlpha(0.8);
        this.button.setScale(0.9);

        // Execute callback
        if (this.callback) {
            this.callback();
        }
    }

    onRelease() {
        this.isPressed = false;

        // Reset visual
        this.button.setAlpha(0.4);
        this.button.setScale(1);
    }

    showCooldown() {
        this.cooldownOverlay.setVisible(true);
        this.enabled = false;
    }

    hideCooldown() {
        this.cooldownOverlay.setVisible(false);
        this.enabled = true;
    }

    show() {
        this.button.setAlpha(0.4);
        this.text.setAlpha(1);
    }

    hide() {
        this.button.setAlpha(0);
        this.text.setAlpha(0);
        this.cooldownOverlay.setAlpha(0);
    }

    destroy() {
        this.button.destroy();
        this.text.destroy();
        this.cooldownOverlay.destroy();
    }
}
