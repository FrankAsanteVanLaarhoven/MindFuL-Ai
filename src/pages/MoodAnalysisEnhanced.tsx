
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Brain, Database, Code, Accessibility, Globe } from 'lucide-react';
import MoodMap from '@/components/mood-analysis/MoodMap';
import OpenDataScience from '@/components/OpenDataScience';
import PublicAPIDocumentation from '@/components/PublicAPIDocumentation';
import AccessibilityFeatures from '@/components/AccessibilityFeatures';
import Localization from '@/components/Localization';

const MoodAnalysisEnhanced = () => {
  const [activeTab, setActiveTab] = useState('mood-map');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-indigo-800 mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl">🧠</span>
            AI-Powered Wellness Platform
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Advanced mood visualization, open data science, public API access, and world-class accessibility features.
          </p>
        </div>

        {/* Feature Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="mood-map" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Mood Map
            </TabsTrigger>
            <TabsTrigger value="open-science" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Open Science
            </TabsTrigger>
            <TabsTrigger value="public-api" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Public API
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2">
              <Accessibility className="w-4 h-4" />
              Accessibility
            </TabsTrigger>
            <TabsTrigger value="localization" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Localization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mood-map" className="space-y-8">
            <MoodMap />
          </TabsContent>

          <TabsContent value="open-science" className="space-y-8">
            <OpenDataScience />
          </TabsContent>

          <TabsContent value="public-api" className="space-y-8">
            <PublicAPIDocumentation />
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-8">
            <AccessibilityFeatures />
          </TabsContent>

          <TabsContent value="localization" className="space-y-8">
            <Localization />
          </TabsContent>
        </Tabs>

        {/* World-Leading Features Summary */}
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-purple-800 mb-4">
              🏆 World-Leading AI Wellness Platform Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700">🧠 AI Mood Intelligence</h4>
                <ul className="text-purple-600 space-y-1">
                  <li>• Expert commentary system</li>
                  <li>• Pattern recognition AI</li>
                  <li>• Emotional journey mapping</li>
                  <li>• Predictive wellness insights</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700">🔬 Open Science</h4>
                <ul className="text-purple-600 space-y-1">
                  <li>• Anonymized data export</li>
                  <li>• Research collaboration</li>
                  <li>• GDPR/HIPAA compliant</li>
                  <li>• Multiple export formats</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700">🔧 Developer API</h4>
                <ul className="text-purple-600 space-y-1">
                  <li>• RESTful API endpoints</li>
                  <li>• Multiple SDKs available</li>
                  <li>• Research partnerships</li>
                  <li>• 99.9% uptime guarantee</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700">♿ Accessibility</h4>
                <ul className="text-purple-600 space-y-1">
                  <li>• Voice navigation system</li>
                  <li>• Dyslexia-friendly fonts</li>
                  <li>• Screen reader optimized</li>
                  <li>• WCAG 2.1 AA compliant</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-purple-700">🌍 Global Reach</h4>
                <ul className="text-purple-600 space-y-1">
                  <li>• Multi-language support</li>
                  <li>• Community translations</li>
                  <li>• Cultural adaptations</li>
                  <li>• Regional compliance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoodAnalysisEnhanced;
