
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Play, 
  Pause, 
  Square, 
  Shuffle, 
  SkipBack, 
  SkipForward,
  Volume2,
  Settings,
  Repeat,
  FastForward,
  Rewind
} from 'lucide-react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  timestamp: Date;
  aiInsight?: string;
}

interface AudioEffects {
  echo: boolean;
  echoDelay: number;
  echoFeedback: number;
  speed: number;
  pitch: number;
  volume: number;
}

interface JournalAudioPlayerProps {
  entries: JournalEntry[];
  availableVoices: SpeechSynthesisVoice[];
  voiceSettings: any;
}

const JournalAudioPlayer: React.FC<JournalAudioPlayerProps> = ({
  entries,
  availableVoices,
  voiceSettings
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState<'content' | 'insight'>('content');
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const [audioEffects, setAudioEffects] = useState<AudioEffects>({
    echo: false,
    echoDelay: 0.3,
    echoFeedback: 0.4,
    speed: 1,
    pitch: 1,
    volume: 1
  });

  const [selectedVoice, setSelectedVoice] = useState('');
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const feedbackNodeRef = useRef<GainNode | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio context for effects
  useEffect(() => {
    if (audioEffects.echo && !audioContextRef.current) {
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      delayNodeRef.current = audioContextRef.current.createDelay(1.0);
      feedbackNodeRef.current = audioContextRef.current.createGain();
      
      // Connect echo effect nodes
      delayNodeRef.current.connect(feedbackNodeRef.current);
      feedbackNodeRef.current.connect(delayNodeRef.current);
      feedbackNodeRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
  }, [audioEffects.echo]);

  // Update echo parameters
  useEffect(() => {
    if (delayNodeRef.current && feedbackNodeRef.current) {
      delayNodeRef.current.delayTime.value = audioEffects.echoDelay;
      feedbackNodeRef.current.gain.value = audioEffects.echoFeedback;
    }
  }, [audioEffects.echoDelay, audioEffects.echoFeedback]);

  const getCurrentEntry = () => entries[currentEntryIndex];
  
  const getCurrentText = () => {
    const entry = getCurrentEntry();
    if (!entry) return '';
    
    if (currentSection === 'content') {
      return `${entry.title}. ${entry.content}`;
    } else {
      return entry.aiInsight || 'No AI insight available for this entry.';
    }
  };

  const createUtterance = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply voice selection
    if (selectedVoice && availableVoices.length > 0) {
      const voice = availableVoices.find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }
    
    // Apply audio effects
    utterance.rate = audioEffects.speed;
    utterance.pitch = audioEffects.pitch;
    utterance.volume = audioEffects.volume;
    
    // Progress tracking
    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(text.length * 100); // Rough estimate
      
      progressIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 100;
          setProgress((newTime / duration) * 100);
          return newTime;
        });
      }, 100);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      handleNext();
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
    
    return utterance;
  };

  const play = () => {
    if (entries.length === 0) return;
    
    const text = getCurrentText();
    if (!text) return;
    
    stop(); // Stop any current playback
    
    utteranceRef.current = createUtterance(text);
    speechSynthesis.speak(utteranceRef.current);
  };

  const pause = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }
  };

  const resume = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPlaying(true);
      // Resume progress tracking
      progressIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 100;
          setProgress((newTime / duration) * 100);
          return newTime;
        });
      }, 100);
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const handleNext = () => {
    if (entries.length === 0) return;
    
    // Handle section progression (content -> insight -> next entry)
    if (currentSection === 'content' && getCurrentEntry()?.aiInsight) {
      setCurrentSection('insight');
      if (isPlaying || speechSynthesis.speaking) {
        setTimeout(() => play(), 500);
      }
      return;
    }
    
    // Move to next entry
    setCurrentSection('content');
    
    if (shuffleMode) {
      const nextIndex = Math.floor(Math.random() * entries.length);
      setCurrentEntryIndex(nextIndex);
    } else {
      const nextIndex = currentEntryIndex + 1;
      if (nextIndex >= entries.length) {
        if (repeatMode === 'all') {
          setCurrentEntryIndex(0);
        } else {
          stop();
          return;
        }
      } else {
        setCurrentEntryIndex(nextIndex);
      }
    }
    
    if (isPlaying || speechSynthesis.speaking) {
      setTimeout(() => play(), 500);
    }
  };

  const handlePrevious = () => {
    if (entries.length === 0) return;
    
    // Handle section regression (insight -> content -> previous entry)
    if (currentSection === 'insight') {
      setCurrentSection('content');
      if (isPlaying || speechSynthesis.speaking) {
        setTimeout(() => play(), 500);
      }
      return;
    }
    
    // Move to previous entry
    const prevIndex = currentEntryIndex - 1;
    if (prevIndex < 0) {
      setCurrentEntryIndex(entries.length - 1);
    } else {
      setCurrentEntryIndex(prevIndex);
    }
    
    // Go to insight section of previous entry if it exists
    const prevEntry = entries[prevIndex < 0 ? entries.length - 1 : prevIndex];
    if (prevEntry?.aiInsight) {
      setCurrentSection('insight');
    }
    
    if (isPlaying || speechSynthesis.speaking) {
      setTimeout(() => play(), 500);
    }
  };

  const togglePlayPause = () => {
    if (speechSynthesis.paused) {
      resume();
    } else if (isPlaying || speechSynthesis.speaking) {
      pause();
    } else {
      play();
    }
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (entries.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
        <CardContent className="p-6 text-center text-gray-500">
          <Volume2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No journal entries to play</p>
        </CardContent>
      </Card>
    );
  }

  const currentEntry = getCurrentEntry();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Audio Playbook
          </CardTitle>
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
            size="sm"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Entry Display */}
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-orange-800 mb-1">{currentEntry?.title}</h4>
          <p className="text-xs text-orange-600">
            {currentSection === 'content' ? 'Reading Entry' : 'Reading AI Insight'} • 
            Entry {currentEntryIndex + 1} of {entries.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex justify-center items-center gap-2">
          <Button
            onClick={handlePrevious}
            variant="outline"
            size="sm"
            disabled={entries.length <= 1}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => setAudioEffects(prev => ({ ...prev, speed: Math.max(0.25, prev.speed - 0.25) }))}
            variant="outline"
            size="sm"
            title="Slower"
          >
            <Rewind className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={togglePlayPause}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            {isPlaying || speechSynthesis.speaking ? 
              <Pause className="w-5 h-5" /> : 
              <Play className="w-5 h-5" />
            }
          </Button>
          
          <Button
            onClick={() => setAudioEffects(prev => ({ ...prev, speed: Math.min(3, prev.speed + 0.25) }))}
            variant="outline"
            size="sm"
            title="Faster"
          >
            <FastForward className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={handleNext}
            variant="outline"
            size="sm"
            disabled={entries.length <= 1}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Secondary Controls */}
        <div className="flex justify-center gap-2">
          <Button
            onClick={stop}
            variant="outline"
            size="sm"
          >
            <Square className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => setShuffleMode(!shuffleMode)}
            variant={shuffleMode ? "default" : "outline"}
            size="sm"
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => {
              const modes = ['none', 'one', 'all'] as const;
              const currentIndex = modes.indexOf(repeatMode);
              setRepeatMode(modes[(currentIndex + 1) % modes.length]);
            }}
            variant={repeatMode !== 'none' ? "default" : "outline"}
            size="sm"
            title={`Repeat: ${repeatMode}`}
          >
            <Repeat className="w-4 h-4" />
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <h5 className="font-semibold text-gray-800">Audio Settings</h5>
            
            {/* Voice Selection */}
            <div className="space-y-2">
              <Label>Voice</Label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select voice" />
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

            {/* Speed Control */}
            <div className="space-y-2">
              <Label>Speed: {audioEffects.speed}x</Label>
              <Slider
                value={[audioEffects.speed]}
                onValueChange={([speed]) => setAudioEffects(prev => ({ ...prev, speed }))}
                min={0.25}
                max={3}
                step={0.25}
              />
            </div>

            {/* Pitch Control */}
            <div className="space-y-2">
              <Label>Pitch: {audioEffects.pitch.toFixed(1)}</Label>
              <Slider
                value={[audioEffects.pitch]}
                onValueChange={([pitch]) => setAudioEffects(prev => ({ ...prev, pitch }))}
                min={0.5}
                max={2}
                step={0.1}
              />
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <Label>Volume: {Math.round(audioEffects.volume * 100)}%</Label>
              <Slider
                value={[audioEffects.volume]}
                onValueChange={([volume]) => setAudioEffects(prev => ({ ...prev, volume }))}
                min={0}
                max={1}
                step={0.1}
              />
            </div>

            {/* Echo Effect */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Echo Effect</Label>
                <Switch
                  checked={audioEffects.echo}
                  onCheckedChange={(echo) => setAudioEffects(prev => ({ ...prev, echo }))}
                />
              </div>
              
              {audioEffects.echo && (
                <div className="space-y-2 pl-4">
                  <div>
                    <Label className="text-xs">Delay: {audioEffects.echoDelay.toFixed(1)}s</Label>
                    <Slider
                      value={[audioEffects.echoDelay]}
                      onValueChange={([echoDelay]) => setAudioEffects(prev => ({ ...prev, echoDelay }))}
                      min={0.1}
                      max={1}
                      step={0.1}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Feedback: {Math.round(audioEffects.echoFeedback * 100)}%</Label>
                    <Slider
                      value={[audioEffects.echoFeedback]}
                      onValueChange={([echoFeedback]) => setAudioEffects(prev => ({ ...prev, echoFeedback }))}
                      min={0}
                      max={0.8}
                      step={0.1}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalAudioPlayer;
