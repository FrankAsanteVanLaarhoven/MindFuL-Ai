
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Globe, 
  CloudSun, 
  Clock, 
  Languages, 
  ChevronDown, 
  Brain,
  Heart,
  Users,
  BookOpen,
  Activity,
  Stethoscope,
  MessageCircle,
  BarChart3,
  Zap
} from 'lucide-react';

const NavigationBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="relative z-20 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Brain className="w-8 h-8 text-white mr-2" />
              <h1 className="text-xl font-bold text-white">AI Wellness Platform</h1>
            </div>
          </div>
          
          <div className="flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-1">
                {/* Therapy Menu */}
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

                {/* Wellness Menu */}
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

                {/* Community Menu */}
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
                        onClick={() => document.getElementById('weather-widget')?.scrollIntoView({ behavior: 'smooth' })}
                        className="block px-3 py-2 text-sm text-gray-800 hover:bg-blue-50 rounded cursor-pointer"
                      >
                        <CloudSun className="w-4 h-4 inline mr-2" />
                        Weather & Air Quality
                      </NavigationMenuLink>
                      <NavigationMenuLink 
                        onClick={() => document.getElementById('world-clock-widget')?.scrollIntoView({ behavior: 'smooth' })}
                        className="block px-3 py-2 text-sm text-gray-800 hover:bg-blue-50 rounded cursor-pointer"
                      >
                        <Clock className="w-4 h-4 inline mr-2" />
                        World Clock
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Global Features Dropdown */}
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
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
