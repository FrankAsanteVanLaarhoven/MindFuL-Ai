
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
    <nav className="bg-white/80 backdrop-blur-sm border-b border-teal-200 sticky top-0 z-50 safe-area-top">
      <div className="responsive-container">
        <div className="flex justify-between items-center h-16 tablet-nav desktop-nav">
          {/* Logo - Touch-friendly */}
          <div className="flex items-center gap-2 sm:gap-3 touch-target">
            <span className="text-xl sm:text-2xl">🧠</span>
            <span className="adaptive-text font-bold text-teal-800">Mindful AI</span>
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
                  <NavigationMenuTrigger className="text-gray-600 hover:text-teal-600 mobile-friendly-button">
                    ⚡ Instant Access
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 bg-white/95 backdrop-blur-sm">
                      {quickActions.map((action) => (
                        <button
                          key={action.title}
                          onClick={() => navigate(action.href)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors mobile-friendly-button desktop-hover focus-visible"
                        >
                          {typeof action.icon === 'string' ? (
                            <span className="text-lg">{action.icon}</span>
                          ) : (
                            <action.icon className={`w-5 h-5 ${action.color}`} />
                          )}
                          <div className="text-left">
                            <div className="font-medium adaptive-text">{action.title}</div>
                            <div className="text-sm text-gray-600">{action.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-600 hover:text-teal-600 mobile-friendly-button">
                    📚 Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[800px] p-4 bg-white/95 backdrop-blur-sm">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ipad-layout">
                        <div className="space-y-3">
                          {resources.map((resource) => (
                            <button
                              key={resource.title}
                              onClick={() => navigate(resource.href)}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors w-full mobile-friendly-button desktop-hover focus-visible"
                            >
                              <resource.icon className={`w-5 h-5 ${resource.color}`} />
                              <div className="text-left">
                                <div className="font-medium adaptive-text">{resource.title}</div>
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

                {/* Regular Navigation - Touch-friendly */}
                <NavigationMenuItem>
                  <button
                    onClick={() => navigate('/journal')}
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200 text-sm font-medium mobile-friendly-button focus-visible"
                  >
                    📝 Journal
                  </button>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <button
                    onClick={() => navigate('/wellness-dashboard')}
                    className="text-gray-600 hover:text-teal-600 transition-colors duration-200 text-sm font-medium mobile-friendly-button focus-visible"
                  >
                    📊 Dashboard
                  </button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Button - Enhanced touch target */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden mobile-friendly-button focus-visible"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu - Enhanced for touch */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-teal-200 shadow-lg safe-area-left safe-area-right">
            <div className="device-padding py-6 space-y-6">
              {/* Quick Actions */}
              <div>
                <h3 className="font-semibold text-teal-800 mb-3 flex items-center gap-2 adaptive-text">
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
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors w-full mobile-nav-item mobile-friendly-button focus-visible"
                    >
                      {typeof action.icon === 'string' ? (
                        <span className="text-lg">{action.icon}</span>
                      ) : (
                        <action.icon className={`w-5 h-5 ${action.color}`} />
                      )}
                      <div className="text-left">
                        <div className="font-medium adaptive-text">{action.title}</div>
                        <div className="text-xs text-gray-600">{action.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div>
                <h3 className="font-semibold text-teal-800 mb-3 flex items-center gap-2 adaptive-text">
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
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors w-full mobile-nav-item mobile-friendly-button focus-visible"
                    >
                      <resource.icon className={`w-5 h-5 ${resource.color}`} />
                      <div className="text-left">
                        <div className="font-medium adaptive-text">{resource.title}</div>
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
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors w-full mobile-nav-item mobile-friendly-button focus-visible"
                >
                  <span className="text-lg">📝</span>
                  <span className="font-medium adaptive-text">Journal</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/wellness-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors w-full mobile-nav-item mobile-friendly-button focus-visible"
                >
                  <span className="text-lg">📊</span>
                  <span className="font-medium adaptive-text">Dashboard</span>
                </button>
              </div>

              {/* API Configuration */}
              <div className="border-t border-teal-200 pt-4">
                <h3 className="font-semibold text-teal-800 mb-3 flex items-center gap-2 adaptive-text">
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
