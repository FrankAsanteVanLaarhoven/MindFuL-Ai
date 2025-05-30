import { useState, useEffect, useRef, useCallback } from 'react';

interface BreathDetectionState {
  isBreathing: boolean;
  breathIntensity: number; // 0-1 scale
  isInhaling: boolean;
  breathRate: number; // breaths per minute
  isListening: boolean;
  error: string | null;
}

export const useBreathDetection = () => {
  const [state, setState] = useState<BreathDetectionState>({
    isBreathing: false,
    breathIntensity: 0,
    isInhaling: false,
    breathRate: 0,
    isListening: false,
    error: null
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const breathHistoryRef = useRef<number[]>([]);
  const lastBreathTimeRef = useRef<number>(0);
  const breathCountRef = useRef<number>(0);
  const smoothingHistoryRef = useRef<number[]>([]);

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Focus on lower frequencies for breath detection (20-500 Hz)
    const breathFreqRange = Math.floor(bufferLength * 0.1); // Lower 10% of frequencies
    let breathIntensity = 0;

    for (let i = 0; i < breathFreqRange; i++) {
      breathIntensity += dataArray[i];
    }

    breathIntensity = breathIntensity / (breathFreqRange * 255); // Normalize to 0-1

    // Much longer smoothing history for stability
    smoothingHistoryRef.current.push(breathIntensity);
    if (smoothingHistoryRef.current.length > 30) { // Increased from 10 to 30
      smoothingHistoryRef.current.shift();
    }

    const smoothedIntensity = smoothingHistoryRef.current.reduce((a, b) => a + b, 0) / smoothingHistoryRef.current.length;

    // Higher threshold and hysteresis to prevent flickering
    const breathingThreshold = 0.04; // Increased from 0.02
    const stopBreathingThreshold = 0.02; // Lower threshold for stopping
    
    // Use hysteresis - different thresholds for starting vs stopping breathing
    const currentlyBreathing = state.isBreathing;
    const isBreathing = currentlyBreathing 
      ? smoothedIntensity > stopBreathingThreshold // Higher threshold to stop
      : smoothedIntensity > breathingThreshold; // Lower threshold to start
    
    // Only update intensity if we're actually breathing, otherwise keep it stable
    const finalIntensity = isBreathing ? Math.max(0, Math.min(1, smoothedIntensity)) : 0;

    // Detect inhale/exhale pattern - only when breathing
    const previousIntensity = smoothingHistoryRef.current[smoothingHistoryRef.current.length - 5] || 0; // Look further back
    const isInhaling = isBreathing && finalIntensity > previousIntensity;

    // Calculate breath rate
    const now = Date.now();
    if (isBreathing && !state.isBreathing && now - lastBreathTimeRef.current > 1000) {
      breathCountRef.current++;
      lastBreathTimeRef.current = now;
    }

    // Calculate breaths per minute (reset every 60 seconds)
    const breathRate = breathCountRef.current;
    if (now - lastBreathTimeRef.current > 60000) {
      breathCountRef.current = 0;
    }

    setState(prev => ({
      ...prev,
      isBreathing,
      breathIntensity: finalIntensity,
      isInhaling,
      breathRate
    }));

    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, [state.isBreathing]);

  const startListening = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        },
        video: false
      });

      streamRef.current = stream;

      // Create audio context
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioContext = audioContextRef.current;

      // Create analyser node
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.9; // Increased smoothing

      // Connect microphone to analyser
      microphoneRef.current = audioContext.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);

      setState(prev => ({ ...prev, isListening: true }));

      // Start analyzing
      analyzeAudio();

      console.log('🎤 Breath detection started!');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Could not access microphone. Please check permissions.',
        isListening: false
      }));
    }
  }, [analyzeAudio]);

  const stopListening = useCallback(() => {
    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop audio stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Reset refs
    analyserRef.current = null;
    microphoneRef.current = null;
    breathHistoryRef.current = [];
    smoothingHistoryRef.current = [];
    breathCountRef.current = 0;

    setState(prev => ({
      ...prev,
      isListening: false,
      isBreathing: false,
      breathIntensity: 0,
      isInhaling: false
    }));

    console.log('🛑 Breath detection stopped');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    ...state,
    startListening,
    stopListening
  };
};
