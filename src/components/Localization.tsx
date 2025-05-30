
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language || 'en');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = async (languageCode: string) => {
    setIsLoading(true);
    console.log('Changing language to:', languageCode);
    
    try {
      await i18n.changeLanguage(languageCode);
      setSelectedLanguage(languageCode);
      
      const language = languages.find(l => l.code === languageCode);
      
      toast({
        title: t('global.languageChanged'),
        description: `${t('global.interfaceLanguage')} ${language?.name}`,
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
          {t('localization.title')}
        </CardTitle>
        <CardDescription className="text-sm">
          {t('localization.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('localization.selectLanguage')}
          </label>
          <Select 
            value={selectedLanguage} 
            onValueChange={handleLanguageChange}
            disabled={isLoading}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder={t('global.selectLanguage')}>
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
          <h3 className="font-semibold text-blue-800 mb-2 text-sm">{t('localization.currentSettings')}</h3>
          <div className="text-blue-700 text-xs space-y-1">
            <p>• {t('localization.language')}: {currentLanguage?.nativeName}</p>
            <p>• {t('localization.region')}: {t('localization.autoDetected')}</p>
            <p>• {t('localization.timeFormat')}: {t('localization.24hour')}</p>
            <p>• {t('localization.dateFormat')}: {t('localization.localPreference')}</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="ml-2 text-xs text-gray-600">{t('global.applyingChanges')}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Localization;
