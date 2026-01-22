class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '20px Arial',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.add.text(width / 2, height / 2, '0%', {
            font: '18px Arial',
            fill: '#ffffff'
        });
        percentText.setOrigin(0.5, 0.5);

        // Update progress bar
        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        // Load character sprite sheets (64x80 per frame)
        this.load.spritesheet('player-idle',
            'Legacy-Fantasy - High Forest 2.3/Character/Idle/Idle-Sheet.png',
            { frameWidth: 64, frameHeight: 80 }
        );

        this.load.spritesheet('player-run',
            'Legacy-Fantasy - High Forest 2.3/Character/Run/Run-Sheet.png',
            { frameWidth: 80, frameHeight: 80 }
        );

        this.load.spritesheet('player-jump',
            'Legacy-Fantasy - High Forest 2.3/Character/Jumlp-All/Jump-All-Sheet.png',
            { frameWidth: 64, frameHeight: 64 }
        );

        this.load.spritesheet('player-dead',
            'Legacy-Fantasy - High Forest 2.3/Character/Dead/Dead-Sheet.png',
            { frameWidth: 64, frameHeight: 64 }
        );

        // Load enemy sprite sheets
        this.load.spritesheet('snail-walk',
            'Legacy-Fantasy - High Forest 2.3/Mob/Snail/walk-Sheet.png',
            { frameWidth: 32, frameHeight: 32 }
        );

        this.load.spritesheet('snail-dead',
            'Legacy-Fantasy - High Forest 2.3/Mob/Snail/Dead-Sheet.png',
            { frameWidth: 32, frameHeight: 32 }
        );

        // Load environment assets
        this.load.image('tiles', 'Legacy-Fantasy - High Forest 2.3/Assets/Tiles.png');
        this.load.image('background', 'Legacy-Fantasy - High Forest 2.3/Background/Background.png');
        this.load.image('green-tree', 'Legacy-Fantasy - High Forest 2.3/Trees/Green-Tree.png');
        this.load.image('props-rocks', 'Legacy-Fantasy - High Forest 2.3/Assets/Props-Rocks.png');

        // Load HUD assets
        this.load.image('hud-base', 'Legacy-Fantasy - High Forest 2.3/HUD/Base-01.png');
    }

    create() {
        // Create player animations
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player-idle', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player-run', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player-jump', { start: 0, end: 14 }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: 'dead',
            frames: this.anims.generateFrameNumbers('player-dead', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });

        // Create snail animations
        this.anims.create({
            key: 'snail-walk',
            frames: this.anims.generateFrameNumbers('snail-walk', { start: 0, end: 11 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'snail-dead',
            frames: this.anims.generateFrameNumbers('snail-dead', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
        });

        console.log('Assets loaded successfully!');

        // Start the first level
        this.scene.start('Level1Scene');
    }
}
