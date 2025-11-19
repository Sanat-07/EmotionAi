// ===================================
// SETTINGS PAGE
// App configuration and preferences
// ===================================

import moodStorage from '../services/moodStorage.js';
import { STORAGE_KEYS, DEFAULT_SETTINGS, LANGUAGES } from '../utils/constants.js';

export function renderSettingsPage() {
    const settings = getSettings();

    return `
        <div class="container mx-auto px-6 py-8">
            <div class="max-w-4xl mx-auto">
                <h1 class="text-4xl font-bold mb-8">⚙️ Settings</h1>

                <!-- Camera Settings -->
                <div class="glass-card p-6 mb-6">
                    <h3 class="text-xl font-semibold mb-4">📷 Camera Settings</h3>
                    <div class="space-y-4">
                        <div>
                            <button id="reset-camera-btn" class="btn-secondary">
                                Reset Camera Permissions
                            </button>
                            <p class="text-sm text-gray-400 mt-2">
                                If you're having camera issues, try resetting permissions and refreshing the page.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Detection Settings -->
                <div class="glass-card p-6 mb-6">
                    <h3 class="text-xl font-semibold mb-4">🎯 Detection Settings</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-400 mb-2">
                                Emotion Sensitivity: <span id="sensitivity-value">${Math.round(settings.sensitivity * 100)}%</span>
                            </label>
                            <input 
                                type="range" 
                                id="sensitivity-slider" 
                                min="0" 
                                max="100" 
                                value="${settings.sensitivity * 100}"
                                class="w-full"
                            >
                            <p class="text-xs text-gray-500 mt-1">
                                Higher sensitivity detects subtle emotions, lower reduces false positives
                            </p>
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="font-medium">Auto-save Emotions</div>
                                <div class="text-sm text-gray-400">Automatically save detected emotions every 10 seconds</div>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="auto-save-toggle" class="sr-only peer" ${settings.autoSave ? 'checked' : ''}>
                                <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Language Settings -->
                <div class="glass-card p-6 mb-6">
                    <h3 class="text-xl font-semibold mb-4">🌐 Language</h3>
                    <select id="language-select" class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
                        ${Object.entries(LANGUAGES).map(([code, name]) => `
                            <option value="${code}" ${settings.language === code ? 'selected' : ''}>
                                ${name}
                            </option>
                        `).join('')}
                    </select>
                    <p class="text-sm text-gray-400 mt-2">
                        Note: Full translation support coming soon. Currently affects UI labels only.
                    </p>
                </div>

                <!-- Data Management -->
                <div class="glass-card p-6 mb-6">
                    <h3 class="text-xl font-semibold mb-4">💾 Data Management</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                            <div>
                                <div class="font-medium">Total Emotion Records</div>
                                <div class="text-sm text-gray-400">${moodStorage.getEmotionHistory().length} records stored locally</div>
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <button id="export-data-btn" class="btn-secondary flex-1">
                                📥 Export Data
                            </button>
                            <button id="import-data-btn" class="btn-secondary flex-1">
                                📤 Import Data
                            </button>
                        </div>
                        <input type="file" id="import-file-input" accept=".json" class="hidden">
                    </div>
                </div>

                <!-- Danger Zone -->
                <div class="glass-card p-6 border-2 border-red-500/30">
                    <h3 class="text-xl font-semibold mb-4 text-red-400">⚠️ Danger Zone</h3>
                    <div class="space-y-4">
                        <div>
                            <button id="clear-all-data-btn" class="btn-danger w-full">
                                🗑️ Clear All Emotion Data
                            </button>
                            <p class="text-sm text-gray-400 mt-2">
                                This will permanently delete all your emotion history. This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- App Info -->
                <div class="glass-card p-6 mt-6">
                    <h3 class="text-xl font-semibold mb-4">ℹ️ About</h3>
                    <div class="space-y-2 text-sm text-gray-400">
                        <div class="flex justify-between">
                            <span>Version:</span>
                            <span class="text-white">1.0.0</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Built with:</span>
                            <span class="text-white">TensorFlow.js, face-api.js, Chart.js</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Privacy:</span>
                            <span class="text-white">All data stored locally</span>
                        </div>
                    </div>
                </div>

                <!-- Creator Info -->
                <div class="glass-card p-6 mt-6">
                    <h3 class="text-xl font-semibold mb-4">👨‍💻 Creator</h3>
                    <div class="space-y-3">
                        <div class="text-center mb-4">
                            <div class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Sanat Bogenbaev
                            </div>
                        </div>
                        <div class="space-y-2 text-sm">
                            <a href="https://instagram.com/bogenbaevjr" target="_blank" class="flex items-center gap-3 p-3 glass-button rounded-lg hover:bg-white/10 transition-all">
                                <span class="text-2xl">📷</span>
                                <div>
                                    <div class="text-white font-medium">Instagram</div>
                                    <div class="text-gray-400">@bogenbaevjr</div>
                                </div>
                            </a>
                            <a href="https://t.me/jrdsta" target="_blank" class="flex items-center gap-3 p-3 glass-button rounded-lg hover:bg-white/10 transition-all">
                                <span class="text-2xl">✈️</span>
                                <div>
                                    <div class="text-white font-medium">Telegram</div>
                                    <div class="text-gray-400">@jrdsta</div>
                                </div>
                            </a>
                            <a href="tel:+77762700967" class="flex items-center gap-3 p-3 glass-button rounded-lg hover:bg-white/10 transition-all">
                                <span class="text-2xl">📞</span>
                                <div>
                                    <div class="text-white font-medium">Phone</div>
                                    <div class="text-gray-400">+7 776 270 0967</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initSettingsPage() {
    const settings = getSettings();

    // Sensitivity slider
    const sensitivitySlider = document.getElementById('sensitivity-slider');
    const sensitivityValue = document.getElementById('sensitivity-value');

    sensitivitySlider.addEventListener('input', (e) => {
        const value = e.target.value;
        sensitivityValue.textContent = value + '%';
        saveSettings({ sensitivity: value / 100 });
    });

    // Auto-save toggle
    document.getElementById('auto-save-toggle').addEventListener('change', (e) => {
        saveSettings({ autoSave: e.target.checked });
    });

    // Language select
    document.getElementById('language-select').addEventListener('change', (e) => {
        saveSettings({ language: e.target.value });
    });

    // Reset camera
    document.getElementById('reset-camera-btn').addEventListener('click', () => {
        alert('Please refresh the page and grant camera permissions again when prompted.');
    });

    // Export data
    document.getElementById('export-data-btn').addEventListener('click', () => {
        const data = moodStorage.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `emotion-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // Import data
    document.getElementById('import-data-btn').addEventListener('click', () => {
        document.getElementById('import-file-input').click();
    });

    document.getElementById('import-file-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const success = moodStorage.importData(event.target.result);
                if (success) {
                    alert('Data imported successfully!');
                    window.location.reload();
                } else {
                    alert('Failed to import data. Please check the file format.');
                }
            } catch (error) {
                alert('Error importing data: ' + error.message);
            }
        };
        reader.readAsText(file);
    });

    // Clear all data
    document.getElementById('clear-all-data-btn').addEventListener('click', () => {
        const confirmation = prompt('Type "DELETE" to confirm clearing all data:');
        if (confirmation === 'DELETE') {
            moodStorage.clearAllData();
            localStorage.removeItem(STORAGE_KEYS.SETTINGS);
            alert('All data cleared successfully.');
            window.location.reload();
        }
    });
}

function getSettings() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch (error) {
        return DEFAULT_SETTINGS;
    }
}

function saveSettings(updates) {
    const current = getSettings();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
}
