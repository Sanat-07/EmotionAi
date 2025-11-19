// ===================================
// AI SERVICE
// Generates AI responses based on emotions and patterns
// ===================================

import { EMOTIONS, AI_MODES } from '../utils/constants.js';
import moodStorage from './moodStorage.js';

class AIService {
    constructor() {
        this.currentMode = 'supportive';
    }

    /**
     * Set AI mode
     * @param {string} mode - supportive, cbt, or motivational
     */
    setMode(mode) {
        if (AI_MODES[mode]) {
            this.currentMode = mode;
        }
    }

    /**
     * Generate AI response based on user message and emotion context
     * @param {string} userMessage - User's message
     * @param {string} currentEmotion - Current detected emotion
     * @param {Array} emotionHistory - Recent emotion history
     * @returns {string} AI response
     */
    generateResponse(userMessage, currentEmotion, emotionHistory = []) {
        // Analyze emotion pattern
        const pattern = this.analyzeEmotionPattern(emotionHistory);

        // Get base response for current emotion
        let response = this.getEmotionAdvice(currentEmotion, this.currentMode);

        // Add pattern-based insights
        if (pattern.trend === 'improving') {
            response += " I've noticed your mood has been improving lately. That's great progress!";
        } else if (pattern.trend === 'declining') {
            response += " I've noticed some changes in your mood recently. Let's work through this together.";
        } else if (pattern.volatility === 'high') {
            response += " Your emotions have been quite varied. It's normal to experience different feelings.";
        }

        // Add personalized response based on user message
        if (userMessage && userMessage.trim().length > 0) {
            response = this.personalizeResponse(userMessage, currentEmotion, response);
        }

        return response;
    }

    /**
     * Get emotion-specific advice based on AI mode
     * @param {string} emotion - Emotion name
     * @param {string} mode - AI mode
     * @returns {string}
     */
    getEmotionAdvice(emotion, mode) {
        const emotionData = EMOTIONS[emotion];
        if (!emotionData || !emotionData.advice) {
            return "I'm here to support you. How are you feeling?";
        }

        return emotionData.advice[mode] || emotionData.advice.supportive;
    }

    /**
     * Analyze emotion pattern from history
     * @param {Array} emotionHistory - Array of emotion records
     * @returns {Object} Pattern analysis
     */
    analyzeEmotionPattern(emotionHistory) {
        if (emotionHistory.length < 3) {
            return {
                trend: 'stable',
                volatility: 'low',
                dominantEmotion: null
            };
        }

        // Calculate mood scores
        const moodWeights = {
            happy: 100,
            neutral: 50,
            surprised: 60,
            sad: 20,
            angry: 10,
            fearful: 15,
            disgusted: 25
        };

        const scores = emotionHistory.map(record =>
            moodWeights[record.emotion] || 50
        );

        // Determine trend
        const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
        const secondHalf = scores.slice(Math.floor(scores.length / 2));

        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

        let trend = 'stable';
        if (secondAvg > firstAvg + 10) {
            trend = 'improving';
        } else if (secondAvg < firstAvg - 10) {
            trend = 'declining';
        }

        // Calculate volatility
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((sum, score) =>
            sum + Math.pow(score - avg, 2), 0
        ) / scores.length;
        const volatility = variance > 400 ? 'high' : variance > 200 ? 'medium' : 'low';

        // Find dominant emotion
        const emotionCounts = {};
        emotionHistory.forEach(record => {
            emotionCounts[record.emotion] = (emotionCounts[record.emotion] || 0) + 1;
        });
        const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) =>
            emotionCounts[a] > emotionCounts[b] ? a : b
        );

        return {
            trend,
            volatility,
            dominantEmotion,
            averageScore: Math.round(avg)
        };
    }

    /**
     * Personalize response based on user message
     * @param {string} userMessage 
     * @param {string} currentEmotion 
     * @param {string} baseResponse 
     * @returns {string}
     */
    personalizeResponse(userMessage, currentEmotion, baseResponse) {
        const lowerMessage = userMessage.toLowerCase();

        // Detect keywords and adjust response
        const keywords = {
            work: "Work can be challenging. Remember to take breaks and maintain balance.",
            stress: "Stress is natural, but managing it is important. Have you tried deep breathing or a short walk?",
            tired: "Rest is essential for wellbeing. Make sure you're getting enough sleep.",
            anxious: "Anxiety can feel overwhelming. Let's break down what's worrying you.",
            excited: "That's wonderful! Positive energy is contagious!",
            help: "I'm here to help. What specific support do you need right now?",
            thanks: "You're welcome! I'm always here when you need support.",
            lonely: "Feeling lonely is tough. Remember, reaching out is a sign of strength.",
            angry: "It's okay to feel angry. Let's explore what triggered this feeling.",
            sad: "I hear you. It's okay to feel sad. Would you like to talk about it?"
        };

        for (const [keyword, response] of Object.entries(keywords)) {
            if (lowerMessage.includes(keyword)) {
                return `${baseResponse}\n\n${response}`;
            }
        }

        // Default personalized response
        if (this.currentMode === 'cbt') {
            return `${baseResponse}\n\nWhat thoughts are going through your mind right now?`;
        } else if (this.currentMode === 'motivational') {
            return `${baseResponse}\n\nWhat's one small step you can take today to move forward?`;
        } else {
            return `${baseResponse}\n\nI'm listening. Tell me more about what's on your mind.`;
        }
    }

    /**
     * Generate greeting based on time and emotion
     * @param {string} currentEmotion 
     * @returns {string}
     */
    generateGreeting(currentEmotion) {
        const hour = new Date().getHours();
        let timeGreeting = 'Hello';

        if (hour < 12) {
            timeGreeting = 'Good morning';
        } else if (hour < 18) {
            timeGreeting = 'Good afternoon';
        } else {
            timeGreeting = 'Good evening';
        }

        const emotionEmoji = EMOTIONS[currentEmotion]?.emoji || '😊';

        return `${timeGreeting}! ${emotionEmoji} I can see you're feeling ${currentEmotion}. How can I support you today?`;
    }

    /**
     * Get weekly summary insights
     * @returns {string}
     */
    getWeeklySummary() {
        const weekData = moodStorage.getWeekEmotions();
        const stats = moodStorage.getStatistics({
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        });

        if (weekData.length === 0) {
            return "You haven't tracked any emotions this week yet. Start using the emotion detector to build your mood history!";
        }

        const { dominant, moodScore, total } = stats;
        const emotionEmoji = EMOTIONS[dominant]?.emoji || '😊';

        let summary = `📊 **Weekly Summary**\n\n`;
        summary += `You've tracked ${total} emotions this week. `;
        summary += `Your dominant emotion was ${dominant} ${emotionEmoji}. `;
        summary += `Your overall mood score is ${moodScore}/100.\n\n`;

        if (moodScore >= 70) {
            summary += "You've had a great week! Keep up the positive momentum! 🌟";
        } else if (moodScore >= 50) {
            summary += "You've had a balanced week with ups and downs. That's completely normal! 💪";
        } else {
            summary += "This week has been challenging. Remember, tough times don't last. I'm here to support you. 🤗";
        }

        return summary;
    }

    /**
     * Get current mode
     * @returns {string}
     */
    getMode() {
        return this.currentMode;
    }
}

// Export singleton instance
export default new AIService();
