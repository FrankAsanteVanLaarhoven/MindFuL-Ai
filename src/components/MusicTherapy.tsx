
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, Brain, Leaf, Waves } from 'lucide-react';

interface MusicTrack {
  id: string;
  name: string;
  category: 'neural' | 'sanctuary' | 'nature' | 'classical' | 'ambient' | 'binaural';
  duration: number;
  description: string;
  benefits: string[];
  url?: string; // Would be actual audio URLs in production
}

const musicTracks: MusicTrack[] = [
  {
    id: '1',
    name: 'Neural Focus',
    category: 'neural',
    duration: 1800,
    description: '40Hz gamma waves for enhanced concentration',
    benefits: ['Focus', 'Cognitive Enhancement', 'Memory'],
    url: 'https://www.soundjay.com/misc/sounds/meditation-bell.wav' // Placeholder
  },
  {
    id: '2',
    name: 'Sanctuary Peace',
    category: 'sanctuary',
    duration: 2400,
    description: 'Sacred temple sounds for inner peace',
    benefits: ['Relaxation', 'Spiritual Connection', 'Stress Relief']
  },
  {
    id: '3',
    name: 'Forest Rain',
    category: 'nature',
    duration: 3600,
    description: 'Gentle rain in a peaceful forest',
    benefits: ['Sleep', 'Anxiety Relief', 'Grounding']
  },
  {
    id: '4',
    name: 'Alpha Waves',
    category: 'binaural',
    duration: 1200,
    description: '10Hz alpha waves for relaxation',
    benefits: ['Meditation', 'Stress Reduction', 'Creativity']
  },
  {
    id: '5',
    name: 'Ocean Depths',
    category: 'ambient',
    duration: 2700,
    description: 'Deep underwater ambient sounds',
    benefits: ['Deep Relaxation', 'Sleep', 'Emotional Healing']
  }
];

interface MusicTherapyProps {
  userProfile?: any;
}

const MusicTherapy: React.FC<MusicTherapyProps> = ({ userProfile }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setCurrentTime(time => {
          if (time >= currentTrack.duration) {
            setIsPlaying(false);
            return 0;
          }
          return time + 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack]);

  const getPersonalizedTracks = () => {
    if (!userProfile?.musicPreferences) return musicTracks;
    
    return musicTracks.filter(track => 
      userProfile.musicPreferences.includes(track.category)
    );
  };

  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'neural': return <Brain className="w-4 h-4" />;
      case 'sanctuary': return <Leaf className="w-4 h-4" />;
      case 'nature': return <Waves className="w-4 h-4" />;
      default: return <Volume2 className="w-4 h-4" />;
    }
  };

  const personalizedTracks = getPersonalizedTracks();

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Music Therapy
          </CardTitle>
          <CardDescription>
            Neural and sanctuary music for healing and focus
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentTrack ? (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-purple-800">{currentTrack.name}</h3>
                <p className="text-gray-600">{currentTrack.description}</p>
                <div className="flex justify-center gap-2 mt-2">
                  {currentTrack.benefits.map(benefit => (
                    <Badge key={benefit} variant="secondary">{benefit}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex justify-between text-sm text-purple-600 mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(currentTrack.duration)}</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="flex justify-center items-center gap-4">
                <Button 
                  onClick={togglePlayPause}
                  size="lg"
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-purple-600" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-purple-600 w-8">{volume[0]}</span>
              </div>
              
              <Button 
                onClick={() => setCurrentTrack(null)}
                variant="outline"
                className="w-full"
              >
                Choose Different Track
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalizedTracks.map((track) => (
                <Card key={track.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getCategoryIcon(track.category)}
                        {track.name}
                      </CardTitle>
                      <Badge variant="outline">{track.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{track.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {track.benefits.map(benefit => (
                        <Badge key={benefit} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {formatTime(track.duration)}
                      </span>
                      <Button 
                        onClick={() => playTrack(track)}
                        size="sm"
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Play
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicTherapy;
