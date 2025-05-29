
import { useState, useEffect, useCallback } from 'react';
import { VoiceSettings, VoiceToneData } from '../types/voice';
import { useSpeechRecognition } from './useSpeechRecognition';
import { speakText, speakWithAccent, stopSpeaking } from '../utils/speechSynthesis';

export const useVoiceInteraction = () => {
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
    autoSend: false,
    continuousListening: false,
  });

  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null);
  const [voiceTone, setVoiceTone] = useState<VoiceToneData>({
    tone: 'neutral',
    confidence: 0,
    volume: 0,
    pitch: 0
  });

  const { isListening, startListening: startSpeechRecognition, stopListening } = useSpeechRecognition(voiceSettings.continuousListening);

  // Check speech recognition support on mount
  useEffect(() => {
    const checkSpeechRecognitionSupport = () => {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        console.log('✅ Speech Recognition API is supported');
        return true;
      } else {
        console.log('❌ Speech Recognition API is not supported in this browser');
        return false;
      }
    };

    const isSupported = checkSpeechRecognitionSupport();
    if (!isSupported) {
      setVoiceSettings(prev => ({ ...prev, voiceInput: false }));
    }
  }, []);

  // Load voice settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('voiceSettings');
    if (savedSettings) {
      setVoiceSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save voice settings to localStorage
  useEffect(() => {
    localStorage.setItem('voiceSettings', JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      if (voices.length > 0 && !voiceSettings.selectedVoice) {
        const defaultVoice = voices.find(voice => voice.default) || voices[0];
        setVoiceSettings(prev => ({ ...prev, selectedVoice: defaultVoice.name }));
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [voiceSettings.selectedVoice]);

  const initAudioContext = useCallback(async () => {
    try {
      console.log('🎤 Requesting microphone permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Microphone permission granted');
      setHasAudioPermission(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('❌ Microphone permission denied:', error);
      setHasAudioPermission(false);
    }
  }, []);

  const startListening = useCallback(() => {
    const onResult = (transcript: string, isFinal: boolean) => {
      setTranscript(transcript);
      
      // Simple voice tone analysis based on transcript
      if (isFinal) {
        const lowerText = transcript.toLowerCase();
        let detectedTone: VoiceToneData['tone'] = 'neutral';
        
        if (lowerText.includes('happy') || lowerText.includes('good') || lowerText.includes('great')) {
          detectedTone = 'excited';
        } else if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('bad')) {
          detectedTone = 'sad';
        } else if (lowerText.includes('calm') || lowerText.includes('peaceful') || lowerText.includes('relaxed')) {
          detectedTone = 'calm';
        } else if (lowerText.includes('worried') || lowerText.includes('anxious') || lowerText.includes('stressed')) {
          detectedTone = 'stressed';
        }
        
        setVoiceTone({
          tone: detectedTone,
          confidence: 0.8,
          volume: 0.5,
          pitch: 0.5
        });
      }
    };

    const onError = (error: string) => {
      console.error('Speech recognition error:', error);
    };

    startSpeechRecognition(onResult, onError);
  }, [startSpeechRecognition]);

  const speak = useCallback((text: string) => {
    speakText(text, voiceSettings, availableVoices, setIsSpeaking);
  }, [voiceSettings, availableVoices]);

  const speakWithAccentCallback = useCallback((
    text: string,
    ethnicity?: string,
    personality?: string,
    mood?: 'calm' | 'empathetic' | 'thinking' | 'agreeing'
  ) => {
    speakWithAccent(text, voiceSettings, availableVoices, setIsSpeaking, ethnicity, personality, mood);
  }, [voiceSettings, availableVoices]);

  const stopSpeakingCallback = useCallback(() => {
    stopSpeaking(setIsSpeaking);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  const updateVoiceSettings = useCallback((updates: Partial<VoiceSettings>) => {
    setVoiceSettings(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    // Voice recognition
    isListening,
    transcript,
    voiceTone,
    startListening,
    stopListening,
    clearTranscript,
    setTranscript,
    
    // Speech synthesis
    isSpeaking,
    speak,
    speakWithAccent: speakWithAccentCallback,
    stopSpeaking: stopSpeakingCallback,
    
    // Settings and voices
    voiceSettings,
    setVoiceSettings,
    updateVoiceSettings,
    availableVoices,
    
    // Permissions
    hasAudioPermission,
    initAudioContext
  };
};
