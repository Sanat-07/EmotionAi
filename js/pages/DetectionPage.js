// ===================================
// EMOTION DETECTION PAGE
// Real-time webcam emotion detection
// ===================================

import emotionDetector from '../services/emotionDetector.js';
import cameraService from '../services/cameraService.js';
import moodStorage from '../services/moodStorage.js';
import { EMOTIONS } from '../utils/constants.js';

let detectionActive = false;
let saveInterval = null;
let lastEmotion = null;
let emotionHistory = [];

export function renderDetectionPage() {
    return `
        <div class="container mx-auto px-6 py-8">
            <div class="max-w-7xl mx-auto">
                <h1 class="text-4xl font-bold mb-8">🎥 Emotion Detection</h1>
                
                <div class="grid lg:grid-cols-3 gap-8">
                    <!-- Video Feed -->
                    <div class="lg:col-span-2">
                        <div class="glass-card p-6">
                            <div class="video-container mb-4" id="video-wrapper">
                                <video id="webcam" autoplay muted playsinline class="rounded-lg"></video>
                                <canvas id="overlay-canvas"></canvas>
                                <div class="fps-counter" id="fps-display">0 FPS</div>
                            </div>
                            
                            <div class="flex gap-4 justify-center">
                                <button id="start-detection-btn" class="btn-primary">
                                    ▶️ Start Detection
                                </button>
                                <button id="stop-detection-btn" class="btn-secondary hidden">
                                    ⏸️ Stop Detection
                                </button>
                            </div>
                            
                            <div id="camera-error" class="hidden mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
                            </div>
                        </div>
                    </div>

                    <!-- Emotion Info Sidebar -->
                    <div class="space-y-6">
                        <!-- Current Emotion -->
                        <div class="glass-card p-6">
                            <h3 class="text-xl font-semibold mb-4">Current Emotion</h3>
                            <div id="current-emotion-display" class="text-center">
                                <div class="text-6xl mb-3">😐</div>
                                <div class="text-2xl font-bold mb-2">Neutral</div>
                                <div class="text-gray-400">Confidence: 0%</div>
                            </div>
                        </div>

                        <!-- Mini Live Graph -->
                        <div class="glass-card p-6">
                            <h3 class="text-xl font-semibold mb-4">Live Emotion Timeline</h3>
                            <canvas id="mini-chart" class="w-full" height="150"></canvas>
                        </div>

                        <!-- Stats -->
                        <div class="glass-card p-6">
                            <h3 class="text-xl font-semibold mb-4">Session Stats</h3>
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-gray-400">Detections:</span>
                                    <span id="detection-count" class="font-semibold">0</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-400">Duration:</span>
                                    <span id="session-duration" class="font-semibold">0:00</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-gray-400">Auto-saved:</span>
                                    <span id="save-count" class="font-semibold">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initDetectionPage() {
    const startBtn = document.getElementById('start-detection-btn');
    const stopBtn = document.getElementById('stop-detection-btn');
    const videoElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('overlay-canvas');
    const errorDiv = document.getElementById('camera-error');

    let sessionStart = null;
    let durationInterval = null;
    let detectionCount = 0;
    let saveCount = 0;

    // Initialize mini chart
    const miniChart = initMiniChart();

    startBtn.addEventListener('click', async () => {
        try {
            errorDiv.classList.add('hidden');
            startBtn.disabled = true;
            startBtn.textContent = '⏳ Loading...';

            // Load models
            await emotionDetector.loadModels();

            // Start camera
            await cameraService.startCamera(videoElement);

            // Start detection
            await emotionDetector.startDetection(videoElement, canvasElement, (emotionData) => {
                if (emotionData) {
                    lastEmotion = emotionData;
                    updateEmotionDisplay(emotionData);
                    updateMiniChart(miniChart, emotionData);
                    detectionCount++;
                    document.getElementById('detection-count').textContent = detectionCount;
                }
            });

            detectionActive = true;
            sessionStart = Date.now();

            // Update FPS
            setInterval(() => {
                const fps = emotionDetector.getFps();
                document.getElementById('fps-display').textContent = `${fps} FPS`;
            }, 1000);

            // Update duration
            durationInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                document.getElementById('session-duration').textContent =
                    `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);

            // Auto-save every 10 seconds
            saveInterval = setInterval(() => {
                if (lastEmotion) {
                    moodStorage.saveEmotion(lastEmotion.emotion, lastEmotion.confidence);
                    saveCount++;
                    document.getElementById('save-count').textContent = saveCount;
                }
            }, 10000);

            startBtn.classList.add('hidden');
            stopBtn.classList.remove('hidden');

        } catch (error) {
            console.error('Detection start error:', error);
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
            startBtn.disabled = false;
            startBtn.textContent = '▶️ Start Detection';
        }
    });

    stopBtn.addEventListener('click', () => {
        emotionDetector.stopDetection();
        cameraService.stopCamera();

        if (saveInterval) {
            clearInterval(saveInterval);
        }
        if (durationInterval) {
            clearInterval(durationInterval);
        }

        detectionActive = false;
        stopBtn.classList.add('hidden');
        startBtn.classList.remove('hidden');
        startBtn.disabled = false;
        startBtn.textContent = '▶️ Start Detection';
    });
}

function updateEmotionDisplay(emotionData) {
    const { emotion, confidence } = emotionData;
    const emotionConfig = EMOTIONS[emotion];

    if (!emotionConfig) return;

    const displayDiv = document.getElementById('current-emotion-display');
    displayDiv.innerHTML = `
        <div class="text-6xl mb-3 animate-pulse-slow">${emotionConfig.emoji}</div>
        <div class="text-2xl font-bold mb-2" style="color: ${emotionConfig.color}">
            ${emotionConfig.label}
        </div>
        <div class="text-gray-400">Confidence: ${Math.round(confidence * 100)}%</div>
        <div class="mt-3 w-full bg-gray-700 rounded-full h-2">
            <div class="h-2 rounded-full transition-all duration-300" 
                 style="width: ${confidence * 100}%; background-color: ${emotionConfig.color}">
            </div>
        </div>
    `;
}

function initMiniChart() {
    const ctx = document.getElementById('mini-chart').getContext('2d');

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Confidence',
                data: [],
                borderColor: '#a78bfa',
                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#9ca3af'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        display: false
                    }
                }
            }
        }
    });
}

function updateMiniChart(chart, emotionData) {
    const now = new Date().toLocaleTimeString();

    chart.data.labels.push(now);
    chart.data.datasets[0].data.push(emotionData.confidence);

    // Keep only last 20 data points
    if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    chart.update('none'); // Update without animation for performance
}
