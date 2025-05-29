
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { gsap } from 'gsap';

const FeaturesGrid = () => {
  const navigate = useNavigate();
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Stagger animate cards
    gsap.fromTo(cardsRef.current,
      { y: 50, opacity: 0, scale: 0.9 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 0.8, 
        ease: "back.out(1.7)",
        stagger: 0.2,
        delay: 0.5
      }
    );
  }, []);

  const features = [
    {
      icon: '🧠',
      title: 'Mood Analysis',
      description: 'Real-time mood analysis using voice, text, and facial recognition via smartphone to detect emotional states.',
      href: '/mood-analysis',
      color: 'from-blue-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop&crop=face'
    },
    {
      icon: '🤖',
      title: 'Therapy Bot',
      description: 'Personalized Cognitive Behavioral Therapy (CBT) and Dialectical Behavior Therapy (DBT) driven therapy bots.',
      href: '/therapy-bot',
      color: 'from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face'
    },
    {
      icon: '🫁',
      title: 'Breathing Exercises',
      description: 'Guided breathing exercises with interactive animations to promote calmness and reduce stress.',
      href: '/breathing',
      color: 'from-teal-500 to-green-500',
      image: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400&h=300&fit=crop&crop=face'
    },
    {
      icon: '📝',
      title: 'Journal',
      description: 'Write down your thoughts and feelings. Our AI can offer gentle reflections to help you gain insights.',
      href: '/journal',
      color: 'from-orange-500 to-red-500',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop&crop=face'
    }
  ];

  const navigateToFeature = (href: string) => {
    navigate(href);
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((feature, index) => (
          <div 
            key={feature.title}
            ref={el => { if (el) cardsRef.current[index] = el; }}
          >
            <Card 
              className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-full overflow-hidden"
              onClick={() => navigateToFeature(feature.href)}
            >
              <div className="relative">
                <img 
                  src={feature.image}
                  alt={`${feature.title} feature`}
                  className="w-full h-28 sm:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 sm:p-2">
                  <span className="text-lg sm:text-xl">{feature.icon}</span>
                </div>
              </div>
              <CardHeader className="text-center pb-2 sm:pb-4 px-3 sm:px-6">
                <CardTitle className="text-base sm:text-lg text-teal-800">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-4 sm:pb-6">
                <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesGrid;
