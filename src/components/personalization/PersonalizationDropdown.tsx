
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Settings, ChevronDown, Star, UserCircle, Eye } from 'lucide-react';
import { UserProfile } from '../../types/UserSegmentation';
import { USER_GROUPS } from '../../data/userGroups';
import UserGroupSelection from '../onboarding/UserGroupSelection';
import PersonalizedDashboard from './PersonalizedDashboard';

interface PersonalizationDropdownProps {
  userProfile?: UserProfile;
  onGroupSelectionComplete: (selectedGroups: string[], primaryGroup: string) => void;
}

const PersonalizationDropdown: React.FC<PersonalizationDropdownProps> = ({ 
  userProfile, 
  onGroupSelectionComplete 
}) => {
  const [showGroupSelection, setShowGroupSelection] = useState(false);
  const [showPersonalizedDashboard, setShowPersonalizedDashboard] = useState(false);

  const handleGroupSelection = (selectedGroups: string[], primaryGroup: string) => {
    onGroupSelectionComplete(selectedGroups, primaryGroup);
    setShowGroupSelection(false);
  };

  const primaryGroup = userProfile ? USER_GROUPS.find(g => g.id === userProfile.primaryGroup) : null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Personalization
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="bg-white/95 backdrop-blur-md border border-white/20 shadow-lg w-64"
          align="center"
        >
          <DropdownMenuLabel className="flex items-center gap-2 text-gray-800">
            <Settings className="w-4 h-4" />
            Wellness Personalization
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {userProfile && userProfile.onboardingCompleted ? (
            <>
              <div className="px-2 py-2">
                <div className="text-sm text-gray-600 mb-2">Current Profile:</div>
                {primaryGroup && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{primaryGroup.icon}</span>
                    <span className="text-sm font-medium text-gray-800">
                      {primaryGroup.displayName.replace("I'm a ", "")}
                    </span>
                    <Star className="w-3 h-3 text-yellow-500" />
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  {userProfile.selectedGroups.length} group(s) selected
                </div>
              </div>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer hover:bg-blue-50"
                onClick={() => setShowPersonalizedDashboard(true)}
              >
                <Eye className="w-4 h-4 text-blue-500" />
                View My Dashboard
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer hover:bg-blue-50"
                onClick={() => setShowGroupSelection(true)}
              >
                <Settings className="w-4 h-4 text-gray-500" />
                Update My Groups
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <div className="px-2 py-2">
                <div className="text-sm text-gray-600 mb-2">
                  Get personalized wellness content for your lifestyle
                </div>
              </div>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer hover:bg-blue-50"
                onClick={() => setShowGroupSelection(true)}
              >
                <UserCircle className="w-4 h-4 text-blue-500" />
                Set Up My Profile
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator />
          <div className="px-2 py-2">
            <div className="text-xs text-gray-500">
              Available groups: Carers, Teachers, Sports Fans, Healthcare Workers, Students, Parents, Professionals, Seniors, Teens, Entrepreneurs, Artists, Faith-Based, LGBTQ+, Military/Veterans, First Responders, and more!
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Group Selection Dialog */}
      <Dialog open={showGroupSelection} onOpenChange={setShowGroupSelection}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {userProfile?.onboardingCompleted ? 'Update Your Groups' : 'Choose Your Wellness Groups'}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[80vh]">
            <UserGroupSelection 
              onComplete={handleGroupSelection}
              existingProfile={userProfile}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Personalized Dashboard Dialog */}
      {userProfile && (
        <Dialog open={showPersonalizedDashboard} onOpenChange={setShowPersonalizedDashboard}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0">
            <div className="overflow-y-auto max-h-[95vh]">
              <PersonalizedDashboard userProfile={userProfile} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PersonalizationDropdown;
