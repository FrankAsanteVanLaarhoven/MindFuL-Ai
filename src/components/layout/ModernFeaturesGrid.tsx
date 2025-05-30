
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ModernFeaturesGrid = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🧠',
      title: 'AI Brain Trainer',
      description: 'Personalized cognitive exercises and AI-driven insights to sharpen your mind and boost productivity.',
      badges: ['⚡ Cognitive Workouts', '📊 Performance Tracking', '🤖 AI Recommendations'],
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      href: '/therapy-bot'
    },
    {
      icon: '🫁',
      title: 'Breathing Mastery',
      description: 'Advanced breathing techniques with real-time biofeedback and AI guidance to reduce stress and enhance focus.',
      badges: ['🧘 Guided Exercises', '📈 Progress Tracking', '📹 Biofeedback Analysis'],
      gradient: 'from-green-400 via-green-500 to-green-600',
      href: '/breathing'
    },
    {
      icon: '✍️',
      title: 'Mood Journal',
      description: 'Reflect on your day and gain deeper insights into your emotional patterns with AI-powered sentiment analysis.',
      badges: ['📝 Daily Reflections', '🎭 Sentiment Analysis', '📊 Mood Tracking'],
      gradient: 'from-pink-400 via-pink-500 to-pink-600',
      href: '/journal'
    },
    {
      icon: '🤝',
      title: 'Virtual Community',
      description: 'Connect with like-minded individuals, share your journey, and find support in a safe and inclusive virtual space.',
      badges: ['💬 Group Discussions', '🫂 Peer Support', '🌟 Shared Experiences'],
      gradient: 'from-orange-400 via-orange-500 to-orange-600',
      href: '/community'
    },
    {
      icon: '🧠',
      title: 'AI Wellness Platform',
      description: 'Advanced mood mapping, open data science, public API, and world-class accessibility features.',
      badges: ['🗺️ Mood Journey Maps', '🔬 Open Science Mode', '🔧 Public API', '♿ Full Accessibility'],
      gradient: 'from-purple-400 via-purple-500 to-purple-600',
      href: '/mood-analysis-enhanced'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Choose Your Technique</h2>
        <p className="text-xl text-white/80">Select a wellness approach that matches your goals</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card
            key={feature.title}
            className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-gradient-to-br ${feature.gradient} text-white group`}
            onClick={() => navigate(feature.href)}
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
            
            <CardHeader className="relative z-10 text-center pb-4">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                {feature.title}
              </CardTitle>
              <p className="text-white/90 text-sm leading-relaxed">
                {feature.description}
              </p>
            </CardHeader>
            
            <CardContent className="relative z-10 pt-0">
              <div className="flex flex-wrap gap-2 justify-center">
                {feature.badges.map((badge, badgeIndex) => (
                  <Badge
                    key={badgeIndex}
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm text-xs"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModernFeaturesGrid;
