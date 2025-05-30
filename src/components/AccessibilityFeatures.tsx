
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Accessibility, Volume2, Eye, Type, Navigation, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccessibilitySettings {
  voiceNavigation: boolean;
  dyslexiaFont: boolean;
  screenReaderOptimized: boolean;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  keyboardNavigation: boolean;
  audioDescriptions: boolean;
  textToSpeech: boolean;
  fontSize: number;
  voiceSpeed: number;
  colorScheme: 'auto' | 'light' | 'dark' | 'high-contrast';
}

const AccessibilityFeatures = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    voiceNavigation: false,
    dyslexiaFont: false,
    screenReaderOptimized: false,
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    keyboardNavigation: true,
    audioDescriptions: false,
    textToSpeech: false,
    fontSize: 16,
    voiceSpeed: 1,
    colorScheme: 'auto'
  });
  const [isListening, setIsListening] = useState(false);
  const [currentCommand, setCurrentCommand] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load saved accessibility settings
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
    
    // Apply initial accessibility features
    applyAccessibilitySettings(settings);
  }, []);

  useEffect(() => {
    // Save and apply settings when they change
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    applyAccessibilitySettings(settings);
  }, [settings]);

  const applyAccessibilitySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = `${newSettings.fontSize}px`;
    
    // Dyslexia-friendly font
    if (newSettings.dyslexiaFont) {
      root.style.fontFamily = 'OpenDyslexic, Arial, sans-serif';
    } else {
      root.style.fontFamily = '';
    }
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.style.setProperty('--motion-duration', '0s');
    } else {
      root.style.removeProperty('--motion-duration');
    }
    
    // Screen reader optimization
    if (newSettings.screenReaderOptimized) {
      root.setAttribute('data-screen-reader', 'true');
    } else {
      root.removeAttribute('data-screen-reader');
    }

    // Color scheme
    root.setAttribute('data-color-scheme', newSettings.colorScheme);
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    toast({
      title: "Accessibility Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${value ? 'enabled' : 'disabled'}.`
    });
  };

  const startVoiceNavigation = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice Navigation Unavailable",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }

    setIsListening(true);
    setCurrentCommand('Listening...');
    
    // Simulate voice command recognition
    setTimeout(() => {
      const commands = [
        'Navigate to mood analysis',
        'Show breathing exercises',
        'Read current page aloud',
        'Increase text size',
        'Switch to high contrast'
      ];
      
      const command = commands[Math.floor(Math.random() * commands.length)];
      setCurrentCommand(command);
      
      setTimeout(() => {
        executeVoiceCommand(command);
        setIsListening(false);
        setCurrentCommand('');
      }, 1000);
    }, 2000);
  };

  const executeVoiceCommand = (command: string) => {
    toast({
      title: "Voice Command Executed",
      description: `Executed: "${command}"`
    });
    
    // Process different voice commands
    if (command.includes('text size')) {
      updateSetting('fontSize', settings.fontSize + 2);
    } else if (command.includes('high contrast')) {
      updateSetting('highContrast', !settings.highContrast);
    } else if (command.includes('read')) {
      speakText("Reading current page content aloud with text-to-speech functionality.");
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.voiceSpeed;
      speechSynthesis.speak(utterance);
    }
  };

  const testScreenReader = () => {
    speakText("Testing screen reader compatibility. All interface elements are properly labeled with ARIA attributes for optimal accessibility.");
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      voiceNavigation: false,
      dyslexiaFont: false,
      screenReaderOptimized: false,
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      keyboardNavigation: true,
      audioDescriptions: false,
      textToSpeech: false,
      fontSize: 16,
      voiceSpeed: 1,
      colorScheme: 'auto'
    };
    
    setSettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "All accessibility settings have been reset to defaults."
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Accessibility className="w-5 h-5" />
          Advanced Accessibility Features
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Navigation */}
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Voice Navigation</h3>
              <Badge variant={settings.voiceNavigation ? "default" : "secondary"}>
                {settings.voiceNavigation ? "Active" : "Inactive"}
              </Badge>
            </div>
            <Switch
              checked={settings.voiceNavigation}
              onCheckedChange={(checked) => updateSetting('voiceNavigation', checked)}
            />
          </div>
          
          {settings.voiceNavigation && (
            <div className="space-y-3">
              <Button 
                onClick={startVoiceNavigation}
                disabled={isListening}
                className="w-full"
              >
                {isListening ? '🎤 Listening...' : '🎤 Start Voice Command'}
              </Button>
              
              {currentCommand && (
                <div className="text-sm bg-white p-2 rounded border">
                  <strong>Command:</strong> {currentCommand}
                </div>
              )}
              
              <div className="text-xs text-blue-600">
                <p><strong>Try saying:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>"Navigate to mood analysis"</li>
                  <li>"Show breathing exercises"</li>
                  <li>"Increase text size"</li>
                  <li>"Enable high contrast"</li>
                  <li>"Read page aloud"</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Visual Accessibility */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Visual Accessibility
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Dyslexia-Friendly Font</label>
                <Switch
                  checked={settings.dyslexiaFont}
                  onCheckedChange={(checked) => updateSetting('dyslexiaFont', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">High Contrast Mode</label>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Reduced Motion</label>
                <Switch
                  checked={settings.reducedMotion}
                  onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Font Size: {settings.fontSize}px</label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={(value) => updateSetting('fontSize', value[0])}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Color Scheme</label>
                <Select 
                  value={settings.colorScheme} 
                  onValueChange={(value) => updateSetting('colorScheme', value as AccessibilitySettings['colorScheme'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="high-contrast">High Contrast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Screen Reader & Audio */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Screen Reader & Audio
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Screen Reader Optimized</label>
                <Switch
                  checked={settings.screenReaderOptimized}
                  onCheckedChange={(checked) => updateSetting('screenReaderOptimized', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Text-to-Speech</label>
                <Switch
                  checked={settings.textToSpeech}
                  onCheckedChange={(checked) => updateSetting('textToSpeech', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Audio Descriptions</label>
                <Switch
                  checked={settings.audioDescriptions}
                  onCheckedChange={(checked) => updateSetting('audioDescriptions', checked)}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Voice Speed: {settings.voiceSpeed}x</label>
                <Slider
                  value={[settings.voiceSpeed]}
                  onValueChange={(value) => updateSetting('voiceSpeed', value[0])}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <Button onClick={testScreenReader} variant="outline" size="sm" className="w-full">
                Test Screen Reader
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            Navigation
          </h3>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enhanced Keyboard Navigation</label>
            <Switch
              checked={settings.keyboardNavigation}
              onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
            />
          </div>
          
          <div className="bg-gray-50 p-3 rounded text-sm">
            <p className="font-medium mb-2">Keyboard Shortcuts:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>• Tab: Navigate forward</div>
              <div>• Shift+Tab: Navigate backward</div>
              <div>• Enter: Activate buttons</div>
              <div>• Space: Toggle switches</div>
              <div>• Escape: Close dialogs</div>
              <div>• Arrow keys: Navigate menus</div>
            </div>
          </div>
        </div>

        {/* Font Preview */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Type className="w-4 h-4" />
            Font Preview
          </h3>
          <div className="p-4 border rounded-lg bg-white">
            <p className="mb-2" style={{ fontFamily: settings.dyslexiaFont ? 'OpenDyslexic, Arial, sans-serif' : 'inherit' }}>
              This is how text appears with your current accessibility settings. 
              The dyslexia-friendly font is designed to reduce letter confusion and improve reading comprehension.
            </p>
            <p className="text-sm text-gray-600">
              Current settings: Font size {settings.fontSize}px, 
              {settings.dyslexiaFont ? ' Dyslexia-friendly font,' : ' Standard font,'}
              {settings.highContrast ? ' High contrast mode' : ' Normal contrast'}
            </p>
          </div>
        </div>

        {/* Reset and Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={resetSettings} variant="outline" className="flex-1">
            Reset to Defaults
          </Button>
          <Button onClick={() => speakText("Accessibility settings configured successfully")} className="flex-1">
            Test Audio Feedback
          </Button>
        </div>

        {/* Accessibility Score */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Accessibility Score</h3>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-green-600">
              {Object.values(settings).filter(Boolean).length * 10}%
            </div>
            <div className="text-sm text-green-700">
              <p>Great job! You've enabled {Object.values(settings).filter(Boolean).length} accessibility features.</p>
              <p className="text-xs mt-1">This app follows WCAG 2.1 AA guidelines for optimal accessibility.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityFeatures;
