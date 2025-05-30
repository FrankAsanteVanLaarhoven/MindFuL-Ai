
# Breathing & Mood Analysis App

A world-class 3D breathing and mood/sentiment analysis application with real-time face detection and speech analysis.

## Features

- **3D Animated Breathing Coach** - React Three Fiber sphere that scales with breathing phases
- **Real-time Face Detection** - face-api.js for mood analysis with visual overlays
- **Speech-to-text & Sentiment** - Web Speech API with backend sentiment analysis
- **Camera/Mic Switching** - Front/back camera toggle and microphone controls
- **Full Accessibility** - ARIA labels, screen reader support, keyboard navigation
- **Automatic Phase Cycling** - Inhale, hold, exhale, hold pattern

## Technology Stack

- **Frontend**: React 18 + TypeScript + React Three Fiber
- **3D Graphics**: Three.js for 3D breathing visualization
- **Face Detection**: face-api.js for real-time emotion analysis
- **Speech**: Web Speech API for voice-to-text conversion
- **Backend**: Node.js + Express + Sentiment analysis (optional)

## How to Run

### Frontend Only (Demo Mode)
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173) in your browser

### With Full Backend (Enhanced Features)
1. Download face-api.js models to `public/models` folder from [face-api.js weights](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
2. Set up the backend (see Backend Setup section)
3. Start the frontend as above

## Backend Setup (Optional)

For enhanced sentiment analysis, you can set up the Node.js backend:

1. Create a new directory: `mkdir backend && cd backend`
2. Initialize npm: `npm init -y`
3. Install dependencies: `npm install express sentiment cors`
4. Create server.js (see src/services/backend.md for code)
5. Start backend: `npm start`

The frontend will automatically use the backend if available, or fall back to demo mode.

## Setup Notes

- **Demo Mode**: Works out of the box with simulated face detection and basic sentiment analysis
- **Full Mode**: Requires face-api.js models and optional backend for enhanced features
- **Camera Permissions**: Browser will request camera and microphone access
- **Accessibility**: Full ARIA support and keyboard navigation included

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Partial support (speech recognition may be limited)

## Contributing

This is a complete, production-ready implementation that can be extended with:
- User authentication and progress tracking
- Advanced AI models for emotion recognition
- VR/AR breathing experiences
- Multi-language support
- Cloud-based analytics

## License

MIT License - feel free to use and modify for your projects.
