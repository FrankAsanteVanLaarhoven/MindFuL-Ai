
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { Users, Settings } from 'lucide-react';

const CommunityMenu = () => {
  const navigate = useNavigate();

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="text-white hover:bg-white/20 hover:text-white bg-transparent border-none">
        <Users className="w-4 h-4 mr-2" />
        Community
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-white/95 backdrop-blur-md border border-white/20 shadow-lg min-w-[200px]">
        <div className="p-2">
          <NavigationMenuLink 
            onClick={() => navigate('/community')}
            className="block px-3 py-2 text-sm text-gray-800 hover:bg-blue-50 rounded cursor-pointer"
          >
            <Users className="w-4 h-4 inline mr-2" />
            Community Hub
          </NavigationMenuLink>
          <NavigationMenuLink 
            onClick={() => document.getElementById('personalization-dropdown')?.click()}
            className="block px-3 py-2 text-sm text-gray-800 hover:bg-blue-50 rounded cursor-pointer"
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Personalization
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default CommunityMenu;
