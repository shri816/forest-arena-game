// Main game initialization
config.scene = [BootScene, Level1Scene];

const game = new Phaser.Game(config);

// Global game state
const gameState = {
    score: 0,
    lives: 3,
    currentLevel: 1
};
