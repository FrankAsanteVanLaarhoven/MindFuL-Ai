
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GestureExercise {
  id: string;
  name: string;
  instruction: string;
  emoji: string;
  duration: number;
  moodTarget: string;
}

interface MoodGestureGuideProps {
  isActive: boolean;
  currentMood: string;
  onGestureComplete: (exercise: string, mood: string) => void;
}

const MoodGestureGuide: React.FC<MoodGestureGuideProps> = ({ 
  isActive, 
  currentMood, 
  onGestureComplete 
}) => {
  const [currentExercise, setCurrentExercise] = useState<GestureExercise | null>(null);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const exercises: GestureExercise[] = [
    {
      id: 'smile',
      name: 'Gentle Smile',
      instruction: 'Hold a gentle, natural smile for 10 seconds',
      emoji: '😊',
      duration: 10,
      moodTarget: 'Happy'
    },
    {
      id: 'deep-breath',
      name: 'Deep Breathing',
      instruction: 'Take slow, deep breaths - inhale through nose, exhale through mouth',
      emoji: '🧘',
      duration: 15,
      moodTarget: 'Calm'
    },
    {
      id: 'eye-relax',
      name: 'Eye Relaxation',
      instruction: 'Close your eyes gently, then open them slowly',
      emoji: '👁️',
      duration: 8,
      moodTarget: 'Relaxed'
    },
    {
      id: 'head-nod',
      name: 'Positive Nodding',
      instruction: 'Nod your head gently as if saying "yes" to positivity',
      emoji: '👍',
      duration: 10,
      moodTarget: 'Confident'
    },
    {
      id: 'jaw-release',
      name: 'Jaw Release',
      instruction: 'Gently massage your jaw muscles and let them relax',
      emoji: '😌',
      duration: 12,
      moodTarget: 'Tension Relief'
    }
  ];

  const getSuggestedExercises = (mood: string): GestureExercise[] => {
    switch (mood.toLowerCase()) {
      case 'sad':
      case 'anxious':
        return exercises.filter(ex => ['smile', 'deep-breath', 'eye-relax'].includes(ex.id));
      case 'angry':
      case 'frustrated':
        return exercises.filter(ex => ['deep-breath', 'jaw-release', 'eye-relax'].includes(ex.id));
      case 'tired':
      case 'low':
        return exercises.filter(ex => ['head-nod', 'smile', 'deep-breath'].includes(ex.id));
      default:
        return exercises.slice(0, 3);
    }
  };

  const startExercise = (exercise: GestureExercise) => {
    setCurrentExercise(exercise);
    setExerciseTimer(exercise.duration);
    setIsExerciseActive(true);
  };

  useEffect(() => {
    if (!isExerciseActive || exerciseTimer === 0) return;

    const timer = setInterval(() => {
      setExerciseTimer(prev => {
        if (prev <= 1) {
          setIsExerciseActive(false);
          if (currentExercise) {
            setCompletedExercises(prev => [...prev, currentExercise.id]);
            onGestureComplete(currentExercise.name, currentExercise.moodTarget);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExerciseActive, exerciseTimer, currentExercise, onGestureComplete]);

  if (!isActive) return null;

  const suggestedExercises = getSuggestedExercises(currentMood);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
      <CardHeader>
        <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
          <span className="text-xl">🎯</span>
          Mood Enhancement Exercises
          <Badge variant="outline" className="text-xs">
            Based on: {currentMood}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Exercise */}
        {isExerciseActive && currentExercise && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-center space-y-3">
              <div className="text-4xl">{currentExercise.emoji}</div>
              <h3 className="font-semibold text-purple-800">{currentExercise.name}</h3>
              <p className="text-sm text-gray-700">{currentExercise.instruction}</p>
              <div className="text-2xl font-bold text-purple-600">
                {exerciseTimer}s
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${((currentExercise.duration - exerciseTimer) / currentExercise.duration) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Exercise Suggestions */}
        {!isExerciseActive && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">
              Recommended for {currentMood} mood:
            </h4>
            {suggestedExercises.map((exercise) => (
              <div 
                key={exercise.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{exercise.emoji}</span>
                  <div>
                    <div className="font-medium text-gray-800">{exercise.name}</div>
                    <div className="text-xs text-gray-600">
                      {exercise.duration}s • Target: {exercise.moodTarget}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => startExercise(exercise)}
                  size="sm"
                  variant={completedExercises.includes(exercise.id) ? "secondary" : "default"}
                  className="shrink-0"
                >
                  {completedExercises.includes(exercise.id) ? '✓ Done' : 'Start'}
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Progress */}
        {completedExercises.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Exercises completed today:</span>
              <Badge variant="secondary">
                {completedExercises.length}
              </Badge>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h5 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <span className="text-blue-500">💡</span>
            Pro Tips:
          </h5>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Practice exercises regularly for better mood regulation</li>
            <li>• Focus on your breathing during each exercise</li>
            <li>• Notice how your mood changes after completing exercises</li>
            <li>• The camera tracks your expressions for better feedback</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodGestureGuide;
