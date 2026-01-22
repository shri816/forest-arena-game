// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#87CEEB',
    pixelArt: true, // Crisp pixel art rendering
    antialias: false,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false // Set to true for collision debugging
        }
    },
    scene: [] // Will be populated in main.js
};
