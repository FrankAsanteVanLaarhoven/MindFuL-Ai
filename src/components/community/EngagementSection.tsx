
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeEarnedModal } from './BadgeEarnedModal';
import { EmojiReactionBar } from './EmojiReactionBar';
import { AnonymousLeaderboard } from './AnonymousLeaderboard';
import { IcebreakerPrompt } from './IcebreakerPrompt';
import { Sparkles, Heart } from 'lucide-react';

export const EngagementSection: React.FC = () => {
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [reactions, setReactions] = useState<Record<string, number>>({
    '😊': 12,
    '💪': 8,
    '🙏': 15,
    '🌈': 6,
    '🎉': 3
  });

  const handleReaction = (emoji: string) => {
    setReactions(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }));
  };

  const handleBadgeAccept = () => {
    setShowBadgeModal(false);
    // Here you would typically save the badge to user profile
    console.log('Badge accepted and added to profile');
  };

  const handleBadgeDecline = () => {
    setShowBadgeModal(false);
    console.log('Badge declined');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Community Engagement
        </h2>
        <p className="text-gray-600 mt-2">
          Optional features to enhance your community experience
        </p>
      </div>

      {/* Icebreaker Prompt */}
      <IcebreakerPrompt prompt="What's one thing you're grateful for today?" />

      {/* Sample Post with Reactions */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base">Community Post Example</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-3">
            "Had a tough morning but used the 4-7-8 breathing technique and it really helped me center myself. 
            Grateful for this community! 💙"
          </p>
          <div className="flex items-center justify-between">
            <EmojiReactionBar onReact={handleReaction} reactions={reactions} />
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Heart className="w-4 h-4" />
              <span>{Object.values(reactions).reduce((a, b) => a + b, 0)} reactions</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <AnonymousLeaderboard />

      {/* Badge Demo Button */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-4 text-center">
          <p className="text-gray-700 mb-3">
            Complete activities to earn supportive badges!
          </p>
          <button
            onClick={() => setShowBadgeModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Demo: Earn a Badge
          </button>
        </CardContent>
      </Card>

      {/* Badge Modal */}
      <BadgeEarnedModal
        badgeName="Mindful Breathing Streak"
        onAccept={handleBadgeAccept}
        onDecline={handleBadgeDecline}
        isVisible={showBadgeModal}
      />
    </div>
  );
};
