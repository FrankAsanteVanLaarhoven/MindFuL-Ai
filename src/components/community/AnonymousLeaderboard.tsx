
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users } from 'lucide-react';

interface LeaderboardEntry {
  user: string;
  streak: number;
}

const mockLeaderboardData: LeaderboardEntry[] = [
  { user: 'WellnessWarrior123', streak: 28 },
  { user: 'MindfulJourney456', streak: 25 },
  { user: 'CalmSeeker789', streak: 22 },
  { user: 'BreathingBuddy012', streak: 19 },
  { user: 'ZenLearner345', streak: 17 }
];

export const AnonymousLeaderboard: React.FC = () => {
  const [optedIn, setOptedIn] = useState(false);

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Wellness Streaks
        </CardTitle>
        <p className="text-sm text-gray-600">
          Join anonymously to see community progress
        </p>
      </CardHeader>
      <CardContent>
        {!optedIn ? (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Users className="w-12 h-12 text-yellow-500" />
            </div>
            <p className="text-gray-600">
              See how the community is doing with their wellness practices! 
              Your identity stays completely anonymous.
            </p>
            <Button 
              onClick={() => setOptedIn(true)}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Join Anonymously
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-center text-sm text-gray-600 mb-4">
              Showing anonymous wellness streaks
            </div>
            {mockLeaderboardData.map((entry, idx) => (
              <div 
                key={idx} 
                className="flex justify-between items-center py-2 px-3 bg-white/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">
                    #{idx + 1}
                  </span>
                  <span className="text-gray-800">{entry.user}</span>
                </div>
                <span className="font-semibold text-yellow-700">
                  {entry.streak} days
                </span>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setOptedIn(false)}
              className="w-full mt-4"
            >
              Leave Leaderboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
