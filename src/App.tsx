
import React, { useState, useEffect } from "react";
import BreathingScene from "./components/BreathingScene";
import CameraMoodSentiment from "./components/CameraMoodSentiment";

export default function App() {
  const [phase, setPhase] = useState("inhale");

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
    <div style={{ maxWidth: 600, margin: "0 auto", fontFamily: "sans-serif", padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
        3D Breathing & Mood Analysis
      </h1>
      <div style={{ marginBottom: "30px" }}>
        <BreathingScene phase={phase} />
      </div>
      <CameraMoodSentiment userId="user123" />
      
      {/* Setup Notes */}
      <div style={{ 
        marginTop: "30px", 
        padding: "20px", 
        backgroundColor: "#f0f9ff", 
        borderRadius: "8px",
        border: "1px solid #0ea5e9"
      }}>
        <h3 style={{ color: "#0c4a6e", marginBottom: "15px" }}>Setup Notes:</h3>
        <ul style={{ color: "#075985", fontSize: "14px", lineHeight: "1.6" }}>
          <li>Download face-api.js models to <code>public/models</code> for full face detection</li>
          <li>Backend sentiment service can be added for enhanced speech analysis</li>
          <li>Currently runs in demo mode with fallback functionality</li>
        </ul>
      </div>
    </div>
  );
}
