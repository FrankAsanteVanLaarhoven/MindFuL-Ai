
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Globe, Settings, Search } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  country: string;
  region: string;
  speakers: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', country: 'United States', region: 'Americas', speakers: '1.5B' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', country: 'Spain', region: 'Europe', speakers: '500M' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', country: 'France', region: 'Europe', speakers: '280M' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', country: 'Germany', region: 'Europe', speakers: '100M' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', country: 'China', region: 'Asia', speakers: '1.1B' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', country: 'Japan', region: 'Asia', speakers: '125M' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', country: 'Saudi Arabia', region: 'Middle East', speakers: '400M' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', country: 'Brazil', region: 'Americas', speakers: '260M' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', country: 'Russia', region: 'Europe/Asia', speakers: '260M' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', country: 'India', region: 'Asia', speakers: '600M' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', country: 'Italy', region: 'Europe', speakers: '65M' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', country: 'South Korea', region: 'Asia', speakers: '77M' },
];

const LanguageCard = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteLanguages, setFavoriteLanguages] = useState<string[]>(['en', 'es', 'fr']);

  const currentLanguage = languages.find(l => l.code === selectedLanguage);
  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    
    // Update HTML direction for RTL languages
    if (languageCode === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }

    // Save to localStorage
    localStorage.setItem('preferredLanguage', languageCode);
  };

  const toggleFavorite = (languageCode: string) => {
    setFavoriteLanguages(prev => 
      prev.includes(languageCode) 
        ? prev.filter(code => code !== languageCode)
        : [...prev, languageCode]
    );
  };

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'Europe': return 'bg-blue-100 text-blue-800';
      case 'Asia': return 'bg-green-100 text-green-800';
      case 'Americas': return 'bg-purple-100 text-purple-800';
      case 'Middle East': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-100 backdrop-blur-lg border-2 border-blue-200/50 shadow-2xl h-full overflow-hidden relative">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-green-300 to-teal-300">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-900 text-xl font-bold">
            <Globe className="w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} />
            Language
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-200/50">
                <Settings className="w-4 h-4 text-blue-700" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>Language Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search languages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="max-h-96 overflow-y-auto space-y-2">
                  <Label className="text-sm font-semibold">Available Languages</Label>
                  {filteredLanguages.map((language) => (
                    <div
                      key={language.code}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleLanguageChange(language.code)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{language.flag}</span>
                        <div>
                          <div className="font-medium">{language.nativeName}</div>
                          <div className="text-sm text-gray-500">{language.name} • {language.country}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded ${getRegionColor(language.region)}`}>
                              {language.region}
                            </span>
                            <span className="text-xs text-gray-400">{language.speakers} speakers</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(language.code);
                        }}
                        className={favoriteLanguages.includes(language.code) ? 'text-yellow-500' : 'text-gray-400'}
                      >
                        ⭐
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
          <SelectTrigger className="h-12 bg-white/70 backdrop-blur-sm border-2 border-blue-300/50 shadow-lg hover:bg-white/80 transition-all">
            <SelectValue>
              {currentLanguage && (
                <span className="flex items-center gap-3">
                  <span className="text-2xl">{currentLanguage.flag}</span>
                  <div className="text-left">
                    <div className="font-semibold text-blue-900">{currentLanguage.nativeName}</div>
                    <div className="text-xs text-blue-700">{currentLanguage.name}</div>
                  </div>
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-md border border-white/20 max-h-64 z-50">
            {favoriteLanguages.map((code) => {
              const language = languages.find(l => l.code === code);
              return language ? (
                <SelectItem key={language.code} value={language.code}>
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{language.flag}</span>
                    <div>
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs text-gray-500">{language.country}</div>
                    </div>
                  </span>
                </SelectItem>
              ) : null;
            })}
          </SelectContent>
        </Select>

        {currentLanguage && (
          <div className="bg-white/70 backdrop-blur-sm border-2 border-blue-300/50 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-4xl">{currentLanguage.flag}</span>
              <div className="flex-1">
                <div className="font-bold text-blue-900 text-lg">{currentLanguage.country}</div>
                <div className="text-blue-700 text-sm">{currentLanguage.name} • {currentLanguage.nativeName}</div>
                <span className={`inline-block text-xs px-2 py-1 rounded mt-1 ${getRegionColor(currentLanguage.region)}`}>
                  {currentLanguage.region}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-100/50 rounded-lg p-2">
                <div className="text-blue-600 font-medium">Speakers</div>
                <div className="text-blue-800 font-semibold">{currentLanguage.speakers}</div>
              </div>
              <div className="bg-green-100/50 rounded-lg p-2">
                <div className="text-green-600 font-medium">Status</div>
                <div className="text-green-800 font-semibold">Active</div>
              </div>
            </div>
            
            <div className="mt-3 text-blue-700 text-xs">
              Interface language: {currentLanguage.nativeName}
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-600 text-white px-3 py-1 rounded-full text-xs shadow-lg">
            <Globe className="w-3 h-3" />
            {languages.length} languages available
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageCard;
