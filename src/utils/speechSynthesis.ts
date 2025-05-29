
import { VoiceSettings } from '../types/voice';
import { accentVoiceMapping, culturalVocalReactions, ambientVocalSounds, accentModifications } from '../constants/voiceConstants';

export const speakText = (
  text: string,
  voiceSettings: VoiceSettings,
  availableVoices: SpeechSynthesisVoice[],
  setIsSpeaking: (speaking: boolean) => void
) => {
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
};

export const speakWithAccent = (
  text: string,
  voiceSettings: VoiceSettings,
  availableVoices: SpeechSynthesisVoice[],
  setIsSpeaking: (speaking: boolean) => void,
  ethnicity?: string,
  personality?: string,
  mood?: 'calm' | 'empathetic' | 'thinking' | 'agreeing'
) => {
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
};

export const stopSpeaking = (setIsSpeaking: (speaking: boolean) => void) => {
  speechSynthesis.cancel();
  setIsSpeaking(false);
};
