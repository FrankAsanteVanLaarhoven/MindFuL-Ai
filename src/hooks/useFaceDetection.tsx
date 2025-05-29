
import { useState, useEffect, useCallback } from 'react';

interface AnalyticsEvent {
  userId: string;
  eventType: string;
  timestamp: string;
  details: any;
}

export const useFaceDetection = (userId: string = 'default-user') => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Initialize demo mode instead of loading face-api.js
  useEffect(() => {
    const initializeDemo = async () => {
      try {
        // Simulate model loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setModelsLoaded(true);
        console.log('Demo mode initialized successfully');
      } catch (error) {
        console.error('Error initializing demo mode:', error);
        setLoadingError((error as Error).message);
      }
    };

    initializeDemo();
  }, []);

  // Analytics function
  const sendAnalytics = useCallback((eventType: string, details: any) => {
    const analyticsData: AnalyticsEvent = {
      userId,
      eventType,
      timestamp: new Date().toISOString(),
      details
    };
    
    console.log('Face Detection Analytics:', analyticsData);
    
    // Store in localStorage for demonstration
    const existingAnalytics = JSON.parse(localStorage.getItem('faceDetectionAnalytics') || '[]');
    existingAnalytics.push(analyticsData);
    localStorage.setItem('faceDetectionAnalytics', JSON.stringify(existingAnalytics));
    
    // In a real implementation, send to backend:
    // fetch("/api/analytics/events", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(analyticsData)
    // }).catch(console.error);
  }, [userId]);

  // Get analytics data
  const getAnalytics = useCallback(() => {
    return JSON.parse(localStorage.getItem('faceDetectionAnalytics') || '[]');
  }, []);

  // Clear analytics data
  const clearAnalytics = useCallback(() => {
    localStorage.removeItem('faceDetectionAnalytics');
  }, []);

  return {
    modelsLoaded,
    loadingError,
    sendAnalytics,
    getAnalytics,
    clearAnalytics
  };
};
