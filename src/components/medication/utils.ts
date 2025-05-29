
import { Medication, Allergy } from './types';

export const getDosageStatus = (med: Medication) => {
  const ratio = med.currentDaily / med.maxDaily;
  if (ratio >= 1) return { color: 'bg-red-100 text-red-800', text: 'Limit Reached' };
  if (ratio >= 0.8) return { color: 'bg-yellow-100 text-yellow-800', text: 'Near Limit' };
  return { color: 'bg-green-100 text-green-800', text: 'Safe' };
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'severe': return 'bg-red-100 text-red-800';
    case 'moderate': return 'bg-yellow-100 text-yellow-800';
    case 'mild': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const checkAllergyConflict = (medication: Medication, allergies: Allergy[]) => {
  return allergies.find(allergy => 
    medication.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(allergy.allergen.toLowerCase())
    )
  );
};
