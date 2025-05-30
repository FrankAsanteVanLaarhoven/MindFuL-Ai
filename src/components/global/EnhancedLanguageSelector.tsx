
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

const EnhancedLanguageSelector: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>('en');
  const { toast } = useToast();

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    const language = supportedLanguages.find(l => l.code === languageCode);
    
    // Update HTML direction for RTL languages
    if (languageCode === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    
    toast({
      title: 'Language Changed',
      description: `Interface language set to ${language?.nativeName}`,
      duration: 3000,
    });
  };

  const currentLanguage = supportedLanguages.find(l => l.code === selectedLanguage);

  return (
    <Card className="bg-white/95 backdrop-blur-md border border-white/20 shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-800 text-xl">
          <Languages className="w-6 h-6" />
          Language & Region
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Select Language
          </label>
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-12 bg-white/80">
              <SelectValue>
                {currentLanguage && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{currentLanguage.flag}</span>
                    <div className="text-left">
                      <div className="font-medium">{currentLanguage.nativeName}</div>
                      <div className="text-xs text-gray-500">{currentLanguage.name}</div>
                    </div>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-md border border-white/20">
              {supportedLanguages.map((language) => (
                <SelectItem key={language.code} value={language.code}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{language.flag}</span>
                    <div>
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs text-gray-500">{language.name}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-lg p-3">
          <h3 className="font-semibold text-blue-800 mb-2 text-sm flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Current Settings
          </h3>
          <div className="text-blue-700 text-xs space-y-1">
            <p>• Language: {currentLanguage?.nativeName}</p>
            <p>• Region: Auto-detected</p>
            <p>• Direction: {selectedLanguage === 'ar' ? 'Right-to-Left' : 'Left-to-Right'}</p>
            <p>• Currency: Local preference</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedLanguageSelector;
