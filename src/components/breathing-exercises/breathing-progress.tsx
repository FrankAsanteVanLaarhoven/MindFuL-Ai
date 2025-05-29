
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Target, TrendingUp } from 'lucide-react';
import { getBreathingStats, resetDailyStats } from '@/lib/breathing-storage';

interface BreathingStats {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalMinutes: number;
  dailyGoal: number;
  todaySessions: number;
  thisWeekSessions: number;
}

interface BreathingProgressProps {
  className?: string;
}

const BreathingProgress: React.FC<BreathingProgressProps> = ({ className }) => {
  const [stats, setStats] = useState<BreathingStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalSessions: 0,
    totalMinutes: 0,
    dailyGoal: 3,
    todaySessions: 0,
    thisWeekSessions: 0
  });

  const loadStats = () => {
    resetDailyStats();
    const currentStats = getBreathingStats();
    setStats(currentStats);
  };

  useEffect(() => {
    loadStats();
    
    // Listen for breathing session updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'breathingStats' || e.key === 'breathingSessions') {
        loadStats();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from the same tab
    const handleCustomUpdate = () => {
      loadStats();
    };
    
    window.addEventListener('breathingStatsUpdated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('breathingStatsUpdated', handleCustomUpdate);
    };
  }, []);

  const dailyProgress = Math.min((stats.todaySessions / stats.dailyGoal) * 100, 100);

  return (
    <Card className={`bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl text-teal-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Your Progress
        </CardTitle>
        <CardDescription>
          Track your breathing practice journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Daily Goal */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span className="font-semibold">Daily Goal</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {stats.todaySessions}/{stats.dailyGoal}
              </Badge>
            </div>
            <Progress value={dailyProgress} className="h-2 bg-white/20" />
            <p className="text-sm mt-1 opacity-90">
              {stats.dailyGoal - stats.todaySessions > 0 
                ? `${stats.dailyGoal - stats.todaySessions} more to reach your goal`
                : 'Goal achieved! 🎉'
              }
            </p>
          </div>

          {/* Current Streak */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Current Streak</span>
            </div>
            <div className="text-2xl font-bold">{stats.currentStreak} days</div>
            <p className="text-sm opacity-90">
              Longest: {stats.longestStreak} days
            </p>
          </div>

          {/* Total Sessions */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5" />
              <span className="font-semibold">Total Sessions</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-sm opacity-90">
              This week: {stats.thisWeekSessions}
            </p>
          </div>

          {/* Total Time */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Total Time</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalMinutes} min</div>
            <p className="text-sm opacity-90">
              {Math.round(stats.totalMinutes / 60 * 10) / 10} hours practiced
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingProgress;
