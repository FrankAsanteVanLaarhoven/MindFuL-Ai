
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';

interface TranslationResultProps {
  translatedText: string;
  onCopy: (text: string) => void;
}

export const TranslationResult = ({ translatedText, onCopy }: TranslationResultProps) => {
  if (!translatedText) return null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Translation</label>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-gray-800 mb-2">{translatedText}</p>
        <Button
          onClick={() => onCopy(translatedText)}
          variant="outline"
          size="sm"
        >
          <Copy className="w-3 h-3 mr-1" />
          Copy Translation
        </Button>
      </div>
    </div>
  );
};
