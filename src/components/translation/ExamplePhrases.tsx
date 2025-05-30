
import React from 'react';
import { Button } from '@/components/ui/button';
import { wellnessExamples } from './constants';

interface ExamplePhrasesProps {
  onUseExample: (example: string) => void;
}

export const ExamplePhrases = ({ onUseExample }: ExamplePhrasesProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Wellness Example Phrases</label>
      <div className="flex flex-wrap gap-2">
        {wellnessExamples.map((example, index) => (
          <Button
            key={index}
            onClick={() => onUseExample(example)}
            variant="outline"
            size="sm"
            className="text-xs h-auto py-1 px-2 whitespace-normal text-left"
          >
            {example.length > 40 ? example.substring(0, 40) + '...' : example}
          </Button>
        ))}
      </div>
    </div>
  );
};
