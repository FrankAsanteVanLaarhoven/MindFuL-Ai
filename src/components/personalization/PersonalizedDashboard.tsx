
import React from 'react';
import { UserProfile } from '../../types/UserSegmentation';
import { USER_GROUPS } from '../../data/userGroups';
import PersonalizedContent from './PersonalizedContent';
import CommunitySection from './CommunitySection';
import { Users, Star, Award } from 'lucide-react';

interface PersonalizedDashboardProps {
  userProfile: UserProfile;
}

const PersonalizedDashboard: React.FC<PersonalizedDashboardProps> = ({ userProfile }) => {
  const primaryGroup = USER_GROUPS.find(g => g.id === userProfile.primaryGroup);
  const selectedGroups = USER_GROUPS.filter(g => userProfile.selectedGroups.includes(g.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Welcome Header */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {userProfile.name}!
              </h1>
              <p className="text-white/80">
                Your personalized wellness journey continues
              </p>
            </div>
            {primaryGroup && (
              <div className={`${primaryGroup.color} rounded-full p-4`}>
                <span className="text-4xl">{primaryGroup.icon}</span>
              </div>
            )}
          </div>

          {/* User Groups Display */}
          <div className="flex flex-wrap gap-3 mb-6">
            {selectedGroups.map((group) => (
              <div
                key={group.id}
                className={`${group.color} px-4 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2`}
              >
                <span>{group.icon}</span>
                {group.displayName.replace("I'm a ", "")}
                {group.id === userProfile.primaryGroup && (
                  <Star className="w-4 h-4" />
                )}
              </div>
            ))}
          </div>

          {primaryGroup && (
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Your Primary Community: {primaryGroup.communityName}
              </h3>
              <p className="text-white/80 text-sm">
                {primaryGroup.description}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <PersonalizedContent userProfile={userProfile} />
          </div>

          {/* Community Sidebar */}
          <div className="lg:col-span-1">
            <CommunitySection userProfile={userProfile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedDashboard;
