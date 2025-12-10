import React, { useState } from 'react';
import { TaskDefinition, Category, DayLog } from '../types';
import { DEFAULT_TASKS } from '../constants';
import { Check, Circle } from 'lucide-react';

interface MissionsViewProps {
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({ completedTaskIds, onToggleTask }) => {
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const handleToggle = (task: TaskDefinition) => {
    const isCompleting = !completedTaskIds.includes(task.id);
    if (isCompleting) {
      setAnimatingId(task.id);
      setTimeout(() => setAnimatingId(null), 1000);
    }
    onToggleTask(task.id);
  };

  const categories = [Category.FINANCE, Category.MIND, Category.BODY];

  const renderCategory = (cat: Category) => {
    const tasks = DEFAULT_TASKS.filter(t => t.category === cat);
    // Sort completed to bottom
    tasks.sort((a, b) => {
        const aC = completedTaskIds.includes(a.id);
        const bC = completedTaskIds.includes(b.id);
        return aC === bC ? 0 : aC ? 1 : -1;
    });

    return (
      <div key={cat} className="mb-8">
        <h3 className="text-cyan-400 font-bold tracking-widest uppercase text-xs mb-3 pl-1 border-l-2 border-cyan-500 ml-1">
          {cat} Protocol
        </h3>
        <div className="space-y-3">
          {tasks.map(task => {
            const isCompleted = completedTaskIds.includes(task.id);
            return (
              <div 
                key={task.id}
                onClick={() => handleToggle(task)}
                className={`
                  relative overflow-hidden group cursor-pointer
                  rounded-xl p-4 border transition-all duration-300
                  ${isCompleted 
                    ? 'bg-slate-900/50 border-slate-800 opacity-60' 
                    : 'bg-slate-900 border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800'
                  }
                `}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-4">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center border transition-all
                      ${isCompleted ? 'bg-lime-500 border-lime-500' : 'border-slate-500 group-hover:border-cyan-400'}
                    `}>
                      {isCompleted ? <Check className="w-4 h-4 text-slate-900" /> : <Circle className="w-4 h-4 text-transparent" />}
                    </div>
                    <span className={`font-medium ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {task.title}
                    </span>
                  </div>
                  <span className={`
                    text-xs font-bold px-2 py-1 rounded bg-slate-950 border border-slate-800
                    ${isCompleted ? 'text-slate-600' : 'text-cyan-400'}
                  `}>
                    +{task.defaultXP} XP
                  </span>
                </div>

                {/* +XP Floating Animation */}
                {animatingId === task.id && (
                  <div className="absolute right-12 top-2 pointer-events-none animate-bounce text-lime-400 font-bold text-lg z-20">
                    +{task.defaultXP}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-24 px-1">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Daily Missions</h2>
        <p className="text-slate-400 text-sm">Execute tasks to earn XP and stay alive.</p>
      </div>
      {categories.map(renderCategory)}
    </div>
  );
};
