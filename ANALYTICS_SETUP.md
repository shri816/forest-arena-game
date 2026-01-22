# Analytics Setup Guide

This guide explains how to set up Google Analytics 4 and Firebase to track user behavior, scores, and create a global leaderboard for Forest Arena.

## 📊 What You Can Track

### Google Analytics 4 (GA4)
- **Unique users** - How many people played your game
- **Geographic location** - Where players are from (country, region, city)
- **Device information** - Mobile vs Desktop, screen size, browser
- **Session duration** - How long players engage with your game
- **Custom game events**:
  - Game starts
  - Game overs with final score and wave
  - Wave completions
  - Enemy kills by type
  - Combo achievements
  - New high scores

### Firebase Realtime Database
- **Global leaderboard** - Top scores from all players worldwide
- **Player rankings** - See where a score ranks globally
- **Today's top scores** - Daily leaderboard
- **Real-time updates** - Leaderboard updates live as players submit scores

---

## 🔧 Part 1: Setting Up Google Analytics 4

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **"Admin"** (gear icon in bottom left)
3. Click **"Create Property"**
4. Enter property details:
   - **Property name**: `Forest Arena Game`
   - **Reporting time zone**: Your timezone
   - **Currency**: Your currency
5. Click **"Next"** and complete the setup

### Step 2: Create Web Data Stream

1. After creating property, you'll see "Choose a platform"
2. Click **"Web"**
3. Enter your website details:
   - **Website URL**: `https://shri816.github.io/forest-arena-game/`
   - **Stream name**: `Forest Arena`
4. Click **"Create stream"**

### Step 3: Get Your Measurement ID

1. You'll see your **Measurement ID** (looks like `G-XXXXXXXXXX`)
2. Copy this ID

### Step 4: Add Measurement ID to Your Game

1. Open `index.html`
2. Find this line:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```
3. Replace `G-XXXXXXXXXX` with your actual Measurement ID

### Step 5: Initialize Analytics

Add this to your `src/main.js` file, right after the game is created:

```javascript
// Initialize Google Analytics
if (window.gameAnalytics) {
    window.gameAnalytics.initGA('G-XXXXXXXXXX'); // Replace with your Measurement ID
}
```

### Step 6: Verify It's Working

1. Open your game in a browser
2. Open browser console (F12)
3. You should see: `Google Analytics initialized`
4. In GA4 dashboard, go to **Reports > Realtime** to see live activity

---

## 🔥 Part 2: Setting Up Firebase (Optional but Recommended)

Firebase enables a global leaderboard where all players' scores are stored and ranked.

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `forest-arena-game`
4. Disable Google Analytics for this project (we're using GA4 separately)
5. Click **"Create project"**

### Step 2: Enable Realtime Database

1. In Firebase Console, click **"Realtime Database"** in left menu
2. Click **"Create Database"**
3. Select location (choose one closest to your users)
4. Start in **"Test mode"** for now (we'll secure it later)
5. Click **"Enable"**

### Step 3: Configure Security Rules

1. In Realtime Database, go to **"Rules"** tab
2. Replace the rules with:

```json
{
  "rules": {
    "leaderboard": {
      ".read": true,
      ".write": true,
      ".indexOn": ["score", "timestamp"],
      "$scoreId": {
        ".validate": "newData.hasChildren(['playerName', 'score', 'waveReached', 'kills', 'maxCombo', 'timestamp', 'date']) && newData.child('score').isNumber() && newData.child('score').val() >= 0"
      }
    }
  }
}
```

3. Click **"Publish"**

### Step 4: Get Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>`
5. Register your app:
   - **App nickname**: `Forest Arena Web`
   - Don't check "Firebase Hosting"
6. Copy the `firebaseConfig` object (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "forest-arena-game.firebaseapp.com",
  databaseURL: "https://forest-arena-game-default-rtdb.firebaseio.com",
  projectId: "forest-arena-game",
  storageBucket: "forest-arena-game.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Step 5: Add Firebase to Your Game

1. Open `index.html`
2. Add Firebase SDK scripts **before** the closing `</body>` tag and **before** game scripts:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>

<!-- Firebase Config -->
<script>
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase Leaderboard (will be called after FirebaseLeaderboard.js loads)
if (window.firebaseLeaderboard) {
    window.firebaseLeaderboard.init(firebaseConfig);
}
</script>
```

3. Make sure `FirebaseLeaderboard.js` is loaded in `index.html`:

```html
<script src="src/analytics/FirebaseLeaderboard.js"></script>
```

### Step 6: Submit Scores to Leaderboard

Add this to your `gameOver()` method in `ArenaScene.js`:

```javascript
// Submit score to global leaderboard
if (window.firebaseLeaderboard && window.firebaseLeaderboard.initialized) {
    const playerName = localStorage.getItem('playerName') || 'Anonymous';
    window.firebaseLeaderboard.submitScore(
        playerName,
        gameState.score,
        this.currentWave,
        gameState.kills,
        gameState.maxCombo
    );
}
```

---

## 📈 Viewing Your Analytics

### Google Analytics 4 Dashboard

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property: **"Forest Arena Game"**

#### Key Reports:

**1. Real-time Report** (`Reports > Realtime`)
- See active users right now
- Current events happening
- Geographic map of active users

**2. User Acquisition** (`Reports > Acquisition > User acquisition`)
- How users found your game
- Traffic sources (direct, social, referral)

**3. Demographics** (`Reports > User > Demographics > Overview`)
- User countries and cities
- Languages
- Device types (mobile vs desktop)

**4. Engagement** (`Reports > Engagement > Events`)
- All custom game events
- Most triggered events
- Event parameters

**5. Custom Exploration** (`Explore > Create new exploration`)
Create custom reports for:
- Average score per session
- Most common wave reached
- Combo achievement distribution
- Game completion rate

#### Useful Custom Explorations:

**Top Scores Report:**
1. Go to **Explore > Create new exploration**
2. Add dimension: `event_name`
3. Add metric: `event_count`
4. Filter: `event_name = game_over`
5. Add parameter: `final_score`
6. Sort by `final_score` descending

**Geographic Heatmap:**
1. Go to **Explore > Create new exploration**
2. Select **Free form**
3. Dimensions: `Country`, `City`
4. Metrics: `Users`, `Sessions`
5. Visualization: **Geo map**

### Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **"Realtime Database"**

#### View Leaderboard Data:

In the Firebase console, you'll see the leaderboard structure:
```
leaderboard/
  -NXxxxxxxxxxxx: {
    playerName: "Player1",
    score: 15000,
    waveReached: 8,
    kills: 45,
    maxCombo: 12,
    timestamp: 1234567890,
    date: "2024-01-15T10:30:00Z"
  }
  -NXyyyyyyyyyyy: {
    playerName: "Player2",
    score: 12000,
    ...
  }
```

---

## 🎮 Using Leaderboard in Your Game

### Display Top Scores

Add this to your `TitleScene.js` to show top 5 scores:

```javascript
async loadLeaderboard() {
    if (!window.firebaseLeaderboard || !window.firebaseLeaderboard.initialized) {
        return;
    }

    const topScores = await window.firebaseLeaderboard.getTopScores(5);

    // Display scores
    let y = 500;
    topScores.forEach((scoreData, index) => {
        const text = this.add.text(
            640, y,
            `${index + 1}. ${scoreData.playerName}: ${scoreData.score}`,
            { font: '18px Arial', fill: '#FFD700' }
        );
        text.setOrigin(0.5);
        y += 30;
    });
}
```

### Show Player's Global Rank

```javascript
async showPlayerRank() {
    const score = gameState.score;
    const rank = await window.firebaseLeaderboard.getPlayerRank(score);

    console.log(`Your rank: #${rank} globally`);
}
```

---

## 🔐 Security Best Practices

### Secure Your Firebase Database

Once you have the leaderboard working, tighten security:

```json
{
  "rules": {
    "leaderboard": {
      ".read": true,
      ".write": "!data.exists() || newData.child('timestamp').val() > now - 60000",
      ".indexOn": ["score", "timestamp"],
      "$scoreId": {
        ".validate": "newData.hasChildren(['playerName', 'score', 'waveReached', 'kills', 'maxCombo', 'timestamp', 'date']) && newData.child('score').isNumber() && newData.child('score').val() >= 0 && newData.child('score').val() <= 1000000 && newData.child('playerName').isString() && newData.child('playerName').val().length <= 20"
      }
    }
  }
}
```

This prevents:
- Score manipulation (max 1,000,000)
- Updating old scores
- Invalid data types
- Excessively long names

---

## 📊 Key Metrics to Track

### User Engagement
- **DAU (Daily Active Users)**: Unique users per day
- **Session Duration**: Average time spent playing
- **Retention**: % of users who return

### Game Performance
- **Average Score**: Mean final score across all games
- **Average Wave Reached**: How far players typically get
- **Completion Rate**: % of players reaching wave 10+

### Player Behavior
- **Most Popular Time**: When do most players play?
- **Device Split**: Mobile vs Desktop usage
- **Geographic Distribution**: Where are your players?

### Scoring Metrics
- **Global High Score**: Highest score ever
- **Today's High Score**: Best score today
- **Average Combo**: Mean max combo per game
- **Kill Distribution**: Which enemies are killed most?

---

## 🎯 Next Steps

1. **Set up GA4** - Start tracking basic metrics immediately
2. **Test locally** - Play the game and verify events in GA4 Real-time
3. **Set up Firebase** (optional) - Add global leaderboard functionality
4. **Deploy to GitHub Pages** - Make your game live
5. **Monitor for 1 week** - Collect baseline data
6. **Create custom reports** - Build dashboards for your specific needs
7. **Share your game** - Post on social media and game communities
8. **Analyze and improve** - Use data to enhance gameplay

---

## 🐛 Troubleshooting

### GA4 Not Tracking

**Check:**
- Browser console for errors
- Measurement ID is correct in `index.html`
- Ad blockers are disabled (they block GA4)
- Events appear in GA4 Real-time report (1-2 min delay)

**Debug Mode:**
Add `?debug_mode=true` to your URL to see detailed GA4 logs

### Firebase Not Working

**Check:**
- Firebase SDK scripts loaded before your code
- Firebase config is correct
- Database rules allow writes
- Browser console for Firebase errors
- Database URL includes your project name

**Test Firebase:**
```javascript
// Run in browser console
window.firebaseLeaderboard.submitScore('Test', 100, 1, 0, 0);
```

Then check Firebase Console to see if score appears.

---

## 💡 Tips

1. **Don't track during development**: Add a check:
   ```javascript
   const isProduction = window.location.hostname !== 'localhost';
   if (isProduction && window.gameAnalytics) {
       window.gameAnalytics.trackGameStart();
   }
   ```

2. **Respect user privacy**: Add a privacy policy and cookie consent if needed

3. **Monitor costs**: Firebase has a free tier (100k downloads/day), but monitor usage

4. **Regular backups**: Export Firebase data periodically

5. **A/B testing**: Use GA4 to test gameplay changes and measure impact

---

Need help? Check:
- [Google Analytics 4 Documentation](https://support.google.com/analytics)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Phaser 3 Examples](https://phaser.io/examples)

Happy tracking! 🎮📊
