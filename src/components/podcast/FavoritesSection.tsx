
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ExternalLink } from 'lucide-react';
import { PodcastShow } from './types';
import { getCategoryColor } from './utils';

interface FavoritesSectionProps {
  favoritePodcasts: PodcastShow[];
  onSelectPodcast: (podcast: PodcastShow) => void;
}

const FavoritesSection = ({ favoritePodcasts, onSelectPodcast }: FavoritesSectionProps) => {
  if (favoritePodcasts.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Heart className="w-4 h-4 text-red-500" />
        Your Favorites
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favoritePodcasts.map((podcast) => (
          <Card key={podcast.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-sm">{podcast.name}</CardTitle>
                  <p className="text-xs text-gray-600">by {podcast.host}</p>
                </div>
                <Badge className={getCategoryColor(podcast.category)}>
                  {podcast.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-2">{podcast.description}</p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onSelectPodcast(podcast)}
                >
                  Episodes
                </Button>
                {podcast.websiteUrl && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => window.open(podcast.websiteUrl, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoritesSection;
