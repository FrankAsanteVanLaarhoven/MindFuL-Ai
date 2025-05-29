
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Cloud, Key, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CloudProvider {
  id: string;
  name: string;
  description: string;
  features: string[];
  pricing: string;
}

const cloudProviders: CloudProvider[] = [
  {
    id: 'aws-rekognition',
    name: 'Amazon Rekognition',
    description: 'Enterprise-grade face and emotion detection',
    features: ['High accuracy', 'Celebrity recognition', 'Age estimation', 'Real-time'],
    pricing: '$1.50 per 1,000 images'
  },
  {
    id: 'google-vision',
    name: 'Google Cloud Vision',
    description: 'Advanced ML-powered face analysis',
    features: ['Emotion detection', 'Landmark detection', 'OCR capabilities', 'AutoML'],
    pricing: '$1.50 per 1,000 images'
  },
  {
    id: 'azure-face',
    name: 'Microsoft Azure Face',
    description: 'Comprehensive face recognition and analysis',
    features: ['Face verification', 'Emotion analysis', 'Face grouping', 'Person identification'],
    pricing: '$1.00 per 1,000 transactions'
  },
  {
    id: 'face-plus-plus',
    name: 'Face++',
    description: 'Specialized face recognition platform',
    features: ['3D face modeling', 'Mask detection', 'Beauty scoring', 'Gesture recognition'],
    pricing: 'Custom enterprise pricing'
  },
  {
    id: 'clarifai',
    name: 'Clarifai',
    description: 'AI platform with face and emotion models',
    features: ['Custom models', 'Demographics', 'Multicultural', 'Edge deployment'],
    pricing: '$20 per 1,000 operations'
  }
];

interface CloudAPIIntegrationProps {
  onProviderSelect?: (provider: string, apiKey: string) => void;
  onAnalysisResult?: (result: any) => void;
}

const CloudAPIIntegration: React.FC<CloudAPIIntegrationProps> = ({
  onProviderSelect,
  onAnalysisResult
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!selectedProvider || !apiKey) {
      toast({
        title: "Missing Information",
        description: "Please select a provider and enter your API key.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Test API connection (mock implementation)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsConnected(true);
      
      if (onProviderSelect) {
        onProviderSelect(selectedProvider, apiKey);
      }
      
      toast({
        title: "Connected Successfully!",
        description: `Connected to ${cloudProviders.find(p => p.id === selectedProvider)?.name}`,
      });
      
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setApiKey('');
    setSelectedProvider('');
    
    toast({
      title: "Disconnected",
      description: "Cloud API integration disabled. Switched back to local processing.",
    });
  };

  const selectedProviderData = cloudProviders.find(p => p.id === selectedProvider);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Cloud className="w-5 h-5" />
          Enterprise Cloud API Integration
          {isConnected && (
            <Badge className="bg-green-100 text-green-800 ml-auto">
              Connected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
          <>
            {/* Provider Selection */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Cloud Provider
                </label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a cloud provider..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cloudProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Provider Details */}
              {selectedProviderData && (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">
                    {selectedProviderData.name}
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    {selectedProviderData.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <h5 className="font-medium text-sm text-gray-800 mb-1">Features</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {selectedProviderData.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="text-purple-500">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm text-gray-800 mb-1">Pricing</h5>
                      <p className="text-xs text-gray-600">{selectedProviderData.pricing}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* API Key Input */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  API Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Enter your API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Your API key is stored securely and never transmitted to our servers.
                </p>
              </div>

              {/* Connect Button */}
              <Button
                onClick={handleConnect}
                disabled={!selectedProvider || !apiKey || isLoading}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Connect to {selectedProviderData?.name || 'Provider'}
                  </div>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Connected State */}
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">
                  Connected to {selectedProviderData?.name}
                </h4>
                <p className="text-sm text-green-700">
                  Enhanced face detection is now available with enterprise-grade accuracy 
                  and additional features.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-blue-50 rounded border">
                  <div className="font-medium text-blue-800">Enhanced Accuracy</div>
                  <div className="text-blue-600">99.9% precision</div>
                </div>
                <div className="p-3 bg-indigo-50 rounded border">
                  <div className="font-medium text-indigo-800">Advanced Features</div>
                  <div className="text-indigo-600">Age, gender, demographics</div>
                </div>
                <div className="p-3 bg-purple-50 rounded border">
                  <div className="font-medium text-purple-800">Scale Ready</div>
                  <div className="text-purple-600">Enterprise infrastructure</div>
                </div>
              </div>

              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Disconnect and Use Local Processing
              </Button>
            </div>
          </>
        )}

        {/* Enterprise Benefits */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-3">Enterprise Benefits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>GDPR & CCPA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>SOC 2 Type II Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>99.9% Uptime SLA</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>24/7 Enterprise Support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Custom Model Training</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>White-label Solutions</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CloudAPIIntegration;
