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
    speechRate: 0.85,
    speechPitch: 1.1,
    volume: 0.9
  },
  asian: {
    preferred: ['Sarah', 'Jessica', 'Lily'],
    fallback: ['EXAVITQu4vr4xnSDxMaL', 'cgSgspJ2msm6clMCkdW9'],
    speechRate: 0.9,
    speechPitch: 1.2,
    volume: 0.8
  },
  indian: {
    preferred: ['Aria', 'Sarah', 'Daniel'],
    fallback: ['9BWtsMINqrJLrRacOk9x', 'EXAVITQu4vr4xnSDxMaL'],
    speechRate: 0.85,
    speechPitch: 1.0,
    volume: 0.85
  },
  chinese: {
    preferred: ['Jessica', 'Eric', 'Alice'],
    fallback: ['cgSgspJ2msm6clMCkdW9', 'cjVigY5qzO86Huf0OWal'],
    speechRate: 0.9,
    speechPitch: 1.15,
    volume: 0.8
  },
  european: {
    preferred: ['Charlotte', 'Will', 'Laura'],
    fallback: ['XB0fDUnXU5powFXDhCwa', 'bIHbv24MWmeRgasZH58o'],
    speechRate: 1.0,
    speechPitch: 1.0,
    volume: 0.85
  },
  mexican: {
    preferred: ['Laura', 'Charlie', 'Daniel'],
    fallback: ['FGY2WhTYpPnrIDTdsKH5', 'IKne3meq5aSn9XLyUdCD'],
    speechRate: 0.85,
    speechPitch: 0.95,
    volume: 0.9
  },
  jamaican: {
    preferred: ['River', 'George', 'Brian'],
    fallback: ['SAz9YHcvj6GT2YYXdXww', 'JBFqnCBsd6RMkjVDRZzb'],
    speechRate: 0.8,
    speechPitch: 1.1,
    volume: 0.95
  },
  moroccan: {
    preferred: ['Aria', 'Daniel', 'Sarah'],
    fallback: ['9BWtsMINqrJLrRacOk9x', 'onwK4e9ZLuTAKqWW03F9'],
    speechRate: 0.85,
    speechPitch: 1.05,
    volume: 0.85
  },
  spanish: {
    preferred: ['Laura', 'Charlie', 'Aria'],
    fallback: ['FGY2WhTYpPnrIDTdsKH5', 'IKne3meq5aSn9XLyUdCD'],
    speechRate: 0.9,
    speechPitch: 0.9,
    volume: 0.9
  },
  italian: {
    preferred: ['Charlotte', 'Will', 'Laura'],
    fallback: ['XB0fDUnXU5powFXDhCwa', 'bIHbv24MWmeRgasZH58o'],
    speechRate: 1.05,
    speechPitch: 1.1,
    volume: 0.9
  },
  ethiopian: {
    preferred: ['George', 'Aria', 'Daniel'],
    fallback: ['JBFqnCBsd6RMkjVDRZzb', '9BWtsMINqrJLrRacOk9x'],
    speechRate: 0.85,
    speechPitch: 1.0,
    volume: 0.85
  },
  mixed: {
    preferred: ['River', 'Alex', 'Taylor'],
    fallback: ['SAz9YHcvj6GT2YYXdXww', 'EXAVITQu4vr4xnSDxMaL'],
    speechRate: 1.0,
    speechPitch: 1.0,
    volume: 0.85
  }
};

// Cultural vocal reactions and background sounds
const culturalVocalReactions = {
  african: {
    agreement: ['mmm-hmm', 'yes indeed', 'that\'s right', 'I hear you'],
    understanding: ['mmm', 'ah yes', 'I see', 'oh my'],
    empathy: ['oh dear', 'bless your heart', 'my child', 'I feel you'],
    thinking: ['hmm', 'let me see', 'well now', 'you know'],
    calm: ['breathe now', 'take your time', 'it\'s alright', 'easy does it']
  },
  jamaican: {
    agreement: ['seen', 'ya mon', 'fi real', 'true dat'],
    understanding: ['mmm-hmm', 'irie', 'ya get me', 'seen seen'],
    empathy: ['easy nuh', 'mi feel ya', 'no worry bout dat', 'big up yaself'],
    thinking: ['ya see', 'let mi tell ya', 'check dis', 'listen nuh'],
    calm: ['take it easy', 'one love', 'everything irie', 'calm yaself']
  },
  indian: {
    agreement: ['haan haan', 'absolutely', 'very good', 'exactly'],
    understanding: ['acha', 'I see', 'very nice', 'hmm'],
    empathy: ['arre yaar', 'don\'t worry', 'it\'s okay na', 'take care'],
    thinking: ['actually', 'you know what', 'let me think', 'hmm'],
    calm: ['relax karo', 'take deep breath', 'no tension', 'all is well']
  },
  mexican: {
    agreement: ['sí sí', 'claro que sí', 'por supuesto', 'exacto'],
    understanding: ['órale', 'ya veo', 'entiendo', 'ah sí'],
    empathy: ['ay no', 'pobrecito', 'no te preocupes', 'mi amor'],
    thinking: ['a ver', 'pues', 'este', 'bueno'],
    calm: ['tranquilo', 'respira hondo', 'todo está bien', 'con calma']
  },
  italian: {
    agreement: ['sì sì', 'esatto', 'perfetto', 'bravo'],
    understanding: ['capisco', 'ah sì', 'ecco', 'vero'],
    empathy: ['mamma mia', 'poverino', 'non ti preoccupare', 'coraggio'],
    thinking: ['allora', 'vediamo', 'dunque', 'bene'],
    calm: ['calma', 'respira', 'tutto bene', 'piano piano']
  },
  chinese: {
    agreement: ['duì duì', 'hǎo de', 'shì de', 'exactly'],
    understanding: ['ò', 'míng bái le', 'I see', 'ah'],
    empathy: ['ài ya', 'don\'t worry', 'méi guān xì', 'it\'s okay'],
    thinking: ['nà ge', 'let me think', 'hmm', 'well'],
    calm: ['fàng sōng', 'take it easy', 'slow down', 'breathe']
  },
  european: {
    agreement: ['yes yes', 'absolutely', 'quite right', 'indeed'],
    understanding: ['I see', 'ah yes', 'right', 'mm-hmm'],
    empathy: ['oh dear', 'I\'m sorry', 'that\'s difficult', 'I understand'],
    thinking: ['well', 'let me think', 'hmm', 'you know'],
    calm: ['take a breath', 'steady on', 'gently now', 'there there']
  },
  moroccan: {
    agreement: ['na\'am', 'aywa', 'très bien', 'exactement'],
    understanding: ['wakha', 'ah oui', 'I see', 'bien sûr'],
    empathy: ['allah ya\'tik', 'pas grave', 'courage', 'inch\'allah'],
    thinking: ['alors', 'bon', 'yak', 'hmm'],
    calm: ['hanya', 'doucement', 'take time', 'sabr']
  },
  spanish: {
    agreement: ['sí claro', 'por supuesto', 'desde luego', 'efectivamente'],
    understanding: ['ya veo', 'entiendo', 'comprendo', 'ah sí'],
    empathy: ['ay dios', 'lo siento', 'pobrecito', 'qué pena'],
    thinking: ['a ver', 'bueno', 'pues', 'este'],
    calm: ['tranquilo', 'respira', 'con calma', 'despacio']
  },
  ethiopian: {
    agreement: ['awo', 'betam', 'gobez', 'exactly'],
    understanding: ['ahhh', 'I see', 'getaye', 'mm-hmm'],
    empathy: ['yene konjo', 'don\'t worry', 'it\'s okay', 'egziyabher'],
    thinking: ['hmm', 'let me see', 'eshi', 'well'],
    calm: ['tenkish', 'slowly', 'take time', 'breathe well']
  }
};

// Background ambient sounds and vocal textures
const ambientVocalSounds = {
  breathing: ['*soft inhale*', '*gentle exhale*', '*deep breath*'],
  comfort: ['*warm hum*', '*soft sigh*', '*gentle mmm*'],
  thinking: ['*thoughtful pause*', '*considers*', '*reflects*'],
  empathy: ['*understanding nod*', '*compassionate sound*', '*caring tone*']
};

// Enhanced voice mappings with accent preferences
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
  const speakWithAccent = useCallback((text: string, ethnicity?: string, personality?: string, mood?: 'calm' | 'empathetic' | 'thinking' | 'agreeing') => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      let modifiedText = text;
      
      // Add cultural vocal reactions based on mood
      if (ethnicity && culturalVocalReactions[ethnicity as keyof typeof culturalVocalReactions] && mood) {
        const reactions = culturalVocalReactions[ethnicity as keyof typeof culturalVocalReactions];
        const moodReactions = reactions[mood] || reactions.understanding;
        
        if (Math.random() > 0.6) { // 40% chance to add reaction
          const reaction = moodReactions[Math.floor(Math.random() * moodReactions.length)];
          
          // Add reaction at beginning or end based on mood
          if (mood === 'thinking' || mood === 'calm') {
            modifiedText = `${reaction}... ${text}`;
          } else {
            modifiedText = `${reaction}, ${text.toLowerCase()}`;
          }
        }
      }
      
      // Add ambient sounds for emotional depth
      if (Math.random() > 0.7) { // 30% chance for ambient sounds
        const ambientCategories = Object.keys(ambientVocalSounds);
        const category = ambientCategories[Math.floor(Math.random() * ambientCategories.length)] as keyof typeof ambientVocalSounds;
        const ambientSound = ambientVocalSounds[category][Math.floor(Math.random() * ambientVocalSounds[category].length)];
        
        if (mood === 'calm' || mood === 'empathetic') {
          modifiedText = `${ambientSound} ${modifiedText}`;
        }
      }
      
      // Apply accent-specific language patterns
      if (ethnicity && accentModifications[ethnicity as keyof typeof accentModifications]) {
        const accent = accentModifications[ethnicity as keyof typeof accentModifications];
        
        // Enhanced accent modifications
        if (ethnicity === 'jamaican') {
          modifiedText = modifiedText.replace(/\byou\b/g, 'yuh');
          modifiedText = modifiedText.replace(/\bokay\b/g, 'irie');
          modifiedText = modifiedText.replace(/\bfeeling\b/g, 'vibes');
          modifiedText = modifiedText.replace(/\bunderstand\b/g, 'overstand');
          modifiedText = modifiedText.replace(/\bthinking\b/g, 'reasoning');
        } else if (ethnicity === 'african') {
          modifiedText = modifiedText.replace(/\bchild\b/g, 'my child');
          modifiedText = modifiedText.replace(/\bunderstand\b/g, 'I hear you');
          modifiedText = modifiedText.replace(/\byes\b/g, 'yes indeed');
        } else if (ethnicity === 'indian') {
          modifiedText = modifiedText.replace(/\byes\b/g, 'yes indeed');
          modifiedText = modifiedText.replace(/\bgood\b/g, 'very good');
          modifiedText = modifiedText.replace(/\bokay\b/g, 'acha');
        } else if (ethnicity === 'mexican') {
          if (Math.random() > 0.7) {
            modifiedText = modifiedText.replace(/\bgood\b/g, 'muy bueno');
            modifiedText = modifiedText.replace(/\byes\b/g, 'sí, claro');
            modifiedText = modifiedText.replace(/\bof course\b/g, 'por supuesto');
          }
        } else if (ethnicity === 'italian') {
          if (Math.random() > 0.7) {
            modifiedText = modifiedText.replace(/\bgood\b/g, 'molto bene');
            modifiedText = modifiedText.replace(/\bbeautiful\b/g, 'bellissimo');
            modifiedText = modifiedText.replace(/\byes\b/g, 'sì, bravo');
          }
        } else if (ethnicity === 'chinese') {
          if (Math.random() > 0.8) {
            modifiedText = modifiedText.replace(/\byes\b/g, 'duì, exactly');
            modifiedText = modifiedText.replace(/\bgood\b/g, 'hǎo de');
          }
        }
      }
      
      const utterance = new SpeechSynthesisUtterance(modifiedText);
      
      // Set accent-specific voice preferences with enhanced characteristics
      if (ethnicity && accentVoiceMapping[ethnicity as keyof typeof accentVoiceMapping]) {
        const accentConfig = accentVoiceMapping[ethnicity as keyof typeof accentVoiceMapping];
        
        // Try to find preferred voice for this accent
        const preferredVoice = availableVoices.find(voice => 
          accentConfig.preferred.some(name => voice.name.toLowerCase().includes(name.toLowerCase()))
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        // Apply enhanced accent-specific speech characteristics
        utterance.rate = accentConfig.speechRate * voiceSettings.voiceSpeed;
        utterance.pitch = accentConfig.speechPitch * voiceSettings.voicePitch;
        utterance.volume = accentConfig.volume * voiceSettings.speechVolume;
        
        // Add slight pauses for dramatic effect in certain cultures
        if (ethnicity === 'italian' || ethnicity === 'spanish' || ethnicity === 'moroccan') {
          modifiedText = modifiedText.replace(/,/g, '... ');
        }
        
        // Slower, more deliberate speech for wise/elder personalities
        if (personality?.includes('wise') || personality?.includes('elder')) {
          utterance.rate *= 0.85;
        }
        
        // Warmer, softer tone for nurturing personalities
        if (personality?.includes('nurturing') || personality?.includes('caring')) {
          utterance.pitch *= 0.95;
          utterance.volume *= 1.1;
        }
        
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
        utterance.volume = voiceSettings.speechVolume;
      }
      
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
