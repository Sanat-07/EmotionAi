class CameraService {
    constructor() {
        this.stream = null;
        this.videoElement = null;
    }

    async startCamera(videoElement) {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: false
            });

            this.videoElement = videoElement;
            videoElement.srcObject = this.stream;

            return new Promise((resolve, reject) => {
                videoElement.onloadedmetadata = () => {
                    videoElement.play();
                    resolve(this.stream);
                };
                videoElement.onerror = reject;
            });
        } catch (error) {
            console.error('Camera access error:', error);
            throw this.handleCameraError(error);
        }
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.videoElement) {
            this.videoElement.srcObject = null;
        }
    }

    isActive() {
        return this.stream !== null && this.stream.active;
    }

    getStatus() {
        return {
            active: this.isActive(),
            stream: this.stream,
            videoElement: this.videoElement
        };
    }

    handleCameraError(error) {
        let message = 'Failed to access camera';

        if (error.name === 'NotAllowedError') {
            message = 'Camera permission denied. Please allow camera access in your browser settings.';
        } else if (error.name === 'NotFoundError') {
            message = 'No camera found. Please connect a camera and try again.';
        } else if (error.name === 'NotReadableError') {
            message = 'Camera is already in use by another application.';
        } else if (error.name === 'OverconstrainedError') {
            message = 'Camera does not meet the required specifications.';
        }

        return new Error(message);
    }

    async checkPermissions() {
        try {
            const result = await navigator.permissions.query({ name: 'camera' });
            return result.state === 'granted';
        } catch (error) {
            return false;
        }
    }
}

export default new CameraService();
