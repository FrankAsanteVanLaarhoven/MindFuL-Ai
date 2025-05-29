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

interface VoiceToneData {
  tone: 'calm' | 'stressed' | 'excited' | 'sad' | 'neutral';
  confidence: number;
  volume: number;
  pitch: number;
}

interface VoiceSettings {
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

// Enhanced voice mappings with accent preferences
const accentVoiceMapping = {
  african: {
    preferred: ['George', 'Daniel', 'Brian'],
    fallback: ['onwK4e9ZLuTAKqWW03F9', 'JBFqnCBsd6RMkjVDRZzb'],
    speechRate: 0.9,
    speechPitch: 1.1
  },
  asian: {
    preferred: ['Sarah', 'Jessica', 'Lily'],
    fallback: ['EXAVITQu4vr4xnSDxMaL', 'cgSgspJ2msm6clMCkdW9'],
    speechRate: 0.95,
    speechPitch: 1.2
  },
  indian: {
    preferred: ['Aria', 'Sarah', 'Daniel'],
    fallback: ['9BWtsMINqrJLrRacOk9x', 'EXAVITQu4vr4xnSDxMaL'],
    speechRate: 0.9,
    speechPitch: 1.0
  },
  chinese: {
    preferred: ['Jessica', 'Eric', 'Alice'],
    fallback: ['cgSgspJ2msm6clMCkdW9', 'cjVigY5qzO86Huf0OWal'],
    speechRate: 0.95,
    speechPitch: 1.15
  },
  european: {
    preferred: ['Charlotte', 'Will', 'Laura'],
    fallback: ['XB0fDUnXU5powFXDhCwa', 'bIHbv24MWmeRgasZH58o'],
    speechRate: 1.0,
    speechPitch: 1.0
  },
  mexican: {
    preferred: ['Laura', 'Charlie', 'Daniel'],
    fallback: ['FGY2WhTYpPnrIDTdsKH5', 'IKne3meq5aSn9XLyUdCD'],
    speechRate: 0.9,
    speechPitch: 0.95
  },
  jamaican: {
    preferred: ['River', 'George', 'Brian'],
    fallback: ['SAz9YHcvj6GT2YYXdXww', 'JBFqnCBsd6RMkjVDRZzb'],
    speechRate: 0.85,
    speechPitch: 1.1
  },
  moroccan: {
    preferred: ['Aria', 'Daniel', 'Sarah'],
    fallback: ['9BWtsMINqrJLrRacOk9x', 'onwK4e9ZLuTAKqWW03F9'],
    speechRate: 0.9,
    speechPitch: 1.05
  },
  spanish: {
    preferred: ['Laura', 'Charlie', 'Aria'],
    fallback: ['FGY2WhTYpPnrIDTdsKH5', 'IKne3meq5aSn9XLyUdCD'],
    speechRate: 0.95,
    speechPitch: 0.9
  },
  italian: {
    preferred: ['Charlotte', 'Will', 'Laura'],
    fallback: ['XB0fDUnXU5powFXDhCwa', 'bIHbv24MWmeRgasZH58o'],
    speechRate: 1.05,
    speechPitch: 1.1
  },
  ethiopian: {
    preferred: ['George', 'Aria', 'Daniel'],
    fallback: ['JBFqnCBsd6RMkjVDRZzb', '9BWtsMINqrJLrRacOk9x'],
    speechRate: 0.9,
    speechPitch: 1.0
  },
  mixed: {
    preferred: ['River', 'Alex', 'Taylor'],
    fallback: ['SAz9YHcvj6GT2YYXdXww', 'EXAVITQu4vr4xnSDxMaL'],
    speechRate: 1.0,
    speechPitch: 1.0
  }
};

// Accent-specific speech patterns and modifications
const accentModifications = {
  african: {
    emphasis: ['very', 'really', 'indeed'],
    phrases: ['my child', 'you know', 'let me tell you'],
    intonation: 'rising'
  },
  jamaican: {
    emphasis: ['ya know', 'seen', 'bredrin'],
    phrases: ['big up yourself', 'easy nuh', 'every ting cool'],
    intonation: 'rhythmic'
  },
  indian: {
    emphasis: ['actually', 'definitely', 'absolutely'],
    phrases: ['isn\'t it', 'no problem', 'very good'],
    intonation: 'melodic'
  },
  mexican: {
    emphasis: ['¡Órale!', 'muy bien', 'claro que sí'],
    phrases: ['mi amor', 'no te preocupes', 'está bien'],
    intonation: 'warm'
  },
  italian: {
    emphasis: ['Madonna mia', 'bene bene', 'perfetto'],
    phrases: ['caro mio', 'non ti preoccupare', 'va tutto bene'],
    intonation: 'expressive'
  }
};

export const useVoiceInteraction = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceTone, setVoiceTone] = useState<VoiceToneData>({
    tone: 'neutral',
    confidence: 0,
    volume: 0,
    pitch: 0
  });
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: false,
    voiceOutput: false,
    voiceInput: false,
    voiceSpeed: 1,
    voicePitch: 1,
    selectedVoice: '',
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

  // Initialize audio context and get permission
  const initAudioContext = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasAudioPermission(true);
      
      // Initialize audio context for tone analysis
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      // Clean up stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Audio permission denied:', error);
      setHasAudioPermission(false);
    }
  }, []);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      if (voices.length > 0 && !voiceSettings.selectedVoice) {
        setVoiceSettings(prev => ({ ...prev, selectedVoice: voices[0].name }));
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [voiceSettings.selectedVoice]);

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
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (availableVoices.length > 0 && voiceSettings.selectedVoice) {
        const selectedVoice = availableVoices.find(voice => voice.name === voiceSettings.selectedVoice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
      
      utterance.rate = voiceSettings.voiceSpeed;
      utterance.pitch = voiceSettings.voicePitch;
      utterance.volume = 1;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  }, [voiceSettings, availableVoices]);

  // Enhanced speak function with accent support
  const speakWithAccent = useCallback((text: string, ethnicity?: string, personality?: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      let modifiedText = text;
      
      // Apply accent-specific modifications
      if (ethnicity && accentModifications[ethnicity as keyof typeof accentModifications]) {
        const accent = accentModifications[ethnicity as keyof typeof accentModifications];
        
        // Add occasional accent-specific phrases for authenticity
        if (Math.random() > 0.7) {
          const phrases = accent.phrases;
          const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
          modifiedText = `${randomPhrase}, ${text.toLowerCase()}`;
        }
      }
      
      const utterance = new SpeechSynthesisUtterance(modifiedText);
      
      // Set accent-specific voice preferences
      if (ethnicity && accentVoiceMapping[ethnicity as keyof typeof accentVoiceMapping]) {
        const accentConfig = accentVoiceMapping[ethnicity as keyof typeof accentVoiceMapping];
        
        // Try to find preferred voice for this accent
        const preferredVoice = availableVoices.find(voice => 
          accentConfig.preferred.some(name => voice.name.toLowerCase().includes(name.toLowerCase()))
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        // Apply accent-specific speech characteristics
        utterance.rate = accentConfig.speechRate * voiceSettings.voiceSpeed;
        utterance.pitch = accentConfig.speechPitch * voiceSettings.voicePitch;
      } else {
        // Fallback to regular voice settings
        if (availableVoices.length > 0 && voiceSettings.selectedVoice) {
          const selectedVoice = availableVoices.find(voice => voice.name === voiceSettings.selectedVoice);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        }
        utterance.rate = voiceSettings.voiceSpeed;
        utterance.pitch = voiceSettings.voicePitch;
      }
      
      utterance.volume = 1;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  }, [voiceSettings, availableVoices]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

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
    isSpeaking,
    transcript,
    voiceTone,
    voiceSettings,
    hasAudioPermission,
    availableVoices,
    startListening,
    stopListening,
    speak,
    speakWithAccent, // New function for accent-aware speech
    stopSpeaking,
    clearTranscript,
    updateVoiceSettings,
    setVoiceSettings,
    initAudioContext,
    executeVoiceCommand,
    setTranscript
  };
};
