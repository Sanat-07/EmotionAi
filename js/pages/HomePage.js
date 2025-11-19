// ===================================
// HOME PAGE
// Landing page with hero section and features
// ===================================

export function renderHomePage() {
    return `
        <div class="container mx-auto px-6 py-12">
            <!-- Hero Section -->
            <div class="text-center mb-16 fade-in">
                <div class="text-8xl mb-6 animate-float">🧠</div>
                <h1 class="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Emotion Detection AI
                </h1>
                <p class="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Understand your emotions in real-time with AI-powered facial recognition. 
                    Track your mood, visualize patterns, and get personalized psychological support.
                </p>
                <button onclick="window.navigateTo('detection')" class="btn-primary">
                    🎥 Start Emotion Scan
                </button>
            </div>

            <!-- Features Grid -->
            <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <!-- Feature 1 -->
                <div class="glass-card p-8 hover:scale-105 transition-transform duration-300">
                    <div class="text-5xl mb-4">🎭</div>
                    <h3 class="text-2xl font-bold mb-3">Real-Time Detection</h3>
                    <p class="text-gray-300">
                        Advanced AI analyzes your facial expressions to detect emotions like happy, sad, angry, and more in real-time at 25-30 FPS.
                    </p>
                </div>

                <!-- Feature 2 -->
                <div class="glass-card p-8 hover:scale-105 transition-transform duration-300">
                    <div class="text-5xl mb-4">📊</div>
                    <h3 class="text-2xl font-bold mb-3">Mood Tracking</h3>
                    <p class="text-gray-300">
                        Visualize your emotional journey with beautiful charts. Track daily patterns and weekly trends to understand yourself better.
                    </p>
                </div>

                <!-- Feature 3 -->
                <div class="glass-card p-8 hover:scale-105 transition-transform duration-300">
                    <div class="text-5xl mb-4">🤖</div>
                    <h3 class="text-2xl font-bold mb-3">AI Assistant</h3>
                    <p class="text-gray-300">
                        Get personalized support from an AI psychology assistant that adapts to your emotional state and provides helpful guidance.
                    </p>
                </div>
            </div>

            <!-- How It Works -->
            <div class="mt-20 max-w-4xl mx-auto">
                <h2 class="text-4xl font-bold text-center mb-12">How It Works</h2>
                <div class="space-y-6">
                    <div class="flex items-start gap-4 glass-card p-6">
                        <div class="text-3xl flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">1</div>
                        <div>
                            <h4 class="text-xl font-semibold mb-2">Grant Camera Access</h4>
                            <p class="text-gray-300">Allow the app to access your webcam. Your privacy is protected - all processing happens locally in your browser.</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4 glass-card p-6">
                        <div class="text-3xl flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">2</div>
                        <div>
                            <h4 class="text-xl font-semibold mb-2">AI Analyzes Your Face</h4>
                            <p class="text-gray-300">TensorFlow.js models detect your facial expressions and identify emotions with high accuracy.</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4 glass-card p-6">
                        <div class="text-3xl flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">3</div>
                        <div>
                            <h4 class="text-xl font-semibold mb-2">Track & Improve</h4>
                            <p class="text-gray-300">View your mood history, get insights, and chat with the AI assistant for personalized support.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CTA Section -->
            <div class="mt-20 text-center glass-card p-12 max-w-3xl mx-auto">
                <h2 class="text-3xl font-bold mb-4">Ready to understand your emotions?</h2>
                <p class="text-gray-300 mb-6">Start your emotional wellness journey today with AI-powered insights.</p>
                <button onclick="window.navigateTo('detection')" class="btn-primary">
                    Get Started Now →
                </button>
            </div>
        </div>
    `;
}
