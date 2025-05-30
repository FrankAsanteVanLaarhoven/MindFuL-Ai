
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  country: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', country: 'United States' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', country: 'Spain' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', country: 'France' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', country: 'Germany' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', country: 'China' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', country: 'Japan' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', country: 'Saudi Arabia' },
];

const LanguageCard = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  const currentLanguage = languages.find(l => l.code === selectedLanguage);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    
    // Update HTML direction for RTL languages
    if (languageCode === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
          <Globe className="w-5 h-5" />
          Language
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
          <SelectTrigger className="h-10">
            <SelectValue>
              {currentLanguage && (
                <span className="flex items-center gap-2">
                  <span className="text-lg">{currentLanguage.flag}</span>
                  {currentLanguage.nativeName}
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-md border border-white/20 max-h-48">
            {languages.map((language) => (
              <SelectItem key={language.code} value={language.code}>
                <span className="flex items-center gap-2">
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{language.nativeName}</span>
                    <span className="text-xs text-gray-500">{language.country}</span>
                  </div>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {currentLanguage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{currentLanguage.flag}</span>
              <div>
                <div className="font-semibold text-blue-800 text-sm">{currentLanguage.country}</div>
                <div className="text-blue-600 text-xs">{currentLanguage.name}</div>
              </div>
            </div>
            <div className="text-blue-700 text-xs">
              Interface language: {currentLanguage.nativeName}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-400 text-center">
          Select your preferred language
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageCard;
