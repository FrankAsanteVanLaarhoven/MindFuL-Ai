
import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    <Card className="bg-white/90 backdrop-blur-sm border-purple-200 h-full flex flex-col">
      <CardHeader className="pb-2 pt-3 flex-shrink-0">
        <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
          🎭 Mood & Sentiment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-3 pb-3">
        <div role="region" aria-label="Camera and mic mood/sentiment detection" className="flex-1 flex flex-col">
          {/* Full Camera Screen */}
          <div className="relative flex-1 min-h-0 bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              aria-label="Live camera feed"
              className="rounded-lg"
            />
            <canvas
              ref={canvasRef}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
              aria-hidden="true"
              className="rounded-lg"
            />
          </div>
          
          {/* Compact Controls */}
          <div className="flex gap-2 justify-center mt-3 flex-shrink-0">
            <Button
              onClick={() => setFacingMode(facingMode === "user" ? "environment" : "user")}
              aria-label="Switch camera"
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1 h-8"
            >
              📷 Switch Camera
            </Button>
            <Button
              onClick={() => setListening((l) => !l)}
              aria-pressed={listening}
              aria-label={listening ? "Stop listening" : "Start listening"}
              variant={listening ? "destructive" : "default"}
              size="sm"
              className="text-xs px-3 py-1 h-8"
            >
              {listening ? "🎤 Stop Mic" : "🎤 Start Mic"}
            </Button>
          </div>
          
          {/* Compact Status Display */}
          <div className="space-y-2 text-sm flex-shrink-0">
            <div role="status" aria-live="polite" className="p-2 bg-gray-50 rounded text-xs">
              <strong>Face:</strong> {verdict}
            </div>
            {transcript && (
              <div aria-live="polite" className="p-2 bg-gray-50 rounded text-xs">
                <strong>Speech:</strong> {transcript}
              </div>
            )}
            {speechSentiment && (
              <div aria-live="polite" className="p-2 bg-gray-50 rounded text-xs">
                <strong>Sentiment:</strong> {speechSentiment.sentiment} ({Math.round(speechSentiment.confidence * 100)}%)
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
