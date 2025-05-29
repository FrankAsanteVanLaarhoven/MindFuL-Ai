
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
];

const Localization = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('wellness-app-language');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = async (languageCode: string) => {
    setIsLoading(true);
    console.log('Changing language to:', languageCode);
    
    // Simulate language change processing
    setTimeout(() => {
      setSelectedLanguage(languageCode);
      localStorage.setItem('wellness-app-language', languageCode);
      
      const language = languages.find(l => l.code === languageCode);
      
      toast({
        title: "Language Changed",
        description: `Interface language set to ${language?.name}`,
        duration: 3000,
      });
      
      setIsLoading(false);
      
      // Trigger language change event for other components
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: languageCode } 
      }));
    }, 1000);
  };

  const currentLanguage = languages.find(l => l.code === selectedLanguage);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Globe className="w-5 h-5" />
          Localization
        </CardTitle>
        <CardDescription>
          Change the interface language for better accessibility
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Select Language
          </label>
          <Select 
            value={selectedLanguage} 
            onValueChange={handleLanguageChange}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a language">
                {currentLanguage && (
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {currentLanguage.nativeName} ({currentLanguage.name})
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Current Settings</h3>
          <div className="text-blue-700 text-sm space-y-1">
            <p>• Language: {currentLanguage?.nativeName}</p>
            <p>• Region: Auto-detected</p>
            <p>• Time format: 24-hour</p>
            <p>• Date format: Local preference</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-2 text-sm text-gray-600">Applying language changes...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Localization;
