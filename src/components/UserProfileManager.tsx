
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { UserProfile, DEFAULT_PROFILE } from '@/types/UserProfile';
import { User, Briefcase, Heart, Home, Brain, Settings } from 'lucide-react';

interface UserProfileManagerProps {
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
  existingProfile?: UserProfile | null;
}

const UserProfileManager: React.FC<UserProfileManagerProps> = ({ 
  onSave, 
  onCancel, 
  existingProfile 
}) => {
  const [profile, setProfile] = useState<Partial<UserProfile>>(() => ({
    ...DEFAULT_PROFILE,
    ...existingProfile,
    id: existingProfile?.id || crypto.randomUUID(),
    updatedAt: new Date()
  }));

  const [activeTab, setActiveTab] = useState('personal');

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date()
    }));
  };

  const addToArray = (field: 'hobbies' | 'interests' | 'currentChallenges' | 'copingMechanisms', value: string) => {
    if (!value.trim()) return;
    const currentArray = profile[field] || [];
    updateProfile(field, [...currentArray, value.trim()]);
  };

  const removeFromArray = (field: 'hobbies' | 'interests' | 'currentChallenges' | 'copingMechanisms', index: number) => {
    const currentArray = profile[field] || [];
    updateProfile(field, currentArray.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const finalProfile: UserProfile = {
      ...DEFAULT_PROFILE,
      ...profile,
      id: profile.id || crypto.randomUUID(),
      createdAt: existingProfile?.createdAt || new Date(),
      updatedAt: new Date()
    } as UserProfile;
    
    onSave(finalProfile);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
      <CardHeader>
        <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
          <User className="w-5 h-5" />
          Personal Profile Setup
        </CardTitle>
        <CardDescription>
          Customize your profile for personalized therapy sessions. All fields are optional - share only what you're comfortable with.
        </CardDescription>
        
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Switch
            checked={profile.usePersonalizedResponses || false}
            onCheckedChange={(checked) => updateProfile('usePersonalizedResponses', checked)}
          />
          <Label className="text-sm text-blue-800">
            Enable personalized responses based on my profile
          </Label>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="work">Work/Education</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="mental-health">Mental Health</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name (Optional)</Label>
                <Input
                  value={profile.name || ''}
                  onChange={(e) => updateProfile('name', e.target.value)}
                  placeholder="How would you like to be addressed?"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Age (Optional)</Label>
                <Input
                  type="number"
                  value={profile.age || ''}
                  onChange={(e) => updateProfile('age', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Your age"
                />
              </div>

              <div className="space-y-2">
                <Label>Gender Identity</Label>
                <Select value={profile.gender || ''} onValueChange={(value) => updateProfile('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender identity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Star Sign (Optional)</Label>
                <Input
                  value={profile.starSign || ''}
                  onChange={(e) => updateProfile('starSign', e.target.value)}
                  placeholder="e.g., Leo, Virgo"
                />
              </div>

              <div className="space-y-2">
                <Label>Religion/Spirituality (Optional)</Label>
                <Input
                  value={profile.religion || ''}
                  onChange={(e) => updateProfile('religion', e.target.value)}
                  placeholder="Your religious or spiritual beliefs"
                />
              </div>

              <div className="space-y-2">
                <Label>Cultural Background (Optional)</Label>
                <Input
                  value={profile.culture || ''}
                  onChange={(e) => updateProfile('culture', e.target.value)}
                  placeholder="Your cultural identity"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="work" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Occupation (Optional)</Label>
                <Input
                  value={profile.occupation || ''}
                  onChange={(e) => updateProfile('occupation', e.target.value)}
                  placeholder="Your job title or profession"
                />
              </div>

              <div className="space-y-2">
                <Label>Work Environment</Label>
                <Select value={profile.workEnvironment || ''} onValueChange={(value) => updateProfile('workEnvironment', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="manual">Manual/Physical</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail/Service</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Education Level</Label>
                <Select value={profile.educationLevel || ''} onValueChange={(value) => updateProfile('educationLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="college">College/Trade School</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate Degree</SelectItem>
                    <SelectItem value="postgraduate">Postgraduate Degree</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Work Stress Level</Label>
                <Select value={profile.workStress || ''} onValueChange={(value) => updateProfile('workStress', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stress level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="family" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Relationship Status</Label>
                <Select value={profile.relationshipStatus || ''} onValueChange={(value) => updateProfile('relationshipStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="dating">Dating</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="complicated">It's complicated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Living Situation</Label>
                <Select value={profile.livingSituation || ''} onValueChange={(value) => updateProfile('livingSituation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select living situation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alone">Live alone</SelectItem>
                    <SelectItem value="with-partner">With partner</SelectItem>
                    <SelectItem value="with-family">With family</SelectItem>
                    <SelectItem value="with-roommates">With roommates</SelectItem>
                    <SelectItem value="with-parents">With parents</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={profile.hasChildren || false}
                  onCheckedChange={(checked) => updateProfile('hasChildren', checked)}
                />
                <Label>I have children</Label>
              </div>

              {profile.hasChildren && (
                <div className="space-y-2">
                  <Label>Children Ages (Optional)</Label>
                  <Input
                    value={profile.childrenAges || ''}
                    onChange={(e) => updateProfile('childrenAges', e.target.value)}
                    placeholder="e.g., 5, 8, 12 or toddler, teen"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Family Support Level</Label>
                <Select value={profile.familySupport || ''} onValueChange={(value) => updateProfile('familySupport', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select family support level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strong">Strong support</SelectItem>
                    <SelectItem value="moderate">Moderate support</SelectItem>
                    <SelectItem value="limited">Limited support</SelectItem>
                    <SelectItem value="none">No family support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lifestyle" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Smoking Status</Label>
                <Select value={profile.smokingStatus || ''} onValueChange={(value) => updateProfile('smokingStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select smoking status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never smoked</SelectItem>
                    <SelectItem value="former">Former smoker</SelectItem>
                    <SelectItem value="occasional">Occasional smoker</SelectItem>
                    <SelectItem value="regular">Regular smoker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Alcohol Consumption</Label>
                <Select value={profile.alcoholConsumption || ''} onValueChange={(value) => updateProfile('alcoholConsumption', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select alcohol consumption" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No alcohol</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="concerned">Concerned about usage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Exercise Frequency</Label>
                <Select value={profile.exerciseFrequency || ''} onValueChange={(value) => updateProfile('exerciseFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exercise frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="rarely">Rarely</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sleep Quality</Label>
                <Select value={profile.sleepQuality || ''} onValueChange={(value) => updateProfile('sleepQuality', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sleep quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hobbies & Interests</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a hobby or interest"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToArray('hobbies', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {(profile.hobbies || []).map((hobby, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('hobbies', index)}>
                    {hobby} ×
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mental-health" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={profile.previousTherapy || false}
                  onCheckedChange={(checked) => updateProfile('previousTherapy', checked)}
                />
                <Label>I have previous experience with therapy</Label>
              </div>

              <div className="space-y-2">
                <Label>Current Challenges</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a current challenge"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArray('currentChallenges', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {(profile.currentChallenges || []).map((challenge, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('currentChallenges', index)}>
                      {challenge} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Coping Mechanisms</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a coping mechanism"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addToArray('copingMechanisms', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {(profile.copingMechanisms || []).map((mechanism, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFromArray('copingMechanisms', index)}>
                      {mechanism} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-6 border-t">
          <Button onClick={handleSave} className="flex-1">
            Save Profile
          </Button>
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileManager;
