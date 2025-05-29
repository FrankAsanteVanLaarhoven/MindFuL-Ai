
export interface VoiceToneData {
  tone: 'calm' | 'stressed' | 'excited' | 'sad' | 'neutral';
  confidence: number;
  volume: number;
  pitch: number;
}

export interface VoiceSettings {
  enabled: boolean;
  voiceOutput: boolean;
  voiceInput: boolean;
  voiceSpeed: number;
  voicePitch: number;
  selectedVoice: string;
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  voiceIndex: number;
  autoSend: boolean;
  continuousListening: boolean;
}

// Add type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onstart: (() => void) | null;
    onend: (() => void) | null;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    readonly isFinal: boolean;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  const SpeechRecognition: {
    new (): SpeechRecognition;
  };
}
