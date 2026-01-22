class ArenaScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ArenaScene' });
    }

    create() {
        // Get adaptive dimensions
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const isPortrait = height > width;

        // Arena properties - centered on screen
        this.arenaRadius = isPortrait ? 280 : 360;
        this.arenaCenter = { x: width / 2, y: isPortrait ? height * 0.45 : height / 2 };

        // Store layout info
        this.isPortrait = isPortrait;
        this.gameWidth = width;
        this.gameHeight = height;

        // Game state
        this.currentWave = 1;
        this.enemiesRemaining = 0;
        this.waveInProgress = false;
        this.gameActive = true;
        this.gameStarted = true; // Allow controls immediately

        // Combo system
        this.comboCount = 0;
        this.comboTimer = null;
        this.comboTimeout = 3000; // 3 seconds

        // Set world bounds
        this.physics.world.setBounds(0, 0, width, height);

        // Create background
        this.createBackground();

        // Create arena boundary
        this.createArenaBoundary();

        // Create player at center
        this.player = new ArenaPlayer(this, this.arenaCenter.x, this.arenaCenter.y);

        // Create enemies group
        this.enemies = this.physics.add.group();

        // Setup collisions
        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.handlePlayerEnemyCollision,
            null,
            this
        );

        // Create HUD
        this.hud = new ArenaHUD(this);

        // Create mobile controls
        if (this.sys.game.device.input.touch) {
            this.createMobileControls();
        }

        // Initialize score
        gameState.score = 0;
        gameState.wave = 1;
        gameState.kills = 0;
        gameState.combo = 0;
        gameState.maxCombo = 0; // Track max combo for analytics

        // Track game start
        if (window.gameAnalytics) {
            window.gameAnalytics.trackGameStart();
        }

        // Start first wave after a short delay
        this.time.delayedCall(1500, () => {
            this.startWave(1);
        });
    }

    showStartMessage() {
        const startText = this.add.text(640, 360, 'CLICK OR PRESS ANY KEY', {
            font: 'bold 40px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        });
        startText.setOrigin(0.5);
        startText.setScrollFactor(0);
        startText.setDepth(1000);

        // Blink animation
        this.tweens.add({
            targets: startText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Remove on any input
        const removeStart = () => {
            if (startText.active) {
                startText.destroy();
                this.gameStarted = true;
            }
        };

        // Keyboard input
        if (this.input.keyboard) {
            this.input.keyboard.once('keydown', removeStart);
        }

        // Mouse/touch input
        this.input.once('pointerdown', removeStart);
    }

    createBackground() {
        // Forest background - adaptive
        this.background = this.add.image(this.gameWidth / 2, this.gameHeight / 2, 'background');
        this.background.setDisplaySize(this.gameWidth, this.gameHeight);
        this.background.setAlpha(0.7);

        // Add decorative trees - adaptive positioning
        if (this.isPortrait) {
            // Portrait: trees on left and right sides
            const treePositions = [
                { x: 60, y: 200 }, { x: this.gameWidth - 60, y: 200 },
                { x: 60, y: this.gameHeight * 0.5 }, { x: this.gameWidth - 60, y: this.gameHeight * 0.5 },
                { x: 60, y: this.gameHeight - 300 }, { x: this.gameWidth - 60, y: this.gameHeight - 300 }
            ];
            treePositions.forEach(pos => {
                const tree = this.add.image(pos.x, pos.y, 'green-tree');
                tree.setScale(0.2);
                tree.setAlpha(0.6);
            });

            // Rocks
            const rockPositions = [
                { x: this.gameWidth * 0.2, y: 250 }, { x: this.gameWidth * 0.8, y: 250 },
                { x: this.gameWidth * 0.2, y: this.gameHeight - 250 }, { x: this.gameWidth * 0.8, y: this.gameHeight - 250 }
            ];
            rockPositions.forEach(pos => {
                const rock = this.add.image(pos.x, pos.y, 'props-rocks');
                rock.setScale(0.8);
                rock.setAlpha(0.7);
            });
        } else {
            // Landscape: trees around all edges
            const treePositions = [
                { x: 100, y: 100 }, { x: this.gameWidth - 100, y: 100 },
                { x: 100, y: this.gameHeight - 100 }, { x: this.gameWidth - 100, y: this.gameHeight - 100 },
                { x: this.gameWidth / 2, y: 50 }, { x: this.gameWidth / 2, y: this.gameHeight - 50 }
            ];
            treePositions.forEach(pos => {
                const tree = this.add.image(pos.x, pos.y, 'green-tree');
                tree.setScale(0.25);
                tree.setAlpha(0.6);
            });

            // Rocks
            const rockPositions = [
                { x: 200, y: 200 }, { x: this.gameWidth - 200, y: 200 },
                { x: 200, y: this.gameHeight - 120 }, { x: this.gameWidth - 200, y: this.gameHeight - 120 }
            ];
            rockPositions.forEach(pos => {
                const rock = this.add.image(pos.x, pos.y, 'props-rocks');
                rock.setScale(1.2);
                rock.setAlpha(0.7);
            });
        }
    }

    createArenaBoundary() {
        // Draw circle boundary (visual only)
        const graphics = this.add.graphics();
        graphics.lineStyle(5, 0x8B4513, 1);
        graphics.strokeCircle(this.arenaCenter.x, this.arenaCenter.y, this.arenaRadius);

        // SIMPLIFIED: Use a circular collider approach
        // Create an invisible sprite for circular boundary checking
        // We'll handle this in the update loop instead to keep entities inside
        this.boundaryCheck = true;
    }

    createMobileControls() {
        // Adaptive positioning based on layout
        if (this.isPortrait) {
            // Portrait: controls at bottom
            const joystickX = 100;
            const joystickY = this.gameHeight - 120;
            this.virtualJoystick = new VirtualJoystick(this, joystickX, joystickY);

            const attackX = this.gameWidth - 100;
            const attackY = this.gameHeight - 120;
            this.attackButton = new TouchButton(
                this,
                attackX,
                attackY,
                60,
                '⚔️',
                0xff0000,
                () => {
                    if (this.player) {
                        this.player.attack();
                    }
                }
            );

            const dashX = this.gameWidth - 100;
            const dashY = this.gameHeight - 220;
            this.dashButton = new TouchButton(
                this,
                dashX,
                dashY,
                50,
                '💨',
                0x00aaff,
                () => {
                    if (this.player) {
                        this.player.dash();
                    }
                }
            );
        } else {
            // Landscape: controls as before
            const joystickX = 120;
            const joystickY = this.gameHeight - 100;
            this.virtualJoystick = new VirtualJoystick(this, joystickX, joystickY);

            const attackX = this.gameWidth - 140;
            const attackY = this.gameHeight - 110;
            this.attackButton = new TouchButton(
                this,
                attackX,
                attackY,
                55,
                '⚔️',
                0xff0000,
                () => {
                    if (this.player) {
                        this.player.attack();
                    }
                }
            );

            const dashX = this.gameWidth - 100;
            const dashY = this.gameHeight - 200;
            this.dashButton = new TouchButton(
                this,
                dashX,
                dashY,
                45,
                '💨',
                0x00aaff,
                () => {
                    if (this.player) {
                        this.player.dash();
                    }
                }
            );
        }
    }

    startWave(waveNumber) {
        this.currentWave = waveNumber;
        this.waveInProgress = true;
        gameState.wave = waveNumber;

        // Update HUD
        this.hud.updateWave(waveNumber);
        this.hud.showMessage(`WAVE ${waveNumber}`, 1500);

        // Calculate enemy count and types
        const enemyCount = this.getEnemyCountForWave(waveNumber);
        const enemyTypes = this.getEnemyTypesForWave(waveNumber);

        this.enemiesRemaining = enemyCount;

        // Spawn enemies around the arena
        for (let i = 0; i < enemyCount; i++) {
            this.time.delayedCall(i * 200, () => {
                this.spawnRandomEnemy(enemyTypes);
            });
        }
    }

    getEnemyCountForWave(wave) {
        if (wave <= 3) return 3 + (wave - 1) * 2; // 3, 5, 7
        if (wave <= 6) return 8 + (wave - 4) * 2; // 10, 12
        if (wave <= 10) return 15 + (wave - 7) * 3; // 15, 18, 20, 25
        return 25 + (wave - 10) * 5; // Scaling for endless waves
    }

    getEnemyTypesForWave(wave) {
        if (wave <= 3) return ['snail'];
        if (wave <= 6) return ['snail', 'boar'];
        return ['snail', 'boar', 'bee']; // All types from wave 7+
    }

    spawnRandomEnemy(types) {
        // Random type from available types
        const type = Phaser.Utils.Array.GetRandom(types);

        // Random position around arena edge
        const angle = Math.random() * Math.PI * 2;
        const spawnRadius = this.arenaRadius - 50;
        const x = this.arenaCenter.x + Math.cos(angle) * spawnRadius;
        const y = this.arenaCenter.y + Math.sin(angle) * spawnRadius;

        const enemy = new ArenaEnemy(this, x, y, type);
        this.enemies.add(enemy);
    }

    handlePlayerEnemyCollision(player, enemy) {
        if (!enemy.isDead && !player.isDead && !player.isDashing) {
            player.takeDamage(enemy.damage);
        }
    }

    addScore(points, enemyType = 'unknown') {
        // Apply combo multiplier
        const multiplier = this.getComboMultiplier();
        const finalPoints = points * multiplier;

        gameState.score += finalPoints;
        gameState.kills++;
        this.hud.updateScore(gameState.score);

        // Track enemy kill
        if (window.gameAnalytics) {
            window.gameAnalytics.trackEnemyKill(enemyType, finalPoints, this.comboCount);
        }

        // Decrement enemies remaining
        this.enemiesRemaining--;

        if (this.enemiesRemaining <= 0 && this.waveInProgress) {
            this.completeWave();
        }
    }

    incrementCombo() {
        this.comboCount++;
        gameState.combo = this.comboCount;

        // Track max combo
        if (this.comboCount > gameState.maxCombo) {
            gameState.maxCombo = this.comboCount;
        }

        // Update HUD
        this.hud.updateCombo(this.comboCount);

        // Track combo achievement
        if (window.gameAnalytics && this.comboCount >= 5) {
            window.gameAnalytics.trackCombo(this.comboCount, gameState.score);
        }

        // Reset combo timer
        if (this.comboTimer) {
            this.comboTimer.remove();
        }

        this.comboTimer = this.time.delayedCall(this.comboTimeout, () => {
            this.resetCombo();
        });
    }

    resetCombo() {
        this.comboCount = 0;
        gameState.combo = 0;
        this.hud.updateCombo(0);
    }

    getComboMultiplier() {
        if (this.comboCount >= 11) return 10;
        if (this.comboCount >= 7) return 5;
        if (this.comboCount >= 4) return 3;
        if (this.comboCount >= 2) return 2;
        return 1;
    }

    completeWave() {
        this.waveInProgress = false;

        // Wave complete bonus
        const waveBonus = 100 * this.currentWave;
        gameState.score += waveBonus;
        this.hud.updateScore(gameState.score);

        // Track wave completion
        if (window.gameAnalytics) {
            window.gameAnalytics.trackWaveComplete(
                this.currentWave,
                gameState.score,
                gameState.kills
            );
        }

        // Show wave complete message
        this.hud.showMessage(`WAVE COMPLETE!\n+${waveBonus} Bonus`, 2000);

        // Heal player 1 HP
        if (this.player) {
            this.player.heal(1);
        }

        // Start next wave after delay
        this.time.delayedCall(3000, () => {
            this.startWave(this.currentWave + 1);
        });
    }

    spawnPowerUp(x, y) {
        // TODO: Implement power-ups in next phase
        // For now, just add score bonus
        gameState.score += 50;
        this.hud.updateScore(gameState.score);
    }

    gameOver() {
        if (!this.gameActive) return;

        this.gameActive = false;

        // Track game over with stats
        if (window.gameAnalytics) {
            const previousHighScore = gameState.highScore;
            const isNewHighScore = gameState.score > previousHighScore;

            window.gameAnalytics.trackGameOver({
                score: gameState.score,
                wave: this.currentWave,
                kills: gameState.kills,
                maxCombo: gameState.maxCombo,
                isNewHighScore: isNewHighScore,
                previousHighScore: previousHighScore
            });
        }

        // Stop all enemies
        this.enemies.children.entries.forEach(enemy => {
            enemy.setVelocity(0, 0);
            enemy.isDead = true;
        });

        // Show game over screen
        this.showGameOverScreen();
    }

    showGameOverScreen() {
        // Use adaptive dimensions
        const width = this.gameWidth;
        const height = this.gameHeight;
        const centerX = width / 2;
        const centerY = height / 2;

        // Darken screen
        const overlay = this.add.rectangle(centerX, centerY, width, height, 0x000000, 0.8);
        overlay.setScrollFactor(0);
        overlay.setDepth(500);
        overlay.setInteractive();

        // Adaptive positioning
        const gameOverY = this.isPortrait ? height * 0.15 : height * 0.25;
        const statsY = this.isPortrait ? height * 0.35 : height * 0.45;
        const restartY = this.isPortrait ? height * 0.75 : height * 0.7;
        const menuY = this.isPortrait ? height * 0.83 : height * 0.82;

        // Adaptive font sizes
        const titleSize = this.isPortrait ? 60 : 80;
        const statsSize = this.isPortrait ? 26 : 32;
        const buttonSize = this.isPortrait ? 24 : 28;
        const menuSize = this.isPortrait ? 18 : 20;

        // Game Over text
        const gameOverText = this.add.text(centerX, gameOverY, 'GAME OVER', {
            font: `bold ${titleSize}px Arial`,
            fill: '#FF0000',
            stroke: '#000000',
            strokeThickness: 8
        });
        gameOverText.setOrigin(0.5);
        gameOverText.setScrollFactor(0);
        gameOverText.setDepth(501);

        // Final stats
        const statsText = this.add.text(centerX, statsY,
            `Final Score: ${gameState.score}\nWave Reached: ${this.currentWave}\nHighest Score: ${gameState.highScore}`,
            {
                font: `bold ${statsSize}px Arial`,
                fill: '#ffffff',
                align: 'center',
                lineSpacing: this.isPortrait ? 10 : 5
            }
        );
        statsText.setOrigin(0.5);
        statsText.setScrollFactor(0);
        statsText.setDepth(501);

        // Restart instructions
        const isMobile = this.sys.game.device.input.touch;
        const restartText = this.add.text(
            centerX,
            restartY,
            isMobile ? 'TAP TO PLAY AGAIN' : 'SPACE: Play Again  |  ESC: Menu',
            {
                font: `bold ${buttonSize}px Arial`,
                fill: '#FFD700',
                align: 'center'
            }
        );
        restartText.setOrigin(0.5);
        restartText.setScrollFactor(0);
        restartText.setDepth(501);

        // Menu button for mobile
        if (isMobile) {
            const menuText = this.add.text(
                centerX,
                menuY,
                'or TAP HERE for Menu',
                {
                    font: `${menuSize}px Arial`,
                    fill: '#888888'
                }
            );
            menuText.setOrigin(0.5);
            menuText.setScrollFactor(0);
            menuText.setDepth(502);
            menuText.setInteractive();

            menuText.on('pointerdown', () => {
                this.scene.start('TitleScene');
            });

            menuText.on('pointerover', () => {
                menuText.setFill('#ffffff');
            });
            menuText.on('pointerout', () => {
                menuText.setFill('#888888');
            });
        }

        // Blink restart text
        this.tweens.add({
            targets: restartText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Enable restart with keyboard
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.restart();
        });

        // ESC to go back to menu
        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.start('TitleScene');
        });

        // Enable restart with touch (for all devices)
        overlay.once('pointerdown', () => {
            this.scene.restart();
        });
    }

    update(time, delta) {
        if (!this.gameActive) return;

        // Update player
        if (this.player && !this.player.isDead) {
            this.player.update();

            // Keep player inside arena boundary
            const distFromCenter = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                this.arenaCenter.x, this.arenaCenter.y
            );

            if (distFromCenter > this.arenaRadius - 30) {
                // Push player back inside
                const angle = Phaser.Math.Angle.Between(
                    this.arenaCenter.x, this.arenaCenter.y,
                    this.player.x, this.player.y
                );
                this.player.x = this.arenaCenter.x + Math.cos(angle) * (this.arenaRadius - 30);
                this.player.y = this.arenaCenter.y + Math.sin(angle) * (this.arenaRadius - 30);
            }
        }

        // Update enemies
        if (this.enemies) {
            this.enemies.children.entries.forEach(enemy => {
                if (enemy.update) {
                    enemy.update(time, delta);
                }

                // Keep enemies inside arena boundary
                const distFromCenter = Phaser.Math.Distance.Between(
                    enemy.x, enemy.y,
                    this.arenaCenter.x, this.arenaCenter.y
                );

                if (distFromCenter > this.arenaRadius - 40) {
                    // Turn enemies around at boundary
                    const angle = Phaser.Math.Angle.Between(
                        enemy.x, enemy.y,
                        this.arenaCenter.x, this.arenaCenter.y
                    );
                    enemy.setVelocity(
                        Math.cos(angle) * enemy.speed,
                        Math.sin(angle) * enemy.speed
                    );
                }
            });
        }
    }
}
