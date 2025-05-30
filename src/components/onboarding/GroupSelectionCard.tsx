
import React from 'react';
import { UserGroup } from '../../types/UserSegmentation';

interface GroupSelectionCardProps {
  group: UserGroup;
  isSelected: boolean;
  onSelect: (groupId: string) => void;
}

const GroupSelectionCard: React.FC<GroupSelectionCardProps> = ({
  group,
  isSelected,
  onSelect
}) => {
  return (
    <div
      onClick={() => onSelect(group.id)}
      className={`
        cursor-pointer rounded-xl p-6 border-2 transition-all duration-300
        ${isSelected 
          ? `${group.color} border-white text-white shadow-lg transform scale-105` 
          : 'bg-white/90 border-white/40 hover:border-white/60 hover:shadow-md text-gray-800'
        }
      `}
    >
      <div className="text-center">
        <div className="text-4xl mb-3">{group.icon}</div>
        <h3 className="text-lg font-semibold mb-2">{group.displayName}</h3>
        <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
          {group.description}
        </p>
        
        <div className="mt-4">
          <div className={`text-xs font-medium ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
            Community: {group.communityName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSelectionCard;
