
import React from 'react';
import NavigationBar from '@/components/layout/NavigationBar';
import PersonalizedDashboard from '@/components/personalization/PersonalizedDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PersonalizedDashboardPage = () => {
  const { userProfile, loading } = useUserProfile();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your personalized content...</div>
      </div>
    );
  }

  if (!userProfile || !userProfile.onboardingCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <NavigationBar />
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl mx-4 mt-8 p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Personalized Dashboard</h1>
            <p className="text-white/80 text-lg mb-6">
              Please complete your profile setup to access personalized content.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-600/90 hover:to-blue-600/90 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <NavigationBar />
      
      {/* Enhanced glassmorphism background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 backdrop-blur-[2px]"></div>
      
      {/* Back Button */}
      <div className="relative z-10 px-4 pt-4">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="text-white/80 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>

      {/* Personalized Dashboard Content */}
      <div className="relative z-10 p-4">
        <PersonalizedDashboard userProfile={userProfile} />
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse backdrop-blur-sm"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000 backdrop-blur-sm"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse delay-500 backdrop-blur-sm"></div>
      </div>
    </div>
  );
};

export default PersonalizedDashboardPage;
