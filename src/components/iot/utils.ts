
import {
  Smartphone, 
  Watch, 
  Activity, 
  Heart, 
  Thermometer, 
  Moon, 
  Settings,
  Brain,
  Droplets,
  TrendingUp
} from 'lucide-react';
import { Device, HealthMetric } from './types';

export const getDeviceIcon = (type: Device['type']) => {
  switch (type) {
    case 'smartwatch':
      return Watch;
    case 'fitness_tracker':
      return Activity;
    case 'phone':
      return Smartphone;
    case 'sleep_tracker':
      return Moon;
    case 'heart_monitor':
      return Heart;
    case 'glucose_monitor':
      return Droplets;
    case 'bp_monitor':
      return TrendingUp;
    default:
      return Settings;
  }
};

export const getMetricIcon = (type: HealthMetric['type']) => {
  switch (type) {
    case 'heart_rate':
      return { icon: Heart, color: 'text-red-500' };
    case 'steps':
      return { icon: Activity, color: 'text-blue-500' };
    case 'sleep':
      return { icon: Moon, color: 'text-purple-500' };
    case 'stress':
      return { icon: Thermometer, color: 'text-orange-500' };
    case 'temperature':
      return { icon: Thermometer, color: 'text-green-500' };
    case 'blood_pressure':
      return { icon: TrendingUp, color: 'text-indigo-500' };
    case 'glucose':
      return { icon: Droplets, color: 'text-blue-600' };
    case 'headache_intensity':
      return { icon: Brain, color: 'text-red-600' };
    default:
      return { icon: Activity, color: 'text-gray-500' };
  }
};

export const getStatusColor = (status?: string) => {
  switch (status) {
    case 'normal': return 'text-green-600 bg-green-100';
    case 'warning': return 'text-yellow-600 bg-yellow-100';
    case 'critical': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
