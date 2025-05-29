
import { useState, useEffect, useCallback } from 'react';
import * as faceapi from 'face-api.js';

interface AnalyticsEvent {
  userId: string;
  eventType: string;
  timestamp: string;
  details: any;
}

export const useFaceDetection = (userId: string = 'default-user') => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        
        setModelsLoaded(true);
        console.log('Face-api.js models loaded successfully');
      } catch (error) {
        console.error('Error loading face-api.js models:', error);
        setLoadingError(error.message);
      }
    };

    loadModels();
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
