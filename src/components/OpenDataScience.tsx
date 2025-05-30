
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Download, Users, Shield, FileText, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DataExportOptions {
  moodData: boolean;
  breathingData: boolean;
  journalData: boolean;
  analyticsData: boolean;
  anonymize: boolean;
  includeMetadata: boolean;
}

const OpenDataScience = () => {
  const [exportOptions, setExportOptions] = useState<DataExportOptions>({
    moodData: true,
    breathingData: true,
    journalData: false,
    analyticsData: true,
    anonymize: true,
    includeMetadata: true
  });
  const [researchPurpose, setResearchPurpose] = useState('');
  const [hasConsented, setHasConsented] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'research'>('json');
  const { toast } = useToast();

  const handleExportOption = (key: keyof DataExportOptions, value: boolean) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  const generateAnonymizedData = () => {
    // Simulate data anonymization
    const anonymizedData = {
      metadata: {
        exportDate: new Date().toISOString(),
        anonymized: exportOptions.anonymize,
        purpose: researchPurpose || 'Personal use',
        format: exportFormat,
        dataTypes: Object.entries(exportOptions)
          .filter(([key, value]) => value && !['anonymize', 'includeMetadata'].includes(key))
          .map(([key]) => key)
      },
      data: {
        ...(exportOptions.moodData && {
          moodAnalysis: [
            {
              id: exportOptions.anonymize ? 'anon_001' : 'user_123',
              timestamp: '2024-01-15T10:30:00Z',
              emotion: 'happy',
              intensity: 7.5,
              context: exportOptions.anonymize ? 'activity_type_a' : 'morning_exercise'
            }
          ]
        }),
        ...(exportOptions.breathingData && {
          breathingSessions: [
            {
              id: exportOptions.anonymize ? 'session_001' : 'breath_456',
              duration: 300,
              technique: 'box_breathing',
              avgHeartRate: exportOptions.anonymize ? null : 72
            }
          ]
        }),
        ...(exportOptions.analyticsData && {
          usagePatterns: [
            {
              feature: 'mood_tracking',
              frequency: 'daily',
              engagement: 85
            }
          ]
        })
      }
    };

    return anonymizedData;
  };

  const exportData = () => {
    if (!hasConsented) {
      toast({
        title: "Consent Required",
        description: "Please review and accept the data export consent.",
        variant: "destructive"
      });
      return;
    }

    const data = generateAnonymizedData();
    const fileName = `wellness-data-export-${exportFormat}-${new Date().toISOString().split('T')[0]}`;
    
    let blob: Blob;
    let fileExtension: string;

    switch (exportFormat) {
      case 'csv':
        const csvData = convertToCSV(data);
        blob = new Blob([csvData], { type: 'text/csv' });
        fileExtension = 'csv';
        break;
      case 'research':
        const researchData = {
          ...data,
          researchMetadata: {
            purpose: researchPurpose,
            ethicalClearance: 'user_consent_provided',
            dataGovernance: 'anonymized_personal_export'
          }
        };
        blob = new Blob([JSON.stringify(researchData, null, 2)], { type: 'application/json' });
        fileExtension = 'research.json';
        break;
      default:
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        fileExtension = 'json';
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${fileExtension}`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported Successfully",
      description: `Your ${exportOptions.anonymize ? 'anonymized ' : ''}wellness data has been exported.`
    });
  };

  const convertToCSV = (data: any): string => {
    // Simple CSV conversion for demo
    let csv = 'Type,Timestamp,Value,Context\n';
    
    if (data.data.moodAnalysis) {
      data.data.moodAnalysis.forEach((mood: any) => {
        csv += `mood,${mood.timestamp},${mood.intensity},${mood.emotion}\n`;
      });
    }
    
    if (data.data.breathingSessions) {
      data.data.breathingSessions.forEach((session: any) => {
        csv += `breathing,${new Date().toISOString()},${session.duration},${session.technique}\n`;
      });
    }
    
    return csv;
  };

  const submitForResearch = () => {
    if (!researchPurpose.trim()) {
      toast({
        title: "Research Purpose Required",
        description: "Please describe how you plan to use this data for research.",
        variant: "destructive"
      });
      return;
    }

    // Simulate research submission
    toast({
      title: "Research Submission Received",
      description: "Your anonymized data has been prepared for research collaboration."
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Database className="w-5 h-5" />
          Open Data & Science Mode
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Data Export Options */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Data Export Options
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries({
              moodData: 'Mood & Emotion Analysis',
              breathingData: 'Breathing Session Data',
              journalData: 'Journal Entries (Text)',
              analyticsData: 'Usage Analytics'
            }).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={exportOptions[key as keyof DataExportOptions]}
                  onCheckedChange={(checked) => 
                    handleExportOption(key as keyof DataExportOptions, checked as boolean)
                  }
                />
                <label htmlFor={key} className="text-sm font-medium">
                  {label}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymize"
                checked={exportOptions.anonymize}
                onCheckedChange={(checked) => 
                  handleExportOption('anonymize', checked as boolean)
                }
              />
              <label htmlFor="anonymize" className="text-sm font-medium">
                Anonymize all personal identifiers
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeMetadata"
                checked={exportOptions.includeMetadata}
                onCheckedChange={(checked) => 
                  handleExportOption('includeMetadata', checked as boolean)
                }
              />
              <label htmlFor="includeMetadata" className="text-sm font-medium">
                Include technical metadata
              </label>
            </div>
          </div>
        </div>

        {/* Export Format */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Export Format</h3>
          <div className="flex gap-2">
            {[
              { id: 'json', label: 'JSON', desc: 'Structured data format' },
              { id: 'csv', label: 'CSV', desc: 'Spreadsheet compatible' },
              { id: 'research', label: 'Research Package', desc: 'Enhanced for collaboration' }
            ].map((format) => (
              <Button
                key={format.id}
                onClick={() => setExportFormat(format.id as typeof exportFormat)}
                variant={exportFormat === format.id ? "default" : "outline"}
                size="sm"
                className="flex-1"
              >
                <div className="text-center">
                  <div className="font-medium">{format.label}</div>
                  <div className="text-xs opacity-75">{format.desc}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Research Collaboration */}
        <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Research Collaboration
          </h3>
          
          <Textarea
            placeholder="Describe your research purpose, methodology, or how you plan to use this data for scientific advancement..."
            value={researchPurpose}
            onChange={(e) => setResearchPurpose(e.target.value)}
            className="min-h-[100px]"
          />
          
          <div className="flex gap-2">
            <Button onClick={submitForResearch} variant="outline" size="sm">
              <Globe className="w-4 h-4 mr-2" />
              Submit for Research
            </Button>
            <Badge variant="secondary" className="text-xs">
              Contributes to Open Science
            </Badge>
          </div>
        </div>

        {/* Privacy & Consent */}
        <Alert>
          <Shield className="w-4 h-4" />
          <AlertDescription className="space-y-3">
            <div>
              <strong>Privacy & Data Governance:</strong>
              <ul className="mt-2 text-sm space-y-1">
                <li>• Your data remains under your complete control</li>
                <li>• Anonymization removes all personal identifiers</li>
                <li>• No data is shared without your explicit consent</li>
                <li>• You can revoke research participation at any time</li>
              </ul>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                checked={hasConsented}
                onCheckedChange={(checked) => setHasConsented(checked as boolean)}
              />
              <label htmlFor="consent" className="text-sm">
                I understand the privacy terms and consent to data export
              </label>
            </div>
          </AlertDescription>
        </Alert>

        {/* Export Actions */}
        <div className="flex gap-3">
          <Button onClick={exportData} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Export My Data
          </Button>
          <Button variant="outline" className="flex-1">
            <Users className="w-4 h-4 mr-2" />
            Join Research Network
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">150+</div>
            <div className="text-xs text-gray-600">Data Points</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">100%</div>
            <div className="text-xs text-gray-600">Privacy Protected</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600">25+</div>
            <div className="text-xs text-gray-600">Research Partners</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">5</div>
            <div className="text-xs text-gray-600">Export Formats</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenDataScience;
