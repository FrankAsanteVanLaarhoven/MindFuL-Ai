
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, ShoppingCart, Phone } from 'lucide-react';
import { Medication } from './types';
import { getDosageStatus } from './utils';

interface MedicationCardProps {
  medication: Medication;
  onTakeMedication: (medId: string) => void;
  onReorderMedication: (medId: string) => void;
  onCallPharmacy: (pharmacy: string) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({
  medication: med,
  onTakeMedication,
  onReorderMedication,
  onCallPharmacy
}) => {
  const dosageStatus = getDosageStatus(med);
  const isOverdue = new Date() > med.nextDue && med.currentDaily < med.maxDaily;
  const isLowStock = med.stockLevel <= 3;

  return (
    <div className="border border-gray-200 rounded-lg p-4">
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
          onClick={() => onTakeMedication(med.id)}
          disabled={med.currentDaily >= med.maxDaily}
          className="bg-green-600 hover:bg-green-700 text-white"
          size="sm"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Take Now
        </Button>
        {med.canReorder && (
          <Button
            onClick={() => onReorderMedication(med.id)}
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
            onClick={() => onCallPharmacy(med.pharmacy)}
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
};

export default MedicationCard;
