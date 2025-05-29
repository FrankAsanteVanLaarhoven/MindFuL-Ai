
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Phone, Shield, Users, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PanicButton = () => {
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [emergencyContacted, setEmergencyContacted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get user's location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError('Location access denied. Enable location for better emergency response.');
          console.log('Location error:', error);
        }
      );
    }
  }, []);

  const activatePanic = () => {
    setIsPanicActive(true);
    setEmergencyContacted(true);

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(currentLocation);
          
          // Send emergency alert with location
          sendEmergencyAlert(currentLocation);
        },
        () => {
          // Send emergency alert without precise location
          sendEmergencyAlert(null);
        }
      );
    } else {
      sendEmergencyAlert(null);
    }

    toast({
      title: "EMERGENCY ALERT ACTIVATED",
      description: "Emergency services and contacts are being notified",
      variant: "destructive",
      duration: 10000,
    });
  };

  const sendEmergencyAlert = (location: { lat: number; lng: number } | null) => {
    console.log('Emergency alert activated!');
    console.log('Location:', location);
    
    // Simulate emergency services notification
    setTimeout(() => {
      toast({
        title: "Emergency Services Notified",
        description: location 
          ? `Location shared: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
          : "Emergency alert sent without location",
        duration: 8000,
      });
    }, 2000);

    // Simulate family/contacts notification
    setTimeout(() => {
      toast({
        title: "Emergency Contacts Notified",
        description: "All primary contacts have been alerted with your location",
        duration: 6000,
      });
    }, 4000);
  };

  const deactivatePanic = () => {
    setIsPanicActive(false);
    setEmergencyContacted(false);
    
    toast({
      title: "Emergency Alert Deactivated",
      description: "Follow-up notifications sent to confirm you're safe",
      duration: 5000,
    });
  };

  const callEmergencyServices = () => {
    window.location.href = 'tel:911';
    toast({
      title: "Calling Emergency Services",
      description: "Dialing 911...",
      duration: 5000,
    });
  };

  const shareLocation = () => {
    if (location) {
      const locationUrl = `https://maps.google.com/?q=${location.lat},${location.lng}`;
      navigator.clipboard.writeText(locationUrl);
      
      toast({
        title: "Location Copied",
        description: "Location link copied to clipboard",
        duration: 3000,
      });
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-red-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <Shield className="w-5 h-5" />
          Emergency Panic Button
        </CardTitle>
        <CardDescription>
          Instant emergency alert system with location sharing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Panic Button */}
        <div className="text-center">
          {!isPanicActive ? (
            <Button
              onClick={activatePanic}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg transform transition-transform hover:scale-105"
              size="lg"
            >
              <AlertTriangle className="w-8 h-8 mr-3" />
              PANIC BUTTON
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <AlertTriangle className="w-12 h-12 text-red-600 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-red-800 mb-2">EMERGENCY ACTIVE</h3>
                <p className="text-red-700">Emergency services and contacts have been notified</p>
                {location && (
                  <div className="mt-3 text-sm text-red-600">
                    Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </div>
                )}
              </div>
              <Button
                onClick={deactivatePanic}
                variant="outline"
                className="border-green-500 text-green-700 hover:bg-green-50"
              >
                I'm Safe - Deactivate Alert
              </Button>
            </div>
          )}
        </div>

        {/* Location Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Location Status</h3>
          </div>
          {location ? (
            <div className="space-y-2">
              <Badge className="bg-green-100 text-green-800">Location Enabled</Badge>
              <p className="text-blue-700 text-sm">
                Your location will be shared automatically in emergencies
              </p>
              <Button
                onClick={shareLocation}
                variant="outline"
                size="sm"
                className="border-blue-500 text-blue-700"
              >
                <MapPin className="w-3 h-3 mr-1" />
                Share Current Location
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Badge className="bg-yellow-100 text-yellow-800">Location Disabled</Badge>
              <p className="text-blue-700 text-sm">
                {locationError || 'Enable location services for better emergency response'}
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={callEmergencyServices}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call 911
          </Button>
          <Button
            onClick={() => {
              // Simulate family notification
              toast({
                title: "Family Notified",
                description: "Emergency message sent to all contacts",
                duration: 3000,
              });
            }}
            variant="outline"
            className="border-orange-500 text-orange-700"
          >
            <Users className="w-4 h-4 mr-2" />
            Alert Family
          </Button>
        </div>

        {/* Emergency Instructions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Emergency Instructions</h3>
          <div className="text-gray-700 text-sm space-y-1">
            <p>• Press panic button only in real emergencies</p>
            <p>• Your location will be shared with emergency services</p>
            <p>• All emergency contacts will receive alerts</p>
            <p>• Deactivate when you're safe to stop alerts</p>
            <p>• If unable to speak, text will be sent automatically</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PanicButton;
