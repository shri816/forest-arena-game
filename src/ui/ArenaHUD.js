class ArenaHUD {
    constructor(scene) {
        this.scene = scene;

        // Detect if mobile
        this.isMobile = scene.sys.game.device.input.touch;

        // Create HUD elements
        this.createHUD();
    }

    createHUD() {
        // Get adaptive dimensions from scene
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        const isPortrait = height > width;
        const padding = 20;
        const topY = padding;

        // Adaptive font sizes
        const labelSize = isPortrait ? 14 : 18;
        const textSize = isPortrait ? 20 : 24;
        const waveSize = isPortrait ? 26 : 32;
        const comboSize = isPortrait ? 32 : 40;

        // Background panel
        this.bgPanel = this.scene.add.rectangle(
            width / 2,
            topY + 40,
            width - padding * 2,
            80,
            0x000000,
            0.5
        );
        this.bgPanel.setScrollFactor(0);
        this.bgPanel.setDepth(100);

        // Health display
        this.healthLabel = this.scene.add.text(padding + 10, topY + 15, 'HEALTH:', {
            font: `bold ${labelSize}px Arial`,
            fill: '#ffffff'
        });
        this.healthLabel.setScrollFactor(0);
        this.healthLabel.setDepth(101);

        this.healthText = this.scene.add.text(padding + 10, topY + 40, '♥ ♥ ♥ ♥ ♥', {
            font: `${textSize}px Arial`,
            fill: '#FF1744'
        });
        this.healthText.setScrollFactor(0);
        this.healthText.setDepth(101);

        // Wave display (center)
        this.waveText = this.scene.add.text(
            width / 2,
            topY + 30,
            'WAVE 1',
            {
                font: `bold ${waveSize}px Arial`,
                fill: '#FFD700',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        this.waveText.setOrigin(0.5);
        this.waveText.setScrollFactor(0);
        this.waveText.setDepth(101);

        // Score display (right side)
        const rightX = width - padding - 10;

        this.scoreLabel = this.scene.add.text(rightX, topY + 15, 'SCORE:', {
            font: `bold ${labelSize}px Arial`,
            fill: '#ffffff'
        });
        this.scoreLabel.setOrigin(1, 0);
        this.scoreLabel.setScrollFactor(0);
        this.scoreLabel.setDepth(101);

        this.scoreText = this.scene.add.text(rightX, topY + 40, '0', {
            font: `${textSize}px Arial`,
            fill: '#FFD700'
        });
        this.scoreText.setOrigin(1, 0);
        this.scoreText.setScrollFactor(0);
        this.scoreText.setDepth(101);

        // Combo display (appears when active)
        this.comboText = this.scene.add.text(
            width / 2,
            topY + 90,
            '',
            {
                font: `bold ${comboSize}px Arial`,
                fill: '#FF6B6B',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        this.comboText.setOrigin(0.5);
        this.comboText.setScrollFactor(0);
        this.comboText.setDepth(101);
        this.comboText.setVisible(false);

        // High score display (top right, smaller)
        this.highScoreText = this.scene.add.text(rightX, topY + 70, `BEST: ${gameState.highScore}`, {
            font: `${Math.min(16, width * 0.022)}px Arial`,
            fill: '#888888'
        });
        this.highScoreText.setOrigin(1, 0);
        this.highScoreText.setScrollFactor(0);
        this.highScoreText.setDepth(101);
    }

    updateHealth(health) {
        let heartsDisplay = '';
        for (let i = 0; i < health; i++) {
            heartsDisplay += '♥ ';
        }
        // Show empty hearts for missing health
        for (let i = health; i < 5; i++) {
            heartsDisplay += '♡ ';
        }
        this.healthText.setText(heartsDisplay.trim());
    }

    updateScore(score) {
        this.scoreText.setText(score.toString());

        // Check if new high score
        if (score > gameState.highScore) {
            gameState.highScore = score;
            localStorage.setItem('arenaHighScore', score);
            this.highScoreText.setText(`BEST: ${score}`);
            this.highScoreText.setFill('#FFD700'); // Gold for new high score
        }
    }

    updateWave(wave) {
        this.waveText.setText(`WAVE ${wave}`);

        // Animate wave change
        this.scene.tweens.add({
            targets: this.waveText,
            scale: 1.3,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });
    }

    updateCombo(combo) {
        if (combo > 1) {
            this.comboText.setText(`COMBO x${combo}!`);
            this.comboText.setVisible(true);

            // Change color based on combo level
            if (combo >= 10) {
                this.comboText.setFill('#FF0000'); // Red for 10+
            } else if (combo >= 7) {
                this.comboText.setFill('#FF6B00'); // Orange for 7+
            } else if (combo >= 4) {
                this.comboText.setFill('#FFD700'); // Gold for 4+
            } else {
                this.comboText.setFill('#FFFFFF'); // White for 2-3
            }

            // Pulse animation
            this.scene.tweens.add({
                targets: this.comboText,
                scale: 1.2,
                duration: 100,
                yoyo: true,
                ease: 'Power2'
            });
        } else {
            this.comboText.setVisible(false);
        }
    }

    updateDashCooldown(ready) {
        // This will be connected to the dash button
        if (this.scene.dashButton) {
            if (ready) {
                this.scene.dashButton.hideCooldown();
            } else {
                this.scene.dashButton.showCooldown();
            }
        }
    }

    showMessage(message, duration = 2000) {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        const isPortrait = height > width;
        const fontSize = isPortrait ? 36 : 48;

        const messageText = this.scene.add.text(
            width / 2,
            height / 2,
            message,
            {
                font: `bold ${fontSize}px Arial`,
                fill: '#FFD700',
                stroke: '#000000',
                strokeThickness: 6,
                align: 'center'
            }
        );
        messageText.setOrigin(0.5);
        messageText.setScrollFactor(0);
        messageText.setDepth(200);

        // Fade out and destroy
        this.scene.tweens.add({
            targets: messageText,
            alpha: 0,
            duration: duration,
            onComplete: () => messageText.destroy()
        });
    }

    destroy() {
        this.bgPanel.destroy();
        this.healthLabel.destroy();
        this.healthText.destroy();
        this.waveText.destroy();
        this.scoreLabel.destroy();
        this.scoreText.destroy();
        this.comboText.destroy();
        this.highScoreText.destroy();
    }
}
