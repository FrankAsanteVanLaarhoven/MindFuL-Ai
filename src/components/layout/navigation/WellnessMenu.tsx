
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { Heart, Zap, BookOpen, BarChart3 } from 'lucide-react';

const WellnessMenu = () => {
  const navigate = useNavigate();

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="text-white hover:bg-white/20 hover:text-white bg-transparent border-none">
        <Heart className="w-4 h-4 mr-2" />
        Wellness
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-white/95 backdrop-blur-md border border-white/20 shadow-lg min-w-[200px]">
        <div className="p-2">
          <NavigationMenuLink 
            onClick={() => navigate('/breathing')}
            className="block px-3 py-2 text-sm text-gray-800 hover:bg-blue-50 rounded cursor-pointer"
          >
            <Zap className="w-4 h-4 inline mr-2" />
            Breathing Exercises
          </NavigationMenuLink>
          <NavigationMenuLink 
            onClick={() => navigate('/journal')}
            className="block px-3 py-2 text-sm text-gray-800 hover:bg-blue-50 rounded cursor-pointer"
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Journal
          </NavigationMenuLink>
          <NavigationMenuLink 
            onClick={() => navigate('/wellness-dashboard')}
            className="block px-3 py-2 text-sm text-gray-800 hover:bg-blue-50 rounded cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Dashboard
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default WellnessMenu;
