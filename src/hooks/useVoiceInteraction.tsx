
import { useState, useRef, useCallback, useEffect } from 'react';

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
    isFinal: boolean;
  }

  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }

  const SpeechRecognition: {
    new (): SpeechRecognition;
  };
}

interface VoiceToneData {
  tone: 'calm' | 'stressed' | 'excited' | 'sad' | 'neutral';
  confidence: number;
  volume: number;
  pitch: number;
}

interface VoiceSettings {
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  voiceIndex: number;
  autoSend: boolean;
  continuousListening: boolean;
}

export const useVoiceInteraction = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceTone, setVoiceTone] = useState<VoiceToneData>({
    tone: 'neutral',
    confidence: 0,
    volume: 0,
    pitch: 0
  });
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    speechRate: 1,
    speechPitch: 1,
    speechVolume: 1,
    voiceIndex: 0,
    autoSend: true,
    continuousListening: false
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Initialize speech recognition
  const initializeRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return null;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return null;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = voiceSettings.continuousListening;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        analyzeVoiceTone(finalTranscript);
      } else {
        setTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  }, [voiceSettings.continuousListening]);

  // Analyze voice tone (mock implementation)
  const analyzeVoiceTone = useCallback((text: string) => {
    // Simple mock tone analysis based on text content
    const lowerText = text.toLowerCase();
    let tone: VoiceToneData['tone'] = 'neutral';
    let confidence = 0.7;

    if (lowerText.includes('stressed') || lowerText.includes('anxious') || lowerText.includes('worried')) {
      tone = 'stressed';
      confidence = 0.8;
    } else if (lowerText.includes('calm') || lowerText.includes('peaceful') || lowerText.includes('relaxed')) {
      tone = 'calm';
      confidence = 0.8;
    } else if (lowerText.includes('excited') || lowerText.includes('happy') || lowerText.includes('great')) {
      tone = 'excited';
      confidence = 0.75;
    } else if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('depressed')) {
      tone = 'sad';
      confidence = 0.7;
    }

    setVoiceTone({
      tone,
      confidence,
      volume: Math.random() * 0.5 + 0.3, // Mock volume
      pitch: Math.random() * 2 + 1 // Mock pitch
    });
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    const recognition = initializeRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    setIsListening(true);
    setTranscript('');
    recognition.start();
  }, [initializeRecognition]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // Text to speech
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = speechSynthesis.getVoices();
      
      if (voices.length > 0) {
        utterance.voice = voices[Math.min(voiceSettings.voiceIndex, voices.length - 1)];
      }
      
      utterance.rate = voiceSettings.speechRate;
      utterance.pitch = voiceSettings.speechPitch;
      utterance.volume = voiceSettings.speechVolume;
      
      speechSynthesis.speak(utterance);
    }
  }, [voiceSettings]);

  // Update voice settings
  const updateVoiceSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setVoiceSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Voice commands
  const executeVoiceCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('stop listening')) {
      stopListening();
      return true;
    } else if (lowerCommand.includes('start listening')) {
      startListening();
      return true;
    } else if (lowerCommand.includes('clear')) {
      setTranscript('');
      return true;
    }
    
    return false;
  }, [startListening, stopListening]);

  return {
    isListening,
    transcript,
    voiceTone,
    voiceSettings,
    startListening,
    stopListening,
    speak,
    updateVoiceSettings,
    executeVoiceCommand,
    setTranscript
  };
};
