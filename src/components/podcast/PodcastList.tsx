
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ExternalLink } from 'lucide-react';
import { PodcastShow } from './types';
import { getCategoryColor } from './utils';

interface PodcastListProps {
  podcasts: PodcastShow[];
  onSelectPodcast: (podcast: PodcastShow) => void;
  onToggleFavorite: (podcastId: string) => void;
}

const PodcastList = ({ podcasts, onSelectPodcast, onToggleFavorite }: PodcastListProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Discover Podcasts</h3>
      <div className="space-y-4">
        {podcasts.map((podcast) => (
          <div key={podcast.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-800">{podcast.name}</h4>
                <p className="text-sm text-gray-600">by {podcast.host}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(podcast.category)}>
                  {podcast.category}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onToggleFavorite(podcast.id)}
                >
                  <Heart 
                    className={`w-4 h-4 ${podcast.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                  />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{podcast.description}</p>
            <div className="flex gap-2">
              <Button 
                size="sm"
                onClick={() => onSelectPodcast(podcast)}
              >
                View Episodes
              </Button>
              {podcast.websiteUrl && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(podcast.websiteUrl, '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Website
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastList;
