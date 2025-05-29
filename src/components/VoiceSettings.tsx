
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Mic, MicOff, Volume2, VolumeX, Settings, Accessibility } from 'lucide-react';

interface VoiceSettings {
  enabled: boolean;
  voiceOutput: boolean;
  voiceInput: boolean;
  voiceSpeed: number;
  voicePitch: number;
  selectedVoice: string;
}

interface VoiceSettingsProps {
  voiceSettings: VoiceSettings;
  setVoiceSettings: (settings: VoiceSettings | ((prev: VoiceSettings) => VoiceSettings)) => void;
  availableVoices: SpeechSynthesisVoice[];
  hasAudioPermission: boolean | null;
  initAudioContext: () => Promise<void>;
  isListening: boolean;
  isSpeaking: boolean;
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  voiceSettings,
  setVoiceSettings,
  availableVoices,
  hasAudioPermission,
  initAudioContext,
  isListening,
  isSpeaking
}) => {
  const handlePermissionRequest = async () => {
    await initAudioContext();
  };

  // Group voices by language/region for better organization
  const groupVoicesByRegion = (voices: SpeechSynthesisVoice[]) => {
    const groups: { [key: string]: SpeechSynthesisVoice[] } = {
      'English (US)': [],
      'English (UK)': [],
      'English (AU)': [],
      'German': [],
      'French': [],
      'Dutch': [],
      'Spanish': [],
      'Italian': [],
      'Other': []
    };

    voices.forEach(voice => {
      const lang = voice.lang.toLowerCase();
      const name = voice.name.toLowerCase();
      
      if (lang.includes('en-us') || name.includes('united states') || name.includes('us ')) {
        groups['English (US)'].push(voice);
      } else if (lang.includes('en-gb') || name.includes('united kingdom') || name.includes('uk ') || name.includes('british')) {
        groups['English (UK)'].push(voice);
      } else if (lang.includes('en-au') || name.includes('australia') || name.includes('australian')) {
        groups['English (AU)'].push(voice);
      } else if (lang.includes('de') || name.includes('german') || name.includes('deutsch')) {
        groups['German'].push(voice);
      } else if (lang.includes('fr') || name.includes('french') || name.includes('français')) {
        groups['French'].push(voice);
      } else if (lang.includes('nl') || name.includes('dutch') || name.includes('nederlands')) {
        groups['Dutch'].push(voice);
      } else if (lang.includes('es') || name.includes('spanish') || name.includes('español')) {
        groups['Spanish'].push(voice);
      } else if (lang.includes('it') || name.includes('italian') || name.includes('italiano')) {
        groups['Italian'].push(voice);
      } else {
        groups['Other'].push(voice);
      }
    });

    return groups;
  };

  const voiceGroups = groupVoicesByRegion(availableVoices);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
      <CardHeader>
        <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
          <Accessibility className="w-5 h-5" />
          Voice & Accessibility Settings
        </CardTitle>
        <CardDescription>
          Configure voice interaction and accessibility options with international voices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable Voice Features */}
        <div className="flex items-center justify-between">
          <Label htmlFor="voice-enabled" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Enable Voice Features
          </Label>
          <Switch
            id="voice-enabled"
            checked={voiceSettings.enabled}
            onCheckedChange={(enabled) =>
              setVoiceSettings(prev => ({ ...prev, enabled }))
            }
          />
        </div>

        {voiceSettings.enabled && (
          <>
            {/* Audio Permission */}
            {hasAudioPermission === null && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-700 mb-2">
                  Microphone access is required for voice features
                </p>
                <Button onClick={handlePermissionRequest} size="sm" variant="outline">
                  Enable Microphone
                </Button>
              </div>
            )}

            {hasAudioPermission === false && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  Microphone access denied. Please enable it in your browser settings to use voice features.
                </p>
              </div>
            )}

            {/* Voice Input Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-input" className="flex items-center gap-2">
                  {isListening ? <Mic className="w-4 h-4 text-green-500" /> : <MicOff className="w-4 h-4" />}
                  Voice Input (Speech-to-Text)
                </Label>
                <Switch
                  id="voice-input"
                  checked={voiceSettings.voiceInput}
                  onCheckedChange={(voiceInput) =>
                    setVoiceSettings(prev => ({ ...prev, voiceInput }))
                  }
                  disabled={hasAudioPermission !== true}
                />
              </div>

              {/* Voice Output Settings */}
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-output" className="flex items-center gap-2">
                  {isSpeaking ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4" />}
                  Voice Output (Text-to-Speech)
                </Label>
                <Switch
                  id="voice-output"
                  checked={voiceSettings.voiceOutput}
                  onCheckedChange={(voiceOutput) =>
                    setVoiceSettings(prev => ({ ...prev, voiceOutput }))
                  }
                />
              </div>

              {/* Enhanced Voice Selection */}
              {voiceSettings.voiceOutput && availableVoices.length > 0 && (
                <div className="space-y-2">
                  <Label>Voice Selection</Label>
                  <Select
                    value={voiceSettings.selectedVoice}
                    onValueChange={(selectedVoice) =>
                      setVoiceSettings(prev => ({ ...prev, selectedVoice }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {Object.entries(voiceGroups).map(([region, voices]) => 
                        voices.length > 0 && (
                          <div key={region}>
                            <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">
                              {region}
                            </div>
                            {voices.map((voice) => {
                              // Create friendly display names
                              let displayName = voice.name;
                              
                              // Add common name mappings for popular voices
                              if (voice.name.toLowerCase().includes('maria')) {
                                displayName = `Maria (${voice.lang})`;
                              } else if (voice.name.toLowerCase().includes('sophie') || voice.name.toLowerCase().includes('sofia')) {
                                displayName = `Sophie (${voice.lang})`;
                              } else if (voice.name.toLowerCase().includes('adam')) {
                                displayName = `Adam (${voice.lang})`;
                              } else if (voice.name.toLowerCase().includes('jan')) {
                                displayName = `Jan (${voice.lang})`;
                              } else if (voice.name.toLowerCase().includes('morris') || voice.name.toLowerCase().includes('maurice')) {
                                displayName = `Morris (${voice.lang})`;
                              }
                              
                              return (
                                <SelectItem key={voice.name} value={voice.name}>
                                  {displayName}
                                </SelectItem>
                              );
                            })}
                          </div>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  
                  {/* Voice Preview */}
                  {voiceSettings.selectedVoice && (
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                      Selected: {availableVoices.find(v => v.name === voiceSettings.selectedVoice)?.name || 'Unknown'}
                    </div>
                  )}
                </div>
              )}

              {/* Voice Speed */}
              {voiceSettings.voiceOutput && (
                <div className="space-y-2">
                  <Label>Speech Speed: {voiceSettings.voiceSpeed.toFixed(1)}x</Label>
                  <Slider
                    value={[voiceSettings.voiceSpeed]}
                    onValueChange={([voiceSpeed]) =>
                      setVoiceSettings(prev => ({ ...prev, voiceSpeed }))
                    }
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              )}

              {/* Voice Pitch */}
              {voiceSettings.voiceOutput && (
                <div className="space-y-2">
                  <Label>Speech Pitch: {voiceSettings.voicePitch.toFixed(1)}</Label>
                  <Slider
                    value={[voiceSettings.voicePitch]}
                    onValueChange={([voicePitch]) =>
                      setVoiceSettings(prev => ({ ...prev, voicePitch }))
                    }
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceSettings;
