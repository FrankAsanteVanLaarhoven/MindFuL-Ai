
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export interface AvatarCharacter {
  id: string;
  name: string;
  type: 'grandma' | 'grandpa' | 'aunt' | 'uncle' | 'sibling' | 'teacher' | 'therapist' | 'friend';
  gender: 'male' | 'female' | 'non-binary';
  age: 'young' | 'middle' | 'senior';
  ethnicity: 'african' | 'asian' | 'muslim' | 'indian' | 'chinese' | 'european' | 'mexican' | 'jamaican' | 'moroccan' | 'spanish' | 'italian' | 'ethiopian' | 'mixed';
  skinTone: string;
  description: string;
  personality: string;
  voiceId: string;
  emoji: string;
  color: string;
}

interface AvatarSelectorProps {
  selectedAvatar: AvatarCharacter | null;
  onAvatarSelect: (avatar: AvatarCharacter) => void;
}

const avatarCharacters: AvatarCharacter[] = [
  // Professional Therapists - Diverse
  {
    id: 'therapist-african-female',
    name: 'Dr. Amara',
    type: 'therapist',
    gender: 'female',
    age: 'middle',
    ethnicity: 'african',
    skinTone: '#8B4513',
    description: 'Professional therapist with warm, empathetic approach',
    personality: 'Professional, calm, evidence-based',
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
    emoji: '👩🏿‍⚕️',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'therapist-asian-male',
    name: 'Dr. Kenji',
    type: 'therapist',
    gender: 'male',
    age: 'middle',
    ethnicity: 'asian',
    skinTone: '#F4C2A1',
    description: 'Experienced therapist with gentle, supportive style',
    personality: 'Professional, understanding, patient',
    voiceId: 'onwK4e9ZLuTAKqWW03F9',
    emoji: '👨🏻‍⚕️',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'therapist-european-female',
    name: 'Dr. Sarah',
    type: 'therapist',
    gender: 'female',
    age: 'middle',
    ethnicity: 'european',
    skinTone: '#FDBCB4',
    description: 'Compassionate therapist with holistic approach',
    personality: 'Professional, warm, insightful',
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
    emoji: '👩🏼‍⚕️',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'therapist-indian-male',
    name: 'Dr. Arjun',
    type: 'therapist',
    gender: 'male',
    age: 'middle',
    ethnicity: 'indian',
    skinTone: '#D2B48C',
    description: 'Mindful therapist integrating Eastern wisdom',
    personality: 'Professional, mindful, wise',
    voiceId: 'onwK4e9ZLuTAKqWW03F9',
    emoji: '👨🏽‍⚕️',
    color: 'from-blue-500 to-blue-600'
  },

  // Grandmother Figures - Diverse
  {
    id: 'grandma-jamaican',
    name: 'Grandma Ruby',
    type: 'grandma',
    gender: 'female',
    age: 'senior',
    ethnicity: 'jamaican',
    skinTone: '#8B4513',
    description: 'Wise Caribbean grandmother with healing wisdom',
    personality: 'Nurturing, wise, spiritually grounded',
    voiceId: 'XrExE9yKIg1WjnnlVkGX',
    emoji: '👵🏿',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'grandma-chinese',
    name: 'Grandma Li',
    type: 'grandma',
    gender: 'female',
    age: 'senior',
    ethnicity: 'chinese',
    skinTone: '#F4C2A1',
    description: 'Traditional grandmother with ancient wisdom',
    personality: 'Nurturing, wise, traditional',
    voiceId: 'XrExE9yKIg1WjnnlVkGX',
    emoji: '👵🏻',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'grandma-moroccan',
    name: 'Grandma Fatima',
    type: 'grandma',
    gender: 'female',
    age: 'senior',
    ethnicity: 'moroccan',
    skinTone: '#D2B48C',
    description: 'Caring North African grandmother with deep wisdom',
    personality: 'Nurturing, wise, culturally rich',
    voiceId: 'XrExE9yKIg1WjnnlVkGX',
    emoji: '👵🏽',
    color: 'from-pink-500 to-rose-500'
  },

  // Grandfather Figures - Diverse
  {
    id: 'grandpa-ethiopian',
    name: 'Grandpa Haile',
    type: 'grandpa',
    gender: 'male',
    age: 'senior',
    ethnicity: 'ethiopian',
    skinTone: '#8B4513',
    description: 'Gentle African grandfather with storytelling wisdom',
    personality: 'Patient, understanding, storyteller',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    emoji: '👴🏿',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'grandpa-italian',
    name: 'Grandpa Giuseppe',
    type: 'grandpa',
    gender: 'male',
    age: 'senior',
    ethnicity: 'italian',
    skinTone: '#FDBCB4',
    description: 'Warm Mediterranean grandfather with life wisdom',
    personality: 'Patient, understanding, passionate',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb',
    emoji: '👴🏼',
    color: 'from-amber-500 to-orange-500'
  },

  // Aunt Figures - Diverse
  {
    id: 'aunt-mexican',
    name: 'Tía Maria',
    type: 'aunt',
    gender: 'female',
    age: 'middle',
    ethnicity: 'mexican',
    skinTone: '#D2B48C',
    description: 'Caring Latina aunt who always listens without judgment',
    personality: 'Supportive, non-judgmental, encouraging',
    voiceId: 'cgSgspJ2msm6clMCkdW9',
    emoji: '👩🏽‍🦱',
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'aunt-spanish',
    name: 'Tía Carmen',
    type: 'aunt',
    gender: 'female',
    age: 'middle',
    ethnicity: 'spanish',
    skinTone: '#FDBCB4',
    description: 'Passionate Spanish aunt with emotional intelligence',
    personality: 'Supportive, expressive, understanding',
    voiceId: 'cgSgspJ2msm6clMCkdW9',
    emoji: '👩🏼‍🦱',
    color: 'from-purple-500 to-violet-500'
  },

  // Uncle Figures - Diverse
  {
    id: 'uncle-mixed',
    name: 'Uncle Marcus',
    type: 'uncle',
    gender: 'male',
    age: 'middle',
    ethnicity: 'mixed',
    skinTone: '#C19A6B',
    description: 'Supportive mixed-race uncle with diverse perspective',
    personality: 'Practical, encouraging, open-minded',
    voiceId: 'cjVigY5qzO86Huf0OWal',
    emoji: '👨🏽‍🦲',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'uncle-european',
    name: 'Uncle Dave',
    type: 'uncle',
    gender: 'male',
    age: 'middle',
    ethnicity: 'european',
    skinTone: '#FDBCB4',
    description: 'Supportive European uncle with practical wisdom',
    personality: 'Practical, encouraging, reliable',
    voiceId: 'cjVigY5qzO86Huf0OWal',
    emoji: '👨🏼‍🦲',
    color: 'from-green-500 to-emerald-500'
  },

  // Sibling Figures - Diverse
  {
    id: 'sibling-asian',
    name: 'Alex',
    type: 'sibling',
    gender: 'non-binary',
    age: 'young',
    ethnicity: 'asian',
    skinTone: '#F4C2A1',
    description: 'Understanding Asian sibling who gets modern challenges',
    personality: 'Relatable, modern, empathetic',
    voiceId: 'pFZP5JQG7iQjIQuC4Bku',
    emoji: '🧑🏻‍🎓',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'sibling-african',
    name: 'Jordan',
    type: 'sibling',
    gender: 'non-binary',
    age: 'young',
    ethnicity: 'african',
    skinTone: '#8B4513',
    description: 'Cool African sibling with street smarts and wisdom',
    personality: 'Relatable, authentic, supportive',
    voiceId: 'pFZP5JQG7iQjIQuC4Bku',
    emoji: '🧑🏿‍🎓',
    color: 'from-teal-500 to-cyan-500'
  },

  // Teacher Figures - Diverse
  {
    id: 'teacher-indian',
    name: 'Ms. Priya',
    type: 'teacher',
    gender: 'female',
    age: 'middle',
    ethnicity: 'indian',
    skinTone: '#D2B48C',
    description: 'Inspiring Indian teacher who guides with patience',
    personality: 'Educational, patient, inspiring',
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2',
    emoji: '👩🏽‍🏫',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'teacher-african',
    name: 'Mr. Kwame',
    type: 'teacher',
    gender: 'male',
    age: 'middle',
    ethnicity: 'african',
    skinTone: '#8B4513',
    description: 'Wise African teacher with cultural depth',
    personality: 'Educational, wise, culturally aware',
    voiceId: 'cjVigY5qzO86Huf0OWal',
    emoji: '👨🏿‍🏫',
    color: 'from-indigo-500 to-blue-500'
  },

  // Friend Figures - Diverse
  {
    id: 'friend-mixed',
    name: 'Casey',
    type: 'friend',
    gender: 'non-binary',
    age: 'young',
    ethnicity: 'mixed',
    skinTone: '#C19A6B',
    description: 'Supportive mixed-race friend who understands complexity',
    personality: 'Casual, understanding, authentic',
    voiceId: 'SAz9YHcvj6GT2YYXdXww',
    emoji: '🧑🏽‍🤝‍🧑',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'friend-chinese',
    name: 'River',
    type: 'friend',
    gender: 'non-binary',
    age: 'young',
    ethnicity: 'chinese',
    skinTone: '#F4C2A1',
    description: 'Understanding Chinese friend with global perspective',
    personality: 'Casual, wise, culturally aware',
    voiceId: 'SAz9YHcvj6GT2YYXdXww',
    emoji: '🧑🏻‍🤝‍🧑',
    color: 'from-yellow-500 to-orange-500'
  }
];

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ selectedAvatar, onAvatarSelect }) => {
  const groupedAvatars = avatarCharacters.reduce((groups, avatar) => {
    const category = avatar.type;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(avatar);
    return groups;
  }, {} as Record<string, AvatarCharacter[]>);

  const categoryLabels = {
    therapist: 'Professional Therapists',
    grandma: 'Grandmother Figures',
    grandpa: 'Grandfather Figures',
    aunt: 'Aunt Figures',
    uncle: 'Uncle Figures',
    sibling: 'Sibling Figures',
    teacher: 'Teacher/Mentor',
    friend: 'Peer Friends'
  };

  const getEthnicityLabel = (ethnicity: string) => {
    const labels: Record<string, string> = {
      african: 'African',
      asian: 'Asian',
      muslim: 'Muslim',
      indian: 'Indian',
      chinese: 'Chinese',
      european: 'European',
      mexican: 'Mexican',
      jamaican: 'Jamaican',
      moroccan: 'Moroccan',
      spanish: 'Spanish',
      italian: 'Italian',
      ethiopian: 'Ethiopian',
      mixed: 'Mixed Race'
    };
    return labels[ethnicity] || ethnicity;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
      <CardHeader>
        <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
          <span className="text-xl">👤</span>
          Choose Your Therapy Companion
        </CardTitle>
        <CardDescription>
          Select an avatar that feels most comfortable and represents your preferred cultural background
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 max-h-96 overflow-y-auto">
        {Object.entries(groupedAvatars).map(([category, avatars]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {avatars.map((avatar) => (
                <Button
                  key={avatar.id}
                  onClick={() => onAvatarSelect(avatar)}
                  variant={selectedAvatar?.id === avatar.id ? "default" : "outline"}
                  className={`h-auto p-4 justify-start ${
                    selectedAvatar?.id === avatar.id 
                      ? `bg-gradient-to-r ${avatar.color} text-white border-none`
                      : 'hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="text-2xl">{avatar.emoji}</div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{avatar.name}</div>
                      <div className="text-xs opacity-75 mt-1">{avatar.description}</div>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {getEthnicityLabel(avatar.ethnicity)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {avatar.age}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {avatar.gender}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AvatarSelector;
export { avatarCharacters };
