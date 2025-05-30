
import { UserGroup } from '../types/UserSegmentation';

export const USER_GROUPS: UserGroup[] = [
  {
    id: 'carer',
    name: 'carer',
    displayName: "I'm a Carer",
    description: 'Supporting loved ones while maintaining your own wellbeing',
    icon: '🤗',
    color: 'bg-pink-500',
    features: ['stress-relief', 'peer-support', 'respite-tips', 'carer-forums'],
    communityName: "Carers' Lounge"
  },
  {
    id: 'teacher',
    name: 'teacher',
    displayName: "I'm a Teacher",
    description: 'Classroom mindfulness and educator wellness',
    icon: '📚',
    color: 'bg-blue-500',
    features: ['classroom-mindfulness', 'work-life-balance', 'student-engagement', 'educator-forums'],
    communityName: "Educators' Circle"
  },
  {
    id: 'sports-fan',
    name: 'sports-fan',
    displayName: "I'm a Sports Fan",
    description: 'Performance mindset and fan community wellness',
    icon: '⚽',
    color: 'bg-green-500',
    features: ['performance-anxiety', 'team-challenges', 'athlete-content', 'fan-community'],
    communityName: "Sports Mindset Community"
  },
  {
    id: 'public-figure',
    name: 'public-figure',
    displayName: "I'm a Public Figure",
    description: 'Privacy-focused wellness for celebrities and influencers',
    icon: '⭐',
    color: 'bg-purple-500',
    features: ['vip-mode', 'privacy-controls', 'exclusive-content', 'celebrity-network'],
    communityName: "VIP Wellness Circle"
  },
  {
    id: 'healthcare-worker',
    name: 'healthcare-worker',
    displayName: "I'm a Healthcare Worker",
    description: 'Burnout prevention and resilience building',
    icon: '🏥',
    color: 'bg-red-500',
    features: ['burnout-prevention', 'shift-wellness', 'peer-support', 'healthcare-forums'],
    communityName: "Healthcare Heroes"
  },
  {
    id: 'student',
    name: 'student',
    displayName: "I'm a Student",
    description: 'Academic stress management and study wellness',
    icon: '🎓',
    color: 'bg-yellow-500',
    features: ['study-stress', 'exam-anxiety', 'campus-wellness', 'student-community'],
    communityName: "Student Wellness Hub"
  },
  {
    id: 'parent',
    name: 'parent',
    displayName: "I'm a Parent",
    description: 'Family wellness and parenting mindfulness',
    icon: '👨‍👩‍👧‍👦',
    color: 'bg-orange-500',
    features: ['family-sessions', 'parenting-stress', 'child-activities', 'parent-network'],
    communityName: "Mindful Families"
  },
  {
    id: 'professional',
    name: 'professional',
    displayName: "I'm a Working Professional",
    description: 'Workplace wellness and productivity mindfulness',
    icon: '💼',
    color: 'bg-indigo-500',
    features: ['work-stress', 'productivity-mindfulness', 'team-wellness', 'professional-network'],
    communityName: "Workplace Wellness"
  }
];
