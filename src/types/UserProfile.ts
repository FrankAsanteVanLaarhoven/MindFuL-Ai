
export interface UserProfile {
  id: string;
  // Personal Information
  name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  
  // Background & Identity
  ethnicity?: string;
  nationality?: string;
  citizenship?: string;
  religion?: string;
  spiritualBeliefs?: string;
  culture?: string;
  starSign?: string;
  
  // Work & Education
  occupation?: string;
  workEnvironment?: 'office' | 'remote' | 'hybrid' | 'manual' | 'healthcare' | 'education' | 'retail' | 'other';
  educationLevel?: 'high-school' | 'college' | 'undergraduate' | 'postgraduate' | 'doctorate' | 'other';
  workStress?: 'low' | 'moderate' | 'high';
  
  // Family & Relationships
  relationshipStatus?: 'single' | 'dating' | 'married' | 'divorced' | 'widowed' | 'complicated';
  hasChildren?: boolean;
  numberOfChildren?: number;
  childrenAges?: string;
  livingSituation?: 'alone' | 'with-partner' | 'with-family' | 'with-roommates' | 'with-parents';
  familySupport?: 'strong' | 'moderate' | 'limited' | 'none';
  
  // Lifestyle & Habits
  smokingStatus?: 'never' | 'former' | 'occasional' | 'regular';
  alcoholConsumption?: 'none' | 'occasional' | 'moderate' | 'regular' | 'concerned';
  exerciseFrequency?: 'never' | 'rarely' | 'weekly' | 'regular' | 'daily';
  sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent';
  
  // Hobbies & Interests
  hobbies?: string[];
  interests?: string[];
  
  // Mental Health Context
  previousTherapy?: boolean;
  currentChallenges?: string[];
  copingMechanisms?: string[];
  
  // Privacy Settings
  usePersonalizedResponses?: boolean;
  shareWithTherapist?: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_PROFILE: Partial<UserProfile> = {
  usePersonalizedResponses: false,
  shareWithTherapist: false,
  hasChildren: false,
  previousTherapy: false
};
