
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Key, ExternalLink } from 'lucide-react';

interface PerplexityKeyManagerProps {
  onApiKeyChange: (apiKey: string | null) => void;
}

const PerplexityKeyManager: React.FC<PerplexityKeyManagerProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isStored, setIsStored] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('perplexityApiKey');
    if (storedKey) {
      setApiKey(storedKey);
      setIsStored(true);
      onApiKeyChange(storedKey);
    }
  }, [onApiKeyChange]);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('perplexityApiKey', apiKey.trim());
      setIsStored(true);
      onApiKeyChange(apiKey.trim());
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('perplexityApiKey');
    setApiKey('');
    setIsStored(false);
    onApiKeyChange(null);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Perplexity AI Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription className="text-sm">
            Add your Perplexity API key to enable enhanced AI-powered therapy responses and contextual thoughts.
            <a 
              href="https://www.perplexity.ai/settings/api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 ml-1 inline-flex items-center gap-1"
            >
              Get API Key <ExternalLink className="w-3 h-3" />
            </a>
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Label htmlFor="apiKey">Perplexity API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="pplx-..."
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <Button
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim() || isStored}
              variant="outline"
            >
              {isStored ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>

        {isStored && (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-sm text-green-800">✅ API key configured and ready</span>
            <Button
              onClick={handleClearApiKey}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              Clear
            </Button>
          </div>
        )}

        <Alert>
          <AlertDescription className="text-xs text-gray-600">
            Your API key is stored locally in your browser. For production use, consider connecting to Supabase for secure key management.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default PerplexityKeyManager;
