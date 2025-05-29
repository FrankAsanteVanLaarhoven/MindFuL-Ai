
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface IcebreakerPromptProps {
  prompt: string;
}

const icebreakerPrompts = [
  "Share a small win from this week!",
  "What's one thing you're grateful for today?",
  "Describe your ideal self-care evening in three words.",
  "What's a helpful coping strategy you've learned recently?",
  "If you could give your past self one piece of advice, what would it be?"
];

export const IcebreakerPrompt: React.FC<IcebreakerPromptProps> = ({ 
  prompt = icebreakerPrompts[Math.floor(Math.random() * icebreakerPrompts.length)]
}) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <p className="text-gray-800 font-medium">{prompt}</p>
            <p className="text-xs text-gray-500">
              💙 Optional: Share if you'd like! No pressure at all.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
