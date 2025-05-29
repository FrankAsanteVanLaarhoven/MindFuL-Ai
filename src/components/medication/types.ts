
export interface Allergy {
  id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  symptoms: string[];
  medications: string[];
}

export interface Medication {
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
