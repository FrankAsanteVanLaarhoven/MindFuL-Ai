
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Medication, Allergy } from './medication/types';
import { checkAllergyConflict } from './medication/utils';
import AddMedicationDialog from './medication/AddMedicationDialog';
import AllergiesSection from './medication/AllergiesSection';
import MedicationCard from './medication/MedicationCard';
import ActionButtons from './medication/ActionButtons';

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
        const allergyConflict = checkAllergyConflict(med, allergies);

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

  const callPharmacy = (pharmacy: string) => {
    window.location.href = `tel:${pharmacy}`;
    toast({
      title: "Calling Pharmacy",
      description: `Calling ${pharmacy}...`,
      duration: 3000,
    });
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
          <ActionButtons
            onTakePhoto={takePhoto}
            onStartRecording={startRecording}
            onScanMedication={scanMedication}
            isTakingPhoto={isTakingPhoto}
            isRecording={isRecording}
            isScanning={isScanning}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Allergies Section */}
        <AllergiesSection
          allergies={allergies}
          isAddingAllergy={isAddingAllergy}
          onAddingAllergyChange={setIsAddingAllergy}
          newAllergy={newAllergy}
          setNewAllergy={setNewAllergy}
          onAddAllergy={addAllergy}
        />

        {/* Add Medication Dialog */}
        <AddMedicationDialog
          isOpen={isAddingMed}
          onOpenChange={setIsAddingMed}
          newMed={newMed}
          setNewMed={setNewMed}
          onAddMedication={addMedication}
        />

        {/* Medications List */}
        {medications.map((med) => (
          <MedicationCard
            key={med.id}
            medication={med}
            onTakeMedication={takeMedication}
            onReorderMedication={reorderMedication}
            onCallPharmacy={callPharmacy}
          />
        ))}

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
