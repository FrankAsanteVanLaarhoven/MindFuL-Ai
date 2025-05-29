
export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  audioUrl?: string;
}

export interface PodcastShow {
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
