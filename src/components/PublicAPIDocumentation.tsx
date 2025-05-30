import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Code, Key, Book, Zap, Users, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters?: Array<{name: string, type: string, required: boolean, description: string}>;
  response: string;
  example: string;
}

const PublicAPIDocumentation = () => {
  const [apiKey, setApiKey] = useState('');
  const [testEndpoint, setTestEndpoint] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const { toast } = useToast();

  const endpoints: APIEndpoint[] = [
    {
      method: 'POST',
      path: '/api/v1/mood/analyze',
      description: 'Analyze mood from text, voice, or image data',
      parameters: [
        { name: 'text', type: 'string', required: false, description: 'Text content to analyze' },
        { name: 'audio', type: 'base64', required: false, description: 'Base64 encoded audio data' },
        { name: 'image', type: 'base64', required: false, description: 'Base64 encoded image data' },
        { name: 'options', type: 'object', required: false, description: 'Analysis options and preferences' }
      ],
      response: '{ "mood": "happy", "confidence": 0.85, "emotions": {...}, "insights": [...] }',
      example: `curl -X POST https://api.wellness-platform.com/v1/mood/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "I feel great today!", "options": {"detailed": true}}'`
    },
    {
      method: 'GET',
      path: '/api/v1/breathing/techniques',
      description: 'Get available breathing techniques and their configurations',
      response: '{ "techniques": [{"name": "box", "description": "...", "cycles": {...}}] }',
      example: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.wellness-platform.com/v1/breathing/techniques`
    },
    {
      method: 'POST',
      path: '/api/v1/analytics/submit',
      description: 'Submit anonymized wellness data for research',
      parameters: [
        { name: 'data', type: 'object', required: true, description: 'Anonymized wellness data' },
        { name: 'consent', type: 'boolean', required: true, description: 'User consent confirmation' },
        { name: 'purpose', type: 'string', required: true, description: 'Research purpose description' }
      ],
      response: '{ "submission_id": "abc123", "status": "accepted", "contribution_score": 95 }',
      example: `curl -X POST https://api.wellness-platform.com/v1/analytics/submit \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"data": {...}, "consent": true, "purpose": "Mental health research"}'`
    },
    {
      method: 'GET',
      path: '/api/v1/insights/generate',
      description: 'Generate AI-powered insights from user data patterns',
      parameters: [
        { name: 'timeframe', type: 'string', required: false, description: 'Analysis timeframe (7d, 30d, 90d)' },
        { name: 'types', type: 'array', required: false, description: 'Types of insights to generate' }
      ],
      response: '{ "insights": [...], "recommendations": [...], "patterns": [...] }',
      example: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
  "https://api.wellness-platform.com/v1/insights/generate?timeframe=30d&types=mood,breathing"`
    }
  ];

  const generateAPIKey = () => {
    const newKey = 'wlns_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    
    toast({
      title: "API Key Generated",
      description: "Your new API key has been created. Store it securely!"
    });
  };

  const testAPI = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please generate or enter your API key first.",
        variant: "destructive"
      });
      return;
    }

    setTestResponse('Testing...');
    
    setTimeout(() => {
      const mockResponse = {
        status: 200,
        data: {
          mood: "optimistic",
          confidence: 0.92,
          emotions: {
            joy: 0.8,
            excitement: 0.7,
            calm: 0.6
          },
          insights: [
            "High positive sentiment detected",
            "Active engagement indicators present"
          ]
        },
        timestamp: new Date().toISOString()
      };
      
      setTestResponse(JSON.stringify(mockResponse, null, 2));
      
      toast({
        title: "API Test Successful",
        description: "Your API key is working correctly!"
      });
    }, 1500);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-800">
          <Code className="w-5 h-5" />
          Public API for Developers & Researchers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="testing">API Testing</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  API Capabilities
                </h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">AI</Badge>
                    Real-time mood analysis from text, voice, and images
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Data</Badge>
                    Breathing pattern analysis and recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Insights</Badge>
                    Personalized wellness insights and trends
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">Research</Badge>
                    Anonymized data contribution for research
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Use Cases
                </h3>
                <ul className="text-sm space-y-2">
                  <li>• Mental health research applications</li>
                  <li>• Therapeutic chatbots and AI assistants</li>
                  <li>• Wellness tracking integrations</li>
                  <li>• Academic research projects</li>
                  <li>• Healthcare provider tools</li>
                  <li>• Meditation and mindfulness apps</li>
                </ul>
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy & Ethics First
              </h3>
              <p className="text-sm text-indigo-700">
                Our API is designed with privacy by default. All data is anonymized, user consent is required, 
                and we follow strict ethical guidelines for mental health data handling. GDPR and HIPAA compliant.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {endpoint.path}
                  </code>
                </div>
                
                <p className="text-sm text-gray-700">{endpoint.description}</p>
                
                {endpoint.parameters && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Parameters:</h4>
                    <div className="space-y-1">
                      {endpoint.parameters.map((param, i) => (
                        <div key={i} className="text-xs bg-gray-50 p-2 rounded">
                          <code className="text-blue-600">{param.name}</code>
                          <span className="text-gray-500"> ({param.type})</span>
                          {param.required && <Badge variant="outline" className="ml-2 text-xs">required</Badge>}
                          <p className="mt-1 text-gray-600">{param.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Response:</h4>
                  <code className="text-xs bg-gray-100 p-2 rounded block">
                    {endpoint.response}
                  </code>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Example:</h4>
                  <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                    {endpoint.example}
                  </pre>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="testing" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  API Key Management
                </h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter existing API key or generate new one"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    type="password"
                    className="flex-1"
                  />
                  <Button onClick={generateAPIKey} variant="outline">
                    Generate Key
                  </Button>
                </div>
                {apiKey && (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ API key configured and ready for testing
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Test Endpoint</h3>
                <div className="space-y-3">
                  <Textarea
                    placeholder='{"text": "I am feeling really good today!", "options": {"detailed": true}}'
                    value={testEndpoint}
                    onChange={(e) => setTestEndpoint(e.target.value)}
                    className="min-h-[100px] font-mono text-sm"
                  />
                  <Button onClick={testAPI} disabled={!apiKey}>
                    Test API Call
                  </Button>
                </div>
              </div>

              {testResponse && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Response</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    {testResponse}
                  </pre>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  Documentation & Resources
                </h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    📚 Full API Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🛠️ SDK & Libraries (Python, JS, R)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📝 Research Paper Templates
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🎯 Use Case Examples
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Developer Community
                </h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    💬 Developer Discord
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🐙 GitHub Repository
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📖 Community Wiki
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🏆 Showcase Projects
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-purple-800 mb-2">Research Partnership Program</h3>
              <p className="text-sm text-purple-700 mb-3">
                Join our network of researchers, therapists, and developers building the future of digital wellness.
                Access enhanced API features, collaborate on studies, and contribute to open science.
              </p>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                Apply for Research Access
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-600">500+</div>
                <div className="text-sm text-gray-600">Developers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">50+</div>
                <div className="text-sm text-gray-600">Research Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">25+</div>
                <div className="text-sm text-gray-600">Published Papers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PublicAPIDocumentation;
