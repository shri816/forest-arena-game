class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        // Get adaptive dimensions
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const isPortrait = height > width;

        // Adaptive positioning
        const titleY = isPortrait ? height * 0.2 : height * 0.35;
        const subtitleY = isPortrait ? height * 0.32 : height * 0.55;
        const highScoreY = isPortrait ? height * 0.4 : height * 0.65;
        const instructY = isPortrait ? height * 0.65 : height * 0.75;
        const controlsY = isPortrait ? height * 0.92 : height * 0.94;

        // Adaptive font sizes
        const titleSize = isPortrait ? 60 : 80;
        const subtitleSize = isPortrait ? 26 : 32;
        const highScoreSize = isPortrait ? 18 : 20;
        const instructSize = isPortrait ? 22 : 24;
        const controlsSize = isPortrait ? 12 : 14;

        // Background gradient
        const bg = this.add.rectangle(centerX, centerY, width, height, 0x1a1a2e);
        bg.setDepth(0);

        // Forest background (blurred/dark)
        const background = this.add.image(centerX, centerY, 'background');
        background.setDisplaySize(width, height);
        background.setAlpha(0.3);
        background.setTint(0x666666);

        // Game Title
        const title = this.add.text(centerX, titleY, 'FOREST\nARENA', {
            font: `bold ${titleSize}px Arial`,
            fill: '#2ECC71',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center',
            lineSpacing: isPortrait ? 5 : 10
        });
        title.setOrigin(0.5);

        // Subtitle
        const subtitle = this.add.text(centerX, subtitleY, 'HACK & SLASH', {
            font: `bold ${subtitleSize}px Arial`,
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        });
        subtitle.setOrigin(0.5);

        // Instructions
        const isMobile = this.sys.game.device.input.touch;
        const instructText = isMobile ? 'TAP TO START' : 'PRESS SPACE OR TAP TO START';
        const instructions = this.add.text(centerX, instructY, instructText, {
            font: `bold ${instructSize}px Arial`,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });
        instructions.setOrigin(0.5);

        // Blink animation
        this.tweens.add({
            targets: instructions,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Pulse animation for title
        this.tweens.add({
            targets: title,
            scale: 1.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Controls info at bottom
        if (!isMobile) {
            const controls = this.add.text(centerX, controlsY,
                'WASD/ARROWS: Move  |  SPACE: Attack  |  SHIFT: Dash',
                {
                    font: `${isPortrait ? 10 : 16}px Arial`,
                    fill: '#888888',
                    align: 'center'
                }
            );
            controls.setOrigin(0.5);
        } else {
            const controls = this.add.text(centerX, controlsY,
                'Use Joystick to Move  |  Tap Buttons to Attack',
                {
                    font: `${controlsSize}px Arial`,
                    fill: '#888888',
                    align: 'center'
                }
            );
            controls.setOrigin(0.5);
        }

        // High score display
        if (gameState.highScore > 0) {
            const highScoreText = this.add.text(centerX, highScoreY,
                `Best Score: ${gameState.highScore}`,
                {
                    font: `bold ${highScoreSize}px Arial`,
                    fill: '#FFD700',
                    stroke: '#000000',
                    strokeThickness: 3
                }
            );
            highScoreText.setOrigin(0.5);
        }

        // Start game on space
        this.input.keyboard.once('keydown-SPACE', () => {
            this.startGame();
        });

        // Start game on tap/click
        this.input.once('pointerdown', () => {
            this.startGame();
        });
    }

    startGame() {
        this.cameras.main.fade(300, 0, 0, 0);
        this.time.delayedCall(300, () => {
            this.scene.start('ArenaScene');
        });
    }
}
