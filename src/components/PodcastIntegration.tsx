
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Podcast, Search } from 'lucide-react';
import { PodcastShow, PodcastEpisode } from './podcast/types';
import PodcastPlayer from './podcast/PodcastPlayer';
import FavoritesSection from './podcast/FavoritesSection';
import PodcastList from './podcast/PodcastList';
import EpisodeList from './podcast/EpisodeList';

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
          <PodcastPlayer 
            currentEpisode={currentEpisode}
            isPlaying={isPlaying}
            onTogglePlayPause={togglePlayPause}
          />

          {/* Favorites Section */}
          <FavoritesSection 
            favoritePodcasts={favoritePodcasts}
            onSelectPodcast={setSelectedPodcast}
          />

          {/* All Podcasts */}
          <PodcastList 
            podcasts={filteredPodcasts}
            onSelectPodcast={setSelectedPodcast}
            onToggleFavorite={toggleFavorite}
          />
        </CardContent>
      </Card>

      {/* Episode List Modal/Panel */}
      <EpisodeList 
        selectedPodcast={selectedPodcast}
        onClose={() => setSelectedPodcast(null)}
        onPlayEpisode={playEpisode}
      />
    </div>
  );
};

export default PodcastIntegration;
