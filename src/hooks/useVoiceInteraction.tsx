
import { useState, useRef, useCallback, useEffect } from 'react';

interface VoiceSettings {
  enabled: boolean;
  voiceOutput: boolean;
  voiceInput: boolean;
  voiceSpeed: number;
  voicePitch: number;
  selectedVoice: string;
}

interface VoiceToneData {
  tone: 'calm' | 'stressed' | 'excited' | 'sad' | 'neutral';
  confidence: number;
  volume: number;
  pitch: number;
}

export const useVoiceInteraction = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceTone, setVoiceTone] = useState<VoiceToneData>({
    tone: 'neutral',
    confidence: 0,
    volume: 0,
    pitch: 0
  });
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: false,
    voiceOutput: true,
    voiceInput: true,
    voiceSpeed: 1,
    voicePitch: 1,
    selectedVoice: ''
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setTranscript(finalTranscript);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;
    
    // Load available voices
    const loadVoices = () => {
      const voices = synthRef.current?.getVoices() || [];
      setAvailableVoices(voices);
      if (voices.length > 0 && !voiceSettings.selectedVoice) {
        setVoiceSettings(prev => ({ ...prev, selectedVoice: voices[0].name }));
      }
    };

    loadVoices();
    if (synthRef.current) {
      synthRef.current.onvoiceschanged = loadVoices;
    }
  }, []);

  // Initialize audio context for tone analysis
  const initAudioContext = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      setHasAudioPermission(true);
      
      // Start tone analysis
      analyzeTone();
    } catch (error) {
      console.error('Audio permission denied:', error);
      setHasAudioPermission(false);
    }
  }, []);

  // Analyze voice tone
  const analyzeTone = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const analyze = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate volume (amplitude)
      const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length / 255;
      
      // Calculate dominant frequency (simplified pitch detection)
      let maxValue = 0;
      let maxIndex = 0;
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] > maxValue) {
          maxValue = dataArray[i];
          maxIndex = i;
        }
      }
      
      const pitch = (maxIndex / dataArray.length) * (audioContextRef.current?.sampleRate || 44100) / 2;
      
      // Determine tone based on volume and pitch patterns
      let tone: VoiceToneData['tone'] = 'neutral';
      let confidence = 0;
      
      if (volume > 0.1) {
        if (pitch > 200 && volume > 0.3) {
          tone = 'excited';
          confidence = Math.min(volume * 2, 1);
        } else if (pitch < 150 && volume < 0.2) {
          tone = 'sad';
          confidence = Math.min((0.3 - volume) * 3, 1);
        } else if (volume > 0.4) {
          tone = 'stressed';
          confidence = Math.min(volume * 1.5, 1);
        } else if (volume < 0.2 && pitch > 100 && pitch < 200) {
          tone = 'calm';
          confidence = Math.min((0.3 - volume) * 2, 1);
        }
      }
      
      setVoiceTone({
        tone,
        confidence,
        volume,
        pitch: pitch / 1000 // Convert to kHz for display
      });
      
      if (isListening) {
        requestAnimationFrame(analyze);
      }
    };
    
    analyze();
  }, [isListening]);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current) return;
    
    if (hasAudioPermission === null) {
      await initAudioContext();
    }
    
    try {
      setIsListening(true);
      recognitionRef.current.start();
      analyzeTone();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
    }
  }, [hasAudioPermission, initAudioContext, analyzeTone]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!synthRef.current || !voiceSettings.voiceOutput) return;

    // Stop any current speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find selected voice
    const selectedVoice = availableVoices.find(voice => voice.name === voiceSettings.selectedVoice);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = voiceSettings.voiceSpeed;
    utterance.pitch = voiceSettings.voicePitch;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  }, [voiceSettings, availableVoices]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    voiceTone,
    voiceSettings,
    availableVoices,
    hasAudioPermission,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    clearTranscript,
    setVoiceSettings,
    initAudioContext
  };
};
