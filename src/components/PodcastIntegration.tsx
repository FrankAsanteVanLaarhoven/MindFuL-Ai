import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Podcast, Search, ExternalLink, BookOpen } from 'lucide-react';
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

  const cbtResources = [
    {
      title: "CBT Podcasts Directory",
      description: "Comprehensive list of CBT-focused podcasts",
      url: "https://podcast.feedspot.com/cbt_podcasts/"
    },
    {
      title: "Unplug Anxiety",
      description: "CBT and anxiety management resources",
      url: "https://unpluganxiety.com/"
    },
    {
      title: "BABCP Podcasts",
      description: "British Association for Behavioural & Cognitive Psychotherapies",
      url: "https://babcp.com/Podcasts"
    },
    {
      title: "Top CBT Shows",
      description: "Top 100 CBT podcasts ranked by popularity",
      url: "https://goodpods.com/leaderboard/top-100-shows-by-category/other/cbt"
    }
  ];

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

          {/* CBT Resources Section */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                CBT Podcast Resources
              </CardTitle>
              <CardDescription>
                External directories and collections of CBT-focused podcasts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {cbtResources.map((resource, index) => (
                  <div key={index} className="border border-blue-200 rounded-lg p-4 bg-white/60">
                    <h4 className="font-semibold text-gray-800 mb-2">{resource.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(resource.url, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="w-3 h-3 mr-2" />
                      Visit Resource
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
