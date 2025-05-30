
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import { languages } from './constants';

interface TextInputAreaProps {
  inputText: string;
  detectedLanguage: string | null;
  onInputChange: (value: string) => void;
  onCopy: (text: string) => void;
}

export const TextInputArea = ({
  inputText,
  detectedLanguage,
  onInputChange,
  onCopy,
}: TextInputAreaProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Text to translate</label>
        {detectedLanguage && (
          <Badge variant="outline" className="text-xs">
            Detected: {languages.find(l => l.code === detectedLanguage)?.name}
          </Badge>
        )}
      </div>
      <Textarea
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Enter text to translate..."
        className="min-h-[100px] resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {inputText.length} characters
        </span>
        <Button
          onClick={() => onCopy(inputText)}
          variant="outline"
          size="sm"
          disabled={!inputText}
        >
          <Copy className="w-3 h-3 mr-1" />
          Copy
        </Button>
      </div>
    </div>
  );
};
