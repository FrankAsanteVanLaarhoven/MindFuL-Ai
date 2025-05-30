
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
  },
  {
    id: 'child-with-adult',
    name: 'child-with-adult',
    displayName: "Child with Guided Adult",
    description: 'Safe, supervised wellness activities for children',
    icon: '👧🏽👦🏻',
    color: 'bg-emerald-500',
    features: ['guided-sessions', 'child-safety', 'family-activities', 'educational-content'],
    communityName: "Young Minds & Guides"
  },
  {
    id: 'senior',
    name: 'senior',
    displayName: "I'm a Senior",
    description: 'Gentle wellness practices for mature adults',
    icon: '🧓',
    color: 'bg-amber-500',
    features: ['gentle-exercises', 'memory-wellness', 'senior-community', 'accessibility-focused'],
    communityName: "Golden Years Wellness"
  },
  {
    id: 'teen',
    name: 'teen',
    displayName: "I'm a Teenager",
    description: 'Age-appropriate mental health support for teens',
    icon: '🧑‍🎓',
    color: 'bg-cyan-500',
    features: ['peer-pressure', 'identity-exploration', 'teen-challenges', 'youth-community'],
    communityName: "Teen Talk Circle"
  },
  {
    id: 'entrepreneur',
    name: 'entrepreneur',
    displayName: "I'm an Entrepreneur",
    description: 'Managing startup stress and business wellness',
    icon: '🚀',
    color: 'bg-violet-500',
    features: ['startup-stress', 'decision-fatigue', 'leadership-wellness', 'founder-network'],
    communityName: "Founder Wellness Hub"
  },
  {
    id: 'artist-creative',
    name: 'artist-creative',
    displayName: "I'm an Artist/Creative",
    description: 'Creative wellness and artistic inspiration',
    icon: '🎨',
    color: 'bg-rose-500',
    features: ['creative-blocks', 'artistic-wellness', 'inspiration-tools', 'creative-community'],
    communityName: "Creative Spirits Circle"
  },
  {
    id: 'faith-based',
    name: 'faith-based',
    displayName: "I'm Faith-Based",
    description: 'Spiritual wellness and faith-centered practices',
    icon: '🙏',
    color: 'bg-teal-500',
    features: ['spiritual-practices', 'faith-community', 'prayer-meditation', 'values-based-wellness'],
    communityName: "Faith & Wellness Community"
  },
  {
    id: 'lgbtq-plus',
    name: 'lgbtq-plus',
    displayName: "I'm LGBTQ+",
    description: 'Inclusive wellness with community support',
    icon: '🏳️‍🌈',
    color: 'bg-fuchsia-500',
    features: ['inclusive-content', 'identity-support', 'safe-space', 'pride-community'],
    communityName: "Pride Wellness Community"
  },
  {
    id: 'refugee-immigrant',
    name: 'refugee-immigrant',
    displayName: "I'm a Refugee/Immigrant",
    description: 'Cultural adaptation and community wellness support',
    icon: '🌍',
    color: 'bg-lime-500',
    features: ['cultural-support', 'adaptation-help', 'multilingual-content', 'newcomer-community'],
    communityName: "New Horizons Community"
  },
  {
    id: 'disability-community',
    name: 'disability-community',
    displayName: "I'm in the Disability Community",
    description: 'Accessible wellness practices and inclusive support',
    icon: '♿',
    color: 'bg-sky-500',
    features: ['accessibility-tools', 'adaptive-exercises', 'inclusive-design', 'disability-advocacy'],
    communityName: "Accessible Wellness Circle"
  },
  {
    id: 'military-veteran',
    name: 'military-veteran',
    displayName: "I'm Military/Veteran",
    description: 'Specialized support for service members and veterans',
    icon: '🎖️',
    color: 'bg-stone-600',
    features: ['ptsd-support', 'transition-help', 'service-community', 'honor-wellness'],
    communityName: "Warriors' Wellness Network"
  },
  {
    id: 'first-responder',
    name: 'first-responder',
    displayName: "I'm a First Responder",
    description: 'Critical stress management for emergency professionals',
    icon: '🚨',
    color: 'bg-red-600',
    features: ['trauma-recovery', 'critical-stress', 'responder-support', 'emergency-wellness'],
    communityName: "First Response Wellness"
  },
  {
    id: 'other',
    name: 'other',
    displayName: "Other/Prefer to Explore",
    description: 'General wellness journey for unique situations',
    icon: '✨',
    color: 'bg-gray-500',
    features: ['flexible-content', 'diverse-options', 'exploration-mode', 'general-community'],
    communityName: "Wellness Explorers"
  }
];
