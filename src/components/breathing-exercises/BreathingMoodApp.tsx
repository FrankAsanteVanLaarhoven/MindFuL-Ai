
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
    <div className="h-full flex flex-col space-y-3">
      {/* Compact 3D Breathing Scene */}
      <Card className="bg-white/90 backdrop-blur-sm border-blue-200 flex-shrink-0">
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
            🫁 3D Breathing Coach
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="mb-2" style={{ height: 200 }}>
            <BreathingScene phase={phase} />
          </div>
          <div className="text-center">
            <div className="text-base font-semibold text-blue-700 mb-1">
              Current Phase: <span className="capitalize">{phase}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Full Camera Screen - Main Focus */}
      <div className="flex-1 min-h-0">
        <CameraMoodSentiment userId="user123" />
      </div>
      
      {/* Compact Feature Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 flex-shrink-0">
        <CardContent className="pt-3 pb-3">
          <h4 className="font-semibold text-green-800 mb-2 text-sm">📦 Active Features:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-green-700">
            <div>• 🎯 3D Breathing Coach</div>
            <div>• 📹 Real-time Face Detection</div>
            <div>• 🎤 Speech Sentiment Analysis</div>
            <div>• 📱 Camera/Mic Controls</div>
            <div>• ♿ Full Accessibility</div>
            <div>• 🔄 Auto Phase Cycling</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
