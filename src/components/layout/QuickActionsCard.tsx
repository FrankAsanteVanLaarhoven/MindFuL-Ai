
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const QuickActionsCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-800">
          <span className="text-2xl">⚡</span>
          Quick Actions
        </CardTitle>
        <CardDescription>Engage with Mindful AI features designed for everyone.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <p className="text-gray-600 mb-6">
              Ready to explore? Navigate using the menu above to analyze your mood, reflect in your journal, 
              try breathing exercises or chat with our therapy bot. Our platform welcomes people from all 
              backgrounds, cultures, and walks of life.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate('/mood-analysis')}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Start Mood Check
              </Button>
              <Button 
                onClick={() => navigate('/therapy-bot')}
                variant="outline"
                className="border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                Talk to Therapist
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1516302593-94ddf0286df2?w=200&h=150&fit=crop"
              alt="Diverse group meditation"
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
