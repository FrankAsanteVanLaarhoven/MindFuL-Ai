
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { USER_GROUPS } from '../../data/userGroups';
import GroupSelectionCard from './GroupSelectionCard';
import { ChevronRight, Users } from 'lucide-react';

interface UserGroupSelectionProps {
  onComplete: (selectedGroups: string[], primaryGroup: string) => void;
}

const UserGroupSelection: React.FC<UserGroupSelectionProps> = ({ onComplete }) => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [primaryGroup, setPrimaryGroup] = useState<string>('');

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroups(prev => {
      const newSelection = prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId];
      
      // Set primary group to first selected if not set
      if (!primaryGroup && newSelection.length > 0) {
        setPrimaryGroup(newSelection[0]);
      }
      
      // Clear primary if it's deselected
      if (primaryGroup === groupId && !newSelection.includes(groupId)) {
        setPrimaryGroup(newSelection[0] || '');
      }
      
      return newSelection;
    });
  };

  const handlePrimaryGroupChange = (groupId: string) => {
    setPrimaryGroup(groupId);
  };

  const handleContinue = () => {
    if (selectedGroups.length > 0 && primaryGroup) {
      onComplete(selectedGroups, primaryGroup);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 backdrop-blur-[2px]"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-white mr-4" />
              <h1 className="text-4xl font-bold text-white">Choose Your Community</h1>
            </div>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Select the groups that best describe you. We'll personalize your wellness journey 
              with content, exercises, and communities tailored to your unique needs.
            </p>
            <p className="text-sm text-white/60 mt-4">
              You can select multiple groups and change these later in settings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
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
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
              <h3 className="text-white text-lg font-semibold mb-4">Set Your Primary Focus</h3>
              <p className="text-white/80 text-sm mb-4">
                Choose your main focus area. This will determine your default dashboard and primary recommendations.
              </p>
              
              <div className="flex flex-wrap gap-3">
                {selectedGroups.map((groupId) => {
                  const group = USER_GROUPS.find(g => g.id === groupId);
                  if (!group) return null;
                  
                  return (
                    <button
                      key={groupId}
                      onClick={() => handlePrimaryGroupChange(groupId)}
                      className={`
                        px-4 py-2 rounded-full border-2 transition-all duration-200
                        ${primaryGroup === groupId
                          ? 'bg-white text-gray-800 border-white'
                          : 'bg-transparent text-white border-white/40 hover:border-white/60'
                        }
                      `}
                    >
                      {group.icon} {group.displayName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-center">
            <Button
              onClick={handleContinue}
              disabled={selectedGroups.length === 0 || !primaryGroup}
              className="bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-600/90 hover:to-blue-600/90 text-white font-semibold rounded-full px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Your Personalized Experience
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            
            {selectedGroups.length === 0 && (
              <p className="text-white/60 text-sm mt-3">
                Please select at least one group to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGroupSelection;
