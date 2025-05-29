
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const QuickActionsCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-teal-800 text-xl sm:text-2xl">
          <span className="text-2xl">⚡</span>
          Quick Actions
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Engage with Mindful AI features designed for everyone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex-1">
            <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
              Ready to explore? Navigate using the menu above to analyze your mood, reflect in your journal, 
              try breathing exercises or chat with our therapy bot. Our platform welcomes people from all 
              backgrounds, cultures, and walks of life.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                onClick={() => navigate('/mood-analysis')}
                className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6"
              >
                Start Mood Check
              </Button>
              <Button 
                onClick={() => navigate('/therapy-bot')}
                variant="outline"
                className="border-teal-600 text-teal-600 hover:bg-teal-50 w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6"
              >
                Talk to Therapist
              </Button>
            </div>
          </div>
          <div className="hidden md:block lg:block">
            <img 
              src="https://images.unsplash.com/photo-1516302593-94ddf0286df2?w=200&h=150&fit=crop"
              alt="Diverse group meditation"
              className="rounded-lg shadow-md w-48 h-36 object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
