
import { useState, useRef, useCallback } from 'react';

export const useSpeechRecognition = (continuousListening: boolean) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const initializeRecognition = useCallback(() => {
    console.log('🎤 Initializing speech recognition...');
    
    // Check if speech recognition is supported with better detection
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      console.error('❌ Speech recognition not supported in this browser');
      return null;
    }

    console.log('✅ Speech recognition API found, creating instance...');

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = continuousListening;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      console.log('✅ Speech recognition instance created successfully');
      return recognition;
    } catch (error) {
      console.error('❌ Error creating speech recognition instance:', error);
      return null;
    }
  }, [continuousListening]);

  const startListening = useCallback((
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void
  ) => {
    console.log('🎤 Starting speech recognition...');
    
    const recognition = initializeRecognition();
    if (!recognition) {
      console.error('❌ Cannot start listening - speech recognition not available');
      onError('Speech recognition not available');
      return;
    }

    recognitionRef.current = recognition;
    
    recognition.onstart = () => {
      console.log('🎤 Speech recognition started');
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log('📝 Speech recognition result received');
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
        console.log('✅ Final transcript:', finalTranscript);
        onResult(finalTranscript, true);
      } else {
        console.log('⏳ Interim transcript:', interimTranscript);
        onResult(interimTranscript, false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('❌ Speech recognition error:', event.error, event.message);
      setIsListening(false);
      
      // Provide more specific error handling
      if (event.error === 'not-allowed') {
        onError('Microphone access denied. Please allow microphone access and try again.');
      } else if (event.error === 'network') {
        onError('Network error. Please check your internet connection.');
      } else {
        onError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log('🛑 Speech recognition ended');
      setIsListening(false);
    };
    
    try {
      recognition.start();
      console.log('✅ Speech recognition start() called');
    } catch (error) {
      console.error('❌ Error starting speech recognition:', error);
      setIsListening(false);
      onError('Failed to start speech recognition');
    }
  }, [initializeRecognition]);

  const stopListening = useCallback(() => {
    console.log('🛑 Stopping speech recognition...');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    startListening,
    stopListening
  };
};
