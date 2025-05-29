
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Trophy, Target, Flame, CheckCircle } from 'lucide-react';
import { getBreathingStats, addBreathingSession } from '@/lib/breathing-storage';
import { toast } from '@/hooks/use-toast';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  pattern: {
    inhale: number;
    hold1: number;
    exhale: number;
    hold2: number;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  icon: string;
  color: string;
  requiredSessions?: number;
  unlocked?: boolean;
}

interface BreathingChallengesProps {
  onSelectChallenge: (challenge: Challenge) => void;
  selectedChallenge: Challenge | null;
}

const BreathingChallenges: React.FC<BreathingChallengesProps> = ({
  onSelectChallenge,
  selectedChallenge
}) => {
  const [stats, setStats] = useState(getBreathingStats());
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const challenges: Challenge[] = [
    {
      id: 'beginner-calm',
      name: 'Calm Beginner',
      description: 'Perfect for starting your breathing journey',
      duration: 5,
      pattern: { inhale: 4, hold1: 2, exhale: 4, hold2: 2 },
      difficulty: 'beginner',
      benefits: ['Reduces stress', 'Easy to follow'],
      icon: '🌱',
      color: 'from-green-400 to-green-600',
      unlocked: true
    },
    {
      id: 'focus-builder',
      name: 'Focus Builder',
      description: 'Build concentration with structured breathing',
      duration: 7,
      pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
      difficulty: 'beginner',
      benefits: ['Improves focus', 'Calms mind'],
      icon: '🎯',
      color: 'from-blue-400 to-blue-600',
      requiredSessions: 3,
      unlocked: stats.totalSessions >= 3
    },
    {
      id: 'sleep-helper',
      name: 'Sleep Helper',
      description: 'Prepare your body for restful sleep',
      duration: 10,
      pattern: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
      difficulty: 'intermediate',
      benefits: ['Promotes sleep', 'Reduces anxiety'],
      icon: '😴',
      color: 'from-purple-400 to-purple-600',
      requiredSessions: 5,
      unlocked: stats.totalSessions >= 5
    },
    {
      id: 'energy-boost',
      name: 'Energy Boost',
      description: 'Energize your body and mind',
      duration: 8,
      pattern: { inhale: 3, hold1: 1, exhale: 3, hold2: 1 },
      difficulty: 'intermediate',
      benefits: ['Increases energy', 'Improves alertness'],
      icon: '⚡',
      color: 'from-orange-400 to-orange-600',
      requiredSessions: 7,
      unlocked: stats.totalSessions >= 7
    },
    {
      id: 'stress-warrior',
      name: 'Stress Warrior',
      description: 'Advanced technique for deep stress relief',
      duration: 15,
      pattern: { inhale: 6, hold1: 6, exhale: 6, hold2: 6 },
      difficulty: 'advanced',
      benefits: ['Deep relaxation', 'Stress mastery'],
      icon: '🧘‍♂️',
      color: 'from-indigo-400 to-indigo-600',
      requiredSessions: 15,
      unlocked: stats.totalSessions >= 15
    },
    {
      id: 'master-breath',
      name: 'Master Breath',
      description: 'Ultimate breathing challenge for experts',
      duration: 20,
      pattern: { inhale: 8, hold1: 8, exhale: 8, hold2: 8 },
      difficulty: 'advanced',
      benefits: ['Complete mastery', 'Peak performance'],
      icon: '👑',
      color: 'from-yellow-400 to-yellow-600',
      requiredSessions: 25,
      unlocked: stats.totalSessions >= 25
    }
  ];

  useEffect(() => {
    const updateStats = () => {
      const currentStats = getBreathingStats();
      setStats(currentStats);
    };

    updateStats();
    
    // Listen for stats updates
    const handleStatsUpdate = () => {
      updateStats();
    };

    window.addEventListener('breathingStatsUpdated', handleStatsUpdate);
    window.addEventListener('storage', handleStatsUpdate);

    // Load completed challenges from localStorage
    const completed = localStorage.getItem('completedChallenges');
    if (completed) {
      setCompletedChallenges(JSON.parse(completed));
    }

    return () => {
      window.removeEventListener('breathingStatsUpdated', handleStatsUpdate);
      window.removeEventListener('storage', handleStatsUpdate);
    };
  }, []);

  const handleChallengeSelect = (challenge: Challenge) => {
    if (!challenge.unlocked) {
      toast({
        title: "Challenge Locked 🔒",
        description: `Complete ${challenge.requiredSessions} total sessions to unlock this challenge.`,
        variant: "destructive"
      });
      return;
    }

    onSelectChallenge(challenge);
    toast({
      title: "Challenge Selected! 🎯",
      description: `Starting ${challenge.name} - ${challenge.duration} minute challenge.`,
    });
  };

  const markChallengeComplete = (challengeId: string) => {
    const newCompleted = [...completedChallenges, challengeId];
    setCompletedChallenges(newCompleted);
    localStorage.setItem('completedChallenges', JSON.stringify(newCompleted));
    
    window.dispatchEvent(new CustomEvent('breathingStatsUpdated'));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const unlockedChallenges = challenges.filter(c => c.unlocked).length;
  const completedCount = completedChallenges.length;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-teal-800 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Breathing Challenges
        </CardTitle>
        <CardDescription>
          Complete structured breathing challenges to improve your practice
        </CardDescription>
        
        {/* Progress overview */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium">{unlockedChallenges}/{challenges.length} Unlocked</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">{completedCount} Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium">Streak: {stats.currentStreak}</span>
          </div>
        </div>
        
        <Progress value={(completedCount / challenges.length) * 100} className="h-2" />
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge) => {
            const isCompleted = completedChallenges.includes(challenge.id);
            const isSelected = selectedChallenge?.id === challenge.id;
            
            return (
              <div
                key={challenge.id}
                onClick={() => handleChallengeSelect(challenge)}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50 scale-105'
                    : challenge.unlocked
                    ? 'border-gray-200 hover:border-teal-300 hover:scale-102'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                } ${isCompleted ? 'ring-2 ring-green-400' : ''}`}
              >
                {/* Challenge completion indicator */}
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
                
                {/* Lock indicator */}
                {!challenge.unlocked && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🔒</span>
                  </div>
                )}
                
                <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${challenge.color} flex items-center justify-center mb-3`}>
                  <span className="text-4xl">{challenge.icon}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">{challenge.name}</h3>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {challenge.duration}m
                    </div>
                    <div>
                      {challenge.pattern.inhale}-{challenge.pattern.hold1}-{challenge.pattern.exhale}
                      {challenge.pattern.hold2 > 0 && `-${challenge.pattern.hold2}`}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {challenge.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                  
                  {!challenge.unlocked && (
                    <p className="text-xs text-gray-500 mt-2">
                      Complete {challenge.requiredSessions} sessions to unlock
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedChallenge && (
          <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
            <h4 className="font-semibold text-teal-800 mb-2">Selected Challenge</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span> {selectedChallenge.name}
              </div>
              <div>
                <span className="font-medium">Duration:</span> {selectedChallenge.duration} minutes
              </div>
              <div>
                <span className="font-medium">Pattern:</span> {selectedChallenge.pattern.inhale}-{selectedChallenge.pattern.hold1}-{selectedChallenge.pattern.exhale}
                {selectedChallenge.pattern.hold2 > 0 && `-${selectedChallenge.pattern.hold2}`}
              </div>
              <div>
                <span className="font-medium">Difficulty:</span> {selectedChallenge.difficulty}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BreathingChallenges;
