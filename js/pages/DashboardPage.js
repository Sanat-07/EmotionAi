// ===================================
// DASHBOARD PAGE
// Mood tracking with charts and statistics
// ===================================

import moodStorage from '../services/moodStorage.js';
import { EMOTIONS, CHART_COLORS } from '../utils/constants.js';

export function renderDashboardPage() {
    const stats = moodStorage.getStatistics();
    const todayStats = moodStorage.getStatistics({
        startDate: new Date().toISOString().split('T')[0]
    });
    const weekStats = moodStorage.getStatistics({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    });

    return `
        <div class="container mx-auto px-6 py-8">
            <div class="max-w-7xl mx-auto">
                <h1 class="text-4xl font-bold mb-8">📊 Mood Dashboard</h1>

                <!-- Summary Cards -->
                <div class="grid md:grid-cols-4 gap-6 mb-8">
                    <div class="glass-card p-6">
                        <div class="text-gray-400 text-sm mb-2">Total Detections</div>
                        <div class="text-3xl font-bold">${stats.total}</div>
                    </div>
                    <div class="glass-card p-6">
                        <div class="text-gray-400 text-sm mb-2">Today's Dominant</div>
                        <div class="text-3xl">${todayStats.dominant ? EMOTIONS[todayStats.dominant]?.emoji : '—'}</div>
                        <div class="text-sm mt-1">${todayStats.dominant || 'No data'}</div>
                    </div>
                    <div class="glass-card p-6">
                        <div class="text-gray-400 text-sm mb-2">Week's Dominant</div>
                        <div class="text-3xl">${weekStats.dominant ? EMOTIONS[weekStats.dominant]?.emoji : '—'}</div>
                        <div class="text-sm mt-1">${weekStats.dominant || 'No data'}</div>
                    </div>
                    <div class="glass-card p-6">
                        <div class="text-gray-400 text-sm mb-2">Mood Score</div>
                        <div class="text-3xl font-bold">${stats.moodScore}/100</div>
                    </div>
                </div>

                <!-- Charts -->
                <div class="grid lg:grid-cols-2 gap-8 mb-8">
                    <!-- Pie Chart -->
                    <div class="glass-card p-6">
                        <h3 class="text-xl font-semibold mb-4">Emotion Distribution</h3>
                        <div class="chart-container">
                            <canvas id="pie-chart"></canvas>
                        </div>
                    </div>

                    <!-- Timeline Chart -->
                    <div class="glass-card p-6">
                        <h3 class="text-xl font-semibold mb-4">Emotion Timeline</h3>
                        <div class="flex gap-2 mb-4">
                            <button class="timeline-filter btn-secondary text-sm py-2 px-3" data-range="day">Day</button>
                            <button class="timeline-filter btn-secondary text-sm py-2 px-3 active" data-range="week">Week</button>
                            <button class="timeline-filter btn-secondary text-sm py-2 px-3" data-range="month">Month</button>
                        </div>
                        <div class="chart-container">
                            <canvas id="timeline-chart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Emotion History Table -->
                <div class="glass-card p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-semibold">Emotion History</h3>
                        <button id="clear-data-btn" class="btn-danger text-sm py-2 px-4">
                            🗑️ Clear All Data
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full" id="emotion-table">
                            <thead>
                                <tr class="border-b border-gray-700">
                                    <th class="text-left py-3 px-4">Emotion</th>
                                    <th class="text-left py-3 px-4">Confidence</th>
                                    <th class="text-left py-3 px-4">Date</th>
                                    <th class="text-left py-3 px-4">Time</th>
                                    <th class="text-right py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="history-tbody">
                                <!-- Populated by JS -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initDashboardPage() {
    // Initialize charts
    const pieChart = initPieChart();
    const timelineChart = initTimelineChart('week');

    // Populate history table
    updateHistoryTable();

    // Timeline filter buttons
    document.querySelectorAll('.timeline-filter').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.timeline-filter').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const range = e.target.dataset.range;
            updateTimelineChart(timelineChart, range);
        });
    });

    // Clear data button
    document.getElementById('clear-data-btn').addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all emotion data? This cannot be undone.')) {
            moodStorage.clearAllData();
            window.location.reload();
        }
    });
}

function initPieChart() {
    const ctx = document.getElementById('pie-chart').getContext('2d');
    const stats = moodStorage.getStatistics();

    const labels = Object.keys(stats.distribution);
    const data = Object.values(stats.distribution);
    const colors = labels.map(emotion => CHART_COLORS[emotion] || '#6b7280');

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.map(e => EMOTIONS[e]?.label || e),
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#fff',
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((context.parsed / total) * 100);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function initTimelineChart(range) {
    const ctx = document.getElementById('timeline-chart').getContext('2d');

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#fff',
                        padding: 10,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#9ca3af'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#9ca3af'
                    }
                }
            }
        }
    });
}

function updateTimelineChart(chart, range) {
    let startDate;
    const now = new Date();

    if (range === 'day') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const history = moodStorage.getEmotionHistory({
        startDate: startDate.toISOString()
    });

    // Group by time buckets
    const buckets = {};
    history.forEach(record => {
        const time = new Date(record.timestamp);
        let key;

        if (range === 'day') {
            key = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else {
            key = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        if (!buckets[key]) {
            buckets[key] = {};
        }
        buckets[key][record.emotion] = (buckets[key][record.emotion] || 0) + 1;
    });

    // Prepare datasets
    const emotions = [...new Set(history.map(r => r.emotion))];
    const labels = Object.keys(buckets);
    const datasets = emotions.map(emotion => ({
        label: EMOTIONS[emotion]?.label || emotion,
        data: labels.map(label => buckets[label][emotion] || 0),
        borderColor: CHART_COLORS[emotion],
        backgroundColor: CHART_COLORS[emotion] + '40',
        tension: 0.4
    }));

    chart.data.labels = labels;
    chart.data.datasets = datasets;
    chart.update();
}

function updateHistoryTable() {
    const tbody = document.getElementById('history-tbody');
    const history = moodStorage.getEmotionHistory().reverse().slice(0, 50); // Last 50

    if (history.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-8 text-gray-400">
                    No emotion data yet. Start detecting emotions to see your history!
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = history.map(record => {
        const emotion = EMOTIONS[record.emotion];
        return `
            <tr class="border-b border-gray-800 hover:bg-white/5">
                <td class="py-3 px-4">
                    <span class="emotion-badge ${record.emotion}">
                        ${emotion?.emoji || ''} ${emotion?.label || record.emotion}
                    </span>
                </td>
                <td class="py-3 px-4">${Math.round(record.confidence * 100)}%</td>
                <td class="py-3 px-4">${record.date}</td>
                <td class="py-3 px-4">${record.time}</td>
                <td class="py-3 px-4 text-right">
                    <button onclick="deleteEmotion(${record.id})" class="text-red-400 hover:text-red-300">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Global function for delete
window.deleteEmotion = function (id) {
    if (confirm('Delete this emotion record?')) {
        moodStorage.deleteEmotion(id);
        updateHistoryTable();
        window.location.reload(); // Refresh to update charts
    }
};
