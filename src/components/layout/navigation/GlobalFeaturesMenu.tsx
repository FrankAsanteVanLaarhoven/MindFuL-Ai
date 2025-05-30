
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavigationMenuItem } from '@/components/ui/navigation-menu';
import { Globe, CloudSun, Clock, Languages, ChevronDown } from 'lucide-react';

const GlobalFeaturesMenu = () => {
  const navigate = useNavigate();

  return (
    <NavigationMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 hover:text-white flex items-center gap-2 bg-transparent border-none"
          >
            <Globe className="w-4 h-4" />
            Global Features
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="bg-white/95 backdrop-blur-md border border-white/20 shadow-lg z-50"
          align="end"
        >
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer hover:bg-blue-50"
            onClick={() => navigate('/global-features')}
          >
            <Globe className="w-4 h-4 text-blue-500" />
            Global Features Hub
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer hover:bg-blue-50"
            onClick={() => {
              navigate('/global-features');
              setTimeout(() => {
                document.getElementById('weather-widget')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            <CloudSun className="w-4 h-4 text-orange-500" />
            Weather & Air Quality
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer hover:bg-blue-50"
            onClick={() => {
              navigate('/global-features');
              setTimeout(() => {
                document.getElementById('world-clock-widget')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            <Clock className="w-4 h-4 text-indigo-500" />
            World Clock
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer hover:bg-blue-50"
            onClick={() => {
              navigate('/global-features');
              setTimeout(() => {
                document.getElementById('localization-widget')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            <Languages className="w-4 h-4 text-blue-500" />
            Localization
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </NavigationMenuItem>
  );
};

export default GlobalFeaturesMenu;
