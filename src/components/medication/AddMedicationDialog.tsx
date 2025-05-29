
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Medication } from './types';

interface AddMedicationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newMed: Partial<Medication>;
  setNewMed: (med: Partial<Medication>) => void;
  onAddMedication: () => void;
}

const AddMedicationDialog: React.FC<AddMedicationDialogProps> = ({
  isOpen,
  onOpenChange,
  newMed,
  setNewMed,
  onAddMedication
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button onClick={onAddMedication} className="w-full">
            Add Medication
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicationDialog;
