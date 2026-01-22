class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1Scene' });
    }

    create() {
        // Set world bounds (larger than screen for scrolling)
        this.physics.world.setBounds(0, 0, 3200, 720);

        // Add parallax background
        this.createBackground();

        // Create platforms group
        this.platforms = this.physics.add.staticGroup();

        // Create the level layout
        this.createLevel();

        // Create player
        this.player = new Player(this, 100, 100);

        // Add collision between player and platforms
        this.physics.add.collider(this.player, this.platforms);

        // Setup camera
        this.cameras.main.setBounds(0, 0, 3200, 720);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        // Create enemies group
        this.enemies = this.physics.add.group();

        // Spawn some snails
        this.spawnEnemies();

        // Add collision between enemies and platforms
        this.physics.add.collider(this.enemies, this.platforms);

        // Add overlap between player and enemies
        this.physics.add.overlap(
            this.player,
            this.enemies,
            this.handlePlayerEnemyCollision,
            null,
            this
        );

        // Create goal flag at the end of the level
        this.createGoal();

        // Add overlap between player and goal
        this.physics.add.overlap(
            this.player,
            this.goal,
            this.reachGoal,
            null,
            this
        );

        // Create HUD
        this.hud = new HUD(this);

        // Level complete flag
        this.levelComplete = false;

        console.log('Level 1 Scene created!');
    }

    createBackground() {
        // Sky background (static)
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.background.setScale(2.7, 2.65);
        this.background.setScrollFactor(0);

        // Add trees for parallax effect
        this.treesLayer1 = [];
        for (let i = 0; i < 4; i++) {
            const tree = this.add.image(i * 600, 150, 'green-tree');
            tree.setScale(0.3);
            tree.setScrollFactor(0.2);
            this.treesLayer1.push(tree);
        }
    }

    createLevel() {
        // Ground - main floor
        for (let i = 0; i < 100; i++) {
            const ground = this.platforms.create(i * 32, 680, 'tiles');
            ground.setScale(1);
            ground.setSize(32, 32);
            ground.refreshBody();
        }

        // Starting platform
        this.createPlatform(0, 500, 8);

        // Series of platforms
        this.createPlatform(350, 450, 4);
        this.createPlatform(550, 400, 3);
        this.createPlatform(750, 350, 4);

        // Mid-level section
        this.createPlatform(1000, 500, 6);
        this.createPlatform(1300, 400, 5);

        // Gap section
        this.createPlatform(1650, 450, 3);
        this.createPlatform(1850, 400, 3);

        // Upper section
        this.createPlatform(2050, 300, 5);
        this.createPlatform(2350, 350, 4);

        // Final section
        this.createPlatform(2650, 500, 8);
        this.createPlatform(2900, 400, 6);

        // Add some decorative rocks
        this.add.image(500, 630, 'props-rocks').setScale(1.5);
        this.add.image(1200, 630, 'props-rocks').setScale(1.5);
        this.add.image(2000, 630, 'props-rocks').setScale(1.5);
        this.add.image(2800, 630, 'props-rocks').setScale(1.5);
    }

    createPlatform(x, y, width) {
        for (let i = 0; i < width; i++) {
            const platform = this.platforms.create(x + i * 32, y, 'tiles');
            platform.setScale(1);
            platform.setSize(32, 32);
            platform.refreshBody();
        }
    }

    spawnEnemies() {
        // Spawn snails at various locations
        this.createEnemy(400, 400);
        this.createEnemy(800, 300);
        this.createEnemy(1100, 450);
        this.createEnemy(1700, 400);
        this.createEnemy(2100, 250);
        this.createEnemy(2700, 450);
    }

    createEnemy(x, y) {
        const enemy = new Enemy(this, x, y, 'snail');
        this.enemies.add(enemy);
    }

    createGoal() {
        // Create a goal flag at the end of the level
        const goalX = 3100;
        const goalY = 350;

        // Create goal using building asset as a flag/marker
        this.goal = this.physics.add.sprite(goalX, goalY, 'props-rocks');
        this.goal.setScale(2);
        this.goal.body.setAllowGravity(false);
        this.goal.body.setImmovable(true);

        // Add pulsing animation to make it stand out
        this.tweens.add({
            targets: this.goal,
            scaleX: 2.2,
            scaleY: 2.2,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add glow effect text above the goal
        this.goalText = this.add.text(goalX, goalY - 80, 'GOAL!', {
            font: 'bold 40px Arial',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.goalText.setOrigin(0.5);

        // Animate the text
        this.tweens.add({
            targets: this.goalText,
            y: goalY - 90,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    reachGoal(player, goal) {
        if (!this.levelComplete) {
            this.levelComplete = true;

            // Stop player movement
            player.setVelocity(0, 0);

            // Celebration!
            this.cameras.main.flash(500, 255, 215, 0);

            // Show level complete message
            const completeText = this.add.text(
                this.cameras.main.centerX + this.cameras.main.scrollX,
                this.cameras.main.centerY + this.cameras.main.scrollY - 100,
                'LEVEL COMPLETE!',
                {
                    font: 'bold 60px Arial',
                    fill: '#FFD700',
                    stroke: '#000000',
                    strokeThickness: 6
                }
            );
            completeText.setOrigin(0.5);
            completeText.setScrollFactor(0);

            const scoreText = this.add.text(
                this.cameras.main.centerX + this.cameras.main.scrollX,
                this.cameras.main.centerY + this.cameras.main.scrollY,
                `Score: ${gameState.score}`,
                {
                    font: 'bold 40px Arial',
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 4
                }
            );
            scoreText.setOrigin(0.5);
            scoreText.setScrollFactor(0);

            const restartText = this.add.text(
                this.cameras.main.centerX + this.cameras.main.scrollX,
                this.cameras.main.centerY + this.cameras.main.scrollY + 80,
                'Press SPACE to Restart',
                {
                    font: 'bold 30px Arial',
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 4
                }
            );
            restartText.setOrigin(0.5);
            restartText.setScrollFactor(0);

            // Animate the text
            this.tweens.add({
                targets: [completeText, scoreText],
                scale: 1.1,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // Enable restart
            this.input.keyboard.once('keydown-SPACE', () => {
                gameState.score = 0;
                gameState.lives = 3;
                this.scene.restart();
            });
        }
    }

    handlePlayerEnemyCollision(player, enemy) {
        if (!enemy.isDead && !player.isDead) {
            // Check if player is falling and above the enemy (stomp)
            if (player.body.velocity.y > 0 && player.y < enemy.y - 10) {
                // Stomp the enemy
                enemy.die();
                player.stompEnemy();
            } else {
                // Player takes damage!
                player.takeDamage(1);

                // Knockback for visual feedback
                const knockbackDirection = player.x < enemy.x ? -1 : 1;
                player.setVelocityX(knockbackDirection * 300);
                player.setVelocityY(-250);
            }
        }
    }

    update() {
        if (this.player) {
            this.player.update();
        }

        // Update enemies
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.update) {
                enemy.update();
            }
        });
    }
}
