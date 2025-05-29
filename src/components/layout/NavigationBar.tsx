
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Brain, Bot, Users, Video, Podcast, Key, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ResourcesPanel from '@/components/ResourcesPanel';
import AIKeyManager from '@/components/AIKeyManager';
import PerplexityKeyManager from '@/components/PerplexityKeyManager';

const NavigationBar = () => {
  const navigate = useNavigate();
  const [openaiApiKey, setOpenaiApiKey] = useState<string | null>(null);
  const [perplexityApiKey, setPerplexityApiKey] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const quickActions = [
    { title: 'AI Therapy Bot', href: '/therapy-bot', icon: Bot, color: 'text-purple-600', desc: 'Instant CBT/DBT support' },
    { title: 'Quick Mood Check', href: '/mood-analysis', icon: Brain, color: 'text-blue-600', desc: 'Instant mood analysis' },
    { title: 'Emergency Calm', href: '/breathing', icon: '🫁', color: '', desc: 'Instant breathing exercises' },
  ];

  const resources = [
    { title: 'Community Forums', href: '/community', icon: Users, color: 'text-green-600', desc: 'Connect with peers & support groups' },
    { title: 'Mental Health Podcasts', href: '/community', icon: Podcast, color: 'text-purple-600', desc: 'Curated CBT & wellness podcasts' },
    { title: 'Professional Therapy', href: '/teletherapy', icon: Video, color: 'text-blue-600', desc: 'Book sessions with licensed therapists' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-teal-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl">🧠</span>
            <span className="text-lg sm:text-xl font-bold text-teal-800">Mindful AI</span>
            <div className="hidden sm:block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
              🟢 24/7 AI Available
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center space-x-6">
                {/* Instant Access */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-600 hover:text-teal-600">
                    ⚡ Instant Access
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      {quickActions.map((action) => (
                        <button
                          key={action.title}
                          onClick={() => navigate(action.href)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors"
                        >
                          {typeof action.icon === 'string' ? (
                            <span className="text-lg">{action.icon}</span>
                          ) : (
                            <action.icon className={`w-5 h-5 ${action.color}`} />
                          )}
                          <div className="text-left">
                            <div className="font-medium">{action.title}</div>
                            <div className="text-sm text-gray-600">{action.desc}</div>
                          </div>
                        </button>
                      ))}
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
                          {resources.map((resource) => (
                            <button
                              key={resource.title}
                              onClick={() => navigate(resource.href)}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors w-full"
                            >
                              <resource.icon className={`w-5 h-5 ${resource.color}`} />
                              <div className="text-left">
                                <div className="font-medium">{resource.title}</div>
                                <div className="text-sm text-gray-600">{resource.desc}</div>
                              </div>
                            </button>
                          ))}
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

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-teal-200 shadow-lg">
            <div className="px-4 py-6 space-y-6">
              {/* Quick Actions */}
              <div>
                <h3 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                  ⚡ Instant Access
                </h3>
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.title}
                      onClick={() => {
                        navigate(action.href);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors w-full"
                    >
                      {typeof action.icon === 'string' ? (
                        <span className="text-lg">{action.icon}</span>
                      ) : (
                        <action.icon className={`w-5 h-5 ${action.color}`} />
                      )}
                      <div className="text-left">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-gray-600">{action.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h3 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                  📚 Resources
                </h3>
                <div className="space-y-2">
                  {resources.map((resource) => (
                    <button
                      key={resource.title}
                      onClick={() => {
                        navigate(resource.href);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors w-full"
                    >
                      <resource.icon className={`w-5 h-5 ${resource.color}`} />
                      <div className="text-left">
                        <div className="font-medium text-sm">{resource.title}</div>
                        <div className="text-xs text-gray-600">{resource.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Regular Navigation */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate('/journal');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors w-full"
                >
                  <span className="text-lg">📝</span>
                  <span className="font-medium text-sm">Journal</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/wellness-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors w-full"
                >
                  <span className="text-lg">📊</span>
                  <span className="font-medium text-sm">Dashboard</span>
                </button>
              </div>

              {/* API Configuration */}
              <div className="border-t border-teal-200 pt-4">
                <h3 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  AI Configuration
                </h3>
                <div className="space-y-3">
                  <AIKeyManager onApiKeyChange={setOpenaiApiKey} />
                  <PerplexityKeyManager onApiKeyChange={setPerplexityApiKey} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
