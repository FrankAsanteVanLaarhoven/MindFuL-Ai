
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Star, MapPin, Clock, Phone, MessageCircle, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CareProvider {
  id: string;
  name: string;
  type: 'caregiver' | 'cleaner' | 'trainer' | 'physio' | 'nurse' | 'companion';
  rating: number;
  reviews: number;
  hourlyRate: number;
  location: string;
  distance: string;
  availability: string;
  specialties: string[];
  description: string;
  verified: boolean;
  responseTime: string;
}

const CareMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [providers] = useState<CareProvider[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      type: 'caregiver',
      rating: 4.9,
      reviews: 127,
      hourlyRate: 25,
      location: 'Downtown',
      distance: '2.3 miles',
      availability: 'Available today',
      specialties: ['Elderly care', 'Medication assistance', 'Companionship'],
      description: 'Experienced caregiver with 8 years in senior care. Certified in first aid and CPR.',
      verified: true,
      responseTime: '< 1 hour'
    },
    {
      id: '2',
      name: 'Mike Chen',
      type: 'trainer',
      rating: 4.8,
      reviews: 89,
      hourlyRate: 45,
      location: 'Fitness Center',
      distance: '1.7 miles',
      availability: 'Available tomorrow',
      specialties: ['Strength training', 'Rehabilitation', 'Senior fitness'],
      description: 'Certified personal trainer specializing in recovery and wellness programs.',
      verified: true,
      responseTime: '< 2 hours'
    },
    {
      id: '3',
      name: 'Maria Rodriguez',
      type: 'physio',
      rating: 4.9,
      reviews: 156,
      hourlyRate: 65,
      location: 'Medical Center',
      distance: '3.1 miles',
      availability: 'Available this week',
      specialties: ['Physical therapy', 'Mobility training', 'Pain management'],
      description: 'Licensed physiotherapist with expertise in home rehabilitation programs.',
      verified: true,
      responseTime: '< 30 minutes'
    },
    {
      id: '4',
      name: 'Clean Crew Pro',
      type: 'cleaner',
      rating: 4.7,
      reviews: 203,
      hourlyRate: 30,
      location: 'City wide',
      distance: '1.2 miles',
      availability: 'Available today',
      specialties: ['Deep cleaning', 'Senior-friendly', 'Medical equipment'],
      description: 'Professional cleaning service with experience in healthcare environments.',
      verified: true,
      responseTime: '< 1 hour'
    }
  ]);
  const { toast } = useToast();

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.specialties.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || provider.type === selectedType;
    return matchesSearch && matchesType;
  });

  const contactProvider = (provider: CareProvider, method: 'call' | 'message') => {
    if (method === 'call') {
      window.location.href = `tel:+1-555-${provider.id.padStart(4, '0')}`;
      toast({
        title: `Calling ${provider.name}`,
        description: "Connecting you now...",
        duration: 3000,
      });
    } else {
      toast({
        title: `Message sent to ${provider.name}`,
        description: "They'll respond within their typical response time",
        duration: 3000,
      });
    }
  };

  const bookProvider = (provider: CareProvider) => {
    toast({
      title: "Booking Request Sent",
      description: `Your request has been sent to ${provider.name}. They'll contact you soon.`,
      duration: 5000,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'caregiver': return '👩‍⚕️';
      case 'cleaner': return '🧽';
      case 'trainer': return '💪';
      case 'physio': return '🏥';
      case 'nurse': return '👩‍⚕️';
      case 'companion': return '🤝';
      default: return '👤';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'caregiver': return 'bg-blue-100 text-blue-800';
      case 'cleaner': return 'bg-green-100 text-green-800';
      case 'trainer': return 'bg-purple-100 text-purple-800';
      case 'physio': return 'bg-red-100 text-red-800';
      case 'nurse': return 'bg-pink-100 text-pink-800';
      case 'companion': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-800">
          <Heart className="w-5 h-5" />
          Care Marketplace
        </CardTitle>
        <CardDescription>
          Find verified caregivers, cleaners, trainers, and health professionals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="caregiver">Caregivers</SelectItem>
              <SelectItem value="cleaner">Cleaners</SelectItem>
              <SelectItem value="trainer">Trainers</SelectItem>
              <SelectItem value="physio">Physiotherapists</SelectItem>
              <SelectItem value="nurse">Nurses</SelectItem>
              <SelectItem value="companion">Companions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Provider List */}
        <div className="space-y-4">
          {filteredProviders.map((provider) => (
            <div key={provider.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getTypeIcon(provider.type)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{provider.name}</h3>
                      {provider.verified && (
                        <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium ml-1">{provider.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({provider.reviews} reviews)</span>
                      </div>
                      <Badge className={getTypeColor(provider.type)}>
                        {provider.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">${provider.hourlyRate}/hr</div>
                  <div className="text-xs text-gray-500">{provider.responseTime}</div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3">{provider.description}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {provider.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {provider.location} • {provider.distance}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {provider.availability}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => bookProvider(provider)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1"
                  size="sm"
                >
                  Book Now
                </Button>
                <Button
                  onClick={() => contactProvider(provider, 'call')}
                  variant="outline"
                  className="border-green-500 text-green-700"
                  size="sm"
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
                <Button
                  onClick={() => contactProvider(provider, 'message')}
                  variant="outline"
                  className="border-blue-500 text-blue-700"
                  size="sm"
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No providers found matching your search</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Safety Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Safety & Verification</h3>
          <div className="text-blue-700 text-sm space-y-1">
            <p>• All providers are background checked and verified</p>
            <p>• Read reviews and ratings before booking</p>
            <p>• Meet providers in person before starting services</p>
            <p>• Report any concerns to our support team</p>
            <p>• Payment protection and insurance included</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareMarketplace;
