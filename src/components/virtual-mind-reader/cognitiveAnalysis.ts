
import { CognitiveAnalysis } from './types';

export const performCognitiveAnalysis = (text: string, tone?: string, profile?: any): CognitiveAnalysis => {
  const lowerText = text.toLowerCase();
  
  // Emotion detection
  let emotion = 'neutral';
  let confidence = 70;
  
  if (lowerText.includes('sad') || lowerText.includes('down') || lowerText.includes('depressed')) {
    emotion = 'sad';
    confidence = 85;
  } else if (lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('mad')) {
    emotion = 'angry';
    confidence = 80;
  } else if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('excited')) {
    emotion = 'happy';
    confidence = 90;
  } else if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('nervous')) {
    emotion = 'anxious';
    confidence = 88;
  }
  
  // Stress level analysis
  let stressLevel = 30;
  const stressWords = ['stress', 'pressure', 'overwhelm', 'chaos', 'deadline', 'urgent'];
  stressWords.forEach(word => {
    if (lowerText.includes(word)) stressLevel += 15;
  });
  stressLevel = Math.min(stressLevel, 100);
  
  // Cognitive load
  const complexWords = text.split(' ').filter(word => word.length > 8).length;
  let cognitiveLoad = Math.min(30 + (complexWords * 5), 100);
  
  // Engagement level
  const questionMarks = (text.match(/\?/g) || []).length;
  const exclamations = (text.match(/!/g) || []).length;
  const engagement = Math.min(50 + (questionMarks * 10) + (exclamations * 8), 100);
  
  // Voice tone influence
  if (tone) {
    if (tone === 'stressed') {
      stressLevel += 20;
      emotion = emotion === 'neutral' ? 'anxious' : emotion;
    } else if (tone === 'calm') {
      stressLevel = Math.max(stressLevel - 15, 0);
    }
  }
  
  // Profile-based adjustments
  if (profile) {
    if (profile.workStress === 'high') {
      stressLevel += 10;
    }
    if (profile.sleepQuality === 'poor') {
      cognitiveLoad += 15;
      stressLevel += 10;
    }
  }
  
  // Generate insights
  const insights = [];
  if (stressLevel > 70) {
    insights.push('High stress indicators detected in your communication patterns');
  }
  if (cognitiveLoad > 80) {
    insights.push('Complex thought patterns suggest mental fatigue');
  }
  if (engagement < 40) {
    insights.push('Low engagement may indicate disconnection or overwhelm');
  }
  if (emotion === 'anxious' && profile?.currentChallenges?.includes('anxiety')) {
    insights.push('Anxiety patterns align with your reported challenges');
  }
  
  // Generate recommendations
  const recommendations = [];
  if (stressLevel > 60) {
    recommendations.push('Consider a 5-minute breathing exercise');
    recommendations.push('Try progressive muscle relaxation');
  }
  if (cognitiveLoad > 70) {
    recommendations.push('Take a mental break with some light stretching');
    recommendations.push('Practice mindfulness meditation');
  }
  if (emotion === 'sad') {
    recommendations.push('Gentle self-compassion exercises might help');
    recommendations.push('Consider talking to a supportive friend');
  }
  
  return {
    emotion,
    confidence,
    stressLevel: Math.max(0, Math.min(100, stressLevel)),
    cognitiveLoad: Math.max(0, Math.min(100, cognitiveLoad)),
    engagement: Math.max(0, Math.min(100, engagement)),
    insights,
    recommendations
  };
};
