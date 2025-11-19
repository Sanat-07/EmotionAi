# 🧠 Emotion Detection AI Assistant

A modern web application that uses AI-powered facial recognition to detect emotions in real-time, track mood patterns, and provide personalized psychological support.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎭 Real-Time Emotion Detection
- Detects 7 emotions: Happy, Sad, Angry, Neutral, Surprised, Fearful, Disgusted
- 25-30 FPS performance using TensorFlow.js
- Live face tracking with bounding boxes and landmarks
- Confidence scores for each detection

### 📊 Mood Tracker Dashboard
- Beautiful pie charts showing emotion distribution
- Timeline graphs with day/week/month views
- Daily and weekly mood statistics
- Mood score calculation (0-100)
- Emotion history table with edit/delete functionality

### 🤖 AI Psychology Assistant
- Three AI modes:
  - **Supportive Friend**: Warm and empathetic
  - **CBT Helper**: Cognitive behavioral therapy approach
  - **Motivational Coach**: Action-oriented and inspiring
- Emotion-aware responses
- Pattern analysis from emotion history
- Quick action buttons for common queries

### ⚙️ Settings & Privacy
- Camera permission management
- Emotion sensitivity adjustment
- Data export/import (JSON)
- Multi-language support (EN/KZ/RU)
- **100% local storage** - no data sent to servers

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Webcam
- Local web server (for development)

### Installation

1. **Clone or download this repository**
   ```bash
   cd /Users/admin/Web-Mood
   ```

2. **Start a local web server**

   **Option A: Python**
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   **Option B: Node.js (if installed)**
   ```bash
   npx serve
   ```

   **Option C: PHP**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

4. **Grant camera permissions** when prompted

## 📁 Project Structure

```
Web-Mood/
├── index.html              # Main HTML file
├── styles/
│   └── globals.css         # Global styles and glassmorphism
├── js/
│   ├── main.js            # Application router and initialization
│   ├── utils/
│   │   └── constants.js   # Emotion configs and constants
│   ├── services/
│   │   ├── cameraService.js      # Webcam management
│   │   ├── emotionDetector.js    # TensorFlow.js integration
│   │   ├── moodStorage.js        # localStorage CRUD
│   │   └── aiService.js          # AI response generation
│   └── pages/
│       ├── HomePage.js           # Landing page
│       ├── DetectionPage.js      # Emotion detection
│       ├── DashboardPage.js      # Mood tracking
│       ├── ChatPage.js           # AI assistant
│       └── SettingsPage.js       # App settings
└── README.md
```

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Styling**: Tailwind CSS (CDN)
- **ML Framework**: TensorFlow.js + face-api.js
- **Charts**: Chart.js
- **Storage**: localStorage
- **Fonts**: Google Fonts (Inter)

## 📖 Usage Guide

### 1. Home Page
- Welcome screen with feature overview
- Click "Start Emotion Scan" to begin

### 2. Emotion Detection
- Grant camera permissions
- Click "Start Detection"
- Your emotion will be detected in real-time
- Emotions are auto-saved every 10 seconds

### 3. Dashboard
- View emotion distribution pie chart
- Analyze emotion timeline
- See daily/weekly statistics
- Manage emotion history

### 4. AI Assistant
- Chat with AI psychology assistant
- Switch between 3 AI modes
- Get emotion-aware responses
- Use quick action buttons

### 5. Settings
- Adjust emotion sensitivity
- Toggle auto-save
- Change language
- Export/import data
- Clear all data

## 🔒 Privacy & Security

- **All processing happens locally** in your browser
- **No data is sent to external servers**
- **No account required**
- **No tracking or analytics**
- Data stored in browser's localStorage
- You can export and delete your data anytime

## 🎨 Design Features

- **Dark theme** with gradient backgrounds
- **Glassmorphism** UI elements
- **Smooth animations** and transitions
- **Responsive design** (mobile, tablet, desktop)
- **Neon accent colors** for emotions
- **Modern typography** (Inter font)

## 🧪 Browser Compatibility

| Browser | Supported | Notes |
|---------|-----------|-------|
| Chrome  | ✅ Yes    | Recommended |
| Firefox | ✅ Yes    | Full support |
| Safari  | ✅ Yes    | macOS/iOS |
| Edge    | ✅ Yes    | Chromium-based |

**Minimum versions:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📊 Performance

- **FPS**: 25-30 frames per second
- **Detection latency**: <50ms
- **Model load time**: 2-3 seconds (first time)
- **Memory usage**: ~200-300MB

## 🐛 Troubleshooting

### Camera not working
1. Check browser permissions
2. Ensure no other app is using the camera
3. Try refreshing the page
4. Use Settings → Reset Camera Permissions

### Low FPS
1. Close other browser tabs
2. Ensure good lighting
3. Try a different browser
4. Check system resources

### Models not loading
1. Check internet connection (models load from CDN)
2. Clear browser cache
3. Try a different browser

## 🚀 Deployment

### Deploy to Netlify

1. Create a `netlify.toml` file:
   ```toml
   [build]
     publish = "."
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. Deploy:
   ```bash
   netlify deploy --prod --dir=.
   ```

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

### Deploy to GitHub Pages

1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch and root folder
4. Save and wait for deployment

## 📝 Future Enhancements

- [ ] OpenAI API integration for advanced AI responses
- [ ] Firebase backend for cloud sync
- [ ] Export mood reports as PDF
- [ ] Emotion detection from uploaded photos
- [ ] Voice-based emotion detection
- [ ] Meditation and breathing exercises
- [ ] Social sharing features
- [ ] Progressive Web App (PWA) support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [TensorFlow.js](https://www.tensorflow.org/js) - Machine learning framework
- [face-api.js](https://github.com/justadudewhohacks/face-api.js) - Face detection models
- [Chart.js](https://www.chartjs.org/) - Beautiful charts
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

## 👨‍💻 Creator

**Sanat Bogenbaev**

- 📷 Instagram: [@bogenbaevjr](https://instagram.com/bogenbaevjr)
- ✈️ Telegram: [@jrdsta](https://t.me/jrdsta)
- 📞 Phone: +7 776 270 0967

## 📧 Support

For issues or questions, please contact the creator via the links above.

---

**Made with ❤️ and AI**
