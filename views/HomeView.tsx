import React from 'react';
import { GameStats, DailyStats } from '../types';
import { Card, NeonButton, ProgressBar } from '../components/ui';
import { Flame, Heart, Zap, Trophy, ArrowRight } from 'lucide-react';
import { XP_THRESHOLDS, CHALLENGE_DAYS } from '../constants';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface HomeViewProps {
  stats: GameStats;
  todayStats: DailyStats;
  onNavigate: (screen: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ stats, todayStats, onNavigate }) => {
  const xpProgress = (todayStats.totalXP / XP_THRESHOLDS.SUCCESS) * 100;
  
  const hearts = Array.from({ length: 3 }).map((_, i) => i < stats.heartsRemaining);

  const pieData = [
    { name: 'Completed', value: todayStats.totalXP },
    { name: 'Remaining', value: Math.max(0, XP_THRESHOLDS.SUCCESS - todayStats.totalXP) }
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Header Stats */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Flame className={`w-8 h-8 ${stats.currentStreak > 0 ? 'text-orange-500 fill-orange-500 animate-pulse' : 'text-slate-600'}`} />
            <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full px-1 text-[10px] font-bold border border-slate-700">
              {stats.currentStreak}
            </div>
          </div>
          <span className="text-sm font-medium text-slate-400">Day Streak</span>
        </div>

        <div className="flex space-x-1">
          {hearts.map((alive, idx) => (
            <Heart 
              key={idx} 
              className={`w-6 h-6 transition-colors ${alive ? 'text-rose-500 fill-rose-500' : 'text-slate-700'}`} 
            />
          ))}
        </div>
      </div>

      {/* Main XP Ring */}
      <div className="flex flex-col items-center justify-center py-4 relative">
        <div className="w-64 h-64 relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                  paddingAngle={5}
                >
                  <Cell key="cell-0" fill="#22d3ee" className="drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  <Cell key="cell-1" fill="#1e293b" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-5xl font-bold text-white tracking-tighter neon-text-blue">
                {todayStats.totalXP}
              </span>
              <span className="text-slate-400 text-sm font-medium uppercase tracking-widest mt-2">XP Today</span>
            </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex justify-center">
        <div className={`
          px-4 py-2 rounded-full border flex items-center space-x-2
          ${todayStats.totalXP >= 100 ? 'border-lime-500 bg-lime-500/10 text-lime-400' : 
            todayStats.totalXP >= 70 ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400' : 
            'border-rose-500 bg-rose-500/10 text-rose-400'}
        `}>
          {todayStats.totalXP >= 100 ? <Trophy className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          <span className="font-bold text-sm">
             {todayStats.totalXP >= 100 ? 'MISSION ACCOMPLISHED' : 
              todayStats.totalXP >= 70 ? 'SAFE ZONE' : 'DANGER ZONE'}
          </span>
        </div>
      </div>

      {/* Call to Action */}
      <NeonButton onClick={() => onNavigate('missions')} className="w-full flex items-center justify-center space-x-2">
        <span>Start Today's Missions</span>
        <ArrowRight className="w-5 h-5" />
      </NeonButton>

      {/* Challenge Progress */}
      <Card>
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-sm">21 Day Challenge</span>
          <span className="text-cyan-400 font-mono font-bold">{(stats.progressPercentage).toFixed(0)}%</span>
        </div>
        <ProgressBar value={stats.progressPercentage} max={100} color="bg-lime-400" />
        <div className="mt-2 text-right text-xs text-slate-500">
           Day {Math.min(CHALLENGE_DAYS, stats.history.length)} of {CHALLENGE_DAYS}
        </div>
      </Card>
    </div>
  );
};
