export enum Category {
  FINANCE = 'Finance',
  MIND = 'Mind',
  BODY = 'Body'
}

export interface TaskDefinition {
  id: string;
  title: string;
  category: Category;
  defaultXP: number;
}

export interface DayLog {
  date: string; // ISO Date string YYYY-MM-DD
  completedTaskIds: string[];
  notes?: string;
  review?: {
    leverage?: string;
    sabotage?: string;
    friction?: string;
    focus?: string;
  };
}

export interface ChallengeState {
  startDate: string;
  logs: Record<string, DayLog>; // Keyed by date YYYY-MM-DD
  customXP: Record<string, number>; // Allow overriding XP values
}

export interface DailyStats {
  date: string;
  totalXP: number;
  status: 'SUCCESS' | 'NEUTRAL' | 'FAILURE';
  isToday: boolean;
}

export interface GameStats {
  currentStreak: number;
  heartsRemaining: number;
  totalXP: number;
  daysCompleted: number;
  progressPercentage: number;
  history: DailyStats[];
}
