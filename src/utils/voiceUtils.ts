
import { VoiceToneData } from '../types/voice';

export const analyzeVoiceTone = (text: string): VoiceToneData => {
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

  return {
    tone,
    confidence,
    volume: Math.random() * 0.5 + 0.3, // Mock volume
    pitch: Math.random() * 2 + 1 // Mock pitch
  };
};

export const executeVoiceCommand = (
  command: string,
  startListening: () => void,
  stopListening: () => void,
  setTranscript: (transcript: string) => void
): boolean => {
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
};
