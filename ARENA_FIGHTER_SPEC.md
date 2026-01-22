# Forest Arena Fighter - Hack & Slash Game Spec

## Game Concept
An intense top-down hack & slash arena fighter where you battle endless waves of forest monsters. Survive as long as possible, rack up combos, and set high scores!

## Why This Is More Exciting Than The Platformer
- ✅ **Constant Action** - Non-stop combat, no walking between enemies
- ✅ **Uses Attack Animation** - Finally use that sword attack!
- ✅ **Wave-Based Progression** - Each wave gets harder, creating tension
- ✅ **All Enemy Types Active** - Snails, Boars, and Bees all attack at once
- ✅ **Combo System** - Chain kills for score multipliers
- ✅ **Quick Gameplay Loop** - Die and instantly retry
- ✅ **High Score Chase** - Addictive "one more try" gameplay
- ✅ **Power-Ups** - Random drops keep gameplay fresh

---

## Core Gameplay

### Player Controls
- **Movement**: WASD or Arrow Keys (8-directional movement)
- **Attack**: SPACE or LEFT CLICK (sword slash in facing direction)
- **Dash/Dodge**: SHIFT (quick dash, brief invincibility, cooldown)

### Combat Mechanics
1. **Sword Attack**
   - 360° attack arc in front of player
   - Short range (~60px)
   - Fast attack speed (can attack every 0.4 seconds)
   - Kills enemies on contact
   - Screen shake on hit for impact

2. **Combo System**
   - Chain kills within 3 seconds to build combo
   - Combo multiplier: 2x, 3x, 5x, 10x
   - Score = Base Kill Value × Combo Multiplier
   - Combo breaks after 3 seconds of no kills

3. **Health & Damage**
   - Player starts with 5 HP
   - Enemies deal 1 damage on contact
   - Brief invincibility after taking damage (1 second)
   - Visual feedback: screen flash, player blinks red

4. **Dash Mechanic**
   - Quick burst of speed in movement direction
   - 0.3 seconds of invincibility during dash
   - 2-second cooldown
   - Visual trail effect

### Enemy Types

**Snail (Easy)**
- HP: 1
- Speed: 50
- Damage: 1
- Score: 10 points
- Behavior: Slowly moves toward player

**Boar (Medium)**
- HP: 2
- Speed: 120
- Damage: 1
- Score: 25 points
- Behavior: Charges at player in straight lines

**Bee (Hard)**
- HP: 1
- Speed: 80
- Damage: 1
- Score: 30 points
- Behavior: Flies toward player, can cross terrain

### Wave System

**Wave 1-3**: Only Snails (3, 5, 7 enemies)
**Wave 4-6**: Snails + Boars (8, 10, 12 enemies)
**Wave 7-10**: All three types (15, 18, 20, 25 enemies)
**Wave 11+**: All types, increasing count and speed by 10% per wave

**Between Waves**:
- 5-second break
- Display "WAVE X COMPLETE" with score
- Heal player 1 HP (max 5 HP)
- Show enemies incoming in next wave

### Power-Up Drops (Random 20% chance on kill)

1. **Health Orb** (40% drop rate)
   - Restores 2 HP
   - Green glow

2. **Damage Boost** (30% drop rate)
   - Double damage for 15 seconds
   - Red glow, sword glows red

3. **Speed Boost** (30% drop rate)
   - 1.5x movement speed for 15 seconds
   - Blue glow, character trails blue

### Arena Layout
- Circular arena (1000x1000px)
- Forest background with trees around edges
- Boundary walls prevent leaving arena
- Decorative rocks and props in arena
- Camera centered on player, slight smoothing

---

## HUD Display

**Top Left:**
- Health: ❤️❤️❤️❤️❤️
- Score: 0
- High Score: [Best]

**Top Center:**
- Wave Number: "WAVE 5"
- Combo: "COMBO x5!" (only when active)

**Top Right:**
- Kills This Wave: 12/25
- Active Power-Up Timer (if any)

**Bottom Center (when active):**
- Dash Cooldown Indicator

---

## Game States

### Main Menu
- Title: "FOREST ARENA FIGHTER"
- "PRESS SPACE TO START"
- High Score Display
- Controls Display

### Gameplay
- Active combat
- Real-time wave spawning
- Continuous score tracking

### Wave Complete
- 5-second pause
- "WAVE X COMPLETE!"
- Stats: Kills, Accuracy, Score Gained
- "Next Wave in 3... 2... 1..."

### Game Over
- "GAME OVER"
- Final Score
- High Score (if beaten)
- Wave Reached
- Total Kills
- "PRESS SPACE TO RESTART"

---

## Visual & Audio Feedback

### Visual Effects
1. **Hit Effects**
   - Screen shake on successful attack
   - Enemy flash white when hit
   - Blood splatter particles (red dots)

2. **Combo Effects**
   - Combo text grows with multiplier
   - Color changes: White→Yellow→Orange→Red
   - Particle effects at high combos

3. **Power-Up Effects**
   - Glowing orbs that pulse
   - Trail effect when collected
   - Character glow during active power-up

4. **Damage Effects**
   - Screen red flash
   - Camera shake
   - Player blinks red during invincibility

### Audio (Future Enhancement)
- Sword slash sound
- Enemy death sounds (different per type)
- Hit impact sound
- Power-up collect sound
- Wave complete fanfare
- Combo milestone sounds
- Tense combat music

---

## Scoring System

**Base Kill Values:**
- Snail: 10 points
- Boar: 25 points
- Bee: 30 points

**Combo Multipliers:**
- 1 kill: 1x
- 2-3 kills: 2x
- 4-6 kills: 3x
- 7-10 kills: 5x
- 11+ kills: 10x

**Bonus Points:**
- Wave Complete: 100 × Wave Number
- Perfect Wave (no damage taken): +500
- Fast Wave Clear (<30 seconds): +250

**Example:**
Kill 5 Snails in a row = 10 × 5 × 3x combo = 150 points

---

## Implementation Milestones

### Milestone 1: Core Combat (Playable)
- Arena scene with boundaries
- Player 8-direction movement
- Sword attack with hitbox detection
- 3 enemy types with basic AI
- Health and damage system
- Basic HUD (health, score)
- Game over screen

**Playable Goal**: Can fight and kill enemies, die when health runs out

### Milestone 2: Wave System (Exciting)
- Wave spawning system
- Wave progression (1-10+)
- Wave complete screen
- Enemy count tracking
- Break between waves
- Difficulty scaling

**Playable Goal**: Survive multiple waves of increasing difficulty

### Milestone 3: Polish & Juice (Addictive)
- Combo system with multipliers
- Dash mechanic
- Power-up drops
- Screen effects (shake, flash, particles)
- High score tracking
- Main menu
- Visual polish

**Final Goal**: Addictive, polished arena fighter with high replay value

---

## Why This Will Be More Fun

1. **Immediate Action** - Start fighting instantly
2. **Clear Progress** - Wave numbers show how far you've gotten
3. **Skill-Based** - Attack timing, positioning, and dodging matter
4. **Risk/Reward** - Go for combos vs play it safe
5. **"One More Try"** - Quick deaths mean fast restarts
6. **Bragging Rights** - High scores to beat
7. **Variety** - Different enemy types require different strategies
8. **Power Fantasy** - Mowing down enemies feels great
9. **Escalating Tension** - Each wave is harder
10. **Uses All Assets** - Attack animation, all enemies, full movement

---

## Technical Notes

- Switch from platformer physics to top-down movement
- No gravity needed
- Collision circles for enemies and attacks
- Spawn system with timers
- State machine for waves
- Local storage for high scores

**Estimated Development Time:** 2-3 hours for Milestone 1, full game in 4-6 hours

---

**Let's make an EXCITING game! 🗡️⚔️🛡️**
