
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, CloudSun, Clock, Languages, ChevronDown } from 'lucide-react';

const NavigationBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="relative z-20 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white">AI Wellness</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/therapy-bot')}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              Therapy
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/breathing')}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              Breathing
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/journal')}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              Journal
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 hover:text-white flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Global Features
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="bg-white/95 backdrop-blur-md border border-white/20 shadow-lg"
                align="end"
              >
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer hover:bg-blue-50"
                  onClick={() => document.getElementById('weather-widget')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <CloudSun className="w-4 h-4 text-orange-500" />
                  Weather & Air Quality
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer hover:bg-blue-50"
                  onClick={() => document.getElementById('world-clock-widget')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Clock className="w-4 h-4 text-indigo-500" />
                  World Clock
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer hover:bg-blue-50"
                  onClick={() => document.getElementById('localization-widget')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Languages className="w-4 h-4 text-blue-500" />
                  Localization
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/wellness-dashboard')}
              className="text-white hover:bg-white/20 hover:text-white"
            >
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
