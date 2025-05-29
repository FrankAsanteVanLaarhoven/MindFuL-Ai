
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Heart } from 'lucide-react';
import { Allergy } from './types';
import { getSeverityColor } from './utils';

interface AllergiesSectionProps {
  allergies: Allergy[];
  isAddingAllergy: boolean;
  onAddingAllergyChange: (open: boolean) => void;
  newAllergy: Partial<Allergy>;
  setNewAllergy: (allergy: Partial<Allergy>) => void;
  onAddAllergy: () => void;
}

const AllergiesSection: React.FC<AllergiesSectionProps> = ({
  allergies,
  isAddingAllergy,
  onAddingAllergyChange,
  newAllergy,
  setNewAllergy,
  onAddAllergy
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-red-800 flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Known Allergies
        </h3>
        <Dialog open={isAddingAllergy} onOpenChange={onAddingAllergyChange}>
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
              <Button onClick={onAddAllergy} className="w-full bg-red-600 hover:bg-red-700">
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
  );
};

export default AllergiesSection;
