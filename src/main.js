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
    comboTimer: 0,
    maxCombo: 0
};

// Initialize Google Analytics
if (window.gameAnalytics) {
    // Only initialize if not on localhost (to avoid tracking during development)
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    if (isProduction) {
        window.gameAnalytics.initGA('G-68SVMHVFTK');
    } else {
        console.log('Analytics disabled for local development');
    }
}
