// Firebase Realtime Database Leaderboard
// Tracks global high scores across all players

class FirebaseLeaderboard {
    constructor() {
        this.initialized = false;
        this.db = null;
        this.leaderboardRef = null;
    }

    // Initialize Firebase
    init(firebaseConfig) {
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK not loaded');
            return false;
        }

        try {
            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            this.db = firebase.database();
            this.leaderboardRef = this.db.ref('leaderboard');
            this.initialized = true;

            console.log('Firebase Leaderboard initialized');
            return true;
        } catch (error) {
            console.error('Firebase initialization error:', error);
            return false;
        }
    }

    // Submit score to global leaderboard
    async submitScore(playerName, score, waveReached, kills, maxCombo) {
        if (!this.initialized) {
            console.warn('Firebase not initialized');
            return null;
        }

        try {
            const scoreData = {
                playerName: playerName || 'Anonymous',
                score: score,
                waveReached: waveReached,
                kills: kills,
                maxCombo: maxCombo,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                date: new Date().toISOString()
            };

            // Push to leaderboard
            const newScoreRef = await this.leaderboardRef.push(scoreData);

            console.log('Score submitted to leaderboard:', scoreData);
            return newScoreRef.key;
        } catch (error) {
            console.error('Error submitting score:', error);
            return null;
        }
    }

    // Get top N scores
    async getTopScores(limit = 10) {
        if (!this.initialized) {
            console.warn('Firebase not initialized');
            return [];
        }

        try {
            const snapshot = await this.leaderboardRef
                .orderByChild('score')
                .limitToLast(limit)
                .once('value');

            const scores = [];
            snapshot.forEach((childSnapshot) => {
                scores.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });

            // Reverse to get highest first
            return scores.reverse();
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
    }

    // Get player's rank by score
    async getPlayerRank(score) {
        if (!this.initialized) {
            return null;
        }

        try {
            const snapshot = await this.leaderboardRef
                .orderByChild('score')
                .startAt(score + 1)
                .once('value');

            return snapshot.numChildren() + 1; // Rank is number of scores higher + 1
        } catch (error) {
            console.error('Error getting player rank:', error);
            return null;
        }
    }

    // Get global high score (highest ever)
    async getGlobalHighScore() {
        if (!this.initialized) {
            return 0;
        }

        try {
            const snapshot = await this.leaderboardRef
                .orderByChild('score')
                .limitToLast(1)
                .once('value');

            let highScore = 0;
            snapshot.forEach((childSnapshot) => {
                highScore = childSnapshot.val().score;
            });

            return highScore;
        } catch (error) {
            console.error('Error fetching global high score:', error);
            return 0;
        }
    }

    // Get today's top scores
    async getTodayTopScores(limit = 10) {
        if (!this.initialized) {
            return [];
        }

        try {
            // Get timestamp for start of today (UTC)
            const todayStart = new Date();
            todayStart.setUTCHours(0, 0, 0, 0);
            const todayTimestamp = todayStart.getTime();

            const snapshot = await this.leaderboardRef
                .orderByChild('timestamp')
                .startAt(todayTimestamp)
                .once('value');

            const scores = [];
            snapshot.forEach((childSnapshot) => {
                scores.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });

            // Sort by score descending
            scores.sort((a, b) => b.score - a.score);

            return scores.slice(0, limit);
        } catch (error) {
            console.error('Error fetching today\'s scores:', error);
            return [];
        }
    }

    // Listen for real-time leaderboard updates
    onLeaderboardUpdate(callback, limit = 10) {
        if (!this.initialized) {
            return null;
        }

        const query = this.leaderboardRef
            .orderByChild('score')
            .limitToLast(limit);

        query.on('value', (snapshot) => {
            const scores = [];
            snapshot.forEach((childSnapshot) => {
                scores.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });

            callback(scores.reverse());
        });

        return query; // Return query to allow unsubscribing later
    }

    // Stop listening to leaderboard updates
    stopListening(query) {
        if (query) {
            query.off();
        }
    }
}

// Create global leaderboard instance
window.firebaseLeaderboard = new FirebaseLeaderboard();
