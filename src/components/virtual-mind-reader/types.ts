
export interface CognitiveAnalysis {
  emotion: string;
  confidence: number;
  stressLevel: number;
  cognitiveLoad: number;
  engagement: number;
  insights: string[];
  recommendations: string[];
}

export interface VirtualMindReaderProps {
  userProfile?: any;
  currentText?: string;
  voiceTone?: string;
  onThoughtRecommendation?: (thought: string) => void;
}
