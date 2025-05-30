import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { UserProfile } from '../../types/UserSegmentation';
import { USER_GROUPS } from '../../data/userGroups';
import { MessageCircle, Users, Heart, Award } from 'lucide-react';

interface CommunitySectionProps {
  userProfile: UserProfile;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({ userProfile }) => {
  const primaryGroup = USER_GROUPS.find(g => g.id === userProfile.primaryGroup);
  const selectedGroups = USER_GROUPS.filter(g => userProfile.selectedGroups.includes(g.id));

  return (
    <div className="space-y-6">
      {/* Primary Community */}
      {primaryGroup && (
        <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Users className="w-5 h-5 text-blue-600" />
              {primaryGroup.communityName}
            </CardTitle>
            <CardDescription>
              Your primary community space
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Latest Discussion</span>
              </div>
              <p className="text-sm text-blue-700">
                "Sharing my daily routine that's been helping with stress management..."
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-blue-600">
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  24 likes
                </span>
                <span>8 replies</span>
                <span>2 hours ago</span>
              </div>
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Join Conversation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Community Stats */}
      <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <Award className="w-5 h-5 text-yellow-600" />
            Your Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">12</div>
              <div className="text-xs text-yellow-600">Days Active</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">48</div>
              <div className="text-xs text-green-600">People Helped</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">3</div>
              <div className="text-xs text-purple-600">Badges Earned</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">156</div>
              <div className="text-xs text-blue-600">Mindful Minutes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Communities */}
      {selectedGroups.length > 1 && (
        <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Other Communities</CardTitle>
            <CardDescription>
              Explore your other group connections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedGroups
                .filter(group => group.id !== userProfile.primaryGroup)
                .map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{group.icon}</span>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">
                          {group.communityName}
                        </div>
                        <div className="text-xs text-gray-600">
                          127 active members
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Visit
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mentorship */}
      <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-800">Mentorship</CardTitle>
          <CardDescription>
            Connect with experienced community members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="font-medium text-orange-800 text-sm mb-1">
                Sarah M. - Senior {primaryGroup?.displayName.replace("I'm a ", "") || 'Member'}
              </div>
              <p className="text-xs text-orange-700 mb-2">
                "Available for 1-on-1 guidance and support"
              </p>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-xs">
                Connect
              </Button>
            </div>
            
            <Button variant="outline" className="w-full">
              Browse All Mentors
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunitySection;
