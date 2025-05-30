
export interface UserGroup {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  features: string[];
  communityName: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  selectedGroups: string[];
  primaryGroup?: string;
  preferences: UserPreferences;
  onboardingCompleted: boolean;
  joinedDate: Date;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  privacyMode: 'public' | 'private' | 'vip';
  notifications: {
    reminders: boolean;
    community: boolean;
    challenges: boolean;
    mentorship: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reduceMotion: boolean;
  };
}

export interface PersonalizedContent {
  exercises: Exercise[];
  tips: WellnessTip[];
  challenges: Challenge[];
  communityPosts: CommunityPost[];
  mentorshipOpportunities: MentorshipOpportunity[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetGroups: string[];
  type: 'breathing' | 'meditation' | 'mindfulness' | 'movement';
}

export interface WellnessTip {
  id: string;
  title: string;
  content: string;
  targetGroups: string[];
  category: 'stress' | 'productivity' | 'relationships' | 'health';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  targetGroups: string[];
  type: 'individual' | 'team' | 'community';
  celebrity?: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  targetGroups: string[];
  likes: number;
  comments: number;
  timestamp: Date;
}

export interface MentorshipOpportunity {
  id: string;
  mentorName: string;
  expertise: string[];
  targetGroups: string[];
  availability: string;
  type: 'peer' | 'expert' | 'celebrity';
}
