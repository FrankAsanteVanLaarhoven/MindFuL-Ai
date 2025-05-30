
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TranslationState } from './types';
import { simulateTranslation, detectLanguage } from './utils';
import { languages } from './constants';

export const useTranslation = () => {
  const [state, setState] = useState<TranslationState>({
    inputText: '',
    translatedText: '',
    fromLanguage: 'en',
    toLanguage: 'es',
    isTranslating: false,
    detectedLanguage: null,
  });
  
  const { toast } = useToast();

  const updateState = (updates: Partial<TranslationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleTranslate = async () => {
    if (!state.inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text to translate",
        variant: "destructive",
      });
      return;
    }

    updateState({ isTranslating: true });
    console.log('Translating:', state.inputText);

    // Detect language
    const detected = detectLanguage(state.inputText);
    updateState({ detectedLanguage: detected });

    // Simulate translation delay
    setTimeout(() => {
      const translation = simulateTranslation(state.inputText, state.fromLanguage, state.toLanguage);
      updateState({ 
        translatedText: translation, 
        isTranslating: false 
      });

      toast({
        title: "Translation Complete",
        description: `Translated from ${languages.find(l => l.code === state.fromLanguage)?.name} to ${languages.find(l => l.code === state.toLanguage)?.name}`,
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

  const swapLanguages = () => {
    const tempFrom = state.fromLanguage;
    updateState({
      fromLanguage: state.toLanguage,
      toLanguage: tempFrom,
      inputText: state.translatedText || state.inputText,
      translatedText: state.inputText,
    });
  };

  const useExample = (example: string) => {
    updateState({ inputText: example });
  };

  return {
    state,
    updateState,
    handleTranslate,
    handleCopy,
    swapLanguages,
    useExample,
  };
};
