class HUD {
    constructor(scene) {
        this.scene = scene;

        // Create a container for HUD elements
        this.container = scene.add.container(0, 0);
        this.container.setScrollFactor(0);
        this.container.setDepth(100);

        // Create HUD background panel - wider to fit health
        const hudBg = scene.add.rectangle(20, 20, 500, 80, 0x000000, 0.6);
        hudBg.setOrigin(0, 0);
        this.container.add(hudBg);

        // Score text
        this.scoreLabel = scene.add.text(40, 30, 'SCORE:', {
            font: '18px Arial',
            fill: '#ffffff',
            fontStyle: 'bold'
        });
        this.container.add(this.scoreLabel);

        this.scoreText = scene.add.text(40, 55, '0', {
            font: '22px Arial',
            fill: '#FFD700',
            fontStyle: 'bold'
        });
        this.container.add(this.scoreText);

        // Health text
        this.healthLabel = scene.add.text(170, 30, 'HEALTH:', {
            font: '18px Arial',
            fill: '#ffffff',
            fontStyle: 'bold'
        });
        this.container.add(this.healthLabel);

        this.healthText = scene.add.text(170, 55, '♥ ♥ ♥', {
            font: '22px Arial',
            fill: '#FF1744',
            fontStyle: 'bold'
        });
        this.container.add(this.healthText);

        // Lives text
        this.livesLabel = scene.add.text(340, 30, 'LIVES:', {
            font: '18px Arial',
            fill: '#ffffff',
            fontStyle: 'bold'
        });
        this.container.add(this.livesLabel);

        this.livesText = scene.add.text(340, 55, '♥ ♥ ♥', {
            font: '22px Arial',
            fill: '#00E676',
            fontStyle: 'bold'
        });
        this.container.add(this.livesText);

        // Initialize with current game state
        this.updateScore(gameState.score);
        this.updateLives(gameState.lives);
        this.updateHealth(3); // Default health
    }

    updateScore(score) {
        this.scoreText.setText(score.toString());
    }

    updateHealth(health) {
        let heartsDisplay = '';
        for (let i = 0; i < health; i++) {
            heartsDisplay += '♥ ';
        }
        // Show empty hearts for missing health
        for (let i = health; i < 3; i++) {
            heartsDisplay += '♡ ';
        }
        this.healthText.setText(heartsDisplay.trim());
    }

    updateLives(lives) {
        let heartsDisplay = '';
        for (let i = 0; i < lives; i++) {
            heartsDisplay += '♥ ';
        }
        this.livesText.setText(heartsDisplay.trim());
    }

    destroy() {
        this.container.destroy();
    }
}
