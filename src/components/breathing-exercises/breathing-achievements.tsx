
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Calendar, Target, Star, Award } from 'lucide-react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  progress: number;
  target: number;
  category: 'streak' | 'sessions' | 'time' | 'challenges';
}

interface BreathingAchievementsProps {
  className?: string;
}

const BreathingAchievements: React.FC<BreathingAchievementsProps> = ({ className }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-breath',
      name: 'First Breath',
      description: 'Complete your first breathing session',
      icon: <Star className="w-5 h-5" />,
      color: 'from-blue-500 to-teal-500',
      unlocked: false,
      progress: 0,
      target: 1,
      category: 'sessions'
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Practice breathing for 7 consecutive days',
      icon: <Flame className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      unlocked: false,
      progress: 0,
      target: 7,
      category: 'streak'
    },
    {
      id: 'session-master',
      name: 'Session Master',
      description: 'Complete 25 breathing sessions',
      icon: <Target className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      unlocked: false,
      progress: 0,
      target: 25,
      category: 'sessions'
    },
    {
      id: 'time-keeper',
      name: 'Time Keeper',
      description: 'Practice for 60 minutes total',
      icon: <Calendar className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      unlocked: false,
      progress: 0,
      target: 60,
      category: 'time'
    },
    {
      id: 'challenger',
      name: 'Challenge Champion',
      description: 'Complete all breathing challenges',
      icon: <Award className="w-5 h-5" />,
      color: 'from-yellow-500 to-orange-500',
      unlocked: false,
      progress: 0,
      target: 4,
      category: 'challenges'
    },
    {
      id: 'month-master',
      name: 'Month Master',
      description: 'Practice for 30 consecutive days',
      icon: <Trophy className="w-5 h-5" />,
      color: 'from-indigo-500 to-purple-500',
      unlocked: false,
      progress: 0,
      target: 30,
      category: 'streak'
    }
  ]);

  useEffect(() => {
    // Load achievements from localStorage
    const savedAchievements = localStorage.getItem('breathingAchievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'streak': return <Flame className="w-4 h-4" />;
      case 'sessions': return <Target className="w-4 h-4" />;
      case 'time': return <Calendar className="w-4 h-4" />;
      case 'challenges': return <Award className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Card className={`bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl text-teal-800 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Achievements
          <Badge variant="secondary" className="ml-auto">
            {unlockedCount}/{achievements.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Unlock rewards for consistent breathing practice
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                achievement.unlocked
                  ? 'border-yellow-400 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${achievement.color} ${
                  achievement.unlocked ? 'opacity-100' : 'opacity-50'
                }`}>
                  <div className="text-white">
                    {achievement.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${
                      achievement.unlocked ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {achievement.name}
                    </h3>
                    {achievement.unlocked && (
                      <Trophy className="w-4 h-4 text-yellow-500" />
                    )}
                    <div className="ml-auto flex items-center gap-1 text-gray-400">
                      {getCategoryIcon(achievement.category)}
                    </div>
                  </div>
                  <p className={`text-sm ${
                    achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                  {!achievement.unlocked && (
                    <div className="mt-1 text-xs text-gray-500">
                      {achievement.progress}/{achievement.target}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingAchievements;
