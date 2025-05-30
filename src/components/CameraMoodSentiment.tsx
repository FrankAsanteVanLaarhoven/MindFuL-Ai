
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const verdictMap: { [key: string]: string } = {
  happy: "You look happy!",
  sad: "You seem sad.",
  angry: "You appear angry.",
  surprised: "You look surprised!",
  disgusted: "You look disgusted.",
  fearful: "You seem fearful.",
  neutral: "You look calm and neutral."
};

interface CameraMoodSentimentProps {
  userId: string;
}

export default function CameraMoodSentiment({ userId }: CameraMoodSentimentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [verdict, setVerdict] = useState("Detecting mood...");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechSentiment, setSpeechSentiment] = useState<{sentiment: string, confidence: number} | null>(null);

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
      } catch (error) {
        console.log("Models not found, using demo mode");
      }
    };
    loadModels();
  }, []);

  // Start camera
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(console.error);
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Face detection
  useEffect(() => {
    const interval = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        try {
          const detections = await faceapi
            .detectSingleFace(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceExpressions();
          if (detections && detections.expressions && canvasRef.current) {
            const sorted = Object.entries(detections.expressions).sort(
              (a, b) => b[1] - a[1]
            );
            const [expression, prob] = sorted[0];
            setVerdict(
              `${verdictMap[expression] || "Expression detected."} (${(
                prob * 100
              ).toFixed(1)}%)`
            );
            const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true);
            faceapi.draw.drawDetections(
              canvasRef.current,
              faceapi.resizeResults(detections, dims)
            );
            faceapi.draw.drawFaceExpressions(
              canvasRef.current,
              faceapi.resizeResults(detections, dims)
            );
          } else {
            setVerdict("No face detected.");
          }
        } catch (error) {
          setVerdict("Demo mode - face detection simulation");
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Speech-to-text & sentiment (Web Speech API + backend for sentiment)
  useEffect(() => {
    let recognition: any;
    if (listening && "webkitSpeechRecognition" in window) {
      recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.onresult = async (event: any) => {
        const text = event.results[event.results.length - 1][0].transcript;
        setTranscript(text);
        // Example: call backend for sentiment (fallback to demo mode)
        try {
          const res = await fetch("http://localhost:5000/api/sentiment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
          });
          const data = await res.json();
          setSpeechSentiment(data);
        } catch (error) {
          // Demo sentiment analysis
          const demoSentiment = text.toLowerCase().includes('good') || text.toLowerCase().includes('happy') ? 'positive' : 
                               text.toLowerCase().includes('bad') || text.toLowerCase().includes('sad') ? 'negative' : 'neutral';
          setSpeechSentiment({ sentiment: demoSentiment, confidence: 0.8 });
        }
      };
      recognition.start();
    }
    return () => recognition && recognition.stop();
  }, [listening]);

  return (
    <div role="region" aria-label="Camera and mic mood/sentiment detection" style={{
      border: "2px solid #e0e7ff",
      borderRadius: "8px",
      padding: "20px",
      backgroundColor: "#f8fafc"
    }}>
      <h2 style={{ color: "#1e40af", marginBottom: "15px", textAlign: "center" }}>
        🎭 Mood & Sentiment Analysis
      </h2>
      
      <div style={{ 
        position: "relative", 
        width: "320px", 
        height: "240px",
        margin: "0 auto 15px",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        overflow: "hidden"
      }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          width={320}
          height={240}
          aria-label="Live camera feed"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          style={{ position: "absolute", top: 0, left: 0 }}
          aria-hidden="true"
        />
      </div>
      
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <button
          onClick={() => setFacingMode(facingMode === "user" ? "environment" : "user")}
          aria-label="Switch camera"
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Switch Camera
        </button>
        <button
          onClick={() => setListening((l) => !l)}
          aria-pressed={listening}
          aria-label={listening ? "Stop listening" : "Start listening"}
          style={{
            padding: "8px 16px",
            backgroundColor: listening ? "#ef4444" : "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {listening ? "Stop Mic" : "Start Mic"}
        </button>
      </div>
      
      <div style={{ marginBottom: "10px" }} role="status" aria-live="polite">
        <strong>Face verdict:</strong> {verdict}
      </div>
      <div style={{ marginBottom: "10px" }} aria-live="polite">
        <strong>Speech transcript:</strong> {transcript}
      </div>
      {speechSentiment && (
        <div style={{ marginBottom: "10px" }} aria-live="polite">
          <strong>Speech sentiment:</strong> {speechSentiment.sentiment} ({Math.round(speechSentiment.confidence * 100)}%)
        </div>
      )}
    </div>
  );
}
