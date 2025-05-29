
interface BreathingSession {
  id: string;
  date: string;
  duration: number; // in minutes
  technique: string;
  timestamp: number;
}

interface BreathingStats {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalMinutes: number;
  dailyGoal: number;
  todaySessions: number;
  thisWeekSessions: number;
  lastSessionDate: string;
}

export const getBreathingStats = (): BreathingStats => {
  try {
    const stored = localStorage.getItem('breathingStats');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading breathing stats:', error);
  }
  
  return {
    currentStreak: 0,
    longestStreak: 0,
    totalSessions: 0,
    totalMinutes: 0,
    dailyGoal: 3,
    todaySessions: 0,
    thisWeekSessions: 0,
    lastSessionDate: ''
  };
};

export const saveBreathingStats = (stats: BreathingStats): void => {
  try {
    localStorage.setItem('breathingStats', JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving breathing stats:', error);
  }
};

export const addBreathingSession = (duration: number, technique: string): void => {
  const session: BreathingSession = {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    duration,
    technique,
    timestamp: Date.now()
  };

  // Save session
  const sessions = getBreathingSessions();
  sessions.push(session);
  localStorage.setItem('breathingSessions', JSON.stringify(sessions));

  // Update stats
  updateBreathingStats(session);
};

const getBreathingSessions = (): BreathingSession[] => {
  try {
    const stored = localStorage.getItem('breathingSessions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading breathing sessions:', error);
    return [];
  }
};

const updateBreathingStats = (session: BreathingSession): void => {
  const stats = getBreathingStats();
  const today = new Date().toISOString().split('T')[0];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().split('T')[0];

  // Update totals
  stats.totalSessions += 1;
  stats.totalMinutes += session.duration;

  // Update today's sessions
  if (session.date === today) {
    stats.todaySessions += 1;
  }

  // Update this week's sessions
  if (session.date >= weekStartStr) {
    stats.thisWeekSessions += 1;
  }

  // Update streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (session.date === today) {
    if (stats.lastSessionDate === yesterdayStr || stats.lastSessionDate === today || stats.lastSessionDate === '') {
      stats.currentStreak += (stats.lastSessionDate !== today) ? 1 : 0;
    } else {
      stats.currentStreak = 1;
    }
  }

  if (stats.currentStreak > stats.longestStreak) {
    stats.longestStreak = stats.currentStreak;
  }

  stats.lastSessionDate = session.date;
  saveBreathingStats(stats);
};

export const resetDailyStats = (): void => {
  const stats = getBreathingStats();
  const today = new Date().toISOString().split('T')[0];
  
  if (stats.lastSessionDate !== today) {
    stats.todaySessions = 0;
    saveBreathingStats(stats);
  }
};
