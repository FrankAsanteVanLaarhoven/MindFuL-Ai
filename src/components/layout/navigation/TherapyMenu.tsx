
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { Stethoscope, MessageCircle, Activity } from 'lucide-react';

const TherapyMenu = () => {
  const navigate = useNavigate();

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="text-white hover:bg-white/20 hover:text-white bg-transparent border-none">
        <Stethoscope className="w-4 h-4 mr-2" />
        Therapy
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-white/95 backdrop-blur-md border border-white/20 shadow-lg min-w-[200px]">
        <div className="p-2">
          <NavigationMenuLink 
            onClick={() => navigate('/therapy-bot')}
            className="block px-3 py-2 text-sm text-gray-800 hover:bg-blue-50 rounded cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 inline mr-2" />
            AI Therapy Chat
          </NavigationMenuLink>
          <NavigationMenuLink 
            onClick={() => navigate('/mood-analysis')}
            className="block px-3 py-2 text-sm text-gray-800 hover:bg-blue-50 rounded cursor-pointer"
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Mood Analysis
          </NavigationMenuLink>
          <NavigationMenuLink 
            onClick={() => navigate('/teletherapy')}
            className="block px-3 py-2 text-sm text-gray-800 hover:bg-blue-50 rounded cursor-pointer"
          >
            <Stethoscope className="w-4 h-4 inline mr-2" />
            Teletherapy
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default TherapyMenu;
