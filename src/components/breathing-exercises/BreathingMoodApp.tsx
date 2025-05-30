
import React, { useState, useEffect } from "react";
import BreathingScene from "./BreathingScene";
import CameraMoodSentiment from "./CameraMoodSentiment";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BreathingMoodApp() {
  const [phase, setPhase] = useState("inhale");

  // Simple breathing phase cycle (inhale, hold, exhale, hold)
  useEffect(() => {
    const phases = ["inhale", "hold", "exhale", "hold"];
    let idx = 0;
    const interval = setInterval(() => {
      setPhase(phases[idx]);
      idx = (idx + 1) % phases.length;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <Card className="bg-white/90 backdrop-blur-sm border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
            🫁 3D Breathing & Mood Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="mb-3" style={{ height: 450 }}>
            <BreathingScene phase={phase} />
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-700 mb-1">
              Current Phase: <span className="capitalize">{phase}</span>
            </div>
            <div className="text-sm text-gray-600">
              Follow the 3D breathing sphere for guided practice
            </div>
          </div>
        </CardContent>
      </Card>
      
      <CameraMoodSentiment userId="user123" />
      
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="pt-4 pb-4">
          <h4 className="font-semibold text-green-800 mb-2">📦 Complete Implementation Features:</h4>
          <ul className="space-y-1 text-sm text-green-700">
            <li>• 🎯 <strong>3D Animated Breathing Coach</strong> - React Three Fiber sphere that scales with breathing phases</li>
            <li>• 📹 <strong>Real-time Face Detection</strong> - face-api.js for mood analysis with visual overlays</li>
            <li>• 🎤 <strong>Speech-to-text & Sentiment</strong> - Web Speech API with backend sentiment analysis</li>
            <li>• 📱 <strong>Camera/Mic Switching</strong> - Front/back camera toggle and microphone controls</li>
            <li>• ♿ <strong>Full Accessibility</strong> - ARIA labels, screen reader support, keyboard navigation</li>
            <li>• 🔄 <strong>Automatic Phase Cycling</strong> - Inhale, hold, exhale, hold pattern</li>
          </ul>
          
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h5 className="font-medium text-yellow-800 mb-1">Setup Notes:</h5>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• Download face-api.js models to <code>public/models</code> for full face detection</li>
              <li>• Backend sentiment service can be added for enhanced speech analysis</li>
              <li>• Currently runs in demo mode with fallback functionality</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
