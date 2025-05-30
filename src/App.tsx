
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import NavigationTools from "./components/NavigationTools";
import Index from "./pages/Index";
import Breathing from "./pages/Breathing";
import MoodAnalysis from "./pages/MoodAnalysis";
import MoodAnalysisEnhanced from "./pages/MoodAnalysisEnhanced";
import TherapyBot from "./pages/TherapyBot";
import Journal from "./pages/Journal";
import WellnessDashboard from "./pages/WellnessDashboard";
import Community from "./pages/Community";
import Teletherapy from "./pages/Teletherapy";
import GlobalFeatures from "./pages/GlobalFeatures";
import AdvancedWeatherDashboard from "./pages/AdvancedWeatherDashboard";
import PersonalizedDashboard from "./pages/PersonalizedDashboard";
import NotFound from "./pages/NotFound";

// Initialize i18n
import "./i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <BrowserRouter>
          <NavigationTools />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mood-analysis" element={<MoodAnalysis />} />
            <Route path="/mood-analysis-enhanced" element={<MoodAnalysisEnhanced />} />
            <Route path="/breathing" element={<Breathing />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/community" element={<Community />} />
            <Route path="/teletherapy" element={<Teletherapy />} />
            <Route path="/therapy-bot" element={<TherapyBot />} />
            <Route path="/wellness-dashboard" element={<WellnessDashboard />} />
            <Route path="/global-features" element={<GlobalFeatures />} />
            <Route path="/advanced-weather-dashboard" element={<AdvancedWeatherDashboard />} />
            <Route path="/personalized-dashboard" element={<PersonalizedDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
