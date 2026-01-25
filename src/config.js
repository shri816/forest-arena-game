// Detect if mobile portrait
function isMobilePortrait() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isPortrait = window.innerHeight > window.innerWidth;
    return isMobile && isPortrait;
}

// Set adaptive dimensions
const gameLayout = isMobilePortrait() ? {
    width: 720,
    height: 1280,
    orientation: 'portrait'
} : {
    width: 1280,
    height: 720,
    orientation: 'landscape'
};

// Game configuration for Arena Fighter
const config = {
    type: Phaser.AUTO,
    width: gameLayout.width,
    height: gameLayout.height,
    parent: 'game-container',
    backgroundColor: '#2d5016',
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    input: {
        activePointers: 3  // Enable multi-touch (joystick + attack + dash)
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: gameLayout.width,
        height: gameLayout.height
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // No gravity for top-down
            debug: false // Set to true to see hitboxes
        }
    },
    scene: [] // Will be populated in main.js
};
