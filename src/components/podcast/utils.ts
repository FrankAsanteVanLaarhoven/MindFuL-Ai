
export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'mental-health': return 'bg-blue-100 text-blue-800';
    case 'meditation': return 'bg-green-100 text-green-800';
    case 'therapy': return 'bg-purple-100 text-purple-800';
    case 'wellness': return 'bg-orange-100 text-orange-800';
    case 'self-help': return 'bg-pink-100 text-pink-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
