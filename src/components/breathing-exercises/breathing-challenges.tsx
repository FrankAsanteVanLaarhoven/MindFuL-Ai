
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Zap, Brain, Heart } from 'lucide-react';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  goal: 'stress-relief' | 'energy-boost' | 'focus' | 'sleep';
  pattern: {
    inhale: number;
    hold1: number;
    exhale: number;
    hold2: number;
  };
  duration: number; // in minutes
  icon: React.ReactNode;
  color: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetSessions: number;
  completedSessions: number;
}

interface BreathingChallengesProps {
  onSelectChallenge: (challenge: Challenge) => void;
  selectedChallenge?: Challenge;
}

const BreathingChallenges: React.FC<BreathingChallengesProps> = ({
  onSelectChallenge,
  selectedChallenge
}) => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 'stress-buster',
      name: 'Stress Buster',
      description: 'Extended exhales to activate relaxation response',
      goal: 'stress-relief',
      pattern: { inhale: 4, hold1: 4, exhale: 8, hold2: 0 },
      duration: 5,
      icon: <Heart className="w-5 h-5" />,
      color: 'from-blue-500 to-teal-500',
      difficulty: 'beginner',
      targetSessions: 7,
      completedSessions: 0
    },
    {
      id: 'energy-ignite',
      name: 'Energy Ignite',
      description: 'Quick rhythmic breathing to boost alertness',
      goal: 'energy-boost',
      pattern: { inhale: 3, hold1: 3, exhale: 3, hold2: 0 },
      duration: 3,
      icon: <Zap className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      difficulty: 'intermediate',
      targetSessions: 5,
      completedSessions: 0
    },
    {
      id: 'focus-master',
      name: 'Focus Master',
      description: 'Balanced breathing for sustained concentration',
      goal: 'focus',
      pattern: { inhale: 6, hold1: 6, exhale: 6, hold2: 6 },
      duration: 10,
      icon: <Brain className="w-5 h-5" />,
      color: 'from-purple-500 to-indigo-500',
      difficulty: 'advanced',
      targetSessions: 14,
      completedSessions: 0
    },
    {
      id: 'sleep-prep',
      name: 'Sleep Preparation',
      description: 'Deep, slow breathing for bedtime relaxation',
      goal: 'sleep',
      pattern: { inhale: 6, hold1: 2, exhale: 10, hold2: 2 },
      duration: 7,
      icon: <Target className="w-5 h-5" />,
      color: 'from-indigo-500 to-purple-500',
      difficulty: 'beginner',
      targetSessions: 10,
      completedSessions: 0
    }
  ]);

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('breathingChallengeProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setChallenges(prev => prev.map(challenge => ({
        ...challenge,
        completedSessions: progress[challenge.id] || 0
      })));
    }
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (challenge: Challenge) => {
    return Math.min((challenge.completedSessions / challenge.targetSessions) * 100, 100);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-teal-800 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Breathing Challenges
        </CardTitle>
        <CardDescription>
          Complete structured challenges to build consistent breathing practice
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((challenge) => {
            const isSelected = selectedChallenge?.id === challenge.id;
            const isCompleted = challenge.completedSessions >= challenge.targetSessions;
            
            return (
              <div
                key={challenge.id}
                onClick={() => onSelectChallenge(challenge)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-300'
                } ${isCompleted ? 'ring-2 ring-yellow-400' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${challenge.color}`}>
                      <div className="text-white">
                        {challenge.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        {challenge.name}
                        {isCompleted && <Trophy className="w-4 h-4 text-yellow-500" />}
                      </h3>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                    <span className="text-gray-600">{challenge.duration} min</span>
                    <span className="text-gray-600">
                      {challenge.pattern.inhale}-{challenge.pattern.hold1}-{challenge.pattern.exhale}
                      {challenge.pattern.hold2 > 0 && `-${challenge.pattern.hold2}`}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{challenge.completedSessions}/{challenge.targetSessions}</span>
                    </div>
                    <Progress value={getProgressPercentage(challenge)} className="h-2" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingChallenges;
