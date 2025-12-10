import React from 'react';
import { NeonButton, Card } from '../components/ui';
import { Trash2, Save, Download } from 'lucide-react';

interface SettingsViewProps {
  onReset: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onReset }) => {
  const handleReset = () => {
    if (confirm("Are you sure? This will wipe all progress and return you to Day 1.")) {
      onReset();
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <h2 className="text-2xl font-bold text-white">System Settings</h2>

      <Card>
        <h3 className="font-bold text-white mb-4">Danger Zone</h3>
        <p className="text-slate-400 text-sm mb-4">
          Resetting the challenge will restore hearts to 3 and clear all mission history.
        </p>
        <NeonButton variant="danger" onClick={handleReset} className="w-full flex justify-center items-center space-x-2">
          <Trash2 className="w-4 h-4" />
          <span>Reset Protocol</span>
        </NeonButton>
      </Card>

      <Card>
        <h3 className="font-bold text-white mb-4">Data Management</h3>
         <NeonButton variant="blue" onClick={() => alert("Data export feature coming soon.")} className="w-full flex justify-center items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Data (JSON)</span>
        </NeonButton>
      </Card>

      <div className="text-center text-slate-600 text-xs mt-8">
        21Hard XP v1.0.0<br/>
        Stay Hard.
      </div>
    </div>
  );
};
