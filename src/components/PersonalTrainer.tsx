
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Timer, Target } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  duration: number;
  description: string;
  category: 'cardio' | 'strength' | 'yoga' | 'stretching' | 'breathing';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const exercises: Exercise[] = [
  { id: '1', name: 'Deep Breathing', duration: 300, description: 'Focus on slow, deep breaths', category: 'breathing', difficulty: 'beginner' },
  { id: '2', name: 'Mountain Pose', duration: 180, description: 'Stand tall with feet together', category: 'yoga', difficulty: 'beginner' },
  { id: '3', name: 'Cat-Cow Stretch', duration: 240, description: 'Gentle spine mobility', category: 'yoga', difficulty: 'beginner' },
  { id: '4', name: 'Child\'s Pose', duration: 300, description: 'Restorative resting position', category: 'yoga', difficulty: 'beginner' },
  { id: '5', name: 'Wall Push-ups', duration: 180, description: 'Gentle upper body strength', category: 'strength', difficulty: 'beginner' },
  { id: '6', name: 'Neck Rolls', duration: 120, description: 'Release tension in neck and shoulders', category: 'stretching', difficulty: 'beginner' },
];

interface PersonalTrainerProps {
  userProfile?: any;
}

const PersonalTrainer: React.FC<PersonalTrainerProps> = ({ userProfile }) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            if (selectedExercise && !completedExercises.includes(selectedExercise.id)) {
              setCompletedExercises(prev => [...prev, selectedExercise.id]);
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isActive) {
      if (interval) clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, selectedExercise, completedExercises]);

  const startExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setTimeLeft(exercise.duration);
    setIsActive(true);
  };

  const pauseResume = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedExercise?.duration || 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPersonalizedExercises = () => {
    if (!userProfile) return exercises;
    
    let filtered = exercises;
    
    // Filter by preferred exercise type
    if (userProfile.preferredExerciseType) {
      const type = userProfile.preferredExerciseType;
      if (type === 'yoga') {
        filtered = exercises.filter(ex => ex.category === 'yoga' || ex.category === 'breathing');
      } else if (type === 'cardio') {
        filtered = exercises.filter(ex => ex.category === 'cardio' || ex.category === 'strength');
      }
    }
    
    // Adjust difficulty based on exercise frequency
    if (userProfile.exerciseFrequency === 'never' || userProfile.exerciseFrequency === 'rarely') {
      filtered = filtered.filter(ex => ex.difficulty === 'beginner');
    }
    
    return filtered;
  };

  const personalizedExercises = getPersonalizedExercises();

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-green-800 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Personal Trainer
            {userProfile?.name && (
              <span className="text-sm text-green-600">for {userProfile.name}</span>
            )}
          </CardTitle>
          <CardDescription>
            Personalized exercises for your wellness journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedExercise ? (
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-green-800">{selectedExercise.name}</h3>
              <p className="text-gray-600">{selectedExercise.description}</p>
              
              <div className="text-4xl font-mono text-green-600">
                {formatTime(timeLeft)}
              </div>
              
              <div className="flex justify-center gap-3">
                <Button 
                  onClick={pauseResume}
                  variant={isActive ? "destructive" : "default"}
                  className="flex items-center gap-2"
                >
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isActive ? 'Pause' : 'Resume'}
                </Button>
                <Button onClick={resetTimer} variant="outline" className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
              
              <Button 
                onClick={() => setSelectedExercise(null)}
                variant="outline"
                className="mt-4"
              >
                Choose Different Exercise
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalizedExercises.map((exercise) => (
                <Card key={exercise.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{exercise.name}</CardTitle>
                      {completedExercises.includes(exercise.id) && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{exercise.category}</Badge>
                      <Badge variant="outline">{exercise.difficulty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        {formatTime(exercise.duration)}
                      </span>
                      <Button 
                        onClick={() => startExercise(exercise)}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalTrainer;
