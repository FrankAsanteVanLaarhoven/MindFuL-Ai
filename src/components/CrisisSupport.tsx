
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageCircle, Heart, AlertTriangle, Globe, Clock } from 'lucide-react';

interface CrisisResource {
  name: string;
  phone: string;
  text?: string;
  website?: string;
  hours: string;
  description: string;
  type: 'crisis' | 'support' | 'emergency';
  region: string;
}

const CrisisSupport = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('US');

  const crisisResources: CrisisResource[] = [
    {
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      text: 'Text HOME to 741741',
      website: 'https://suicidepreventionlifeline.org',
      hours: '24/7',
      description: 'Free and confidential emotional support for people in suicidal crisis or emotional distress',
      type: 'crisis',
      region: 'US'
    },
    {
      name: 'Crisis Text Line',
      phone: '',
      text: 'Text HOME to 741741',
      website: 'https://crisistextline.org',
      hours: '24/7',
      description: 'Free, 24/7 crisis support via text message',
      type: 'crisis',
      region: 'US'
    },
    {
      name: 'National Domestic Violence Hotline',
      phone: '1-800-799-7233',
      text: 'Text START to 88788',
      website: 'https://thehotline.org',
      hours: '24/7',
      description: 'Support for domestic violence survivors and their families',
      type: 'support',
      region: 'US'
    },
    {
      name: 'SAMHSA National Helpline',
      phone: '1-800-662-4357',
      website: 'https://samhsa.gov',
      hours: '24/7',
      description: 'Free, confidential treatment referral and information service',
      type: 'support',
      region: 'US'
    },
    {
      name: 'Emergency Services',
      phone: '911',
      hours: '24/7',
      description: 'Immediate emergency assistance',
      type: 'emergency',
      region: 'US'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'crisis': return 'bg-red-100 text-red-800 border-red-200';
      case 'support': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'emergency': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crisis': return <AlertTriangle className="w-4 h-4" />;
      case 'support': return <Heart className="w-4 h-4" />;
      case 'emergency': return <Phone className="w-4 h-4" />;
      default: return <Phone className="w-4 h-4" />;
    }
  };

  const filteredResources = crisisResources.filter(resource => resource.region === selectedRegion);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-red-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-red-800 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Crisis Support Resources
        </CardTitle>
        <CardDescription>
          Immediate help and support when you need it most
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Emergency Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">
                If you're in immediate danger
              </h3>
              <p className="text-red-700 text-sm mb-2">
                Call 911 (US) or your local emergency number immediately
              </p>
              <p className="text-red-600 text-xs">
                Remember: You are not alone, and help is available
              </p>
            </div>
          </div>
        </div>

        {/* Resources List */}
        <div className="space-y-4">
          {filteredResources.map((resource, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(resource.type)}
                  <h3 className="font-semibold text-gray-800">{resource.name}</h3>
                </div>
                <Badge className={getTypeColor(resource.type)}>
                  {resource.type}
                </Badge>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {resource.phone && (
                  <a 
                    href={`tel:${resource.phone}`}
                    className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    {resource.phone}
                  </a>
                )}
                {resource.text && (
                  <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    <MessageCircle className="w-3 h-3" />
                    {resource.text}
                  </span>
                )}
                {resource.website && (
                  <a 
                    href={resource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors"
                  >
                    <Globe className="w-3 h-3" />
                    Website
                  </a>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                Available: {resource.hours}
              </div>
            </div>
          ))}
        </div>

        {/* Self-Care Reminders */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-blue-800 mb-2">Quick Self-Care Reminders</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Take slow, deep breaths</li>
            <li>• Reach out to a trusted friend or family member</li>
            <li>• Remove yourself from immediate stressors if possible</li>
            <li>• Remember that this feeling is temporary</li>
            <li>• You deserve support and care</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrisisSupport;
