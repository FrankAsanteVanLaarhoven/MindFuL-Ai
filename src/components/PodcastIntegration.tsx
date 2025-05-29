
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Podcast, Play, Pause, Heart, Search, Plus, ExternalLink } from 'lucide-react';

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  audioUrl?: string;
}

interface PodcastShow {
  id: string;
  name: string;
  host: string;
  category: 'mental-health' | 'meditation' | 'therapy' | 'wellness' | 'self-help';
  description: string;
  imageUrl?: string;
  isFavorite: boolean;
  episodes: PodcastEpisode[];
  websiteUrl?: string;
}

const PodcastIntegration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastShow | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sample podcast data - in a real app, this would come from an API
  const [podcasts, setPodcasts] = useState<PodcastShow[]>([
    {
      id: '1',
      name: 'The Anxiety Coaches Podcast',
      host: 'Gina Ryan',
      category: 'mental-health',
      description: 'Practical strategies for managing anxiety and building confidence',
      isFavorite: true,
      episodes: [
        {
          id: '1-1',
          title: 'Understanding Panic Attacks',
          description: 'Learn effective techniques to manage and prevent panic attacks',
          duration: '32:15',
          date: '2024-01-15'
        },
        {
          id: '1-2',
          title: 'Building Self-Confidence',
          description: 'Practical steps to boost your self-esteem and confidence',
          duration: '28:45',
          date: '2024-01-08'
        }
      ],
      websiteUrl: 'https://anxietycoaches.com'
    },
    {
      id: '2',
      name: 'Ten Percent Happier',
      host: 'Dan Harris',
      category: 'meditation',
      description: 'Meditation and mindfulness for skeptics and beginners',
      isFavorite: false,
      episodes: [
        {
          id: '2-1',
          title: 'Meditation for Beginners',
          description: 'Starting your meditation journey with simple practices',
          duration: '25:30',
          date: '2024-01-12'
        }
      ],
      websiteUrl: 'https://tenpercent.com'
    },
    {
      id: '3',
      name: 'Therapy for Black Girls',
      host: 'Dr. Joy Harden Bradford',
      category: 'therapy',
      description: 'Mental health topics relevant to Black women and girls',
      isFavorite: true,
      episodes: [
        {
          id: '3-1',
          title: 'Setting Boundaries',
          description: 'How to set healthy boundaries in relationships',
          duration: '35:20',
          date: '2024-01-10'
        }
      ],
      websiteUrl: 'https://therapyforblackgirls.com'
    }
  ]);

  const toggleFavorite = (podcastId: string) => {
    setPodcasts(prev => prev.map(podcast => 
      podcast.id === podcastId 
        ? { ...podcast, isFavorite: !podcast.isFavorite }
        : podcast
    ));
  };

  const playEpisode = (episode: PodcastEpisode) => {
    setCurrentEpisode(episode);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mental-health': return 'bg-blue-100 text-blue-800';
      case 'meditation': return 'bg-green-100 text-green-800';
      case 'therapy': return 'bg-purple-100 text-purple-800';
      case 'wellness': return 'bg-orange-100 text-orange-800';
      case 'self-help': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPodcasts = podcasts.filter(podcast =>
    podcast.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    podcast.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
    podcast.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoritePodcasts = podcasts.filter(podcast => podcast.isFavorite);

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
            <Podcast className="w-5 h-5" />
            Favorite Podcasts
          </CardTitle>
          <CardDescription>
            Discover and manage wellness podcasts for your mental health journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search podcasts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Current Episode Player */}
          {currentEpisode && (
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-purple-800 mb-1">Now Playing</h3>
              <p className="text-sm text-purple-600 mb-2">{currentEpisode.title}</p>
              <div className="flex items-center gap-3">
                <Button
                  onClick={togglePlayPause}
                  size="sm"
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <span className="text-sm text-purple-600">{currentEpisode.duration}</span>
              </div>
            </div>
          )}

          {/* Favorites Section */}
          {favoritePodcasts.length > 0 && (
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
                          onClick={() => setSelectedPodcast(podcast)}
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
          )}

          {/* All Podcasts */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Discover Podcasts</h3>
            <div className="space-y-4">
              {filteredPodcasts.map((podcast) => (
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
                        onClick={() => toggleFavorite(podcast.id)}
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
                      onClick={() => setSelectedPodcast(podcast)}
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
        </CardContent>
      </Card>

      {/* Episode List Modal/Panel */}
      {selectedPodcast && (
        <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl text-purple-800">{selectedPodcast.name}</CardTitle>
                <CardDescription>Episodes by {selectedPodcast.host}</CardDescription>
              </div>
              <Button variant="ghost" onClick={() => setSelectedPodcast(null)}>
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
                      onClick={() => playEpisode(episode)}
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
      )}
    </div>
  );
};

export default PodcastIntegration;
