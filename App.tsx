import React, { useState, useEffect } from 'react';
import { Home, List, BarChart2, Settings } from 'lucide-react';
import { ChallengeState, DayLog, GameStats } from './types';
import { calculateGameStats } from './services/gameLogic';
import { INITIAL_HEARTS } from './constants';
import { HomeView } from './views/HomeView';
import { MissionsView } from './views/MissionsView';
import { DashboardView } from './views/DashboardView';
import { SettingsView } from './views/SettingsView';

// Helper to get today's date key YYYY-MM-DD
const getTodayKey = () => new Date().toISOString().split('T')[0];

const INITIAL_STATE: ChallengeState = {
  startDate: new Date().toISOString(),
  logs: {},
  customXP: {}
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'missions' | 'dashboard' | 'settings'>('home');
  const [challengeState, setChallengeState] = useState<ChallengeState>(INITIAL_STATE);
  const [stats, setStats] = useState<GameStats>({
    currentStreak: 0,
    heartsRemaining: INITIAL_HEARTS,
    totalXP: 0,
    daysCompleted: 0,
    progressPercentage: 0,
    history: []
  });

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('21hard_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChallengeState(parsed);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  // Save and Recalculate whenever state changes
  useEffect(() => {
    localStorage.setItem('21hard_state', JSON.stringify(challengeState));
    const newStats = calculateGameStats(challengeState);
    setStats(newStats);
  }, [challengeState]);

  const handleToggleTask = (taskId: string) => {
    const today = getTodayKey();
    const currentLog = challengeState.logs[today] || { date: today, completedTaskIds: [] };
    
    const isCompleted = currentLog.completedTaskIds.includes(taskId);
    let newCompletedIds;
    if (isCompleted) {
      newCompletedIds = currentLog.completedTaskIds.filter(id => id !== taskId);
    } else {
      newCompletedIds = [...currentLog.completedTaskIds, taskId];
    }

    setChallengeState(prev => ({
      ...prev,
      logs: {
        ...prev.logs,
        [today]: {
          ...currentLog,
          completedTaskIds: newCompletedIds
        }
      }
    }));
  };

  const handleReset = () => {
    const newState = {
      ...INITIAL_STATE,
      startDate: new Date().toISOString()
    };
    setChallengeState(newState);
    setActiveTab('home');
  };

  const handleNavigate = (screen: string) => {
    setActiveTab(screen as 'home' | 'missions' | 'dashboard' | 'settings');
  };

  const todayStats = stats.history.find(h => h.isToday) || {
    date: getTodayKey(),
    totalXP: 0,
    status: 'NEUTRAL', // Default start
    isToday: true
  };

  // Check for game over
  if (stats.heartsRemaining === 0 && activeTab !== 'settings') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 text-center space-y-6">
        <h1 className="text-4xl font-bold text-rose-500 mb-4">GAME OVER</h1>
        <p className="text-slate-400">You ran out of hearts. The protocol requires consistency.</p>
        <button 
          onClick={handleReset}
          className="bg-rose-600 hover:bg-rose-500 px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(225,29,72,0.5)] transition-all"
        >
          Restart Challenge
        </button>
      </div>
    );
  }

  const renderScreen = () => {
    switch(activeTab) {
      case 'home': return <HomeView stats={stats} todayStats={todayStats} onNavigate={handleNavigate} />;
      case 'missions': return <MissionsView completedTaskIds={challengeState.logs[getTodayKey()]?.completedTaskIds || []} onToggleTask={handleToggleTask} />;
      case 'dashboard': return <DashboardView stats={stats} />;
      case 'settings': return <SettingsView onReset={handleReset} />;
      default: return <HomeView stats={stats} todayStats={todayStats} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30">
      <main className="container mx-auto max-w-md min-h-screen p-4 pb-0 relative">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-4 mb-2">
          <h1 className="text-xl font-bold tracking-tighter italic">
            21<span className="text-cyan-400">HARD</span>
          </h1>
          <div className="text-xs font-mono text-slate-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Dynamic Screen Content */}
        <div className="animate-fade-in">
           {renderScreen()}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 safe-area-bottom z-50">
          <div className="container mx-auto max-w-md flex justify-around items-center p-4">
            <NavButton icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavButton icon={<List />} label="Missions" active={activeTab === 'missions'} onClick={() => setActiveTab('missions')} />
            <NavButton icon={<BarChart2 />} label="Dash" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <NavButton icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </div>
        </div>
      </main>
    </div>
  );
};

const NavButton: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center space-y-1 transition-colors ${active ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;