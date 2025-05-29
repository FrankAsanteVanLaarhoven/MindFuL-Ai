
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const MoodAnalysis = () => {
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="max-w-4xl mx-auto space-y-8">
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
            Advanced AI-powered mood detection using text, voice, and facial recognition technology.
          </p>
        </div>

        <div ref={cardRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-indigo-800 flex items-center gap-2">
                <span className="text-2xl">💭</span>
                Express Yourself
              </CardTitle>
              <CardDescription>
                Share your thoughts or let our camera analyze your expressions
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
                onClick={analyzeMood}
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
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-indigo-800 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Analysis Results
              </CardTitle>
              <CardDescription>
                AI-powered insights into your emotional state
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResult ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">😌</div>
                    <h3 className="text-2xl font-bold text-indigo-800">{analysisResult.mood}</h3>
                    <p className="text-gray-600">Confidence: {Math.round(analysisResult.confidence * 100)}%</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Emotion Breakdown</h4>
                    {Object.entries(analysisResult.emotions).map(([emotion, value]: [string, any]) => (
                      <div key={emotion} className="flex justify-between items-center mb-2">
                        <span className="capitalize text-gray-700">{emotion}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 transition-all duration-500"
                              style={{ width: `${value * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{Math.round(value * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Suggestions</h4>
                    <ul className="space-y-2">
                      {analysisResult.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-indigo-500 mt-1">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-4xl mb-4">🤖</div>
                  <p>Submit your input to receive AI-powered mood analysis</p>
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
