
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
];

const Localization = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLanguageChange = async (languageCode: string) => {
    setIsLoading(true);
    console.log('Changing language to:', languageCode);
    
    try {
      setSelectedLanguage(languageCode);
      
      const language = languages.find(l => l.code === languageCode);
      
      toast({
        title: 'Language Changed',
        description: `Interface language set to ${language?.name}`,
        duration: 3000,
      });
      
      // Update HTML direction for RTL languages
      if (languageCode === 'ar') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
      
    } catch (error) {
      console.error('Language change failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentLanguage = languages.find(l => l.code === selectedLanguage);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg h-full" id="localization-widget">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
          <Globe className="w-5 h-5" />
          Localization
        </CardTitle>
        <CardDescription className="text-sm">
          Change the interface language for better accessibility
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Select Language
          </label>
          <Select 
            value={selectedLanguage} 
            onValueChange={handleLanguageChange}
            disabled={isLoading}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select Language">
                {currentLanguage && (
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {currentLanguage.nativeName}
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-md border border-white/20">
              {languages.map((language) => (
                <SelectItem key={language.code} value={language.code}>
                  <span className="flex items-center gap-2">
                    {language.nativeName} ({language.name})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h3 className="font-semibold text-blue-800 mb-2 text-sm">Current Settings</h3>
          <div className="text-blue-700 text-xs space-y-1">
            <p>• Language: {currentLanguage?.nativeName}</p>
            <p>• Region: Auto-detected</p>
            <p>• Time format: 24-hour</p>
            <p>• Date format: Local preference</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-2 text-xs text-gray-600">Applying changes...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Localization;
