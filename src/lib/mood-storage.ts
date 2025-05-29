
export interface MoodEntry {
  id: string;
  timestamp: string;
  moodCategory: string;
  description: string;
  intensity: number;
  source: {
    text: boolean;
    voice: boolean;
    face: boolean;
  };
  tags?: string[];
}

export const saveMoodEntry = (entry: MoodEntry): void => {
  try {
    const existingHistory = getMoodHistory();
    const newHistory = [...existingHistory, entry];
    localStorage.setItem('moodHistory', JSON.stringify(newHistory));
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('moodUpdated'));
  } catch (error) {
    console.error('Error saving mood entry:', error);
    throw new Error('Failed to save mood entry');
  }
};

export const getMoodHistory = (): MoodEntry[] => {
  try {
    const stored = localStorage.getItem('moodHistory');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading mood history:', error);
    return [];
  }
};

export const clearMoodHistory = (): void => {
  try {
    localStorage.removeItem('moodHistory');
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('moodUpdated'));
  } catch (error) {
    console.error('Error clearing mood history:', error);
    throw new Error('Failed to clear mood history');
  }
};

export const getMoodTrends = (days: number = 7): MoodEntry[] => {
  const history = getMoodHistory();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return history.filter(entry => 
    new Date(entry.timestamp) >= cutoffDate
  );
};
