"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const moodIconRef = useRef<HTMLDivElement>(null);
  const confidenceRef = useRef<HTMLDivElement>(null);
  const emotionBarsRef = useRef<HTMLDivElement[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
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

    // Request camera access
    initializeCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      setStream(mediaStream);
      setHasCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.log('Camera access denied or not available');
      setHasCamera(false);
    }
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current || !hasCamera) return null;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx?.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
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
      // Simulate AI mood analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const frameData = captureFrame();
      const mockResult = {
        mood: 'Calm',
        confidence: 0.85,
        emotions: {
          happiness: 0.7,
          sadness: 0.1,
          anxiety: 0.2,
          anger: 0.0
        },
        suggestions: [
          'Consider taking a short walk',
          'Practice deep breathing exercises',
          'Journal about your current feelings'
        ]
      };
      
      setAnalysisResult(mockResult);
      
      // Save to localStorage
      const moodEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        mood: mockResult.mood,
        confidence: mockResult.confidence,
        textInput: textInput.trim(),
        hasImage: !!frameData,
        emotions: mockResult.emotions
      };
      
      const existingMoods = JSON.parse(localStorage.getItem('moodEntries') || '[]');
      existingMoods.push(moodEntry);
      localStorage.setItem('moodEntries', JSON.stringify(existingMoods));
      
      toast({
        title: "Mood analyzed successfully!",
        description: `Your mood appears to be ${mockResult.mood} with ${Math.round(mockResult.confidence * 100)}% confidence.`
      });
      
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMoodIcon = (mood: string, confidence: number) => {
    const icons = {
      'Happy': '😊',
      'Calm': '😌',
      'Excited': '🤩',
      'Sad': '😢',
      'Anxious': '😰',
      'Angry': '😠',
      'Confused': '😕',
      'Tired': '😴',
      'Neutral': '😐'
    };
    return icons[mood as keyof typeof icons] || '😐';
  };

  const generateRealTimeMood = () => {
    // Simulate realistic mood detection with some variation
    const moods = ['Happy', 'Calm', 'Excited', 'Sad', 'Anxious', 'Neutral'];
    const baseMood = moods[Math.floor(Math.random() * moods.length)];
    
    // Generate realistic emotion values that add up logically
    const happiness = Math.random() * (baseMood === 'Happy' ? 0.8 : 0.3);
    const sadness = Math.random() * (baseMood === 'Sad' ? 0.6 : 0.2);
    const anxiety = Math.random() * (baseMood === 'Anxious' ? 0.7 : 0.3);
    const anger = Math.random() * (baseMood === 'Angry' ? 0.8 : 0.1);
    
    const confidence = 0.7 + Math.random() * 0.25; // 70-95% confidence
    
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
      
      // Animate mood icon change
      if (moodIconRef.current) {
        gsap.fromTo(moodIconRef.current,
          { scale: 0.8, rotation: -10 },
          { scale: 1.1, rotation: 5, duration: 0.4, ease: "back.out(1.7)" }
        );
      }
      
      // Animate confidence meter
      if (confidenceRef.current) {
        gsap.to(confidenceRef.current, {
          width: `${newMoodData.confidence * 100}%`,
          duration: 0.8,
          ease: "power2.out"
        });
      }
      
      // Animate emotion bars
      emotionBarsRef.current.forEach((bar, index) => {
        if (bar) {
          const emotions = Object.values(newMoodData.emotions);
          gsap.to(bar, {
            width: `${emotions[index] * 100}%`,
            duration: 0.6,
            ease: "power2.out",
            delay: index * 0.1
          });
        }
      });
      
    }, 2000); // Update every 2 seconds
  };

  const stopRealTimeAnalysis = () => {
    setIsRealTimeActive(false);
    setRealTimeMood(prev => ({ ...prev, isAnalyzing: false }));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
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
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
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
            Real-Time Mood Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced AI-powered mood detection with live emotion tracking and interactive feedback.
          </p>
        </div>

        <div ref={cardRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Real-Time Analysis Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-indigo-800 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Live Mood Detection
              </CardTitle>
              <CardDescription>
                Real-time emotion analysis with interactive visual feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Real-time controls */}
              <div className="flex justify-center">
                <Button
                  onClick={isRealTimeActive ? stopRealTimeAnalysis : startRealTimeAnalysis}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    isRealTimeActive 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  }`}
                >
                  {isRealTimeActive ? '⏸️ Stop Analysis' : '▶️ Start Live Analysis'}
                </Button>
              </div>

              {/* Live status indicator */}
              <div className="flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isRealTimeActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm text-gray-600">
                  {isRealTimeActive ? 'Analyzing in real-time...' : 'Analysis stopped'}
                </span>
              </div>

              {/* Current mood display */}
              <div className="text-center space-y-4">
                <div 
                  ref={moodIconRef}
                  className="inline-block transform-gpu"
                >
                  <div className="text-6xl mb-2">
                    {getMoodIcon(realTimeMood.mood, realTimeMood.confidence)}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-indigo-800 mb-2">
                    {realTimeMood.mood}
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Confidence Level</p>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        ref={confidenceRef}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${realTimeMood.confidence * 100}%` }}
                      />
                    </div>
                    <p className="text-lg font-semibold text-indigo-600">
                      {Math.round(realTimeMood.confidence * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Live emotion breakdown */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 text-center">Live Emotion Tracking</h4>
                {Object.entries(realTimeMood.emotions).map(([emotion, value], index) => (
                  <div key={emotion} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="capitalize text-gray-700 font-medium">{emotion}</span>
                      <span className="text-sm text-gray-600 font-semibold">{Math.round(value * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        ref={el => emotionBarsRef.current[index] = el}
                        className={`h-full transition-all duration-500 ${
                          emotion === 'happiness' ? 'bg-yellow-500' :
                          emotion === 'sadness' ? 'bg-blue-500' :
                          emotion === 'anxiety' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traditional Analysis Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-indigo-800 flex items-center gap-2">
                <span className="text-2xl">💭</span>
                Traditional Analysis
              </CardTitle>
              <CardDescription>
                Text and camera-based mood analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  How are you feeling? (Text)
                </label>
                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Describe your current mood, thoughts, or feelings..."
                  className="resize-none border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
                  rows={4}
                />
              </div>
              
              {hasCamera && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Facial Expression Analysis
                  </label>
                  <div className="relative rounded-lg overflow-hidden border border-indigo-200">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Live
                    </div>
                  </div>
                </div>
              )}
              
              <Button
                onClick={() => analyzeMood()}
                disabled={isAnalyzing}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-full transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>🔍</span>
                    Analyze Mood
                  </div>
                )}
              </Button>

              {/* Analysis Results */}
              {analysisResult && (
                <div className="mt-6 space-y-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h4 className="font-semibold text-indigo-800">Analysis Results</h4>
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {getMoodIcon(analysisResult.mood, analysisResult.confidence)}
                    </div>
                    <h3 className="text-xl font-bold text-indigo-800 mb-2">
                      {analysisResult.mood}
                    </h3>
                    <p className="text-lg text-indigo-600">
                      {Math.round(analysisResult.confidence * 100)}% confidence
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-800">Emotion Breakdown:</h5>
                    {Object.entries(analysisResult.emotions).map(([emotion, value]) => (
                      <div key={emotion} className="flex justify-between items-center">
                        <span className="capitalize text-gray-700">{emotion}</span>
                        <span className="text-indigo-600 font-medium">{Math.round(value * 100)}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-800">Suggestions:</h5>
                    {analysisResult.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-700 text-sm">
                        <span className="text-indigo-500">•</span>
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions based on current mood */}
              {isRealTimeActive && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold text-gray-800">Live Suggestions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-700 p-2 bg-blue-50 rounded">
                      <span className="text-blue-500">•</span>
                      Consider taking a short walk
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 p-2 bg-green-50 rounded">
                      <span className="text-green-500">•</span>
                      Practice deep breathing exercises
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 p-2 bg-purple-50 rounded">
                      <span className="text-purple-500">•</span>
                      Journal about your current feelings
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MoodAnalysis;
