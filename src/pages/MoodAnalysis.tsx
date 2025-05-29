
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { aiService } from '@/services/aiService';
import AIKeyManager from '@/components/AIKeyManager';
import FaceDetectionGuide from '@/components/FaceDetectionGuide';
import MoodGestureGuide from '@/components/MoodGestureGuide';
import RealTimeMoodDisplay from '@/components/mood-analysis/RealTimeMoodDisplay';
import AnalysisForm from '@/components/mood-analysis/AnalysisForm';
import AnalysisResults from '@/components/mood-analysis/AnalysisResults';

interface RealTimeMoodData {
  mood: string;
  confidence: number;
  emotions: {
    happiness: number;
    sadness: number;
    anxiety: number;
    anger: number;
  };
  isAnalyzing: boolean;
}

interface AnalysisResult {
  mood: string;
  confidence: number;
  emotions: {
    happiness: number;
    sadness: number;
    anxiety: number;
    anger: number;
  };
  suggestions: string[];
}

const MoodAnalysis = () => {
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [realTimeMood, setRealTimeMood] = useState<RealTimeMoodData>({
    mood: 'Neutral',
    confidence: 0,
    emotions: { happiness: 0, sadness: 0, anxiety: 0, anger: 0 },
    isAnalyzing: false
  });
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showFaceGuide, setShowFaceGuide] = useState(false);
  const [showGestureGuide, setShowGestureGuide] = useState(false);
  const [faceDetectedMood, setFaceDetectedMood] = useState('Neutral');
  
  const cardRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const captureFrameRef = useRef<() => string | null>(() => null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Animate page entrance
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
      );
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCameraChange = (cameraActive: boolean, mediaStream: MediaStream | null) => {
    setHasCamera(cameraActive);
    setStream(mediaStream);
  };

  const captureFrame = () => {
    return captureFrameRef.current();
  };

  const analyzeMood = async () => {
    if (!textInput.trim() && !hasCamera) {
      toast({
        title: "Please provide input",
        description: "Enter some text or enable camera for mood analysis",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const frameData = hasCamera ? captureFrame() : undefined;
      
      const result = await aiService.analyzeMood(textInput, frameData);
      
      setAnalysisResult(result.analysis);
      
      // Save to localStorage
      const moodEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        mood: result.analysis.mood,
        confidence: result.analysis.confidence,
        textInput: textInput.trim(),
        hasImage: !!frameData,
        emotions: result.analysis.emotions
      };
      
      const existingMoods = JSON.parse(localStorage.getItem('moodEntries') || '[]');
      existingMoods.push(moodEntry);
      localStorage.setItem('moodEntries', JSON.stringify(existingMoods));
      
      toast({
        title: "Mood analyzed successfully!",
        description: `Your mood appears to be ${result.analysis.mood} with ${Math.round(result.analysis.confidence * 100)}% confidence.`
      });
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateRealTimeMood = () => {
    const moods = ['Happy', 'Calm', 'Excited', 'Sad', 'Anxious', 'Neutral'];
    const baseMood = moods[Math.floor(Math.random() * moods.length)];
    
    const happiness = Math.random() * (baseMood === 'Happy' ? 0.8 : 0.3);
    const sadness = Math.random() * (baseMood === 'Sad' ? 0.6 : 0.2);
    const anxiety = Math.random() * (baseMood === 'Anxious' ? 0.7 : 0.3);
    const anger = Math.random() * (baseMood === 'Angry' ? 0.8 : 0.1);
    
    const confidence = 0.7 + Math.random() * 0.25;
    
    return {
      mood: baseMood,
      confidence,
      emotions: { happiness, sadness, anxiety, anger },
      isAnalyzing: true
    };
  };

  const startRealTimeAnalysis = () => {
    setIsRealTimeActive(true);
    setRealTimeMood(prev => ({ ...prev, isAnalyzing: true }));
    
    intervalRef.current = setInterval(() => {
      const newMoodData = generateRealTimeMood();
      setRealTimeMood(newMoodData);
    }, 2000);
  };

  const stopRealTimeAnalysis = () => {
    setIsRealTimeActive(false);
    setRealTimeMood(prev => ({ ...prev, isAnalyzing: false }));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleFaceMoodChange = (mood: string, confidence: number) => {
    setFaceDetectedMood(mood);
    setRealTimeMood(prev => ({
      ...prev,
      mood,
      confidence,
      emotions: {
        happiness: mood === 'Happy' ? confidence : prev.emotions.happiness * 0.9,
        sadness: mood === 'Sad' ? confidence : prev.emotions.sadness * 0.9,
        anxiety: mood === 'Anxious' ? confidence : prev.emotions.anxiety * 0.9,
        anger: mood === 'Angry' ? confidence : prev.emotions.anger * 0.9
      }
    }));
  };

  const handleGestureComplete = (exercise: string, targetMood: string) => {
    toast({
      title: "Exercise completed! 🎉",
      description: `${exercise} finished. Targeting ${targetMood} mood.`
    });
    
    setTimeout(() => {
      setRealTimeMood(prev => ({
        ...prev,
        mood: targetMood,
        confidence: Math.min(prev.confidence + 0.1, 1.0)
      }));
    }, 1000);
  };

  const toggleFaceGuide = () => {
    if (!hasCamera) {
      toast({
        title: "Camera required",
        description: "Please enable camera first to use face detection",
        variant: "destructive"
      });
      return;
    }
    setShowFaceGuide(!showFaceGuide);
  };

  const toggleGestureGuide = () => {
    setShowGestureGuide(!showGestureGuide);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-indigo-800 mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl">🧠</span>
            AI-Powered Mood Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced AI-powered mood detection with live emotion tracking, face detection, and interactive feedback.
          </p>
        </div>

        {/* AI Key Manager */}
        <AIKeyManager onApiKeyChange={setApiKey} />

        <div ref={cardRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Real-Time Analysis Section */}
          <RealTimeMoodDisplay
            realTimeMood={realTimeMood}
            isRealTimeActive={isRealTimeActive}
            onStartAnalysis={startRealTimeAnalysis}
            onStopAnalysis={stopRealTimeAnalysis}
            hasCamera={hasCamera}
            showFaceGuide={showFaceGuide}
            showGestureGuide={showGestureGuide}
            onToggleFaceGuide={toggleFaceGuide}
            onToggleGestureGuide={toggleGestureGuide}
            faceDetectedMood={faceDetectedMood}
          />

          {/* Traditional Analysis Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
            <AnalysisForm
              textInput={textInput}
              setTextInput={setTextInput}
              isAnalyzing={isAnalyzing}
              onAnalyze={analyzeMood}
              apiKey={apiKey}
              onCameraChange={handleCameraChange}
              onFrameCapture={(captureFunc) => {
                captureFrameRef.current = captureFunc;
                return null;
              }}
            />
            <CardContent>
              <AnalysisResults analysisResult={analysisResult} />
            </CardContent>
          </Card>
        </div>

        {/* Face Detection Guide */}
        {showFaceGuide && (
          <FaceDetectionGuide
            videoRef={null}
            isActive={showFaceGuide && hasCamera}
            onMoodChange={handleFaceMoodChange}
          />
        )}

        {/* Mood Gesture Guide */}
        {showGestureGuide && (
          <MoodGestureGuide
            isActive={showGestureGuide}
            currentMood={faceDetectedMood || realTimeMood.mood}
            onGestureComplete={handleGestureComplete}
          />
        )}
      </div>
    </div>
  );
};

export default MoodAnalysis;
