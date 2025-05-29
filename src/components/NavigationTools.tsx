
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const NavigationTools = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define the page order for next/previous navigation
  const pages = [
    { path: '/', name: 'Home', icon: '🏠' },
    { path: '/mood-analysis', name: 'Mood Analysis', icon: '🧠' },
    { path: '/therapy-bot', name: 'Therapy Bot', icon: '🤖' },
    { path: '/breathing', name: 'Breathing', icon: '🫁' },
    { path: '/journal', name: 'Journal', icon: '📝' },
    { path: '/wellness-dashboard', name: 'Dashboard', icon: '📊' }
  ];

  const currentPageIndex = pages.findIndex(page => page.path === location.pathname);

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
      toast({
        title: "Navigated to Home",
        description: "No previous page available.",
      });
    }
  };

  const goForward = () => {
    navigate(1);
  };

  const goToNextPage = () => {
    if (currentPageIndex >= 0 && currentPageIndex < pages.length - 1) {
      const nextPage = pages[currentPageIndex + 1];
      navigate(nextPage.path);
      toast({
        title: `Navigated to ${nextPage.name}`,
        description: `${nextPage.icon} ${nextPage.name}`,
      });
    } else {
      toast({
        title: "End of Pages",
        description: "You're on the last page.",
        variant: "destructive"
      });
    }
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      const previousPage = pages[currentPageIndex - 1];
      navigate(previousPage.path);
      toast({
        title: `Navigated to ${previousPage.name}`,
        description: `${previousPage.icon} ${previousPage.name}`,
      });
    } else {
      toast({
        title: "Start of Pages",
        description: "You're on the first page.",
        variant: "destructive"
      });
    }
  };

  const goHome = () => {
    navigate('/');
    toast({
      title: "Navigated to Home",
      description: "🏠 Welcome back to the main page!",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white/90 backdrop-blur-sm border border-teal-200 rounded-full shadow-lg p-2 flex items-center gap-2">
        {/* Browser Back/Forward */}
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="rounded-full w-10 h-10 p-0 hover:bg-teal-100"
          title="Go Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={goForward}
          className="rounded-full w-10 h-10 p-0 hover:bg-teal-100"
          title="Go Forward"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Previous/Next Page */}
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPageIndex <= 0}
          className="rounded-full w-10 h-10 p-0 hover:bg-teal-100 disabled:opacity-50"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPageIndex >= pages.length - 1 || currentPageIndex < 0}
          className="rounded-full w-10 h-10 p-0 hover:bg-teal-100 disabled:opacity-50"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Separator */}
        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Home Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={goHome}
          className="rounded-full w-10 h-10 p-0 hover:bg-teal-100"
          title="Go Home"
        >
          <Home className="w-4 h-4" />
        </Button>

        {/* Page Indicator */}
        {currentPageIndex >= 0 && (
          <>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <div className="px-3 py-1 text-xs text-teal-700 font-medium">
              {currentPageIndex + 1}/{pages.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NavigationTools;
