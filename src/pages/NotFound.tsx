
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Compass } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4 flex items-center justify-center">
      <Card className="max-w-lg w-full bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🧭</div>
          <CardTitle className="text-3xl text-purple-800 mb-2">Page Not Found</CardTitle>
          <CardDescription className="text-lg">
            Looks like you've wandered off the wellness path. Let's get you back on track!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600 mb-6">
            <p>The page you're looking for doesn't exist or has been moved.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go to Dashboard
            </Button>
            
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
            
            <Button 
              onClick={() => navigate('/mood-analysis')}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Start Mood Analysis
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-6">
            <p>Need help? Try navigating using the tools in the bottom-right corner.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
