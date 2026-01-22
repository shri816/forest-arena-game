# 2D Platformer Game - Technical Specification

## Project Overview
A 2D platformer game inspired by Super Mario, built with Phaser.js using the Legacy-Fantasy High Forest pixel art asset pack.

## Technology Stack
- **Framework**: Phaser.js 3.x (HTML5/JavaScript)
- **Language**: JavaScript (ES6+)
- **Asset Pack**: Legacy-Fantasy - High Forest 2.3
- **Browser Target**: Modern browsers with HTML5 Canvas support

---

## Core Requirements

### 1. Player Mechanics
- Smooth left/right movement with acceleration and deceleration
- Variable jump height (hold jump button for higher jumps)
- Gravity and physics-based movement
- Stomp attack (jump on enemies to defeat them)
- Death and respawn system
- Animation states: idle, run, jump (start/air/land), attack, death

### 2. Enemy System
- Three enemy types with different behaviors:
  - **Snail**: Slow ground patrol enemy
  - **Boar**: Fast charging ground enemy
  - **Bee**: Flying enemy with vertical/horizontal patrol
- Enemies can be defeated by stomping
- Enemies cause damage on side collision
- Death animations and removal

### 3. Collectible System
- Collectible items (gems/coins) scattered throughout levels
- Score tracking
- Sound effects on collection
- Particle effects on collection (optional)

### 4. Power-Up System
- Power-up items spawned at specific locations
- Effects: Speed boost, invincibility, or double jump
- Visual indicator when power-up is active
- Timed duration for power-ups

### 5. Lives and Health System
- Player starts with 3 lives
- Health points per life (3 HP)
- Lose 1 HP on enemy collision
- Lose 1 life on death (fall off map or HP reaches 0)
- Game over screen when all lives lost
- Life and health display in HUD

### 6. Level Design
- Three distinct levels with increasing difficulty
- Platforming challenges (gaps, moving platforms, vertical sections)
- Enemy placement and variety
- Collectible placement
- Clear start and goal/flag at the end
- Parallax background scrolling

### 7. User Interface
- Main menu screen
- HUD displaying:
  - Lives remaining
  - Current health
  - Score/collectibles count
  - Current power-up (if any)
- Level complete screen
- Game over screen
- Pause functionality

### 8. Audio (Optional for MVP)
- Background music per level
- Jump sound
- Enemy stomp sound
- Collectible pickup sound
- Damage/death sound
- Power-up activation sound

---

## Pixel Art Assets

### Character Assets (Player)
```
Legacy-Fantasy - High Forest 2.3/Character/Idle/Idle-Sheet.png
Legacy-Fantasy - High Forest 2.3/Character/Run/Run-Sheet.png
Legacy-Fantasy - High Forest 2.3/Character/Jump-Start/Jump-Start-Sheet.png
Legacy-Fantasy - High Forest 2.3/Character/Jumlp-All/Jump-All-Sheet.png
Legacy-Fantasy - High Forest 2.3/Character/Jump-End/Jump-End-Sheet.png
Legacy-Fantasy - High Forest 2.3/Character/Attack-01/Attack-01-Sheet.png
Legacy-Fantasy - High Forest 2.3/Character/Dead/Dead-Sheet.png
```

### Enemy Assets
**Snail (Ground Enemy - Slow)**
```
Legacy-Fantasy - High Forest 2.3/Mob/Snail/walk-Sheet.png
Legacy-Fantasy - High Forest 2.3/Mob/Snail/Hide-Sheet.png
Legacy-Fantasy - High Forest 2.3/Mob/Snail/Dead-Sheet.png
```

**Boar (Ground Enemy - Fast/Aggressive)**
```
Legacy-Fantasy - High Forest 2.3/Mob/Boar/Idle/Idle-Sheet.png
Legacy-Fantasy - High Forest 2.3/Mob/Boar/Walk/Walk-Base-Sheet.png
Legacy-Fantasy - High Forest 2.3/Mob/Boar/Run/Run-Sheet.png
Legacy-Fantasy - High Forest 2.3/Mob/Boar/Hit-Vanish/Hit-Sheet.png
```

**Small Bee (Flying Enemy)**
```
Legacy-Fantasy - High Forest 2.3/Mob/Small Bee/Fly/Fly-Sheet.png
Legacy-Fantasy - High Forest 2.3/Mob/Small Bee/Attack/Attack-Sheet.png
Legacy-Fantasy - High Forest 2.3/Mob/Small Bee/Hit/Hit-Sheet.png
```

### Level/Environment Assets
**Tiles and Platforms**
```
Legacy-Fantasy - High Forest 2.3/Assets/Tiles.png
```

**Decorative Elements**
```
Legacy-Fantasy - High Forest 2.3/Assets/Props-Rocks.png
Legacy-Fantasy - High Forest 2.3/Assets/Buildings.png
Legacy-Fantasy - High Forest 2.3/Assets/Tree-Assets.png
Legacy-Fantasy - High Forest 2.3/Assets/Hive.png
Legacy-Fantasy - High Forest 2.3/Assets/Interior-01.png
```

### Background Assets
```
Legacy-Fantasy - High Forest 2.3/Background/Background.png
Legacy-Fantasy - High Forest 2.3/Trees/Green-Tree.png
Legacy-Fantasy - High Forest 2.3/Trees/Dark-Tree.png
Legacy-Fantasy - High Forest 2.3/Trees/Red-Tree.png
Legacy-Fantasy - High Forest 2.3/Trees/Yellow-Tree.png
Legacy-Fantasy - High Forest 2.3/Trees/Golden-Tree.png
Legacy-Fantasy - High Forest 2.3/Trees/Background.png
```

### HUD Assets
```
Legacy-Fantasy - High Forest 2.3/HUD/Base-01.png
```

---

## Milestones

### Milestone 1: Core Movement and Single Level (Playable)
**Goal**: Create a playable prototype with basic movement, one enemy type, and a simple level.

#### Deliverables:
1. **Project Setup**
   - Initialize Phaser.js project
   - Set up development environment with local server
   - Create basic file structure (scenes, entities, config)
   - Load all required assets

2. **Player Character**
   - Implement left/right movement with keyboard controls (Arrow keys or WASD)
   - Implement jump mechanic with gravity
   - Integrate player sprite animations:
     - Idle animation
     - Run animation
     - Jump animation
   - Collision with ground/platforms

3. **Level 1 Creation**
   - Create tilemap for Level 1 using Tiles.png
   - Design basic platforming layout (ground, platforms, small gaps)
   - Add background layer with parallax scrolling
   - Add decorative elements (trees, rocks)
   - Camera following player

4. **Basic Enemy - Snail**
   - Spawn Snail enemy in level
   - Implement patrol behavior (walk back and forth)
   - Basic collision with platforms/walls (turn around)
   - Walk animation

5. **Basic Collision**
   - Player stomping detection (defeat enemy when jumping on top)
   - Side collision with enemy (placeholder - just bounce back for now)

6. **HUD Basic**
   - Display score counter
   - Display lives counter (fixed at 3 for now)

**Playable State**:
- Player can run, jump, and navigate Level 1
- Player can stomp on Snails to defeat them
- Level has a clear path from start to end
- Basic HUD shows score and lives

**Estimated Completion**: 2-3 development sessions

---

### Milestone 2: Full Combat System and Multiple Enemies (Playable)
**Goal**: Implement complete combat mechanics, health system, all enemy types, collectibles, and power-ups.

#### Deliverables:
1. **Health and Lives System**
   - Implement health points (3 HP per life)
   - Damage system on enemy side collision (-1 HP)
   - Death sequence when HP reaches 0 (-1 life, respawn)
   - Invincibility frames after taking damage (visual feedback)
   - Game over condition when lives reach 0

2. **Complete Enemy System**
   - **Boar Enemy**: Fast charging behavior, aggressive AI
   - **Bee Enemy**: Flying patrol patterns (horizontal or vertical)
   - Enemy death animations
   - Enemy respawn logic (optional: respawn vs permanent death)

3. **Collectible System**
   - Create collectible sprite (use gems/coins from tileset or create from assets)
   - Scatter collectibles throughout Level 1
   - Collection detection and score increment
   - Collection sound/visual effect
   - Display collectible count in HUD

4. **Power-Up System**
   - Create power-up sprites (modify existing assets or use prop elements)
   - Implement 2-3 power-up types:
     - **Speed Boost**: Increase movement speed for 10 seconds
     - **Invincibility**: No damage from enemies for 10 seconds (visual indicator)
     - **Double Jump**: Allow second jump in mid-air for 15 seconds
   - Power-up collection and activation
   - Visual indicator in HUD when power-up active
   - Timer countdown for active power-up

5. **Enhanced HUD**
   - Health bar/hearts display
   - Lives counter with icons
   - Score/collectibles counter
   - Active power-up indicator with timer
   - Polish HUD layout using Base-01.png

6. **Player Polish**
   - Add attack animation (stomp effect)
   - Add death animation
   - Add damage animation/flash
   - Improved jump mechanics (variable height)

7. **Level 1 Enhancement**
   - Add all three enemy types in strategic locations
   - Place collectibles along the main path and in challenging areas
   - Add at least 1-2 power-ups
   - Add goal/flag at the end
   - Level completion detection

8. **Game Over and Level Complete Screens**
   - Game Over screen with restart option
   - Level Complete screen showing stats (collectibles, time, score)
   - Transition to next level (or back to main menu if Level 1 only)

**Playable State**:
- Complete combat system with health, damage, and lives
- Three different enemy types with unique behaviors
- Collectibles to gather for score
- Power-ups that change gameplay temporarily
- Full HUD showing all game information
- Level 1 is complete from start to goal
- Game over and level complete screens

**Estimated Completion**: 3-4 development sessions

---

### Milestone 3: Three Complete Levels and Polish (Playable & Complete)
**Goal**: Create two additional levels with increasing difficulty, add main menu, and polish the entire game.

#### Deliverables:
1. **Level 2 Creation**
   - New level layout with increased difficulty
   - More complex platforming (longer gaps, moving platforms optional)
   - Higher enemy density
   - Introduce new environmental hazards (if applicable)
   - Different background aesthetics (use Red-Tree.png or Yellow-Tree.png)
   - More collectibles and strategic power-up placement
   - Goal/flag at the end

2. **Level 3 Creation**
   - Most challenging level layout
   - Complex enemy combinations
   - Vertical platforming sections
   - Require power-up usage for optimal play
   - Different background aesthetics (use Golden-Tree.png or Dark-Tree.png)
   - Maximum collectibles
   - Final goal/flag

3. **Level Progression System**
   - Level selection or automatic progression
   - Save level completion state
   - Track total score across all levels
   - Unlock system (Level 2 unlocks after Level 1, etc.)

4. **Main Menu**
   - Title screen with game name
   - Start Game button
   - Level Select button (shows locked/unlocked levels)
   - Instructions/Controls screen (optional)
   - Background with animated elements

5. **Pause System**
   - Pause game with ESC or P key
   - Pause menu overlay
   - Resume, Restart Level, and Quit to Menu options

6. **Game Polish**
   - Smooth transitions between scenes
   - Particle effects:
     - Dust particles when running
     - Impact effect when stomping enemies
     - Sparkle effect when collecting items
     - Trail effect for active power-ups
   - Screen shake on significant events (enemy defeat, damage)
   - Improved camera behavior (look-ahead, smooth following)

7. **Audio Integration** (If not already done)
   - Background music for each level (different tracks)
   - Main menu music
   - All sound effects implemented:
     - Jump, land, run
     - Enemy stomp, enemy damage
     - Collectible pickup
     - Power-up activation
     - Damage taken
     - Death
     - Level complete
   - Volume controls in pause menu (optional)

8. **Final Balance Pass**
   - Adjust player movement speed and jump height
   - Balance enemy difficulty and placement
   - Adjust power-up durations
   - Ensure all levels are completable and fun
   - Test collectible and power-up placement

9. **Bug Fixes and Optimization**
   - Fix any collision bugs
   - Optimize performance (sprite pooling for collectibles/enemies)
   - Test on different screen sizes/browsers
   - Handle edge cases (falling off map, etc.)

10. **End Game Screen**
    - Final score across all three levels
    - Total collectibles gathered
    - Completion percentage
    - Play Again button
    - Return to Main Menu button

**Playable State (COMPLETE GAME)**:
- Three fully playable levels with distinct designs
- Complete game loop: Main Menu → Level 1 → Level 2 → Level 3 → End Screen
- All mechanics polished and balanced
- Full audio integration
- Pause and menu systems
- Visual polish and effects
- Bug-free, smooth gameplay experience

**Estimated Completion**: 4-5 development sessions

---

## Technical Specifications

### Screen Resolution
- Canvas Size: 1280x720 pixels (16:9 aspect ratio)
- Scalable to fit different browser sizes

### Physics Settings
- Gravity: 800-1000 (tune for game feel)
- Player speed: 200-250 pixels/second
- Jump velocity: -500 to -600 (negative is up)

### Sprite Information
- All sprites from Legacy-Fantasy pack are sprite sheets
- Need to determine frame sizes for each animation
- Typical frame sizes to check: 16x16, 32x32, 48x48, 64x64

### File Structure
```
/game
  /assets
    /sprites
      /character
      /enemies
      /environment
      /ui
    /audio (future)
  /src
    /scenes
      - BootScene.js
      - MainMenuScene.js
      - Level1Scene.js
      - Level2Scene.js
      - Level3Scene.js
      - GameOverScene.js
      - LevelCompleteScene.js
    /entities
      - Player.js
      - Enemy.js
      - Collectible.js
      - PowerUp.js
    /ui
      - HUD.js
    - config.js
    - main.js
  - index.html
  - style.css
  - package.json (if using npm)
```

---

## Success Criteria

### Milestone 1 Success:
- [ ] Player can move and jump smoothly
- [ ] Level 1 is fully navigable
- [ ] Snail enemies patrol and can be stomped
- [ ] Camera follows player correctly
- [ ] Basic HUD displays score and lives

### Milestone 2 Success:
- [ ] Health and lives system works correctly
- [ ] All three enemy types are implemented with unique behaviors
- [ ] Collectibles can be gathered and increase score
- [ ] At least 2 power-ups work correctly with visual feedback
- [ ] Level 1 is completable from start to goal
- [ ] Game over and level complete screens function properly

### Milestone 3 Success:
- [ ] Three complete, playable levels with increasing difficulty
- [ ] Main menu with level selection works
- [ ] Pause system functions correctly
- [ ] Audio is integrated throughout the game
- [ ] Visual effects and polish are applied
- [ ] Game is bug-free and performs well
- [ ] Complete game loop from start to finish

---

## Future Enhancements (Post-MVP)
- Boss fights at the end of levels
- More power-up varieties
- Secret areas and bonus levels
- Leaderboard/high score system
- Mobile touch controls
- Additional enemy types
- Weather effects (rain, wind)
- Cutscenes or story elements
- Achievements system

---

**Document Version**: 1.0
**Last Updated**: 2026-01-22
**Status**: Ready for Development
