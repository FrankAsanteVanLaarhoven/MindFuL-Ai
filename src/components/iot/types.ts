
export interface Device {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_tracker' | 'phone' | 'sleep_tracker' | 'heart_monitor' | 'glucose_monitor' | 'bp_monitor';
  connected: boolean;
  battery?: number;
  lastSync: string;
}

export interface HealthMetric {
  type: 'heart_rate' | 'steps' | 'sleep' | 'stress' | 'temperature' | 'blood_pressure' | 'glucose' | 'headache_intensity';
  value: number | string;
  unit: string;
  timestamp: string;
  deviceId: string;
  normalRange?: string;
  status?: 'normal' | 'warning' | 'critical';
}

export interface SymptomPrediction {
  id: string;
  condition: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  triggers: string[];
  recommendations: string[];
  timestamp: string;
}
