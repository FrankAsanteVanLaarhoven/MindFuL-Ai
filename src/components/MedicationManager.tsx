import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pill, Clock, AlertTriangle, Camera, Plus, Bell, CheckCircle, XCircle, Scan, Phone, ShoppingCart, Heart, Video, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Allergy {
  id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  symptoms: string[];
  medications: string[];
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  maxDaily: number;
  currentDaily: number;
  instructions: string;
  sideEffects: string[];
  ingredients: string[];
  prescribedBy: string;
  startDate: Date;
  endDate?: Date;
  nextDue: Date;
  isActive: boolean;
  isGPApproved: boolean;
  canReorder: boolean;
  pharmacy: string;
  stockLevel: number;
}

const MedicationManager = () => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Sertraline',
      dosage: '50mg',
      frequency: 'Once daily',
      times: ['09:00'],
      maxDaily: 1,
      currentDaily: 0,
      instructions: 'Take with food. Do not skip doses.',
      sideEffects: ['Nausea', 'Drowsiness', 'Dry mouth'],
      ingredients: ['Sertraline hydrochloride', 'Microcrystalline cellulose'],
      prescribedBy: 'Dr. Smith',
      startDate: new Date('2024-01-01'),
      nextDue: new Date(),
      isActive: true,
      isGPApproved: true,
      canReorder: true,
      pharmacy: 'Local Pharmacy',
      stockLevel: 15
    }
  ]);

  const [allergies, setAllergies] = useState<Allergy[]>([
    {
      id: '1',
      allergen: 'Penicillin',
      severity: 'severe',
      symptoms: ['Rash', 'Difficulty breathing', 'Swelling'],
      medications: ['All penicillin-based antibiotics']
    }
  ]);

  const [isAddingMed, setIsAddingMed] = useState(false);
  const [isAddingAllergy, setIsAddingAllergy] = useState(false);
  const [newMed, setNewMed] = useState<Partial<Medication>>({});
  const [newAllergy, setNewAllergy] = useState<Partial<Allergy>>({});
  const [isScanning, setIsScanning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const { toast } = useToast();

  // Check for due medications every minute
  useEffect(() => {
    const interval = setInterval(checkDueMedications, 60000);
    return () => clearInterval(interval);
  }, [medications]);

  const checkDueMedications = () => {
    const now = new Date();
    medications.forEach(med => {
      if (med.isActive && med.nextDue <= now && med.currentDaily < med.maxDaily) {
        toast({
          title: "Medication Reminder",
          description: `Time to take ${med.name} (${med.dosage})`,
          duration: 10000,
        });
      }
      
      // Check for low stock
      if (med.stockLevel <= 3 && med.canReorder) {
        toast({
          title: "Low Stock Alert",
          description: `${med.name} is running low. Consider reordering.`,
          variant: "destructive",
          duration: 8000,
        });
      }
    });
  };

  const takeMedication = (medId: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medId) {
        if (med.currentDaily >= med.maxDaily) {
          toast({
            title: "Dosage Limit Reached",
            description: `You've already taken the maximum daily dose of ${med.name}`,
            variant: "destructive",
          });
          return med;
        }

        // Check allergies before taking medication
        const allergyConflict = allergies.find(allergy => 
          med.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(allergy.allergen.toLowerCase())
          )
        );

        if (allergyConflict) {
          toast({
            title: "ALLERGY WARNING",
            description: `This medication contains ${allergyConflict.allergen}. Contact your doctor immediately.`,
            variant: "destructive",
            duration: 15000,
          });
          return med;
        }

        const newDaily = med.currentDaily + 1;
        const newStockLevel = med.stockLevel - 1;
        const nextDue = new Date();
        nextDue.setHours(nextDue.getHours() + 24 / med.maxDaily);

        toast({
          title: "Medication Taken",
          description: `${med.name} recorded successfully`,
          duration: 3000,
        });

        return {
          ...med,
          currentDaily: newDaily,
          stockLevel: newStockLevel,
          nextDue
        };
      }
      return med;
    }));
  };

  const reorderMedication = (medId: string) => {
    const medication = medications.find(med => med.id === medId);
    if (!medication) return;

    if (!medication.isGPApproved) {
      toast({
        title: "GP Approval Required",
        description: `${medication.name} requires GP approval before reordering`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reorder Initiated",
      description: `${medication.name} order sent to ${medication.pharmacy}`,
      duration: 5000,
    });

    // Simulate order placement
    setTimeout(() => {
      toast({
        title: "Order Confirmed",
        description: `${medication.name} will be ready for collection in 2-3 hours`,
        duration: 8000,
      });
    }, 3000);
  };

  const takePhoto = () => {
    setIsTakingPhoto(true);
    
    setTimeout(() => {
      setIsTakingPhoto(false);
      toast({
        title: "Photo Captured",
        description: "Medication photo saved to your record",
        duration: 3000,
      });
    }, 2000);
  };

  const startRecording = () => {
    setIsRecording(true);
    
    setTimeout(() => {
      setIsRecording(false);
      toast({
        title: "Recording Saved",
        description: "Voice note about medication saved",
        duration: 3000,
      });
    }, 5000);
  };

  const addAllergy = () => {
    if (!newAllergy.allergen || !newAllergy.severity) {
      toast({
        title: "Missing Information",
        description: "Please fill in required allergy details",
        variant: "destructive",
      });
      return;
    }

    const allergy: Allergy = {
      id: Date.now().toString(),
      allergen: newAllergy.allergen!,
      severity: newAllergy.severity!,
      symptoms: newAllergy.symptoms || [],
      medications: newAllergy.medications || []
    };

    setAllergies([...allergies, allergy]);
    setNewAllergy({});
    setIsAddingAllergy(false);
    
    toast({
      title: "Allergy Added",
      description: `${allergy.allergen} allergy added to your profile`,
      duration: 3000,
    });
  };

  const scanMedication = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      
      const scannedMed = {
        name: 'Ibuprofen',
        dosage: '200mg',
        ingredients: ['Ibuprofen', 'Lactose', 'Starch'],
        sideEffects: ['Stomach upset', 'Dizziness'],
        instructions: 'Take with food. Do not exceed 6 tablets in 24 hours.',
        isGPApproved: false,
        canReorder: false,
        pharmacy: '',
        stockLevel: 0
      };
      
      setNewMed(scannedMed);
      setIsAddingMed(true);
      
      toast({
        title: "Medication Scanned",
        description: `${scannedMed.name} information loaded`,
        duration: 3000,
      });
    }, 3000);
  };

  const addMedication = () => {
    if (!newMed.name || !newMed.dosage || !newMed.frequency) {
      toast({
        title: "Missing Information",
        description: "Please fill in required medication details",
        variant: "destructive",
      });
      return;
    }

    const medication: Medication = {
      id: Date.now().toString(),
      name: newMed.name!,
      dosage: newMed.dosage!,
      frequency: newMed.frequency!,
      times: newMed.times || ['09:00'],
      maxDaily: newMed.maxDaily || 1,
      currentDaily: 0,
      instructions: newMed.instructions || '',
      sideEffects: newMed.sideEffects || [],
      ingredients: newMed.ingredients || [],
      prescribedBy: newMed.prescribedBy || '',
      startDate: new Date(),
      nextDue: new Date(),
      isActive: true,
      isGPApproved: newMed.isGPApproved || false,
      canReorder: newMed.canReorder || false,
      pharmacy: newMed.pharmacy || '',
      stockLevel: newMed.stockLevel || 0
    };

    setMedications([...medications, medication]);
    setNewMed({});
    setIsAddingMed(false);
    
    toast({
      title: "Medication Added",
      description: `${medication.name} added to your medication list`,
      duration: 3000,
    });
  };

  const getDosageStatus = (med: Medication) => {
    const ratio = med.currentDaily / med.maxDaily;
    if (ratio >= 1) return { color: 'bg-red-100 text-red-800', text: 'Limit Reached' };
    if (ratio >= 0.8) return { color: 'bg-yellow-100 text-yellow-800', text: 'Near Limit' };
    return { color: 'bg-green-100 text-green-800', text: 'Safe' };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'bg-red-100 text-red-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'mild': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Pill className="w-5 h-5" />
              Medication & Allergy Manager
            </CardTitle>
            <CardDescription>
              Smart medication tracking with allergy monitoring and pharmacy integration
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={takePhoto}
              variant="outline"
              className="border-blue-500 text-blue-700"
              disabled={isTakingPhoto}
              size="sm"
            >
              {isTakingPhoto ? (
                <>
                  <Camera className="w-3 h-3 mr-1 animate-pulse" />
                  Taking...
                </>
              ) : (
                <>
                  <Camera className="w-3 h-3 mr-1" />
                  Photo
                </>
              )}
            </Button>
            <Button
              onClick={startRecording}
              variant="outline"
              className="border-red-500 text-red-700"
              disabled={isRecording}
              size="sm"
            >
              {isRecording ? (
                <>
                  <Mic className="w-3 h-3 mr-1 animate-pulse" />
                  Recording...
                </>
              ) : (
                <>
                  <Video className="w-3 h-3 mr-1" />
                  Record
                </>
              )}
            </Button>
            <Button
              onClick={scanMedication}
              variant="outline"
              className="border-purple-500 text-purple-700"
              disabled={isScanning}
              size="sm"
            >
              {isScanning ? (
                <>
                  <Scan className="w-3 h-3 mr-1 animate-pulse" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="w-3 h-3 mr-1" />
                  Scan
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Allergies Section */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-red-800 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Known Allergies
            </h3>
            <Dialog open={isAddingAllergy} onOpenChange={setIsAddingAllergy}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-red-500 text-red-700">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Allergy
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Allergy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="allergen">Allergen *</Label>
                    <Input
                      id="allergen"
                      value={newAllergy.allergen || ''}
                      onChange={(e) => setNewAllergy({...newAllergy, allergen: e.target.value})}
                      placeholder="e.g., Penicillin, Nuts, Shellfish"
                    />
                  </div>
                  <div>
                    <Label htmlFor="severity">Severity *</Label>
                    <Select value={newAllergy.severity} onValueChange={(value) => setNewAllergy({...newAllergy, severity: value as any})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mild">Mild</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="symptoms">Symptoms</Label>
                    <Textarea
                      id="symptoms"
                      value={newAllergy.symptoms?.join(', ') || ''}
                      onChange={(e) => setNewAllergy({...newAllergy, symptoms: e.target.value.split(', ').filter(s => s.trim())})}
                      placeholder="Describe symptoms separated by commas"
                    />
                  </div>
                  <Button onClick={addAllergy} className="w-full bg-red-600 hover:bg-red-700">
                    Add Allergy
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {allergies.length > 0 ? (
            <div className="space-y-2">
              {allergies.map((allergy) => (
                <div key={allergy.id} className="bg-white border border-red-200 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-red-800">{allergy.allergen}</h4>
                    <Badge className={getSeverityColor(allergy.severity)}>
                      {allergy.severity}
                    </Badge>
                  </div>
                  {allergy.symptoms.length > 0 && (
                    <p className="text-red-700 text-sm">
                      <strong>Symptoms:</strong> {allergy.symptoms.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-600 text-sm">No allergies recorded</p>
          )}
        </div>

        {/* Add Medication Dialog */}
        <Dialog open={isAddingMed} onOpenChange={setIsAddingMed}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Medication</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Medication Name *</Label>
                <Input
                  id="name"
                  value={newMed.name || ''}
                  onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  value={newMed.dosage || ''}
                  onChange={(e) => setNewMed({...newMed, dosage: e.target.value})}
                  placeholder="e.g., 50mg, 1 tablet"
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency *</Label>
                <Select value={newMed.frequency} onValueChange={(value) => setNewMed({...newMed, frequency: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="How often?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Once daily">Once daily</SelectItem>
                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                    <SelectItem value="Three times daily">Three times daily</SelectItem>
                    <SelectItem value="Four times daily">Four times daily</SelectItem>
                    <SelectItem value="As needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pharmacy">Pharmacy</Label>
                <Input
                  id="pharmacy"
                  value={newMed.pharmacy || ''}
                  onChange={(e) => setNewMed({...newMed, pharmacy: e.target.value})}
                  placeholder="Preferred pharmacy"
                />
              </div>
              <div>
                <Label htmlFor="stockLevel">Current Stock</Label>
                <Input
                  id="stockLevel"
                  type="number"
                  value={newMed.stockLevel || 0}
                  onChange={(e) => setNewMed({...newMed, stockLevel: parseInt(e.target.value)})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="gpApproved"
                  checked={newMed.isGPApproved || false}
                  onChange={(e) => setNewMed({...newMed, isGPApproved: e.target.checked})}
                />
                <Label htmlFor="gpApproved">GP Pre-approved for reorder</Label>
              </div>
              <Button onClick={addMedication} className="w-full">
                Add Medication
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Medications List */}
        {medications.map((med) => {
          const dosageStatus = getDosageStatus(med);
          const isOverdue = new Date() > med.nextDue && med.currentDaily < med.maxDaily;
          const isLowStock = med.stockLevel <= 3;
          
          return (
            <div key={med.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{med.name}</h3>
                  <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                  <p className="text-xs text-gray-500">Stock: {med.stockLevel} remaining</p>
                  {med.pharmacy && (
                    <p className="text-xs text-blue-600">Pharmacy: {med.pharmacy}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge className={dosageStatus.color}>
                    {dosageStatus.text}
                  </Badge>
                  {med.isGPApproved && (
                    <Badge className="bg-green-100 text-green-800">
                      GP Approved
                    </Badge>
                  )}
                  {isLowStock && (
                    <Badge className="bg-orange-100 text-orange-800">
                      Low Stock
                    </Badge>
                  )}
                  {isOverdue && (
                    <Badge className="bg-red-100 text-red-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Due
                    </Badge>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Daily Progress: {med.currentDaily}/{med.maxDaily}</span>
                  <span className="text-gray-500">
                    Next: {med.nextDue.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className={`h-2 rounded-full ${med.currentDaily >= med.maxDaily ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{width: `${Math.min((med.currentDaily / med.maxDaily) * 100, 100)}%`}}
                  />
                </div>
              </div>

              <div className="flex gap-2 mb-3 flex-wrap">
                <Button
                  onClick={() => takeMedication(med.id)}
                  disabled={med.currentDaily >= med.maxDaily}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Take Now
                </Button>
                {med.canReorder && (
                  <Button
                    onClick={() => reorderMedication(med.id)}
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-700"
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Reorder
                  </Button>
                )}
                {med.pharmacy && (
                  <Button
                    onClick={() => {
                      window.location.href = `tel:${med.pharmacy}`;
                      toast({
                        title: "Calling Pharmacy",
                        description: `Calling ${med.pharmacy}...`,
                        duration: 3000,
                      });
                    }}
                    variant="outline"
                    size="sm"
                    className="border-purple-500 text-purple-700"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call Pharmacy
                  </Button>
                )}
              </div>

              {/* Instructions and Side Effects */}
              {med.instructions && (
                <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                  <p className="text-blue-800 text-sm">{med.instructions}</p>
                </div>
              )}

              {med.sideEffects.length > 0 && (
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Side effects: </span>
                  {med.sideEffects.join(', ')}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {medications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No medications added yet</p>
            <p className="text-sm">Add or scan medications to start tracking</p>
          </div>
        )}

        {/* Safety Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Safety Reminders</h3>
          </div>
          <div className="text-yellow-700 text-sm space-y-1">
            <p>• Always check for allergies before taking new medication</p>
            <p>• Never exceed prescribed dosages</p>
            <p>• Keep medications in original containers</p>
            <p>• Report any unusual side effects immediately</p>
            <p>• Only reorder GP pre-approved medications</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationManager;
