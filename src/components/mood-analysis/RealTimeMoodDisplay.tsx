
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';

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

interface RealTimeMoodDisplayProps {
  realTimeMood: RealTimeMoodData;
  isRealTimeActive: boolean;
  onStartAnalysis: () => void;
  onStopAnalysis: () => void;
  hasCamera: boolean;
  showFaceGuide: boolean;
  showGestureGuide: boolean;
  onToggleFaceGuide: () => void;
  onToggleGestureGuide: () => void;
  faceDetectedMood?: string;
}

const RealTimeMoodDisplay: React.FC<RealTimeMoodDisplayProps> = ({
  realTimeMood,
  isRealTimeActive,
  onStartAnalysis,
  onStopAnalysis,
  hasCamera,
  showFaceGuide,
  showGestureGuide,
  onToggleFaceGuide,
  onToggleGestureGuide,
  faceDetectedMood
}) => {
  const moodIconRef = useRef<HTMLDivElement>(null);
  const confidenceRef = useRef<HTMLDivElement>(null);
  const emotionBarsRef = useRef<HTMLDivElement[]>([]);

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

  useEffect(() => {
    if (moodIconRef.current && isRealTimeActive) {
      gsap.fromTo(moodIconRef.current,
        { scale: 0.8, rotation: -10 },
        { scale: 1.1, rotation: 5, duration: 0.4, ease: "back.out(1.7)" }
      );
    }

    if (confidenceRef.current) {
      gsap.to(confidenceRef.current, {
        width: `${realTimeMood.confidence * 100}%`,
        duration: 0.8,
        ease: "power2.out"
      });
    }

    emotionBarsRef.current.forEach((bar, index) => {
      if (bar) {
        const emotions = Object.values(realTimeMood.emotions);
        gsap.to(bar, {
          width: `${emotions[index] * 100}%`,
          duration: 0.6,
          ease: "power2.out",
          delay: index * 0.1
        });
      }
    });
  }, [realTimeMood, isRealTimeActive]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-indigo-800 flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Live Mood Detection
          {hasCamera && (
            <div className="flex gap-2 ml-auto">
              <Button
                onClick={onToggleFaceGuide}
                size="sm"
                variant={showFaceGuide ? "secondary" : "outline"}
                className="text-xs"
              >
                👁️ Face Guide
              </Button>
              <Button
                onClick={onToggleGestureGuide}
                size="sm"
                variant={showGestureGuide ? "secondary" : "outline"}
                className="text-xs"
              >
                🎯 Exercises
              </Button>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          Real-time emotion analysis with interactive visual feedback and face detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Real-time controls */}
        <div className="flex justify-center">
          <Button
            onClick={isRealTimeActive ? onStopAnalysis : onStartAnalysis}
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
            {showFaceGuide && hasCamera && (
              <span className="ml-2 text-blue-600 font-medium">+ Face Detection Active</span>
            )}
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
            {showFaceGuide && faceDetectedMood && (
              <p className="text-sm text-blue-600 mb-2">
                Face Detection: {faceDetectedMood}
              </p>
            )}
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

        {/* Live Suggestions */}
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
  );
};

export default RealTimeMoodDisplay;
