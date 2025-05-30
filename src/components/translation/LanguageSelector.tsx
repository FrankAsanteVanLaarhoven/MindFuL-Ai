
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { languages } from './constants';

interface LanguageSelectorProps {
  fromLanguage: string;
  toLanguage: string;
  onFromLanguageChange: (value: string) => void;
  onToLanguageChange: (value: string) => void;
  onSwapLanguages: () => void;
}

export const LanguageSelector = ({
  fromLanguage,
  toLanguage,
  onFromLanguageChange,
  onToLanguageChange,
  onSwapLanguages,
}: LanguageSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">From</label>
        <Select value={fromLanguage} onValueChange={onFromLanguageChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-md border border-white/20 max-h-64 z-50">
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.nativeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">To</label>
          <Button
            onClick={onSwapLanguages}
            variant="outline"
            size="sm"
            className="h-6 px-2"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>
        <Select value={toLanguage} onValueChange={onToLanguageChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-md border border-white/20 max-h-64 z-50">
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.nativeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
