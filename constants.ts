import { Category, TaskDefinition } from './types';

export const INITIAL_HEARTS = 3;
export const CHALLENGE_DAYS = 21;

export const DEFAULT_TASKS: TaskDefinition[] = [
  // Finance
  { id: 'deep_work', title: 'Deep Work (2h)', category: Category.FINANCE, defaultXP: 30 },
  { id: 'deliverable', title: 'Ship One Deliverable', category: Category.FINANCE, defaultXP: 20 },
  { id: 'no_spend', title: 'No Unnecessary Spend', category: Category.FINANCE, defaultXP: 10 },
  { id: 'finance_track', title: 'Track Finances', category: Category.FINANCE, defaultXP: 10 },
  
  // Mind
  { id: 'no_tobacco', title: 'No Tobacco/Nicotine', category: Category.MIND, defaultXP: 50 },
  { id: 'mindfulness', title: 'Mindfulness (10m)', category: Category.MIND, defaultXP: 10 },
  { id: 'no_scroll', title: 'No AM Scroll', category: Category.MIND, defaultXP: 10 },
  { id: 'read', title: 'Read (10 pages)', category: Category.MIND, defaultXP: 10 },
  
  // Body
  { id: 'water', title: 'Water (3L)', category: Category.BODY, defaultXP: 10 },
  { id: 'walk', title: 'Walk (Outside)', category: Category.BODY, defaultXP: 10 },
  { id: 'sleep', title: 'Sleep (7h+)', category: Category.BODY, defaultXP: 20 },
  { id: 'workout', title: 'Workout', category: Category.BODY, defaultXP: 15 },
];

export const XP_THRESHOLDS = {
  SUCCESS: 100,
  NEUTRAL: 70
};
