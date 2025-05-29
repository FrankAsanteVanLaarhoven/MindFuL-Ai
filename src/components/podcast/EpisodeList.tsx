
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { PodcastShow, PodcastEpisode } from './types';

interface EpisodeListProps {
  selectedPodcast: PodcastShow | null;
  onClose: () => void;
  onPlayEpisode: (episode: PodcastEpisode) => void;
}

const EpisodeList = ({ selectedPodcast, onClose, onPlayEpisode }: EpisodeListProps) => {
  if (!selectedPodcast) return null;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-purple-800">{selectedPodcast.name}</CardTitle>
            <CardDescription>Episodes by {selectedPodcast.host}</CardDescription>
          </div>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {selectedPodcast.episodes.map((episode) => (
            <div key={episode.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800">{episode.title}</h4>
                <span className="text-sm text-gray-500">{episode.duration}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{episode.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{episode.date}</span>
                <Button
                  size="sm"
                  onClick={() => onPlayEpisode(episode)}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Play
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EpisodeList;
