
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Video, Clock, Star, MapPin, DollarSign } from 'lucide-react';

const Teletherapy = () => {
  const [selectedTherapist, setSelectedTherapist] = useState(null);

  const therapists = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      credentials: "PhD, Licensed Clinical Psychologist",
      specialties: ["Anxiety", "Depression", "CBT", "Cultural Issues"],
      rating: 4.9,
      reviews: 127,
      price: 120,
      availability: "Available Today",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
      languages: ["English", "Mandarin"],
      experience: "8 years"
    },
    {
      id: 2,
      name: "Dr. Marcus Johnson",
      credentials: "MD, Psychiatrist",
      specialties: ["ADHD", "Bipolar", "Medication Management", "DBT"],
      rating: 4.8,
      reviews: 94,
      price: 150,
      availability: "Next Available: Tomorrow",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face",
      languages: ["English", "Spanish"],
      experience: "12 years"
    },
    {
      id: 3,
      name: "Dr. Aisha Patel",
      credentials: "LCSW, Licensed Clinical Social Worker",
      specialties: ["Trauma", "PTSD", "Family Therapy", "Mindfulness"],
      rating: 4.9,
      reviews: 156,
      price: 100,
      availability: "Available Today",
      image: "https://images.unsplash.com/photo-1594824846093-6e22eb4479e3?w=200&h=200&fit=crop&crop=face",
      languages: ["English", "Hindi", "Gujarati"],
      experience: "10 years"
    }
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "7:00 PM", "8:00 PM"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            Professional Teletherapy
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with licensed therapists from the comfort of your home. Secure, private, and convenient online therapy sessions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 text-center">
            <CardContent className="p-6">
              <Video className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">HD Video Sessions</h3>
              <p className="text-gray-600 text-sm">Crystal clear video calls with secure encryption</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 text-center">
            <CardContent className="p-6">
              <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600 text-sm">Book sessions that fit your schedule, 7 days a week</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 text-center">
            <CardContent className="p-6">
              <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Same-Day Available</h3>
              <p className="text-gray-600 text-sm">Many therapists available for same-day appointments</p>
            </CardContent>
          </Card>
        </div>

        {/* Therapist Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Choose Your Therapist</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapists.map((therapist) => (
              <Card 
                key={therapist.id} 
                className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTherapist(therapist)}
              >
                <CardHeader className="text-center">
                  <img 
                    src={therapist.image}
                    alt={therapist.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="text-lg">{therapist.name}</CardTitle>
                  <CardDescription>{therapist.credentials}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{therapist.rating}</span>
                        <span className="text-sm text-gray-500">({therapist.reviews})</span>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        {therapist.availability}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span>${therapist.price}/session</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{therapist.experience} experience</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {therapist.specialties.slice(0, 3).map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {therapist.specialties.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{therapist.specialties.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button className="w-full">Book Session</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Booking Interface */}
        {selectedTherapist && (
          <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <img 
                  src={selectedTherapist.image}
                  alt={selectedTherapist.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                Book Session with {selectedTherapist.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Available Times Today</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time, index) => (
                      <Button 
                        key={index}
                        variant="outline"
                        className="text-sm"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Session Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">50 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Session Type:</span>
                      <span className="font-medium">Video Call</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cost:</span>
                      <span className="font-medium">${selectedTherapist.price}</span>
                    </div>
                    <div className="pt-4">
                      <Button className="w-full" size="lg">
                        Confirm Booking
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Insurance & Payment Info */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle>Insurance & Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Accepted Insurance</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Blue Cross Blue Shield</li>
                  <li>• Aetna</li>
                  <li>• Cigna</li>
                  <li>• UnitedHealth</li>
                  <li>• Most major insurance plans</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Payment Options</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Insurance copay</li>
                  <li>• Credit/Debit cards</li>
                  <li>• HSA/FSA accounts</li>
                  <li>• Payment plans available</li>
                  <li>• Sliding scale for eligible clients</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Teletherapy;
