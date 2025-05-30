
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Languages, RefreshCw } from 'lucide-react';
import { LanguageSelector } from './translation/LanguageSelector';
import { TextInputArea } from './translation/TextInputArea';
import { TranslationResult } from './translation/TranslationResult';
import { ExamplePhrases } from './translation/ExamplePhrases';
import { TranslationTips } from './translation/TranslationTips';
import { useTranslation } from './translation/useTranslation';

const InstantTranslation = () => {
  const {
    state,
    updateState,
    handleTranslate,
    handleCopy,
    swapLanguages,
    useExample,
  } = useTranslation();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Languages className="w-5 h-5" />
          Instant Translation
        </CardTitle>
        <CardDescription>
          Translate wellness and mental health text instantly between languages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LanguageSelector
          fromLanguage={state.fromLanguage}
          toLanguage={state.toLanguage}
          onFromLanguageChange={(value) => updateState({ fromLanguage: value })}
          onToLanguageChange={(value) => updateState({ toLanguage: value })}
          onSwapLanguages={swapLanguages}
        />

        <TextInputArea
          inputText={state.inputText}
          detectedLanguage={state.detectedLanguage}
          onInputChange={(value) => updateState({ inputText: value })}
          onCopy={handleCopy}
        />

        <Button 
          onClick={handleTranslate}
          disabled={state.isTranslating || !state.inputText.trim()}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {state.isTranslating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <Languages className="w-4 h-4 mr-2" />
              Translate
            </>
          )}
        </Button>

        <TranslationResult
          translatedText={state.translatedText}
          onCopy={handleCopy}
        />

        <ExamplePhrases onUseExample={useExample} />

        <TranslationTips />
      </CardContent>
    </Card>
  );
};

export default InstantTranslation;
