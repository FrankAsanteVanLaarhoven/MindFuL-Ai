
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { useTranslation } from 'react-i18next';
import './i18n'; // Import i18n configuration

import Index from './pages/Index';
import Breathing from './pages/Breathing';
import Journal from './pages/Journal';
import TherapyBot from './pages/TherapyBot';
import Teletherapy from './pages/Teletherapy';
import MoodAnalysis from './pages/MoodAnalysis';
import MoodAnalysisEnhanced from './pages/MoodAnalysisEnhanced';
import WellnessDashboard from './pages/WellnessDashboard';
import PersonalizedDashboard from './pages/PersonalizedDashboard';
import Community from './pages/Community';
import GlobalFeatures from './pages/GlobalFeatures';
import AdvancedWeatherDashboard from './pages/AdvancedWeatherDashboard';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function AppContent() {
  const { i18n } = useTranslation();
  
  // Update document direction based on language
  React.useEffect(() => {
    if (['ar', 'ur'].includes(i18n.language)) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = i18n.language;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/breathing" element={<Breathing />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/therapy-bot" element={<TherapyBot />} />
            <Route path="/teletherapy" element={<Teletherapy />} />
            <Route path="/mood-analysis" element={<MoodAnalysis />} />
            <Route path="/mood-analysis-enhanced" element={<MoodAnalysisEnhanced />} />
            <Route path="/wellness-dashboard" element={<WellnessDashboard />} />
            <Route path="/personalized-dashboard" element={<PersonalizedDashboard />} />
            <Route path="/community" element={<Community />} />
            <Route path="/global-features" element={<GlobalFeatures />} />
            <Route path="/advanced-weather" element={<AdvancedWeatherDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
