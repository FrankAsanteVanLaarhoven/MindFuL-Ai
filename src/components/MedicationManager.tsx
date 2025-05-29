
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pill, Clock, AlertTriangle, Camera, Plus, Bell, CheckCircle, XCircle, Scan } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      isActive: true
    }
  ]);
  const [isAddingMed, setIsAddingMed] = useState(false);
  const [newMed, setNewMed] = useState<Partial<Medication>>({});
  const [isScanning, setIsScanning] = useState(false);
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

        const newDaily = med.currentDaily + 1;
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
          nextDue
        };
      }
      return med;
    }));
  };

  const scanMedication = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      
      // Simulate scanned medication data
      const scannedMed = {
        name: 'Ibuprofen',
        dosage: '200mg',
        ingredients: ['Ibuprofen', 'Lactose', 'Starch'],
        sideEffects: ['Stomach upset', 'Dizziness'],
        instructions: 'Take with food. Do not exceed 6 tablets in 24 hours.'
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
      isActive: true
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

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-purple-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Pill className="w-5 h-5" />
              Medication Manager
            </CardTitle>
            <CardDescription>
              Smart medication tracking with dosage monitoring and reminders
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={scanMedication}
              variant="outline"
              className="border-purple-500 text-purple-700"
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Scan className="w-4 h-4 mr-2 animate-pulse" />
                  Scanning...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  Scan Med
                </>
              )}
            </Button>
            <Dialog open={isAddingMed} onOpenChange={setIsAddingMed}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Med
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
                    <Label htmlFor="maxDaily">Max Daily Doses</Label>
                    <Input
                      id="maxDaily"
                      type="number"
                      value={newMed.maxDaily || 1}
                      onChange={(e) => setNewMed({...newMed, maxDaily: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={newMed.instructions || ''}
                      onChange={(e) => setNewMed({...newMed, instructions: e.target.value})}
                      placeholder="Special instructions..."
                    />
                  </div>
                  <Button onClick={addMedication} className="w-full">
                    Add Medication
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {medications.map((med) => {
          const dosageStatus = getDosageStatus(med);
          const isOverdue = new Date() > med.nextDue && med.currentDaily < med.maxDaily;
          
          return (
            <div key={med.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{med.name}</h3>
                  <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                  {med.prescribedBy && (
                    <p className="text-xs text-gray-500">Prescribed by {med.prescribedBy}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Badge className={dosageStatus.color}>
                    {dosageStatus.text}
                  </Badge>
                  {isOverdue && (
                    <Badge className="bg-red-100 text-red-800">
                      <Clock className="w-3 h-3 mr-1" />
                      Due
                    </Badge>
                  )}
                </div>
              </div>

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

              <div className="flex gap-2 mb-3">
                <Button
                  onClick={() => takeMedication(med.id)}
                  disabled={med.currentDaily >= med.maxDaily}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Take Now
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Reminder Set",
                      description: `You'll be reminded to take ${med.name} at the next scheduled time`,
                      duration: 3000,
                    });
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Bell className="w-3 h-3 mr-1" />
                  Remind Me
                </Button>
              </div>

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
            <p>• Never exceed prescribed dosages</p>
            <p>• Always consult your doctor before stopping medication</p>
            <p>• Report any unusual side effects immediately</p>
            <p>• Keep medications in original containers</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationManager;
