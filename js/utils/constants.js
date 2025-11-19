export const EMOTIONS = {
    happy: {
        label: 'Happy',
        emoji: '😊',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.2)',
        advice: {
            supportive: "That's wonderful! Your positive energy is contagious. Keep spreading those good vibes!",
            cbt: "Great mood! What specific thoughts or events contributed to this positive feeling?",
            motivational: "You're on fire! Channel this energy into your goals and watch yourself soar!"
        }
    },
    sad: {
        label: 'Sad',
        emoji: '😢',
        color: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.2)',
        advice: {
            supportive: "I'm here for you. It's okay to feel sad sometimes. Would you like to talk about what's on your mind?",
            cbt: "I notice you're feeling down. Can you identify what thoughts are contributing to this feeling?",
            motivational: "Tough times don't last, but tough people do. This is temporary, and you're stronger than you think."
        }
    },
    angry: {
        label: 'Angry',
        emoji: '😡',
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.2)',
        advice: {
            supportive: "I can see you're upset. Take a deep breath. Let's work through this together.",
            cbt: "What triggered this anger? Let's examine if there's another way to interpret the situation.",
            motivational: "Use this energy constructively. Channel your frustration into positive action and growth."
        }
    },
    neutral: {
        label: 'Neutral',
        emoji: '😐',
        color: '#6b7280',
        bgColor: 'rgba(107, 114, 128, 0.2)',
        advice: {
            supportive: "You seem calm and balanced. How are you feeling about things in general?",
            cbt: "A neutral state can be peaceful. What would make this moment more meaningful for you?",
            motivational: "Steady and focused. This is a great time to set new goals and plan your next move!"
        }
    },
    surprised: {
        label: 'Surprised',
        emoji: '😮',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.2)',
        advice: {
            supportive: "Something caught your attention! Life is full of surprises.",
            cbt: "Unexpected moments can teach us a lot. What did you learn from this?",
            motivational: "Embrace the unexpected! Every surprise is an opportunity for growth."
        }
    },
    fearful: {
        label: 'Fearful',
        emoji: '😨',
        color: '#8b5cf6',
        bgColor: 'rgba(139, 92, 246, 0.2)',
        advice: {
            supportive: "It's natural to feel afraid sometimes. You're safe here. Let's talk about it.",
            cbt: "What's the worst that could happen? Let's challenge this fear with evidence.",
            motivational: "Courage isn't the absence of fear, it's acting despite it. You've got this!"
        }
    },
    disgusted: {
        label: 'Disgusted',
        emoji: '🤢',
        color: '#84cc16',
        bgColor: 'rgba(132, 204, 22, 0.2)',
        advice: {
            supportive: "Something's bothering you. It's okay to have boundaries and preferences.",
            cbt: "What values does this violate for you? Understanding this can help you respond better.",
            motivational: "Trust your instincts. They're protecting you and guiding your decisions."
        }
    }
};

export const AI_MODES = {
    supportive: {
        name: 'Supportive Friend',
        icon: '🤗',
        description: 'Warm, empathetic, and encouraging',
        color: '#10b981'
    },
    cbt: {
        name: 'CBT Helper',
        icon: '🧠',
        description: 'Cognitive behavioral therapy approach',
        color: '#3b82f6'
    },
    motivational: {
        name: 'Motivational Coach',
        icon: '🚀',
        description: 'Action-oriented and inspiring',
        color: '#f59e0b'
    }
};

export const DETECTION_CONFIG = {
    fps: 30,
    saveInterval: 10000,
    minConfidence: 0.5,
    modelPath: 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model/'
};

export const LANGUAGES = {
    en: 'English',
    kz: 'Қазақша',
    ru: 'Русский'
};

export const CHART_COLORS = {
    happy: '#10b981',
    sad: '#3b82f6',
    angry: '#ef4444',
    neutral: '#6b7280',
    surprised: '#f59e0b',
    fearful: '#8b5cf6',
    disgusted: '#84cc16'
};

export const STORAGE_KEYS = {
    EMOTION_HISTORY: 'emotionHistory',
    SETTINGS: 'appSettings',
    CHAT_HISTORY: 'chatHistory',
    AI_MODE: 'aiMode'
};

export const DEFAULT_SETTINGS = {
    language: 'en',
    theme: 'dark',
    sensitivity: 0.5,
    autoSave: true,
    notifications: true
};
