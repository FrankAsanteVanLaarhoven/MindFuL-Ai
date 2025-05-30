
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { USER_GROUPS } from '../../data/userGroups';
import { UserProfile } from '../../types/UserSegmentation';
import GroupSelectionCard from './GroupSelectionCard';
import { Star, Users, ArrowRight, Check } from 'lucide-react';

interface UserGroupSelectionProps {
  onComplete: (selectedGroups: string[], primaryGroup: string) => void;
  existingProfile?: UserProfile;
}

const UserGroupSelection: React.FC<UserGroupSelectionProps> = ({ onComplete, existingProfile }) => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>(
    existingProfile?.selectedGroups || []
  );
  const [primaryGroup, setPrimaryGroup] = useState<string | undefined>(
    existingProfile?.primaryGroup
  );
  const [step, setStep] = useState<'selection' | 'primary' | 'confirmation'>('selection');

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups(prev => {
      const newSelection = prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId];
      
      // If we deselect the primary group, clear it
      if (!newSelection.includes(groupId) && primaryGroup === groupId) {
        setPrimaryGroup(undefined);
      }
      
      return newSelection;
    });
  };

  const handlePrimarySelection = (groupId: string) => {
    setPrimaryGroup(groupId);
  };

  const handleNext = () => {
    if (step === 'selection' && selectedGroups.length > 0) {
      setStep('primary');
    } else if (step === 'primary' && primaryGroup) {
      setStep('confirmation');
    }
  };

  const handleBack = () => {
    if (step === 'primary') {
      setStep('selection');
    } else if (step === 'confirmation') {
      setStep('primary');
    }
  };

  const handleComplete = () => {
    if (selectedGroups.length > 0 && primaryGroup) {
      onComplete(selectedGroups, primaryGroup);
    }
  };

  const selectedGroupsData = USER_GROUPS.filter(group => selectedGroups.includes(group.id));
  const primaryGroupData = USER_GROUPS.find(group => group.id === primaryGroup);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {existingProfile?.onboardingCompleted ? 'Update Your Wellness Groups' : 'Personalize Your Wellness Journey'}
          </h1>
          <p className="text-white/80 text-lg">
            {step === 'selection' && 'Select all groups that apply to you'}
            {step === 'primary' && 'Choose your primary group for personalized content'}
            {step === 'confirmation' && 'Review your selections'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step === 'selection' ? 'text-white' : 'text-white/60'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === 'selection' ? 'border-white bg-white/20' : 'border-white/60'
              }`}>
                1
              </div>
              <span className="ml-2">Select Groups</span>
            </div>
            <ArrowRight className="w-4 h-4 text-white/60" />
            <div className={`flex items-center ${step === 'primary' ? 'text-white' : 'text-white/60'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === 'primary' ? 'border-white bg-white/20' : 
                step === 'confirmation' ? 'border-green-400 bg-green-400/20' : 'border-white/60'
              }`}>
                {step === 'confirmation' ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <span className="ml-2">Primary Group</span>
            </div>
            <ArrowRight className="w-4 h-4 text-white/60" />
            <div className={`flex items-center ${step === 'confirmation' ? 'text-white' : 'text-white/60'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === 'confirmation' ? 'border-white bg-white/20' : 'border-white/60'
              }`}>
                3
              </div>
              <span className="ml-2">Confirm</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 'selection' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {USER_GROUPS.map((group) => (
                <GroupSelectionCard
                  key={group.id}
                  group={group}
                  isSelected={selectedGroups.includes(group.id)}
                  onSelect={handleGroupToggle}
                />
              ))}
            </div>
            
            {selectedGroups.length > 0 && (
              <div className="text-center">
                <Badge className="mb-4 bg-white/20 text-white">
                  {selectedGroups.length} group(s) selected
                </Badge>
                <div>
                  <Button 
                    onClick={handleNext}
                    className="bg-white/20 hover:bg-white/30 text-white"
                    size="lg"
                  >
                    Continue to Primary Selection
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'primary' && (
          <div>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Choose Your Primary Group
                </CardTitle>
                <CardDescription className="text-white/80">
                  This will be your main group for personalized content and community features
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {selectedGroupsData.map((group) => (
                <div
                  key={group.id}
                  onClick={() => handlePrimarySelection(group.id)}
                  className={`cursor-pointer transition-all duration-200 ${
                    primaryGroup === group.id ? 'transform scale-105' : ''
                  }`}
                >
                  <Card className={`h-full ${
                    primaryGroup === group.id
                      ? 'bg-white/20 border-yellow-400 shadow-lg shadow-yellow-400/20'
                      : 'bg-white/10 border-white/20 hover:bg-white/15'
                  } backdrop-blur-md transition-all duration-200`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-full ${group.color}`}>
                          <span className="text-2xl">{group.icon}</span>
                        </div>
                        {primaryGroup === group.id && (
                          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        )}
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2">
                        {group.displayName}
                      </h3>
                      <p className="text-white/70 text-sm mb-4">
                        {group.description}
                      </p>
                      <Badge className="bg-white/20 text-white text-xs">
                        {group.communityName}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Button 
                onClick={handleBack}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Back
              </Button>
              {primaryGroup && (
                <Button 
                  onClick={handleNext}
                  className="bg-white/20 hover:bg-white/30 text-white"
                  size="lg"
                >
                  Review Selection
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Confirm Your Selections
                </CardTitle>
                <CardDescription className="text-white/80">
                  Review your wellness groups and primary selection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Primary Group */}
                {primaryGroupData && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      Primary Group
                    </h3>
                    <div className="bg-white/10 rounded-lg p-4 flex items-center gap-4">
                      <div className={`p-3 rounded-full ${primaryGroupData.color}`}>
                        <span className="text-2xl">{primaryGroupData.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{primaryGroupData.displayName}</h4>
                        <p className="text-white/70 text-sm">{primaryGroupData.communityName}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other Selected Groups */}
                {selectedGroupsData.filter(g => g.id !== primaryGroup).length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Additional Groups
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedGroupsData
                        .filter(group => group.id !== primaryGroup)
                        .map((group) => (
                          <div key={group.id} className="bg-white/10 rounded-lg p-3 flex items-center gap-2">
                            <span className="text-lg">{group.icon}</span>
                            <span className="text-white text-sm">
                              {group.displayName.replace("I'm a ", "")}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button 
                onClick={handleBack}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Back
              </Button>
              <Button 
                onClick={handleComplete}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                size="lg"
              >
                {existingProfile?.onboardingCompleted ? 'Update Profile' : 'Complete Setup'}
                <Check className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserGroupSelection;
