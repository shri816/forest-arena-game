// Game Analytics Module
// Tracks user behavior, scores, and game events

class GameAnalytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.sessionStartTime = Date.now();
        this.eventsTracked = 0;
    }

    generateSessionId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Initialize Google Analytics
    initGA(measurementId) {
        if (typeof gtag === 'undefined') {
            console.warn('Google Analytics not loaded');
            return;
        }

        // Track page view
        gtag('config', measurementId, {
            page_title: 'Forest Arena Game',
            page_path: window.location.pathname
        });

        console.log('Google Analytics initialized');
    }

    // Track game start
    trackGameStart() {
        this.trackEvent('game_start', {
            session_id: this.sessionId,
            timestamp: new Date().toISOString()
        });
    }

    // Track game over with final stats
    trackGameOver(stats) {
        const sessionDuration = Math.floor((Date.now() - this.sessionStartTime) / 1000);

        this.trackEvent('game_over', {
            session_id: this.sessionId,
            final_score: stats.score || 0,
            wave_reached: stats.wave || 1,
            kills: stats.kills || 0,
            max_combo: stats.maxCombo || 0,
            session_duration_seconds: sessionDuration,
            timestamp: new Date().toISOString()
        });

        // Track high score achievement
        if (stats.isNewHighScore) {
            this.trackEvent('new_high_score', {
                score: stats.score,
                previous_high_score: stats.previousHighScore || 0
            });
        }
    }

    // Track wave completion
    trackWaveComplete(waveNumber, score, enemiesKilled) {
        this.trackEvent('wave_complete', {
            wave_number: waveNumber,
            score: score,
            enemies_killed: enemiesKilled
        });
    }

    // Track player death
    trackPlayerDeath(wave, score, enemyType) {
        this.trackEvent('player_death', {
            wave_number: wave,
            score: score,
            killed_by: enemyType || 'unknown'
        });
    }

    // Track combo achievement
    trackCombo(comboCount, score) {
        if (comboCount >= 5) {
            this.trackEvent('combo_achievement', {
                combo_count: comboCount,
                score: score,
                tier: this.getComboTier(comboCount)
            });
        }
    }

    getComboTier(comboCount) {
        if (comboCount >= 11) return 'legendary';
        if (comboCount >= 7) return 'epic';
        if (comboCount >= 5) return 'rare';
        return 'common';
    }

    // Track enemy kills by type
    trackEnemyKill(enemyType, score, comboCount) {
        this.trackEvent('enemy_kill', {
            enemy_type: enemyType,
            score: score,
            combo: comboCount
        });
    }

    // Track custom events
    trackEvent(eventName, params = {}) {
        this.eventsTracked++;

        // Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, params);
        }

        // Log for debugging
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`Analytics Event: ${eventName}`, params);
        }
    }

    // Track user engagement time
    trackEngagement() {
        const sessionDuration = Math.floor((Date.now() - this.sessionStartTime) / 1000);
        this.trackEvent('user_engagement', {
            engagement_time_seconds: sessionDuration,
            events_tracked: this.eventsTracked
        });
    }
}

// Create global analytics instance
window.gameAnalytics = new GameAnalytics();
