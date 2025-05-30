
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';

const TestimonialsSection = () => {
  const [api, setApi] = React.useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    // Auto-scroll from right to left every 3 seconds
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  const testimonials = [
    {
      name: "Sarah M.",
      location: "Canada",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b194?w=60&h=60&fit=crop&crop=face",
      text: "Mindful AI has been a game-changer for my mental health journey. The diverse community makes me feel understood and supported."
    },
    {
      name: "Marcus J.",
      location: "USA",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      text: "The therapy bot really understands my cultural background. It's amazing to have AI that's inclusive and respectful."
    },
    {
      name: "Aisha K.",
      location: "UK",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&h=60&fit=crop&crop=face",
      text: "Finally, a mental health platform that celebrates diversity. The breathing exercises help me stay centered every day."
    },
    {
      name: "Diego R.",
      location: "Spain",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      text: "The AI wellness platform has transformed how I approach self-care. The mood tracking features are incredibly insightful."
    },
    {
      name: "Priya S.",
      location: "India",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
      text: "I love how this platform adapts to my needs. The personalized recommendations have helped me build better mental health habits."
    }
  ];

  return (
    <div className="mt-12 sm:mt-16 mb-8 sm:mb-12 px-4 sm:px-0">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-teal-800 mb-6 sm:mb-8">
        What Our Community Says
      </h2>
      
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-5xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="bg-white/80 backdrop-blur-sm border-teal-200 shadow-lg h-full">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <img 
                      src={testimonial.image}
                      alt={`${testimonial.name} from ${testimonial.location}`}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-800 text-sm sm:text-base">{testimonial.name}</div>
                      <div className="text-xs sm:text-sm text-gray-600">{testimonial.location}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default TestimonialsSection;
