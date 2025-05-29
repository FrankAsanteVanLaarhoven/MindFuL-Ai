
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

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-200">
      <CardHeader>
        <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
          <Accessibility className="w-5 h-5" />
          Voice & Accessibility Settings
        </CardTitle>
        <CardDescription>
          Configure voice interaction and accessibility options
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

              {/* Voice Selection */}
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
                    <SelectContent>
                      {availableVoices.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
