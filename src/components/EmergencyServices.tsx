import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Ambulance, Shield, UserCheck, Clock, MapPin, Pill } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencyService {
  name: string;
  phone: string;
  type: 'emergency' | 'medical' | 'police' | 'support' | 'pharmacy';
  description: string;
  availability: string;
  estimatedResponse: string;
  icon: React.ReactNode;
}

const EmergencyServices = () => {
  const [lastCalled, setLastCalled] = useState<string>('');
  const { toast } = useToast();

  const services: EmergencyService[] = [
    {
      name: 'Emergency Services',
      phone: '911',
      type: 'emergency',
      description: 'Police, Fire, Medical Emergency',
      availability: '24/7',
      estimatedResponse: '2-8 minutes',
      icon: <Phone className="w-5 h-5" />
    },
    {
      name: 'Ambulance Service',
      phone: '911',
      type: 'medical',
      description: 'Medical emergency transport',
      availability: '24/7',
      estimatedResponse: '4-12 minutes',
      icon: <Ambulance className="w-5 h-5" />
    },
    {
      name: 'Police Department',
      phone: '911',
      type: 'police',
      description: 'Law enforcement assistance',
      availability: '24/7',
      estimatedResponse: '3-10 minutes',
      icon: <Shield className="w-5 h-5" />
    },
    {
      name: 'Local Pharmacy',
      phone: '1-555-PHARMACY',
      type: 'pharmacy',
      description: 'Medication orders and consultations',
      availability: '8AM-10PM',
      estimatedResponse: 'Immediate',
      icon: <Pill className="w-5 h-5" />
    },
    {
      name: 'Poison Control',
      phone: '1-800-222-1222',
      type: 'medical',
      description: 'Poison emergency hotline',
      availability: '24/7',
      estimatedResponse: 'Immediate',
      icon: <UserCheck className="w-5 h-5" />
    },
    {
      name: 'Mental Health Crisis',
      phone: '988',
      type: 'support',
      description: 'Suicide & Crisis Lifeline',
      availability: '24/7',
      estimatedResponse: 'Immediate',
      icon: <UserCheck className="w-5 h-5" />
    }
  ];

  const callService = (service: EmergencyService) => {
    window.location.href = `tel:${service.phone}`;
    setLastCalled(service.name);
    
    toast({
      title: `Calling ${service.name}`,
      description: `Dialing ${service.phone}... Help is on the way.`,
      duration: 8000,
    });

    console.log(`Emergency call to ${service.name} at ${new Date().toISOString()}`);
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-600 hover:bg-red-700';
      case 'medical': return 'bg-blue-600 hover:bg-blue-700';
      case 'police': return 'bg-indigo-600 hover:bg-indigo-700';
      case 'support': return 'bg-green-600 hover:bg-green-700';
      case 'pharmacy': return 'bg-purple-600 hover:bg-purple-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'medical': return 'bg-blue-100 text-blue-800';
      case 'police': return 'bg-indigo-100 text-indigo-800';
      case 'support': return 'bg-green-100 text-green-800';
      case 'pharmacy': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-red-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <Phone className="w-5 h-5" />
          Emergency Services
        </CardTitle>
        <CardDescription>
          Instant access to emergency services with automatic location sharing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {service.icon}
                  <h3 className="font-semibold text-gray-800">{service.name}</h3>
                </div>
                <Badge className={getBadgeColor(service.type)}>
                  {service.type}
                </Badge>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{service.description}</p>
              
              <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {service.availability}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {service.estimatedResponse}
                </div>
              </div>
              
              <Button
                onClick={() => callService(service)}
                className={`w-full text-white font-semibold ${getServiceColor(service.type)}`}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call {service.phone}
              </Button>
            </div>
          ))}
        </div>

        {lastCalled && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm">
              <strong>Last called:</strong> {lastCalled} at {new Date().toLocaleTimeString()}
            </p>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <h3 className="font-semibold text-green-800">Location Sharing Active</h3>
          </div>
          <p className="text-green-700 text-sm">
            Your location will be automatically shared with emergency services when you call
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Emergency Call Tips</h3>
          <div className="text-gray-700 text-sm space-y-1">
            <p>• Stay calm and speak clearly</p>
            <p>• Provide your exact location if possible</p>
            <p>• Describe the emergency clearly</p>
            <p>• Follow the dispatcher's instructions</p>
            <p>• Don't hang up until told to do so</p>
            <p>• Keep your phone charged and accessible</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyServices;
