
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationTools from "./components/NavigationTools";
import Index from "./pages/Index";
import Breathing from "./pages/Breathing";
import MoodAnalysis from "./pages/MoodAnalysis";
import TherapyBot from "./pages/TherapyBot";
import Journal from "./pages/Journal";
import WellnessDashboard from "./pages/WellnessDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavigationTools />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/breathing" element={<Breathing />} />
          <Route path="/mood-analysis" element={<MoodAnalysis />} />
          <Route path="/therapy-bot" element={<TherapyBot />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/wellness-dashboard" element={<WellnessDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
