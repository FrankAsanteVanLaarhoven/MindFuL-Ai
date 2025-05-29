
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
  {
    id: 'therapist-female',
    name: 'Dr. Sarah',
    type: 'therapist',
    gender: 'female',
    age: 'middle',
    description: 'Professional therapist with warm, empathetic approach',
    personality: 'Professional, calm, evidence-based',
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah
    emoji: '👩‍⚕️',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'therapist-male',
    name: 'Dr. Michael',
    type: 'therapist',
    gender: 'male',
    age: 'middle',
    description: 'Experienced therapist with gentle, supportive style',
    personality: 'Professional, understanding, patient',
    voiceId: 'onwK4e9ZLuTAKqWW03F9', // Daniel
    emoji: '👨‍⚕️',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'grandma-wise',
    name: 'Grandma Rose',
    type: 'grandma',
    gender: 'female',
    age: 'senior',
    description: 'Wise grandmother with years of life experience',
    personality: 'Nurturing, wise, comforting',
    voiceId: 'XrExE9yKIg1WjnnlVkGX', // Matilda
    emoji: '👵',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'grandpa-gentle',
    name: 'Grandpa Frank',
    type: 'grandpa',
    gender: 'male',
    age: 'senior',
    description: 'Kind grandfather with gentle wisdom',
    personality: 'Patient, understanding, storyteller',
    voiceId: 'JBFqnCBsd6RMkjVDRZzb', // George
    emoji: '👴',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'aunt-caring',
    name: 'Aunt Maria',
    type: 'aunt',
    gender: 'female',
    age: 'middle',
    description: 'Caring aunt who always listens without judgment',
    personality: 'Supportive, non-judgmental, encouraging',
    voiceId: 'cgSgspJ2msm6clMCkdW9', // Jessica
    emoji: '👩‍🦱',
    color: 'from-purple-500 to-violet-500'
  },
  {
    id: 'uncle-supportive',
    name: 'Uncle Dave',
    type: 'uncle',
    gender: 'male',
    age: 'middle',
    description: 'Supportive uncle with practical wisdom',
    personality: 'Practical, encouraging, reliable',
    voiceId: 'cjVigY5qzO86Huf0OWal', // Eric
    emoji: '👨‍🦲',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'sibling-young',
    name: 'Alex',
    type: 'sibling',
    gender: 'non-binary',
    age: 'young',
    description: 'Understanding sibling who gets it',
    personality: 'Relatable, modern, empathetic',
    voiceId: 'pFZP5JQG7iQjIQuC4Bku', // Lily
    emoji: '🧑‍🎓',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'teacher-mentor',
    name: 'Ms. Johnson',
    type: 'teacher',
    gender: 'female',
    age: 'middle',
    description: 'Mentor teacher who guides with patience',
    personality: 'Educational, patient, inspiring',
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2', // Alice
    emoji: '👩‍🏫',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'friend-peer',
    name: 'Jordan',
    type: 'friend',
    gender: 'non-binary',
    age: 'young',
    description: 'Supportive friend who understands your generation',
    personality: 'Casual, understanding, authentic',
    voiceId: 'SAz9YHcvj6GT2YYXdXww', // River
    emoji: '🧑‍🤝‍🧑',
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
    grandma: 'Grandmother Figure',
    grandpa: 'Grandfather Figure',
    aunt: 'Aunt Figure',
    uncle: 'Uncle Figure',
    sibling: 'Sibling Figure',
    teacher: 'Teacher/Mentor',
    friend: 'Peer Friend'
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
      <CardHeader>
        <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
          <span className="text-xl">👤</span>
          Choose Your Therapy Companion
        </CardTitle>
        <CardDescription>
          Select an avatar that feels most comfortable and supportive for your therapy sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
                      <div className="flex gap-1 mt-2">
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
