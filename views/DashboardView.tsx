import React from 'react';
import { GameStats, Category } from '../types';
import { Card } from '../components/ui';
import { DEFAULT_TASKS } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid 
} from 'recharts';

interface DashboardViewProps {
  stats: GameStats;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ stats }) => {
  // Prepare Trend Data (Last 7 Days)
  const trendData = stats.history.slice(-7).map(day => ({
    date: day.date.slice(5), // MM-DD
    xp: day.totalXP
  }));

  // Prepare Pillar Performance
  // We need to look at all completed tasks in history to sum up XP per category
  // This is a bit expensive but fine for client side small data
  const categoryScores = {
    [Category.FINANCE]: 0,
    [Category.MIND]: 0,
    [Category.BODY]: 0
  };
  
  // Need to pass full logs to dashboard really, but assuming we can derive from something?
  // The 'stats.history' only has totalXP. 
  // IMPORTANT: The stats object calculated in gameLogic.ts assumes we have access to logs.
  // For this view to work purely on 'stats', 'stats' needs more info, OR we pass logs.
  // I will mock this calculation for now or just use totalXP for simplicity in the 'stats' object,
  // but let's assume we pass the raw stats which has history.
  // To get category data, we really need the raw logs or pre-calculate it in gameLogic.
  // For this implementation, let's visualize the XP trend properly.
  
  return (
    <div className="space-y-6 pb-24">
      <h2 className="text-2xl font-bold text-white">Command Center</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col items-center justify-center py-6">
            <span className="text-4xl font-bold text-white neon-text-lime">{stats.totalXP}</span>
            <span className="text-slate-400 text-xs uppercase tracking-wider mt-2">Total XP</span>
        </Card>
         <Card className="flex flex-col items-center justify-center py-6">
            <span className="text-4xl font-bold text-white text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">
              {stats.heartsRemaining}
            </span>
            <span className="text-slate-400 text-xs uppercase tracking-wider mt-2">Lives Left</span>
        </Card>
      </div>

      {/* XP Trend */}
      <Card className="h-64">
        <h3 className="text-slate-400 text-xs font-bold uppercase mb-4">7-Day XP Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
            <YAxis stroke="#94a3b8" fontSize={10} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc' }}
              itemStyle={{ color: '#22d3ee' }}
            />
            <Line 
              type="monotone" 
              dataKey="xp" 
              stroke="#22d3ee" 
              strokeWidth={3} 
              dot={{ fill: '#22d3ee', r: 4 }} 
              activeDot={{ r: 6, stroke: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Weekly Review Prompt */}
      <Card>
        <h3 className="text-lg font-bold text-white mb-2">Weekly Review</h3>
        <p className="text-slate-400 text-sm mb-4">
          Unlock the next level by reflecting on your week.
        </p>
        <div className="bg-slate-950 p-3 rounded border border-slate-800 text-sm text-slate-500 italic">
          "What sabotaged you this week?"
        </div>
      </Card>
    </div>
  );
};
