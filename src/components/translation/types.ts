
export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface TranslationState {
  inputText: string;
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  isTranslating: boolean;
  detectedLanguage: string | null;
}
