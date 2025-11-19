// ===================================
// EMOTION DETECTOR SERVICE
// TensorFlow.js + face-api.js integration
// ===================================

import { DETECTION_CONFIG, EMOTIONS } from '../utils/constants.js';

class EmotionDetector {
    constructor() {
        this.modelsLoaded = false;
        this.isDetecting = false;
        this.detectionLoop = null;
        this.fpsCounter = 0;
        this.lastFpsUpdate = Date.now();
        this.currentFps = 0;
    }

    /**
     * Load face-api.js models
     * @returns {Promise<void>}
     */
    async loadModels() {
        if (this.modelsLoaded) {
            return;
        }

        try {
            const modelPath = DETECTION_CONFIG.modelPath;

            // Load required models
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
                faceapi.nets.faceExpressionNet.loadFromUri(modelPath),
                faceapi.nets.faceLandmark68Net.loadFromUri(modelPath)
            ]);

            this.modelsLoaded = true;
            console.log('✅ Face detection models loaded successfully');
        } catch (error) {
            console.error('❌ Error loading models:', error);
            throw new Error('Failed to load emotion detection models');
        }
    }

    /**
     * Start emotion detection loop
     * @param {HTMLVideoElement} videoElement 
     * @param {HTMLCanvasElement} canvasElement 
     * @param {Function} onDetection - Callback for each detection
     * @returns {Promise<void>}
     */
    async startDetection(videoElement, canvasElement, onDetection) {
        if (!this.modelsLoaded) {
            await this.loadModels();
        }

        this.isDetecting = true;
        const displaySize = {
            width: videoElement.videoWidth || videoElement.width,
            height: videoElement.videoHeight || videoElement.height
        };

        // Match canvas size to video
        canvasElement.width = displaySize.width;
        canvasElement.height = displaySize.height;
        faceapi.matchDimensions(canvasElement, displaySize);

        // Detection loop
        const detect = async () => {
            if (!this.isDetecting) return;

            try {
                // Detect faces with expressions
                const detections = await faceapi
                    .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions();

                // Clear canvas
                const ctx = canvasElement.getContext('2d');
                ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

                if (detections.length > 0) {
                    // Resize detections to match canvas
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);

                    // Draw face landmarks and box
                    faceapi.draw.drawDetections(canvasElement, resizedDetections);
                    faceapi.draw.drawFaceLandmarks(canvasElement, resizedDetections);

                    // Get emotion from first detected face
                    const expressions = detections[0].expressions;
                    const emotion = this.getEmotionFromExpressions(expressions);

                    if (emotion && onDetection) {
                        onDetection(emotion);
                    }
                }

                // Update FPS
                this.updateFps();

            } catch (error) {
                console.error('Detection error:', error);
            }

            // Continue loop
            this.detectionLoop = requestAnimationFrame(detect);
        };

        detect();
    }

    /**
     * Stop emotion detection
     */
    stopDetection() {
        this.isDetecting = false;
        if (this.detectionLoop) {
            cancelAnimationFrame(this.detectionLoop);
            this.detectionLoop = null;
        }
    }

    /**
     * Get dominant emotion from face-api expressions
     * @param {Object} expressions - face-api expressions object
     * @returns {Object|null} Emotion data
     */
    getEmotionFromExpressions(expressions) {
        if (!expressions) return null;

        // Map face-api expressions to our emotion system
        const emotionMap = {
            happy: 'happy',
            sad: 'sad',
            angry: 'angry',
            neutral: 'neutral',
            surprised: 'surprised',
            fearful: 'fearful',
            disgusted: 'disgusted'
        };

        // Find emotion with highest confidence
        let maxEmotion = null;
        let maxConfidence = 0;

        Object.keys(emotionMap).forEach(key => {
            const confidence = expressions[key];
            if (confidence > maxConfidence) {
                maxConfidence = confidence;
                maxEmotion = emotionMap[key];
            }
        });

        // Only return if confidence is above threshold
        if (maxConfidence < DETECTION_CONFIG.minConfidence) {
            return null;
        }

        return {
            emotion: maxEmotion,
            confidence: maxConfidence,
            allExpressions: expressions
        };
    }

    /**
     * Update FPS counter
     */
    updateFps() {
        this.fpsCounter++;
        const now = Date.now();
        const elapsed = now - this.lastFpsUpdate;

        if (elapsed >= 1000) {
            this.currentFps = Math.round((this.fpsCounter * 1000) / elapsed);
            this.fpsCounter = 0;
            this.lastFpsUpdate = now;
        }
    }

    /**
     * Get current FPS
     * @returns {number}
     */
    getFps() {
        return this.currentFps;
    }

    /**
     * Check if models are loaded
     * @returns {boolean}
     */
    isReady() {
        return this.modelsLoaded;
    }

    /**
     * Get detection status
     * @returns {Object}
     */
    getStatus() {
        return {
            modelsLoaded: this.modelsLoaded,
            isDetecting: this.isDetecting,
            fps: this.currentFps
        };
    }
}

// Export singleton instance
export default new EmotionDetector();
