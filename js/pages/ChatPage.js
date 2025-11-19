// ===================================
// CHAT PAGE
// AI Psychology Assistant
// ===================================

import aiService from '../services/aiService.js';
import moodStorage from '../services/moodStorage.js';
import { EMOTIONS, AI_MODES } from '../utils/constants.js';

let chatMessages = [];
let currentEmotion = 'neutral';

export function renderChatPage() {
    // Get current emotion from recent history
    const recent = moodStorage.getLastEmotions(1);
    if (recent.length > 0) {
        currentEmotion = recent[0].emotion;
    }

    return `
        <div class="container mx-auto px-6 py-8">
            <div class="max-w-5xl mx-auto">
                <h1 class="text-4xl font-bold mb-8">🤖 AI Psychology Assistant</h1>

                <div class="glass-card overflow-hidden">
                    <!-- Chat Header -->
                    <div class="p-6 border-b border-gray-700">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-3">
                                <div class="text-4xl">${EMOTIONS[currentEmotion]?.emoji || '😐'}</div>
                                <div>
                                    <div class="text-sm text-gray-400">Current Emotion</div>
                                    <div class="text-lg font-semibold">${EMOTIONS[currentEmotion]?.label || 'Neutral'}</div>
                                </div>
                            </div>
                            <div id="ai-mode-selector" class="flex gap-2">
                                ${Object.keys(AI_MODES).map(mode => `
                                    <button class="ai-mode-btn ${mode === 'supportive' ? 'active' : ''}" data-mode="${mode}">
                                        <div class="text-2xl">${AI_MODES[mode].icon}</div>
                                        <div class="text-xs mt-1">${AI_MODES[mode].name.split(' ')[0]}</div>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                        <p class="text-sm text-gray-400" id="mode-description">
                            ${AI_MODES['supportive'].description}
                        </p>
                    </div>

                    <!-- Chat Messages -->
                    <div class="chat-messages" id="chat-messages">
                        <div class="chat-message ai">
                            <div class="message-avatar" style="background: rgba(167, 139, 250, 0.2);">
                                🤖
                            </div>
                            <div class="message-content">
                                ${aiService.generateGreeting(currentEmotion)}
                            </div>
                        </div>
                    </div>

                    <!-- Chat Input -->
                    <div class="chat-input-container">
                        <div class="flex gap-3">
                            <textarea 
                                id="chat-input" 
                                class="chat-input" 
                                placeholder="Type your message..."
                                rows="1"
                            ></textarea>
                            <button id="send-btn" class="btn-primary px-6">
                                Send
                            </button>
                        </div>
                        <div class="mt-3 flex gap-2 flex-wrap">
                            <button class="quick-action text-sm btn-secondary py-1 px-3">How am I doing?</button>
                            <button class="quick-action text-sm btn-secondary py-1 px-3">Weekly summary</button>
                            <button class="quick-action text-sm btn-secondary py-1 px-3">I'm feeling stressed</button>
                            <button class="quick-action text-sm btn-secondary py-1 px-3">Give me motivation</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initChatPage() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesContainer = document.getElementById('chat-messages');

    // AI Mode selector
    document.querySelectorAll('.ai-mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mode = e.currentTarget.dataset.mode;
            document.querySelectorAll('.ai-mode-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            aiService.setMode(mode);
            document.getElementById('mode-description').textContent = AI_MODES[mode].description;
        });
    });

    // Send message
    const sendMessage = () => {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage('user', message);
        chatInput.value = '';
        chatInput.style.height = 'auto';

        // Show typing indicator
        showTypingIndicator();

        // Get AI response
        setTimeout(() => {
            const emotionHistory = moodStorage.getLastEmotions(10);
            const response = aiService.generateResponse(message, currentEmotion, emotionHistory);

            hideTypingIndicator();
            addMessage('ai', response);
        }, 1000 + Math.random() * 1000); // Simulate thinking time
    };

    sendBtn.addEventListener('click', sendMessage);

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = chatInput.scrollHeight + 'px';
    });

    // Quick actions
    document.querySelectorAll('.quick-action').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = e.target.textContent;
            chatInput.value = text;
            sendMessage();
        });
    });
}

function addMessage(sender, content) {
    const messagesContainer = document.getElementById('chat-messages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;

    const avatar = sender === 'user' ? '👤' : '🤖';
    const bgColor = sender === 'user'
        ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'
        : 'background: rgba(167, 139, 250, 0.2);';

    messageDiv.innerHTML = `
        <div class="message-avatar" style="${bgColor}">
            ${avatar}
        </div>
        <div class="message-content">
            ${content.replace(/\n/g, '<br>')}
        </div>
    `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    chatMessages.push({ sender, content, timestamp: Date.now() });
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');

    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar" style="background: rgba(167, 139, 250, 0.2);">
            🤖
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}
