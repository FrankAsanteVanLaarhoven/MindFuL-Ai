
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Brain, Bot, Users, Video, Podcast, Key } from 'lucide-react';
import ResourcesPanel from '@/components/ResourcesPanel';
import AIKeyManager from '@/components/AIKeyManager';
import PerplexityKeyManager from '@/components/PerplexityKeyManager';

const NavigationBar = () => {
  const navigate = useNavigate();
  const [openaiApiKey, setOpenaiApiKey] = useState<string | null>(null);
  const [perplexityApiKey, setPerplexityApiKey] = useState<string | null>(null);

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-teal-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧠</span>
            <span className="text-xl font-bold text-teal-800">Mindful AI</span>
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
              🟢 24/7 AI Available
            </div>
          </div>
          
          <NavigationMenu>
            <NavigationMenuList className="flex items-center space-x-6">
              {/* Instant Access */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-600 hover:text-teal-600">
                  ⚡ Instant Access
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <button
                      onClick={() => navigate('/therapy-bot')}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors"
                    >
                      <Bot className="w-5 h-5 text-purple-600" />
                      <div className="text-left">
                        <div className="font-medium">AI Therapy Bot</div>
                        <div className="text-sm text-gray-600">Instant CBT/DBT support</div>
                      </div>
                    </button>
                    <button
                      onClick={() => navigate('/mood-analysis')}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors"
                    >
                      <Brain className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <div className="font-medium">Quick Mood Check</div>
                        <div className="text-sm text-gray-600">Instant mood analysis</div>
                      </div>
                    </button>
                    <button
                      onClick={() => navigate('/breathing')}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors"
                    >
                      <span className="text-lg">🫁</span>
                      <div className="text-left">
                        <div className="font-medium">Emergency Calm</div>
                        <div className="text-sm text-gray-600">Instant breathing exercises</div>
                      </div>
                    </button>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Resources */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-600 hover:text-teal-600">
                  📚 Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[800px] p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <button
                          onClick={() => navigate('/community')}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors w-full"
                        >
                          <Users className="w-5 h-5 text-green-600" />
                          <div className="text-left">
                            <div className="font-medium">Community Forums</div>
                            <div className="text-sm text-gray-600">Connect with peers & support groups</div>
                          </div>
                        </button>
                        <button
                          onClick={() => navigate('/community')}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors w-full"
                        >
                          <Podcast className="w-5 h-5 text-purple-600" />
                          <div className="text-left">
                            <div className="font-medium">Mental Health Podcasts</div>
                            <div className="text-sm text-gray-600">Curated CBT & wellness podcasts</div>
                          </div>
                        </button>
                        <button
                          onClick={() => navigate('/teletherapy')}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors w-full"
                        >
                          <Video className="w-5 h-5 text-blue-600" />
                          <div className="text-left">
                            <div className="font-medium">Professional Therapy</div>
                            <div className="text-sm text-gray-600">Book sessions with licensed therapists</div>
                          </div>
                        </button>
                      </div>
                      <div>
                        <ResourcesPanel />
                      </div>
                      <div className="space-y-4">
                        <div className="border-l-2 border-blue-200 pl-4">
                          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            AI Configuration
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">Configure your AI API keys for enhanced features</p>
                        </div>
                        <AIKeyManager onApiKeyChange={setOpenaiApiKey} />
                        <PerplexityKeyManager onApiKeyChange={setPerplexityApiKey} />
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Regular Navigation */}
              <NavigationMenuItem>
                <button
                  onClick={() => navigate('/journal')}
                  className="text-gray-600 hover:text-teal-600 transition-colors duration-200 text-sm font-medium"
                >
                  📝 Journal
                </button>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <button
                  onClick={() => navigate('/wellness-dashboard')}
                  className="text-gray-600 hover:text-teal-600 transition-colors duration-200 text-sm font-medium"
                >
                  📊 Dashboard
                </button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
