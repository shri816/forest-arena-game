// Main game initialization for Arena Fighter
config.scene = [BootScene, TitleScene, ArenaScene];

const game = new Phaser.Game(config);

// Global game state
const gameState = {
    score: 0,
    highScore: localStorage.getItem('arenaHighScore') || 0,
    wave: 1,
    kills: 0,
    combo: 0,
    comboTimer: 0
};
