
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Translate, RefreshCw, Copy } from 'lucide-react';
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
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

const wellnessExamples = [
  "I am feeling anxious today and need some support",
  "Thank you for being here for me during difficult times",
  "I practice mindfulness meditation every morning",
  "How are you taking care of your mental health?",
  "Remember to breathe deeply and stay present",
];

const InstantTranslation = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLanguage, setFromLanguage] = useState('en');
  const [toLanguage, setToLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const { toast } = useToast();

  const simulateTranslation = (text: string, from: string, to: string): string => {
    const translations: Record<string, Record<string, string>> = {
      'en': {
        'es': 'Hola, ¿cómo estás? Me siento bien hoy.',
        'fr': 'Bonjour, comment allez-vous? Je me sens bien aujourd\'hui.',
        'de': 'Hallo, wie geht es dir? Ich fühle mich heute gut.',
        'ja': 'こんにちは、元気ですか？今日は気分がいいです。',
        'zh': '你好，你好吗？我今天感觉很好。',
      },
      'es': {
        'en': 'Hello, how are you? I feel good today.',
        'fr': 'Bonjour, comment allez-vous? Je me sens bien aujourd\'hui.',
      },
    };

    if (translations[from] && translations[from][to]) {
      return translations[from][to];
    }

    // Fallback simulation
    const wellnessTerms: Record<string, string> = {
      'anxiety': 'ansiedad',
      'stress': 'estrés',
      'mindfulness': 'atención plena',
      'meditation': 'meditación',
      'wellness': 'bienestar',
      'mental health': 'salud mental',
      'breathing': 'respiración',
      'support': 'apoyo',
    };

    let result = text;
    Object.entries(wellnessTerms).forEach(([eng, spa]) => {
      result = result.replace(new RegExp(eng, 'gi'), spa);
    });

    return result || `[Translated from ${from} to ${to}] ${text}`;
  };

  const detectLanguage = (text: string): string => {
    if (/[а-яё]/i.test(text)) return 'ru';
    if (/[あ-ん]|[ア-ン]|[一-龯]/.test(text)) return 'ja';
    if (/[가-힣]/.test(text)) return 'ko';
    if (/[一-龯]/.test(text)) return 'zh';
    if (/[àáâãäå]|[èéêë]|[ìíîï]|[òóôõö]|[ùúûü]|[ýÿ]|[ñ]|[ç]/i.test(text)) {
      if (/[ñ]/.test(text)) return 'es';
      if (/[ç]/.test(text)) return 'fr';
      return 'fr';
    }
    if (/[äöüß]/i.test(text)) return 'de';
    if (/[àèìòù]/i.test(text)) return 'it';
    if (/[ãõ]/i.test(text)) return 'pt';
    return 'en';
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text to translate",
        variant: "destructive",
      });
      return;
    }

    setIsTranslating(true);
    console.log('Translating:', inputText);

    // Detect language
    const detected = detectLanguage(inputText);
    setDetectedLanguage(detected);

    // Simulate translation delay
    setTimeout(() => {
      const translation = simulateTranslation(inputText, fromLanguage, toLanguage);
      setTranslatedText(translation);
      setIsTranslating(false);

      toast({
        title: "Translation Complete",
        description: `Translated from ${languages.find(l => l.code === fromLanguage)?.name} to ${languages.find(l => l.code === toLanguage)?.name}`,
        duration: 3000,
      });
    }, 1500);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Text copied to clipboard",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy text",
        variant: "destructive",
      });
    }
  };

  const useExample = (example: string) => {
    setInputText(example);
  };

  const swapLanguages = () => {
    const tempFrom = fromLanguage;
    setFromLanguage(toLanguage);
    setToLanguage(tempFrom);
    
    if (translatedText) {
      setInputText(translatedText);
      setTranslatedText(inputText);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Translate className="w-5 h-5" />
          Instant Translation
        </CardTitle>
        <CardDescription>
          Translate wellness and mental health text instantly between languages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Language Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">From</label>
            <Select value={fromLanguage} onValueChange={setFromLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
                onClick={swapLanguages}
                variant="outline"
                size="sm"
                className="h-6 px-2"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
            <Select value={toLanguage} onValueChange={setToLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Input Text */}
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
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to translate..."
            className="min-h-[100px] resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {inputText.length} characters
            </span>
            <Button
              onClick={() => handleCopy(inputText)}
              variant="outline"
              size="sm"
              disabled={!inputText}
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
          </div>
        </div>

        {/* Translate Button */}
        <Button 
          onClick={handleTranslate}
          disabled={isTranslating || !inputText.trim()}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isTranslating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <Translate className="w-4 h-4 mr-2" />
              Translate
            </>
          )}
        </Button>

        {/* Translation Result */}
        {translatedText && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Translation</label>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-gray-800 mb-2">{translatedText}</p>
              <Button
                onClick={() => handleCopy(translatedText)}
                variant="outline"
                size="sm"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy Translation
              </Button>
            </div>
          </div>
        )}

        {/* Example Phrases */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Wellness Example Phrases</label>
          <div className="flex flex-wrap gap-2">
            {wellnessExamples.map((example, index) => (
              <Button
                key={index}
                onClick={() => useExample(example)}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-1 px-2 whitespace-normal text-left"
              >
                {example.length > 40 ? example.substring(0, 40) + '...' : example}
              </Button>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Translation Tips</h4>
          <div className="text-green-700 text-sm space-y-1">
            <p>• Wellness terms may have cultural nuances - consider context</p>
            <p>• Formal vs informal language matters for therapy conversations</p>
            <p>• Mental health terminology should be verified with professionals</p>
            <p>• Use translations as a starting point for cross-cultural support</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstantTranslation;
