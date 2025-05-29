
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

interface BadgeEarnedModalProps {
  badgeName: string;
  onAccept: () => void;
  onDecline: () => void;
  isVisible: boolean;
}

export const BadgeEarnedModal: React.FC<BadgeEarnedModalProps> = ({ 
  badgeName, 
  onAccept, 
  onDecline, 
  isVisible 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <Card className="max-w-sm w-full mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          <CardTitle className="text-xl">🎉 Congratulations!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            You earned the <span className="font-semibold text-purple-600">{badgeName}</span> badge!
          </p>
          <p className="text-center text-gray-600">
            Would you like to display this badge on your profile?
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onDecline}>
              No, thanks
            </Button>
            <Button onClick={onAccept}>
              Yes, show it
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
