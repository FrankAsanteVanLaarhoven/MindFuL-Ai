
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Headphones, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface Resource {
  title: string;
  url: string;
  description: string;
  type: 'website' | 'podcast' | 'worksheets';
  category: 'DBT' | 'CBT' | 'ADHD';
}

const resources: Resource[] = [
  {
    title: "Online DBT",
    url: "https://www.onlinedbt.co.uk/",
    description: "Comprehensive DBT skills training and resources",
    type: "website",
    category: "DBT"
  },
  {
    title: "ADHD Rewired Podcast",
    url: "https://goodpods.com/podcasts/adhd-rewired-35158",
    description: "Practical ADHD management strategies and insights",
    type: "podcast",
    category: "ADHD"
  },
  {
    title: "Let's Talk About CBT",
    url: "https://letstalkaboutcbt.libsyn.com/",
    description: "CBT concepts explained through engaging discussions",
    type: "podcast",
    category: "CBT"
  },
  {
    title: "Top DBT Worksheets",
    url: "https://www.unk.com/blog/top-ten-sites-for-dbt-worksheets/",
    description: "Collection of the best DBT worksheet resources",
    type: "worksheets",
    category: "DBT"
  },
  {
    title: "Hope for BPD - DBT Podcast",
    url: "https://www.hopeforbpd.com/borderline-personality-disorder-treatment/dbt-podcast",
    description: "DBT-focused podcast for BPD treatment and support",
    type: "podcast",
    category: "DBT"
  },
  {
    title: "Great CBT Websites",
    url: "https://starmeadowcounseling.com/blog/7-great-cbt-websites/",
    description: "Curated list of excellent CBT resources and tools",
    type: "website",
    category: "CBT"
  }
];

const ResourcesPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'podcast':
        return <Headphones className="w-4 h-4" />;
      case 'worksheets':
        return <FileText className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'DBT':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CBT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ADHD':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-lg text-purple-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Therapy Resources
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {resources.map((resource, index) => (
              <div 
                key={index}
                className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getIcon(resource.type)}
                      <h4 className="font-medium text-gray-900 text-sm">{resource.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(resource.category)}`}>
                        {resource.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{resource.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Visit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-700">
              💡 These resources complement your therapy sessions. Always consult with your healthcare provider for personalized guidance.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ResourcesPanel;
