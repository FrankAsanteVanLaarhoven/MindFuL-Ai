
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { UserProfile } from '../../types/UserSegmentation';
import { USER_GROUPS } from '../../data/userGroups';
import { Play, BookOpen, Target, TrendingUp } from 'lucide-react';

interface PersonalizedContentProps {
  userProfile: UserProfile;
}

const PersonalizedContent: React.FC<PersonalizedContentProps> = ({ userProfile }) => {
  const primaryGroup = USER_GROUPS.find(g => g.id === userProfile.primaryGroup);

  // Mock personalized content based on user's groups
  const getPersonalizedExercises = () => {
    switch (userProfile.primaryGroup) {
      case 'carer':
        return [
          { title: '5-Minute Stress Relief', duration: '5 min', type: 'breathing' },
          { title: 'Caregiver Self-Care', duration: '10 min', type: 'meditation' },
          { title: 'Quick Energy Boost', duration: '3 min', type: 'movement' }
        ];
      case 'teacher':
        return [
          { title: 'Classroom Calm', duration: '2 min', type: 'breathing' },
          { title: 'After-School Reset', duration: '8 min', type: 'meditation' },
          { title: 'Morning Preparation', duration: '6 min', type: 'mindfulness' }
        ];
      case 'sports-fan':
        return [
          { title: 'Pre-Game Focus', duration: '4 min', type: 'breathing' },
          { title: 'Performance Visualization', duration: '12 min', type: 'meditation' },
          { title: 'Victory Celebration', duration: '5 min', type: 'movement' }
        ];
      default:
        return [
          { title: 'Daily Mindfulness', duration: '7 min', type: 'meditation' },
          { title: 'Breathing Reset', duration: '4 min', type: 'breathing' },
          { title: 'Evening Wind-down', duration: '10 min', type: 'relaxation' }
        ];
    }
  };

  const getPersonalizedTips = () => {
    switch (userProfile.primaryGroup) {
      case 'carer':
        return [
          'Remember: You can\'t pour from an empty cup. Take care of yourself first.',
          'Schedule respite time - even 15 minutes can make a difference.',
          'Connect with other carers who understand your journey.'
        ];
      case 'teacher':
        return [
          'Use the 3-breath rule before responding to challenging situations.',
          'Create a calm corner in your classroom for mindful moments.',
          'Practice gratitude - write down 3 positive moments from each day.'
        ];
      case 'sports-fan':
        return [
          'Channel your team\'s energy into positive motivation for your own goals.',
          'Use halftime as a reminder to pause and breathe during stressful moments.',
          'Celebrate small victories like your favorite team celebrates goals.'
        ];
      default:
        return [
          'Start your day with 5 minutes of mindful breathing.',
          'Take regular breaks to check in with your emotions.',
          'Practice gratitude by noting 3 things you\'re thankful for daily.'
        ];
    }
  };

  const personalizedExercises = getPersonalizedExercises();
  const personalizedTips = getPersonalizedTips();

  return (
    <div className="space-y-6">
      {/* Recommended Exercises */}
      <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Play className="w-5 h-5 text-blue-600" />
            Recommended for You
          </CardTitle>
          <CardDescription>
            Personalized exercises based on your {primaryGroup?.displayName.toLowerCase() || 'profile'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {personalizedExercises.map((exercise, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <h4 className="font-medium text-gray-800">{exercise.title}</h4>
                  <p className="text-sm text-gray-600">{exercise.duration} • {exercise.type}</p>
                </div>
                <Button size="sm" variant="outline">
                  Start
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Tips */}
      <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <BookOpen className="w-5 h-5 text-green-600" />
            Wellness Tips for You
          </CardTitle>
          <CardDescription>
            Curated advice for your lifestyle and challenges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {personalizedTips.map((tip, index) => (
              <div key={index} className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                <p className="text-green-800 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Challenges */}
      <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Target className="w-5 h-5 text-purple-600" />
            Active Challenges
          </CardTitle>
          <CardDescription>
            Join challenges designed for your community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">
                {primaryGroup?.id === 'sports-fan' ? 'Team Spirit Challenge' : 
                 primaryGroup?.id === 'carer' ? 'Self-Care Week' :
                 primaryGroup?.id === 'teacher' ? 'Classroom Mindfulness' :
                 '7-Day Wellness Journey'}
              </h4>
              <p className="text-sm text-purple-600 mb-3">
                Day 3 of 7 • 67% complete
              </p>
              <div className="w-full bg-purple-200 rounded-full h-2 mb-3">
                <div className="bg-purple-600 h-2 rounded-full w-2/3"></div>
              </div>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Continue Challenge
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedContent;
