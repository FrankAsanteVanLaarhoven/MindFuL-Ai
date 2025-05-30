
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
      case 'child-with-adult':
        return [
          { title: 'Fun Breathing Games', duration: '3 min', type: 'breathing' },
          { title: 'Story Time Relaxation', duration: '8 min', type: 'guided-story' },
          { title: 'Gentle Movement Fun', duration: '5 min', type: 'movement' }
        ];
      case 'senior':
        return [
          { title: 'Gentle Morning Stretch', duration: '6 min', type: 'movement' },
          { title: 'Memory & Mindfulness', duration: '10 min', type: 'meditation' },
          { title: 'Peaceful Breathing', duration: '4 min', type: 'breathing' }
        ];
      case 'teen':
        return [
          { title: 'Stress-Free Study Break', duration: '3 min', type: 'breathing' },
          { title: 'Confidence Boost', duration: '7 min', type: 'meditation' },
          { title: 'Energy Reset', duration: '4 min', type: 'movement' }
        ];
      case 'entrepreneur':
        return [
          { title: 'Decision Clarity', duration: '5 min', type: 'meditation' },
          { title: 'Stress Release', duration: '4 min', type: 'breathing' },
          { title: 'Energy Recharge', duration: '6 min', type: 'movement' }
        ];
      case 'artist-creative':
        return [
          { title: 'Creative Flow State', duration: '8 min', type: 'meditation' },
          { title: 'Inspiration Breathing', duration: '4 min', type: 'breathing' },
          { title: 'Artist Block Release', duration: '6 min', type: 'movement' }
        ];
      case 'faith-based':
        return [
          { title: 'Spiritual Reflection', duration: '10 min', type: 'meditation' },
          { title: 'Peaceful Prayer', duration: '5 min', type: 'prayer' },
          { title: 'Gratitude Practice', duration: '4 min', type: 'gratitude' }
        ];
      case 'military-veteran':
        return [
          { title: 'Grounding Technique', duration: '5 min', type: 'grounding' },
          { title: 'Tactical Breathing', duration: '4 min', type: 'breathing' },
          { title: 'Strength Recovery', duration: '8 min', type: 'meditation' }
        ];
      case 'first-responder':
        return [
          { title: 'Post-Shift Decompression', duration: '6 min', type: 'meditation' },
          { title: 'Emergency Calm', duration: '2 min', type: 'breathing' },
          { title: 'Resilience Building', duration: '8 min', type: 'strength' }
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
      case 'child-with-adult':
        return [
          'Make wellness fun with games and stories.',
          'Keep sessions short and engaging for young attention spans.',
          'Always ensure a trusted adult is present for guidance.'
        ];
      case 'senior':
        return [
          'Start slowly and be gentle with yourself.',
          'Focus on what feels good and comfortable for your body.',
          'Remember that wisdom comes with experience - trust yourself.'
        ];
      case 'teen':
        return [
          'It\'s normal to feel overwhelmed - you\'re not alone.',
          'Small daily practices can make a big difference.',
          'Your feelings are valid and it\'s okay to ask for help.'
        ];
      case 'entrepreneur':
        return [
          'Schedule wellness breaks like important meetings.',
          'Decision fatigue is real - give your mind time to rest.',
          'Success includes taking care of your mental health.'
        ];
      case 'faith-based':
        return [
          'Integrate your spiritual practices with mindfulness.',
          'Use prayer and meditation as complementary practices.',
          'Find strength in your faith community support.'
        ];
      case 'military-veteran':
        return [
          'Transition takes time - be patient with yourself.',
          'Your service experience can be a source of strength.',
          'Connect with fellow veterans who understand your journey.'
        ];
      default:
        return [
          'Start your day with 5 minutes of mindful breathing.',
          'Take regular breaks to check in with your emotions.',
          'Practice gratitude by noting 3 things you\'re thankful for daily.'
        ];
    }
  };

  const getPersonalizedChallenge = () => {
    switch (userProfile.primaryGroup) {
      case 'child-with-adult':
        return {
          title: 'Family Fun Wellness Week',
          description: 'Day 2 of 7 • Complete fun activities with your guide',
          progress: 28
        };
      case 'senior':
        return {
          title: 'Gentle Wellness Journey',
          description: 'Day 4 of 7 • Comfortable pace, lasting results',
          progress: 57
        };
      case 'teen':
        return {
          title: 'Teen Stress-Buster Challenge',
          description: 'Day 3 of 7 • Build confidence and calm',
          progress: 43
        };
      case 'entrepreneur':
        return {
          title: 'Founder Wellness Sprint',
          description: 'Day 5 of 7 • Balance hustle with health',
          progress: 71
        };
      case 'faith-based':
        return {
          title: 'Spiritual Wellness Journey',
          description: 'Day 3 of 7 • Deepen your practice',
          progress: 43
        };
      case 'military-veteran':
        return {
          title: 'Warrior Wellness Path',
          description: 'Day 4 of 7 • Strength through service',
          progress: 57
        };
      default:
        return {
          title: '7-Day Wellness Journey',
          description: 'Day 3 of 7 • Building healthy habits',
          progress: 43
        };
    }
  };

  const personalizedExercises = getPersonalizedExercises();
  const personalizedTips = getPersonalizedTips();
  const personalizedChallenge = getPersonalizedChallenge();

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
                {personalizedChallenge.title}
              </h4>
              <p className="text-sm text-purple-600 mb-3">
                {personalizedChallenge.description}
              </p>
              <div className="w-full bg-purple-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${personalizedChallenge.progress}%` }}
                ></div>
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
