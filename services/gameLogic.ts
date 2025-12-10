import { ChallengeState, DayLog, GameStats, DailyStats, TaskDefinition } from '../types';
import { DEFAULT_TASKS, XP_THRESHOLDS, INITIAL_HEARTS, CHALLENGE_DAYS } from '../constants';

// Helper to get task XP (considering potential overrides in future)
export const getTaskXP = (taskId: string, customXP: Record<string, number> = {}): number => {
  if (customXP[taskId] !== undefined) return customXP[taskId];
  const task = DEFAULT_TASKS.find(t => t.id === taskId);
  return task ? task.defaultXP : 0;
};

// Calculate XP for a single day
export const calculateDailyXP = (log: DayLog | undefined, customXP: Record<string, number>): number => {
  if (!log) return 0;
  return log.completedTaskIds.reduce((total, taskId) => {
    return total + getTaskXP(taskId, customXP);
  }, 0);
};

// Determine status based on XP
export const getDailyStatus = (xp: number): 'SUCCESS' | 'NEUTRAL' | 'FAILURE' => {
  if (xp >= XP_THRESHOLDS.SUCCESS) return 'SUCCESS';
  if (xp >= XP_THRESHOLDS.NEUTRAL) return 'NEUTRAL';
  return 'FAILURE';
};

// Generate a date range array
const getDatesInRange = (startDate: Date, endDate: Date): string[] => {
  const date = new Date(startDate.getTime());
  const dates = [];
  while (date <= endDate) {
    dates.push(date.toISOString().split('T')[0]);
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

// Main Engine Function
export const calculateGameStats = (state: ChallengeState): GameStats => {
  const today = new Date().toISOString().split('T')[0];
  const start = new Date(state.startDate);
  const now = new Date(); // Use current time
  
  // If start date is in future, return empty stats
  if (start > now) {
    return {
      currentStreak: 0,
      heartsRemaining: INITIAL_HEARTS,
      totalXP: 0,
      daysCompleted: 0,
      progressPercentage: 0,
      history: []
    };
  }

  // Generate all days from start to today (inclusive)
  // We stop at "yesterday" for strict failure calculation usually, 
  // but for a reactive app, we evaluate "today" dynamically.
  // However, "Hearts" are lost based on PAST days that were failures.
  // "Today" cannot be a failure yet until the day ends (or we assume checks happen live).
  // Strategy: Calculate stats for all days up to yesterday. Today is separate.
  
  const allDates = getDatesInRange(start, now);
  
  let heartsLost = 0;
  let currentStreak = 0;
  let totalXP = 0;
  let successDays = 0;
  const history: DailyStats[] = [];

  // Iterate chronologically
  allDates.forEach((dateStr) => {
    const isToday = dateStr === today;
    const log = state.logs[dateStr];
    const xp = calculateDailyXP(log, state.customXP);
    const status = getDailyStatus(xp);

    totalXP += xp;

    // Logic for History (Past Days)
    if (!isToday) {
      if (status === 'FAILURE') {
        heartsLost++;
        currentStreak = 0; // Reset streak on failure
      } else if (status === 'SUCCESS') {
        currentStreak++;
        successDays++;
      } else {
        // NEUTRAL: Keeps streak alive? 
        // Prompt says: "Streak increases only if XP >= 100. XP < 100 -> Streak resets to 0"
        // Prompt also says "XP < 70 -> Failure = 1 heart lost". 
        // So 70-99 is Neutral. 
        // Ambiguity: Does Neutral reset streak? 
        // Prompt: "XP < 100 -> Streak resets to 0". 
        // So NEUTRAL resets streak, but doesn't lose a heart.
        currentStreak = 0; 
      }
    } else {
      // Logic for Today (Live)
      // We display potential status. 
      // It contributes to Total XP immediately.
      // It contributes to streak visually if success, but doesn't finalize until tomorrow.
      // To make UI feel good: If today is success, show streak + 1.
      if (status === 'SUCCESS') {
        currentStreak++; 
        successDays++; // Count today as completed if success
      }
    }

    history.push({
      date: dateStr,
      totalXP: xp,
      status,
      isToday
    });
  });

  const heartsRemaining = Math.max(0, INITIAL_HEARTS - heartsLost);

  return {
    currentStreak,
    heartsRemaining,
    totalXP,
    daysCompleted: successDays, // Or just days passed? Prompt: "Days Completed (rollup)". Usually implies successful days.
    progressPercentage: Math.min(100, (allDates.length / CHALLENGE_DAYS) * 100),
    history
  };
};
