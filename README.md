# Forest Arena 🌲⚔️

A responsive hack & slash arena fighter built with Phaser.js featuring adaptive aspect ratio for seamless gameplay across all devices.

![Forest Arena](https://img.shields.io/badge/Phaser-3.x-blue) ![Mobile](https://img.shields.io/badge/Mobile-Responsive-green) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎮 Play Now

**Live Demo:** [Play Forest Arena](https://YOUR_GITHUB_USERNAME.github.io/forest-arena-game/)

## ✨ Features

- **Adaptive Aspect Ratio**: Automatically optimizes for portrait mobile (720x1280) and desktop/landscape (1280x720)
- **Wave-Based Combat**: Face increasingly difficult waves of enemies
- **3 Enemy Types**:
  - 🐌 Snail - Slow patrol enemies
  - 🐗 Boar - Fast charging enemies
  - 🐝 Bee - Flying erratic enemies
- **Combo System**: Build combos for score multipliers (2x, 3x, 5x, 10x)
- **Touch Controls**: Virtual joystick and buttons for mobile devices
- **Keyboard Controls**: WASD/Arrows for movement, Space for attack, Shift for dash
- **Progressive Difficulty**: Enemies and waves scale with your progress
- **High Score Persistence**: Your best score is saved locally

## 🎯 How to Play

### Desktop Controls
- **Movement**: WASD or Arrow Keys
- **Attack**: Space
- **Dash**: Shift

### Mobile Controls
- **Movement**: Virtual joystick (left side)
- **Attack**: ⚔️ button (right side)
- **Dash**: 💨 button (right side)

## 🚀 Getting Started

### Play Locally

1. Clone the repository:
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/forest-arena-game.git
cd forest-arena-game
```

2. Start a local web server:
```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js
npx http-server -p 8080
```

3. Open your browser and navigate to:
```
http://localhost:8080
```

### Deploy to GitHub Pages

This game is ready to deploy to GitHub Pages:

1. Go to your repository settings
2. Navigate to "Pages" section
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click Save

Your game will be live at: `https://YOUR_GITHUB_USERNAME.github.io/forest-arena-game/`

## 🛠️ Technology Stack

- **Game Engine**: [Phaser 3](https://phaser.io/) - Fast, free, and fun HTML5 game framework
- **Graphics**: Pixel art from [Legacy-Fantasy High Forest 2.3](https://itch.io/) asset pack
- **Architecture**:
  - Scene-based structure (Boot, Title, Arena)
  - Entity component pattern
  - Arcade Physics system
  - Adaptive layout system

## 📱 Mobile Responsiveness

The game features a sophisticated adaptive system:

- **Portrait Mobile**: 720x1280 resolution with optimized arena size and UI placement
- **Desktop/Landscape**: 1280x720 resolution with full-size arena
- **No Letterboxing**: Perfect fit on all screen sizes
- **Touch Detection**: Automatically shows/hides appropriate controls

## 🎨 Game Design

### Scoring System
- **Snail**: 10 points
- **Boar**: 25 points
- **Bee**: 30 points
- **Combo Multipliers**:
  - 2 kills: 2x
  - 4 kills: 3x
  - 7 kills: 5x
  - 11+ kills: 10x
- **Wave Completion Bonus**: 100 × wave number

### Player Stats
- **Health**: 5 hearts
- **Attack Range**: 70px
- **Movement Speed**: 200px/s
- **Dash Speed**: 500px/s (2s cooldown)

## 📂 Project Structure

```
forest-arena-game/
├── index.html              # Main HTML file
├── style.css               # Global styles
├── src/
│   ├── config.js           # Game configuration with adaptive system
│   ├── main.js             # Game initialization
│   ├── scenes/             # Game scenes
│   │   ├── BootScene.js    # Asset loading
│   │   ├── TitleScene.js   # Title screen
│   │   └── ArenaScene.js   # Main gameplay
│   ├── entities/           # Game entities
│   │   ├── ArenaPlayer.js  # Player character
│   │   └── ArenaEnemy.js   # Enemy AI
│   └── ui/                 # UI components
│       ├── ArenaHUD.js     # Health, score, wave display
│       ├── VirtualJoystick.js  # Touch joystick
│       └── TouchButton.js  # Touch buttons
└── Legacy-Fantasy - High Forest 2.3/  # Pixel art assets
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 🎨 Credits

- **Pixel Art Assets**: Legacy-Fantasy High Forest 2.3 asset pack
- **Game Engine**: Phaser 3 by Photon Storm
- **Development**: Built with Claude Code

## 🎮 Future Enhancements

- [ ] Sound effects and background music
- [ ] Power-ups (speed boost, shield, health)
- [ ] More enemy types
- [ ] Boss battles every 5 waves
- [ ] Leaderboard system
- [ ] Multiple characters to choose from
- [ ] Different arenas/environments

---

**Enjoy the game!** If you find bugs or have suggestions, please open an issue.
