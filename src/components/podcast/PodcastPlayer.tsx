
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { PodcastEpisode } from './types';

interface PodcastPlayerProps {
  currentEpisode: PodcastEpisode | null;
  isPlaying: boolean;
  onTogglePlayPause: () => void;
}

const PodcastPlayer = ({ currentEpisode, isPlaying, onTogglePlayPause }: PodcastPlayerProps) => {
  if (!currentEpisode) return null;

  return (
    <div className="bg-purple-50 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-purple-800 mb-1">Now Playing</h3>
      <p className="text-sm text-purple-600 mb-2">{currentEpisode.title}</p>
      <div className="flex items-center gap-3">
        <Button
          onClick={onTogglePlayPause}
          size="sm"
          className="bg-purple-500 hover:bg-purple-600"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <span className="text-sm text-purple-600">{currentEpisode.duration}</span>
      </div>
    </div>
  );
};

export default PodcastPlayer;
