// ===================================
// MOOD STORAGE SERVICE
// Handles localStorage CRUD operations for emotion data
// ===================================

import { STORAGE_KEYS } from '../utils/constants.js';

class MoodStorage {
    constructor() {
        this.storageKey = STORAGE_KEYS.EMOTION_HISTORY;
    }

    /**
     * Save emotion to history
     * @param {string} emotion - Emotion name
     * @param {number} confidence - Confidence score (0-1)
     * @returns {Object} Saved emotion record
     */
    saveEmotion(emotion, confidence) {
        const record = {
            id: Date.now(),
            emotion,
            confidence: Math.round(confidence * 100) / 100,
            timestamp: Date.now(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        };

        const history = this.getEmotionHistory();
        history.push(record);

        localStorage.setItem(this.storageKey, JSON.stringify(history));

        return record;
    }

    /**
     * Get emotion history with optional date range filter
     * @param {Object} options - Filter options
     * @returns {Array} Emotion records
     */
    getEmotionHistory(options = {}) {
        try {
            const history = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

            if (!options.startDate && !options.endDate) {
                return history;
            }

            return history.filter(record => {
                const recordDate = new Date(record.timestamp);
                if (options.startDate && recordDate < new Date(options.startDate)) {
                    return false;
                }
                if (options.endDate && recordDate > new Date(options.endDate)) {
                    return false;
                }
                return true;
            });
        } catch (error) {
            console.error('Error reading emotion history:', error);
            return [];
        }
    }

    /**
     * Update existing emotion record
     * @param {number} id - Record ID
     * @param {Object} updates - Fields to update
     * @returns {boolean} Success status
     */
    updateEmotion(id, updates) {
        const history = this.getEmotionHistory();
        const index = history.findIndex(record => record.id === id);

        if (index === -1) {
            return false;
        }

        history[index] = { ...history[index], ...updates };
        localStorage.setItem(this.storageKey, JSON.stringify(history));

        return true;
    }

    /**
     * Delete emotion record
     * @param {number} id - Record ID
     * @returns {boolean} Success status
     */
    deleteEmotion(id) {
        const history = this.getEmotionHistory();
        const filtered = history.filter(record => record.id !== id);

        if (filtered.length === history.length) {
            return false;
        }

        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
        return true;
    }

    /**
     * Get statistics for emotion history
     * @param {Object} options - Filter options
     * @returns {Object} Statistics
     */
    getStatistics(options = {}) {
        const history = this.getEmotionHistory(options);

        if (history.length === 0) {
            return {
                total: 0,
                distribution: {},
                dominant: null,
                averageConfidence: 0,
                moodScore: 50
            };
        }

        // Calculate emotion distribution
        const distribution = {};
        let totalConfidence = 0;

        history.forEach(record => {
            distribution[record.emotion] = (distribution[record.emotion] || 0) + 1;
            totalConfidence += record.confidence;
        });

        // Find dominant emotion
        const dominant = Object.keys(distribution).reduce((a, b) =>
            distribution[a] > distribution[b] ? a : b
        );

        // Calculate mood score (0-100)
        const moodWeights = {
            happy: 100,
            neutral: 50,
            surprised: 60,
            sad: 20,
            angry: 10,
            fearful: 15,
            disgusted: 25
        };

        const moodScore = Math.round(
            history.reduce((sum, record) =>
                sum + (moodWeights[record.emotion] || 50), 0
            ) / history.length
        );

        return {
            total: history.length,
            distribution,
            dominant,
            averageConfidence: Math.round((totalConfidence / history.length) * 100) / 100,
            moodScore
        };
    }

    /**
     * Get today's emotions
     * @returns {Array}
     */
    getTodayEmotions() {
        const today = new Date().toISOString().split('T')[0];
        return this.getEmotionHistory().filter(record => record.date === today);
    }

    /**
     * Get this week's emotions
     * @returns {Array}
     */
    getWeekEmotions() {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        return this.getEmotionHistory({
            startDate: weekAgo.toISOString()
        });
    }

    /**
     * Get last N emotions
     * @param {number} count - Number of emotions to retrieve
     * @returns {Array}
     */
    getLastEmotions(count = 10) {
        const history = this.getEmotionHistory();
        return history.slice(-count);
    }

    /**
     * Clear all emotion data
     */
    clearAllData() {
        localStorage.removeItem(this.storageKey);
    }

    /**
     * Export data as JSON
     * @returns {string}
     */
    exportData() {
        const history = this.getEmotionHistory();
        return JSON.stringify(history, null, 2);
    }

    /**
     * Import data from JSON
     * @param {string} jsonData 
     * @returns {boolean}
     */
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format');
            }
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }
}

// Export singleton instance
export default new MoodStorage();
